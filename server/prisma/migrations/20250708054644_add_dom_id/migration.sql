/*
  Warnings:

  - The primary key for the `PageElement` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `elementId` on the `PageElement` table. All the data in the column will be lost.
  - Added the required column `domId` to the `PageElement` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PageElement" DROP CONSTRAINT "PageElement_pkey",
DROP COLUMN "elementId",
ADD COLUMN     "domId" TEXT NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "PageElement_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "PageElement_id_seq";
