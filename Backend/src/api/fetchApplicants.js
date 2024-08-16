'use strict';

const Controller = require("../controller/Controller");
const Authorization = require('./Authorization');
const express = require("express");
const router = express.Router();

/**
 * Handles calls to the API and forwards them to controller
 */
router.get('/fetchApplicants', async(req, res)=>{
    const contr = await new Controller();
    if(!Authorization.verifyIfAuthorized(req, res)){
        return res.status(500).send('unauthorized access');
    }
    try {
        const applications = await contr.fetchApplicants();
        if(applications === undefined){
            console.log("Cannot fetch")
            return res.status(404).end();
        }
        return res.status(200).json(applications);
    }catch (e){
        console.error(e);
        res.status(500).send('Error fetching competences');
    }
})

module.exports = router;