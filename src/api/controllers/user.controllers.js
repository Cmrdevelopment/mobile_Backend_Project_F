const { deleteImgCloudinary } = require('../../middleware/files.middleware');
const randomCode = require('../../utils/randomCode');
const sendConfirmationCodeByEmail = require('../../utils/sendConfirmationCodeByEmail');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
dotenv.config();
const User = require('../models/user.model');
const { getTestEmailSend } = require('../../state/state.data');
const nodemailer = require('nodemailer');
const { generateToken } = require('../../utils/token');
const randomPassword = require('../../utils/randomPassword');
const { UserErrors, UserSuccess } = require('../../helpers/jsonResponseMsgs');
const { setError } = require('../../helpers/handle-error');
const MobileDev = require('../models/MobileDev.model');
const App = require('../models/App.model');

const PORT = process.env.PORT;
const BASE_URL = process.env.BASE_URL;
const BASE_URL_COMPLETE = `${BASE_URL}${PORT}`;

//! -----------------------------------------------------------------------------
//? ----------------------------REGISTER CORTO EN CODIGO ------------------------
//! -----------------------------------------------------------------------------

const register = async (req, res, next) => {
  let catchImg = req.file?.path;
  try {
    let confirmationCode = randomCode();
    const { email, name } = req.body;

    const userExist = await User.findOne({ email }, { name });

    if (!userExist) {
      const newUser = new User({ ...req.body, confirmationCode });
      if (req.file) {
        newUser.image = req.file.path;
      } else {
        newUser.image = 'https://pic.onlinewebfonts.com/svg/img_181369.png';
      }

      const userSave = await newUser.save();

      if (userSave) {
        sendConfirmationCodeByEmail(email, name, confirmationCode);

        setTimeout(() => {
          if (getTestEmailSend()) {
            return res.status(200).json({
              user: userSave,
              confirmationCode,
            });
          } else {
            return res.status(404).json({
              user: userSave,
              confirmationCode: 'Error, resend code',
            });
          }
        }, 1100);
      }
    } else {
      if (req.file) deleteImgCloudinary(catchImg);

      return res.status(409).json('This user already exist');
    }
  } catch (error) {
    if (req.file) deleteImgCloudinary(catchImg);
    return next(error);
  }
};

//! -----------------------------------------------------------------------------
//? ----------------------------REGISTER LARGO EN CODIGO ------------------------
//! -----------------------------------------------------------------------------
const registerSlow = async (req, res, next) => {
  let catchImg = req.file?.path;
  try {
    let confirmationCode = randomCode();
    const userEmail = req.body.email;
    const userName = req.body.name;

    const userExist = await User.findOne(
      { email: userEmail },
      { name: userName }
    );

    if (!userExist) {
      const newUser = new User({ ...req.body, confirmationCode });
      if (req.file) {
        newUser.image = req.file.path;
      } else {
        newUser.image = 'https://pic.onlinewebfonts.com/svg/img_181369.png';
      }

      const userSave = await newUser.save();

      if (userSave) {
        const nodemailer_email = process.env.NODEMAILER_EMAIL;
        const nodemailer_password = process.env.NODEMAILER_PASSWORD;

        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: nodemailer_email,
            pass: nodemailer_password,
          },
        });

        const mailOptions = {
          from: nodemailer_email,
          to: userEmail,
          subject: 'Confirmation code',
          text: `Hola! Tu codigo es ${confirmationCode}, gracias por confiar en nosotros ${userName}`,
        };

        transporter.sendMail(mailOptions, function (error) {
          if (error) {
            return res.status(404).json({
              user: userSave,
              confirmationCode: 'Error, resend code',
            });
          } else {
            return res.status(200).json({
              user: userSave,
              confirmationCode,
            });
          }
        });
      }
    } else {
      if (req.file) deleteImgCloudinary(catchImg);
      return res.status(409).json('This user already exist');
    }
  } catch (error) {
    if (req.file) deleteImgCloudinary(catchImg);
    return next(error);
  }
};
//! -----------------------------------------------------------------------------
//? ----------------------------REGISTER CON REDIRECT----------------------------
//! -----------------------------------------------------------------------------
const registerWithRedirect = async (req, res, next) => {
  let catchImg = req.file?.path;

  try {
    let confirmationCode = randomCode();

    const userExist = await User.findOne(
      { email: req.body.email },
      { name: req.body.name }
    );
    if (!userExist) {
      const newUser = new User({ ...req.body, confirmationCode });
      if (req.file) {
        newUser.image = req.file.path;
      } else {
        newUser.image = 'https://pic.onlinewebfonts.com/svg/img_181369.png';
      }

      const userSave = await newUser.save();

      if (userSave) {
        return res.redirect(
          `${BASE_URL_COMPLETE}/api/v1/users/register/sendMail/${userSave._id}`
        );
      }
    } else {
      if (req.file) deleteImgCloudinary(catchImg);
      return res.status(409).json('This user already exist');
    }
  } catch (error) {
    if (req.file) deleteImgCloudinary(catchImg);
    return next(error);
  }
};

