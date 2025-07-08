const { Router } = require('express');
const { check, validationResult } = require('express-validator');
const {
  IsValidEmail,
  GetReqValues,
} = require('../../utils/utils');

module.exports = () => {
  const mRouters = Router();

  /**
   * @swagger
   * /api/users/getUser:
   *   post:
   *     summary: Protected Route JWT
   *     description: Get user's full name using email and ID.
   *     parameters:
   *       - name: id
   *         description: Id assigned.
   *         in: query
   *         required: true
   *         type: string
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
        check('id').not().isEmpty(),
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
        let { id, email } = mDat;
        email = email.toLowerCase();
        if (!IsValidEmail(email))
          return res
            .status(200)
            .json(gg.returnDat(true, 400, 'Invalid email.', null));

        const dat = await global.Models.users
          .findOne({
            where: {
              id: id,
              email: email,
            },
          }).then(async function (data) {
            let json = {};
            if (data == null || !data) {
              json = {
                error: true,
                code: 400,
                message: 'Invalid data/session.',
                data: null,
              };
            } else if (data.dataValues.active == 0) {
              //this is your token and to prevent by accident updating yoursekf with a lower level
              json = {
                error: true,
                code: 400,
                message:
                  'You cannot search an inactive user.',
                data: null,
              };
            } else {
              try {
                let infoDat = {
                  id: data.dataValues.id,
                  fullName:
                    data.dataValues.firstName + ' ' + data.dataValues.lastName,
                  email: data.dataValues.email,
                };

                json = {
                  error: false,
                  code: 200,
                  message: 'Successful.',
                  data: infoDat,
                };
              } catch (searchError) {
                let errmsg = searchError.message
                  ? searchError.message
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
