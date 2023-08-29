const asyncHandler = require("express-async-handler")
const registrationSchema = require("../userSchema")
const { validate } = require("jsonschema")
const validator = require("../validation")
const userModels = require("../models/userModels")
//@desc get all users
//@route get /api/users
//@access public
const getUsers = asyncHandler(async (req, res) => {

    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied' });
        }
        const userList = await userModels.find({}).limit(10)
        res.json({
            status: 'success',
            data: userList
        })
    }
    catch (error) {
        console.error('Error retrieving user list:', error);
        res.status(500).json({ message: 'Failed to retrieve user list' });
    }

    throw new Error("Get user for")
})

//@desc get all users
//@route get /api/users/id
//@access public
const getUser = asyncHandler(async (req, res) => {
    // let result =  userModels.find({})
    // res.json(result)
    res.json({ message: `update user for  ${req.params.id}` })
})

//@desc create new user
//@route post /api/users
//@access public
const createUser = asyncHandler(async (req, res) => {
    const validation = validator.validate(req.body, registrationSchema);
    if (validation.errors.length > 0) {
            return res.status(400).json({ errors: validation.errors });
        }
    const { username, email, password, address,role} = req.body
    let result = await userModels.findOne({ email })
    if (result) {
        return res.status(400).json({ message: "Email is already registered" })
    }
    try {
        const user = await userModels.create({ username, email, password, address: [...address],role})
        return res.json(user);
    }
    catch (error) {
        console.error("Error creating user:", error);
        return res.status(500).json({ message: "Failed to create user" });
    }
})



//@desc update user
//@route put /api/users/id
//@access public
const updateUser = asyncHandler(async (req, res) => {
    const{username,password,address,email}= req.body
    const userId = req.params.id;
    try{
    let user = await userModels.findById(userId)

    if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
    if(email && email !==user.email){
        return res.status(400).json({message:"Email updates are not allowed"})
    } 
      user.username = username;
      user.password = password;
      user.address  =  address;
      
      user = await user.save();
      return res.json(user);
    }
    catch (error) {
        console.error("Error updating user:", error);
        return res.status(500).json({ message: "Failed to update user" });
      }
})

//@desc delete user
//@route delete /api/users
//@access public
const deleteUser = asyncHandler(async (req, res) => {
    // let result =  userModels.find({})
    // res.json(result)
    res.json({ message: `update user for  ${req.params.id}` })
})



module.exports = { getUsers, updateUser, createUser, deleteUser, getUser }