const express = require('express')
const { createOrUpdateUser, getAllUsers, getUser, deleteUser, loginUser } = require('../Controller/register');

const sendEmail = require("../helpers/notificationSender");

const  {registerSchema, loginSchema} = require('../schema/users.schema')

const AWS = require('aws-sdk');
const bcrypt = require("bcrypt");
const uuid = require("uuid");

AWS.config.update({
  region: 'us-east-1',
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const dynamoClient = new AWS.DynamoDB();

const TABLE_NAME = "RegisterTable";

const router = express.Router()

// GET ALL USERS
router.get('/users', async (req, res) => {
  const { success, data } = await getAllUsers()
  if (success) {
    return res.json({ success, data })
  }
  return res.status(500).json({ success: false, message: 'Error Occured !!!'})
});

// GET USER WITH ID
router.get('/users/:id', async (req, res) => {
  const { id } = req.params
  const { success, data } = await getUser(id)
  if (success) {
    return res.json({ success, data })
  }
  return res.status(500).json({ success: false, message: 'Error Occured !!!'})
});

// CREATE NEW USER
router.post('/register', async (req, res) => {
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

      // const dataInfo = await createOrUpdateUser(reggisterData)

   
    const email = reggisterData.email;


    const scanParams = {
      TableName: TABLE_NAME, // Replace with your table name
      FilterExpression: 'email = :email',
      ExpressionAttributeValues: {
        ':email': { S: email }
      }
    };

    //check if user exist
    dynamoClient.scan(scanParams, async (err, data) => {
      if (err) {
        console.error('Error querying database:', err.message);
      } else {
        //if yes, throw an error message
        if (data.Items.length > 0) {
         res.status(404).send({error: "User already exist!!!"})
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
            ReturnValues: "ALL_OLD"
          };

          dynamoClient.putItem(params, async(err, data) => {
            if (err) {
              return  {success: false, error: err.message};
            } else {

          const message = `
          <div style="text-align:center; padding-top:40px;">
          <h1>Welcome to the Gold Grid family</h1>
          <p>Thank you for filling out the form!</p>
          </div>
          `;

      
          await sendEmail(reggisterData.email, 'Welcome Email', message);
          return res.json({ message: "User Registered successfully!!" })
            }
          });


        }
      }
    });
    }catch(error) {
        res.status(404).send({ error: error.message });
    }

});


router.post('/login', async (req, res) => {
      //Check if payload is not empty
    if (
      !req.body ||
      req.body === "" ||
      req.body === null ||
      Object.entries(req.body).length !== 2
    )
      return res.status(404).send({ error: "Invalid Payload" });
  try{ 
    const loginData = req.body
    await loginSchema.validateAsync(loginData);

    const { success, data } = await createOrUpdateUser(loginData)



  }catch(error) {
        res.status(404).send({ error: error.message });
    }
})

// UPDATE EXISTING USER
router.put('/users/:id', async (req, res) => {
  const user = req.body
  const { id } = req.params
  user.id = id

  const { success, data } = await createOrUpdateUser(user)
  if (success) {
    return res.json({ success, data })
  }
  return res.status(500).json({ success: false, message: 'Error Occured !!!'})
});

// DELETE USER
router.delete('/users/:id', async (req, res) => {
  const { id } = req.params
  const { success, data } = await deleteUser(id)
  if (success) {
    return res.json({ success, data })
  }
  return res.status(500).json({ success: false, message: 'Error Occured !!!'})
});

module.exports = router;