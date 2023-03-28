const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data/index");
const { checkColumnExists } = require("../api/app-utils");

beforeEach(() => seed(testData));

afterAll(() => db.end());

describe("checkColumnExists", () => {
  it("return an object { status: 404, msg: `${column} does not exist` } if doesn't exist", () => {
    return checkColumnExists("reviews", "review_id", "900000").then(
      (response) => {
        console.log(response);
        expect(response).toEqual({
          status: 404,
          msg: `review_id does not exist`,
        });
      }
    );
  });
  it("return nothing, i.e. undefined if does exist", () => {
    return checkColumnExists("reviews", "review_id", 3).then((response) => {
      expect(response).toEqual(undefined);
    });
  });
});
