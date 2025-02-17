const express = require('express');
const router = express.Router();
const {userData} = require("../models/userModel");
const {messageData} = require("../models/userModel")



router.get('/', (req, res) => {
    res.send('working fine');
});

router.get('/getmessage/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const message = await messageData.findById(id);

        if (!message) {
            return res.status(404).json({ message: 'Message not found' });
        }

        res.status(200).json(message);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching message', error: error.message });
    }
});


router.post('/message', async(req, res) => {
    const {message} = req.body;
    if(!message){
        return res.status(400).json({message:'message not found'})
    }

    
    try{
        const usersdata = new messageData({
            message: req.body.message,

        })

        await usersdata.save();

        return res.status(200).json({message: 'process is done, congratulations!'})
    }catch(err){
        return res.status(400).json({message:err.message})
    }
})

router.post('/signup', async (req, res) => {

   const existingUser = await userData.findOne({username:req.body.username})
   if(existingUser){
    return res.status(400).send('user is already existing')
   }else{

    try{
        const usersdata = new userData({
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            username: req.body.username,
        })

        await usersdata.save();

        return res.status(200).json({message: 'process is done, congratulations!'})
    }catch(err){
        return res.status(400).json({message:err.message})
    }
   }
}); 

router.post('/signin', async(req, res)=> {
  const {username, lastname} = req.body;

  if(!username || !lastname) {
    return res.status(400).json({message:'username and password not found'})
  }
  try{
    const user = await userData.findOne({username});
    if(!user){
        // We can use the throw new error to see the error message in the console or use the return. res to see the error message directly at the postman testing phase
        //   throw new Error('wrong username')
        return res.status(400).json({message:'wrong username'})
    }

    if(lastname !== user.lastname){
        // throw new Error('wrong password')
        return res.status(400).json({message:'wrong password'})
    }

    // User authenticated successfully
    var token = user.generateAuthToken();
        console.log(token)
        console.log('Logged in successful');
        res.status(200).json({message: "login successful"})
  }catch(err){
    console.log('error during login', err.message);
    res.status(401).json({message: 'invalid credentials'})
  }
});

router.put("/resetpasscode/:id", async(req, res)=> {
    const id = req.params.id;
    try{
    const user = await userData.findByIdAndUpdate(id, req.body, {new: true})
    
    if(!user){
        return res.status(404).json({message: 'user doesnt exist'})
    }
    res.status(200).json({message: 'updated successfully!'})
    }catch(err){
        console.log('error editing password', err.message);
        res.status(500).json({message: "internal server error"})
    }

})

module.exports = router;