const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const authenticate = require('./middleware/authenticate');
const Task = require('./model/Task');
const User = require('./model/User');
const generateToken = require('./utils/generateToken');
require('dotenv').config();
const cors = require('cors');

mongoose.connect(process.env.DATABASE_URI);

const app = express();
app.use(express.json());
app.use(cors());

app.post('/register', async (req, res) => {
    try {
        const {username, password} = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({username: username, password: hashedPassword});
        const accessToken = generateToken({username: username, password: hashedPassword});
        res.json({username: username, accessToken: accessToken});
    } catch(err) {res.status(404).json({data: 'please send username and password'})}
});

app.post('/login', async (req, res) => {
    try {
        const {username, password} = req.body;
        const user = await User.findOne({username: username});
        if(!user) res.status(404).json({data: 'invalid username'});
        const isEqual = await bcrypt.compare(password, user.password);
        if(isEqual) {
            const token = generateToken({username: username, password: user.password});
            res.json({username: username, accessToken: token});
        } else {
            res.status(401).json({data: 'incorrect password'});
        }
    } catch(e) {res.status(404).json({data: 'please send username and password'})}
});

app.get('/tasks', authenticate, async (req, res) => {
    if(req.user) {
        const tasks = await Task.find({username: req.user.username});
        res.json(tasks);
    }
})

app.post('/tasks', authenticate, async (req, res) => {
    if(req.user) {
        const {title, tags, description} = req.body;
        const task = await Task.create({
            title: title,
            tags: tags,
            description: description,
            username: req.user.username
        });
        res.json(task);
    }
})

app.put('/tasks/:id', authenticate, async (req, res) => {
    try {
        const id = new mongoose.mongo.ObjectId(req.params.id);
        const task = await Task.findOne({_id: id});
        task.isCompleted = true;
        await task.save();
        res.json(task);
    } catch(e) {console.log(e);res.json({data: 'error'})}
});

app.delete('/tasks/:id', authenticate, async (req, res) => {
    try {
        const id = new mongoose.mongo.ObjectId(req.params.id);
        const response = await Task.deleteOne({_id: id});
        console.log(response);
        res.json(response);
    } catch(e) {console.log(e);res.json({data: "error"})}
})

app.listen(process.env.PORT, () => {
    console.log(`listening on port ${process.env.PORT}`);
})