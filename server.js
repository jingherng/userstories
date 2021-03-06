const express = require('express');
const pool = require('./db');
const bodyParser = require('body-parser');
const app = express();
const port = 8080;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send("Up & Running...");
})

// register 1 or more students to a specified teacher //
app.post('/api/register', async (req, res) => {
    let conn;
    try {
        conn = await pool.getConnection();
        var valueTeacher = req.body.teacher;
        var valueStudents = req.body.students;
        for (i = 0; i < valueStudents.length; i++) {
            var query = `insert into registered values ("${valueTeacher}", "${valueStudents[i]}")`;
            await conn.query(query);
        }
        res.sendStatus(204);
    } catch (err) {
        console.log(`Error message: ${err.message}`);
        res.send({ message: err.message });
    } finally {
        if (conn) return conn.release();
    }
})

// retrieve list of students common to a given list of teachers
app.get('/api/commonstudents', async (req, res) => {
    let conn;
    try {
        conn = await pool.getConnection();
        var teachers = req.query.teacher;

        let flag = 0; // flag for when teachers is just one value or a list of teachers
        if (typeof (teachers) == 'string') {
            var query = `select students from registered where teacher="${teachers}"`;
        } else {
            var query = 'select students from registered where teacher in ' + conn.escape(teachers);
            flag = 1;
        }

        var studentList = await conn.query(query);
        var result = [];

        // find students common to a given list of teachers
        if (flag) {
            var unique = new Set()
            for (i = 0; i < studentList.length; i++) {
                let student = studentList[i].students;

                if (unique.has(student)) {
                    result.push(student);
                } else {
                    unique.add(student);
                }
            }
        } else {
            // else just push the students into the list for just one teacher
            for (i = 0; i < studentList.length; i++) {
                let student = studentList[i].students;
                result.push(student);
            }
        }
        res.send({ students: result });
    } catch (err) {
        console.log(`Error message: ${err.message}`);
        res.send({ message: err.message });
    } finally {
        if (conn) return conn.release();
    }
})

// suspend a specified student
app.post('/api/suspend', async (req, res) => {
    let conn;
    try {
        conn = await pool.getConnection();
        var student = req.body.student;
        var query = `insert into suspended values ("${student}")`;
        await conn.query(query);
        res.sendStatus(204);
    } catch (err) {
        console.log(`Error message: ${err.message}`);
        res.send({ message: err.message });
    } finally {
        if (conn) return conn.release();
    }
})

// retrieve list of students who can receive a given notification
app.post('/api/retrievefornotifications', async (req, res) => {
    let conn;
    try {
        conn = await pool.getConnection();

        var teacher = req.body.teacher;
        var notification = req.body.notification;

        // get suspended students
        var query = `select * from suspended`;
        var suspended = await conn.query(query);

        // get students registered with teacher
        var query = `select students from registered where teacher="${teacher}"`;
        var studentList = await conn.query(query);
        var registered = [];

        for (i = 0; i < studentList.length; i++) {
            let student = studentList[i].students;
            registered.push(student)
        }

        // get students mentioned in the notification
        var re = /\w+@\w+\.\w+/g;
        var mentioned = notification.match(re);

        // join registered + mentioned & remove duplicate students into new array
        if (mentioned !== null) {
            var result = new Set(mentioned.concat(registered));
        } else {
            var result = new Set(registered);
        }

        // remove students who are suspended
        for (i = 0; i < suspended.length; i++) {
            result.delete(suspended[i].student);
        }

        res.send({ recipients: [...result] });

    } catch (err) {
        console.log(`Error message: ${err.message}`);
        res.send({ message: err.message });
    } finally {
        if (conn) return conn.release();
    }
})

var server = app.listen(port, () => console.log(`Listing on Port ${port}`))

module.exports = server;