
const express = require('express');
const dotenv = require('dotenv');
const mysql = require('mysql2');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const bodyParser = require('body-parser');
const fs = require('fs');
const cookieParser = require("cookie-parser");


const app = express();
const router = express.Router();

app.use(bodyParser.json());
app.use(router)
router.use(express.json());
router.use(express.urlencoded({ extended: true }));
dotenv.config();
app.use(cookieParser());


let whiteList = ['http://localhost:3000']

let corsOptions = {
    origin: whiteList,
    credentials: true,
    method: 'GET,POST,PUT,DELETE'
}

router.use(cors(corsOptions));

// MySQL connection
var dbConn = mysql.createConnection({
    host: process.env.MYSQL_HOST,
    port: process.env.MYSQL_PORT,
    user: process.env.MYSQL_USERNAME,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
});

dbConn.connect(function (err) {
    if (err) throw err;
    console.log(`Connected DB: ${process.env.MYSQL_DATABASE}`);
});

// Multer setup for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../sec1_gr10_fe_src/uploads'));
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
})

const upload = multer({ storage: storage });



// Admin login route with basic username/password validation
router.post("/login", async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const recaptcha = req.body.recaptcha;

    if (!username || !password) {
        return res.status(400).json({ error: "Username and password are required." });
    }
    // if(!recaptcha){
    //     return res.status(400).json({ error: "Please complete the reCAPTCHA"});
    // }

    const sqlQuery = "SELECT * FROM Admin_login WHERE a_username = ?";
    dbConn.query(sqlQuery, [username], (err, results) => {
        if (err) {
            console.error("Database Error:", err);
            return res.status(500).json({ error: "An error occurred while processing your request." });
        }

        if (results.length === 0) {
            console.log('no user found');
            return res.status(401).json({ error: "Invalid username or password." });
        }

        const admin = results[0];

        if (password !== admin.a_password) {
            console.log('password mismatch');
            return res.status(401).json({ error: "Invalid username or password." });
        }

        const loginQuery = "UPDATE Admin_login SET a_date = NOW() WHERE a_username = (?)";
        dbConn.query(loginQuery, [admin.a_username], (err, result) => {
            if (err) {
                console.error("Error inserting login data:", err);
                return res.status(500).json({ error: "Failed to record login." });
            }
            console.log("Update result:", result);
            if (result.affectedRows === 0) {
                console.warn("No rows were updated. Username might not exist:", admin.username);
                return res.status(404).json({ error: "Username not found." });
            }
        });

        const sessionToken = `session-${new Date().getTime()}`;
        const cookieOptions = {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000,
        };
        res.cookie("CookieNaJa", sessionToken, cookieOptions);
        res.status(200).json({ message: "Login successful", user: { username: admin.a_email } });
    });

});

// User login with RECAPTCHA validation
router.post("/loginUser", async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const recaptcha = req.body.recaptcha;

    if (!username || !password) {
        return res.status(400).json({ error: "Username and password are required." });
    }
    if (!recaptcha) {
        return res.status(400).json({ error: "Please complete the reCAPTCHA" });
    }

    const sqlQuery = "SELECT * FROM Users WHERE u_username = ?";
    dbConn.query(sqlQuery, [username], (err, results) => {
        if (err) {
            console.error("Database Error:", err);
            return res.status(500).json({ error: "An error occurred while processing your request." });
        }

        if (results.length === 0) {
            console.log('no user found');
            return res.status(401).json({ error: "Invalid username or password." });
        }

        const user = results[0];

        if (password !== user.u_password) {
            console.log('password mismatch');
            return res.status(401).json({ error: "Invalid username or password." });
        }

        const sessionToken = `session-${new Date().getTime()}`;
        const cookieOptions = {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000,
        };
        res.cookie("Cookie-user", sessionToken, cookieOptions);
        res.status(200).json({ message: "Login successful", user: { username: user.u_username } });
    });

});

// Testing Insert a new Event

// case 1:
// method: post
// URL: http://localhost:3030/event
// body: form-data
// {
// "event": {
// "e_img": "fileimg"
// "e_name": Oat's Birthday,
// "e_start_date": 2025-05-15,
// "e_end_date": 2025-05-15,
// "e_category": Community & Social
// "e_status" : Available
// "e_location" : About us
// "e_details" : come and join party
// "participant" : 2
// }
// }
// Result
// {
//     "error": false,
//     "data": 14,
//     "message": "New event has been created successfully."
// }

