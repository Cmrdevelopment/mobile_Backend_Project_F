const mongoose = require('mongoose');

// Types of our data model
// We create the data model
// 1. type: data type ('string, number, ...)
// 2. required: if the data is required or not
const MobileDevSchema = new mongoose.Schema(
  {
    brand: { type: String, required: true, unique: true }, // Marca Movil
    OS: { type: String, enum: ['IOS', 'Android', 'Linux'], required: true }, // Sistema Operativo
    versionOS: { type: String, required: true }, // Version Sistema Operativo
    language: { type: String, required: true }, // Lenguaje de interface

    apps: [{ type: mongoose.Schema.Types.ObjectId, ref: 'App' }], // Referencia al modelo de dato de las Applicaciones

    image: {
      type: String,
    },

    description: {
      type: String,
    },

    users: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'User',
      required: false,
    },
  },

  {
    timestamps: true,
  }
);

// we create the data schema model for mongoose
const MobileDev = mongoose.model('MobileDev', MobileDevSchema);
module.exports = MobileDev;
