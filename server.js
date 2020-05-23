const express = require('express');
const pool = require('./db');
const bodyParser = require('body-parser');
const app = express();
const port = 8080;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/', (req, res) => {
    console.log(req.body);
    res.send("Up & Running...");
})

// register 1 or more students to a specified teacher //
app.post('/api/register', async (req, res) => {
    let conn;
    try {
        conn = await pool.getConnection();
        var valueTeacher = req.body.teacher;
        var valueStudents = req.body.students;
        var query = `insert into demo.registered values ("${valueTeacher}", "${valueStudents}")`;
        await conn.query(query);
        res.status(204).json();
    } catch (err) {
        console.log(`Error message: ${err.message}`);
        res.json({ message: err.message });
    } finally {
        if (conn) return conn.release();
    }
})

// retrieve list of students common to a given list of teachers
app.get('/api/commonstudents', async (req, res) => {
    let conn;
    try {
        conn = await pool.getConnection();
        var teacher = req.query.teacher;
        var query = `select students from demo.registered where teacher="${teacher}"`;
        var results = await conn.query(query);
        res.status(200).json(results);
    } catch (err) {
        console.log(`Error message: ${err.message}`);
        res.json({ message: err.message });
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
        var query = `insert into demo.suspended values ("${student}")`;
        await conn.query(query);
        res.status(204).json();
    } catch (err) {
        console.log(`Error message: ${err.message}`);
        res.json({ message: err.message });
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
        
        var query = `select students from demo.registered
        where students not in (select * from demo.suspended)`;

        var result = await conn.query(query);
        res.status(200).json(result);
    } catch (err) {
        console.log(`Error message: ${err.message}`);
        res.json({ message: err.message });
    } finally {
        if (conn) return conn.release();
    }
})


app.listen(port, () => console.log(`Listing on Port ${port}`))