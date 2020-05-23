var mariadb = require('mariadb');

const pool = mariadb.createPool({
    host: "127.0.0.1",
    user: 'root',
    password: 'toor',
    database: 'demo'
})


module.exports={
    getConnection: function(){
      return new Promise(function(resolve,reject){
        pool.getConnection().then(function(connection){
          resolve(connection);
        }).catch(function(error){
          reject(error);
        });
      });
    }
  } 