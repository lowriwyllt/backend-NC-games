exports.errorPSQL400s = (err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "request includes invalid value" });
  } else if (err.code === "23503") {
    res.status(404).send({ msg: "request includes data that cannot be found" });
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
  console.log("UNHANDLED: ", err);
  res.status(500).send({ msg: "Sorry, server error" });
};
