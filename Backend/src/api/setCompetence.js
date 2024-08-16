'use strict';

const Controller = require('../controller/Controller');
const express = require('express');
const router = express.Router();

/**
 * Handles all post requests to /competence, takes json object {person_id, competence_id, years_of_experience}
 * Takes apart the object into separate values that it sends to the controller
 * On successful registration send an ok status
 * @returns boolean value true with 201 status if call was successful. otherwise false with 500 status.
 */
router.post('/setCompetence', async (req, res) => {
    const contr = await new Controller();
    try {
        const { person_id, competence_id, monthsOfExperience } = req.body;
        const result = await contr.setCompetence(person_id, competence_id, monthsOfExperience);
        res.status(201).send('Competence insertion successful');
        contr.writeToLogFile(person_id, "Set competence " + competence_id);
    } catch (error) {
        console.error('Insertion error:', error);
        res.status(500).send('Inserting competence failed');
    }
});

module.exports = router;