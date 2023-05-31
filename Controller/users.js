// const { DynamoDBClient, UpdateItemCommand, PutItemCommand } = require("@aws-sdk/client-dynamodb");
const AWS = require('aws-sdk');
const bcrypt = require("bcrypt");
const uuid = require("uuid");


// const dynamoClient = new DynamoDBClient({
//   accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//   secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
// });

AWS.config.update({
  region: 'us-east-1',
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const dynamoClient = new AWS.DynamoDB();

const TABLE_NAME = "RegisterTable";

//REGISTER

const createOrUpdateUser = async (userData = {}) => {
  try {
    const email = userData.email;


    const scanParams = {
      TableName: 'RegisterTable', // Replace with your table name
      FilterExpression: 'email = :email',
      ExpressionAttributeValues: {
        ':email': { S: email }
      }
    };

    dynamoClient.scan(scanParams, async (err, data) => {
      if (err) {
        console.error('Error querying database:', err.message);
      } else {
        if (data.Items.length > 0) {
          console.log('Email already exists');
        } else {
          // Continue with user creation/update logic

          const saltRounds = 10;
          const plainPassword = userData.password;
      
          // Hash password
          const hash = await bcrypt.hash(plainPassword, saltRounds);
      
          const id = uuid.v4();
      
          const params = {
            TableName: TABLE_NAME, // Replace with your table name
            Item: {
              full_name: { S: userData.full_name },
              email: { S: userData.email },
              nationality: { S: userData.nationality },
              occupation: { S: userData.occupation },
              marital_status: { S: userData.marital_status },
              age: { N: userData.age.toString() },
              password: { S: hash },
              id: { S: id },
            },
            ReturnValues: "ALL_OLD"
          };

          // dynamoClient.putItem(params, (err, data) => {
          //   if (err) {
          //     return  {success: false, error: err.message};
          //   } else {
          //    return { success: true, data: userData.email };

          //   }
          // });

          return new Promise((resolve, reject) => {
            dynamodb.putItem(params, (err, data) => {
              if (err) {
                resolve({ success: false, error: err.message });
              } else {
                resolve({ success: true, data: userData.email });
              }
            });
          });

        }
      }
    });
  } catch (error) {
    console.error('Error:', error);
  }
};


const loginUser = async (data = {}) => {
  try {
    const { email, password } = data;

    const params = {
      TableName: TABLE_NAME,
      Key: {
        [key]: email,
      },
    };
    //Check if email exist
    const { Item = {} } = await dynamoClient.get(params).promise();
    if (!Item) return res.status(404).send({ error: "User does not exist!" });

    //Compare Passwords.
    const match = await bcrypt.compare(password, Item.password);
    if (!match) return res.status(404).send({ error: "Invalid Password" });

    return { success: true, data: userData.email };
  } catch (error) {
    res.status(404).send({ error: error.message });
  }
};

// FETCH ALL USERS
const getAllUsers = async () => {
  const params = {
    TableName: TABLE_NAME,
  };
  try {
    const { Items = [] } = await dynamoClient.scan(params).promise();
    return { success: true, data: Items };
  } catch (error) {
    return { success: false, data: null };
  }
};

// READ SINGLE USER ON KEY(id)
const getUser = async (value, key = "id") => {
  const params = {
    TableName: TABLE_NAME,
    Key: {
      [key]: value,
    },
  };
  try {
    const { Item = {} } = await dynamoClient.get(params).promise();
    return { success: true, data: Item };
  } catch (error) {
    return { success: false, data: null };
  }
};

// Delete Existing User
const deleteUser = async (value, key = "id") => {
  const params = {
    TableName: TABLE_NAME,
    Key: {
      [key]: value,
    },
  };
  try {
    await dynamoClient.delete(params).promise();
    return { success: true };
  } catch (error) {
    return { success: false };
  }
};

module.exports = {
  createOrUpdateUser,
  getAllUsers,
  getUser,
  deleteUser,
  loginUser,
};

/*



*/