// case 2:
// method: post
// URL: http://localhost:3030/event
// body: form-data
// {
// "event": {
// "e_img": "fileimg"
// "e_name": Exchange Gift,
// "e_start_date": 2025-05-20,
// "e_end_date": 2025-05-20,
// "e_category": Community & Social
// "e_status" : Available
// "e_location" : Mahidol
// "e_details" : don't forget to bring your own gift
// "participant" : 10
// }
// }
// Result
// {
//     "error": false,
//     "data": 16,
//     "message": "New event has been created successfully."
// }

// Create a new event with image upload
router.post('/event',
    upload.fields([
        { name: 'e_img', maxCount: 1 }
    ]),
    function (req, res) {
        let event = req.body;
        console.log(event);

        event.e_img = `/${req.files['e_img']?.[0]?.filename}` || null;

        if (!event || !event.e_name) {
            return res.status(400).send({ error: true, message: 'Please provide complete event information' });
        }

        dbConn.query("INSERT INTO events SET ? ", event, function (error, results) {
            if (error) throw error;
            return res.send({ error: false, data: results.insertId, message: 'New event has been created successfully.' });
        });
    });

// Testing Edit an Event

// case 1:
// method: put
// URL: http://localhost:3030/event
// body: form-data
// {
// "event": {
// "e_img": "fileimg"
// "e_name": Update,
// "e_start_date": 2025-05-20,
// "e_end_date": 2025-05-20,
// "e_category": Community & Social
// "e_status" : Available
// "e_location" : Mahidol
// "e_details" : don't forget to bring your own gift
// "participant" : 10
// "event_id" : 15
// }
// }
// Result
// {
//     "error": false,
//     "data": 1,
//     "message": "Event has been updated successfully."
// }

// case 2:
// method: put
// URL: http://localhost:3030/event
// body: form-data
// {
// "event": {
// "e_img": "fileimg"
// "e_name": Update,
// "e_start_date": 2025-05-31,
// "e_end_date": 2025-05-31,
// "e_category": Community & Social
// "e_status" : Available
// "e_location" : Mahidol
// "e_details" : come and join meet new people
// "participant" : 10
// "event_id" : 14
// }
// }
// Result
// {
//     "error": false,
//     "data": 1,
//     "message": "Event has been updated successfully."
// }

// Update an event (optional image replacement)
router.put('/event',
    upload.fields([
        { name: 'e_img', maxCount: 1 }
    ])
    , function (req, res) {
        const eventID = req.body.event_id;
        if (!eventID) {
            return res.status(400).send({ error: true, message: 'Event ID is required' });
        }

        const event = { ...req.body };

        if (req.files['e_img']) event.e_img = `/${req.files['e_img'][0].filename}`;

        Object.keys(event).forEach(key => {
            if (!event[key]) delete event[key];
        });

        dbConn.query("UPDATE events SET ? WHERE event_id = ?", [event, eventID], function (error, results) {
            if (error) throw error;
            return res.send({ error: false, data: results.affectedRows, message: 'Event has been updated successfully.' });
        });
    });

// Testing Delete an Event

// case 1:
// method: delete
// URL: http://localhost:3030/event/id
// body: parameter

// Result
// {
//     "error": false,
//     "data": 1,
//     "message": "Event has been deleted successfully."
// }

// case 2:
// method: delete
// URL: http://localhost:3030/event/id
// body: parameter

// Result
// {
//     "error": false,
//     "data": 1,
//     "message": "Event has been deleted successfully."
// }

