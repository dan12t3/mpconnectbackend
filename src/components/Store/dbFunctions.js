const crypto = require('crypto');
const console = require('console');

const helper = {

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
  }
}




module.exports = helper;
