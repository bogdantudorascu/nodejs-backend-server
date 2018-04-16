import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import userFunctions from "../database/users";
import {SALT_ROUNDS, JWT_SECRET, JWT_SECRET_MAILER} from "../constants"
import { sendResetPasswordEmail, sendConfirmationEmail } from "../mailer";

const router = express.Router();

// Register a new user
router.post("/signup", (req, res) => {
  const { email, username, password } = req.body.credentials;
  console.log(req.body.credentials);
  bcrypt.hash(password, parseInt(SALT_ROUNDS), function(
    bcryptErr,
    hash
  ) {
    if (bcryptErr)
      res.status(500).json({ errors: { global: "Bcrypt: " + bcryptErr } });
    else {
      const token = userFunctions.generateToken({
        email: email
      });
      const confirmationToken = userFunctions.generateConfirmationToken({
        email,
      });
      userFunctions.insert_user(
        {
          email,
          username,
          password_hash: hash,
          confirmation_token: confirmationToken,
        },
        (errors, results) => {
          if (errors !== null) res.status(500).json({ errors });
          else if (results.affectedRows && results.affectedRows === 1) {
            //sendConfirmationEmail({ email, confirmationToken });
            const user = {
              email: email,
              username: username,
              confirmed: false,
                admin: true,
              token,
            };
            res.json({ user });
          } else {
            res
              .status(500)
              .json({ errors: { global: "Unknown error occurred" } });
          }
        }
      );
    }
  });
});

//Login the user
router.post("/login", (req, res) => {
  const { email, password } = req.body.credentials;
    console.log(req.body.credentials);
    userFunctions.getUserByEmail(email, (errors, results) => {
    if (errors !== null) res.status(500).json({ errors });
    else if (results.length > 0) {
        console.log(results[0].password_hash);
      bcrypt.compare(
        password,
        results[0].password_hash,
        (bcryptErr, comparationRes) => {
          if (bcryptErr)
            res
              .status(500)
              .json({ errors: { global: "Bcrypt: " + bcryptErr } });
          else if (comparationRes) {
            const token = userFunctions.generateToken({
              email: results[0].email
            });
            const user = {
              username: results[0].username,
              email: results[0].email,
              confirmed: !!results[0].confirmed,
                admin: true,
              token,
            };
            res.json({ user });
          } else {
            res.status(400).json({ errors: { global: "Invalid credentials" } });
          }
        }
      );
    } else {
      res.status(400).json({ errors: { global: "Invalid credentials" } });
    }
  });
});

//Confirm user's email
router.post("/confirmation", (req, res) => {
    const { confirmationToken } = req.body;
    jwt.verify(confirmationToken, JWT_SECRET_MAILER, (err, decoded) => {
        if (err) {
            res.status(400).json({ errors: { global: "Invalid token" } });
        } else {
            const email = decoded.email;
            userFunctions.confirmUser({confirmationToken, email}, (errors, results) => {
                if (errors !== null) res.status(500).json({ errors });
                else if (results.affectedRows && results.affectedRows === 1) {
                    console.log("got here. changed it");
                    res.status(200).json({success: "Thank you. Your account has been verified!"});
                } else {
                    res.status(400).json({ errors: { global: "Something went wrong" } });
                }
            });
        }
    });
});

//generate and send a mail with password reset instructions
router.post("/send_email_confirmation_request", (req, res) => {
  userFunctions.getUserByEmail(req.body.email, (errors, results) => {
    if (errors !== null) res.status(500).json({ errors });
    else if (results.length > 0) {
      //sendConfirmationEmail({ email: results[0].email });
      res.json({});
    } else {
      res
        .status(400)
        .json({ errors: { global: "There is no user with such email" } });
    }
  });
});

//generate and send a mail with password reset instructions
router.post("/reset_password_request", (req, res) => {
  userFunctions.getUserByEmail(req.body.email, (errors, results) => {
    if (errors !== null) res.status(500).json({ errors });
    else if (results.length > 0) {
      const resetPasswordToken = userFunctions.generateResetPasswordToken({
        email: user.email,
      });
      //sendResetPasswordEmail({ email: results[0].email, resetPasswordToken });
      res.json({});
    } else {
      res
        .status(400)
        .json({ errors: { global: "There is no user with such email" } });
    }
  });
});

//verify a token
router.post("/validate_token", (req, res) => {
  jwt.verify(req.body.token, JWT_SECRET, err => {
    if (err) {
      res.status(401).json({});
    } else {
      res.json({});
    }
  });
});

//reset the user's password
router.post("/reset_password", (req, res) => {
  const { password, token } = req.body.data;
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      res.status(401).json({ errors: { global: "Invalid token" } });
    } else {
      bcrypt.hash(password, parseInt(SALT_ROUNDS), function(
        bcryptErr,
        hash
      ) {
        console.log(decoded.email);
        if (bcryptErr)
          res.status(500).json({ errors: { global: "Bcrypt:" + bcryptErr } });
        else
          userFunctions.changePassword(
            { password: hash, email: decoded.email },
            (errors, results) => {
              if (errors !== null) res.status(500).json({ errors });
              else if (results.affectedRows && results.affectedRows === 1) {
                res.json({});
              } else {
                res
                  .status(400)
                  .json({
                    errors: {
                      global: "Something bad happened - ResetPassword",
                    },
                  });
              }
            }
          );
      });
    }
  });
});

export default router;
