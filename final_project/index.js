const express = require("express");
const jwt = require("jsonwebtoken");
const session = require("express-session");
const customer_routes = require("./router/auth_users.js").authenticated;
const genl_routes = require("./router/general.js").general;

const app = express();

app.use(express.json());
app.use("/customer", session({ secret: "access", resave: true, saveUninitialized: true }));

app.use("/customer/auth/*", (req, res, next) => {
  const token = req.session.authorization?.token;
  if (!token) return res.status(401).json({ message: "Unauthorized: No token provided" });

  jwt.verify(token, "access", (err, decoded) => {
    if (err) return res.status(403).json({ message: "Forbidden: Invalid token" });
    req.user = decoded.username;
    next();
  });
});

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(5005, () => console.log("Server is running"));
