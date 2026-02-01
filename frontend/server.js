const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv')
dotenv.config()

const session = require('express-session');

const app = express();
app.use(cookieParser());

// Serve static files from specified directories
app.use(express.static(path.join(__dirname, '/sec1_gr10_fe_src')));
app.use(express.static(path.join(__dirname, '/uploads')));
app.use(express.static(path.join(__dirname, '/css')));
app.use(express.static(path.join(__dirname, '/html')));
app.use(express.static(path.join(__dirname, '/js')));
app.use(express.static(path.join(__dirname, '/uploads/event')));
app.use(express.static(path.join(__dirname, '/uploads/support')));
app.use(express.static(path.join(__dirname, '/uploads/team')));

// Middleware to protect admin routes
function admin(req, res, next) {
    const Cookie = req.cookies['CookieNaJa'];
    console.log(Cookie);
    if (Cookie) {
        console.log("Cookie found:", Cookie);
        next();
    } else {
        console.log("No cookie found. Access denied.");
        res.redirect('/login-admin');
    }
}

// Middleware to protect user routes
function user(req, res, next) {
    const Cookie = req.cookies['Cookie-user'];
    console.log(Cookie);
    if (Cookie) {
        console.log("Cookie found:", Cookie);
        next();
    } else {
        console.log("No cookie found. Access denied.");
        res.redirect('/login');
    }
}

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '/html/login.html'));
});

app.get('/login-admin', (req, res) => {
    res.sendFile(path.join(__dirname, '/html/login-admin.html'));
});

app.get('/event-admin', admin, (req, res) => {
    res.sendFile(path.join(__dirname, '/html/event-admin.html'));
});

app.get('/user-admin', admin, (req, res) => {
    res.sendFile(path.join(__dirname, '/html/user-admin.html'));
});

app.get('/homepage', user, (req, res) => {
    res.sendFile(path.join(__dirname, '/html/homepage.html'));
});

app.get('/event', user, (req, res) => {
    res.sendFile(path.join(__dirname, '/html/event.html'));
});

app.get('/detail', user, (req, res) => {
    res.sendFile(path.join(__dirname, '/html/detail.html'));
});

app.get('/aboutus', user, (req, res) => {
    res.sendFile(path.join(__dirname, '/html/aboutus.html'));
});

app.get('/support', user, (req, res) => {
    res.sendFile(path.join(__dirname, '/html/support.html'));
});

// Start the server 
app.listen(process.env.PORT, () => {
    console.log(`Server is up at port ${process.env.PORT}`)
});