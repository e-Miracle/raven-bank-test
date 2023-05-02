require('dotenv').config();
const db = require('../data/db.js');
const srs = require('secure-random-string');

async function storeExternal(data) {
    let reference = srs({length:12});

    //get the user_id
    return db.from('account_details').select("user_id").where('account_number', '=', data.account_number)
    .then(async res=>{
        let d = {
            user_id:res[0].user_id,
            reference,
            type: data.type,
            payload: data
        };
        return await store(d);
    }).catch(err=>{
        console.log(err);
        return false;
    })
}

async function storeExternalTransfer(data) {
    let reference = srs({length:12});

    //get the user_id
    return db.from('transfers').select("user_id").where('reference', '=', data.merchant_ref)
    .then(async res=>{
        let d = {
            user_id:res[0].user_id,
            reference,
            type: data.type,
            payload: data
        };
        return await store(d);
    }).catch(err=>{
        console.log(err);
        return false;
    })
}

async function storeTransfer(user, amount, bank_code, bank_name, account_number, account_name, narration, currency) {
    let reference = srs({length:12});
    let d = {
        user_id:user.id, reference, amount, bank_code, bank_name, account_number, account_name, narration, currency
    }
    return await db('transfers')
    .insert(d).then(res=>{
        return reference;
    }).catch(err=>{
        console.log(err);
        return false;
    })
}
async function store(data) {
    return await db('payment_history')
        .insert(data).then(r=>{
          return r;
        }).catch(e=>{
          console.log(e);
          return false;
        });
}

async function deposit(user) {
    return db('payment_history').select("*").where({
        user_id: user.id,
        type: "collection"
    })
    .then(res=>{
        return res
    }).catch(e=>{
        console.log(e);
        return false;
    })
}

async function transfer(user) {
    return db('payment_history').select("*").where({
        user_id: user.id,
        type: "transfer"
    })
    .then(res=>{
        return res
    }).catch(e=>{
        console.log(e);
        return false;
    })
}

async function all(user) {
    return db('payment_history').select("*").where({
        user_id: user.id
    })
    .then(res=>{
        return res
    }).catch(e=>{
        console.log(e);
        return false;
    })
}
module.exports = {
    storeExternal, storeTransfer, storeExternalTransfer, deposit, transfer, all
}