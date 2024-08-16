'use strict';

const Controller = require('../controller/Controller');
const express = require('express');
const router = express.Router();

/**
 * Handles all post requests to /registration, takes json object {firstname, lastname, pid, email, username, password}
 * Takes apart the object into separate values that it sends to the controller
 * On successful registration send an ok status
 * @returns boolean value true with 201 status if call was successful. otherwise false with 500 status.
 */
router.post('/registration', async (req, res) => {
    const contr = await new Controller();
    try {
        const { firstname, lastname, pid, email, username, password, confirmPassword} = req.body;
        const result = await contr.register(firstname, lastname, pid, email, password, username);
        res.status(201).send('Registration successful');
        console.log("Registered new user: "+ username);
        contr.writeToLogFile(username, "Register new user");
        return true;
    } catch (error) {
        console.error('Registration error:', error);
        // Send error response
        res.status(500).send('Registration failed');
    }
});

module.exports = router;