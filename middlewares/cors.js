module.exports = (req, res, next) => {
  const { method } = req;
  const requestHeaders = req.headers["access-control-request-headers"];
  const DEFAULT_ALLOWED_METHODS = "GET,HEAD,PUT,PATCH,POST,DELETE";

  // Set the Access-Control-Allow-Origin header to allow all origins
  res.header("Access-Control-Allow-Origin", "*");

  if (method === "OPTIONS") {
    // Allow all types of cross-origin requests (by default)
    res.header("Access-Control-Allow-Methods", DEFAULT_ALLOWED_METHODS);
    // Allow cross-origin requests with these headers
    res.header("Access-Control-Allow-Headers", requestHeaders);
    // End the request processing and return the result to the client
    return res.end();
  }

  return next();
};
