-- ✅ users.sql
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name TEXT,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role TEXT DEFAULT 'USER' CHECK (role IN ('USER', 'CREATOR')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
);

-- ✅ events.sql
CREATE TABLE IF NOT EXISTS events (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  date TIMESTAMP,
  location TEXT,
  total_seats INTEGER CHECK (total_seats >= 0),
  available_seats INTEGER CHECK (available_seats >= 0),
  created_by INTEGER REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
);

-- ✅ bookings.sql
CREATE TABLE IF NOT EXISTS bookings (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  event_id INTEGER REFERENCES events(id) ON DELETE CASCADE,
  seats_booked INTEGER CHECK (seats_booked > 0),
  status TEXT DEFAULT 'CONFIRMED' CHECK (status IN ('CONFIRMED', 'CANCELED')),
  payment_status TEXT DEFAULT 'PENDING' CHECK (payment_status IN ('PENDING', 'PAID')),
  booking_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
);
