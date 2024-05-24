const express = require("express");
const router = express.Router();
const { getBookHandler, searchHandler } = require("./handler/public");
const { addUserHandler } = require("./handler/user");
const { loginHandler, verifyToken } = require("./handler/auth");
const {
  getLibrary,
  postLibrary,
  addBookToLibrary,
  deleteBookFromLibrary,
  putBookStatus,
} = require("./handler/library");

router.post("/signup", addUserHandler);
router.post("/auth", loginHandler);
router.get("/api/books", getBookHandler);
router.get("/search", searchHandler);
router.get("/library", verifyToken, getLibrary);
router.post("/library", verifyToken, postLibrary);
router.post("/library/books", verifyToken, addBookToLibrary);
router.delete("/library/books", verifyToken, deleteBookFromLibrary);
router.put("/library/books", verifyToken, putBookStatus);

module.exports = router;
