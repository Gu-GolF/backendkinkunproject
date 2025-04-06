const express = require("express");
require("dotenv").config();

//สร้าง Web server ด้วย Express
const app = express();


//กำหนดหมายเลขพอร์ตเพื่อรอรับการเข้าใช้งาน Web server
const PORT = process.env.PORT;

//ตัว Middleware จะใช้ในการจัดการ งานต่างๆ ของ Web server
app.use(cors()); // ใช้ CORS เพื่อให้สามารถเข้าถึง API จากหน้า web อื่น ๆ ได้
app.use(express.json()); // ใช้เพื่อให้ Web server รอรับข้อมูล เพื่อให้สามารถรับและส่งข้อมูล JSON ได้
//บอก Web server ว่าจะใช้ URL ที่มี Prefix อะไรบ้าง
app.use('/user', require('./routes/user'));
app.use('/kinkun', require('./routes/kinkun'));

//บอก Webserver ในการใช้งานไฟล์ในโฟลเดอร์ image
app.use('/image/user', express.static('image/user'));
app.use('/image/kinkun', express.static('image/kinkun'));
//คำสั่งเพื่อใช้ทดสอบการเข้าใช้งาน Web server (หากไม่ใช้ลบทิ้งได้ หรือจะคอมเมนต์ออกไป หรือจะปล่อยไว้เฉยๆก็ได้)
app.get("/", (req, res) => {
    res.json({ message: "ยินดีต้อนรับสู่ Web server ของเรา!..." });
});

//สร้างคำสั่งให้ Web server รอรับการเข้าใช้งานที่พอร์ตที่กําหนด
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});