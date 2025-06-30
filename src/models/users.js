const { DataTypes, Sequelize } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('users', {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      defaultValue: Sequelize.fn('newid'), // Use Sequelize.fn to call the newid() function
      primaryKey: true, // If keyId is intended to be a primary key
      unique: true // Ensure uniqueness
    },
    idNumber: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      unique: true // Ensure uniqueness
    },
    createDate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.Sequelize.fn('getutcdate')
    },
    idUserCreate: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    updateDate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.Sequelize.fn('getutcdate')
    },
    idUserUpdate: {
      type: DataTypes.BIGINT,
      allowNull: false,
      defaultValue: 0
    },
    firstName: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    lastName: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: {
        args: true,
        msg: 'email must be unique'
      }
    },
    mobile: {
      type: DataTypes.STRING(14)  // (xxx) xxx-xxxx is 14 characters
    },
    password: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    forgotPassword: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    accessLevel: {
      type: DataTypes.INTEGER,
      allowNull: false
      // 1=admin 2=manager 3=supervisor 4=staff
    },
    accessName: {
      type: DataTypes.STRING(25),
      allowNull: false
    },
    active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
  }, {
    sequelize,
    tableName: 'users',
    schema: 'dbo',
    timestamps: false
  });
};
