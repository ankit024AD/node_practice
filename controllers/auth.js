const { promisify } = require('util')
const jwt = require('jsonwebtoken')
const User = require('../models/userModels')
const bcrypt = require('bcrypt');

const signInToken = id => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: "60m"
    })
}

   const signup = async (req, res, next) => {
    try {
        const newUser = await User.create(req.body)
        const token = signInToken(newUser._id)

        res.status(201).json({
            status: 'Success!',
            token,
            data: {
                user: newUser
            }
        })
    } catch (err) {
        console.log(err)
    }

}

const signin = async (req, res, next) => {
    try {
        const { email, password } = req.body

        if (!email || !password) {
            return res.status(400).json({
                status: 'failed',
                message: 'Please provide email and password!',
              });
        }

        const user = await User.findOne({ email }).select('+password')

        if (!user | !(await user.correctPassword(password, user.password))) {
            res.status(400).json({
                status: 'failed',
                message: "email or password incorrect!"
            })
        }

        const token = signInToken(user._id)
        res.status(200).json({
            message: 'Success!',
            token,
            data: {
                user: {
                    _id: user._id,
                    name: user.username,
                    email: user.email,
                }
            }
        })
    } catch (err) {
        console.log(err)
        res.json({
            status: 'failed',
            message: err.message
        })
    }

}

// headers> Authorization : "Bearer token"
 const protectRoute = async (req, res, next) => {
    try {
        let token
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1]
        }
        if (!token) {
            return res.status(400).json({
                status: 'failed',
                message: "You are not logged in! Please login to get results."
            })
        }

        const decode = await promisify(jwt.verify)(token, process.env.JWT_SECRET)
        const freshUser = await User.findById(decode.id)
        if (!freshUser) {
            return res.status(400).json({
                status: 'failed',
                message: "Token/User no longer exists"
            })
        }

        req.user = freshUser
        next()

    } catch (e) {
        return res.json({
            status: 'failed',
            message: e.message
        })
    }

}
module.exports ={signup,signin,protectRoute}