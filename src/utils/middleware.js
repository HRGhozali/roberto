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
  console.log('test', req);
  const token = req.headers.authorization;  // Numerous undefined issues that I can't get fixed
  console.log('token', token);
  if ((token == null) || (!token)) {
    res.status(200).json({ error: true, code: 401, message: 'Bearer token not found.', data: null });
  } else {
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
      if (err) return res.status(200).json({ error: true, code: 401, message: 'Invalid or expired token.', data: null });
      req.user = user;
      next();
    });
  }
}

module.exports = {
  genToken,
  authToken,
};
