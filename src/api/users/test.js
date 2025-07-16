const jwt = require('jsonwebtoken');

const { Router } = require('express');
const { check, validationResult } = require('express-validator');
const {
  GetReqValues,
} = require('../../utils/utils');
// const {
//   authToken,
// } = require('../../utils/middleware');

module.exports = () => {
  const mRouters = Router();

  /**
   * @swagger
   * /api/users/test:
   *   post:
   *     summary: Protected Route JWT
   *     description: Token test.
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - name: token
   *         description: Token.
   *         in: query
   *         required: true
   *         type: string
   *
   *     responses:
   *       200:
   *         description: The request succeeded.
   *       400:
   *         description: The server cannot or will not process the request due to something that is perceived to be a client error (e.g., malformed request syntax, invalid request message framing, or deceptive request routing).
   *       401:
   *         description: Token invalid or expired.
   */

  mRouters
    .route('/')
    .post(
      [
        //authToken(),
        check('token').not().isEmpty(),
      ],
      async (req, res) => {
        const errors = validationResult(req);
        let gg = require('../../utils/myglobal');
        if (!errors.isEmpty())
          return res
            .status(200)
            .json(
              gg.returnDat(true, 400, 'API required values.', errors.array())
            );
        const mDat = GetReqValues(req);
        let { token } = mDat;

        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
          if (err)  {
            console.log('Invalid or expired token.');
            return false;
          }
          else {
            console.log('user:', user); 
            return user;   
          }
        });
      }
    );

  return mRouters;
};