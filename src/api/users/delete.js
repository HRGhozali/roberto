const { Router } = require('express');
const { check, validationResult } = require('express-validator');
// const { Sequelize } = require('sequelize');
const {
  IsValidEmail,
  GetReqValues,
} = require('../../utils/utils');

module.exports = () => {
  const mRouters = Router();

  /**
   * @swagger
   * /api/users/delete:
   *   post:
   *     summary: Protected Route JWT
   *     description: Delete user account. Checks if account exists via email. Restricted to admin/manager.
   *     parameters:
   *       - name: email
   *         description: Email address. Must be unique. Used to find account for deletion.
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
          check('email').isEmail(),
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
          let { email } = mDat;
          email = email.toLowerCase();
          if (!IsValidEmail(email))
            return res
              .status(200)
              .json(gg.returnDat(true, 400, 'Invalid email.', null));
          
          const dat = await global.Models.users
            .findOne({
              where: {
                email: email,
              },
            })
            .then(function (data) {
              let json = {};
              if (data && data !== null) {
                json = {
                  error: false,
                  code: 200,
                  message: 'User found for that email.',
                  data: null,
                };
              } else {
                json = {
                  error: true,
                  code: 400,
                  message: 'User not found.',
                  data: null,
                }; //or mobile
              }
              return json;
            })
            .catch((error) => {
              let errmsg = error.message
                ? error.message
                : 'Invalid request or deceptive request routing.';
              return { error: true, code: 400, message: errmsg, data: null };
            });
  
          if (dat.error == true) return res.status(200).json(dat);
  
          //rey will do
          //let confirmation = Get4Digit();
          // let confirmation = '1234';
          // validUntil: GetUtcPlusHours(24) this will not take any effect on accessLevel <= 4
  
          const dat2 = await global.Models.users
            .destroy({
              where: {
                email: email,
              },
            })
            .then(function (data) {
              return {
                error: false,
                code: 200,
                message: 'Successful.',
              };
            })
            .catch((error) => {
              console.log('error: ', error);
              let errmsg = error.message
                ? error.message
                : 'Invalid request or deceptive request routing.';
              return { error: true, code: 400, message: errmsg, data: null };
            });
  
          if (dat2.error == true) return res.status(200).json(dat2);
          else return res.status(200).json(dat2);
        }
      );
  
    return mRouters;
  };