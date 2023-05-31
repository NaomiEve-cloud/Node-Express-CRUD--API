
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
    
    // Remove "S" and "N" attributes from the data
    const transformedData = Items.map(item => {
      const transformedItem = {};
      for (const [key, value] of Object.entries(item)) {
        const attributeValue = Object.values(value)[0];
        transformedItem[key] = attributeValue;
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