const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

app.use("/customer/auth/*", function auth(req, res, next) {
    const token = req.headers['authorization']; // Get the token from request headers
    if (!token) {
      return res.status(403).json({ message: "Access denied, no token provided." });
    }
  
    jwt.verify(token, "fingerprint_customer", (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: "Invalid or expired token." });
      }
      
      // Store user data in session
      req.user = decoded;
      next(); // Proceed to the next middleware/route
    });
  });
 
const PORT =5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));
