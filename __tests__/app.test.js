const request = require("supertest");
const app = require("../app.js");
const seed = require("../db/seeds/seed.js");
const data = require("../db/data/test-data");
const db = require("../db/connection.js");



afterAll(() => db.end());
beforeEach(() => seed(data));


describe('Testing app', () => {
    test('should handle status 404 - bad pathway errors', () => {
        return request(app)
        .get("/api/topix")
        .expect(404)
        .then(({body: { msg } }) => {
            expect(msg).toBe("Incorrect Pathway =/");
        })
    });

    describe('GET /api/topics', () => {
        test('should return a status of 200 and an array of objects with slug and description', () => {
            return request(app)
            .get("/api/topics")
            .expect(200)
            .then(({body: { topics } }) => {
                topics.forEach((topic) => {
                    expect(topic).toEqual(
                        expect.objectContaining({
                            slug: expect.any(String),
                            description: expect.any(String)
                        })
                    )
                })
            })
        });
    });
    describe('GET /api/users', () => {
        test('should return a status of 200 and an array of objects containing all users', () => {
            return request(app)
            .get("/api/users")
            .expect(200)
            .then(({ body: { users } }) => {
                users.forEach((user) => {
                    expect(user).toEqual(
                        expect.objectContaining({
                            username: expect.any(String),
                        })
                    )
                })
            })
        });
    });
    describe('GET /api/articles', () => {
        test('should return a status of 200 and an array of objects containing all articles', () => {
            return request(app)
            .get("/api/articles")
            .expect(200)
            .then(({ body: { articles } }) => {
                articles.forEach((article) => {
                    expect(article).toEqual(
                        expect.objectContaining({
                            author: expect.any(String),
                            title: expect.any(String),
                            article_id: expect.any(Number),
                            topic: expect.any(String),
                            created_at: expect.any(String),
                            votes: expect.any(Number)
                        })
                    )
                })
            })
        });
        test('should return the articles in descending date order by default', () => {
            return request(app)
            .get("/api/articles")
            .expect(200)
            .then(({ body: { articles } }) => {
                    expect(articles).toBeSortedBy("created_at", {descending: true,});
                })
        });
    });
});