//! -----------------------------------------------------------------------------
//? ------------------ CONTRALADORES QUE PUEDEN SER REDIRECT --------------------
//! ----------------------------------------------------------------------------

//!!! los controladores redirect son aquellos que son llamados por parte del
//!!! cliente (los routers) o bien por otros controladores

const sendCode = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userDB = await User.findById(id);

    const emailEnv = process.env.NODEMAILER_EMAIL;
    const password = process.env.NODEMAILER_PASSWORD;

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: emailEnv,
        pass: password,
      },
    });

    const mailOptions = {
      from: emailEnv,
      to: userDB.email,
      subject: 'Confirmation code',
      text: `Hola! Tu codigo es ${userDB.confirmationCode}, gracias por confiar en nosotros ${userDB.name}`,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
        return res.status(404).json({
          user: userDB,
          confirmationCode: 'Error, resend code',
        });
      } else {
        console.log('Email sent: ' + info.response);
        return res.status(200).json({
          user: userDB,
          confirmationCode: userDB.confirmationCode,
        });
      }
    });
  } catch (error) {
    return next(error);
  }
};

//! -----------------------------------------------------------------------------
//? --------------------------------LOGIN ---------------------------------------
//! -----------------------------------------------------------------------------

const login = async (req, res, next) => {
  try {
    const userEmail = req.body.email;
    const userPassword = req.body.password;

    const userDB = await User.findOne({ email: userEmail });

    console.log('User email: ', userEmail);
    console.log('userDB: ', userDB);
    console.log('User password: ', userPassword);

    if (userDB) {
      if (bcrypt.compareSync(userPassword, userDB.password)) {
        const token = generateToken(userDB._id, userEmail);
        return res.status(200).json({
          user: userDB,
          token,
        });
      } else {
        return res.status(404).json('Passwords dont match');
      }
    } else {
      return res.status(404).json('User not registered');
    }
  } catch (error) {
    return next(error);
  }
};

//! -----------------------------------------------------------------------------
//? -----------------------CONTRASEÑAS Y SUS CAMBIOS-----------------------------
//! -----------------------------------------------------------------------------

//? -----------------------------------------------------------------------------
//! ------------------CAMBIO DE CONTRASEÑA CUANDO NO ESTAS LOGADO---------------
//? -----------------------------------------------------------------------------

const changeForgottenPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const userDb = await User.findOne({ email });
    if (userDb) {
      return res.redirect(
        `${BASE_URL_COMPLETE}/api/v1/users/sendPasswordByEmail/${userDb._id}`
      );
    } else {
      return res.status(404).json(UserErrors.FAIL_REGISTRERING_USER);
    }
  } catch (error) {
    console.log(error);
  }
};

