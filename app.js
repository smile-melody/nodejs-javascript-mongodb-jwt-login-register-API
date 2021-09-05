require('dotenv').config();
require('./config/database').connect();

const express = require('express');
const app = express();
const User = require('./models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const auth = require('./middleware/auth');

app.use(express.json());

app.post('/register', async (req,res) => {

    try {
        const { firstname, lastname, email, password } = req.body;
        if (!(email && password && firstname && lastname)) {
            res.send('Please enter all data');
        }
        const oldUser = await User.findOne({ email });
        if (oldUser) {
            return res.send('User has already exist. Please login');
        }
        encryptPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            firstname,
            lastname,
            email: email.toLowerCase(),
            password: encryptPassword
        });
        const token = jwt.sign({ user_id: user._id, email }, process.env.TOKEN_KEY, { expiresIn: "2h" });
        user.token = token;
        res.json(user);
    }
    catch (err) {
        console.log(err);
    }
});


app.post('/login', async (req,res) => {
    try
    {
        const { email, password } = req.body;

        if (!(email && password)) {
            res.send('Please enter all data');
        }

        const user = await User.findOne({ email });
        if (user && (await bcrypt.compare(password, user.password))) {
            const token = jwt.sign(
                {user_id: user._id, email},
                process.env.TOKEN_KEY, {
                    expiresIn: "2h"
                }
            );

            user.token = token;
            res.json(user);
        }

        res.status(404).send('Invlidate token');
    }
    catch (e) {
        console.log(e);
    }
});

app.post('/welcome', auth, (req,res) => {
    res.send('Welcome 👌'); 
});

module.exports = app;