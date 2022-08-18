const pool = require('../utils/pool');

module.exports = class Item {
  id;
  user_id;
  description;
  created_at;

  constructor(row) {
    this.id = row.id;
    this.user_id = row.user_id;
    this.description = row.description;
    this.created_at = row.created_at;
  }

  static async insert({ description, user_id }) {
    const { rows } = await pool.query(
      `
      INSERT INTO items (description, user_id)
      VALUES ($1, $2)
      RETURNING *;
    `,
      [description, user_id]
    );

    return new Item(rows[0]);
  }

  static async updateById(id, user_id, attrs) {
    const item = await Item.getById(id);
    if (!item) return null;
    const { description } = { ...item, ...attrs };
    const { rows } = await pool.query(
      `
      UPDATE items 
      SET    description=$3
      WHERE  id=$1 
      AND    user_id=$2
      RETURNING *;
    `,
      [id, user_id, description]
    );
    return new Item(rows[0]);
  }

  static async getById(id) {
    const { rows } = await pool.query(
      `
      SELECT *
      FROM   items
      WHERE  id=$1
    `,
      [id]
    );

    if (!rows[0]) {
      return null;
    }
    return new Item(rows[0]);
  }

  static async getAll(user_id) {
    const { rows } = await pool.query(
      `
      SELECT * 
      FROM  items 
      WHERE user_id = $1 
      ORDER BY created_at DESC
    `,
      [user_id]
    );
    return rows.map((item) => new Item(item));
  }

  static async delete(id) {
    const { rows } = await pool.query(
      `
      DELETE FROM items 
      WHERE id = $1 
      RETURNING *
    `,
      [id]
    );
    return new Item(rows[0]);
  }
};

