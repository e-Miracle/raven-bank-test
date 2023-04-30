require('dotenv').config();
const axios = require("axios");
const qs = require('qs');
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

module.exports = {
    generateAccountNumber
}