/*
  Warnings:

  - You are about to drop the column `warranty` on the `Product` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "BrandExpertise" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "brandId" TEXT,
    "key" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "BrandExpertise_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "Brand" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Dealer" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "brandId" TEXT NOT NULL,
    "dealerName" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "stateProvince" TEXT NOT NULL,
    "postalCode" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "lat" REAL,
    "lng" REAL,
    "phone" TEXT,
    "email" TEXT,
    "website" TEXT,
    "hours" JSONB,
    "isServiceOnly" BOOLEAN NOT NULL DEFAULT false,
    "source" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Dealer_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "Brand" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Dealer" ("active", "address", "brandId", "city", "country", "createdAt", "dealerName", "email", "id", "lat", "lng", "phone", "postalCode", "source", "stateProvince", "updatedAt", "website") SELECT "active", "address", "brandId", "city", "country", "createdAt", "dealerName", "email", "id", "lat", "lng", "phone", "postalCode", "source", "stateProvince", "updatedAt", "website" FROM "Dealer";
DROP TABLE "Dealer";
ALTER TABLE "new_Dealer" RENAME TO "Dealer";
CREATE TABLE "new_Product" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "brandId" TEXT NOT NULL,
    "seriesId" TEXT NOT NULL,
    "modelName" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "heroImageUrl" TEXT,
    "overheadImageUrl" TEXT,
    "seatsMin" INTEGER,
    "seatsMax" INTEGER,
    "loungeCount" INTEGER NOT NULL DEFAULT 0,
    "jetCount" INTEGER,
    "capacityGallons" INTEGER,
    "dryWeightLbs" INTEGER,
    "fullWeightLbs" INTEGER,
    "pumpFlowGpm" INTEGER,
    "electricalAmps" INTEGER,
    "lengthIn" REAL,
    "widthIn" REAL,
    "depthIn" REAL,
    "voltageOptions" JSONB,
    "amperage" TEXT,
    "heaterKw" TEXT,
    "pumpConfig" JSONB,
    "filtration" JSONB,
    "insulationType" TEXT,
    "hotspots" JSONB NOT NULL DEFAULT [],
    "standardFeatures" JSONB NOT NULL DEFAULT [],
    "optionalFeatures" JSONB NOT NULL DEFAULT [],
    "shellColors" JSONB NOT NULL DEFAULT [],
    "cabinetColors" JSONB NOT NULL DEFAULT [],
    "marketingSummary" TEXT,
    "therapySummary" TEXT,
    "usageTags" JSONB NOT NULL DEFAULT [],
    "positioningTier" TEXT,
    "score" INTEGER,
    "estimatedMsrp" INTEGER,
    "sourceUrl" TEXT,
    "sourceLastSeenAt" DATETIME,
    "completenessScore" REAL NOT NULL DEFAULT 0,
    "staticHeroTitle" TEXT,
    "staticHydrotherapy" TEXT,
    "staticClimate" TEXT,
    "staticDesign" TEXT,
    "staticEfficiency" TEXT,
    "staticDesignConsideration" TEXT,
    "staticReasons" JSONB NOT NULL DEFAULT [],
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Product_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "Brand" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Product_seriesId_fkey" FOREIGN KEY ("seriesId") REFERENCES "Series" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Product" ("amperage", "brandId", "cabinetColors", "capacityGallons", "completenessScore", "createdAt", "depthIn", "dryWeightLbs", "filtration", "heaterKw", "heroImageUrl", "id", "insulationType", "jetCount", "lengthIn", "loungeCount", "marketingSummary", "modelName", "optionalFeatures", "pumpConfig", "seatsMax", "seatsMin", "seriesId", "shellColors", "slug", "sourceLastSeenAt", "sourceUrl", "standardFeatures", "status", "therapySummary", "updatedAt", "usageTags", "voltageOptions", "widthIn") SELECT "amperage", "brandId", "cabinetColors", "capacityGallons", "completenessScore", "createdAt", "depthIn", "dryWeightLbs", "filtration", "heaterKw", "heroImageUrl", "id", "insulationType", "jetCount", "lengthIn", "loungeCount", "marketingSummary", "modelName", "optionalFeatures", "pumpConfig", "seatsMax", "seatsMin", "seriesId", "shellColors", "slug", "sourceLastSeenAt", "sourceUrl", "standardFeatures", "status", "therapySummary", "updatedAt", "usageTags", "voltageOptions", "widthIn" FROM "Product";
DROP TABLE "Product";
ALTER TABLE "new_Product" RENAME TO "Product";
CREATE UNIQUE INDEX "Product_slug_key" ON "Product"("slug");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "BrandExpertise_brandId_key_key" ON "BrandExpertise"("brandId", "key");
