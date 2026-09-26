-- CreateTable
CREATE TABLE "numerology_meanings" (
    "id" UUID NOT NULL,
    "number" INTEGER NOT NULL,
    "root_number" INTEGER NOT NULL,
    "group_number" INTEGER NOT NULL,
    "title" VARCHAR(200) NOT NULL,
    "category" VARCHAR(50),
    "meanings_and_symbols" TEXT,
    "group_characteristics" TEXT,
    "life_description" TEXT,
    "shadow_polarity" TEXT,
    "be_wary_of" TEXT,
    "illnesses" TEXT,
    "love_and_family" TEXT,
    "example_names" TEXT,
    "language" VARCHAR(5) NOT NULL DEFAULT 'en',
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "numerology_meanings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "numerology_meanings_number_key" ON "numerology_meanings"("number");

-- CreateIndex
CREATE INDEX "numerology_meanings_number_idx" ON "numerology_meanings"("number");

-- CreateIndex
CREATE INDEX "numerology_meanings_root_number_idx" ON "numerology_meanings"("root_number");

-- CreateIndex
CREATE INDEX "numerology_meanings_group_number_idx" ON "numerology_meanings"("group_number");
