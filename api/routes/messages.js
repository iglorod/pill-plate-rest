const express = require('express');
const router = express.Router();
const multer = require('multer');

const checkAuth = require('../middleware/check-auth');
const messageController = require('../controllers/messages');
const storage = require('../../multer-storage/multer-storage');

const uploadFile = multer({ storage: storage.fileStorage });
const uploadImage = multer({ storage: storage.imageStorage });
const uploadVideo = multer({ storage: storage.videoStorage });

router.get('/:idTopic', checkAuth, messageController.getMessages);

router.post('/text/:idTopic', checkAuth, messageController.postText);

router.post('/file/:idTopic', checkAuth, uploadFile.single('file'), messageController.postFileData);

router.post('/image/:idTopic', checkAuth, uploadImage.single('image'), messageController.postFileData);

router.post('/video/:idTopic', checkAuth, uploadVideo.single('video'), messageController.postFileData);

router.get('/single/:idMessage', checkAuth, messageController.getMessage);

router.patch('/single/text/:idMessage', checkAuth, messageController.patchMessage);

router.patch('/single/readers/:idMessage', checkAuth, messageController.patchReadersMessage);

router.post('/single/readers/:topicId', checkAuth, messageController.notReadedCountMessages);

router.delete('/single/:idMessage', checkAuth, messageController.removeMessage);

router.get('/filter/:idUser', checkAuth, messageController.getMessagesByType);

module.exports = router;
