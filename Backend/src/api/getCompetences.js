'use strict';

const Controller = require('../controller/Controller');
const Authorization = require('./Authorization');
const express = require('express');
const router = express.Router();

/**
 * Handles all post requests to /getCompetence, takes person_id
 * On successful registration send an ok status
 * @returns data with 201 status if call was successful, otherwise 500 status.
 */
router.get('/getCompetences/:person_id', async (req, res) => {
    const contr = await new Controller();
    if (!Authorization.verifyIfAuthorized(req, res)) {
        return res.status(500).send('unauthorized access');
    }
    const { person_id } = req.params;
    try {
        const competences = await contr.getUserCompetences(person_id);
        return res.send(competences);
    } catch (error) {
        console.error('Fetching error:', error);
        res.status(500).send('Fetching competence failed');
    }
});

module.exports = router;