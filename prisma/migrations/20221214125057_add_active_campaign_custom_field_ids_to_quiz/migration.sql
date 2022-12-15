/*
  Warnings:

  - Added the required column `activeCampaignLastResultFieldId` to the `Quiz` table without a default value. This is not possible if the table is not empty.
  - Added the required column `activeCampaignLastSubmissionIdFieldId` to the `Quiz` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Quiz` ADD COLUMN `activeCampaignLastResultFieldId` VARCHAR(191) NOT NULL,
    ADD COLUMN `activeCampaignLastSubmissionIdFieldId` VARCHAR(191) NOT NULL;
