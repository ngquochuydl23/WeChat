const mongoose = require('mongoose');

const BaseSchema = (name, inheritSchema) => {
  return new mongoose.Schema(
    {
      ...inheritSchema,
      isDeleted: {
        type: Boolean,
        default: false
      }
    },
    {
      timestamps: true,
      collection: name,
    }
  );
}

module.exports = { BaseSchema }