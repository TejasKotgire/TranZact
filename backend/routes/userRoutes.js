const express = require('express');
const { signup, signin, update } = require('../controllers/user.controllers');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router()

router.post('/signup', signup)
router.post('/signin', signin)
router.put('/', authMiddleware, update)

module.exports = router;