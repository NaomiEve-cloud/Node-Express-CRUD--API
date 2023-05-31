//Import jsonwebtoken
const jwt = require("jsonwebtoken");

//Import Atob
const atob = require("atob");

//Generate Token
const generateToken = (dataObj, expiryData) =>
  jwt.sign(dataObj, "secret", { expiresIn: expiryData });

//Function to verify token.
async function verifyToken(req, res, next) {
  try {
    //Get Authorization
    const bearerHeader = req.headers["authorization"];

    if (bearerHeader === undefined)
      return res.status(404).send({ error: "Bad Token" });

    //Get Token.
    const bearerToken = bearerHeader.split(" ")[1];
    req.token = bearerToken.split('"')[0];
    const token = req.token;
    //Decode token
    const splittedToken = token.split(".")[1];
    const tokenObj = JSON.parse(atob(splittedToken));

    //Get Token expiry
    const expireDate = tokenObj.exp;

    //Check if token is expired
    if (Date.now() >= expireDate * 1000)
      return res.status(404).send({ error: "Token Expired" });

    //Get id
    req.userid = tokenObj.id;

    //Get user email
    req.userEmail = tokenObj.email;

    //get email
    req.adminEmail = tokenObj.email;

    next();
  } catch (error) {
    res.status(404).send({ error: error.message });
  }
}

module.exports = {
  generateToken,
  verifyToken,
};
