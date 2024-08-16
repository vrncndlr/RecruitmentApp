'use strict';
const jwt = require('jsonwebtoken');
/**
 * Class that handles authentication and authorization of users.
 */
class Authorization {
  /**
   * Getter that returns the name the JWT token is set as a cookie under
   * @returns name of authorization cookie
   */
  static getAuthCookieName() {
    return 'authCookie';
  }
  static getAuthHeader(cookies) {
    return cookies.split(';')[0].split('=')[1];
  }
  /**
   * Verifies the JWT token supplied under the cookie name.
   * @param {HTTPRequest} request The incoming http request
   * @param {HTTPResponse} response The outgoing http response
   * @returns false if no cookie with the correct name is present in request, true otherwise
   */
  static verifyIfAuthorized(request, response){
    //const authcookie = request.cookies.JWTToken;
    const authcookie = request.headers.authcookie
    console.log("request headers in Authorization")
    //console.log(request.headers)
    console.log(this.getAuthHeader(request.headers.authcookie))
    if(!authcookie){
      console.log("no auth cookie found")
      return false;
    }
    let decoded = jwt.verify(authcookie, "1234");
    //if(decoded)
    //console.log("cookie verified")
    //else
    if (!decoded)
      console.log("cookie not verified")
    return true;
  }
  
  /**
   * Sets a JSON web token, JWT, as cookie for authorization.
   * @param {Object} user : {username: <username>, password:<password>}
   * @param {HTTPResponse} response the cookie is set in this response
   */
  static setAuthCookie(user, response) {
    const notAccessibleFromJs = { httpOnly: true };
    const sessionCookie = { expiresIn: '1h' };

    const JWTToken = jwt.sign(
      { id: user.id, user: user.username },
      "1234",
      sessionCookie,
    );
    const cookieOptions = { ...notAccessibleFromJs };
    user['JWTToken'] = JWTToken;
    //response.cookie(this.getAuthCookieName(), JWTToken, cookieOptions);
    console.log("setting authcookie" + JWTToken)
    response.setHeader('authcookie', JWTToken);
  }
}

module.exports = Authorization;