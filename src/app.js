const express = require("express");
const cors = require("cors");

const { requestLogger } = require("./middleware/requestLogger");
const { notFoundHandler } = require("./middleware/notFoundHandler");
const { errorHandler } = require("./middleware/errorHandler");
const contactsRouter = require("./routes/contacts");

// PUBLIC_INTERFACE
function createApp() {
  /** Create and configure the Express application instance. */
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json({ limit: "1mb" }));
  app.use(requestLogger);

  // Routes
  app.get("/health", (_req, res) => {
    res.json({ ok: true, status: "healthy" });
  });

  app.use("/api/contacts", contactsRouter);

  // 404 and error handling
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}

module.exports = { createApp };
