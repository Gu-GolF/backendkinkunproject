const multer = require("multer"); //ใช้ในการอัปโหลดไฟล์
const path = require("path"); //ใช้สำหรับการจัดการกับที่อยู่ของไฟล์
//ใช้ prisma ในการทำงานกับฐานข้อมูล
const { PrismaClient } = require("@prisma/client"); //ใช้ในการเชื่อมต่อกับฐานข้อมูล
const prisma = new PrismaClient(); //สร้าง client ในการเชื่อมต่อกับฐานข้อมูล

//ฟังก์ชันอัปโหลดไฟล์รูป
//1.สร้างที่อยู่สำหรับการเก็บไฟล์ที่อัปโหลด และเปลี่ยนชื่อไฟล์ที่อัปโหลดเพื่อไม่ให้ชื่อไฟล์ซ้ํากัน
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images/kinkun");
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
}).single("kinkunImage");

//ฟังก์ชันเพิ่ม user-------------------------------------------------------------------------------------------
exports.createKinkun = async (req, res) => {
  try {
    const result = await prisma.kinkun_tb.create({
      data: {
        kinkunTitle: req.body.kinkunTitle,
        kinkunState: req.body.kinkunState,
        kinkunDate: req.body.kinkunDate,
        kinkunCost: parseFloat(req.body.kinkunCost),
        kinkunImage: req.file
          ? req.file.path.replace("images\\kinkun\\", "")
          : "",
        userId: parseInt(req.body.userId),
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
//ฟังก์ชันเพิ่มข้อมูลการกินในตาราง kinkun_tb---------------------------------------------------------------------------
exports.editKinkun = async (req, res) => {
  try {
    let result = {};

    //ตรวจสอบว่ามีการอัปโหลดไฟล์หรือไม่
    if (req.file) {
      // const kinkun = await prisma.kinkun_tb.findFirst({

      // })
      result = await prisma.kinkun_tb.update({
        data: {
          kinkunTitle: req.body.kinkunTitle,
          kinkunState: req.body.kinkunState,
          kinkunDate: req.body.kinkunDate,
          kinkunCost: parseFloat(req.body.kinkunCost),
          kinkunImage: req.file
            ? req.file.path.replace("images\\kinkun\\", "")
            : "",
          userId: parseInt(req.body.userId),
        }, //เงื่อนไขในการแก้ไข
        where: {
          kinkunId: parseInt(req.params.kinkunId),
        },
      });
    } else {
      result = await prisma.kinkun_tb.update({
        data: {
          kinkunTitle: req.body.kinkunTitle,
          kinkunState: req.body.kinkunState,
          kinkunDate: req.body.kinkunDate,
          kinkunCost: parseFloat(req.body.kinkunCost),
          userId: parseInt(req.body.userId),
        }, //เงื่อนไขในการแก้ไข
        where: {
          kinkunId: parseInt(req.params.kinkunId),
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
//----------------  ----------------------------------------------------------------------------

//ฟังก์ชันเพิ่มข้อมูลการกินในตาราง kinkun_tb---------------------------------------------------------------------------
exports.deleteKinkun = async (req, res) => {
  try {
    const result = await prisma.kinkun_tb.delete({
        where: {
          kinkunId: parseInt(req.params.kinkunId),},
      });
      //เมื่อทำงานสําเร็จให้ส่งค่ากลับไปยัง client
      res.status(200).json({
        message: "Delete OK",
        info: result,
      });
  } catch (err) {
    res.status(500).json({ message: `พบปัญหาในการทำงาน ${err.message}` });
  }
};

//ฟังก์ชันดึงข้อมูลจากตาราวกินกัน ของ user หนึ่งๆ----------------------------------------
exports.showAllKinkun = async (req, res) => {
  try {
    const result = await prisma.kinkun_tb.findMany({
      //ระบุเงื่อนไขการค้นหา ตรวจสอบ ดึงดู
      where: {
        userId: parseInt(req.params.userId),
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
exports.showOnlyKinkun = async (req, res) => {
  try {
    const result = await prisma.kinkun_tb.findFirst({
      //ระบุเงื่อนไขการค้นหา ตรวจสอบ ดึงดู
      where: {
        kinkunId: parseInt(req.params.kinkunId),
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
