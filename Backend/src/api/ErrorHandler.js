'use strict';

const express = require('express');
const router = express.Router();

/**
 * Sends a http response with status 500 internal server error on any error
 * @param {Object} e thrown or set by earlier handler function
 * @param {HTTPRequest} req 
 * @param {HTTPResponse} res 
 * @param {Express.js error handler} next express default error handler, used if headers
 * have already been sent
 * @returns 
 */
function errorHandler(e, req, res, next) {
  if (res.headersSent) {
    return next(e)
  }
  console.log("ErrorHandler: " + e)
  return res.status(500).send({ error: "server or database error" })
}

module.exports = errorHandler;