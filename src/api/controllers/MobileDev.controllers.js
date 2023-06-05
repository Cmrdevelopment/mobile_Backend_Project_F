const {
  MobileDevErrors,
  MobileDevSuccess,
  AppErrors,
  AppSuccess,
} = require('../../helpers/jsonResponseMsgs');
const MobileDev = require('../models/MobileDev.model');
const App = require('../models/App.model');
const User = require('../models/user.model');

//! ---------------------------------------------------------------------
//? -------------------------------CREATE ---------------------------------
//! ---------------------------------------------------------------------
const create = async (req, res, next) => {
  try {
    const filterBody = {
      brand: req.body.brand,
      OS: req.body.OS,
      versionOS: req.body.versionOS,
      language: req.body.language,
      description: req.body.description,
      image: req.file.path,
    };

    const newMobileDev = new MobileDev(filterBody);
    const saveMobileDevs = await newMobileDev.save();

    if (saveMobileDevs) {
      return res.status(200).json(saveMobileDevs);
    } else {
      return res.status(404).json(MobileDevErrors.FAIL_CREATING_MOBILEDEV); //--->comentario feedback
    }
  } catch (error) {
    return next(error);
  }
};

//! ---------------------------------------------------------------------
//? ------------------------------GETALL --------------------------------
//! ---------------------------------------------------------------------

const getAll = async (req, res, next) => {
  try {
    const allMobileDevs = await MobileDev.find()
      .populate('apps')
      .populate('users');

    if (allMobileDevs) {
      return res.status(200).json(allMobileDevs);
    } else {
      return res.status(404).json(MobileDevErrors.FAIL_SEARCHING_MOBILEDEV);
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
    const mobileDevById = await MobileDev.findById(id)
      .populate('apps')
      .populate('users');
    if (mobileDevById) {
      return res.status(200).json(mobileDevById);
    } else {
      return res
        .status(404)
        .json(MobileDevErrors.FAIL_SEARCHING_MOBILEDEV_BY_ID);
    }
  } catch (error) {
    return next(error);
  }
};

//! ---------------------------------------------------------------------
//? ----------------------------- GET BY Brand ---------------------------
//! ---------------------------------------------------------------------

const getByBrand = async (req, res, next) => {
  try {
    const { brand } = req.params;

    const mobileDevByName = await MobileDev.find({ brand }).populate('apps');

    if (mobileDevByName) {
      return res.status(200).json(mobileDevByName);
    } else {
      return res
        .status(404)
        .json(MobileDevErrors.FAIL_SEARCHING_MOBILEDEV_BY_NAME);
    }
  } catch (error) {
    return next(error);
  }
};

//! ---------------------------------------------------------------------
//? ----------------------------- UPDATE --------------------------------
//! ---------------------------------------------------------------------

const updateMobileDev = async (req, res, next) => {
  try {
    const filterBody = {
      brand: req.body.brand,
      OS: req.body.OS,
      versionOS: req.body.versionOS,
      language: req.body.language,
    };
    const { id } = req.params;
    const mobilDevById = await MobileDev.findById(id);
    if (mobilDevById) {
      const patchApp = new MobileDev(filterBody);
      patchApp._id = id;
      await MobileDev.findByIdAndUpdate(id, patchApp); // Guardar los cambios en la base de datos
      return res.status(200).json(await MobileDev.findById(id)); // Responder con el objeto actualizado
    } else {
      return res.status(404).json(MobileDevErrors.FAIL_UPDATING_MOBILEDEV); // Manejar el caso cuando no se encuentra la aplicación
    }
  } catch (error) {
    return next(error);
  }
};

//! ---------------------------------------------------------------------
//? ----------------------------- DELETE --------------------------------
//! ---------------------------------------------------------------------

const deleteMobileDev = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleteMobileDev = await MobileDev.findByIdAndDelete(id);
    if (deleteMobileDev) {
      await App.updateMany({ mobileDevs: id }, { $pull: { mobileDevs: id } });
      await User.updateMany({ mobileDevs: id }, { $pull: { mobileDevs: id } });
      const testApp = await App.find({ mobileDevs: id });
      return res.status(200).json({
        deleteMobileDev: deleteMobileDev,
        testDelete: (await MobileDev.findById(id))
          ? MobileDevErrors.FAIL_DELETING_MOBILEDEV
          : MobileDevSuccess.SUCCESS_DELETING_MOBILEDEV,
        testUpdate:
          testApp.length > 0
            ? AppErrors.FAIL_UPDATING_APP
            : AppSuccess.SUCCESS_UPDATING_APP,
      });
    } else {
      return res.status(404).json(MobileDevErrors.FAIL_DELETING_MOBILEDEV);
    }
  } catch (error) {
    return next(error);
  }
};

//! ---------------------------------------------------------------------
//? ----------------------------- UPDATE APP--------------------------------
//! ---------------------------------------------------------------------

const updateApp = async (req, res, next) => {
  try {
    const { id } = req.params;
    const oldMobileDev = await MobileDev.findByIdAndUpdate(id, req.body);
    if (oldMobileDev) {
      return res.status(200).json({
        oldMobileDev: oldMobileDev,
        newMobileDev: await MobileDev.findById(id),
        status: 'Succesfully updated!',
      });
    } else {
      return res.status(404).json(MobileDevErrors.FAIL_UPDATING_MOBILEDEV);
    }
  } catch (error) {
    return next(error);
  }
};

//! ---------------------------------------------------------------------
//? ------------------------------GETFAV --------------------------------
//! ---------------------------------------------------------------------

const addFavorite = async (req, res, next) => {
  try {
    const mobileFav = await MobileDev.findById(req.params.id); //--->MobileDEv
    const user = await User.findById(req.user._id); //--->Nuestro user

    if (!mobileFav.users.includes(user._id)) {
      await mobileFav.updateOne({ $push: { users: user._id } });
      await user.updateOne({ $push: { mobileDevs: mobileFav._id } });
      res.status(200).json('Added to favourites!');
    } else {
      await mobileFav.updateOne({ $pull: { users: user._id } });
      await user.updateOne({ $pull: { mobileDevs: mobileFav._id } });
      res.status(200).json('Removed from favourites');
    }
  } catch (error) {
    return next('Error while adding to favourites', error);
  }
};

module.exports = {
  create,
  getAll,
  getById,
  getByBrand,
  updateMobileDev,
  deleteMobileDev,
  addFavorite,
  updateApp,
};
