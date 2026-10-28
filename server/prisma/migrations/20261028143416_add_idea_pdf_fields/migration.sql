/*
  Warnings:

  - Added the required column `academicYear` to the `Idea` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pdfFileName` to the `Idea` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pdfPath` to the `Idea` table without a default value. This is not possible if the table is not empty.
  - Added the required column `uploadedById` to the `Idea` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Idea" ADD COLUMN     "academicYear" TEXT NOT NULL,
ADD COLUMN     "pdfFileName" TEXT NOT NULL,
ADD COLUMN     "pdfPath" TEXT NOT NULL,
ADD COLUMN     "uploadedById" UUID NOT NULL;

-- AddForeignKey
ALTER TABLE "Idea" ADD CONSTRAINT "Idea_uploadedById_fkey" FOREIGN KEY ("uploadedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
