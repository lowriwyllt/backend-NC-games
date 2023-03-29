exports.errorPSQL400s = (err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "Invalid review_id" });
  } else if (err.code === "23503") {
    res.status(404).send({ msg: `input doesn't exist : ${err.detail}` });
  } else if (err.code === "23502") {
    res.status(400).send({ msg: "invalid format" });
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
