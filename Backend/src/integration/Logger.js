const path = require('path');
/*
Database integration
Integration module to handle all calls to database.
*/
class Logger {
    constructor() {
    }
    /**
     * Logger that writes to logfile.
     * @param user
     * @param text
     */
    async log(user, text) {
        const loggerfile = require('fs')
        loggerfile.appendFile("logfile.txt", Date() + "\t\t" + user + "\t\t" + text + "\n", (err) => {
            if (err) {
                console.log(err);
            }
        });
    }
}
module.exports = Logger;
