const { AppException } = require("../exceptions/AppException");
const Storage = require('../models/storage');
const _ = require('lodash');
const { generateFileName, createEncodeFileName, decodeFileParam } = require("../utils/fileName");

exports.upload = async (req, res, next) => {
    try {
        const loggingUserId = req.loggingUserId;
        const files = req.files;

        if (!req.files) {
            throw new AppException("No file uploaded");
        }

        var medias = await Promise.all(_.map(files, async (file, index) => {
            const newDoc = await Storage.create({
                fileName: generateFileName(file, index),
                buffer: file.buffer,
                mime: file.mimetype,
                size: Buffer.byteLength(file.buffer),
                creatorId: loggingUserId
            });

            return {
                url: '/api/storage/' + createEncodeFileName(newDoc.fileName),
                mime: newDoc.mime,
            }
        }));

        return res
            .status(201)
            .send({
                statusCode: 201,
                files: medias
            });
    } catch (error) {
        next(error);
    }
}

exports.getFileByName = async (req, res, next) => {
    try {
        const fileName = decodeFileParam(req.params.fileName);
        const file = await Storage.findOne({ fileName: fileName }, { buffer: 1 });

        if (!file) {
            throw new AppException("File not found");
        }

        res.end(file.buffer);
    } catch (error) {
        next(error);
    }
}