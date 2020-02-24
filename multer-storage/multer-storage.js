const aws = require('aws-sdk');
const multerS3 = require('multer-s3');

const s3 = new aws.S3({ 
    accessKeyId: process.env.AWS_ID,
    secretAccessKey: process.env.AWS_KEY,
    Bucket: 'pill-plate'
})

exports.fileStorage = multerS3({
    s3: s3,
    bucket: 'pill-plate/files',
    acl: 'public-read',
    key: function (req, file, cb) {
     cb(null, new Date().getTime() + file.originalname)
    }
});

exports.imageStorage = multerS3({
    s3: s3,
    bucket: 'pill-plate/images',
    acl: 'public-read',
    key: function (req, file, cb) {
     cb(null, new Date().getTime() + file.originalname)
    }
});

exports.videoStorage = multerS3({
    s3: s3,
    bucket: 'pill-plate/videos',
    acl: 'public-read',
    key: function (req, file, cb) {
     cb(null, new Date().getTime() + file.originalname)
    }
});

