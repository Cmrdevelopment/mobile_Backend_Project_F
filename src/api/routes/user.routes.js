const { isAuth } = require('../../middleware/auth.middleware');
const { upload } = require('../../middleware/files.middleware');
const {
  registerSlow,
  sendCode,
  registerWithRedirect,
  login,
  changeForgottenPassword,
  sendPassword,
  changePassword,
  update,
  deleteUser,
  getAll,
  getById,
  checkNewUser,
  changeEmail,
  sendNewCode,
  verifyNewEmail,
  autoLogin,
  resendCode,
} = require('../controllers/user.controllers');

const express = require('express');
const UserRoutes = express.Router();

UserRoutes.get('/', getAll);
UserRoutes.get('/:id', getById);
UserRoutes.get('/register', upload.single('image'), registerWithRedirect);
UserRoutes.post('/register', upload.single('image'), registerSlow);
UserRoutes.patch('/forgotpassword/forgotpassword/', changeForgottenPassword);
UserRoutes.post('/login', login);
UserRoutes.patch('/changepassword', [isAuth], changePassword);
UserRoutes.patch('/update/update', [isAuth], upload.single('image'), update);
UserRoutes.delete('/', [isAuth], deleteUser);
UserRoutes.post('/check', checkNewUser);
UserRoutes.post('/changeEmail/', [isAuth], changeEmail);
UserRoutes.post('/verifyNewEmail', [isAuth], verifyNewEmail);
UserRoutes.post('/login/autologin', autoLogin);
UserRoutes.post('/resend', resendCode);

//!---------------- REDIRECT-------------------------------
UserRoutes.get('/register/sendMail/:id', sendCode);
UserRoutes.patch('/sendPassword/:id', sendPassword);
UserRoutes.get('/sendNewCode/:id', [isAuth], sendNewCode);

module.exports = UserRoutes;
