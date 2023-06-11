const BadRequest = require('./BadRequest_400');
const ConflictError = require('./ConflictError_409');
const Forbidden = require('./Forbidden_403');
const NotFound = require('./NotFound_404');
const Unauthorized = require('./Unauthorized_401');
const { serverError } = require('./InternalServerError_500');

module.exports = {
  BadRequest, ConflictError, Forbidden, NotFound, Unauthorized, serverError,
};
