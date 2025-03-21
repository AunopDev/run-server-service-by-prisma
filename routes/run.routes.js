// จัดการเรื่องเส้นทางในการเรียกใช้ controller ของ runner เพื่อกำหนดตัว endpoint ที่จะใช้งานสำหรับ Frotned

const express = require("express");
const runController = require("./../controllers/run.controller.js");
const { route } = require("./runner.routes.js");

const router = express.Router();

// กำหนดเส้นทางการเรียกใช้งาน controller ของ runner
// เพิ่ม
router.post("/", runController.uploadRun, runController.createRun);

// แก้ไข
router.put("/:runId", runController.uploadRun, runController.updateRunOfRunner);

// ดึงข้อมูล
router.get("/only/:runId", runController.getOneRunOfRunner);
router.get("/:runnerId", runController.getAllRunOfRunner);

// ลบ
router.delete("/:runId", runController.deleteRunOfRunner);

// export โมดูล router ออกไปใช้งาน server.js

module.exports = router;
