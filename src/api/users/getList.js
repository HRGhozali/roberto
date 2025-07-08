const { Router } = require('express');
const { check, validationResult } = require('express-validator');
const { Sequelize } = require('sequelize');
const {
  IsValidEmail,
  GetReqValues,
} = require('../../utils/utils');

module.exports = () => {
  const mRouters = Router();

  /**
   * @swagger
   * /api/users/getList:
   *   post:
   *     summary: Protected Route JWT
   *     description: Get list of all user IDs and emails.
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
      async (req, res) => {
        const dat = await global.Models.users
          .findAll({ attributes: ['id','email'], where: { active: 1 } })
          .then(async function (data) {
            let json = {};
            if (data == null || !data) {
              json = {
                error: true,
                code: 400,
                message: 'Invalid data/session.',
                data: null,
              };
            } else {
              try {
                let infoDat = {
                  users: data.map(data => data.dataValues),
                }
                json = {
                  error: false,
                  code: 200,
                  message: 'Successful.',
                  data: infoDat,
                };
              } catch (searchError) {
                let errmsg = searchError.message
                  ? searchError.message
                  : 'Error during search.';
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