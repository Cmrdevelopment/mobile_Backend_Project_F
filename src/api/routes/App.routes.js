const { isAuth } = require('../../middleware/auth.middleware');
const { upload } = require('../../middleware/files.middleware');

const {
  create,
  getAll,
  getById,
  getByAppName,
  updateApp,
  deleteApp,
  toggleFavorite,
  updateMobileDev,
} = require('../controllers/App.controllers');

const AppRoutes = require('express').Router();

AppRoutes.post('/', upload.single('image'), create);
AppRoutes.delete('/:id', deleteApp);
AppRoutes.get('/', getAll);
AppRoutes.get('/:id', getById);
AppRoutes.get('/appName/:appName', getByAppName);
AppRoutes.patch('/:id', updateApp);
AppRoutes.patch('/updateMobileDev/:id', updateMobileDev);
AppRoutes.put('/favorite/:id', [isAuth], toggleFavorite); //----id del usuario

module.exports = AppRoutes;
