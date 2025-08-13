const { DataTypes, Sequelize } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('projects', {
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
    nSession: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: Sequelize.literal('FLOOR(1 + RAND() * 100)')
      // Optimistic Locking Concurrency: 
      // nSession number to ensure that the data has not been modified by another transaction between when it was read and when it is written.
    },
    createDate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.Sequelize.fn('getutcdate')
    },
    idUserCreate: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    updateDate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.Sequelize.fn('getutcdate')
    },
    idUserUpdate: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING(255),
    },
    locationAddress: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    locationCity: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    locationState: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    locationCountry: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.Sequelize.fn('getutcdate')
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.Sequelize.fn('getutcdate')
    },
    maxHours: {
      type: DataTypes.INTEGER,
      allowNull: false,
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
