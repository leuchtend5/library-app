const express = require("express");
const fs = require("fs");

const app = express();
const port = 3000;

app.listen(port, () => {
  console.log(`server running at http://localhost:${port}`);
});
