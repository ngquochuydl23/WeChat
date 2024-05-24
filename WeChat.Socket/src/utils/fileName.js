function createEncodeFileName(fileName) {
    return Buffer.from(fileName).toString('base64')
}

function decodeFileParam(fileParam) {
    return Buffer.from(fileParam, 'base64').toString('ascii')
}

function generateFileName(file, index = 0) {
    return "social-v2.chat" + index + '-' + Date.now()
}

module.exports = {
    generateFileName,
    createEncodeFileName,
    decodeFileParam
}