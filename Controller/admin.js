const dynamoClient = require("../helpers/awsconnetion");
const bcrypt = require("bcrypt");
const uuid = require("uuid");
const { registerSchema, loginSchema } = require("../schema/users.schema");
const { generateToken } = require("../helpers/authToken");

const TABLE_NAME = "AdminTable";

const register = async (req, res) => {
  //Check if payload is not empty.
  if (
    !req.body ||
    req.body === "" ||
    req.body === null ||
    Object.entries(req.body).length < 5
  )
    return res.status(404).send({ error: "Invalid Payload" });

  try {
    //get access to the data from the user and store it in variable
    const reggisterData = req.body;
    //Validate the request from the user if it matches with the db
    await registerSchema.validateAsync(reggisterData);

    const email = reggisterData.email;

    const scanParams = {
      TableName: TABLE_NAME,
      FilterExpression: "email = :email",
      ExpressionAttributeValues: {
        ":email": { S: email },
      },
    };

    //check if user exist
    dynamoClient.scan(scanParams, async (err, data) => {
      if (err) {
        console.error("Error querying database:", err.message);
      } else {
        //if yes, throw an error message
        if (data.Items.length > 0) {
          res.status(404).send({ error: "Admin already exist!!!" });
        } else {
          // else continue with user creation/update logic

          // Hash password
          const saltRounds = 10;
          const plainPassword = reggisterData.password;
          const hash = await bcrypt.hash(plainPassword, saltRounds);

          const id = uuid.v4();

          const params = {
            TableName: TABLE_NAME,
            Item: {
              full_name: { S: reggisterData.full_name },
              email: { S: reggisterData.email },
              nationality: { S: reggisterData.nationality },
              occupation: { S: reggisterData.occupation },
              marital_status: { S: reggisterData.marital_status },
              age: { N: reggisterData.age.toString() },
              password: { S: hash },
              id: { S: id },
            },
            ReturnValues: "ALL_OLD",
          };

          dynamoClient.putItem(params, async (err, data) => {
            if (err) {
              return { success: false, error: err.message };
            } else {
              return res.json({ message: "Admin Registered successfully!!" });
            }
          });
        }
      }
    });
  } catch (error) {
    res.status(404).send({ error: error.message });
  }
};

const login = async (req, res) => {
  // Check if payload is not empty
  if (
    !req.body ||
    req.body === "" ||
    req.body === null ||
    Object.entries(req.body).length !== 2
  )
    return res.status(400).send({ error: "Invalid Payload" });

  try {
    const loginData = req.body;
    await loginSchema.validateAsync(loginData);

    const email = loginData.email;

    //query to check the db for email value
    const scanParams = {
      TableName: TABLE_NAME,
      FilterExpression: "email = :email",
      ExpressionAttributeValues: {
        ":email": { S: email },
      },
    };

    // Check if user exists
    dynamoClient.scan(scanParams, async (err, data) => {
      if (err) {
        console.error("Error querying database:", err.message);
        return res.status(500).send({ error: "Internal Server Error" });
      }

      // If no user found, return error message
      if (data.Items.length === 0) {
        return res.status(404).send({ error: "Admin does not exist!!" });
      }

      // Compare passwords if they match
      const storedUser = data.Items[0];
      const newPassword = storedUser.password.S;

      const match = await bcrypt.compare(loginData.password, newPassword);

      console.log(match);

      if (!match) {
        return res.status(401).send({ error: "Invalid Password" });
      }

      //Generate Token
      const token = await generateToken(
        {
          id: storedUser.id.S,
          full_name: storedUser.full_name.S,
          nationality: storedUser.nationality.S,
          email: storedUser.email.S,
        },
        "60m"
      );

      return res.json({ message: "Login successful!", token });
    });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

module.exports = {
  register,
  login,
};
