-- AlterTable
ALTER TABLE "Event" ADD COLUMN "recap" TEXT;
ALTER TABLE "Event" ADD COLUMN "recapImageUrl" TEXT;

-- CreateTable
CREATE TABLE "Comment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "content" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "bookId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "Comment_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Book" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Comment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ShelfEntry" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "status" TEXT NOT NULL DEFAULT 'WANT_TO_READ',
    "addedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "statusUpdatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "bookId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "ShelfEntry_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Book" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ShelfEntry_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_ShelfEntry" ("addedAt", "bookId", "id", "status", "userId") SELECT "addedAt", "bookId", "id", "status", "userId" FROM "ShelfEntry";
DROP TABLE "ShelfEntry";
ALTER TABLE "new_ShelfEntry" RENAME TO "ShelfEntry";
CREATE UNIQUE INDEX "ShelfEntry_bookId_userId_key" ON "ShelfEntry"("bookId", "userId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
