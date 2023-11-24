/*
  Warnings:

  - You are about to drop the column `name` on the `user` table. All the data in the column will be lost.
  - You are about to alter the column `role` on the `user` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(0))`.

*/
-- AlterTable
ALTER TABLE `certificate` ADD COLUMN `approvedDate` DATETIME(3) NULL,
    ADD COLUMN `requestDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updatedDate` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `user` DROP COLUMN `name`,
    MODIFY `role` ENUM('USER', 'ADMIN') NOT NULL;

-- CreateTable
CREATE TABLE `profile` (
    `userId` VARCHAR(191) NOT NULL,
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NULL,
    `nik` VARCHAR(191) NULL,
    `alamat` VARCHAR(191) NULL,
    `tempatLahir` DATETIME(3) NULL,
    `tanggalLahir` DATETIME(3) NULL,

    UNIQUE INDEX `profile_userId_key`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `profile` ADD CONSTRAINT `profile_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
