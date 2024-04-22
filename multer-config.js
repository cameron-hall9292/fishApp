



const multer = require("multer");


//disk storage

// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, "./images")
//     },
//     filename: (req, file, cb) => {
//         cb(null, Date.now() + '--' + file.originalname)
//     }
// })


//memory storage

const storage = multer.memoryStorage();

const upload = multer({ storage: storage});



module.exports = upload;