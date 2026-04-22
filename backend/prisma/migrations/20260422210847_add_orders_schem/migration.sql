/*
  Warnings:

  - You are about to drop the column `stripeSession` on the `Order` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[stripeSessionId]` on the table `Order` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `stripeSessionId` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nameAtPurchase` to the `OrderItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `priceAtPurchase` to the `OrderItem` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Order" DROP COLUMN "stripeSession",
ADD COLUMN     "stripeSessionId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "OrderItem" ADD COLUMN     "nameAtPurchase" TEXT NOT NULL,
ADD COLUMN     "priceAtPurchase" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Order_stripeSessionId_key" ON "Order"("stripeSessionId");
