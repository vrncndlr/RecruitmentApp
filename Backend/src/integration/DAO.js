/**
 * Database integration
 * Integration module to handle all calls to database.
 */


const path = require('path');
const { address } = require("../server");
require('dotenv').config({
  override: true,
  path: path.join(__dirname, 'dbenv.env')
});
const Crypt = require('../model/Crypt');

/**
 * Constructor to create module and establish connection to database.
 */
class DAO {
  constructor() {
    const {Pool} = require('pg');
      this.pool = new Pool({
        user: 'uphwrlnecfyotc',
        host: 'ec2-52-215-209-64.eu-west-1.compute.amazonaws.com',
        database: 'd5n1hras72nal1',
        password: '9dc5c74bc3d665321103a8b95694b25960a18ab93b87b1a2c6e35b6db5eca05f',
        port: '5432',
        ssl: {
          rejectUnauthorized: false
        }
      })
      this.crypt = new Crypt();
  }

  /**
   * Creates a connection to the database
   * @returns a database connection
   */
  async getConnection() {
    const client = await this.pool.connect();
    return client;
  }

  /**
   * Updates the user object in the database with the supplied username and password, if the
   * reset code is equal to the one that was sent out last. If the user data is updated also removes the
   * reset code.
   * @param {Object} userdata
   * @returns true if succesful, otherwise throws database error.
   */
  async updateUserDataByEmailCode(connection, userdata) {
    let { rows } = await connection.query("SELECT person_id FROM person WHERE email = $1", [userdata.email])
    if (rows.length === 0) return false;
    const user_id = rows[0].person_id
    rows = await connection.query("SELECT * FROM account_reset_code WHERE person_id = $1 AND reset_code = $2",
      [user_id, userdata.resetCode.toString()])
    if (rows.length === 0) return false;
    const hash = await this.crypt.generateCryptPassword(userdata.password);
    rows = await connection.query("UPDATE person SET username = $1, password = $2 WHERE person_id = $3",
      [userdata.username, hash, user_id])
    if (rows.length === 0) return false;
    await connection.query("delete from account_reset_code where person_id = $1",
      [user_id])
    return true;
  }

  /**
   * Stores a account restoration code tigether with corresponding person_id.
   * @param {Integer} person_id unique identifier for each user.
   * @param {String} accountRestoreCode Code to be checked later when updating user data.
   */
  async storeAccountRestoreCode(connection, person_id, accountRestoreCode) {
    const { rows } = await connection.query("SELECT * FROM account_reset_code WHERE person_id = $1", [person_id])
    if (rows.length === 0) {
      await connection.query("INSERT INTO account_reset_code(person_id, reset_code)" +
        "VALUES($1, $2)", [person_id, accountRestoreCode])
    }
    else {
      await connection.query("UPDATE account_reset_code SET reset_code = $2 WHERE person_id = $1",
        [person_id, accountRestoreCode])
    }
  }

  /**
  * Checks username and password with the datebase, if matching it returns the user, if not returns empty json.
  * @param  username the username input
  * @return selected user if password and username match.
  */
  async getLoginUserData(connection, username) {
    const { rows } = await connection.query("SELECT password, person_id FROM public.person WHERE username = $1", [username])
    return rows;
  };

  /**
   * Inserts data sent from the frontend into the PostreSQL database
   * @param firstname
   * @param lastname
   * @param pid
   * @param email
   * @param username
   * @param password
   * @returns {Promise<*>} The inserted object with user data
   */
  async register(connection, firstname, lastname, pid, email, password, username) {
    const { rows } = await connection.query("INSERT INTO public.person (name, surname, pnr, email, password, role_id, username)" +
      "VALUES ($1, $2, $3, $4, $5, 2, $6) " +
      "RETURNING *;", [firstname, lastname, pid, email, password, username]);
    return rows[0];
  }

  /**
   * Return all data from the competence table
   * @returns {Promise<*>}
   */
  async getAllFromCompetences(connection) {
    const { rows } = await connection.query("SELECT * FROM public.competence");
    return rows;
  }
  /**
   * Updates the columns for a user
   * @param person_id
   * @param name
   * @param surname
   * @param pnr
   * @param email
   * @returns {Promise<*>}
   */
  async updateUserInfo(connection, person_id, name, surname, pnr, email) {
    const { rows } = await connection.query("UPDATE person " +
      "SET name = $2, surname = $3, pnr = $4, email = $5 " +
      "WHERE person_id = $1 " +
      "RETURNING *;",
      [person_id, name, surname, pnr, email]
    );
  }

