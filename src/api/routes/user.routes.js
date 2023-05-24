const { isAuth } = require('../../middleware/auth.middleware');
const { upload } = require('../../middleware/files.middleware');
const {
  registerSlow,
  sendCode,
  registerWithRedirect,
  login,
  changeForgottenPassword,
  sendPasswordByEmail,
  changePassword,
  update,
  deleteUser,
  getAll,
  getById,
  checkNewUser,
} = require('../controllers/user.controllers');

const express = require('express');
const UserRoutes = express.Router();

UserRoutes.get('/', getAll);
UserRoutes.get('/:id', getById);
UserRoutes.get('/register', upload.single('image'), registerWithRedirect);
UserRoutes.post('/register', upload.single('image'), registerSlow);
UserRoutes.get('/forgotpassword/forgotpassword/', changeForgottenPassword);
UserRoutes.post('/login', login);
UserRoutes.patch('/changepassword', [isAuth], changePassword);
UserRoutes.patch('/update/update', [isAuth], upload.single('image'), update);
UserRoutes.delete('/', [isAuth], deleteUser);
UserRoutes.post('/check', checkNewUser);

//!---------------- REDIRECT-------------------------------
UserRoutes.get('/register/sendMail/:id', sendCode);
UserRoutes.get('/sendPasswordByEmail/:id', sendPasswordByEmail);

module.exports = UserRoutes;
