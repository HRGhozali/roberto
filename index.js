require('dotenv').config();

// Make our db accessible to all our routers
global.apiVersion = '2025.06.25';
// OFFSET = -6; // -5 march  or -6 around november
global.offset = parseInt(process.env.OFFSET, 10);
global.isDev = false;
if (process.env.ISDEV == 'true') global.isDev = true;

// i am using CommonJS
// CommonJS (typical Node.js)

const express = require('express');
const http = require('http');
const cors = require('cors');
const bodyParser = require('body-parser');
const compression = require('compression');

const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const basicAuth = require('express-basic-auth');

const models = require('./src/models')(false);
const { authToken } = require('./src/utils/middleware');


//
global.Models = models;

// Array of valid users (username:password)
const validUsers = {
  rey: '1234',
  user2: '654321',
};
// Middleware for basic authentication
// eslint-disable-next-line no-unused-vars
const authMiddleware = basicAuth({
  users: validUsers,
  challenge: true,
  unauthorizedResponse: 'Unauthorized',
});

async function startServer() {
  const PORT = process.env.PORT || 80;
  const app = express();
  // const httpServer = http.createServer(app);
  const server = http.createServer(app);

  // Enable compression
  app.use(compression());

  // ** websocket does not work properly with graphql as of 08/01/2024 on the same port

  //swagger documentations **********************************************************
  const swaggerOptions = {
    swaggerDefinition: {
      info: {
        title: 'Rey API',
        description:
          'Rey API will help you to manage the backend for the application.',
        version: '2025.06.25',
        termsOfService: 'http://swagger.io/terms/',
        contact: {
          email: 'rey@gmail.com',
        },
        license: {
          name: 'Apache 2.0',
          url: 'http://www.apache.org/licenses/LICENSE-2.0.html',
        },
      },
      // Add security definitions here if required (e.g., apiKey, bearerToken, etc.)
      securityDefinitions: {
        // using Bearer token authentication
        bearerAuth: {
          type: 'apiKey',
          name: 'Authorization',
          in: 'header',
        },
      },
    },
    apis: ['./src/api/**/*.js'],
  };
  const swaggerDocs = swaggerJSDoc(swaggerOptions);
  // app.use('/swagger', authMiddleware, swaggerUi.serve, swaggerUi.setup(swaggerDocs));
  app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
  

  //
  // swagger api  **********************************************************

  // Protected Route JWT
  // folder: users
  const usersAdd = require('./src/api/users/add')();
  app.use(
    '/api/users/add',
    cors(),
    bodyParser.json(),
    bodyParser.urlencoded({ extended: false }),
    authToken,
    usersAdd
  );
 

  // Protected Route JWT
  // folder: users
  const usersEdit = require('./src/api/users/edit')();
  app.use(
    '/api/users/edit',
    cors(),
    bodyParser.json(),
    bodyParser.urlencoded({ extended: false }),
    authToken,
    usersEdit
  );

  // Protected Route JWT
  // folder: users
  const usersDelete = require('./src/api/users/delete')();
  app.use(
    '/api/users/delete',
    cors(),
    bodyParser.json(),
    bodyParser.urlencoded({ extended: false }),
    authToken,
    usersDelete
  );

  // Protected Route JWT
  // folder: users
  const usersEditEmail = require('./src/api/users/editEmail')();
  app.use(
    '/api/users/editEmail',
    cors(),
    bodyParser.json(),
    bodyParser.urlencoded({ extended: false }),
    authToken,
    usersEditEmail
  );

  // Protected Route JWT
  // folder: users
  const usersDisable = require('./src/api/users/disable')();
  app.use(
    '/api/users/disable',
    cors(),
    bodyParser.json(),
    bodyParser.urlencoded({ extended: false }),
    authToken,
    usersDisable
  );

  // Protected Route JWT
  // folder: users
  const usersEnable = require('./src/api/users/enable')();
  app.use(
    '/api/users/enable',
    cors(),
    bodyParser.json(),
    bodyParser.urlencoded({ extended: false }),
    authToken,
    usersEnable
  );

  // Protected Route JWT
  // folder: users
  const usersGetList = require('./src/api/users/getList')();
  app.use(
    '/api/users/getList',
    cors(),
    bodyParser.json(),
    bodyParser.urlencoded({ extended: false }),
    authToken,
    usersGetList
  );

  // Protected Route JWT
  // folder: users
  const usersGetUser = require('./src/api/users/getUser')();
  app.use(
    '/api/users/getUser',
    cors(),
    bodyParser.json(),
    bodyParser.urlencoded({ extended: false }),
    authToken,
    usersGetUser
  );

  // Protected Route JWT
  // folder: users
  const login = require('./src/api/users/login')();
  app.use(
    '/api/users/login',
    cors(),
    bodyParser.json(),
    bodyParser.urlencoded({ extended: false }),
    login
  );

  // Protected Route JWT
  // folder: users
  const test = require('./src/api/users/test')();
  app.use(
    '/api/users/test',
    cors(),
    bodyParser.json(),
    bodyParser.urlencoded({ extended: false }),
    authToken,
    test
  );

  //
  // end  website
  //*********************** */

  // const servertime = require('./src/api/servertime')();
  // app.use('/api/servertime', cors(), bodyParser.json(), bodyParser.urlencoded({ extended: false }), servertime);
  app.get('/myip', (req, res) => {
    let ipAddress =
      req.header('x-forwarded-for') || req.socket.remoteAddress
        ? req.header('x-forwarded-for') || req.socket.remoteAddress
        : '0.0.0.0';
    // if (ipAddress == '::1')
    //   ipAddress = '127.0.0.1';
    const parts = ipAddress.split(':');
    if (parts.length >= 1) ipAddress = parts[0];
    res.send(ipAddress);
  });

  // app.get('/', (req, res) => {
  //   // res.send('hello world!');
  //   res.sendFile(path.join(__dirname, '/public/index.html'));
  // });
  // if you not included a favicon.ico in your html, the customer browser will do a second call asking for it
  // app.get('/favicon.ico', (req, res) => {
  //   res.sendFile(path.join(__dirname, '/public/favicon.ico'));
  // });

  // http://localhost/EBD27011-613B-4D4B-8016-BFF0C0C73AAF

  app.use(express.static('public'));

  await new Promise((resolve) => {
    server.listen({ port: PORT }, () => {
      if (global.isDev == true) {
        console.log(`🚀 Rey API ready at http://localhost:${PORT}/swagger`);
      } else {
        console.log(`🚀 Rey API ready at http://localhost:${PORT}`);
      }
      resolve(); // Resolve the Promise after successful server start
    });
  });
}
startServer();

// console.log('offset: ', global.offset);
