const { createServer } = require("node:http");
const { createApp } = require("./app");

// Prefer PORT from environment, but default to 3001 for preview compatibility.
const PORT = Number.parseInt(process.env.PORT || "3001", 10);

const app = createApp();
const server = createServer(app);

server.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Contact Manager API listening on http://localhost:${PORT}`);
});
