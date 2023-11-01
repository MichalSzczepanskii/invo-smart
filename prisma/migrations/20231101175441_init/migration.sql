-- AddForeignKey
ALTER TABLE "OAuth2Token" ADD CONSTRAINT "OAuth2Token_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
