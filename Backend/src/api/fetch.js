'use strict';

const Controller = require("../controller/Controller");
const Authorization = require('./Authorization');
const express = require("express");
const router = express.Router();

router.get('/fetch', async (req, res) => {
    const contr = await new Controller();
    console.log("/fetch, cehcking auth token")
    console.log(req.cookies.JWTToken)
    if (!Authorization.verifyIfAuthorized(req, res)) {
        return res.status(500).send('unauthorized access');
    }
    try {
        const competences = await contr.fetch();
        if (competences === undefined) {
            console.log("Cannot fetch")
            return res.status(404).end();
        }
        return res.send(competences);
    } catch (e) {
        console.error(e);
        res.status(500).send('Error fetching competences');
    }
})

module.exports = router;