const sendPasswordByEmail = async (req, res, next) => {
  try {
    const { id } = req.params;

    const userDb = await User.findById(id);

    const nodemailer_email = process.env.NODEMAILER_EMAIL;
    const nodemailer_password = process.env.NODEMAILER_PASSWORD;

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: nodemailer_email,
        pass: nodemailer_password,
      },
    });

    let randomPasswordSecure = randomPassword();

    const mailOptions = {
      from: nodemailer_email,
      to: userDb.email,
      subject: '-----',
      text: `User: ${userDb.name}. Your new code login is ${randomPasswordSecure} 
      We sent you this msg because we recived a password change request,
      if you didn't made it, please contact us!`,
    };

    transporter.sendMail(mailOptions, async function (error) {
      if (error) {
        return res.status(404).json('dont send email and dont update user');
      } else {
        const newPasswordBcrypt = bcrypt.hashSync(randomPasswordSecure, 10);
        await User.findByIdAndUpdate(id, { password: newPasswordBcrypt });
        const updatedUser = await User.findById(id);

        if (bcrypt.compareSync(randomPasswordSecure, updatedUser.password)) {
          return res.status(200).json({
            updateUser: true,
            sendPassword: true,
          });
        } else {
          return res.status(404).json({
            updateUser: false,
            sendPassword: true,
          });
        }
      }
    });
  } catch (error) {
    return next(error);
  }
};

//? -----------------------------------------------------------------------------
//! ------------------CAMBIO DE CONTRASEÑA CUANDO YA SE ESTA LOGEADO---------------
//? -----------------------------------------------------------------------------

const changePassword = async (req, res, next) => {
  try {
    const { password, newPassword } = req.body;

    const { _id } = req.user;

    if (bcrypt.compareSync(password, req.user.password)) {
      const newPasswordHashed = bcrypt.hashSync(newPassword, 10);

      await User.findByIdAndUpdate(_id, { password: newPasswordHashed });

      const userUpdate = await User.findById(_id);

      if (bcrypt.compareSync(newPassword, userUpdate.password)) {
        return res.status(200).json({
          updateUser: true,
        });
      } else {
        return res.status(200).json({
          updateUser: false,
        });
      }
    } else {
      return res.status(404).json(UserErrors.FAIL_MATCHING_PASSWORDS);
    }
  } catch (error) {
    return next(error);
  }
};

//! -----------------------------------------------------------------------------
//? ---------------------------------UPDATE-------------------------------------- // AQUÍ
//! -----------------------------------------------------------------------------
const update = async (req, res, next) => {
  //let catchImg = req.file?.path;
  let catchImg = req.body.image;

  try {
    const filterBody = {
      name: req.body.name,
      gender: req.body.gender,
    };
    const patchUser = new User(filterBody);

    if (req.file) {
      patchUser.image = req.file.path;
    }

    patchUser._id = req.user._id;
    patchUser.password = req.user.password;
    patchUser.rol = req.user.rol;

    await User.findByIdAndUpdate(req.user._id, patchUser);

    if (req.file) {
      deleteImgCloudinary(req.user.image);
    }

    const updateUser = await User.findById(req.user._id);
    const updateKeys = Object.keys(req.body);

    const testUpdate = [];
    updateKeys.forEach((key) => {
      if (updateUser[key] === req.body[key]) {
        testUpdate.push({
          [key]: true,
        });
      }
    });
    const MobileDev = require('../models/MobileDev.model');
    const App = require('../models/App.model');
    if (req.file) {
      updateUser.image == req.file.path
        ? testUpdate.push({
            file: true,
          })
        : testUpdate.push({
            file: false,
          });
    }

    return res.status(200).json({
      testUpdate,
    });
  } catch (error) {
    deleteImgCloudinary(catchImg);
    return next(error);
  }
};

