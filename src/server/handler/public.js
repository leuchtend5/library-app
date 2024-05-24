const fs = require("fs");

const searchHandler = (req, res) => {
  const { query } = req.query;

  fs.readFile("src/server/data.json", "utf8", (err, data) => {
    if (err) {
      console.log(err);
      return;
    }
    const books = JSON.parse(data);

    const filteredBooks = books.books.filter((book) =>
      book.title.toLowerCase().includes(query.toLowerCase())
    );

    res.json({
      books: filteredBooks,
    });
  });
};

const getBookHandler = (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 8;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  fs.readFile("src/server/data.json", "utf8", (err, data) => {
    if (err) {
      console.log(err);
      return;
    }
    const books = JSON.parse(data);
    const paginated = books.books.slice(startIndex, endIndex);

    res.json({
      page,
      limit,
      books: paginated,
      totalBooks: books.books.length,
    });
  });
};

module.exports = {
  getBookHandler,
  searchHandler,
};
