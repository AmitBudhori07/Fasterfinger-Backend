const {Pool,Client} = require('pg');
const {user,host,database,password,port} = require('../Secrets/db.configration');

const pool = new Pool({user,host,database,password,port});
 
module.exports = {
    query: (text, params, callback) => {
      return pool.query(text, params, callback)
    },
  }