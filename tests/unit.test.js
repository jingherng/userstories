const request = require('supertest');
const server = require('../server');

describe('POST /api/register', () => {
    it('responds with 204', async () => {
        const res = await request(server)
            .post('/api/register')
            .send({
                "teacher": "teacherken@gmail.com",
                "students":
                    [
                        "student1@gmail.com",
                        "student2@gmail.com"
                    ]
            });
        expect(res.status).toBe(204);
    });
});

describe('GET /api/commonstudents', () => {
    it('responds with 200 & list of students under teacherken@gmail.com', async () => {
        const res = await request(server)
            .get('/api/commonstudents?teacher=teacherken@gmail.com');
        expect(res.status).toBe(200);
        expect(res.body).toEqual({
            "students": [
                "student1@gmail.com",
                "student2@gmail.com"
            ]
        });
    });
});

describe('POST /api/suspend', () => {
    it('responds with 204', async () => {
        const res = await request(server)
            .post('/api/suspend')
            .send({
                "student": "student1@gmail.com"
            })
        expect(res.status).toBe(204);
    });
});

describe('POST /api/retrievefornotifications', () => {
    it('responds with 200 & returns a list of recipients: [student2@gmail.com, student3@gmail.com]', async () => {
        const res = await request(server)
            .post('/api/retrievefornotifications')
            .send({
                "teacher": "teacherken@gmail.com",
                "notification": "Hello students! @student3@gmail.com!"
            });
        expect(res.status).toBe(200);
        expect(res.body).toEqual({
            "recipients":
            [
                "student3@gmail.com",
                "student2@gmail.com",
            ]
        });
    });
});