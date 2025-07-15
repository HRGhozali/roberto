///
///  Middleware for authing/making JWT tokens
///

require('dotenv').config();
const jwt = require('jsonwebtoken');

function genToken(id, email, role) {
  const data = {
    id: id,
    email: email,
    role: role,
  };
  const token = jwt.sign(data, process.env.ACCESS_TOKEN_SECRET);
  return token;
}

function authToken(req, res, next) {
  const token = req.query.token;  // Numerous undefined issues that I can't get fixed
  if (!token) return res.sendStatus(401).json({message: 'Invalid or expired token.'});

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(401).json({message: 'Invalid or expired token.'});
    req.user = user;
    next();
  });
}

module.exports = {
  genToken,
  authToken,
};
