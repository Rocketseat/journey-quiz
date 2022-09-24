-- AlterTable
ALTER TABLE `Answer` MODIFY `description` TEXT NOT NULL;

-- AlterTable
ALTER TABLE `Question` MODIFY `description` TEXT NOT NULL;

-- AlterTable
ALTER TABLE `Quiz` MODIFY `title` TEXT NOT NULL,
    MODIFY `description` TEXT NOT NULL;
