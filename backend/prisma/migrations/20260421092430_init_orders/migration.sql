-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('NEW', 'PAID', 'FAILED');

-- CreateTable
CREATE TABLE "Order" (
    "id" TEXT NOT NULL,
    "externalId" TEXT,
    "amount" INTEGER NOT NULL,
    "email" TEXT NOT NULL,
    "status" "PaymentStatus" NOT NULL DEFAULT 'NEW',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Order_externalId_key" ON "Order"("externalId");
