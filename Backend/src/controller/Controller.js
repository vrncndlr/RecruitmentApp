const DAO = require('../integration/DAO');
const Email = require('../integration/Email');
const Crypt = require('../model/Crypt');
const Logger = require('../integration/Logger');

/**
 * Class that is called by api layer to make database calls.
 */
class Controller {

    constructor() {
        this.dao = new DAO();
        this.crypt = new Crypt();
        this.logger = new Logger();
    }

    /**
     * Calls the database layer for user data update and returns the result.
     * @param {Object} userdata contains username, password, confirmPassword, email and resetCode fields.
     * @returns
     */
    async updateUserDataByEmailCode(userdata) {
        const connection = await this.dao.getConnection();
        try {
            await connection.query('BEGIN')
            const result = await this.dao.updateUserDataByEmailCode(connection, userdata)
            await connection.query('COMMIT')
            return result;
        } catch (e) {
            await connection.query('ROLLBACK')
            console.error(e);
            throw new Error("database error")
        } finally {
            connection.release()
        }
    }

    /**
     * Calls the database layer for login and returns the result.
     * @async
     * @param {String} username username
     * @param {String} password password
     */
  
     async login(username, password) {
      const connection = await this.dao.getConnection();
      try {
          await connection.query('BEGIN')
          const hashedpassword = await this.dao.getLoginUserData(connection, username);
          if (hashedpassword[0] == undefined) {
              await connection.query('COMMIT')
              return undefined;
          }
          const bool = await this.crypt.checkPassword(password, hashedpassword[0].password);
          if (bool) {
              const result = await this.dao.getUser(connection, hashedpassword[0].person_id);
              await connection.query('COMMIT')
              console.log(result)
              return result;
          }
          await connection.query('COMMIT')
          return undefined;
      } catch (e) {
          await connection.query('ROLLBACK')
          console.error(e);
          throw new Error("database error")
      } finally {
          connection.release()
      }
    }

    /**
     * Calls the database layer with register api function and returns a boolean
     * Takes the values of the user registration as separate values
     * @param firstname
     * @param lastname
     * @param pid
     * @param email
     * @param password
     * @param username
     * @returns true if registration successful and false if not {Promise<boolean>}*/
    async register(firstname, lastname, pid, email, password, username) {
        const connection = await this.dao.getConnection();
        try {
            await connection.query('BEGIN')
            const hash = await this.crypt.generateCryptPassword(password);
            await this.dao.register(connection, firstname, lastname, pid, email, hash, username);
            await connection.query('COMMIT')
            return true;
        } catch (e) {
            await connection.query('ROLLBACK')
            console.error('Error registering user:', error);
            return false;
        } finally {
            connection.release()
        }
    }

    /**
     * Checks if a user with the supplied email exists in database and is missing username.
     * If so, sends out a restoration code by email and stores it in the database.
     * @param {String} email User email address
     * @returns true if restoration code was succesfully sent, otherwise false.
     */
    async restoreAccountByEmail(email) {
        const connection = await this.dao.getConnection();
        try {
            await connection.query('BEGIN')
            const exists = await this.dao.checkUserEmail(connection, email);
            if (exists == undefined) {
                await connection.query('COMMIT')
                return false;
            }
            if (exists != undefined && exists.username) {
                await connection.query('COMMIT')
                return false;
            }
            if (exists != undefined && exists.person_id) {
                const mailer = new Email();
                const [messageSent, accountRestoreCode] = await mailer.sendAccountRestoreMail(exists.email)
                await this.dao.storeAccountRestoreCode(connection, exists.person_id, accountRestoreCode);
                await connection.query('COMMIT')
                return messageSent;
            }
            else {
                await connection.query('COMMIT')
                return false;
            }
        } catch (e) {
            await connection.query('ROLLBACK')
            console.error(e);
            throw new Error("database error")
        } finally {
            connection.release()
        }
    }

