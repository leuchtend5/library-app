const fs = require("fs");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const createAccessToken = ({ id, username }) => {
  return jwt.sign({ id, username }, "secret_key", {
    expiresIn: "30m",
  });
};

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
    res.setHeader("Authorization", `Bearer ${token}`);
    res.status(200).json({ token, user });
  });
};

const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"];

  if (!token) {
    return res.status(403).send("You don't have access to this action.");
  }

  try {
    const decoded = jwt.verify(token.replace("Bearer ", ""), "secret_key");
    req.user = decoded;
  } catch (err) {
    return res.status(401).send("Invalid Token");
  }

  return next();
};

module.exports = {
  loginHandler,
  verifyToken,
};
