const app = require("../api/app");
const request = require("supertest");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data/index");

beforeEach(() => seed(testData));

afterAll(() => db.end());

describe("/api/categories", () => {
  it("GET 200: respond with array of category objects ", () => {
    return request(app)
      .get("/api/categories")
      .expect(200)
      .then(({ body }) => {
        expect(body.categories).toBeInstanceOf(Array);
        expect(body.categories).toHaveLength(testData.categoryData.length);
        body.categories.forEach((category) => {
          expect(category).toBeInstanceOf(Object);
          expect(category).toMatchObject({
            slug: expect.any(String),
            description: expect.any(String),
          });
        });
      });
  });
});

describe("Handles invalid paths", () => {
  it("GET 404: responds with an error message that the path doesn't exist, when given wrong path", () => {
    return request(app)
      .get("/api/not/a/path")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Path does not exist");
      });
  });
  it("GET 404: responds with an error message that the path doesn't exist, when given invalid method", () => {
    return request(app)
      .patch("/api/categories")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Path does not exist");
      });
  });
});

describe("/api/reviews/:review_id", () => {
  it("GET 200: responds with the review with review_id", () => {
    return request(app)
      .get("/api/reviews/2")
      .expect(200)
      .then(({ body }) => {
        expect(body.review).toMatchObject({
          review_id: 2,
          title: "Jenga",
          designer: "Leslie Scott",
          owner: "philippaclaire9",
          review_img_url:
            "https://images.pexels.com/photos/4473494/pexels-photo-4473494.jpeg?w=700&h=700",
          review_body: "Fiddly fun for all the family",
          category: "dexterity",
          created_at: expect.any(String), //can't check for the exact date
          votes: 5,
        });
      });
  });
  it("GET 400: responds with message 'request includes invalid value'", () => {
    return request(app)
      .get("/api/reviews/not_a_num")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("request includes invalid value");
      });
  });
  it("GET 404: responds with message 'review_id does not exist'", () => {
    return request(app)
      .get("/api/reviews/0")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("review_id does not exist");
      });
  });
  it("PATCH 200: responds with updated review if incrementing by 1", () => {
    return request(app)
      .patch("/api/reviews/1")
      .send({ inc_votes: 1 })
      .expect(200)
      .then(({ body }) => {
        expect(body.review).toMatchObject({
          title: "Agricola",
          designer: "Uwe Rosenberg",
          owner: "mallionaire",
          review_img_url:
            "https://images.pexels.com/photos/974314/pexels-photo-974314.jpeg?w=700&h=700",
          review_body: "Farmyard fun!",
          category: "euro game",
          created_at: expect.any(String),
          votes: 2,
        });
      });
  });
  it("PATCH 200: responds with updated review if decrementing by 1", () => {
    return request(app)
      .patch("/api/reviews/1")
      .send({ inc_votes: -1 })
      .expect(200)
      .then(({ body }) => {
        expect(body.review).toMatchObject({
          title: "Agricola",
          designer: "Uwe Rosenberg",
          owner: "mallionaire",
          review_img_url:
            "https://images.pexels.com/photos/974314/pexels-photo-974314.jpeg?w=700&h=700",
          review_body: "Farmyard fun!",
          category: "euro game",
          created_at: expect.any(String),
          votes: 0,
        });
      });
  });
  it("PATCH 400: if no inc_votes on request body responds with error ", () => {
    return request(app)
      .patch("/api/reviews/1")
      .send({ votessss: -1 })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid format: has invalid properties");
      });
  });
  it("PATCH 400: if inc_votes NaN", () => {
    return request(app)
      .patch("/api/reviews/1")
      .send({ inc_votes: "not_a_num" })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("request includes invalid value");
      });
  });
  it("PATCH 400: has another property on request body", () => {
    return request(app)
      .patch("/api/reviews/1")
      .send({ inc_votes: 1, my_name: "name" })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid format: has invalid properties");
      });
  });
  it("PATCH 404: responds with message 'review_id does not exist'", () => {
    return request(app)
      .patch("/api/reviews/0")
      .send({ inc_votes: 1 })
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("review_id does not exist");
      });
  });
  it("PATCH 400: responds with message 'request includes invalid value'", () => {
    return request(app)
      .patch("/api/reviews/not_a_num")
      .send({ inc_votes: 1 })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("request includes invalid value");
      });
  });
});

