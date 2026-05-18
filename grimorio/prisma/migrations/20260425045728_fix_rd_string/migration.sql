-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Threat" (
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
    "rd" TEXT,
    "fastHealing" INTEGER,
    "skills" TEXT,
    "book" TEXT
);
INSERT INTO "new_Threat" ("book", "defense", "fastHealing", "fortitude", "hp", "id", "initiative", "mp", "name", "nd", "perception", "rd", "reflexes", "role", "size", "skills", "slug", "speed", "type", "will") SELECT "book", "defense", "fastHealing", "fortitude", "hp", "id", "initiative", "mp", "name", "nd", "perception", "rd", "reflexes", "role", "size", "skills", "slug", "speed", "type", "will" FROM "Threat";
DROP TABLE "Threat";
ALTER TABLE "new_Threat" RENAME TO "Threat";
CREATE UNIQUE INDEX "Threat_slug_key" ON "Threat"("slug");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
