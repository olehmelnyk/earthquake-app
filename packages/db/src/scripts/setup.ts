#!/usr/bin/env tsx

/**
 * Database setup script
 * 
 * This script handles the complete setup of the database:
 * 1. Checks if Docker is running
 * 2. Creates a migration for any schema changes
 * 3. Applies migrations to the database
 * 4. Seeds the database with initial data
 */

import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';

const execAsync = promisify(exec);
const dbPackageRoot = path.resolve(__dirname, '../../');

async function runCommand(command: string, cwd = dbPackageRoot): Promise<string> {
  try {
    console.log(`Running: ${command}`);
    const { stdout, stderr } = await execAsync(command, { cwd });
    if (stderr) console.error(stderr);
    return stdout.trim();
  } catch (error) {
    console.error(`Error executing command: ${command}`);
    console.error(error);
    throw error;
  }
}

async function checkDockerStatus(): Promise<boolean> {
  try {
    await runCommand('docker ps');
    return true;
  } catch (error) {
    console.error('Docker is not running. Please start Docker Desktop first.');
    return false;
  }
}

async function checkPostgresContainer(): Promise<boolean> {
  try {
    const result = await runCommand('docker ps --filter "name=earthquake-db" --format "{{.Names}}"');
    return result.includes('earthquake-db');
  } catch (error) {
    return false;
  }
}

async function startPostgresContainer(): Promise<void> {
  try {
    // Check if container exists but is stopped
    const result = await runCommand('docker ps -a --filter "name=earthquake-db" --format "{{.Names}}"');
    
    if (result.includes('earthquake-db')) {
      console.log('Starting existing earthquake-db container...');
      await runCommand('docker start earthquake-db');
    } else {
      console.log('Creating and starting new earthquake-db container...');
      await runCommand('docker run --name earthquake-db -e POSTGRES_PASSWORD=postgres -e POSTGRES_USER=postgres -e POSTGRES_DB=earthquake_db -p 5432:5432 -d postgres:16-alpine');
    }
    
    console.log('Waiting for PostgreSQL to be ready...');
    await new Promise(resolve => setTimeout(resolve, 3000));
  } catch (error) {
    console.error('Failed to start PostgreSQL container:', error);
    throw error;
  }
}

async function generateMigration(): Promise<void> {
  try {
    const migrationName = 'init';
    console.log(`Generating migration: ${migrationName}...`);
    await runCommand(`pnpm prisma migrate dev --name ${migrationName} --create-only`);
  } catch (error) {
    console.error('Error generating migration:', error);
    throw error;
  }
}

async function applyMigrations(): Promise<void> {
  try {
    console.log('Applying migrations...');
    await runCommand('pnpm prisma migrate deploy');
  } catch (error) {
    console.error('Error applying migrations:', error);
    throw error;
  }
}

async function seedDatabase(): Promise<void> {
  try {
    console.log('Seeding database...');
    await runCommand('pnpm db:seed');
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  }
}

async function main(): Promise<void> {
  console.log('Starting database setup...');
  
  // Check if Docker is running
  const dockerRunning = await checkDockerStatus();
  if (!dockerRunning) {
    console.error('Please start Docker Desktop and try again.');
    process.exit(1);
  }
  
  // Check and start PostgreSQL container if needed
  const postgresRunning = await checkPostgresContainer();
  if (!postgresRunning) {
    await startPostgresContainer();
  } else {
    console.log('PostgreSQL container is already running.');
  }
  
  // Generate and apply migrations
  await generateMigration();
  await applyMigrations();
  
  // Seed the database
  await seedDatabase();
  
  console.log('Database setup completed successfully! 🎉');
}

main()
  .catch(error => {
    console.error('Database setup failed:', error);
    process.exit(1);
  });
