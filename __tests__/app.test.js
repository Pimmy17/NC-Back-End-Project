const request = require("supertest");
const app = require("../app.js");
const seed = require("../db/seeds/seed.js");
const data = require("../db/data/test-data");
const db = require("../db/connection.js");

beforeEach(() => seed(data));
afterAll(() => db.end());

describe("Testing App", () => {
  test("should handle status 404 - bad pathway errors", () => {
    return request(app)
      .get("/api/invalid-path")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Incorrect Pathway =/");
      });
  });

  describe("GET - Topics", () => {
    test("should return a status of 200 and an array of objects with slug and description", () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then(({ body: { topics } }) => {
          topics.forEach((topic) => {
            expect(topic).toEqual(
              expect.objectContaining({
                slug: expect.any(String),
                description: expect.any(String),
              })
            );
          });
        });
    });
  });
  describe("GET - Users", () => {
    test("should return a status of 200 and an array of objects containing all users", () => {
      return request(app)
        .get("/api/users")
        .expect(200)
        .then(({ body: { users } }) => {
          users.forEach((user) => {
            expect(user).toEqual(
              expect.objectContaining({
                username: expect.any(String),
              })
            );
          });
        });
    });
  });
  describe("GET - Articles", () => {
    test("should return a status of 200 and an array of objects containing all articles", () => {
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
                votes: expect.any(Number),
              })
            );
          });
        });
    });
    test("should return the articles in descending date order by default", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles).toBeSortedBy("created_at", { descending: true });
        });
    });
    test("updates the article object to include a comment count", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body: { articles } }) => {
          articles.forEach((article) => {
            expect(article).toEqual(
              expect.objectContaining({
                comment_count: expect.any(String),
              })
            );
          });
        });
    });
    test("allows the data to be sorted by any author, but the default is still date", () => {
      const sortBy = "author";
      return request(app)
        .get(`/api/articles?sort_by=${sortBy}`)
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles).toBeSortedBy(sortBy, { descending: true });
        });
    });
    test("allows the data to be sorted by title, but the default is still date", () => {
      const sortBy = "title";
      return request(app)
        .get(`/api/articles?sort_by=${sortBy}`)
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles).toBeSortedBy(sortBy, { descending: true });
        });
    });
    test("rejects an invalid sort by query", () => {
      const sortBy = "songs";
      return request(app)
        .get(`/api/articles?sort_by=${sortBy}`)
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Invalid Sort Query");
        });
    });
    test("the data can be sorted by ascending and descending with descending as the default order by method", () => {
      const orderBy = "asc";
      return request(app)
        .get(`/api/articles?order_by=${orderBy}`)
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles).toBeSortedBy("created_at", { ascending: true });
        });
    });
    test("sorting the data when both a sort by and an order by query is passed in", () => {
      const orderBy = "ASC";
      const sortBy = "title";
      return request(app)
        .get(`/api/articles?sort_by=${sortBy}&order_by=${orderBy}`)
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles).toBeSortedBy(sortBy, { ascending: true });
        });
    });
    test("rejects an invalid order by query", () => {
      const orderBy = "parallel";
      return request(app)
        .get(`/api/articles?order_by=${orderBy}`)
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Invalid Order Query");
        });
    });
    test("filters the articles by a valid topic", () => {
      const validTopic = "mitch";
      return request(app)
        .get(`/api/articles?topic=${validTopic}`)
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles).toHaveLength(11);
          articles.forEach((article) => {
            expect(article).toEqual(
              expect.objectContaining({
                topic: validTopic,
              })
            );
          });
        });
    });
    test("filters the articles by a valid topic, if a valid topic is not connected to an article then returns 0", () => {
      const validTopic = "paper";
      return request(app)
        .get(`/api/articles?topic=${validTopic}`)
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles).toHaveLength(0);
          articles.forEach((article) => {
            expect(article).toEqual(
              expect.objectContaining({
                topic: validTopic,
              })
            );
          });
        });
    });
    test("returns nothing if there is no topic with that name", () => {
      const invalidTopic = "dogs";
      return request(app)
        .get(`/api/articles?topic=${invalidTopic}`)
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles).toHaveLength(0);
        });
    });
  });
  describe("GET - Article By Id", () => {
    test("status: 200, responds with a single article", () => {
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
              votes: expect.any(Number),
            })
          );
        });
    });
    test("status: 200, responds with the number of comments for each article", () => {
      return request(app)
        .get(`/api/articles/1`)
        .expect(200)
        .then(({ body: { article } }) => {
          expect(article.comment_count).toEqual("11");
        });
    });
    test("status: 200, responds with the number of comments as 0 where an article has no comments", () => {
      return request(app)
        .get(`/api/articles/2`)
        .expect(200)
        .then(({ body: { article } }) => {
          expect(article.comment_count).toEqual("0");
        });
    });
    test("status: 400, when an invalid article id is entered", () => {
      return request(app)
        .get(`/api/articles/barry`)
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Wrong Input!");
        });
    });
    test("status: 404, when a valid type for article id is entered, however it currently does not exist", () => {
      return request(app)
        .get(`/api/articles/999999`)
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("ID Does Not Exist!");
        });
    });
  });
  describe("GET - Comments", () => {
    test("status: 200, returns an array of objects containing comments for the relevant article id", () => {
      return request(app)
        .get(`/api/articles/1/comments`)
        .expect(200)
        .then(({ body: { comments } }) => {
          expect(comments).toHaveLength(11);
        });
    });
    test("status: 200, returns an array of objects containing comments for the relevant article id", () => {
      return request(app)
        .get(`/api/articles/1/comments`)
        .expect(200)
        .then(({ body: { comments } }) => {
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
        });
    });
    test("status: 200, when an article id is entered, however there are no comments attached to that article", () => {
      return request(app)
        .get(`/api/articles/2/comments`)
        .expect(200)
        .then(({ body: { comments } }) => {
          expect(comments).toHaveLength(0);
        });
    });
  });
  describe("DELETE - Comments", () => {
    test("status: 204, deletes a selected comment_id", () => {
      return request(app).delete(`/api/articles/1/2`).expect(204);
    });
  });
});
describe("POST - Comments", () => {
  test("status:201, responds with a new comment added to an article", () => {
    const testComment = {
      username: "butter_bridge",
      body: `I can't read so the article was lost on me. Needs more pictures!`,
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(testComment)
      .expect(201)
      .then(({ body }) => {
        expect(body.comment).toEqual(
          expect.objectContaining({
            author: "butter_bridge",
            body: `I can't read so the article was lost on me. Needs more pictures!`,
          })
        );
      });
  });
  test("should return a status error of 400 if there is missing info in the body ", () => {
    const badComment = {
      username: "icellusedkars",
      body: "",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(badComment)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Missing Input!");
      });
  });
  test("should return a status error of 400 if invalid info is entered", () => {
    const anotherBadComment = {
      username: 3,
      body: "Bob Lob Law",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(anotherBadComment)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Incorrect Input!");
      });
  });
  test("should return a status error of 400 if invalid article id is entered", () => {
    const wrongArticleComment = {
      article_id: 99999,
      username: "icellusedkars",
      body: "Bob Lob Law",
    };
    return request(app)
      .post(`/api/articles/${wrongArticleComment.article_id}/comments`)
      .send(wrongArticleComment)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Incorrect Input!");
      });
  });
  test("should return a status error of 400 if invalid article id is entered", () => {
    const wrongArticleComment = {
      article_id: "Not-an-ID",
      username: "icellusedkars",
      body: "Bob Lob Law",
    };
    return request(app)
      .post(`/api/articles/${wrongArticleComment.article_id}/comments`)
      .send(wrongArticleComment)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Wrong Input!");
      });
  });
  describe("PATCH - Article Votes", () => {
    test("status: 200 updates the vote count by 1 when a new vote is added", () => {
      newVote = { inc_votes: 1 };
      return request(app)
        .patch(`/api/articles/1`)
        .send(newVote)
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles.votes).toEqual(101);
        });
    });
    test("status: 200 updates the vote count by 50 when 50 new votes is added", () => {
      newVote = { inc_votes: 50 };
      return request(app)
        .patch(`/api/articles/3`)
        .send(newVote)
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles.votes).toEqual(50);
        });
    });
    test("status: 200 updates the vote count by minus 20 when -20 new votes is added", () => {
      newVote = { inc_votes: -20 };
      return request(app)
        .patch(`/api/articles/2`)
        .send(newVote)
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles.votes).toEqual(-20);
        });
    });
    test("status: 404 rejects the updating of votes if the article does not exist", () => {
      newVote = { inc_votes: 2 };
      return request(app)
        .patch(`/api/articles/99999`)
        .send(newVote)
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Article Does Not Exist!");
        });
    });
    test("status: 400 rejects the updating of votes if the vote is not a number", () => {
      newVote = { inc_votes: "Barry" };
      return request(app)
        .patch(`/api/articles/1`)
        .send(newVote)
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Wrong Input!");
        });
    });
    test("status: 400 rejects the updating of votes if an invalid ID is entered", () => {
      newVote = { inc_votes: 2 };
      return request(app)
        .patch(`/api/articles/notvalidID`)
        .send(newVote)
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Wrong Input!");
        });
    });
    test("status: 400 rejects the updating of votes if the key is spelt wrong", () => {
      newVote = { inc_vots: 2 };
      return request(app)
        .patch(`/api/articles/2`)
        .send(newVote)
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Incorrect Key!");
        });
    });
    test("status: 400 rejects the updating of votes if there are extra keys", () => {
      newVote = { inc_votes: 5, title: "The Mitch is Back" };
      return request(app)
        .patch(`/api/articles/2`)
        .send(newVote)
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Wrong Input!");
        });
    });
    test("status: 400 rejects the updating of votes if inc_votes is not passed in", () => {
      newVote = { title: "The Mitch is Back" };
      return request(app)
        .patch(`/api/articles/2`)
        .send(newVote)
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Incorrect Key!");
        });
    });
  });
  describe("DELETE - Article", () => {
    test("status: 204, deletes a selected article by it's ID", () => {
      return request(app).delete(`/api/articles/1`).expect(204);
    });
  });
  describe("PATCH - Comment Vote", () => {
    test("status: 200 updates the vote count by 1 when a new vote is added", () => {
      newVote = { inc_votes: 1 };
      return request(app)
        .patch(`/api/articles/1/2`)
        .send(newVote)
        .expect(200)
        .then(({ body: { comment } }) => {
          expect(comment.votes).toEqual(15);
        });
    });
    test("status: 200 updates the vote count by 50 when 50 new votes is added", () => {
      newVote = { inc_votes: 50 };
      return request(app)
        .patch(`/api/articles/1/2`)
        .send(newVote)
        .expect(200)
        .then(({ body: { comment } }) => {
          expect(comment.votes).toEqual(64);
        });
    });
    test("status: 200 updates the vote count by minus 20 when -20 new votes is added", () => {
      newVote = { inc_votes: -20 };
      return request(app)
        .patch(`/api/articles/9/1`)
        .send(newVote)
        .expect(200)
        .then(({ body: { comment } }) => {
          expect(comment.votes).toEqual(-4);
        });
    });
    test("status: 404 rejects the updating of votes if the comment does not exist", () => {
      newVote = { inc_votes: 2 };
      return request(app)
        .patch(`/api/articles/1/99999`)
        .send(newVote)
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Comment Does Not Exist!");
        });
    });
    test("status: 400 rejects the updating of votes if the vote is not a number", () => {
      newVote = { inc_votes: "Barry" };
      return request(app)
        .patch(`/api/articles/1/4`)
        .send(newVote)
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Wrong Input!");
        });
    });
    test("status: 400 rejects the updating of votes if an invalid ID is entered", () => {
      newVote = { inc_votes: 2 };
      return request(app)
        .patch(`/api/articles/1/notvalidID`)
        .send(newVote)
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Wrong Input!");
        });
    });
    test("status: 400 rejects the updating of votes if the key is spelt wrong", () => {
      newVote = { inc_vots: 2 };
      return request(app)
        .patch(`/api/articles/1/5`)
        .send(newVote)
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Incorrect Key!");
        });
    });
    test("status: 400 rejects the updating of votes if there are extra keys", () => {
      newVote = { inc_votes: 5, author: "Paul & Barry Chuckle" };
      return request(app)
        .patch(`/api/articles/1/2`)
        .send(newVote)
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Wrong Input!");
        });
    });
    test("status: 400 rejects the updating of votes if inc_votes is not passed in", () => {
      newVote = { author: "Bob Lob Law" };
      return request(app)
        .patch(`/api/articles/1/2`)
        .send(newVote)
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Incorrect Key!");
        });
    });
  });
  describe("GET - Username", () => {
    test("should return a status of 200 and an array containing the user's username, name and avatar url", () => {
      return request(app)
        .get("/api/users/butter_bridge")
        .expect(200)
        .then(({ body: { user } }) => {
          const inputLength = Object.keys(user).length;
          expect(inputLength).toEqual(3);
          expect(user).toEqual(
            expect.objectContaining({
              username: expect.any(String),
              name: expect.any(String),
              avatar_url: expect.any(String),
            })
          );
        });
    });
    test("should return a status of 200 and checks the number of keys in the user is 3", () => {
      return request(app)
        .get("/api/users/rogersop")
        .expect(200)
        .then(({ body: { user } }) => {
          expect(Object.keys(user)).toHaveLength(3);
        });
    });
    test("should return a status of 200 and an array containing the user's username, name and avatar url - hardcoded test for username butter_bridge", () => {
      return request(app)
        .get("/api/users/butter_bridge")
        .expect(200)
        .then(({ body: { user } }) => {
          expect(user).toEqual(
            expect.objectContaining({
              username: "butter_bridge",
              name: "jonny",
              avatar_url:
                "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg",
            })
          );
        });
    });
    test("should return status 404 if an incorrect username is entered", () => {
      return request(app)
        .get("/api/users/butters")
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Invalid Username!");
        });
    });
  });
  describe("POST - Topics", () => {
    test("status:201, responds with a new topic added to topics", () => {
      const testTopic = {
        slug: "comics",
        description:
          "Superheroes fighting Supervillians. And there is only one winner...Chuck Norris!",
      };
      return request(app)
        .post("/api/topics")
        .send(testTopic)
        .expect(201)
        .then(({ body }) => {
          expect(body.topic).toEqual(
            expect.objectContaining({
              slug: "comics",
              description:
                "Superheroes fighting Supervillians. And there is only one winner...Chuck Norris!",
            })
          );
        });
    });
    test("should return a status error of 400 if there is missing info in the body ", () => {
      const badTopic = {
        slug: "comics",
        description: "",
      };
      return request(app)
        .post("/api/topics")
        .send(badTopic)
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Missing Input!");
        });
    });
  });
  describe("POST - Article", () => {
    test("status:201, responds with a new article added to articles", () => {
      const testArticle = {
        author: "rogersop",
        title: "The Life and Times of the Yeti",
        body: "A cautionary tale of a Yeti and yellow snowcones",
        topic: "paper",
      };
      return request(app)
        .post("/api/articles")
        .send(testArticle)
        .expect(201)
        .then(({ body }) => {
          expect(body.article).toEqual(
            expect.objectContaining({
              author: "rogersop",
              title: "The Life and Times of the Yeti",
              body: "A cautionary tale of a Yeti and yellow snowcones",
              topic: "paper",
              votes: 0,
            })
          );
        });
    });
    test("should return a status error of 400 if there is missing info in the body ", () => {
      const badArticle = {
        author: "rogersop",
        title: "",
        body: "A cautionary tale of a Yeti and yellow snowcones",
        topic: "paper",
      };
      return request(app)
        .post("/api/articles")
        .send(badArticle)
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Missing Input!");
        });
    });
    test("should return a status error of 400 if there is missing info in the body ", () => {
      const badArticle = {
        author: "rogersop",
        title: "The Life and Times of the Yeti",
        body: "",
        topic: "paper",
      };
      return request(app)
        .post("/api/articles")
        .send(badArticle)
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Missing Input!");
        });
    });
    test("should return a status error of 400 if invalid info is entered", () => {
      const anotherBadArticle = {
        author: 5,
        title: "The Life and Times of the Yeti",
        body: "A cautionary tale of a Yeti and yellow snowcones",
        topic: "paper",
      };
      return request(app)
        .post("/api/articles")
        .send(anotherBadArticle)
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Incorrect Input!");
        });
    });
    test("should return a status error of 400 if invalid info is entered", () => {
      const yetAnotherBadArticle = {
        author: "rogersop",
        title: "The Life and Times of the Yeti",
        body: "A cautionary tale of a Yeti and yellow snowcones",
        topic: 2,
      };
      return request(app)
        .post("/api/articles")
        .send(yetAnotherBadArticle)
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Incorrect Input!");
        });
    });
    test("status: 400 rejects the posting of an article if a key is spelt wrong", () => {
      newArticle = {
        athor: "rogersop",
        title: "The Life and Times of the Yeti",
        body: "A cautionary tale of a Yeti and yellow snowcones",
        topic: "paper",
      };
      return request(app)
        .post(`/api/articles`)
        .send(newArticle)
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Missing Input!");
        });
    });
    test("status: 400 rejects the posting of an article if there are extra keys", () => {
      newArticle = {
        author: "rogersop",
        title: "The Life and Times of the Yeti",
        body: "A cautionary tale of a Yeti and yellow snowcones",
        topic: "paper",
        comments: "But the yellow ones are the best!",
      };
      return request(app)
        .post(`/api/articles`)
        .send(newArticle)
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Additional Key Entered!");
        });
    });
    test("status: 400 rejects the posting of an article if the relevent keys are not passed in", () => {
      newArticle = {
        author: "rogersop",
        body: "A cautionary tale of a Yeti and yellow snowcones",
        topic: "paper",
      };
      return request(app)
        .post(`/api/articles`)
        .send(newArticle)
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Missing Keys!");
        });
    });
  });
  describe("GET - API", () => {
    test("should return a status 200 and all the valid endpoints", () => {
      return request(app)
        .get("/api")
        .expect(200)
        .then(({ body }) => {
          expect(body.endpoints).toEqual(
            expect.objectContaining({
              "GET /api": expect.any(Object),
              "GET /api/topics": expect.any(Object),
              "GET /api/articles": expect.any(Object),
              "GET /api/comments": expect.any(Object),
              "GET /api/users": expect.any(Object),
              "GET /api/articles/:article_id": expect.any(Object),
              "GET /api/articles/:article_id/comments": expect.any(Object),
              "GET /api/users/:username": expect.any(Object),
              "DELETE /api/articles/:article_id/:comment_id":
                expect.any(Object),
              "DELETE /api/articles/:article_id": expect.any(Object),
              "PATCH /api/articles/:article_id": expect.any(Object),
              "PATCH /api/articles/:article_id/:comment_id": expect.any(Object),
              "POST /api/articles/:article_id/comments": expect.any(Object),
              "POST /api/topics": expect.any(Object),
              "POST /api/articles": expect.any(Object),
            })
          );
        });
    });
  });
});
