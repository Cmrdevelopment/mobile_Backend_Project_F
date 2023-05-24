const App = require('../models/App.model');
const MobileDev = require('../models/MobileDev.model');
const User = require('../models/user.model');
const { AppErrors, AppSuccess } = require('../../helpers/jsonResponseMsgs');

//! ---------------------------------------------------------------------
//? -------------------------------CREATE ---------------------------------
//! ---------------------------------------------------------------------
const create = async (req, res, next) => {
  try {
    const filterBody = {
      appName: req.body.appName,
      category: req.body.category,
      codeLanguages: req.body.codeLanguages,
      appSize: req.body.appSize,
    };

    const newApp = new App(filterBody);
    const saveApp = await newApp.save();

    if (saveApp) {
      return res.status(200).json(saveApp);
    } else {
      return res.status(404).json(AppErrors.FAIL_CREATING_APP);
    }
  } catch (error) {
    return next(error);
  }
};

//! ---------------------------------------------------------------------
//? ------------------------------GET ALL -------------------------------
//! ---------------------------------------------------------------------

const getAll = async (req, res, next) => {
  try {
    const allApp = await App.find().populate('mobileDevs').populate('users');
    if (allApp) {
      return res.status(200).json(allApp);
    } else {
      return res.status(404).json(AppErrors.FAIL_SEARCHING_APP);
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
    const appById = await App.findById(id)
      .populate('mobileDevs')
      .populate('users');
    if (appById) {
      return res.status(200).json(appById);
    } else {
      return res.status(404).json(AppErrors.FAIL_SEARCHING_APP_BY_ID);
    }
  } catch (error) {
    return next(error);
  }
};

//! ---------------------------------------------------------------------
//? ----------------------------- GET BY APPNAME ------------------------
//! ---------------------------------------------------------------------

const getByAppName = async (req, res, next) => {
  try {
    const { appName } = req.params;

    const AppNameByName = await App.find({ appName });

    if (AppNameByName) {
      return res.status(200).json(AppNameByName);
    } else {
      return res.status(404).json(AppErrors.FAIL_SEARCHING_APP_BY_NAME);
    }
  } catch (error) {
    return next(error);
  }
};

//! ---------------------------------------------------------------------
//? ----------------------------- UPDATE --------------------------------
//! ---------------------------------------------------------------------

const updateApp = async (req, res, next) => {
  try {
    const filterBody = {
      appName: req.body.appName,
      category: req.body.category,
      codeLanguages: req.body.codeLanguages,
      appSize: req.body.appSize,
    };
    const { id } = req.params;
    const appById = await App.findById(id);
    if (appById) {
      const patchApp = new App(filterBody);
      patchApp._id = id;
      await App.findByIdAndUpdate(id, patchApp); // Guardar los cambios en la base de datos
      return res.status(200).json(await App.findById(id)); // Responder con el objeto actualizado
    } else {
      return res.status(404).json(AppErrors.FAIL_UPDATING_APP); // Manejar el caso cuando no se encuentra la aplicación
    }
  } catch (error) {
    return next(error);
  }
};

//! ---------------------------------------------------------------------
//? ------------------------------UPDATE MOBILEDEV-----------------------
//! ---------------------------------------------------------------------

const updateMobileDev = async (req, res, next) => {
  try {
    const { id } = req.params;
    const oldApp = await App.findByIdAndUpdate(id, req.body);
    if (oldApp) {
      return res.status(200).json({
        oldApp: oldApp,
        newApp: await App.findById(id),
        status: 'Succesfully updated!',
      });
    } else {
      return res.status(404).json(AppErrors.FAIL_UPDATING_APP);
    }
  } catch (error) {
    return next(error);
  }
};

//! ---------------------------------------------------------------------
//? ----------------------------- DELETE --------------------------------
//! ---------------------------------------------------------------------

const deleteApp = async (req, res, next) => {
  try {
    // We get the id from params
    const { id } = req.params;

    // We find by Id and remove it
    const deleteApp = await App.findByIdAndDelete(id);

    // deleteApp contains the removed element,
    // but sometimes dosen't work, so watch out!
    if (deleteApp) {
      // We check if the deleted element is in the DB,
      // if don't, we remove the image from Cloudinary
      // if the element was not remove, we call next and finish the execution
      if (await App.findById(id)) {
        // The App is still in the DB, so something went wrong
        // and we didn't delete it!
        // We can't do anything else, just report it!
        next(AppErrors.FAIL_DELETING_APP);
      } else {
        // The App was removed successfully!

        // delete image from cloudinary
        //deleteImgCloudinary(deleteApp.image);

        // Update the MobileDev collection, but just the Apps with the
        // Id id
        await MobileDev.updateMany(
          { Apps: id }, // filter elements to update them
          {
            // pull removes the elements
            // that math the filter { apps: id },
            $pull: { apps: id },
          }
        );
      }

      // If everithhing went ok, we return a 200 Ok.
      // Just in case, we realize a test to check if the mobileDev App
      // was removed correctly
      return res.status(200).json({
        deleteObject: deleteApp,
        test: (await App.findById(id))
          ? AppErrors.FAIL_DELETING_APP_TEST
          : AppSuccess.SUCCESS_DELETING_APP,
      });
    } else {
      return res.status(404).json(AppErrors.FAIL_DELETING_APP);
    }
  } catch (error) {
    return next(error);
  }
};
//! ---------------------------------------------------------------------
//? ------------------------------GETFAV --------------------------------
//! ---------------------------------------------------------------------
const toggleFavorite = async (req, res, next) => {
  try {
    const appFav = await App.findById(req.params.id); //--->App
    const user = await User.findById(req.user._id); //--->Nuestro user

    if (!appFav.users.includes(user._id)) {
      await appFav.updateOne({ $push: { users: user._id } });
      await user.updateOne({ $push: { apps: appFav._id } });
      res.status(200).json('Added to favourites!');
    } else {
      await appFav.updateOne({ $pull: { users: user._id } });
      await user.updateOne({ $pull: { apps: appFav._id } });
      res.status(200).json('Removed from favourites');
    }
  } catch (error) {
    return next('Error while adding app to favourites', error);
  }
};

module.exports = {
  create,
  getAll,
  getById,
  getByAppName,
  updateApp,
  deleteApp,
  toggleFavorite,
  updateMobileDev,
};
