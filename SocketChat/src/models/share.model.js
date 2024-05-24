const mongoose = require('mongoose');

const BaseSchema = (name, inheritSchema) => {
  return new mongoose.Schema(
    inheritSchema,
    {
      timestamps: true,
      collection: name,
    }
  );
}

module.exports = { BaseSchema }