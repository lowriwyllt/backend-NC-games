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
  it("GET 400: responds with message 'invalid review_id'", () => {
    return request(app)
      .get("/api/reviews/not_a_num")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid review_id");
      });
  });
  it("GET 400: responds with message 'Review_id does not exist'", () => {
    return request(app)
      .get("/api/reviews/0")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Review_id does not exist");
      });
  });
});
