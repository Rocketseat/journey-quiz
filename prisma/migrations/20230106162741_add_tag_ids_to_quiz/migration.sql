/*
  Warnings:

  - You are about to drop the column `activeCampaignMasterclassCompletedListId` on the `Quiz` table. All the data in the column will be lost.
  - You are about to drop the column `activeCampaignMasterclassHotListId` on the `Quiz` table. All the data in the column will be lost.
  - You are about to drop the column `activeCampaignMasterclassInterestedListId` on the `Quiz` table. All the data in the column will be lost.
  - You are about to drop the column `activeCampaignQuizFinishedListId` on the `Quiz` table. All the data in the column will be lost.
  - Added the required column `activeCampaignMasterclassCertifiedTagId` to the `Quiz` table without a default value. This is not possible if the table is not empty.
  - Added the required column `activeCampaignMasterclassCompletedTagId` to the `Quiz` table without a default value. This is not possible if the table is not empty.
  - Added the required column `activeCampaignMasterclassHotTagId` to the `Quiz` table without a default value. This is not possible if the table is not empty.
  - Added the required column `activeCampaignMasterclassInterestedTagId` to the `Quiz` table without a default value. This is not possible if the table is not empty.
  - Added the required column `activeCampaignQuizFinishedTagId` to the `Quiz` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Quiz` DROP COLUMN `activeCampaignMasterclassCompletedListId`,
    DROP COLUMN `activeCampaignMasterclassHotListId`,
    DROP COLUMN `activeCampaignMasterclassInterestedListId`,
    DROP COLUMN `activeCampaignQuizFinishedListId`,
    ADD COLUMN `activeCampaignMasterclassCertifiedTagId` VARCHAR(191) NOT NULL,
    ADD COLUMN `activeCampaignMasterclassCompletedTagId` VARCHAR(191) NOT NULL,
    ADD COLUMN `activeCampaignMasterclassHotTagId` VARCHAR(191) NOT NULL,
    ADD COLUMN `activeCampaignMasterclassInterestedTagId` VARCHAR(191) NOT NULL,
    ADD COLUMN `activeCampaignQuizFinishedTagId` VARCHAR(191) NOT NULL;
