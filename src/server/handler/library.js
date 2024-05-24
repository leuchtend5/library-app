const fs = require("fs");

const getLibrary = (req, res) => {
  const userId = req.headers["user-id"];

  fs.readFile("src/server/library.json", "utf8", (err, data) => {
    if (err) {
      console.log(err);
      return;
    }
    const libraries = JSON.parse(data).libraries;
    const checkLibrary = libraries.some((library) => library.userId === userId);
    const getLibrary = libraries.filter((library) => library.userId === userId);

    if (!checkLibrary) {
      return res.status(404).json({ message: "you don't have a library" });
    }

    res.json(getLibrary[0].book);
  });
};

const postLibrary = (req, res) => {
  const { userId } = req.body;

  fs.readFile("src/server/library.json", "utf8", (err, data) => {
    if (err) {
      console.log(err);
      return;
    }

    const libraries = JSON.parse(data).libraries;
    const checkLibrary = libraries.some((library) => library.userId === userId);

    if (checkLibrary) {
      return res.status(400).json({ message: "You already have a library" });
    }

    const newLibrary = {
      userId: userId,
      book: [],
    };
    libraries.push(newLibrary);

    const newData = {
      libraries: libraries,
    };

    fs.writeFile("src/server/library.json", JSON.stringify(newData), (err) => {
      if (err) {
        console.log(err);
        return;
      }

      res.status(201).json(newLibrary);
    });
  });
};

const addBookToLibrary = (req, res) => {
  const { book, userId } = req.body;

  fs.readFile("src/server/library.json", "utf8", (err, data) => {
    if (err) {
      console.log(err);
      return;
    }

    const libraries = JSON.parse(data);
    const userLibrary = libraries.libraries.find(
      (library) => library.userId === userId
    );

    if (!userLibrary) {
      return res.json({ message: "You don't have a library" });
    }

    const checkBook = userLibrary.book.find((data) => data.id === book.id);
    if (checkBook) {
      return res
        .status(400)
        .json({ message: "This book is already in your library" });
    }

    userLibrary.book.push(book);

    fs.writeFile(
      "src/server/library.json",
      JSON.stringify(libraries),
      (err) => {
        if (err) {
          console.log(err);
          return;
        }

        res.status(201).json(userLibrary);
      }
    );
  });
};

const deleteBookFromLibrary = (req, res) => {
  const bookId = Number(req.headers["book-id"]);
  const userId = req.headers["user-id"];

  fs.readFile("src/server/library.json", "utf8", (err, data) => {
    if (err) {
      console.log(err);
      return;
    }

    const libraries = JSON.parse(data);
    const userLibrary = libraries.libraries.find(
      (library) => library.userId === userId
    );

    if (!userLibrary) {
      return res.json({ message: "You don't have a library" });
    }

    const bookIndex = userLibrary.book.findIndex((book) => book.id === bookId);

    if (bookIndex !== -1) {
      userLibrary.book.splice(bookIndex, 1);
    } else {
      return res
        .status(404)
        .json({ message: "Book not found in your library" });
    }

    fs.writeFile(
      "src/server/library.json",
      JSON.stringify(libraries),
      (err) => {
        if (err) {
          console.log(err);
          return;
        }

        res.status(201).json(userLibrary);
      }
    );
  });
};

const putBookStatus = (req, res) => {
  const { userId, bookId } = req.body;

  fs.readFile("src/server/library.json", "utf8", (err, data) => {
    if (err) {
      console.log(err);
      return;
    }

    const libraries = JSON.parse(data);
    const userLibrary = libraries.libraries.find(
      (library) => library.userId === userId
    );

    if (!userLibrary) {
      return res.json({ message: "You don't have a library" });
    }

    const bookIndex = userLibrary.book.findIndex((book) => book.id === bookId);

    if (bookIndex !== -1) {
      userLibrary.book[bookIndex].isRead = !userLibrary.book[bookIndex].isRead;
    } else {
      return res
        .status(404)
        .json({ message: "Book not found in your library" });
    }

    fs.writeFile(
      "src/server/library.json",
      JSON.stringify(libraries),
      (err) => {
        if (err) {
          console.log(err);
          return;
        }

        res.status(201).json(userLibrary);
      }
    );
  });
};

module.exports = {
  getLibrary,
  postLibrary,
  addBookToLibrary,
  deleteBookFromLibrary,
  putBookStatus,
};