    /**
     * Updates the users personal information based on person_id
     * @param person_id
     * @param name
     * @param surname
     * @param pnr
     * @param email
     * @returns {Promise<void>}
     */
    async update(person_id, name, surname, pnr, email) {
        const connection = await this.dao.getConnection();
        try {
            await connection.query('BEGIN')
            const result = await this.dao.updateUserInfo(connection, person_id, name, surname, pnr, email)
            await connection.query('COMMIT')
            return result;
        } catch (e) {
            await connection.query('ROLLBACK')
            console.error(e);
            throw new Error("database error")
        } finally {
            connection.release()
        }
    }

    /**
     * Fetches all rows from the table competence in the database
     * @returns {Promise<*>}
     */
    async fetch() {
        const connection = await this.dao.getConnection();
        try {
            await connection.query('BEGIN')
            const result = await this.dao.getAllFromCompetences(connection);
            await connection.query('COMMIT')
            return result;
        } catch (e) {
            await connection.query('ROLLBACK')
            console.error(e);
            throw new Error("database error")
        } finally {
            connection.release()
        }
    }

    /**
     * Insert competences into competence_profile table in database
     * @returns {Promise<*|undefined>}
     */
    async setCompetence(person_id, competence_id, monthsOfExperience) {
        const connection = await this.dao.getConnection();
        const yearsOfExperience = monthsOfExperience / 12;
        try {
            await connection.query('BEGIN')
            const result = await this.dao.createCompetenceProfile(connection, person_id, competence_id, yearsOfExperience);
            await connection.query('COMMIT')
            return result;
        } catch (e) {
            await connection.query('ROLLBACK')
            console.error(e);
            throw new Error("database error")
        } finally {
            connection.release()
        }
    }

    /**
     * Calls the DAO to insert availability data
     * @returns {Promise<*|undefined>}
     */
    async setAvailability(person_id, from_date, to_date) {
        const connection = await this.dao.getConnection();
        try {
            await connection.query('BEGIN')
            const result = await this.dao.createAvailability(connection, person_id, from_date, to_date);
            await connection.query('COMMIT')
            return result;
        } catch (e) {
            await connection.query('ROLLBACK')
            console.error(e);
            throw new Error("database error")
        } finally {
            connection.release()
        }
    }

    /**
     * Calls DAO to fetch all applications
     * @returns
     */
    async fetchApplicants() {
        const connection = await this.dao.getConnection();
        try {
            await connection.query('BEGIN')
            const result = await this.dao.getAllStatus(connection)
            await connection.query('COMMIT')
            return result;
        } catch (e) {
            await connection.query('ROLLBACK')
            console.error(e);
            throw new Error("database error")
        } finally {
            connection.release()
        }
    }

    /**
     * Calls DAO to get the competences for a specific user in person table
     * @param person_id unique id for the user
     * @returns {Promise<*>}
     */
    async getUserCompetences(person_id) {
        const connection = await this.dao.getConnection();
        try {
            await connection.query('BEGIN')
            const result = await this.dao.getUserCompetenceProfile(connection, person_id)
            await connection.query('COMMIT')
            return result;
        } catch (e) {
            await connection.query('ROLLBACK')
            console.error(e);
            throw new Error("database error")
        } finally {
            connection.release()
        }
    }

    /**
     * Calls DAO to get the availabilities for a specific user in person table
     * @param person_id unique id for the user
     * @returns {Promise<*>}
     */
    async getUserAvailabilities(person_id) {
        const connection = await this.dao.getConnection();
        try {
            await connection.query('BEGIN')
            const result = await this.dao.getUserAvailability(connection, person_id)
            await connection.query('COMMIT')
            return result;
        } catch (e) {
            await connection.query('ROLLBACK')
            console.error(e);
            throw new Error("database error")
        } finally {
            connection.release()
        }
    }

    /**
     * Writes to logfile.
     * @param user
     * @param text
     */
    async writeToLogFile(user, text) {
        await this.logger.log(user, text);
    }
}
module.exports = Controller;

