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

//ฟังก์ชันเพิ่ม user-------------------------------------------------------------------------------------------
exports.createKinkun = async (req, res) => {
    try {

    }catch (err) {
        res.status(500).json({ message: `พบปัญหาในการทำงาน ${err.message }`});
}
}
//---------------------------------------------------------------------------------------------------------
//ฟังก์ชันเพิ่มข้อมูลการกินในตาราง kinkun_tb---------------------------------------------------------------------------
exports.editKinkun = async (req, res) => {
    try {

    }catch (err) {
        res.status(500).json({ message: `พบปัญหาในการทำงาน ${err.message }`});
}
}
//----------------  ----------------------------------------------------------------------------

//ฟังก์ชันเพิ่มข้อมูลการกินในตาราง kinkun_tb---------------------------------------------------------------------------
exports.deleteKinkun = async (req, res) => {
    try {

    }catch (err) {
        res.status(500).json({ message: `พบปัญหาในการทำงาน ${err.message }`});
}
}

//ฟังก์ชันแก้ไข user
exports.showAllKinkun = async (req, res) => {
    try {

    }catch (err) {
        res.status(500).json({ message: `พบปัญหาในการทำงาน ${err.message }`});
}
}

//ฟังก์ชันแก้ไข user
exports.showonlyKinkun = async (req, res) => {
    try {

    }catch (err) {
        res.status(500).json({ message: `พบปัญหาในการทำงาน ${err.message }`});
}
}