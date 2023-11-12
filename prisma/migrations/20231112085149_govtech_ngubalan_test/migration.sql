-- AlterTable
ALTER TABLE `certificate` MODIFY `skType` ENUM('SKIK', 'SKTM', 'SKMS', 'SKCK', 'SKU', 'SKK', 'SKD', 'SKDI', 'SKPB', 'SKKM', 'SKHIL') NOT NULL;
