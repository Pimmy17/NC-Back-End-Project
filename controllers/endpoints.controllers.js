const { fetchEndpoints } = require("../models/endpoints.models");

exports.getEndpoints = (req, res, next) => {
  fetchEndpoints()
    .then((response) => {
      const endpoints = JSON.parse(response);
      res.status(200).send({ endpoints });
    })
    .catch((err) => {
      next(err);
    });
};
