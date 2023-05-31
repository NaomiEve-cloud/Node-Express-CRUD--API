const dotenv = require("dotenv");
const express = require("express");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
// import users  from './routes/register';
const users = require("./routes/users");
const auth = require("./routes/auth");
const admin = require("./routes/admin");

dotenv.config();
const PORT = 5000 || process.env.port;

const app = express();

app.use(cors());
app.use(logger("dev"));
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(helmet());

app.get("/", (req, res) => {
  res.send(`
    <div style="text-align:center; padding-top:40px;">
    <h1>Welcome to the Gold Grid family</h1>
    <p>Life is full of opportunities, be ready always!!!!</p>
    </div>
    `);
});

app.use("/api/auth", auth);
app.use("/api/admin", admin);
app.use("/api/users", users);

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