//! -----------------------------------------------------------------------------
//? ----------------------------- DELETE ----------------------------------------
//! -----------------------------------------------------------------------------
const deleteUser = async (req, res, next) => {
  try {
    const { _id, image } = req.user;

    await User.findByIdAndDelete(_id);
    if (await User.findById(_id)) {
      return res.status(404).json(UserErrors.FAIL_DELETING_USER);
    } else {
      deleteImgCloudinary(image);
      await App.updateMany(
        { users: _id },
        {
          $pull: { users: _id },
        }
      );
      await MobileDev.updateMany(
        { users: _id },
        {
          $pull: { users: _id },
        }
      );
      return res.status(200).json(UserSuccess.SUCCESS_DELETING_USER);
    }
  } catch (error) {
    deleteImgCloudinary(req.user.image);
    return next(error);
  }
};

//! ---------------------------------------------------------------------
//? ------------------------------GETALL --------------------------------
//! ---------------------------------------------------------------------
const getAll = async (req, res, next) => {
  try {
    const allUsers = await User.find().populate('mobileDevs').populate(`apps`);
    if (allUsers) {
      return res.status(200).json(allUsers);
    } else {
      return res.status(404).json('No users found');
    }
  } catch (error) {
    return next(error);
  }
};

//! ---------------------------------------------------------------------
//? ------------------------------GETBYID -------------------------------
//! ---------------------------------------------------------------------
const getById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userById = await User.findById(id).populate('mobileDevs');
    if (userById) {
      return res.status(200).json(userById);
    } else {
      return res.status(404).json('No user found');
    }
  } catch (error) {
    return next(error);
  }
};

//! ------------------------------------------------------------------------
//? -------------------------- CHECK NEW USER------------------------------
//! ------------------------------------------------------------------------

const checkNewUser = async (req, res, next) => {
  try {
    const { email, confirmationCode } = req.body;
    const userExists = await User.findOne({ email });
    if (!userExists) {
      return res.status(404).json(UserErrors.FAIL_SEARCHING_USER);
    } else {
      // cogemos que comparamos que el codigo que recibimos por la req.body y el del userExists es igual
      if (confirmationCode === userExists.confirmationCode) {
        // si es igual actualizamos la propiedad check y la ponemos a true
        await userExists.updateOne({ check: true });
        // hacemos un testeo de que este user se ha actualizado correctamente, hacemos un findOne
        const updateUser = await User.findOne({ email });

        // este finOne nos sirve para hacer un ternario que nos diga si la propiedad vale true o false
        return res.status(200).json({
          testCheckOk: updateUser.check == true ? true : false,
        });
      } else {
        /// En caso dec equivocarse con el codigo lo borramos de la base datos y lo mandamos al registro
        await User.findByIdAndDelete(userExists._id);

        // borramos la imagen
        deleteImgCloudinary(userExists.image);

        // devolvemos un 200 con el test de ver si el delete se ha hecho correctamente
        return res.status(200).json({
          userExists,
          check: false,
          delete: (await User.findById(userExists._id))
            ? UserErrors.FAIL_DELETING_USER
            : UserSuccess.SUCCESS_DELETING_USER,
        });
      }
    }
  } catch (error) {
    // siempre en el catch devolvemos un 500 con el error general
    return next(setError(500, 'General error, check code'));
  }
};

//! ------------------------------------------------------------------------
//? ------------CHANGE EMAIL y CONFIRMATION OF CHANGED EMAIL----------------
//! ------------------------------------------------------------------------

