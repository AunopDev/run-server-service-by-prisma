// จัดการเรื่องเส้นทางในการเรียกใช้ controller ของ runner เพื่อกำหนดตัว endpoint ที่จะใช้งานสำหรับ Frotned

const express = require("express");
const runController = require("./../controllers/run.controller.js");

const router = express.Router();

// กำหนดเส้นทางการเรียกใช้งาน controller ของ runner
// เพิ่ม
router.post("/", runController.uploadRun, runController.createRun);

// แก้ไข

// ตรวจสอบชื่อผู้ใช้ รหัสผ่าน

// export โมดูล router ออกไปใช้งาน server.js

module.exports = router;
