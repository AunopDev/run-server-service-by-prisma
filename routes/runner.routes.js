// จัดการเรื่องเส้นทางในการเรียกใช้ controller ของ runner เพื่อกำหนดตัว endpoint ที่จะใช้งานสำหรับ Frotned

const express = require("express");
const runnerController = require("./../controllers/runner.controller.js");

const router = express.Router();

// กำหนดเส้นทางการเรียกใช้งาน controller ของ runner
// เพิ่ม
router.post("/", runnerController.uploadRunner, runnerController.createRunner);

// แก้ไข

// ตรวจสอบชื่อผู้ใช้ รหัสผ่าน
router.get("/:runnerUsername/:runnerPassword", runnerController.checkLoginRunner);

// export โมดูล router ออกไปใช้งาน server.js
module.exports = router;
