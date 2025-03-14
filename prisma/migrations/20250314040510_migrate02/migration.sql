/*
  Warnings:

  - Added the required column `runnerNickname` to the `runner_tb` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `runner_tb` ADD COLUMN `runnerNickname` VARCHAR(100) NOT NULL;
