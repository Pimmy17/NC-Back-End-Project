const request = require("supertest");
const app = require("../app.js");
const seed = require("../db/seeds/seed.js");
const data = require("../db/data/test-data");
const db = require("../db/connection.js");
const { expect } = require("@jest/globals");



afterAll(() => db.end());
beforeEach(() => seed(data));


describe('Testing app', () => {
    test('should handle status 404 - bad pathway errors', () => {
        return request(app)
        .get("/api/invalid-path")
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
    describe('GET /api/articles/:article_id', () => {
        test('status: 200, responds with a single article', () => {
          return request(app)
            .get(`/api/articles/1`)
            .expect(200)
            .then(({ body: { article } }) => {
                article.forEach((oneArticle) => {
                  expect(oneArticle).toEqual(
                    expect.objectContaining({
                    author: expect.any(String),
                    title: expect.any(String),
                    article_id: expect.any(Number),
                    body: expect.any(String),
                    topic: expect.any(String),
                    created_at: expect.any(String),
                    votes: expect.any(Number)
                     })
                  );
                });
            });
        });
        test('status: 400, when an invalid article id is entered', () => {
            return request(app)
            .get(`/api/articles/barry`)
            .expect(400)
            .then(({ body: { msg } }) => {
                expect(msg).toBe("Wrong Input!")
            })
        });
        test('status: 404, when a valid type for article id is entered, however it currently does not exist', () => {
            return request(app)
            .get(`/api/articles/999999`)
            .expect(404)
            .then(({ body: { msg } }) => {
                expect(msg).toBe("Woah! We're not that big yet!")
            })
        })
    });
});