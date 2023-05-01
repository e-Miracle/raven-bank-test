require('dotenv').config();
const axios = require("axios");
const qs = require('qs');
const db = require('../data/db.js');
const srs = require('secure-random-string');

async function generateAccountNumber(email, first_name, last_name, phone) {
    var data = qs.stringify({
        'first_name': first_name,
        'last_name': last_name,
        'phone': phone,
        'amount': '0',
        'email': email
      });
      var config = {
        method: 'post',
        url: 'https://integrations.getravenbank.com/v1/pwbt/generate_account',
        headers: {
            'Authorization': `Bearer ${process.env.RAVEN_SECRET}` 
        },
        data : data
      };
      
      return axios(config)
      .then(function (response) {
        //console.log(response.data);
        return response.data
      })
      .catch(function (error) {
        console.log(error);
        return false;
      });
}

async function getBankList() {
  var config = {
    method: 'get',
    url: 'https://integrations.getravenbank.com/v1/banks',
    headers: {
      'Authorization': `Bearer ${process.env.RAVEN_SECRET}` 
    },
  };
  
  return axios(config)
  .then(function (response) {
    return response.data.data;
  })
  .catch(function (error) {
    console.log(error);
    return false;
  });
}

async function accountLookup(bank, account_number) {
  var data = qs.stringify({
    'bank': bank,
    'account_number': account_number
  });

  var config = {
    method: 'post',
    url: 'https://integrations.getravenbank.com/v1/account_number_lookup',
    headers: {
      'Authorization': `Bearer ${process.env.RAVEN_SECRET}` 
    },
    data : data
  };
  
  return axios(config)
  .then(function (response) {
    return response.data;
  })
  .catch(function (error) {
    console.log(error);
    return false;
  });
}

async function makeTransfer(reference, amount, bank_code, bank_name, account_number, account_name, narration = "Transfer", currency = "NGN") {
  var data = qs.stringify({
    'amount': amount,
    'bank_code': bank_code,
    'bank': bank_name,
    'account_number': account_number,
    'account_name': account_name,
    'narration': narration,
    'reference': reference,
    'currency': currency 
  });
  var config = {
    method: 'post',
    url: 'https://integrations.getravenbank.com/v1/transfers/create',
    headers: {
      'Authorization': `Bearer ${process.env.RAVEN_SECRET}` 
    },
    data : data
  };
  
  return axios(config)
  .then(function (response) {
    return response.data;
  })
  .catch(function (error) {
    //console.log(error);
    return false;
  });
}

async function transferWebhook(data) {
    //store data
    console.log(data);
}

async function collectionWebhook(data) {
  return db.from('account_details').select("id","user_id", "balance").where('account_number', '=', data.account_number)
    .then(async res=>{
        return await db('account_details').where({id:res[0].id}).update({
          balance: Number(res[0].balance) + Number(data.amount)
        }).then(res=>{
          return res;
        }).catch(err=>{
          console.log(err)
          return false;
        });
    }).catch(err=>{
        console.log(err);
        return false;
    })
}
module.exports = {
    generateAccountNumber, getBankList, accountLookup, makeTransfer, transferWebhook, collectionWebhook
}