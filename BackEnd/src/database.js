const mySql= require('mysql');
const {database} = require("./keys");
const {promisify} = require('util')

const connection = mySql.createPool(database);

connection.getConnection((err,connection) =>{
    if(err){
        console.log("ERROR DATABASE CONNECTION");
        throw err
    }
    if(connection){
        connection.release()
        console.log("DB is connected");
        return;
    }
});

//call backs a promesas

connection.query = promisify(connection.query);

module.exports = connection;