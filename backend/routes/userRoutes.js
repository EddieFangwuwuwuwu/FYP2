const express = require('express');
const router = express.Router();
const userController = require('../controller/userController');

router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);
router.post('/addNewCard',userController.addNewCard);
router.post('/createCategory',userController.createCate);
router.get('/cards', userController.getAllCards);
router.get('/categories', userController.getAllCategories);


module.exports = router;
