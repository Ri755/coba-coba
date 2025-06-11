"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ApiTierList extends Model {
    static associate(models) {}
  }
  ApiTierList.init(
    {
      api_tier: {
        type: DataTypes.STRING,
        primaryKey: true,
        autoIncrement: false,
      },
      api_limit: {
        type: DataTypes.INTEGER,
      },
      api_quota: {
        type: DataTypes.INTEGER,
      },
    },
    {
      sequelize,
      modelName: "ApiTierList",
      tableName: "api_tierlist",
      paranoid: true,
      name: {
        singular: "ApiTierList",
        plural: "ApiTierList",
      },
      timestamps: false,
    }
  );
  return ApiTierList;
};
