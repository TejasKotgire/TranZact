const express = require('express');
const { signup, signin, update, bulk } = require('../controllers/user.controllers');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router()

router.post('/signup', signup)
router.post('/signin', signin)
router.put('/', authMiddleware, update)
router.get('/bulk', authMiddleware, bulk)

module.exports = router;