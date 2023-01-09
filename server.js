require("dotenv").config();
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const nodemailer = require("nodemailer");
const PORT = process.env.PORT || 3500;

// Middleware
app.use(express.static("public"));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

// Route
app.use("/", require("./routes/root"));

// send_mail
app.post("/send_mail", cors(), async (req, res) => {
  const { name } = req.body;
  const { email } = req.body;
  const { message } = req.body;
  const transport = nodemailer.createTransport({
    port: process.env.MAIL_PORT,
    host: process.env.MAIL_HOST,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  await transport.sendMail({
    from: email,
    to: "diekechi@gmail.com",
    subject: "testing email",
    html: `
    <div>
     <h2>Here's your email from ${name}</h2>

     <p>${message}</p>

     <p>All the best Sydney</p>
     </div>
    `,
  });
});

// 404 Configuring
app.all =
  ("*",
  (req, res) => {
    res.status(404); // Not Found
    if (req.accepts(".html")) {
      res.sendFile(path.join(__dirname, "views", "index.html"));
    } else if (req.accepts(".json")) {
      res.json({ message: "Page Not Found 404 Error" });
    } else {
      res.type("404 Error page not found");
    }
  });

app.listen(PORT, () => {
  console.log(`server running on PORT ${PORT}`);
});
