class AppException extends Error {
  constructor(message) {
    super(message);
    this.name = this.constructor.name;
  }
}

class ValidationMongoException extends Error {
  constructor(error) {
    let errors = {};
    Object.keys(error.errors).forEach((key) => {
      errors[key] = error.errors[key].message;
    });
    super(errors);
  }
}

module.exports = { AppException, ValidationMongoException }