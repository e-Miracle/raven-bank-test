const express = require('express');
const router = express.Router();
const paymentService = require('../services/payment_history.js');

router.get('/deposit', async (req, res, next)=>{
    const i = await paymentService.deposit(req.user);
    if (i) {
        res.status(200).send({
            message: "successfully",
            data: i
        })
    } else {
        res.status(500).send({
            message: "An error occurred"
        });
    }
})

router.get('/transfer', async (req, res, next)=>{
    const i = await paymentService.transfer(req.user);
    if (i) {
        res.status(200).send({
            message: "successfully",
            data: i
        })
    } else {
        res.status(500).send({
            message: "An error occurred"
        });
    }
})

router.get('/transaction', async (req, res, next)=>{
    const i = await paymentService.all(req.user);
    if (i) {
        res.status(200).send({
            message: "successfully",
            data: i
        })
    } else {
        res.status(500).send({
            message: "An error occurred"
        });
    }
})

module.exports = router;