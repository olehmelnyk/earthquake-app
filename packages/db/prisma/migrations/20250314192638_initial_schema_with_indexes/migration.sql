-- CreateTable
CREATE TABLE "Earthquake" (
    "id" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "magnitude" DOUBLE PRECISION NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Earthquake_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ImportHistory" (
    "id" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "recordCount" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),
    "error" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ImportHistory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Earthquake_location_idx" ON "Earthquake"("location");

-- CreateIndex
CREATE INDEX "Earthquake_magnitude_idx" ON "Earthquake"("magnitude");

-- CreateIndex
CREATE INDEX "Earthquake_date_idx" ON "Earthquake"("date");

-- CreateIndex
CREATE INDEX "Earthquake_location_magnitude_idx" ON "Earthquake"("location", "magnitude");

-- CreateIndex
CREATE INDEX "Earthquake_date_magnitude_idx" ON "Earthquake"("date", "magnitude");
