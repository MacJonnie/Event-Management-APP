import pool from '../db.js';

// CREATE EVENT
const createEvent = async (req, res) => {
  try {
    const { title, description, date, location, total_seats } = req.body;

    // Prevent duplicates
    const existing = await pool.query(
      `SELECT * FROM events WHERE title = $1 AND description = $2`,
      [title, description]
    );

    if (existing.rows.length > 0) {
      return res.status(400).json({ message: 'Event already exists' });
    }

    const result = await pool.query(
      `INSERT INTO events 
       (title, description, date, location, total_seats, available_seats, created_by)
       VALUES ($1, $2, $3, $4, $5, $5, $6)
       RETURNING *`,
      [title, description, date, location, total_seats, req.user.id]
    );

    res.status(201).json({
      message: 'Event created successfully',
      event: result.rows[0]
    });
  } catch (error) {
    console.error('Create event error:', error);
    res.status(500).json({ message: 'Could not create event' });
  }
};

// GET ALL EVENTS
const getAllEvents = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT events.*, users.email AS creator_email
       FROM events
       JOIN users ON events.created_by = users.id`
    );

    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Fetch events failed:', error);
    res.status(500).json({ message: 'Could not fetch events' });
  }
};

// GET EVENT BY ID
const getEventById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      `SELECT * FROM events WHERE id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching event', error: error.message });
  }
};

// UPDATE EVENT
const updateEvent = async (req, res) => {
  try {
    const { id } = req.params;

    // Confirm event ownership
    const event = await pool.query(`SELECT * FROM events WHERE id = $1`, [id]);
    if (event.rows.length === 0) return res.status(404).json({ message: 'Event not found' });

    if (event.rows[0].created_by !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized to update this event' });
    }

    await pool.query('BEGIN');

    const updates = req.body;
    const fields = Object.keys(updates);
    const values = Object.values(updates);

    const setClause = fields.map((field, i) => `${field} = $${i + 1}`).join(', ');
    values.push(id);

    const result = await pool.query(
      `UPDATE events SET ${setClause} WHERE id = $${values.length} RETURNING *`,
      values
    );

    await pool.query('COMMIT');

    res.status(200).json({ message: 'Event updated', event: result.rows[0] });
  } catch (error) {
    await pool.query('ROLLBACK');
    res.status(500).json({ message: 'Update failed', error: error.message });
  }
};

// DELETE EVENT
const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;

    const event = await pool.query(`SELECT * FROM events WHERE id = $1`, [id]);
    if (event.rows.length === 0) return res.status(404).json({ message: 'Event not found' });

    if (event.rows[0].created_by !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized to delete this event' });
    }

    await pool.query(`DELETE FROM events WHERE id = $1`, [id]);
    res.status(200).json({ message: 'Event deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Deletion failed', error: error.message });
  }
};

export { createEvent, getAllEvents, getEventById, updateEvent, deleteEvent };
