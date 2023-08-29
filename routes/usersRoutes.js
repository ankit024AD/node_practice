const express = require("express");
const userModels = require("../models/userModels");
const router = express.Router();
const {getUsers,getUser,updateUser,createUser,deleteUser} = require("../controllers/userController")
const { signin, signup, protectRoute } = require("../controllers/auth")

router.post('/signup', signup)
router.post('/signin', signin)
router.route("/").get(protectRoute,getUsers).post(createUser)
router.route("/:id").put(protectRoute,updateUser).delete(protectRoute,deleteUser).get(getUser)

module.exports = router;