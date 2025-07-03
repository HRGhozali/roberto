const { Router } = require('express');
const { check, validationResult } = require('express-validator');
// const { Sequelize } = require('sequelize');
const {
  ExtractNumbers,
  IsNulo,
  IsValidEmail,
  GetReqValues,
  IsValidPhone,
  FormatPhone,
  Get4Digit,
  GetLevel,
} = require('../../utils/utils');

module.exports = () => {
  const mRouters = Router();

  /**
   * @swagger
   * /api/users/add:
   *   post:
   *     summary: Protected Route JWT
   *     description: Create new user account. Restricted to admin/manager.
   *     parameters:
   *       - name: email
   *         description: Email address. Must be unique.
   *         in: query
   *         required: true
   *         type: string
   *       - name: password
   *         description: Password. Max 255 chars. Required for login.
   *         in: query
   *         required: true
   *         type: string
   *       - name: session
   *         description: session value.
   *         in: query
   *         required: true
   *         type: number
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
        check('password').not().isEmpty(),
        check('session').isNumeric(),
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
        let { email, password, session } = mDat;
        email = email.toLowerCase();
        if (!IsValidEmail(email))
          return res
            .status(200)
            .json(gg.returnDat(true, 400, 'Invalid email.', null));

        const dat = await global.Models.users
          .findOne({
            where: {
                email: email,
                password: password,
                nSession: session
            }
          })
          .then(function (data) {
            let json = {};
            if (!data || data == null) {
                json = {
                    error: true,
                    code: 400,
                    message: "Invalid data/session.",
                    data: null
                }
            }
            else {
                let infoDat = {
                    id: data.dataValues.id,
                    session: data.dataValues.nSession,
                    fullName: data.dataValues.firstName + ' ' + data.dataValues.lastName,
                    firstName: data.dataValues.firstName,
                    lastName: data.dataValues.lastName,
                    accessLevel: data.dataValues.accessLevel,
                    role: data.dataValues.accessName,
                    mobile: data.dataValues.mobile,
                    email: data.dataValues.email,
                    active: data.dataValues.active,
                };
                json = {
                    error: false,
                    code: 200,
                    message: 'Successful.',
                    data: infoDat,
                };
                // TODO: Insert further things to deal with login. Session token? Ask Roberto.
            }
            return json;
          })
          .catch((error) => {
            console.log('error: ', error);
            let errmsg = error.message
              ? error.message
              : 'Invalid request or deceptive request routing.';
            return { error: true, code: 400, message: errmsg, data: null };
          });

        if (dat.error == true) return res.status(200).json(dat);
        else return res.status(200).json(dat);
      }
    );

  return mRouters;
};
