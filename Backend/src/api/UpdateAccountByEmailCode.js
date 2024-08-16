'use strict';

const Controller = require('../controller/Controller');
const express = require('express');
const router = express.Router();

/**
 * Takes username, password and email reset code in HTTP request body and 
 * tries to update the corresponding user account with the username and password if the 
 * emailed code is the latest one sent out.
 * @returns {accountUpdated:true} in the HTTP response body if the supplied data was 
 * successfully entered into the user database,
 * otherwise returns {accountUpdated:false}.
 */
router.post('/updateAccountByEmailCode', async (req, res, next) => {
  const contr = await new Controller();
  try {
    console.log("hello from updateAccountByEmailCode")
    console.log(req.body)
    const result = await contr.updateUserDataByEmailCode(req.body)
    if (result)
      res.send({ accountUpdated: true })
    else
      res.send({ accountUpdated: false })
  } catch (e) {
    next(e)
  }
})

module.exports = router;