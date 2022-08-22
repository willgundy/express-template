const { Model, DataTypes } = require('sequelize');
const Item = require('./Item.js');
const sequelize = require('../utils/sequelize');

class List extends Model {
  static includes = [
    Item,
    {
      association: 'user',
      attributes: ['id', 'email', 'avatar'],
    },
  ];

  static findAllForUser(userId) {
    return this.findAll({
      include: Item,
      where: { userId },
      order: [['createdAt', 'DESC']],
    });
  }

  static findOneOfUser(id, userId) {
    return this.findOne({
      include: this.includes,
      where: { id, userId },
    });
  }

  static async createForUser(item, userId) {
    return await this.create({ ...item, userId, items: [] }, { include: Item });
  }

  static async updateForUser(id, item, userId) {
    const [, [updated]] = await this.update(
      { ...item, userId },
      {
        where: { id, userId },
        returning: true,
      }
    );

    return updated;
  }

  static destroyForUser(id, userId) {
    return this.destroy({
      where: { id, userId },
      returning: true,
    });
  }
}

List.init(
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    notes: DataTypes.STRING,
    priority: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 3,
      validate: {
        min: {
          args: 1,
          msg: 'Priority must be between 1-5',
        },
        max: {
          args: 5,
          msg: 'Priority must be between 1-5',
        },
      },
    },
  },
  { sequelize, modelName: 'list' }
);

List.hasMany(Item);
Item.belongsTo(List);

module.exports = List;

