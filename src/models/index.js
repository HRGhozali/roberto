// to SetIdentity always increse by 1
// ALTER DATABASE SCOPED CONFIGURATION SET IDENTITY_CACHE = OFF

const fs = require('fs');
const path = require('path');
const { Sequelize } = require('sequelize');
const basename = path.basename(__filename);

const db = {};
let sequelize = Sequelize;
if (global.isDev == true) {
  console.log('====================');
  console.log('Development Database');
  console.log('====================');
  const conf = {
    host: 'localhost',
    port: 1433,
    dialect: 'mssql',
    logging: false,
    pool: {
      max: 5,
      min: 0,
      idle: 10000,
    },
  };
  sequelize = new Sequelize(process.env.GDATA, 'rey', 'Abc123456', conf);
} else {
  //for production
  const conf = {
    host: process.env.GHOST,
    port: process.env.GPORT,
    dialect: 'mssql',
    logging: false,
    pool: {
      max: 5,
      min: 0,
      idle: 10000,
    },
  };
  sequelize = new Sequelize(
    process.env.GDATA,
    process.env.GUSER,
    process.env.GPASS,
    conf
  );
}

fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js'
    );
  })
  .forEach((file) => {
    // console.log('file=' + file);
    const model = require('./' + file)(sequelize);
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// db.sequelize = sequelize;
db.dbo = sequelize;
db.Sequelize = Sequelize;

async function syncTables(xforce) {
  db.dbo
    .sync({ force: xforce })
    .then(() => {
      console.log('*sync tables');
      // if (xforce) {      
      //   console.log('*seed tables');
      // db['users'].create({ idUserCreate: 1, idUserUpdate: 0, name: 'Rey Gonzxali', firstName:'Rey', lastName: 'Gonzali', email: 'rey@gmail.com', password: '123456', accessLevel: 1, accessName: 'Admin', mobile: '(123) 123-1234' });      
      // }
    })
    .catch((error) => {
      console.log('error: sync tables', error);
    });
}

module.exports = (xforce) => {
  db.dbo
    .authenticate()
    .then(() => {
      console.log('Connection has been established successfully.');
      syncTables(xforce);
    })
    .catch((error) => {
      console.log('Unable to connect to the database:', error);
    });
  return db;
};
