
const bcrypt = require("bcrypt");
const uuid = require("uuid");

const dynamoClient = require('../helpers/awsconnetion')



const TABLE_NAME = "RegisterTable";

//REGISTER

  // CREATE OR UPDATE USER
  const createOrUpdateUser = async (data = {}) => {
    const params = {
      TableName: TABLE_NAME,
      Item: data
    }
    try {
      await dynamoClient.put(params).promise()
      return { success: true }
    } catch(error) {
      return { success: false }
    }
  }


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
};

/*



*/