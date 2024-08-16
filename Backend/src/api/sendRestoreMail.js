'use strict';

const Controller = require('../controller/Controller');
const express = require('express');
const router = express.Router();

/**
 * Handles all POST requests to /restoreAccountByEmail. Takes {email:<address>} in request body.
 * If a user with the email address exists in database and is missing username and password,
 * an email with a random code will be sent to the email address and stored in the database to be
 * used when adding the missing data.
 * @returns {emailSent:true} in HTTP response body if email was sent, 
 * empty HTTP response with 404 code otherwise.
 */
router.post('/restoreAccountByEmail', async (req, res, next) => {
  const contr = await new Controller();
  try {
    const messageSent = await contr.restoreAccountByEmail(req.body.email);
    if (messageSent) {
      console.log("successfully sent message")
      res.send({ emailSent: true })
    } else {
      console.log("no message sent")
      res.status(404).end();
    }
  } catch (e) {
    next(e)
  }
})

module.exports = router;