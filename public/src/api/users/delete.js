const { Router } = require('express');
const { check, validationResult } = require('express-validator');
// const { Sequelize } = require('sequelize');
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
   * /api/users/delete:
   *   post:
   *     summary: Protected Route JWT
   *     description: Delete user account. Checks if account exists via email. Restricted to admin/manager.
   *     security:
   *       - bearerAuth: []
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
      ],
      async (req, res) => {
        if (req.user['role'] != 1) {
          return res
            .status(200)
            .json(gg.returnDat(true, 400, 'Your role cannot delete users!', null));
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
        let { id, session } = mDat;
        

        //rey will do
        //let confirmation = Get4Digit();
        // let confirmation = '1234';
        // validUntil: GetUtcPlusHours(24) this will not take any effect on accessLevel <= 4

        const dat = await global.Models.users
          .findOne({ where: { id: id, nSession: session }, })
          .then(async function (data) {
            let json = {};
            if (data == null || !data) {  // If no data, then the user was updated/deleted between the first and second checks. Best I could think of.
              json = {
                error: true,
                code: 409,
                message: 'Invalid data/session.',
                data: null,
              };
            }
            else {
              try {
                global.Models.users.destroy({ where: { id: id, nSession: session } });

                json = {
                  error: false,
                  code: 200,
                  message: 'Successful.',
                  data: null,
                };
              } catch (deleteError) {
                let errmsg = deleteError.message ? deleteError.message : 'Error during deletion.';
                json = { error: true, code: 400, message: errmsg, data: null };
              }
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