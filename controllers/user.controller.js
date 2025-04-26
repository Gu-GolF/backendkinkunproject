//ไฟล์นี้จะประกอบด้วยฟังก์ชันในการทำงานต่างๆกับตารางในฐานข้อมูลผ่าานทาง prisma
//ทำงานกับตาราง CRUD ได้แก่ Create เพิ่ม, Read  ค้นหา-ตรวจสอบ-ดึง-ดู, Update แก้ไข, Delete ลบ
const multer = require("multer"); //ใช้ในการอัปโหลดไฟล์
const path = require("path"); //ใช้สำหรับการจัดการกับที่อยู่ของไฟล์
//ใช้ prisma ในการทำงานกับฐานข้อมูล
const { PrismaClient } = require("@prisma/client"); //ใช้ในการเชื่อมต่อกับฐานข้อมูล
const prisma = new PrismaClient(); //สร้าง client ในการเชื่อมต่อกับฐานข้อมูล

//ฟังก์ชันอัปโหลดไฟล์รูป
//1.สร้างที่อยู่สำหรับการเก็บไฟล์ที่อัปโหลด และเปลี่ยนชื่อไฟล์ที่อัปโหลดเพื่อไม่ให้ชื่อไฟล์ซ้ํากัน
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images/user");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      "user_" +
        Math.floor(Math.random() * Date.now()) +
        path.extname(file.originalname)
    );
  },
});

exports.upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 50,
  },
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png|gif/;
    const mimeType = fileTypes.test(file.mimetype);
    const extname = fileTypes.test(
      path.extname(file.originalname).toLowerCase()
    ); //ตรวจสอบชื่อไฟล์
    if (mimeType && extname) {
      return cb(null, true); //อนุญาตให้ไฟล์ที่อัปโหลดผ่านการตรวจสอบ
    } else {
      cb("Error: File upload only supports the following types - " + fileTypes);
    }
  },
}).single("userImage");
//--------------------------------------------------------------------------------------------------------

//ฟังก์ชันเพิ่ม user-------------------------------------------------------------------------------------------
exports.createUser = async (req, res) => {
  try {
    //คำสั่งการทำงานหชกับฐานข้อมูลผ่าน prisma
    const result = await prisma.user_tb.create({
      data: {
        userFullname: req.body.userFullname,
        userEmail: req.body.userEmail,
        userPassword: req.body.userPassword,
        userImage: req.file ? req.file.path.replace("images\\user\\", "") : "",
      },
    });
    //เมื่อทำงานสําเร็จให้ส่งค่ากลับไปยัง client
    res.status(201).json({
      message: "InsertOK",
      info: result,
    });
  } catch (err) {
    res.status(500).json({ message: `พบปัญหาในการทำงาน ${err.message}` });
  }
};
//---------------------------------------------------------------------------------------------------------

//ฟังก์ชัน login เพื่อตรวจสอบ อีเมลและรหัสผ่าน สําหรับการเข้าสู่ระบบ
exports.checkLogin = async (req, res) => {
  try {
    //คำสั่งการทำงานหชกับฐานข้อมูลผ่าน prisma
    const result = await prisma.user_tb.findFirst({
      //ระบุเงื่อนไขการค้นหา ตรวจสอบ ดึงดู
      where: {
        userEmail: req.params.userEmail,
        userPassword: req.params.userPassword,
      },
    });
    //เมื่อทำงานสําเร็จให้ส่งค่ากลับไปยัง client
    if (result) {
      //ตรวจสอบว่ามีข้อมูลหรือไม่
      res.status(200).json({
        message: "Get OK",
        info: result,
      });
    } else {
      res.status(404).json({
        message: "Get Not Found",
        info: result,
      });
    }
  } catch (err) {
    res.status(500).json({ message: `พบปัญหาในการทำงาน ${err.message}` });
  }
};
//ฟังก์ชันแก้ไข user
exports.editUser = async (req, res) => {
  try {
    let result = {};

    //ตรวจสอบว่ามีการอัปโหลดไฟล์หรือไม่
    if (req.file) {
    
      result = await prisma.user_tb.update({
        data: {
          userFullname: req.body.userFullname,
          userEmail: req.body.userEmail,
          userPassword: req.body.userPassword,
          userImage: req.file
            ? req.file.path.replace("images\\user\\", "")
            : "",
        }, //เงื่อนไขในการแก้ไข
        where: {
          userId: parseInt(req.params.userId),
        },
      });
    } else {
      result = await prisma.user_tb.update({
        data: {
          userFullname: req.body.userFullname,
          userEmail: req.body.userEmail,
          userPassword: req.body.userPassword,
        }, //เงื่อนไขในการแก้ไข
        where: {
          userId: parseInt(req.params.userId),
        },
      });
    }

    //เมื่อทำงานสําเร็จให้ส่งค่ากลับไปยัง client
    res.status(200).json({
      message: "Update OK",
      info: result,
    });
  } catch (err) {
    res.status(500).json({ message: `พบปัญหาในการทำงาน ${err.message}` });
  }
};
