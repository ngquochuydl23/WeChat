const mongoose = require('mongoose');

function whereNotDeleted() {
  this.where({ isDeleted: false });
}

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

module.exports = { BaseSchema, whereNotDeleted }