const multer = require('multer');

exports.fileStorage = multer.diskStorage({
    destination: function (req, file, cb)  {
        cb(null, './uploads/files/');
    },
    filename: function  (req, file, cb) {
        cb(null, new Date().getTime() + file.originalname);
    },
});

exports.imageStorage = multer.diskStorage({
    destination: function (req, file, cb)  {
        cb(null, './uploads/images/');
    },
    filename: function  (req, file, cb) {
        cb(null, new Date().getTime() + file.originalname);
    },
});

exports.videoStorage = multer.diskStorage({
    destination: function (req, file, cb)  {
        cb(null, './uploads/videos/');
    },
    filename: function  (req, file, cb) {
        cb(null, new Date().getTime() + file.originalname);
    },
});