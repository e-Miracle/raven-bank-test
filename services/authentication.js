const db = require('../data/db.js');
const bcrypt = require("bcrypt") 
const raven = require("./raven.js");

async function login(email, password){
    await db.from("users").where("email", "=", email)
        .then(async items => {
            if (items.rowCount != undefined & items.rowCount > 0) {
                //verify password hash
                await bcrypt.compare(password, items[0].password)
                .then(async res=>{
                    jwt.sign(
                        { userId: items[0].id, email: email },
                        process.env.APP_KEY,
                        { expiresIn: "1h" }
                    ).then(res=>{
                        return res
                    })
                }).catch(err=>{
                    return {}
                })
            }else{
                return {}       
            }
        })
}

async function register(email, password, first_name, last_name, phone){
    return await db.from("users").where("email", "=", email)
        .then(async items => {
            if (items === undefined || items.length == 0) {
                //password hash
                await bcrypt.hash(password, 10)
                .then(async password=>{
                    //get an account number
                    await raven.generateAccountNumber(email, first_name, last_name, phone)
                        .then(async accn=>{
                            if (accn) {
                                var sql = `INSERT INTO users (email, password, first_name, last_name, phone) VALUES (?, ?, ?, ?, ?) RETURNING * `; 
                                await db
                                .raw(sql, [
                                    email, password, first_name, last_name, phone
                                ])
                                .then(async item=>{
                                    console.log(item);
                                    //create account details
                                    let main_details = accn.data
                                    let details = await db('account_details')
                                    .insert({
                                        user_id: item[0],
                                        account_number: main_details.account_number,
                                        account_name: main_details.account_name,
                                        bank: main_details.bank,
                                    })
    
                                    return {
                                        user: item,
                                        account_details: details
                                    }
                                }).catch(err=>{
                                    console.log(err);
                                    return false;
                                })
                            }
                        })
                })
            }

            return false;
        }).catch(err=>{
            console.log(err);
            return false;
        })
}

module.exports = {
    login, register
}