// Delete an event and its image file
router.delete('/event/:id', function (req, res) {
    let event_id = req.params.id;
    if (!event_id) {
        return res.status(400).send({ error: true, message: 'Please provide event ID' });
    }

    const sqlSelect = 'SELECT e_img FROM events WHERE event_id = ?';
    dbConn.query(sqlSelect, [event_id], function (error, results) {
        if (error) {
            console.error('Database Error:', error);
            return res.status(500).send({ error: true, message: 'Database error occurred while retrieving event images' });
        }

        if (results.length === 0) {
            return res.status(404).send({ error: true, message: 'event not found' });
        }

        const eventImages = results[0];

        const deleteFile = (filePath) => {
            if (filePath) {
                const absolutePath = path.isAbsolute(filePath) ? filePath : path.join(__dirname, '../', filePath);
                fs.unlink(absolutePath, (err) => {
                    if (err && err.code !== 'ENOENT') {
                        console.error(`Error deleting file: ${absolutePath}`, err);
                    } else {
                        console.log(`Deleted file: ${absolutePath}`);
                    }
                });
            }
        };
        deleteFile(path.join(__dirname, '../sec1_gr10_fe_src/uploads', eventImages.e_img));

        dbConn.query('DELETE FROM events WHERE event_id = ?', [event_id], function (error, results) {
            if (error) throw error;
            return res.send({ error: false, data: results.affectedRows, message: 'Event has been deleted successfully.' });
        });
    });
});

// Get a single event by ID
router.get('/event/:id', function (req, res) {
    let event_id = req.params.id;

    if (!event_id) {
        return res.status(400).send({ error: true, message: 'Please provide event ID.' });
    }

    dbConn.query('SELECT * FROM events WHERE event_id = ?', event_id, function (error, results) {
        if (error) throw error;
        return res.send({ error: false, data: results[0], message: 'Event retrieved successfully.' });
    });
});

// Get all events
router.get('/events', function (req, res) {
    dbConn.query('SELECT * FROM events', function (error, results) {
        if (error) throw error;
        results.forEach(event => {
            if (event.e_img) event.e_img = `${event.e_img}`;
        });
        return res.send({ error: false, data: results, message: 'Event list retrieved successfully.' });
    });
});

// Create a new admin
router.post('/admin', function (req, res) {
    let admin = req.body;

    if (!admin || !admin.a_fname || !admin.a_lname || !admin.a_email) {
        return res.status(400).send({ error: true, message: 'Please provide complete admin information' });
    }

    const query = `INSERT INTO admin_info (a_fname, a_lname, a_birthdate, a_phonenumber, a_email, a_gender) VALUES (?, ?, ?, ?, ?, ?)`;
    dbConn.query(query, [
        admin.a_fname, admin.a_lname, admin.a_birthdate, admin.a_phonenumber, admin.a_email, admin.a_gender], function (error, results) {
            if (error) throw error;
            return res.send({ error: false, data: results.insertId, message: 'New admin has been created successfully.' });
        });
});

// Update an admin
router.put('/admin', function (req, res) {
    let adminID = req.body.admin_id;
    let admin = req.body;
    if (!adminID || !admin) {
        return res.status(400).send({ error: true, message: 'Please provide admin information and admin ID' });
    }

    dbConn.query("UPDATE admin_info SET ? WHERE admin_id = ?", [admin, adminID], function (error, results) {
        if (error) throw error;
        return res.send({ error: false, data: results.affectedRows, message: 'Admin has been updated successfully.' });
    });
});

// Delete an admin
router.delete('/admin/:id', function (req, res) {
    let adminID = req.params.id;
    if (!adminID) {
        return res.status(400).send({ error: true, message: 'Please provide admin ID' });
    }

    dbConn.query('DELETE FROM admin_info WHERE admin_id = ?', [adminID], function (error, results) {
        if (error) throw error;
        return res.send({ error: false, data: results.affectedRows, message: 'Admin has been deleted successfully.' });
    });
});

// Get admin by ID
router.get('/admin/:id', function (req, res) {
    let admin_id = req.params.id;

    if (!admin_id) {
        return res.status(400).send({ error: true, message: 'Please provide admin ID.' });
    }

    dbConn.query('SELECT * FROM admin_info WHERE admin_id = ?', admin_id, function (error, results) {
        if (error) throw error;
        return res.send({ error: false, data: results[0], message: 'Admin retrieved successfully.' });
    });
});

// Get all admins
router.get('/admins', function (req, res) {
    dbConn.query('SELECT * FROM admin_info', function (error, results) {
        if (error) throw error;
        return res.send({ error: false, data: results, message: 'Admin list retrieved successfully.' });
    });
});

// Start the server
app.listen(process.env.PORT, () => {
    console.log(`Server listening on port: ${process.env.PORT}`)
});
