const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const authenticaitonRoutes = require("./routes/authentication.js");
const raveRoutes = require("./routes/raven.js");
require('dotenv').config();

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.get("/", (req, res) => {
  res.json({ message: "ok" });
});

app.use("/auth", authenticaitonRoutes);
app.use("/raven", raveRoutes);

/* Error handler middleware */
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  console.error(err.message, err.stack);
  res.status(statusCode).json({ message: err.message });
  return;
});

app.listen(port, () => {
  console.log(`RavenBank App listening at http://localhost:${port}`);
});