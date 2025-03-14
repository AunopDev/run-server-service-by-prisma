// จัดการเรื่อง อัปโหลดไฟล์ด้วย multer
// จัดการเรื่องการทำงาน CRUD กับฐานข้อมูล โดย prisma

const multer = require("multer");
const path = require("path");
const fs = require("fs");

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

//สร้างส่วนของการอัปโหลดไฟล์ด้วย multer ทำ 2 ขั้นตอน
//1. กําหนดตําแหน่งที่จะอัปโหลดไฟล์ และชื่อไฟล์
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images/run");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      "run_" +
        Math.floor(Math.random() * Date.now()) +
        path.extname(file.originalname)
    );
  },
});
//2. ฟังก์ชันอัปโหลดไฟล์
exports.uploadRun = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png/;
    const mimeType = fileTypes.test(file.mimetype);
    const extname = fileTypes.test(path.extname(file.originalname));
    if (mimeType && extname) {
      return cb(null, true);
    }
    cb("Give proper files formate to upload");
  },
}).single("runImage");

exports.createRun = async (req, res) => {
  try {
    // เอาข้อมูลจาก client เพิ่มลงตารางในฐานข้อมูล
    const result = await prisma.run_tb.create({
      data: {
        dateRun: req.body.dateRun,
        distanceRun: req.body.distanceRun,
        placeRun: req.body.placeRun,
        runImage: req.file ? req.file.path.replace("images\\run\\", "") : "",
        runnerId: parseInt(req.body.runnerId),
      },
    });

    // ส่งผลการทำงานกลับไปยัง client

    res.status(201).json({
      message: "Insert data successfully",
      data: result,
    });
  } catch (err) {
    res.status(500).json({ message: `ERROR:  ${err}` });
  }
};
