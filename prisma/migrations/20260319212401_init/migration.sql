-- CreateTable
CREATE TABLE "Brand" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "domain" TEXT NOT NULL,
    "logoUrl" TEXT,
    "themeConfig" JSONB NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Series" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "brandId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "positioningTier" TEXT,
    "description" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Series_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "Brand" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "brandId" TEXT NOT NULL,
    "seriesId" TEXT NOT NULL,
    "modelName" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "heroImageUrl" TEXT,
    "seatsMin" INTEGER,
    "seatsMax" INTEGER,
    "loungeCount" INTEGER NOT NULL DEFAULT 0,
    "jetCount" INTEGER,
    "capacityGallons" INTEGER,
    "dryWeightLbs" INTEGER,
    "lengthIn" REAL,
    "widthIn" REAL,
    "depthIn" REAL,
    "voltageOptions" JSONB,
    "amperage" TEXT,
    "heaterKw" TEXT,
    "pumpConfig" JSONB,
    "filtration" JSONB,
    "insulationType" TEXT,
    "warranty" JSONB,
    "standardFeatures" JSONB NOT NULL DEFAULT [],
    "optionalFeatures" JSONB NOT NULL DEFAULT [],
    "shellColors" JSONB NOT NULL DEFAULT [],
    "cabinetColors" JSONB NOT NULL DEFAULT [],
    "marketingSummary" TEXT,
    "therapySummary" TEXT,
    "usageTags" JSONB NOT NULL DEFAULT [],
    "sourceUrl" TEXT,
    "sourceLastSeenAt" DATETIME,
    "completenessScore" REAL NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Product_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "Brand" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Product_seriesId_fkey" FOREIGN KEY ("seriesId") REFERENCES "Series" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "FeatureGlossary" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "brandId" TEXT,
    "term" TEXT NOT NULL,
    "consumerExplanation" TEXT NOT NULL,
    "approvedClaims" JSONB DEFAULT [],
    "prohibitedClaims" JSONB DEFAULT [],
    "relatedFeatures" JSONB DEFAULT [],
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "FeatureGlossary_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "Brand" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Dealer" (
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
    "source" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Dealer_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "Brand" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Lead" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "brandId" TEXT NOT NULL,
    "dealerId" TEXT,
    "sessionId" TEXT NOT NULL,
    "answers" JSONB NOT NULL,
    "rankedProducts" JSONB NOT NULL,
    "selectedProductIds" JSONB NOT NULL,
    "transcriptSummary" TEXT,
    "userContact" JSONB NOT NULL,
    "consent" JSONB NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Lead_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "Brand" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Lead_dealerId_fkey" FOREIGN KEY ("dealerId") REFERENCES "Dealer" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ConversationEvent" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sessionId" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "groundedSources" JSONB,
    "promptVersion" TEXT,
    "modelVersion" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "Brand_domain_key" ON "Brand"("domain");

-- CreateIndex
CREATE UNIQUE INDEX "Product_slug_key" ON "Product"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "FeatureGlossary_brandId_term_key" ON "FeatureGlossary"("brandId", "term");

-- CreateIndex
CREATE UNIQUE INDEX "Lead_sessionId_key" ON "Lead"("sessionId");

-- CreateIndex
CREATE INDEX "ConversationEvent_sessionId_idx" ON "ConversationEvent"("sessionId");
