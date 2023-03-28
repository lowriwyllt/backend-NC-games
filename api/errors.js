exports.errorPSQL400s = (err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "Invalid review_id" });
  } else {
    next(err);
  }
};

exports.errorCustomised = (err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
};

exports.error500 = (err, req, res, next) => {
  res.status(500).send({ msg: "Sorry, server error" });
};
