const fs = require("fs");
const { nanoid } = require("nanoid");
const bcrypt = require("bcrypt");

const addUserHandler = async (req, res) => {
  const { username, password, fullname } = req.body;
  const id = nanoid();
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

module.exports = { addUserHandler };
