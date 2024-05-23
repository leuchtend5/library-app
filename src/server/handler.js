const fs = require("fs");
const { nanoid } = require("nanoid");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"];

  if (!token) {
    return res.status(403).send("login first");
  }

  try {
    const decoded = jwt.verify(token, "secret_key");
    req.user = decoded;
  } catch (err) {
    return res.status(401).send("Invalid Token");
  }

  return next();
};

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

const createAccessToken = ({ id, username }) => {
  const newAccessToken = jwt.sign({ id, username }, "secret_key", {
    expiresIn: "10s",
  });

  fs.readFile("src/server/authToken.json", "utf8", (err, data) => {
    if (err) {
      console.log(err);
      return;
    }

    const jsonData = JSON.parse(data);

    const newToken = {
      token: newAccessToken,
    };
    jsonData.auth.push(newToken);

    fs.writeFile(
      "src/server/authToken.json",
      JSON.stringify(jsonData),
      (err) => {
        if (err) {
          console.log(err);
          return;
        }
      }
    );
  });
  return newAccessToken;
};

// create new user
const addUserHandler = async (req, res) => {
  const { username, password, fullname } = req.body;
  const id = `user-${nanoid()}`;
  const hashedPassword = await bcrypt.hash(password, 10);

  fs.readFile("src/server/userData.json", "utf8", (err, data) => {
    if (err) {
      console.log(err);
      return;
    }

    const jsonData = JSON.parse(data);
    const checkUsername = jsonData.users.find(
      (user) => user.username.toLowerCase() === username.toLowerCase()
    );

    if (checkUsername) {
      res.status(400).json({ message: "Username already in use" });
      return;
    }

    const newUser = {
      id,
      username,
      password: hashedPassword,
      fullname,
    };
    jsonData.users.push(newUser);

    fs.writeFile(
      "src/server/userData.json",
      JSON.stringify(jsonData),
      (err) => {
        if (err) {
          console.log(err);
          return;
        }

        res.status(201).json(newUser);
      }
    );
  });
};

// login handler
const loginHandler = async (req, res) => {
  const { username, password } = req.body;

  fs.readFile("src/server/userData.json", "utf8", async (err, data) => {
    if (err) {
      console.log(err);
      return;
    }

    const jsonData = JSON.parse(data);
    const user = jsonData.users.find(
      (user) => user.username.toLowerCase() === username.toLowerCase()
    );

    if (!user) {
      return res.status(400).json({ message: "Invalid username or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid username or password" });
    }

    const token = createAccessToken(user);
    res.status(200).json({ token, user });
  });
};

module.exports = {
  addUserHandler,
  loginHandler,
  getBookHandler,
  searchHandler,
  verifyToken,
};
