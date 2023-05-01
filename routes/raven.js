const express = require('express');
const router = express.Router();
const ravenService = require('../services/raven.js');
const paymentService = require('../services/payment_history.js');

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
     * confirm user balance, generate reference and process transfer and store the 
     */
    let reference = paymentService.storeInternal()
    const i = await ravenService.makeTransfer()
});

router.post('/webhook', async (req, res, next)=>{
    try {
        switch (req.body.type) {
            case "transfer":
                //change status
                await ravenService.transferWebhook(req.body);
                break;
        
            case "collection":
                //store
                await paymentService.storeExternal(req.body);
                //credit user
                await ravenService.collectionWebhook(req.body);
            break;
            default:
                break;
        }
    } catch (error) {
        
    } finally{
        res.status(200).send({});
    }
});
module.exports = router;