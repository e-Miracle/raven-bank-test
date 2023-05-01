const express = require('express');
const router = express.Router();
const ravenService = require('../services/raven.js');
const paymentService = require('../services/payment_history.js');
const db = require('../data/db.js');

router.get('/banks', async function(req, res, next) {
    const i = await ravenService.getBankList();
    if (i) {
        res.status(200).send({
            message: "banks retrieved successfully",
            data: i
        });
    } else {
        res.status(500).send({
            message: "An error occurred"
        });
    }
});

router.get('/lookup', async (req, res, next)=>{
    let {bank_code, account_number} = req.body;
    const i = await ravenService.accountLookup(bank_code, account_number);
    if (i) {
        res.status(200).send({
            message: "account retrieved successfully",
            data: i
        });
    } else {
        res.status(500).send({
            message: "An error occurred"
        });
    }
});

router.post('/transfer', async (req, res, next)=>{
    let {amount, bank_code, bank_name, account_number, account_name, narration, currency} = req.body;
    /**
     * confirm user balance, generate reference, process transfer and store the 
     */
    return db('account_details').select("id", "balance").where({id:req.user.id})
    .then(r=>{
        return db('account_details').where({id:req.user.id}).update({balance: Number(r[0].balance) - Number(amount)})
        .then(async r=>{
            let reference = await paymentService.storeTransfer(req.user, amount, bank_code, bank_name, account_number, account_name, narration, currency)
            try {
                const i = await ravenService.makeTransfer(
                    reference,
                    amount, 
                    bank_code, 
                    bank_name, 
                    account_number, 
                    account_name, 
                    narration, 
                    currency
                )
                if (i) {
                    res.status(200).send({
                        message: "transfer successfully"
                    });
                } else {
                    res.status(500).send({
                        message: "Insufficient funds"
                    });
                }
            } catch (error) {
                res.status(500).send({
                    message: error.message
                });
            }
        }).catch(e=>{
            console.log(e);
            return false;
        })
    }).catch(err=>{
        console.log(err);
        return false;
    })
});

module.exports = router;