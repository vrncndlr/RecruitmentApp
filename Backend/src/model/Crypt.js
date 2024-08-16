class Crypt {
  //Creates a instance of the class Crypt
  constructor() {
  };
  /**
* Gets user with password to check.
* @param  plainTextPassword the password in plain text.
* @return hashed crypted password to be stored in database.
*/
  async generateCryptPassword(plainTextPassword) {
    const bcrypt = require("bcrypt")
    const saltNumber = 10
    const salt = await bcrypt.genSalt(saltNumber);
    const hashedPassword = await bcrypt.hash(plainTextPassword, salt);
    return hashedPassword;

  }

  /**
* Gets user with password to check.
* @param  plainTextPassword the password in plain text.
* @param  hashedPassword the hashed password to compare against.
* @return boolean true or false.
*/
  async checkPassword(plainTextPassword, hashedPassword) {
    const bcrypt = require("bcrypt")
    const check = await bcrypt.compare(plainTextPassword, hashedPassword)
    return check;
  }
}
module.exports = Crypt;