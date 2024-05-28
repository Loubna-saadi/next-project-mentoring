// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const apiControllers = require('../controllers/ApiController');


router.post("/register", apiControllers.register);
router.post("/login", apiControllers.login);
router.get('/getUserInfo', apiControllers.getUserInfo);
router.get('/logout', apiControllers.logout);
router.get('/user/profile', apiControllers.getUserProfile);
router.get('/getAllMentors', apiControllers.getAllMentors);
router.get('/getMentor/:id', apiControllers.getMentorById);
router.get('/getClient/:id', apiControllers.getClientById);
router.post('/updatementordata/:id', apiControllers.updateMentor);
router.post('/updateuserdata/:id', apiControllers.updateClient);
router.post('/AddBooking', apiControllers.addBooking );
router.get('/bookings', apiControllers.bookings);
router.get('/appointments', apiControllers.appointments);
router.post('/AddReview', apiControllers.createReview);
router.get('/getAllReviews/:id', apiControllers.getAllReviews);
module.exports = router;