  /**
  * Get user from database.
  * @param  person_id the person id
  * @return selected user
  */
  async getUser(connection, person_id) {
    const { rows } = await connection.query("SELECT row_to_json(user_alias)" +
      "FROM (SELECT * " +
      "FROM public.person where person_id = $1) user_alias", [person_id])
    if (rows.length === 0) console.log("undefined user in dao")
    return rows[0];
  };

/**
* Get all users from database.
* @return all user
*/
async getAllUsers(connection) {
  const { rows } = await connection.query("SELECT row_to_json(user_alias)" +
    "FROM (SELECT person_id, name, surname, pnr, email, role_id, username " +
    "FROM public.person where role_id = 2) user_alias")
  return rows;
};
/**
*  Check if email exists in database.
* @param useremail email to check.
* @return false if not exist, return person if exits.
*/
async checkUserEmail(connection, useremail) {
  const { rows } = await connection.query("SELECT row_to_json(user_alias)" +
    "FROM (SELECT person_id, name, surname, pnr, email, role_id, username, password " +
    "FROM public.person where email = $1) user_alias", [useremail])
  if (rows.length == 0) {
    return false;
  } else {
    return rows[0].row_to_json;
  }
};

  /**
  *  Check username exists in database.
  * @param username username to check.
  * @return false if not exist, true if exists.
  */
  async checkUserName(connection, username) {
    const { rows } = await connection.query("SELECT row_to_json(user_alias)" +
      "FROM (SELECT username " +
      "FROM public.person where username = $1) user_alias", [username])
    if (rows.length == 0) {
      return false;
    } else {
      return true;
    }
  };

  /**
  *  updates a username in database.
  * @param person_id the id of the user to update
  * @param useremail new email.
  * @return user
  */
  async updateUsername(connection, person_id, username) {
    const { rows } = await connection.query("UPDATE person " +
      "SET username = $1 " +
      "WHERE person_id = $2 " +
      "RETURNING *", [username, person_id])
    return rows;
  };

  /**
  *  updates a password in database.
  * @param person_id the id of the user to update
  * @param password new password.
  * @return user
  */
  async updateUserpassword(connection, person_id, password) {
    const { rows } = await connection.query("UPDATE person " +
      "SET password = $1 " +
      "WHERE person_id = $2 " +
      "RETURNING *", [password, person_id])
    return rows;
  };

  /**
  *  create a new user in database
  * @param name the name of the user
  * @param surname the surname of the user
  * @param pnr the personnummer of the user
  * @param email the email of the user
  * @param password the password of the user
  * @param username the username of the user
  * @return person
  */
  async createUser(connection, name, surname, pnr, email, password, username) {
    const { rows } = await connection.query("INSERT INTO person(name, surname, pnr, email, password, role_id, username) " +
      "VALUES ($1, $2, $3, $4, $5, 2, $6) " +
      "RETURNING * ;", [name, surname, pnr, email, password, username]
    )
    return rows;
  };

  /**
  * Get user competences from the database.
  * @return all competences.
  */
  async getAllCompetenceProfiles(connection) {
    const { rows } = await connection.query("SELECT row_to_json(user_alias)" +
      "FROM (SELECT person_id, competence_id, years_of_experience " +
      "FROM public.competence_profile ORDER BY person_id) user_alias")
    return rows;
  };

  /**
* Get a specific users cometences from the database.
* @param  person_id the person id
* @return the specified users comeptences as jason
*/
async getUserCompetenceProfile(connection, person_id) {
  const { rows } = await connection.query("SELECT *" +
    "FROM (SELECT competence_profile_id, person_id, competence_id, years_of_experience " +
    "FROM public.competence_profile where person_id = $1) user_alias", [person_id])
  return rows;
  };

