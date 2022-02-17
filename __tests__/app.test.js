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
        test('updates the article object to include a comment count', () => {
            return request(app)
            .get("/api/articles")
            .expect(200)
            .then(({ body: { articles } }) => {
                articles.forEach((article) => {
                    expect(article).toEqual(
                        expect.objectContaining({
                            comment_count: expect.any(String),
                        })
                    )
                })
            })
        });
        test('allows the data to be sorted by any column, but the default is still date', () => {
            const sortBy = 'author';
            return request(app)
            .get(`/api/articles?sort_by=${sortBy}`)
            .expect(200)
            .then(({ body: { articles } }) => {
                    expect(articles).toBeSortedBy(sortBy, { descending: true });
                })
        });
        test('rejects an invalid sort by query', () => {
            const sortBy = 'songs';
            return request(app)
            .get(`/api/articles?sort_by=${sortBy}`)
            .expect(400)
            .then(({ body: { msg } }) => {
                    expect(msg).toBe('Invalid Sort Query');
                })
        });
        test('the data can be sorted by ascending and descending with descending as the default order by method', () => {
            const orderBy = 'asc';
            return request(app)
            .get(`/api/articles?order_by=${orderBy}`)
            .expect(200)
            .then(({ body: { articles } }) => {
                expect(articles).toBeSortedBy('created_at', { ascending: true });
            })
        });
        test('sorting the data when both a sort by and an order by query is passed in', () => {
            const orderBy = 'ASC';
            const sortBy = 'title';
            return request(app)
            .get(`/api/articles?sort_by=${sortBy}&order_by=${orderBy}`)
            .expect(200)
            .then(({ body: { articles } }) => {
                expect(articles).toBeSortedBy(sortBy, { ascending: true });
            })
        });
        test('rejects an invalid order by query', () => {
            const orderBy = 'parallel';
            return request(app)
            .get(`/api/articles?order_by=${orderBy}`)
            .expect(400)
            .then(({ body: { msg } }) => {
                expect(msg).toBe('Invalid Order Query');
            })
        });
        test('filters the articles by a valid topic', () => {
            const validTopic = 'mitch';
            return request(app)
            .get(`/api/articles?topic=${validTopic}`)
            .expect(200)
            .then(({ body: { articles } }) => {
                expect(articles).toEqual('')
            })
        });
    });
    describe('GET /api/articles/:article_id', () => {
        test('status: 200, responds with a single article', () => {
          return request(app)
            .get(`/api/articles/1`)
            .expect(200)
            .then(({ body: { article } }) => {
                  expect(article).toEqual(
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
        test('status: 200, responds with the number of comments for each article', () => {
            return request(app)
            .get(`/api/articles/1`)
            .expect(200)
            .then(({ body: { article }}) => {
                expect(article.comment_count).toEqual('11')
            })
        });
        test('status: 200, responds with the number of comments as 0 where an article has no comments', () => {
            return request(app)
            .get(`/api/articles/2`)
            .expect(200)
            .then(({ body: { article }}) => {
                expect(article.comment_count).toEqual('0')
            })
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
                expect(msg).toBe("ID Does Not Exist!")
            })
        })
    });
    describe('GET /api/articles/:article_id/comments', () => {
        test('status: 200, returns an array of objects containing comments for the relevant article id', () => {
            return request(app)
            .get(`/api/articles/1/comments`)
            .expect(200)
            .then(({ body: {comments} }) => {
                expect(comments).toHaveLength(11);
            })
        });
        test('status: 200, returns an array of objects containing comments for the relevant article id', () => {
            return request(app)
            .get(`/api/articles/1/comments`)
            .expect(200)
            .then(({ body: {comments} }) => {
                comments.forEach((comment) => {
                    expect(comment).toEqual(
                      expect.objectContaining({
                      comment_id: expect.any(Number),
                      votes: expect.any(Number),
                      created_at: expect.any(String),
                      author: expect.any(String),
                      body: expect.any(String),
                      })
                    );
                });
            })
        });
        test('status: 200, when an article id is entered, however there are no comments attached to that article', () => {
            return request(app)
            .get(`/api/articles/2/comments`)
            .expect(200)
            .then(({ body: {comments} }) => {
                expect(comments).toHaveLength(0);
            })
        })
    });
    describe("DELETE", () => {
        test("status: 204, deletes a selected comment_id", () => {
          return request(app)
          .delete(`/api/articles/1/2`)
          .expect(204);
        });
    });
});