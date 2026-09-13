const { query } = require('../../config/db');

const listCategories = async (req, res, next) => {
  try {
    const { rows } = await query(
      `SELECT * FROM categories ORDER BY sort_order, name`
    );
    res.json({ categories: rows });
  } catch (err) { next(err); }
};

const createCategory = async (req, res, next) => {
  try {
    const { name, name_bn, slug, sort_order } = req.body;
    if (!name || !slug) return res.status(400).json({ error: 'name and slug are required' });

    const { rows } = await query(
      `INSERT INTO categories (name, name_bn, slug, sort_order)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [name, name_bn || null, slug, sort_order || 0]
    );
    res.status(201).json({ category: rows[0] });
  } catch (err) { next(err); }
};

const updateCategory = async (req, res, next) => {
  try {
    const { name, name_bn, sort_order, is_active } = req.body;
    const { rows } = await query(
      `UPDATE categories SET
         name = COALESCE($1, name),
         name_bn = COALESCE($2, name_bn),
         sort_order = COALESCE($3, sort_order),
         is_active = COALESCE($4, is_active),
         updated_at = NOW()
       WHERE id = $5 RETURNING *`,
      [name, name_bn, sort_order, is_active, req.params.id]
    );
    if (!rows.length) return res.status(404).json({ error: 'Category not found' });
    res.json({ category: rows[0] });
  } catch (err) { next(err); }
};

const deleteCategory = async (req, res, next) => {
  try {
    // Soft delete — check if products exist
    const { rows: prods } = await query(
      `SELECT COUNT(*) FROM products WHERE category_id = $1`,
      [req.params.id]
    );
    if (parseInt(prods[0].count) > 0) {
      return res.status(409).json({ error: 'Category has products — deactivate instead of delete' });
    }
    await query('DELETE FROM categories WHERE id = $1', [req.params.id]);
    res.json({ message: 'Category deleted' });
  } catch (err) { next(err); }
};

module.exports = { listCategories, createCategory, updateCategory, deleteCategory };
