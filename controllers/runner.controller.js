// จัดการเรื่อง อัปโหลดไฟล์ด้วย multer
// จัดการเรื่องการทำงาน CRUD กับฐานข้อมูล โดย prisma
const { v2: cloudinary } = require("cloudinary");
const { CloudinaryStorage } = require("multer-storage-cloudinary");

const multer = require("multer");
const path = require("path");
const fs = require("fs");

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

cloudinary.config({
  cloud_name: "ditnqhjjh",
  api_key: "428626728889478",
  api_secret: "WUeOczj0mvae4eXLObn_ZPc0du4",
});

//สร้างส่วนของการอัปโหลดไฟล์ด้วย multer ทำ 2 ขั้นตอน
//1. กําหนดตําแหน่งที่จะอัปโหลดไฟล์ และชื่อไฟล์
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "images/runner");
//   },
//   filename: (req, file, cb) => {
//     cb(
//       null,
//       "runner_" +
//         Math.floor(Math.random() * Date.now()) +
//         path.extname(file.originalname)
//     );
//   },
// });
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    const newFileName = "runner_" + Math.floor(Math.random() * Date.now());

    return {
      folder: "images/runner", // โฟลเดอร์ใน Cloudinary
      allowed_formats: ["jpg", "png"], // กำหนดประเภทไฟล์
      public_id: newFileName,
    };
  },
});
//2. ฟังก์ชันอัปโหลดไฟล์
exports.uploadRunner = multer({
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
}).single("runnerImage");

// สร้างฟังก์ชั่นสำหรับการเพิ่มข้อมูลลงในตาราง runner_tb
exports.createRunner = async (req, res) => {
  try {
    // เอาข้อมูลจาก client เพิ่มลงตารางในฐานข้อมูล
    const result = await prisma.runner_tb.create({
      data: {
        runnerName: req.body.runnerName,
        runnerUsername: req.body.runnerUsername,
        runnerPassword: req.body.runnerPassword,
        // runnerImage: req.file
        //   ? req.file.path.replace("images\\runner\\", "")
        //   : "",
        runnerImage: req.file ? req.file.path : "",
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

// สร้างฟังก์ชั่นสำหรับตรวจสอบชื่อผู้ใช้ รหัสผ่าน
exports.checkLoginRunner = async (req, res) => {
  try {
    const result = await prisma.runner_tb.findFirst({
      where: {
        runnerUsername: req.params.runnerUsername,
        runnerPassword: req.params.runnerPassword,
      },
    });

    if (result) {
      res.status(200).json({
        message: "Login successfully",
        data: result,
      });
    } else {
      res.status(404).json({
        message: "Username or Password is incorrect",
        data: result,
      });
    }
  } catch (err) {
    res.status(500).json({ message: `ERROR:  ${err}` });
  }
};
