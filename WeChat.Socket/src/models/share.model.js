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
            versionKey: false
        }
    );
}

module.exports = { BaseSchema, whereNotDeleted }