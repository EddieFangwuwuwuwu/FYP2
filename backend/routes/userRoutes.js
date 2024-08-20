const express = require('express');
const router = express.Router();
const userController = require('../controller/userController');

function authenticateUser(req, res, next) {
    if (req.session.user) {  // Assuming user info is stored in req.session.user after login
        next();
    } else {
        res.status(401).send({ message: 'Unauthorized' });
    }
}


router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);
router.post('/addNewCard',userController.addNewCard);
router.post('/createCategory',authenticateUser,userController.createCate);
router.get('/cards', userController.getAllCards);
router.get('/categories', userController.getAllCategories);
router.post('/addCardsToCategory', authenticateUser, userController.addCardsToCategory);
router.get('/cards/category/:categoryId', authenticateUser, userController.getCardsForCategory);


module.exports = router;
