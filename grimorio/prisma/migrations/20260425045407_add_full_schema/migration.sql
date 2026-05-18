-- CreateTable
CREATE TABLE "Race" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "bonusFor" INTEGER NOT NULL DEFAULT 0,
    "bonusDes" INTEGER NOT NULL DEFAULT 0,
    "bonusCon" INTEGER NOT NULL DEFAULT 0,
    "bonusInt" INTEGER NOT NULL DEFAULT 0,
    "bonusSab" INTEGER NOT NULL DEFAULT 0,
    "bonusCar" INTEGER NOT NULL DEFAULT 0
);

-- CreateTable
CREATE TABLE "RaceAbility" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "raceId" TEXT NOT NULL,
    CONSTRAINT "RaceAbility_raceId_fkey" FOREIGN KEY ("raceId") REFERENCES "Race" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "T20Class" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "pvInicial" INTEGER NOT NULL,
    "pvNivel" INTEGER NOT NULL,
    "pmNivel" INTEGER NOT NULL,
    "atributoChave" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "ClassAbility" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "level" INTEGER NOT NULL DEFAULT 1,
    "classId" TEXT NOT NULL,
    CONSTRAINT "ClassAbility_classId_fkey" FOREIGN KEY ("classId") REFERENCES "T20Class" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ClassSpell" (
    "classId" TEXT NOT NULL,
    "spellId" TEXT NOT NULL,

    PRIMARY KEY ("classId", "spellId"),
    CONSTRAINT "ClassSpell_classId_fkey" FOREIGN KEY ("classId") REFERENCES "T20Class" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ClassSpell_spellId_fkey" FOREIGN KEY ("spellId") REFERENCES "Spell" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Spell" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "circle" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "school" TEXT NOT NULL,
    "execution" TEXT NOT NULL,
    "range" TEXT NOT NULL,
    "duration" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "resistance" TEXT,
    "area" TEXT
);

-- CreateTable
CREATE TABLE "Power" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "group" TEXT,
    "prerequisites" TEXT,
    "description" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Skill" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "attribute" TEXT NOT NULL,
    "trainedOnly" BOOLEAN NOT NULL DEFAULT false,
    "armorPenalty" BOOLEAN NOT NULL DEFAULT false,
    "description" TEXT
);

-- CreateTable
CREATE TABLE "Origin" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT
);

-- CreateTable
CREATE TABLE "OriginAbility" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "originId" TEXT NOT NULL,
    CONSTRAINT "OriginAbility_originId_fkey" FOREIGN KEY ("originId") REFERENCES "Origin" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Divinity" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "portfolio" TEXT,
    "symbol" TEXT,
    "alignment" TEXT,
    "grantedPower" TEXT,
    "description" TEXT
);

-- CreateTable
CREATE TABLE "Threat" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "nd" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "size" TEXT NOT NULL,
    "role" TEXT,
    "perception" INTEGER,
    "initiative" INTEGER,
    "defense" INTEGER,
    "fortitude" INTEGER,
    "reflexes" INTEGER,
    "will" INTEGER,
    "hp" INTEGER,
    "mp" TEXT,
    "speed" TEXT,
    "rd" INTEGER,
    "fastHealing" INTEGER,
    "skills" TEXT,
    "book" TEXT
);

-- CreateTable
CREATE TABLE "ThreatAttribute" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "for" INTEGER,
    "des" INTEGER,
    "con" INTEGER,
    "int" INTEGER,
    "sab" INTEGER,
    "car" INTEGER,
    "threatId" TEXT NOT NULL,
    CONSTRAINT "ThreatAttribute_threatId_fkey" FOREIGN KEY ("threatId") REFERENCES "Threat" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ThreatAttack" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "bonus" INTEGER,
    "damage" TEXT,
    "type" TEXT,
    "threatId" TEXT NOT NULL,
    CONSTRAINT "ThreatAttack_threatId_fkey" FOREIGN KEY ("threatId") REFERENCES "Threat" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ThreatAbility" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "type" TEXT,
    "threatId" TEXT NOT NULL,
    CONSTRAINT "ThreatAbility_threatId_fkey" FOREIGN KEY ("threatId") REFERENCES "Threat" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ThreatImmunity" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "value" TEXT NOT NULL,
    "threatId" TEXT NOT NULL,
    CONSTRAINT "ThreatImmunity_threatId_fkey" FOREIGN KEY ("threatId") REFERENCES "Threat" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Equipment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "type" TEXT,
    "description" TEXT,
    "price" REAL,
    "weight" REAL,
    "damage" TEXT,
    "damageType" TEXT,
    "critical" TEXT,
    "range" TEXT,
    "defense" INTEGER,
    "penalty" INTEGER
);

-- CreateIndex
CREATE UNIQUE INDEX "Race_slug_key" ON "Race"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "T20Class_slug_key" ON "T20Class"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Spell_slug_key" ON "Spell"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Power_name_type_key" ON "Power"("name", "type");

-- CreateIndex
CREATE UNIQUE INDEX "Skill_slug_key" ON "Skill"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Origin_slug_key" ON "Origin"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Divinity_slug_key" ON "Divinity"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Threat_slug_key" ON "Threat"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "ThreatAttribute_threatId_key" ON "ThreatAttribute"("threatId");

-- CreateIndex
CREATE UNIQUE INDEX "Equipment_slug_key" ON "Equipment"("slug");
