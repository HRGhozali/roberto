const { Router } = require('express');
const { check, validationResult } = require('express-validator');
const { Sequelize } = require('sequelize');
const {
  ExtractNumbers,
  IsNulo,
  IsValidEmail,
  GetReqValues,
  IsValidPhone,
  FormatPhone,
  GetLevel,
} = require('../../utils/utils');

module.exports = () => {
  const mRouters = Router();

  /**
   * @swagger
   * /api/users/edit:
   *   post:
   *     summary: Protected Route JWT
   *     description: Edit user account. Checks if account exists via email. Edits others using given values. Restricted to admin/manager.
   *     parameters:
   *       - name: id
   *         description: id assigned.
   *         in: query
   *         required: true
   *         type: string
   *       - name: session
   *         description: session value.
   *         in: query
   *         required: true
   *         type: number
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
   *         description: Password. Max 255 chars.
   *         in: query
   *         required: true
   *         type: string
   *       - name: mobile
   *         description: Mobile number. Not required. Input is auto-formatted.
   *         in: query
   *         required: false
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
        check('id').not().isEmpty(),
        check('session').isNumeric(),
        check('firstName').not().isEmpty(),
        check('lastName').not().isEmpty(),
        check('password').not().isEmpty(),
        check('mobile'),
        check('accessLevel').isNumeric(),
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
        let { id, session, firstName, lastName, password, mobile, accessLevel } = mDat;
        if (IsNulo(mobile)) mobile = '';
        mobile = ExtractNumbers(mobile);
        let nphone = '';
        //rey will do
        if (mobile != '') {
          if (!IsValidPhone(mobile))
            return res
              .status(200)
              .json(gg.returnDat(true, 400, 'Invalid mobile number.', null));
          nphone = FormatPhone(mobile);
        }
        if (accessLevel < 1 || accessLevel > 5)
          return res
            .status(200)
            .json(
              gg.returnDat(
                true,
                400,
                'accessLevel is invalid, valid are 1,2,3,4,5.',
                null
              )
            );

        const dat = await global.Models.users
          .findOne({ where: { id: id, nSession: session } })
          .then(async function (data) {
            let json = {};
            if (data == null || !data) {
              json = {
                error: true,
                code: 400,
                message: 'Invalid data/session.',
                data: null,
              };
            } else if (          data.dataValues.active == 0        ) {
              //this is your token and to prevent by accident updating yoursekf with a lower level
              json = {
                error: true,
                code: 400,
                message:
                  'You cannot edit an inactive user.',
                data: null,
              };
            } else {
              const randomValue =
                Math.floor(Math.random() * 100) + data.dataValues.nSession;
              const updatedValues = {
                idUserUpdate: 0,
                updateDate: Sequelize.Sequelize.fn('getutcdate'),
                firstName: firstName,
                lastName: lastName,
                password: password,
                mobile: nphone,
                accessLevel: accessLevel,
                accessName: GetLevel(accessLevel),
                nSession: randomValue,
              };
              try {
                await data.update(updatedValues);

                let infoDat = {
                  id: data.dataValues.id,
                  session: data.dataValues.nSession,
                  fullName:
                    data.dataValues.firstName + ' ' + data.dataValues.lastName,
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
              } catch (updateError) {
                let errmsg = updateError.message
                  ? updateError.message
                  : 'Error during update.';
                json = { error: true, code: 400, message: errmsg, data: null };
              }
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
        else return res.status(200).json(dat);
      }
    );

  return mRouters;
};
