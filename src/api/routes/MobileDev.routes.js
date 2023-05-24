const express = require('express');
const { isAuth } = require('../../middleware/auth.middleware');
const {
  create,
  getAll,
  deleteMobileDev,
  getById,
  getByBrand,
  updateMobileDev,
  addFavorite,
  updateApp,
} = require('../controllers/MobileDev.controllers');

const MobileRoutes = express.Router();

MobileRoutes.post('/', create);
MobileRoutes.get('/', getAll);
MobileRoutes.delete('/:id', deleteMobileDev);
MobileRoutes.get('/:id', getById);
MobileRoutes.get('/brand/:brand', getByBrand);
MobileRoutes.patch('/:id', updateMobileDev);
MobileRoutes.patch('/updateApp/:id', updateApp);
MobileRoutes.put('/favorite/:id', [isAuth], addFavorite);

module.exports = MobileRoutes;
