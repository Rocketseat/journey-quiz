/*
  Warnings:

  - Added the required column `activeCampaignMasterclassCompletedListId` to the `Quiz` table without a default value. This is not possible if the table is not empty.
  - Added the required column `activeCampaignMasterclassHotListId` to the `Quiz` table without a default value. This is not possible if the table is not empty.
  - Added the required column `activeCampaignMasterclassInterestedListId` to the `Quiz` table without a default value. This is not possible if the table is not empty.
  - Added the required column `activeCampaignQuizFinishedListId` to the `Quiz` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Quiz` ADD COLUMN `activeCampaignMasterclassCompletedListId` VARCHAR(191) NOT NULL,
    ADD COLUMN `activeCampaignMasterclassHotListId` VARCHAR(191) NOT NULL,
    ADD COLUMN `activeCampaignMasterclassInterestedListId` VARCHAR(191) NOT NULL,
    ADD COLUMN `activeCampaignQuizFinishedListId` VARCHAR(191) NOT NULL;
