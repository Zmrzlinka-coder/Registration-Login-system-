const Pool = require("pg").Pool;

const pool = new Pool({
  host: "",
  user: "",
  password: "",
  port:null ,
  database: ""
});

module.exports = pool;