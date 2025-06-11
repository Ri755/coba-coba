"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Toko extends Model {
    static associate(models) {
      Toko.belongsTo(models.Pengguna, {
        foreignKey: "pengguna_id",
      });
      Toko.belongsToMany(models.Buku, {
        foreignKey: "toko_id",
        otherKey: "buku_id",
        through: { model: models.TokoBuku},
      });
    }
  }
  Toko.init(
    {
      toko_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      toko_nama: {
        type: DataTypes.STRING,
      },
      pengguna_id: {
        type: DataTypes.BIGINT.UNSIGNED,
      },
    },
    {
      sequelize,
      modelName: "toko",
      tableName: "toko",
      paranoid: true,
      name: {
        singular: "Toko",
        plural: "Toko",
      },
    }
  );
  return Toko;
};
