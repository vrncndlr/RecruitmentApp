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
router.post('/update', async (req, res) => {
    const contr = await new Controller();
    try {
        const { person_id, name, surname, pnr, email } = req.body;
        // Update and save registration data in the database
        const result = await contr.update(person_id, name, surname, pnr, email);
        res.status(201).send('Update successful');
        console.log("Updated user info: " + name, surname, pnr, email);
        return true;
    } catch (error) {
        console.error('Failed to update information:', error);
        // Send error response
        res.status(500).send('Update failed');
    }
});

module.exports = router;