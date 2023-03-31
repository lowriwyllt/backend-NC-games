const app = require("../api/app");
const request = require("supertest");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data/index");

beforeEach(() => seed(testData));

afterAll(() => db.end());

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

describe("/api/categories", () => {
  describe("GET", () => {
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
  describe("POST", () => {
    it("POST 201: responds with posted category", () => {
      const catgeoryObj = {
        slug: "category_name",
        description: "category_description",
      };
      return request(app)
        .post("/api/categories")
        .send(catgeoryObj)
        .expect(201)
        .then(({ body }) => {
          expect(body.category).toEqual({
            slug: "category_name",
            description: "category_description",
          });
        });
    });
    it("POST 400: category not formatted properly", () => {
      const catgeoryObj = {
        name: "category_name",
        not_description: "category_description",
      };
      return request(app)
        .post("/api/categories")
        .send(catgeoryObj)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("invalid format");
        });
    });
  });
});

describe("/api/reviews/:review_id", () => {
  describe("GET", () => {
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
    it("GET 200: respond with the review including comment_count", () => {
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
            comment_count: 3,
          });
        });
    });
  });
  describe("PATCH", () => {
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
});

describe("/api/reviews", () => {
  describe("GET", () => {
    it("GET 200: responds with an array of all the reviews, that are ordered by 'created_at' in descending order", () => {
      return request(app)
        .get("/api/reviews?limit=100") //add limit so it still passes old tests when default limit is 10
        .expect(200)
        .then(({ body }) => {
          expect(body.reviews).toBeInstanceOf(Array);
          expect(body.reviews).toHaveLength(testData.reviewData.length);
          expect(body.reviews).toBeSortedBy("created_at", {
            descending: true,
          });
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
    describe("QUERIES", () => {
      describe("category query", () => {
        it("GET 200: responds with array of reviews by category ", () => {
          const socialDeductionData = testData.reviewData.filter(
            (review) => review.category === "social deduction"
          );
          return request(app)
            .get("/api/reviews?category=social+deduction&limit=100") //add limit so it still passes old tests when default limit is 10")
            .expect(200)
            .then(({ body }) => {
              expect(body.reviews).toBeInstanceOf(Array);
              expect(body.reviews).toHaveLength(socialDeductionData.length);
              expect(body.reviews).toBeSortedBy("created_at", {
                descending: true,
              });
              body.reviews.forEach((review) => {
                expect(review).toMatchObject({
                  owner: expect.any(String),
                  title: expect.any(String),
                  review_id: expect.any(Number),
                  category: "social deduction",
                  review_img_url: expect.any(String),
                  created_at: expect.any(String),
                  votes: expect.any(Number),
                  designer: expect.any(String),
                  comment_count: expect.any(Number),
                });
              });
            });
        });
        it("GET 404: if category does not exist", () => {
          return request(app)
            .get("/api/reviews?category=not+a+category")
            .expect(404)
            .then(({ body }) => {
              expect(body.msg).toBe("slug does not exist");
            });
        });
        it("GET 200: responds with empty array if no reviews in that category yet", () => {
          return request(app)
            .get("/api/reviews?category=children's+games")
            .expect(200)
            .then(({ body }) => {
              expect(body.reviews).toEqual([]);
            });
        });
      });
      describe("sort_by query", () => {
        it("GET 200: responds with array of reviews ordered by valid column", () => {
          return request(app)
            .get("/api/reviews?sort_by=owner&limit=100") //add limit so it still passes old tests when default limit is 10
            .expect(200)
            .then(({ body }) => {
              expect(body.reviews).toBeInstanceOf(Array);
              expect(body.reviews).toHaveLength(testData.reviewData.length);
              expect(body.reviews).toBeSortedBy("owner", { descending: true });
              body.reviews.forEach((review) => {
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
        it("GET 400: if not a valid column", () => {
          return request(app)
            .get("/api/reviews?sort_by=not_a_column")
            .expect(400)
            .then(({ body }) => {
              expect(body.msg).toBe("invalid sort_by query");
            });
        });
      });
      describe("order query", () => {
        it("GET 200: responds with array of reviews ordered ascending", () => {
          return request(app)
            .get("/api/reviews?order=asc&limit=100") //add limit so it still passes old tests when default limit is 10
            .expect(200)
            .then(({ body }) => {
              expect(body.reviews).toBeInstanceOf(Array);
              expect(body.reviews).toHaveLength(testData.reviewData.length);
              expect(body.reviews).toBeSortedBy("created_at", {
                descending: false,
              });
              body.reviews.forEach((review) => {
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
        it("GET 200: responds with array of reviews ordered descending", () => {
          return request(app)
            .get("/api/reviews?order=desc&limit=100") //add limit so it still passes old tests when default limit is 10
            .expect(200)
            .then(({ body }) => {
              expect(body.reviews).toBeInstanceOf(Array);
              expect(body.reviews).toHaveLength(testData.reviewData.length);
              expect(body.reviews).toBeSortedBy("created_at", {
                descending: true,
              });
              body.reviews.forEach((review) => {
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
        it("GET 400: if not a valid query", () => {
          return request(app)
            .get("/api/reviews?order=not_valid")
            .expect(400)
            .then(({ body }) => {
              expect(body.msg).toBe("invalid order query");
            });
        });
      });
      describe("Multiple queries", () => {
        it("GET 200: responds when multiple queries called", () => {
          const socialDeductionData = testData.reviewData.filter(
            (review) => review.category === "social deduction"
          );
          return request(app)
            .get(
              "/api/reviews?category=social+deduction&sort_by=owner&order=asc&limit=100"
            ) //add limit so it still passes old tests when default limit is 10
            .expect(200)
            .then(({ body }) => {
              expect(body.reviews).toBeInstanceOf(Array);
              expect(body.reviews).toHaveLength(socialDeductionData.length);
              expect(body.reviews).toBeSortedBy("owner", {
                descending: false,
              });
              body.reviews.forEach((review) => {
                expect(review).toMatchObject({
                  owner: expect.any(String),
                  title: expect.any(String),
                  review_id: expect.any(Number),
                  category: "social deduction",
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
      describe("Refactoring for pagination", () => {
        it("GET 200: limit query only gives limit amount of response in array", () => {
          return request(app)
            .get("/api/reviews?limit=5")
            .expect(200)
            .then(({ body }) => {
              expect(body.reviews).toBeInstanceOf(Array);
              expect(body.reviews).toHaveLength(5);
              expect(body.reviews).toBeSortedBy("created_at", {
                descending: true,
              });
              expect(body.reviews[0]).toEqual({
                owner: "mallionaire",
                title: "Mollit elit qui incididunt veniam occaecat cupidatat",
                review_id: 7,
                category: "social deduction",
                review_img_url:
                  "https://images.pexels.com/photos/776657/pexels-photo-776657.jpeg?w=700&h=700",
                created_at: "2021-01-25T11:16:54.963Z",
                votes: 9,
                designer: "Avery Wunzboogerz",
                comment_count: 0,
              });

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
        it("GET 200: p for the page to to start on ", () => {
          return request(app)
            .get("/api/reviews?p=2")
            .expect(200)
            .then(({ body }) => {
              expect(body.reviews).toBeInstanceOf(Array);
              expect(body.reviews).toHaveLength(3);
              expect(body.reviews).toBeSortedBy("created_at", {
                descending: true,
              });
              expect(body.reviews[0]).toEqual({
                owner: "mallionaire",
                title: "Proident tempor et.",
                review_id: 5,
                category: "social deduction",
                review_img_url:
                  "https://images.pexels.com/photos/209728/pexels-photo-209728.jpeg?w=700&h=700",
                created_at: "2021-01-07T09:06:08.077Z",
                votes: 5,
                designer: "Seymour Buttz",
                comment_count: 0,
              });
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
        it("GET 200: refactoring to also give back a total_count with all total number of reveiws", () => {
          return request(app)
            .get("/api/reviews")
            .expect(200)
            .then(({ body }) => {
              expect(body.reviews).toBeInstanceOf(Array);
              expect(body.reviews).toHaveLength(10);
              expect(body.total_count).toBe(testData.reviewData.length);
              expect(body.reviews).toBeSortedBy("created_at", {
                descending: true,
              });
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
        it("GET 200: refactoring to also give back a total_count with all total number of reveiws of a category", () => {
          const socialDeductionData = testData.reviewData.filter(
            (review) => review.category === "social deduction"
          );
          return request(app)
            .get("/api/reviews?category=social+deduction") //add limit so it still passes old tests when default limit is 10")
            .expect(200)
            .then(({ body }) => {
              expect(body.reviews).toBeInstanceOf(Array);
              expect(body.total_count).toBe(socialDeductionData.length);
              expect(body.reviews).toHaveLength(10);
              expect(body.reviews).toBeSortedBy("created_at", {
                descending: true,
              });
              body.reviews.forEach((review) => {
                expect(review).toMatchObject({
                  owner: expect.any(String),
                  title: expect.any(String),
                  review_id: expect.any(Number),
                  category: "social deduction",
                  review_img_url: expect.any(String),
                  created_at: expect.any(String),
                  votes: expect.any(Number),
                  designer: expect.any(String),
                  comment_count: expect.any(Number),
                });
              });
            });
        });
        it("GET 400: limit is NaN", () => {
          return request(app)
            .get("/api/reviews?limit=not_a_num")
            .expect(400)
            .then(({ body }) => {
              expect(body.msg).toBe("invalid limit query");
            });
        });
        it("GET 400: negative number or zero for limit", () => {
          return request(app)
            .get("/api/reviews?limit=-2")
            .expect(400)
            .then(({ body }) => {
              expect(body.msg).toBe("invalid limit query");
            });
        });
        it("GET 400: p is NaN", () => {
          return request(app)
            .get("/api/reviews?p=not_a_num")
            .expect(400)
            .then(({ body }) => {
              expect(body.msg).toBe("invalid p (page) query");
            });
        });
        it("GET 404: if p greater than the amount of pages", () => {
          return request(app)
            .get("/api/reviews?p=3")
            .expect(404)
            .then(({ body }) => {
              expect(body.msg).toBe("p (page) not found");
            });
        });
        it("GET 404: negative number or zero for p", () => {
          return request(app)
            .get("/api/reviews?p=-1")
            .expect(400)
            .then(({ body }) => {
              expect(body.msg).toBe("invalid p (page) query");
            });
        });
      });
    });
  });
  describe("POST", () => {
    it("POST 201: responds with posted review ", () => {
      const reviewsObj = {
        owner: "mallionaire",
        title: "title of review",
        review_body: "review body",
        designer: "designer",
        category: "social deduction",
        review_img_url: "www.review_image_url.co.uk",
      };

      return request(app)
        .post("/api/reviews/")
        .send(reviewsObj)
        .expect(201)
        .then(({ body }) => {
          expect(body.review).toMatchObject({
            owner: "mallionaire",
            title: "title of review",
            review_body: "review body",
            designer: "designer",
            category: "social deduction",
            review_img_url: "www.review_image_url.co.uk",
            review_id: expect.any(Number),
            votes: 0,
            created_at: expect.any(String),
            comment_count: 0,
          });
        });
    });
    it("POST 404: owner's username does not exists", () => {
      const reviewsObj = {
        owner: "not_a_username",
        title: "title of review",
        review_body: "review body",
        designer: "designer",
        category: "social deduction",
        review_img_url: "www.review_image_url.co.uk",
      };

      return request(app)
        .post("/api/reviews/")
        .send(reviewsObj)
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("request includes data that cannot be found");
        });
    });
    it("POST 404: category does not exists", () => {
      const reviewsObj = {
        owner: "mallionaire",
        title: "title of review",
        review_body: "review body",
        designer: "designer",
        category: "not_a_category",
        review_img_url: "www.review_image_url.co.uk",
      };

      return request(app)
        .post("/api/reviews/")
        .send(reviewsObj)
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("request includes data that cannot be found");
        });
    });
    it("POST 400: review object not formatted properly", () => {
      const reviewsObj = {
        username: "mallionaire",
        MYtitle: "title of review",
        review_body: "review body",
        designer: "designer",
        cat: "social deduction",
        review_img_url: "www.review_image_url.co.uk",
      };

      return request(app)
        .post("/api/reviews/")
        .send(reviewsObj)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("invalid format");
        });
    });
  });
});

describe("/api/reviews/:review_id/comments", () => {
  describe("GET", () => {
    it("GET 200: respond with array of comments for the inputted review_id ", () => {
      return request(app)
        .get("/api/reviews/3/comments")
        .expect(200)
        .then(({ body }) => {
          expect(body.comments).toBeInstanceOf(Array);
          expect(body.comments).toBeSortedBy("created_at", {
            descending: true,
          });
          expect(body.comments).toHaveLength(3);
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
    describe("Refactoring for pagination", () => {
      it("GET 200: limit query only gives limit amount of response in array ", () => {
        return request(app)
          .get("/api/reviews/3/comments?limit=2")
          .expect(200)
          .then(({ body }) => {
            expect(body.comments).toBeInstanceOf(Array);
            expect(body.comments).toBeSortedBy("created_at", {
              descending: true,
            });
            expect(body.comments[0]).toEqual({
              comment_id: 6,
              body: "Not sure about dogs, but my cat likes to get involved with board games, the boxes are their particular favourite",
              review_id: 3,
              author: "philippaclaire9",
              votes: 10,
              created_at: "2021-03-27T19:49:48.110Z",
            });
            expect(body.comments).toHaveLength(2);
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
      it("GET 200: p for the page to to start on", () => {
        return request(app)
          .get("/api/reviews/3/comments?limit=2&p=2")
          .expect(200)
          .then(({ body }) => {
            expect(body.comments).toBeInstanceOf(Array);
            expect(body.comments).toBeSortedBy("created_at", {
              descending: true,
            });
            expect(body.comments[0]).toEqual({
              comment_id: 2,
              body: "My dog loved this game too!",
              review_id: 3,
              author: "mallionaire",
              votes: 13,
              created_at: "2021-01-18T10:09:05.410Z",
            });
            expect(body.comments).toHaveLength(1);
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
      it("GET 400: limit is NaN", () => {
        return request(app)
          .get("/api/reviews/3/comments?limit=not_a_num")
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("invalid limit query");
          });
      });
      it("GET 400: negative number or zero for limit", () => {
        return request(app)
          .get("/api/reviews/3/comments?limit=-1")
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("invalid limit query");
          });
      });
      it("GET 400: p is NaN", () => {
        return request(app)
          .get("/api/reviews/3/comments?p=not_a_num")
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("invalid p (page) query");
          });
      });
      it("GET 404: negative number or zero for limit ", () => {
        return request(app)
          .get("/api/reviews/3/comments?p=-1")
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("invalid p (page) query");
          });
      });
    });
  });
  describe("POST", () => {
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
});

describe("/api/comments/:comment_id", () => {
  describe("DELETE", () => {
    it("DELETE 204: responds no content", () => {
      return request(app).delete("/api/comments/1").expect(204);
    });
    it("DELETE 400: invalid comment_id", () => {
      return request(app)
        .delete("/api/comments/not_a_num")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("request includes invalid value");
        });
    });
    it("DELETE 404: comment_id not found", () => {
      return request(app)
        .delete("/api/comments/0")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("comment_id does not exist");
        });
    });
  });
  describe("PATCH", () => {
    it("PATCH 200: respond with the updated comment - incrementing", () => {
      return request(app)
        .patch("/api/comments/3")
        .send({ inc_votes: 1 })
        .expect(200)
        .then(({ body }) => {
          expect(body.comment).toMatchObject({
            body: "I didn't know dogs could play games",
            votes: 11,
            author: "philippaclaire9",
            review_id: 3,
            created_at: expect.any(String),
          });
        });
    });
    it("PATCH 200: respond with the updated comment - decrementing", () => {
      return request(app)
        .patch("/api/comments/3")
        .send({ inc_votes: -1 })
        .expect(200)
        .then(({ body }) => {
          expect(body.comment).toMatchObject({
            body: "I didn't know dogs could play games",
            votes: 9,
            author: "philippaclaire9",
            review_id: 3,
            created_at: expect.any(String),
          });
        });
    });
    it("PATCH 400: if no inc_votes on request body responds with error ", () => {
      return request(app)
        .patch("/api/comments/3")
        .send({ votessss: -1 })
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Invalid format: has invalid properties");
        });
    });
    it("PATCH 400: if inc_votes is NaN", () => {
      return request(app)
        .patch("/api/comments/3")
        .send({ inc_votes: "not_a_num" })
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("request includes invalid value");
        });
    });
    it("PATCH 400: has another property on request body", () => {
      return request(app)
        .patch("/api/comments/3")
        .send({ inc_votes: 1, username: "name" })
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Invalid format: has invalid properties");
        });
    });
    it("PATCH 404: comment_id does not exists", () => {
      return request(app)
        .patch("/api/comments/0")
        .send({ inc_votes: 1 })
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("comment_id does not exist");
        });
    });
    it("PATCH 400: comment_id is an invalid value", () => {
      return request(app)
        .patch("/api/comments/not_a_num")
        .send({ inc_votes: 1 })
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("request includes invalid value");
        });
    });
  });
});

describe("/api/users", () => {
  describe("GET", () => {
    it("GET 200: repond with array of users objecrs", () => {
      return request(app)
        .get("/api/users")
        .expect(200)
        .then(({ body }) => {
          expect(body.users).toBeInstanceOf(Array);
          expect(body.users).toHaveLength(testData.userData.length);
          body.users.forEach((user) => {
            expect(user).toMatchObject({
              username: expect.any(String),
              name: expect.any(String),
              avatar_url: expect.any(String),
            });
          });
        });
    });
  });
});

describe("/api", () => {
  describe("GET", () => {
    it("GET 200: respond with JSON data for all the endpoints ", () => {
      return request(app)
        .get("/api")
        .expect(200)
        .then(({ body }) => {
          expect(body.endpoints).toHaveProperty("GET /api");
          expect(body.endpoints).toHaveProperty("GET /api/categories");
          expect(body.endpoints).toHaveProperty("GET /api/reviews");
          expect(body.endpoints).toHaveProperty("GET /api/reviews/:review_id");
          expect(body.endpoints).toHaveProperty(
            "PATCH /api/reviews/:review_id"
          );
          expect(body.endpoints).toHaveProperty(
            "GET /api/reviews/:review_id/comments"
          );
          expect(body.endpoints).toHaveProperty(
            "POST /api/reviews/:review_id/comments"
          );
          expect(body.endpoints).toHaveProperty(
            "DELETE /api/comments/:comment_id"
          );
          expect(body.endpoints).toHaveProperty("GET /api/users");
        });
    });
  });
});

describe("/api/users/:username", () => {
  describe("GET", () => {
    it("GET 200: responds with a single user object", () => {
      return request(app)
        .get("/api/users/bainesface")
        .expect(200)
        .then(({ body }) => {
          expect(body.user).toEqual({
            username: "bainesface",
            name: "sarah",
            avatar_url:
              "https://avatars2.githubusercontent.com/u/24394918?s=400&v=4",
          });
        });
    });
    it("GET 404: username does not exst", () => {
      return request(app)
        .get("/api/users/not_a_username")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("username does not exist");
        });
    });
  });
});
