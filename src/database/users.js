import connections from '../connections';
import jwt from "jsonwebtoken";
import {JWT_SECRET, JWT_SECRET_MAILER} from "../constants"

export default {
  insert_user(data, callback) {
    connections.getConnection((error, connection) => {
      let errors = {};
      if (error) {
          errors["global"] = "Connection: "+error;
          callback(errors, null)
      } else
      connection.query("INSERT INTO users SET ?", data, function(err,results,fields){
        connection.release();
        if(err){
            errors["global"] = "Query: "+err;
            callback(errors, null)
        } else
        callback(null, results)
      });
    });
  },
  getUserByEmail(email, callback) {
      connections.getConnection((error, connection) => {
          let errors = {};
          if (error) {
              errors["global"] = "Connection: "+error;
              callback(errors, null)
          } else {
              connection.query("SELECT username, email, admin, confirmed, password_hash FROM users WHERE email = ?", email, function(err,results,fields){
                  connection.release();
                  if (err) {
                      errors["global"] = "Query: " + err;
                      callback(errors, null)
                  } else
                      callback(null, results)
              });
          }
      });
  },
  getUserById(connections, id, callback) {
      connections.getConnection((error, connection) => {
          let errors = {};
          if (error) {
              errors["global"] = "Connection: "+error;
              callback(errors, null)
          } else
          connection.query("SELECT username, email FROM users WHERE id = ?", id, function(err,results,fields){
              connection.release();
              if(err){
                  errors["global"] = "Query: "+err;
                  callback(errors, null)
              } else
                  callback(null, results)
          });
      });
  },
  getUserByUsername(username, callback) {
      connections.getConnection((error, connection) => {
          let errors = {};
          if (error) {
              errors["global"] = "Connection: "+error;
              callback(errors, null)
          } else
          connection.query("SELECT username, email FROM users WHERE username = ?", username, function(err,results,fields){
              connection.release();
              if(err){
                  errors["global"] = "Query: "+err;
                  callback(errors, null)
              } else
                  callback(null, results)
          });
      });
  },
    confirmUser(credentials, callback){
      console.log(credentials.confirmationToken);
        connections.getConnection((error, connection) => {
            let errors = {};
            if (error) {
                errors["global"] = "Connection: "+error;
                callback(errors, null)
            } else
                connection.query("SELECT confirmed FROM users WHERE email = ?", credentials.email, function(err,results,fields){
                    if(err){
                        connection.release();
                        errors["global"] = "Query: "+err;
                        callback(errors, null)
                    } else
                        if(results.length > 0) {
                            if(results[0].confirmed === 1){
                                connection.release();
                                errors["global"] = "Account already activated";
                                callback(errors,null)
                            } else
                                connection.query("UPDATE users SET confirmed = true WHERE confirmation_token = ?", credentials.confirmationToken, function(err,results,fields){
                                    connection.release();
                                    if(err){
                                        errors["global"] = "Query: "+err;
                                        callback(errors, null)
                                    } else
                                        callback(null, results)
                                });
                        } else {
                            connection.release();
                            //todo check if proper
                            callback(null, [])
                        }
                });

        });
    },
    changePassword(credentials, callback){
        console.log(JSON.stringify(credentials))
        connections.getConnection((error, connection) => {
            let errors = {};
            if (error) {
                errors["global"] = "Connection: "+error;
                callback(errors, null)
            } else
            connection.query("UPDATE users SET password_hash = ? WHERE email = ?", [credentials.password, credentials.email],function(err,results,fields){
                connection.release();
                if(err){
                    errors["global"] = "Query: "+err;
                    callback(errors, null)
                } else
                    callback(null, results)
            });
        });
    },
    generateToken(tokenParams){
        return jwt.sign(
            {
                email: tokenParams.email
            },
            JWT_SECRET)
    },
    generateConfirmationToken(tokenParams){
        return jwt.sign(
            {
                email: tokenParams.email
            },
            JWT_SECRET_MAILER)
    },
    generateResetPasswordToken(tokenParams){
        return jwt.sign(
            {
                email: tokenParams.email,
            },
            JWT_SECRET_MAILER,
            { expiresIn: "1h" }
        )
    },
  // method used for easily deletion of all the records
  delete_all(connections) {
    connections.getConnection((error, connection) => {
      if (error) console.log(error);

      connection.query("DELETE FROM users", (err, results) => {
        if (err) throw error;
      });
    });
  }
};