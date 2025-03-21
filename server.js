const express = require("express");
const cors = require("cors");
const runnerRoutes = require("./routes/runner.routes.js");
const runRoutes = require("./routes/run.routes.js");
const path = require("path");

require("dotenv").config();

const app = express(); // สร้าง Web Server ด้วย Express

const port = process.env.PORT || 4444; // กำหนด Port ที่ Web Server จะใช้

// CORS configuration
const corsOptions = {
  origin: "*", // อนุญาตทุก origin หรือกำหนดเฉพาะโดเมนเว็บไซต์ฟรอนต์เอนด์ของคุณ
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions)); // ใช้งาน cors สำหรับการทำงานร่วมกับ Web Server อื่นๆ
app.use(express.json()); // ใช้งาน express.json() สำหรับการทำงานร่วมกับ JSON

app.use("/runner", runnerRoutes); // กำหนดเส้นทางการเข้าถึง resouces ใน Web Server
app.use("/run", runRoutes); // กำหนดเส้นทางการเข้าถึง resouces ใน Web Server

// ตรวจสอบว่ากำลังทำงานใน Vercel หรือไม่
const isVercel = process.env.VERCEL === "1";

// กำหนดเส้นทางการเข้าถึงไฟล์ภาพ
if (!isVercel) {
  // ถ้าไม่ได้ทำงานบน Vercel ใช้ static middleware ปกติ
  app.use("/images/runner", express.static("images/runner"));
  app.use("/images/run", express.static("images/run"));
} else {
  // หมายเหตุ: ในการ deploy จริงบน Vercel ควรใช้บริการ Cloud Storage ภายนอก
  // เช่น AWS S3, Cloudinary หรือ Firebase Storage สำหรับจัดเก็บไฟล์ภาพ
  app.get("/images/:folder/:file", (req, res) => {
    res
      .status(404)
      .json({ error: "File storage not available in serverless environment" });
  });
}

// เขียนคำสั่งเพื่อเทส เพื่อให้ client/user เข้าถึง resouces ใน Web Server
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to backend run server service",
    environment: process.env.VERCEL ? "Vercel" : "Development",
    timestamp: new Date().toISOString(),
  });
});

// API health check
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "OK", timestamp: new Date().toISOString() });
});

// คำสั่งที่ใช้เปิด Web Server เพื่อให้ client/user เข้าถึง resouces ใน Web Server
// ในการ Deploy บน Vercel เราไม่จำเป็นต้องทำ listen ด้วยตัวเอง
// แต่เราจะทำถ้ากำลังรันบนเครื่อง local
if (!process.env.VERCEL) {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}

// Export app สำหรับ Vercel Serverless Functions
module.exports = app;
