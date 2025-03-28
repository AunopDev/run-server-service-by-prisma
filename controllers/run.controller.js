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
//     cb(null, "images/run");
//   },
//   filename: (req, file, cb) => {
//     cb(
//       null,
//       "run_" +
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
        // runImage: req.file ? req.file.path.replace("images\\run\\", "") : "",
        runnerImage: req.file ? req.file.path : "",
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

// สร้างฟังก์ชั่นสำหรับการเพิ่มข้อมูลลงในตาราง run_tb
exports.createRun = async (req, res) => {
  try {
    // เอาข้อมูลจาก client เพิ่มลงตารางในฐานข้อมูล
    const result = await prisma.run_tb.create({
      data: {
        dateRun: req.body.dateRun,
        distanceRun: parseFloat(req.body.distanceRun),
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

// สร้างฟังก์ชั่นดึงข้อมูลการวิ่งทั้งหมดของนักวิ่งคนหนึ่งๆ
exports.getAllRunOfRunner = async (req, res) => {
  try {
    const result = await prisma.run_tb.findMany({
      where: {
        runnerId: parseInt(req.params.runnerId),
      },
    });

    res.status(200).json({
      message: "Get all run of runner successfully",
      data: result,
    });
  } catch (err) {
    res.status(500).json({ message: `ERROR:  ${err}` });
  }
};

// สร้างฟังก์ชั่นสำหรับการลบข้อมูลในตาราง
exports.deleteRunOfRunner = async (req, res) => {
  try {
    const result = await prisma.run_tb.delete({
      where: {
        runId: parseInt(req.params.runId),
      },
    });

    res.status(200).json({
      message: "Delete data successfully",
      data: result,
    });
  } catch (err) {
    res.status(500).json({ message: `ERROR:  ${err}` });
  }
};

// สร้างฟังก์ชั่นการวิ่งวิ่งหนึ่งๆ ของนักวิ่งคนหนึ่ง
exports.getOneRunOfRunner = async (req, res) => {
  try {
    const result = await prisma.run_tb.findFirst({
      where: {
        runId: parseInt(req.params.runId),
      },
    });

    res.status(200).json({
      message: "Get one run of runner successfully",
      data: result,
    });
  } catch (err) {
    res.status(500).json({ message: `ERROR:  ${err}` });
  }
};

// สร้างฟังก์ชั่นสำหรับการแก้ไขข้อมูลการวิ่งหนึ่งๆ ของนักวิ่งคนหนึ่ง
exports.updateRunOfRunner = async (req, res) => {
  try {
    let result;
    // เอาข้อมูลที่ส่งมาจาก client/user
    if (req.file) {
      // แก้แบบมีการอัปโหลดไฟล์
      result = await prisma.run_tb.update({
        where: {
          runId: parseInt(req.params.runId),
        },
        data: {
          dateRun: req.body.dateRun,
          distanceRun: parseFloat(req.body.distanceRun),
          placeRun: req.body.placeRun,
          runImage: req.file.path.replace("images\\run\\", ""),
          runnerId: parseInt(req.body.runnerId),
        },
      });
    } else {
      // แก้แบบไม่มีการอัปโหลดไฟล์
      result = await prisma.run_tb.update({
        where: {
          runId: parseInt(req.params.runId),
        },
        data: {
          dateRun: req.body.dateRun,
          distanceRun: parseFloat(req.body.distanceRun),
          placeRun: req.body.placeRun,
          runnerId: parseInt(req.body.runnerId),
        },
      });
    }

    res.status(200).json({
      message: "Update data successfully",
      data: result,
    });
  } catch (err) {
    res.status(500).json({ message: `ERROR:  ${err}` });
  }
};
