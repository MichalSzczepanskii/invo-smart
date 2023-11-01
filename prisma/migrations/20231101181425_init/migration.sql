/*
  Warnings:

  - A unique constraint covering the columns `[userId,serviceId]` on the table `OAuth2Token` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "OAuth2Token_userId_serviceId_key" ON "OAuth2Token"("userId", "serviceId");
