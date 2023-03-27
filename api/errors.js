exports.psqlErrors = (errCode, res) => {
  if (errCode === "22P02") {
    res.status(400).send({ msg: "Invalid review_id" });
  }
};
