const express = require('express');
const router = express.Router();
const authenticationService = require('../services/authentication.js')

/* GET programming languages. */
router.post('/login', async function(req, res, next) {
    let { email, password } = req.body;
    r = await authenticationService.login(email, password);
    if (r) {
        res.status(200).send({
            message: "login successfully",
            data: r
        })
    }else{
        res.status(500).send({
            message: "An error occurred"
        });
    }
});

router.post('/register', async function(req, res, next) {
    let { email, password, first_name, last_name, phone } = req.body;
    try {
        let r = await authenticationService.register(email, password, first_name, last_name, phone)
        //console.log(r)
        if (r) {
            res.status(201).send({
                message: "user created successfully",
                data: r
            })
        } else {
            res.status(500).send({
                message: "An error occurred"
            });
        }
    } catch (error) {
        res.status(500).send({
            message: "An error occurred"
        });
    }
});

module.exports = router;