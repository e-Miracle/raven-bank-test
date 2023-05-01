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

async function storeInternal(data) {
    
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
module.exports = {
    storeExternal, storeInternal
}