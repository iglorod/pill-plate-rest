const express = require('express');
const router = express.Router();

const checkAuth = require('../middleware/check-auth');
const commentController = require('../controllers/comments');

router.get('/:idMessage', checkAuth, commentController.getComment);

router.post('/:idMessage', checkAuth, commentController.postComment);

router.patch('/:idComment', checkAuth, commentController.patchComment);

router.delete('/:idComment', checkAuth, commentController.removeComment);

module.exports = router;