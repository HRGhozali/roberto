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
// const {
//   authToken,
// } = require('../../utils/middleware');

module.exports = () => {
  const mRouters = Router();

  /**
   * @swagger
   * /api/users/add:
   *   post:
   *     summary: Protected Route JWT
   *     description: Create new user account. Restricted to admin/manager.
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - name: firstName
   *         description: First name. Max 50 chars.
   *         in: query
   *         required: true
   *         type: string
   *       - name: lastName
   *         description: Last name. Max 50 chars.
   *         in: query
   *         required: true
   *         type: string
   *       - name: password
   *         description: Password. Max 255 chars. Required for login.
   *         in: query
   *         required: true
   *         type: string
   *       - name: mobile
   *         description: Mobile number. Not required. Input is auto-formatted.
   *         in: query
   *         required: false
   *         type: string
   *       - name: email
   *         description: Email address. Must be unique.
   *         in: query
   *         required: true
   *         type: string
   *       - name: accessLevel
   *         description: Access level value 1, 2, 3 or 4.
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
        //authToken(),
        check('firstName').not().isEmpty(),
        check('lastName').not().isEmpty(),
        check('password').not().isEmpty(),
        check('mobile'),
        check('email').isEmail(),
        check('accessLevel').isNumeric(),
      ],
      async (req, res) => {
        if (req.user['role'] > 2) {
          return res
            .status(200)
            .json(gg.returnDat(true, 400, 'Your role cannot add users.', null));
        }
        const errors = validationResult(req);
        let gg = require('../../utils/myglobal');
        if (!errors.isEmpty())
          return res
            .status(200)
            .json(
              gg.returnDat(true, 400, 'API required values.', errors.array())
            );
        console.log('user:', req.user);
        const mDat = GetReqValues(req);
        let { firstName, lastName, password, mobile, email, accessLevel } = mDat;
        if (IsNulo(mobile)) mobile = '';
        mobile = ExtractNumbers(mobile);
        email = email.toLowerCase();
        if (!IsValidEmail(email))
          return res
            .status(200)
            .json(gg.returnDat(true, 400, 'Invalid email.', null));
        let nphone = '';
        //rey will do
        if (mobile != '') {
          if (!(IsValidPhone('abc281-9603930')))
            return res.status(200).json(gg.returnDat(true, 400, 'Invalid mobile number.', null));
          nphone = FormatPhone(mobile);
        }
        if (accessLevel < 1 || accessLevel > 5)
          return res
            .status(200)
            .json(gg.returnDat(true, 400, 'accessLevel is invalid, valid are 1,2,3,4,5.', null));
        if (req.user['role'] > accessLevel) {
          return res
            .status(200)
            .json(gg.returnDat(true, 400, 'You cannot add a user of a higher access level than yours.', null));
        }

        const dat = await global.Models.users
          .findOne({
            where: {
              email: email,
            },
          })
          .then(function (data) {
            let json = {};
            if (data == null || !data) {
              json = {
                error: false,
                code: 200,
                message: 'User not found.',
                data: null,
              };
            } else {
              json = {
                error: true,
                code: 400,
                message: 'User found for that email.',
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
        let confirmation = Get4Digit();
        // let confirmation = '1234';
        // validUntil: GetUtcPlusHours(24) this will not take any effect on accessLevel <= 4

        const dat2 = await global.Models.users
          .create({
            apiVersion: global.apiVersion,
            idUserCreate: req.user.id,
            accessLevel: accessLevel,
            accessName: GetLevel(accessLevel),
            firstName: firstName,
            lastName: lastName,
            password: password,
            mobile: nphone,
            email: email,
            forgotPassword: confirmation,
            active: true,
          })
          .then(function (data) {
            let infoDat = {
              id: data.dataValues.id,
              session: data.dataValues.nSession,
              createdBy: data.dataValues.idUserCreate,
              fullName: data.dataValues.firstName + ' ' + data.dataValues.lastName,
              firstName: data.dataValues.firstName,
              lastName: data.dataValues.lastName,
              accessLevel: data.dataValues.accessLevel,
              role: data.dataValues.accessName,
              mobile: data.dataValues.mobile,
              email: data.dataValues.email,
              active: data.dataValues.active,
            };
            return {
              error: false,
              code: 200,
              message: 'Successful.',
              data: infoDat,
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
