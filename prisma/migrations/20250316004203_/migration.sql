/*
  Warnings:

  - You are about to drop the column `street_address` on the `Contact` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Contact" DROP COLUMN "street_address";

-- CreateTable
CREATE TABLE "_ContactToStreetAddress" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ContactToStreetAddress_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_ContactToStreetAddress_B_index" ON "_ContactToStreetAddress"("B");

-- AddForeignKey
ALTER TABLE "_ContactToStreetAddress" ADD CONSTRAINT "_ContactToStreetAddress_A_fkey" FOREIGN KEY ("A") REFERENCES "Contact"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ContactToStreetAddress" ADD CONSTRAINT "_ContactToStreetAddress_B_fkey" FOREIGN KEY ("B") REFERENCES "StreetAddress"("id") ON DELETE CASCADE ON UPDATE CASCADE;
