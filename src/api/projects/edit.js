const { Router } = require('express');
const { check, validationResult } = require('express-validator');
// const { Sequelize } = require('sequelize');
const {
  ExtractNumbers,
  IsNulo,
  GetReqValues,
  FormatDateAlt,
} = require('../../utils/utils');
const { Sequelize } = require('sequelize');
// const {
//   authToken,
// } = require('../../utils/middleware');

module.exports = () => {
  const mRouters = Router();

  /**
   * @swagger
   * /api/projects/edit:
   *   post:
   *     summary: Protected Route JWT
   *     description: Edit project. Restricted to admin/manager.
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - name: id
   *         description: Project id. Required.
   *         in: query
   *         required: true
   *         type: string
   *       - name: session
   *         description: Session value.
   *         in: query
   *         required: true
   *         type: number
   *       - name: description
   *         description: Project description. Optional. Max 255 chars.
   *         in: query
   *         required: false
   *         type: string
   *       - name: locationAddress
   *         description: Project address. Max 100 chars.
   *         in: query
   *         required: true
   *         type: string
   *       - name: locationZip
   *         description: Project zip code. Max 12 chars.
   *         in: query
   *         required: true
   *         type: string
   *       - name: locationCity
   *         description: Project city. Max 50 chars.
   *         in: query
   *         required: true
   *         type: string
   *       - name: locationState
   *         description: Project state. Optional. Max 50 chars.
   *         in: query
   *         required: true
   *         type: string
   *       - name: locationCountry
   *         description: Project country. Max 50 chars.
   *         in: query
   *         required: true
   *         type: string
   *       - name: startDate
   *         description: Project start date. Input is auto-formatted. Not required, defaults to today.
   *         in: query
   *         required: false
   *         schema:
   *            type: string
   *            format: date
   *            example: '2024-04-04'
   *       - name: endDate
   *         description: Project end date. Input is auto-formatted. Not required, defaults to today.
   *         in: query
   *         required: false
   *         schema:
   *            type: string
   *            format: date
   *            example: '2024-04-04'
   *       - name: maxHours
   *         description: Max hours workable.
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

  mRouters.route('/').post(
    [
      //authToken(),
      check('id').not().isEmpty(),
      check('session').isNumeric(),
      check('description').optional(),
      check('locationAddress').not().isEmpty(),
      check('locationZip').not().isEmpty(),
      check('locationCity').not().isEmpty(),
      check('locationState').not().isEmpty(),
      check('locationCountry').not().isEmpty(),
      check('startDate').optional().isDate(),
      check('endDate').optional().isDate(),
      check('maxHours').isNumeric(),
    ],
    async (req, res) => {
      if (req.user['role'] > 2) {
        return res
          .status(200)
          .json(
            gg.returnDat(true, 400, 'Your role cannot edit projects.', null)
          );
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
      let {
        id,
        session,
        description,
        locationAddress,
        locationZip,
        locationCity,
        locationState,
        locationCountry,
        startDate,
        endDate,
        maxHours,
      } = mDat;
      if (IsNulo(description)) description = '';
      if (IsNulo(startDate)) {
        startDate = '';
      } else {
        startDate = ExtractNumbers(startDate);
        startDate = FormatDateAlt(startDate);
      }
      if (IsNulo(endDate)) {
        endDate = '';
      } else {
        endDate = ExtractNumbers(endDate);
        endDate = FormatDateAlt(endDate);
      }

      const dat = await global.Models.projects
        .findOne({
          where: {
            id: id,
            session: session,
          },
        })
        .then(async function (data) {
          let json = {};
          if (data == null || !data) {
            json = {
              error: true,
              code: 400,
              message: 'Invalid data/session.',
              data: null,
            };
          } else if (data.dataValues.active == 0) {
            json = {
              error: true,
              code: 400,
              message: 'You cannot edit an inactive project.',
              data: null,
            }; //or mobile
          } else {
            const randomValue =
              Math.floor(Math.random() * 100) + data.dataValues.nSession;
            const updatedValues = {
              idUserUpdate: req.user.id,
              updateDate: Sequelize.Sequelize.fn('getutcdate'),
              description: description,
              locationAddress: locationAddress,
              locationZip: locationZip,
              locationCity: locationCity,
              locationState: locationState,
              locationCountry: locationCountry,
              startDate: startDate,
              endDate: endDate,
              maxHours: maxHours,
              nSession: randomValue,
            };
            try {
              await data.update(updatedValues);
              let infoDat = {
                id: data.dataValues.id,
                session: data.dataValues.nSession,
                location:
                  data.dataValues.locationAddress +
                  ', ' +
                  data.dataValues.locationCity +
                  ', ' +
                  data.dataValues.locationState +
                  ', ' +
                  data.dataValues.locationCountry +
                  ', ' +
                  data.dataValues.locationZip,
                startDate: data.dataValues.startDate,
                endDate: data.dataValues.endDate,
                maxHours: data.dataValues.maxHours,
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
