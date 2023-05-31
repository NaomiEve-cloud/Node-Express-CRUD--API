const express = require("express");
const {
  createOrUpdateUser,
  getAllUsers,
  getUser,
  deleteUser,
} = require("../Controller/users");
const { verifyToken } = require("../helpers/authToken");

const router = express.Router();

// GET ALL USERS
router.get("/", verifyToken, async (req, res) => {
  //Get Admin email
  const email = req.adminEmail;
  const { success, data, error } = await getAllUsers(email);
  if (success) {
    return res.json({ success, data });
  }
  return res.status(404).json({ success: false, message: error });
});

// GET USER WITH ID
router.get("/:id", verifyToken, async (req, res) => {
  const { id } = req.params;
  const { success, data } = await getUser(id);
  if (success) {
    return res.json({ success, data });
  }
  return res.status(404).json({ success: false, message: "Error Occured !!!" });
});

// UPDATE EXISTING USER
router.put("/:id", verifyToken, async (req, res) => {
  const user = req.body;
  const { id } = req.params;
  user.id = id;

  const { success, data } = await createOrUpdateUser(user);
  if (success) {
    return res.json({ success, data });
  }
  return res.status(404).json({ success: false, message: "Error Occured !!!" });
});

// DELETE USER
router.delete("/:id", verifyToken, async (req, res) => {
  //Get Admin email
  const email = req.adminEmail;
  const { id } = req.params;
  const user = {
    email,
    id,
  };
  const { success, data, error } = await deleteUser(user);
  if (success) {
    return res.json({ success, data });
  }
  return res.status(404).json({ success: false, message: error });
});

module.exports = router;
