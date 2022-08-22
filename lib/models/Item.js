const { Model, DataTypes } = require('sequelize');
const sequelize = require('../utils/sequelize');

class Item extends Model {
  static createItem(item, listId) {
    return this.create({ ...item, listId });
  }

  static async updateItem(id, item, listId) {
    const [, [updated]] = await this.update(
      { ...item, listId },
      { where: { id, listId }, returning: true }
    );

    return updated;
  }

  static deleteItem(id, listId) {
    return this.destroy({
      where: { id, listId },
      returning: true,
    });
  }
}

Item.init(
  {
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    bought: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    qty: {
      type: DataTypes.INTEGER,
      validate: {
        min: {
          args: [0],
          msg: 'Quantity (qty) cannot be less than 0',
        },
      },
    },
  },
  { sequelize, modelName: 'item' }
);

module.exports = Item;

