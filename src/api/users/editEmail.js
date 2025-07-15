const { Router } = require('express');
const { check, validationResult } = require('express-validator');
const { Sequelize } = require('sequelize');
const {
  IsValidEmail,
  GetReqValues,
} = require('../../utils/utils');
// const {
//   authToken,
// } = require('../../utils/middleware');

module.exports = () => {
  const mRouters = Router();

  /**
   * @swagger
   * /api/users/editEmail:
   *   post:
   *     summary: Protected Route JWT
   *     description: Edit user email. Checks if account exists via id. Edits email using given values. Restricted to admin/manager.
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
   *       - name: email
   *         description: Email address. Must be unique.
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
        check('id').not().isEmpty(),
        check('session').isNumeric(),
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
        let { id, session, email } = mDat;
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

        const dat2 = await global.Models.users
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
                  'You cannot edit an inactive account.',
                data: null,
              };
            } else {
              const randomValue =
                Math.floor(Math.random() * 100) + data.dataValues.nSession;
              const updatedValues = {
                idUserUpdate: 0,
                updateDate: Sequelize.Sequelize.fn('getutcdate'),
                email: email,
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

        if (dat2.error == true) return res.status(200).json(dat2);
        else return res.status(200).json(dat2);
      }
    );

  return mRouters;
};
