import { prisma } from './db.js';
import { disconnect } from './db.js';
import { createReadStream } from 'fs';
import { parse } from 'csv-parse';
import fs from 'fs';
import path from 'path';
import { promisify } from 'util';
import { pipeline as pipelineCallback } from 'stream';
import { z } from 'zod';

// Promisify the pipeline function
const pipeline = promisify(pipelineCallback);

// CSV URL from the development plan
const EARTHQUAKE_CSV_URL =
  'https://data.humdata.org/dataset/4881d82b-ba63-4515-b748-c364f3d05b42/resource/10ac8776-5141-494b-b3cd-bf7764b2f964/download/earthquakes1970-2014.csv';
const CSV_LOCAL_PATH = path.join(process.cwd(), 'data', 'earthquakes.csv');

// Validation schema for CSV row data
const EarthquakeRowSchema = z.object({
  DateTime: z.string().transform((val) => new Date(val)),
  Latitude: z.coerce.number(),
  Longitude: z.coerce.number(),
  Magnitude: z.coerce.number().positive(),
});

// Raw type for CSV data before validation
type EarthquakeRowRaw = {
  DateTime: string;
  Latitude: string;
  Longitude: string;
  Magnitude: string;
  [key: string]: string; // Allow for other columns in the CSV
};

// Sample earthquake data for fallback if CSV import fails
const sampleEarthquakes = [
  {
    location: 'Ohara, Japan',
    magnitude: 6.2,
    date: new Date('2025-02-15T05:23:45.000Z'),
  },
  {
    location: 'San Francisco, California',
    magnitude: 5.8,
    date: new Date('2025-02-10T18:12:30.000Z'),
  },
  {
    location: 'Mexico City, Mexico',
    magnitude: 7.5,
    date: new Date('2025-01-25T12:35:22.000Z'),
  },
  {
    location: 'Lisbon, Portugal',
    magnitude: 4.9,
    date: new Date('2025-03-05T08:45:12.000Z'),
  },
  {
    location: 'Wellington, New Zealand',
    magnitude: 5.5,
    date: new Date('2025-01-30T15:22:08.000Z'),
  },
];

/**
 * Downloads the earthquake CSV file from the source URL
 */
async function downloadCsv(): Promise<string> {
  // Ensure the data directory exists
  const dataDir = path.dirname(CSV_LOCAL_PATH);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  console.log(`🌐 Downloading CSV from: ${EARTHQUAKE_CSV_URL}`);

  try {
    // Using the Node.js native fetch API
    const response = await fetch(EARTHQUAKE_CSV_URL);

    if (!response.ok) {
      throw new Error(`Failed to download CSV: ${response.statusText}`);
    }

    // Save the downloaded CSV directly to file
    const fileStream = fs.createWriteStream(CSV_LOCAL_PATH);
    const body = response.body;

    if (!body) {
      throw new Error('Response body is null or undefined');
    }

    // Pipe the response to the file
    await pipeline(body, fileStream);
    console.log(`✅ CSV downloaded to ${CSV_LOCAL_PATH}`);

    return CSV_LOCAL_PATH;
  } catch (error) {
    console.error('❌ Error downloading CSV:', error);
    throw error;
  }
}

/**
 * Parses the CSV file and returns validated earthquake data
 */
async function parseCsvFile(
  filePath: string
): Promise<{ location: string; magnitude: number; date: Date }[]> {
  console.log(`📊 Parsing CSV file: ${filePath}`);

  const earthquakes: { location: string; magnitude: number; date: Date }[] = [];
  const errors: { line: number; error: string }[] = [];

  return new Promise((resolve, reject) => {
    createReadStream(filePath)
      .pipe(
        parse({
          columns: true,
          skip_empty_lines: true,
          trim: true,
        })
      )
      .on('data', (row: EarthquakeRowRaw) => {
        try {
          // Validate and transform the row data
          const validatedRow = EarthquakeRowSchema.parse(row);

          earthquakes.push({
            location: `${validatedRow.Latitude}, ${validatedRow.Longitude}`,
            magnitude: validatedRow.Magnitude,
            date: validatedRow.DateTime,
          });
        } catch (error) {
          if (error instanceof z.ZodError) {
            errors.push({
              line: earthquakes.length + errors.length + 1, // Approximate line number
              error: error.message,
            });
          }
        }
      })
      .on('end', () => {
        console.log(`✅ Parsed ${earthquakes.length} valid earthquake records`);
        if (errors.length > 0) {
          console.warn(
            `⚠️ Encountered ${errors.length} invalid records while parsing CSV`
          );
        }

        resolve(earthquakes);
      })
      .on('error', (error) => {
        console.error('❌ Error parsing CSV:', error);
        reject(error);
      });
  });
}

/**
 * Seeds the database with earthquake data
 * - Attempts to download and parse real earthquake data from CSV
 * - Falls back to sample data if the CSV import fails
 */
async function seed(): Promise<void> {
  console.log('🌱 Starting database seed...');

  try {
    // Clear existing data
    await prisma.$transaction([
      prisma.earthquake.deleteMany(),
      prisma.importHistory.deleteMany(),
    ]);

    console.log('✅ Cleaned existing data');

    let earthquakes = [];
    let importSource = 'sample-data';
    let importStatus = 'completed';
    let importError = null;

    try {
      // Try to download and parse the CSV
      const csvPath = await downloadCsv();
      earthquakes = await parseCsvFile(csvPath);
      importSource = path.basename(EARTHQUAKE_CSV_URL);

      // If we got less than 100 records, something might be wrong
      if (earthquakes.length < 10) {
        throw new Error(
          `Only found ${earthquakes.length} records in CSV, expected more data`
        );
      }
    } catch (error) {
      console.warn(
        '⚠️ Failed to import CSV data, falling back to sample data:',
        error
      );
      earthquakes = sampleEarthquakes;
      importStatus = 'failed';
      importError = error instanceof Error ? error.message : 'Unknown error';
    }

    // Create earthquakes in batches to avoid memory issues
    const BATCH_SIZE = 500;
    for (let i = 0; i < earthquakes.length; i += BATCH_SIZE) {
      const batch = earthquakes.slice(i, i + BATCH_SIZE);
      await prisma.earthquake.createMany({
        data: batch,
      });
      console.log(
        `✅ Created batch of ${batch.length} earthquakes (${i + batch.length}/${
          earthquakes.length
        })`
      );
    }

    // Create an import history record
    await prisma.importHistory.create({
      data: {
        filename: importSource,
        recordCount: earthquakes.length,
        status: importStatus,
        completedAt: new Date(),
        error: importError,
      },
    });

    console.log(`✅ Created import history record`);
    console.log(
      `🌱 Seed completed successfully with ${earthquakes.length} earthquake records`
    );
  } catch (error) {
    console.error('❌ Seed failed:', error);
    throw error;
  } finally {
    await disconnect();
  }
}

// Run the seed function
seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
