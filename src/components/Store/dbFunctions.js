const crypto = require('crypto');
const console = require('console');
const dbConfig = require('../../config/dbConfig.js');
const mysql = require('mysql');

const helper = {

  saltLength: 16,
  
  generateSalt: (length)=>{

    return crypto.randomBytes(Math.ceil(length/2))
              .toString('hex') /** convert to hexadecimal format */
              .slice(0,length);   /** return required number of characters */
  },

  SHA512: (password,salt)=>{

    const hash = crypto.createHmac('sha512', salt); /** Hashing algorithm sha512 */
    hash.update(password);
    const value = hash.digest('hex');

    return value;

  },

  compare: (userPass,dbPass) => {

    console.log("u",userPass);
    console.log("d",dbPass);
    return crypto.timingSafeEqual(Buffer.from(userPass,'utf-8'),Buffer.from(dbPass,'utf-8'))
  },

  dbConnect: (res, next) => {

    const conn = mysql.createConnection(dbConfig);
    conn.connect((err) => {
      if(err) {
        console.log(err);
        res.end(err);
      }
      else {
        console.log('DB Connection Established');
        next();
      }
    });

    return conn;
  }
}




module.exports = helper;
