// PUBLIC_INTERFACE
function requestLogger(req, res, next) {
  /** Log basic request/response timing info to stdout. */
  const start = process.hrtime.bigint();

  res.on("finish", () => {
    const end = process.hrtime.bigint();
    const durationMs = Number(end - start) / 1_000_000;

    // eslint-disable-next-line no-console
    console.log(
      `${req.method} ${req.originalUrl} -> ${res.statusCode} (${durationMs.toFixed(1)}ms)`,
    );
  });

  next();
}

module.exports = { requestLogger };
