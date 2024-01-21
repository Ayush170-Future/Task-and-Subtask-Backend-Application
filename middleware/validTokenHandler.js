const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");

const validateToken = asyncHandler(async (req, res, next) => {
    let token;
    let authHeader = req.headers.authorization || req.headers.Authorization;

    if (authHeader && authHeader.startsWith("Bearer")) {
        token = authHeader.split(" ")[1];
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                res.status(400);
                throw new Error("User is not authorized");
            }
            // Attach the user object to the request for later use
            req.admin = decoded.admin; // Assuming user details are in the 'user' field of the decoded token
        });
    }
    next();
});

module.exports = validateToken;