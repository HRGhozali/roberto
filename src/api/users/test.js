const jwt = require('jsonwebtoken');


function authTokenTest(token) {
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) console.log('Invalid or expired token.');
    console.log('user:', user);    
  });
}


