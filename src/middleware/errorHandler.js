// PUBLIC_INTERFACE
function errorHandler(err, _req, res, _next) {
  /** Express error-handling middleware returning a consistent JSON error response. */
  const status = Number.isInteger(err?.status) ? err.status : 500;
  const code = err?.code || (status === 500 ? "INTERNAL_ERROR" : "BAD_REQUEST");
  const message = err?.message || "An unexpected error occurred.";

  // eslint-disable-next-line no-console
  console.error(err);

  res.status(status).json({
    error: {
      code,
      message,
    },
  });
}

module.exports = { errorHandler };
