const endpoints = require("../endpoints.json");

exports.fetchEndpoints = () => {
  if (endpoints) {
    const endpoint = JSON.stringify(endpoints);
    return Promise.resolve(endpoint);
  } else {
    return Promise.reject({ status: 404, msg: "Not found" });
  }
};
