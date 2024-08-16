'use strict';

const Controller = require('../controller/Controller');
const express = require('express');
const router = express.Router();

/**
 * Handles all post requests to /availability, takes json object {from_date, to_date}
 * Takes apart the object into separate values that it sends to the controller
 * On successful registration send an ok status
 * @returns boolean value true with 201 status if call was successful. otherwise false with 500 status.
 */
router.post('/setAvailability', async (req, res) => {
    const contr = await new Controller();
    try {
        const { person_id, from_date, to_date } = req.body;
        console.log({ person_id, from_date, to_date });
        const result = await contr.setAvailability(person_id, from_date, to_date);
        res.status(201).send('Availability inserted successfully for ' + person_id);
        contr.writeToLogFile(person_id, "Set Availalibity from " + from_date + " to " + to_date);
    } catch (error) {
        console.error('Failed to update information:', error);
        res.status(500).send('Update failed');
    }
});

module.exports = router;