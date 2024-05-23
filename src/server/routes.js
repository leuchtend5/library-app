const express = require("express");
const router = express.Router();
const {
  addUserHandler,
  loginHandler,
  getBookHandler,
  searchHandler,
  verifyToken,
} = require("./handler");

router.post("/signup", addUserHandler);
router.post("/auth", loginHandler);
router.get("/api/books", getBookHandler);
router.get("/search", searchHandler);

module.exports = router;
