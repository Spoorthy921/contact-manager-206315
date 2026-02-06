// PUBLIC_INTERFACE
function notFoundHandler(req, res, _next) {
  /** Handle unmatched routes with a consistent JSON error. */
  res.status(404).json({
    error: {
      code: "NOT_FOUND",
      message: `Route not found: ${req.method} ${req.originalUrl}`,
    },
  });
}

module.exports = { notFoundHandler };
