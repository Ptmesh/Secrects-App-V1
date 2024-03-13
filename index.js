import bodyParser from "body-parser";
import express from "express";
import pg from "pg";

const app = express();
const port = 3000;
const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "secrets",
  password: "******",
  port: "5432",
});
db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("home.ejs");
});

app.get("/login", (req, res) => {
  res.render("login.ejs");
});

app.get("/register", (req, res) => {
  res.render("register.ejs");
});

// Registering an user
app.post("/register", async (req, res) => {
  const email = req.body.username;
  const pass = req.body.password;
  try {
    const checkResult = await db.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    if (checkResult.rows.length > 0) {
      res.send("Email Already Registerd! Please go to login page!!");
    } else {
      const results = await db.query(
        "INSERT INTO users (email , password) VALUES ($1 , $2)",
        [email, pass]
      );
      console.log(results);
      res.render("secrets.ejs");
    }
  } catch (error) {
    console.log(error);
  }
});

app.post("/login", async (req, res) => {
  const email = req.body.username;
  const password = req.body.password;

  try {
    const results = await db.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    if (results.rows.length > 0) {
      console.log(results.rows);
      const user = results.rows[0];
      const storedPassword = user.password;
      if (password == storedPassword) {
        res.render("secrets.ejs");
      } else {
        res.send("Incorrect Password");
      }
    } else {
      res.send("User Not Found");
    }
  } catch (error) {
    console.log(error);
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
