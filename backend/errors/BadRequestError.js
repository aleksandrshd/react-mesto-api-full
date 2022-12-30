const { httpStatusCodes } = require('../utils/constants');

class BadRequestError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = httpStatusCodes.badRequest;
  }
}

module.exports = BadRequestError;
