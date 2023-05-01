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
                return await bcrypt.hash(password, 10)
                .then(async password=>{
                    //get an account number
                    return await raven.generateAccountNumber(email, first_name, last_name, phone)
                        .then(async accn=>{
                            if (accn) {
                                return await db('users')
                                .insert({
                                    email, password, first_name, last_name, phone
                                })
                                .then(async item=>{
                                    //create account details
                                    let main_details = accn.data
                                    return await db('account_details')
                                    .insert({
                                        user_id: item[0],
                                        account_number: main_details.account_number,
                                        account_name: main_details.account_name,
                                        bank: main_details.bank,
                                    }).then(_=>{
                                        return {
                                            user: {email, password, first_name, last_name, phone},
                                            account_details: main_details
                                        };
                                    }).catch(e=>{
                                        console.log(e, 1);
                                        return false;
                                    })
                                }).catch(err=>{
                                    console.log(err, 2);
                                    return false;
                                })
                            }else{
                                console.log("An error occurred");
                                return false;
                            }
                        }).catch(e=>{
                            console.log(e ,3)
                            return false;
                        })
                }).catch(e=>{
                    console.log(e, 4)
                    return false;
                })
            }else{
                console.log("user exists")
                return false;
            }
        }).catch(err=>{
            console.log(err, 5);
            return false;
        })
}

module.exports = {
    login, register
}