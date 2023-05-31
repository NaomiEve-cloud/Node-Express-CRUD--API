const express = require('express')
const { createOrUpdateUser, getAllUsers, getUser, deleteUser } = require('../Controller/users');


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



// router.post('/login', async (req, res) => {
//       //Check if payload is not empty
//     if (
//       !req.body ||
//       req.body === "" ||
//       req.body === null ||
//       Object.entries(req.body).length !== 2
//     )
//       return res.status(404).send({ error: "Invalid Payload" });
//   try{ 
//     const loginData = req.body
//     await loginSchema.validateAsync(loginData);


//     const email = loginData.email;


//     const scanParams = {
//       TableName: TABLE_NAME, 
//       FilterExpression: 'email = :email',
//       ExpressionAttributeValues: {
//         ':email': { S: email }
//       }
//     };

//        //check if user exist
//        dynamoClient.scan(scanParams, async (err, data) => {
//         if (err) {
//           console.error('Error querying database:', err.message);
//         } else {
//           //if no, throw an error message
//           if (data.Items.length < 0) {
//            res.status(404).send({error: "User doest exist!!!"})
//           } else {
//             // compare passwords if the match
//            console.log("Data: ", data.Items);        
//            const match = await bcrypt.compare(loginData.password, data.Items.password);
//            if (!match) return res.status(404).send({ error: "Invalid Password" });
         
        
//             return res.json({ message: "login successfully!!" })
//           }
//         }
//       });


//   }catch(error) {
//         res.status(404).send({ error: error.message });
//     }
// })

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