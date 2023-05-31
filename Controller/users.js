const dynamoClient = require("../helpers/awsconnetion");

const TABLE_NAME = "UsersTable";
const TABLE_NAME1 = "AdminTable";

//REGISTER

// CREATE OR UPDATE USER
const createOrUpdateUser = async (data = {}) => {
  const params = {
    TableName: TABLE_NAME,
    Item: data,
  };
  try {
    await dynamoClient.put(params).promise();
    return { success: true };
  } catch (error) {
    return { success: false };
  }
};

// FETCH ALL USERS
const getAllUsers = async (email) => {
  //query to check the db for email value
  const scanParams = {
    TableName: TABLE_NAME1,
    FilterExpression: "email = :email",
    ExpressionAttributeValues: {
      ":email": { S: email },
    },
  };

  const params = {
    TableName: TABLE_NAME,
  };
  try {
    //check if user is an admin to access this route
    const data = await dynamoClient.scan(scanParams).promise();
    if (data.Items.length === 0)
      return { success: false, error: "Permission denied!!" };

    const { Items = [] } = await dynamoClient.scan(params).promise();

    // Remove "S" and "N" attributes from the data and exclude "password" field
    const transformedData = Items.map((item) => {
      const transformedItem = {};
      for (const [key, value] of Object.entries(item)) {
        if (key !== "password") {
          const attributeValue = Object.values(value)[0];
          transformedItem[key] = attributeValue;
        }
      }
      return transformedItem;
    });

    return { success: true, data: transformedData };
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

    // Remove "S" and "N" attributes from the data
    const transformedItem = {};
    for (const [key, value] of Object.entries(Item)) {
      const attributeValue = Object.values(value)[0];
      transformedItem[key] = attributeValue;
    }

    return { success: true, data: transformedItem };
  } catch (error) {
    return { success: false, data: null };
  }
};

// Delete Existing User
const deleteUser = async (user, key = "id") => {
  //query to check the db for email value
  const scanParams = {
    TableName: TABLE_NAME1,
    FilterExpression: "email = :email",
    ExpressionAttributeValues: {
      ":email": { S: user.email },
    },
  };

  const params = {
    TableName: TABLE_NAME,
    Key: {
      [key]: value.id,
    },
  };
  try {
    //check if user is an admin to access this route
    const data = await dynamoClient.scan(scanParams).promise();
    if (data.Items.length === 0)
      return { success: false, error: "Permission denied!!" };

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
};

/*



*/
