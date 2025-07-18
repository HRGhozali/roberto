const { Router } = require('express');
const { check, validationResult } = require('express-validator');
const { Sequelize, Op } = require('sequelize');
const { GetReqValues } = require('../../utils/utils');
// const {
//   authToken,
// } = require('../../utils/middleware');

module.exports = () => {
  const mRouters = Router();

  /**
   * @swagger
   * /api/users/getList:
   *   post:
   *     summary: Protected Route JWT
   *     description: Get list of all user IDs and emails.
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - name: search
   *         description: Search value.
   *         in: query
   *         required: false
   *         type: string
   *       - name: getActive
   *         description: Include inactive users?
   *         in: query
   *         required: true
   *         type: boolean
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
    .post([check('search'), check('getActive').isBoolean()], async (req, res) => {
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
      let { search, getActive } = mDat;
      if (req.user['role'] > 3 || req.user['role'] < 1) {
        return res
          .status(200)
          .json(
            gg.returnDat(
              true,
              400,
              'Your role cannot get a list of users.',
              null
            )
          );
      }
      let searchCheck = '%' + search + '%';
      if (search == null || !search || search == '') {
        console.log('yes');
        searchCheck = '(.*?)';
      }
      let activeCheck = '%';
      if (!getActive) {
        activeCheck = '%1%';
      }

      const dat = await global.Models.users  // It returns nothing when Search is empty. Still working on it.
        .findAll({
          attributes: ['id', 'email'],
          where: {
            [Op.and]: [
              {
                [Op.or]: [
                  {
                    firstName: {
                      [Op.like]: searchCheck,
                    },
                  },
                  {
                    lastName: {
                      [Op.like]: searchCheck,
                    },
                  },
                  {
                    email: {
                      [Op.like]: searchCheck,
                    },
                  },
                  Sequelize.where(Sequelize.fn('concat', Sequelize.col('firstName'), Sequelize.col('lastName')), {
                    [Op.like]: searchCheck,
                  }),
                ],
                active: {
                  [Op.like]: activeCheck,
                },
              },
            ],
          },
        }) // Assuming we only wanna be able to search active users.
        .then(async function (data) {
          let json = {};
          if (data == null || !data) {
            json = {
              error: true,
              code: 400,
              message: 'Invalid data/session.',
              data: null,
            };
          } else if (data.size === 0) {
            json = {
              error: false,
              code: 200,
              message: 'No users to return.',
              data: null,
            };
          } else {
            try {
              json = {
                error: false,
                code: 200,
                message: 'Successful.',
                data: data,
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
    });

  return mRouters;
};
