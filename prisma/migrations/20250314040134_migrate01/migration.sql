-- CreateTable
CREATE TABLE `runner_tb` (
    `runnerId` INTEGER NOT NULL AUTO_INCREMENT,
    `runnerName` VARCHAR(100) NOT NULL,
    `runnerUsername` VARCHAR(100) NOT NULL,
    `runnerPassword` VARCHAR(100) NOT NULL,
    `runnerImage` VARCHAR(150) NOT NULL,

    PRIMARY KEY (`runnerId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `run_tb` (
    `runId` INTEGER NOT NULL AUTO_INCREMENT,
    `dateRun` VARCHAR(100) NOT NULL,
    `distanceRun` FLOAT NOT NULL,
    `placeRun` VARCHAR(100) NOT NULL,
    `runImage` VARCHAR(150) NOT NULL,
    `runnerId` INTEGER NOT NULL,

    PRIMARY KEY (`runId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
