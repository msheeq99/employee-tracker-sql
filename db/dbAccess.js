const connection = require("./connection");

class DbAccess {
    constructor(connection) {
        this.connection = connection;
      }
}

module.exports = new DbAccess(connection);