  /**
*  Gets specific comptence profile from the database.
* @param  competenceid the id of a specific competence
* @return specific competence profile.
*/
async getSpecificCompetenceProfile(connection, competenceID) {
  const { rows } = await connection.query("SELECT row_to_json(user_alias)" +
    "FROM (SELECT person_id, competence_id, years_of_experience " +
    "FROM public.competence_profile where competence_id = $1) user_alias", [competenceID])
  return rows;
  };

  /**
*  Creates a new user competence in the database.
* @param person_id the id of the user
* @param competence_id the competence id
* @param years_of_experience the years of experiance the user have.
* @return competence profile.
*/
async createCompetenceProfile(connection, person_id, competence_id, years_of_experience) {
  const { rows } = await connection.query("INSERT INTO competence_profile(person_id, competence_id, years_of_experience) " +
    "VALUES($1, $2, $3) " +
    "RETURNING * ", [person_id, competence_id, years_of_experience]
  )
  return rows
  };

  /**
*  deletes competence profile.
* @param competence_profile_id the id of the competence
* @return number of rows deleted
*/
async deleteCompetenceProfile(connection, competence_profile_id) {
  const { rows } = await connection.query("DELETE FROM competence_profile " +
    "WHERE competence_profile_id  = $1", [competence_profile_id])
  return rows;
  };

  /**
  *  updates competence profile.
  * @param competence_profile_id the id of the competence
  * @param years_of_experience the updated value
  * @return updated competence profile.
  */
  async updateCompetenceProfile(connection, competence_profile_id, years_of_experience) {
    const { rows } = await connection.query("UPDATE competence_profile " +
      "SET years_of_experience = $1 " +
      "WHERE competence_profile_id = $2 " +
      "RETURNING * ", [years_of_experience, competence_profile_id]
    )
    return rows;
  };

  /**
*  Gets all availability slots from the database
* @return all availability slots.
*/
async getAllAvailability(connection) {
  const { rows } = await connection.query("SELECT row_to_json(user_alias)" +
    "FROM (SELECT availability_id, person_id, from_date, to_date " +
    "FROM public.availability ORDER BY person_id) user_alias")
  return rows;
  };

  /**
*  Gets a users availability slots from the database
* @param person_id the id of the user
* @return all availability slots connected to user.
*/
async getUserAvailability(connection, person_id) {
  const { rows } = await connection.query("SELECT *" +
    "FROM (SELECT availability_id, person_id, from_date, to_date " +
    "FROM public.availability where person_id = $1) user_alias", [person_id])
  return rows;
  };

  /**
*  Create availability slot.
* @param person_id the id of the user
* @param from_date the start date of the availability
* @param to_date the end date of the availability
* @return updated availability slot.
*/
async createAvailability(connection, person_id, from_date, to_date) {
  const { rows } = await connection.query("INSERT INTO availability(person_id, from_date, to_date) " +
    "VALUES($1, $2, $3) " +
    "RETURNING * ", [person_id, from_date, to_date]
  )
  return rows;
  };

  /**
  *  Delete availability slot.
  * @param availability_id the id of the availability slot.
  * @return number of rows deleted
  */
  async deleteAvailability(connection, availability_id) {
    const { rows } = await connection.query("DELETE FROM availability " +
      "WHERE availability_id  = $1", [availability_id])
    return rows;
  };


  /**
*  gets status of user
* @param person_id the id of the user.
* @return user status
*/
async getStatus(connection, person_id) {
  const { rows } = await connection.query("SELECT row_to_json(user_alias)" +
    "FROM (SELECT status_id, person_id, status " +
    "FROM public.status where person_id = $1) user_alias", [person_id])
  return rows;
};

  /**
*  change status of user
* @param person_id the id of the user.
* @param status the new status text.
* @return user status
*/
async changeStatus(connection, person_id, status) {
  const { rows } = await connection.query("UPDATE status " +
    "SET status = $1 " +
    "WHERE person_id = $2 " +
    "RETURNING *"
    , [status, person_id])
  return rows;
};

  /**
   * Gets name and status for applicants from DB and returns a promise with name, surname and status_ID
   * @returns {Promise<*>}
   */
  async getAllStatus(connection) {
    const { rows } = await connection.query("SELECT row_to_json(user_alias) FROM (SELECT person_id, name, surname, status_id FROM public.person WHERE role_id = 2) user_alias")
    return rows;
  };

}

module.exports = DAO;