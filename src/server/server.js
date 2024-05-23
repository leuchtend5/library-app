const express = require("express");
const cors = require("cors");
const routes = require("./routes");
const path = require("path");

const app = express();
const port = 3000;

app.use(express.json());

// serving images file
app.use(express.static("./src"));

app.use(
  cors({
    origin: "http://localhost:4200",
    methods: "GET,PUT,POST,DELETE",
    optionsSuccessStatus: 204,
  })
);

app.use("/", routes);

app.listen(port, () => {
  console.log(`server running at http://localhost:${port}`);
});
