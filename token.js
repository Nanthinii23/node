const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');
require('dotenv').config();
app.use(express.json());

const posts = [
    {
        username: "Nanthini",
        title: "post 1"
    },
    {
        username: "Natarajan",
        title: "post 2"
    }
];


app.get("/post", authenticateToken, (req, res) => {
    res.json(posts.filter(post => post.username === req.user.name));
});

app.post("/login", (req, res) => {
    const username = req.body.username;
    const user = { name: username };
    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
    res.json({ accessToken: accessToken });
});

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null)
        return res.sendStatus(401);
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err)
            return res.sendStatus(403);
        req.user = user;
        next();
    });
}
app.listen(4000, () => {
    console.log("Server is running on port 4000");
});
