const express = require("express")
const cors=require("cors")
const path = require('path');
var app = express();
app.use(cors());

//HOST ON LOCALHOST:8000 FOR NOW, WHEN YOU START THIS BACKEDN TO RUN THE FRONT END YOU **MUST** USE http://localhost:8000/
app.use(express.static(path.join(__dirname, '..', 'front-end')));
app.use(express.json());



const saltRounds = 10;

//REGISTER FUNCTION
app.post("/register", (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).send({ error: "Email and password are required." });
    }

    // Hash the password before storing it in the database
    bcrypt.hash(password, saltRounds, function(err, hashedPassword) {
        if (err) {
            console.error(err.message);
            return res.status(500).send({ error: "An error occurred while hashing the password." });
        }

        // Now store email and hashedPassword in the database
        const sql = `INSERT INTO users (Email, Password) VALUES (?, ?)`;
        db.run(sql, [email, hashedPassword], function(err) {
            if (err) {
                console.error(err.message);
                return res.status(400).send({ error: err.message });
            }
            // If successful, send back the email of the inserted user
            res.status(201).send({ email: email });
        });
    });
});

//LOGIN FUNCTION
app.post("/login", (req, res) => {
    const { email, password } = req.body;

    const sql = `SELECT Email, Password FROM users WHERE Email = ?`;
    db.get(sql, [email], (err, row) => {
        if (err) {
            console.error(err.message);
            return res.status(500).send({ error: "An error occurred." });
        }
        if (row) { // Check truthiness of user
            // user found, now compare the provided password with the hashed password
            bcrypt.compare(password, row.Password, (err, result) => {
                if (err) {
                    console.error(err.message);
                    return res.status(500).send({ error: "An error occurred during password comparison." });
                }
                if (result) {
                    // Passwords match
                    req.session.user = { email: email };
                    res.status(200).send({ message: "Login successful." });
                } else {
                    // Passwords do not match
                    res.status(401).send({ error: "Invalid credentials." });
                }
            });
        } else {
            // User not found
            res.status(404).send({ error: "User not found." });
        }
    });
});

//CREATE NEW TASK
app.post("/tasks", (req, res) => {
    const { task } = req.body;
    const email = req.session.user.email; //Using sessions here to access email when email is not a form to be filled in
    if (!email || !task) {
        return res.status(400).send({ error: "Email and task are required." });
    }

    // Check if the user exists in the users table first
    const checkUserSql = `SELECT Email FROM users WHERE Email = ?`;
    db.get(checkUserSql, [email], (err, row) => {
        if (err) {
            console.error(err.message);
            return res.status(500).send({ error: "An error occurred while checking the user." });
        }
        if (!row) {
            return res.status(404).send({ error: "User not found." });
        }

        // User exists, now insert the task
        const insertTaskSql = `INSERT INTO tasks (Email, Task, isDone) VALUES (?, ?, 0)`;
        db.run(insertTaskSql, [email, task], function(err) {
            if (err) {
                console.error(err.message);
                return res.status(500).send({ error: "An error occurred while adding the task." });
            }
            res.status(201).send({ message: "Task added successfully." });
        });
    });
});

//TOGGLE TASK COMPLETE/UNCOMPLETE
app.patch("/tasks/:TID", (req, res) => {
    const { TID } = req.params; // Get the task ID (TID) from the URL parameter

    // First, get the current state of the task
    const getTaskSql = `SELECT isDone FROM tasks WHERE TID = ?`;
    db.get(getTaskSql, [TID], function(err, row) {
        if (err) {
            console.error(err.message);
            return res.status(500).send({ error: "An error occurred while fetching the task." });
        }
        if (!row) {
            return res.status(404).send({ error: "Task not found." });
        }

        // Determine the new state based on the current state
        const newState = row.isDone === 1 ? 0 : 1;

        // Now, update the task with the new state
        const updateTaskSql = `UPDATE tasks SET isDone = ? WHERE TID = ?`;
        db.run(updateTaskSql, [newState, TID], function(err) {
            if (err) {
                console.error(err.message);
                return res.status(500).send({ error: "An error occurred while updating the task." });
            }
            if (this.changes > 0) {
                res.status(200).send({ message: "Task updated successfully." });
            } else {
                res.status(404).send({ error: "Task not found." });
            }
        });
    });
});

//GET ALL TASKS FOR USER WITH EMAIL
app.get("/tasks", (req, res) => {
    const email = req.session.user.email; //we use her again
    if (!email) {
        return res.status(401).send({ error: "Unauthorized" });
    }

    const sql = `SELECT * FROM tasks WHERE Email = ?`;
    db.all(sql, [email], (err, tasks) => {
        if (err) {
            console.error(err.message);
            return res.status(500).send({ error: "An error occurred while fetching tasks." });
        }
        res.status(200).json(tasks);
    });
});


// start server
const HTTP_PORT = 8000;
app.listen(HTTP_PORT, () => {
    console.log(`Server is running on port ${HTTP_PORT}`);
    console.log("To run the application now, go to http://localhost:8000/")
});

