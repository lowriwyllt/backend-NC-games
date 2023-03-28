const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data/index");
const { checkColumnExists } = require("../api/app-utils");

beforeEach(() => seed(testData));

afterAll(() => db.end());

describe("checkColumnExists", () => {
  it("return nothing, i.e. undefined if does exist", () => {
    return checkColumnExists("reviews", "review_id", 3).then((response) => {
      expect(response).toEqual(undefined);
    });
  });
});
