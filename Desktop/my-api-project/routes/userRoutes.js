const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const verifyToken = require('../middleware/auth'); // ✅ correct import

router.post('/create', userController.createUserDb);
router.get('/db/:id', verifyToken, userController.getUserByIdDb); // ✅ protected route
router.get('/db', userController.getUsersDb);
router.get('/test', userController.getUserTest);
router.put('/:id', userController.updateUserDb);
router.delete('/destroy/:id', userController.deleteUserDb);
router.post('/login', userController.loginUser);


module.exports = router;