describe("/api/reviews", () => {
  it("GET 200: responds with an array of all the reviews, that are ordered by 'created_at' in descending order", () => {
    return request(app)
      .get("/api/reviews")
      .expect(200)
      .then(({ body }) => {
        expect(body.reviews).toBeInstanceOf(Array);
        expect(body.reviews).toHaveLength(testData.reviewData.length);
        expect(body.reviews).toBeSortedBy("created_at", { descending: true });
        body.reviews.forEach((review) => {
          expect(review).toBeInstanceOf(Object);
          expect(review).toMatchObject({
            owner: expect.any(String),
            title: expect.any(String),
            review_id: expect.any(Number),
            category: expect.any(String),
            review_img_url: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            designer: expect.any(String),
            comment_count: expect.any(Number),
          });
        });
      });
  });
});

describe("/api/reviews/:review_id/comments", () => {
  it("GET 200: respond with array of comments for the inputted review_id ", () => {
    return request(app)
      .get("/api/reviews/3/comments")
      .expect(200)
      .then(({ body }) => {
        expect(body.comments).toBeInstanceOf(Array);
        expect(body.comments).toBeSortedBy("created_at", { descending: true });
        expect(body.comments.length > 0).toBe(true);
        body.comments.forEach((comment) => {
          expect(comment).toMatchObject({
            comment_id: expect.any(Number),
            votes: expect.any(Number),
            created_at: expect.any(String),
            author: expect.any(String),
            body: expect.any(String),
            review_id: expect.any(Number),
          });
        });
      });
  });
  it("GET 200: respond with empty array if no comments for the review", () => {
    return request(app)
      .get("/api/reviews/1/comments")
      .expect(200)
      .then(({ body }) => {
        expect(body.comments).toBeInstanceOf(Array);
        expect(body.comments.length).toBe(0);
      });
  });
  it("GET 400: responds with message 'request includes invalid value'", () => {
    return request(app)
      .get("/api/reviews/not_a_num/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("request includes invalid value");
      });
  });
  it("GET 404: responds with message 'review_id does not exists'", () => {
    return request(app)
      .get("/api/reviews/0/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("review_id does not exist");
      });
  });
  it("POST 201: responds with posted comment", () => {
    const commentObj = {
      username: "dav3rid",
      body: "hi this is a new comment",
    };

    return request(app)
      .post("/api/reviews/1/comments")
      .send(commentObj)
      .expect(201)
      .then(({ body }) => {
        expect(body.comment).toMatchObject({
          comment_id: expect.any(Number),
          votes: 0,
          created_at: expect.any(String),
          author: "dav3rid",
          body: "hi this is a new comment",
          review_id: 1,
        });
      });
  });
  it("POST 404: error if review_id doesn't exist", () => {
    const commentObj = {
      username: "dav3rid",
      body: "hi this is a new comment",
    };

    return request(app)
      .post("/api/reviews/100/comments")
      .send(commentObj)
      .expect(404)
      .then(({ body }) => {
        expect(body).toMatchObject({
          msg: "request includes data that cannot be found",
        });
      });
  });
  it("POST 400: invalid review_id error", () => {
    const commentObj = {
      username: "dav3rid",
      body: "hi this is a new comment",
    };

    return request(app)
      .post("/api/reviews/not_a_num/comments")
      .send(commentObj)
      .expect(400)
      .then(({ body }) => {
        expect(body).toMatchObject({
          msg: "request includes invalid value",
        });
      });
  });
  it("POST 404: error if username doesn't exist", () => {
    const commentObj = {
      username: "notAValidUser",
      body: "hi this is a new comment",
    };

    return request(app)
      .post("/api/reviews/1/comments")
      .send(commentObj)
      .expect(404)
      .then(({ body }) => {
        expect(body).toMatchObject({
          msg: "request includes data that cannot be found",
        });
      });
  });
  it("POST 400: invalid format for a comment", () => {
    const commentObj = {
      name: "dav3rid",
      comment: "hi this is a new comment",
    };

    return request(app)
      .post("/api/reviews/1/comments")
      .send(commentObj)
      .expect(400)
      .then(({ body }) => {
        expect(body).toMatchObject({
          msg: "invalid format",
        });
      });
  });
});

describe.only("/api/comments/:comment_id", () => {
  it("DELETE 204: responds no content", () => {
    return request(app)
      .delete("/api/comments/1")
      .expect(204)
      .then(({ body }) => {
        expect(body).toEqual({});
      });
  });
  it("DELETE 400: invalid comment_id", () => {
    return request(app)
      .delete("/api/comments/not_a_num")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("request includes invalid value");
      });
  });
  it("DELETE 204: comment_id not found, but no error", () => {
    return request(app)
      .delete("/api/comments/0")
      .expect(204)
      .then(({ body }) => {
        expect(body).toEqual({});
      });
  });
});
