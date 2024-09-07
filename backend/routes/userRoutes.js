const express = require('express');
const router = express.Router();
const userController = require('../controller/userController');  // Assuming you have a separate controller for card-related operations


function authenticateUser(req, res, next) {
    if (req.session.user) {  // Assuming user info is stored in req.session.user after login
        next();
    } else {
        res.status(401).send({ message: 'Unauthorized' });
    }
}

// User-related routes
router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);
router.post('/updateProfileInfo', authenticateUser, userController.updateProfileInfo);
router.post('/updateProfilePicture', authenticateUser, userController.updateProfilePicture);
router.get('/userProfile', authenticateUser, userController.getUserProfile);
router.get('/users', authenticateUser, userController.getAllUsers);  // New route to get all users
router.post('/generateTOTP', authenticateUser, userController.generateTOTP);
router.post('/verifyTOTP', authenticateUser, userController.verifyTOTP);
router.get('/checkPendingVerification', authenticateUser, userController.checkPendingVerification);
router.get('/getVerifiedUsers',authenticateUser,userController.getVerifiedUsers);


// Card-related routes
router.post('/addNewCard', authenticateUser, userController.addNewCard);
router.post('/createCategory', authenticateUser, userController.createCate);
router.get('/cards', authenticateUser, userController.getAllCards);
router.get('/categories', authenticateUser, userController.getAllCategories);
router.post('/addCardsToCategory', authenticateUser, userController.addCardsToCategory);
router.get('/cards/category/:categoryId', authenticateUser, userController.getCardsForCategory);
router.get('/fetchPendingSharedCards', authenticateUser, userController.fetchPendingSharedCards);
router.get('/getVerifiedSharedCards/:userId', authenticateUser, userController.getVerifiedSharedCards);

module.exports = router;