const changeEmail = async (req, res, next) => {
  try {
    await User.syncIndexes();
    let confirmationCode = randomCode();
    const { email } = req.body;
    if (req.user.email != email) {
      await User.findByIdAndUpdate(req.user._id, {
        emailChange: email,
        check: false,
        confirmationCode: confirmationCode,
      });

      return res.redirect(
        `${BASE_URL_COMPLETE}/api/v1/users/sendNewCode/${req.user._id}`
      );
    } else {
      return res.status(404).json('Debe meter un email distinto al anterior');
    }
  } catch (error) {
    return next(error);
  }
};
const sendNewCode = async (req, res, next) => {
  console.log('despues redirect', req.body);
  try {
    const { id } = req.params;
    const userDB = await User.findById(id);
    const nodemailerEmail = process.env.NODEMAILER_EMAIL;
    const nodemailerPassword = process.env.NODEMAILER_PASSWORD;

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: nodemailerEmail,
        pass: nodemailerPassword,
      },
    });

    const mailOptions = {
      from: nodemailerEmail,
      to: userDB.emailChange,
      subject: 'Confirmation code email change',
      text: `${userDB.name} you requested an email change, please insert the following confirmation code: ${userDB.confirmationCode} `,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return res.status(404).json({
          user: userDB,
          confirmationCode: UserErrors.FAIL_CHANGING_USER_EMAIL,
        });
      } else {
        console.log('email sent: ' + info.response);
        return res.status(200).json({
          email: UserSuccess.SUCCESS_CHANGING_USER_EMAIL,
          confirmationCode: userDB.confirmationCode,
        });
      }
    });
  } catch (error) {
    return next(error);
  }
};

//! ------------------------------------------------------------------------
//? -------------------------- VERIFY NEW EMAIL------------------------------
//! ------------------------------------------------------------------------

const verifyNewEmail = async (req, res, next) => {
  try {
    const { email, confirmationCode, emailChange } = req.body;
    const userExists = await User.findOne({ email });
    if (!userExists) {
      return res.status(404).json(UserErrors.FAIL_SEARCHING_USER);
    } else {
      if (confirmationCode === userExists.confirmationCode) {
        if (emailChange !== email) {
          await userExists.updateOne({
            check: true,
            email: emailChange,
            emailChange: emailChange,
          });
          const updateUser = await User.findOne({ email: emailChange });
          return res.status(200).json({
            testCheckOk: updateUser.check == true ? true : false,
          });
        } else {
          return res
            .status(400)
            .json(
              'El correo electrónico nuevo debe ser diferente al correo electrónico actual'
            );
        }
      } else {
        await User.findByIdAndDelete(userExists._id);
        deleteImgCloudinary(userExists.image);
        return res.status(200).json({
          userExists,
          check: false,
          delete: (await User.findById(userExists._id))
            ? UserErrors.FAIL_DELETING_USER
            : UserSuccess.SUCCESS_DELETING_USER,
        });
      }
    }
  } catch (error) {
    return next(setError(500, 'General error, check code'));
  }
};

//! ------------------------------------------------------------------------
//? -------------------------- AUTOLOGIN ------------------------------
//! ------------------------------------------------------------------------

const autoLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const userDB = await User.findOne({ email });

    if (userDB) {
      if ((password, userDB.password)) {
        const token = generateToken(userDB._id, email);
        return res.status(200).json({
          user: userDB,
          token,
        });
      } else {
        return res.status(404).json('password dont match');
      }
    } else {
      return res.status(404).json('User no register');
    }
  } catch (error) {
    return next(error);
  }
};

//! ------------------------------------------------------------------------
//? -------------------------- RESEND CODE ------------------------------
//! ------------------------------------------------------------------------

const resendCode = async (req, res, next) => {
  try {
    //! vamos a configurar nodemailer porque tenemos que enviar un codigo
    const email = process.env.NODEMAILER_EMAIL;
    const password = process.env.NODEMAILER_PASSWORD;
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: email,
        pass: password,
      },
    });
    //! hay que ver que el usuario exista porque si no existe no tiene sentido hacer ninguna verificacion
    const userExists = await User.findOne({ email: req.body.email });

    if (userExists) {
      const mailOptions = {
        from: email,
        to: req.body.email,
        subject: 'Confirmation code',
        text: `tu codigo es ${userExists.confirmationCode}`,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
          return res.status(200).json({
            resend: true,
          });
        }
      });
    } else {
      return res.status(404).json('User not found');
    }
  } catch (error) {
    return next(setError(500, error.message || 'Error general send code'));
  }
};

module.exports = {
  register,
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
  changeEmail,
  sendNewCode,
  verifyNewEmail,
  autoLogin,
  resendCode,
};
