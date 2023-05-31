const dynamoClient = require("./awsconnetion");
const uuid = require("uuid");
const moment = require("moment");
const TABLE_NAME = "LogsTable";

const log = async (log, req) => {
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;

  const id = uuid.v4();

  const params = {
    TableName: TABLE_NAME,
    Item: {
      id: { S: id },
      user_id: log.id,
      full_name: log.full_name,
      email: log.email,
      ip: { S: ip },
      date: { S: moment().format("L") },
      time: { S: moment().format("LT") },
    },
  };
  dynamoClient.putItem(params, async (err, data) => {
    if (err) {
      console.log("Error: ", err.message);
    } else {
      console.log("Items added successfully");
    }
  });
};

module.exports = log;
