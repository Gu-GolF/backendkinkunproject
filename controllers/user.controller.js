//ไฟล์นี้จะประกอบด้วยฟังก์ชันในการทำงานต่างๆกับตารางในฐานข้อมูลผ่าานทาง prisma
//ทำงานกับตาราง CRUD ได้แก่ Create เพิ่ม, Read  ค้นหา-ตรวจสอบ-ดึง-ดู, Update แก้ไข, Delete ลบ
const e = require("express");
const multer = require("multer"); //ใช้ในการอัปโหลดไฟล์
const path = require("path"); //ใช้สำหรับการจัดการกับที่อยู่ของไฟล์

//ฟังก์ชันอัปโหลดไฟล์รูป
//1.สร้างที่อยู่สำหรับการเก็บไฟล์ที่อัปโหลด และเปลี่ยนชื่อไฟล์ที่อัปโหลดเพื่อไม่ให้ชื่อไฟล์ซ้ํากัน
const storage = multer.diskStorage({
    destination: (req, file, cb) =>{
        cb(null, 'image/user');
    },
    filename: (req, file, cb) => {
        cb(null, 'user' + Math.floor(Math.random() * Date.now()) + path.extname(file.originalname));
    }
    });
exports.upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 50
    },
    fileFilter: (req, file, cb) => {
        const fileTypes = /jpeg|jpg|png|gif/;
        const mimeType = fileTypes.test(file.mimetype);
        const extname = fileTypes.test(path.extname(file.originalname).toLowerCase()); //ตรวจสอบชื่อไฟล์
        if(mimeType && extname){
            return cb(null, true); //อนุญาตให้ไฟล์ที่อัปโหลดผ่านการตรวจสอบ
        } else {
        cb('Error: File upload only supports the following types - ' + fileTypes);
    }
}
});
//--------------------------------------------------------------------------------------------------------

//ฟังก์ชันเพิ่ม user-------------------------------------------------------------------------------------------
exports.createUser = async (req, res) => {
    try {

    }catch (err) {
        res.status(500).json({ message: `พบปัญหาในการทำงาน ${err.message }`});
}
}
//---------------------------------------------------------------------------------------------------------


//ฟังก์ชัน login เพื่อตรวจสอบ อีเมลและรหัสผ่าน สําหรับการเข้าสู่ระบบ
exports.checkLogin = async (req, res) => {
    try {
//คำสั่งการทำงานหชกับฐานข้อมูลผ่าน prisma
    }catch (err) {
        res.status(500).json({ message: `พบปัญหาในการทำงาน ${err.message }`});
}
}
//ฟังก์ชันแก้ไข user
exports.editUser = async (req, res) => {
    try {

    }catch (err) {
        res.status(500).json({ message: `พบปัญหาในการทำงาน ${err.message }`});
}
}