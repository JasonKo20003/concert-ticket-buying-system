import Database from 'better-sqlite3';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import { JWT_SECRET } from '$env/static/private';

const db = new Database('app.db', { verbose: console.log });

async function initializeDatabase() {
	// SQL statement to create the `posts` table if it doesn't exist
	db.exec(`
		CREATE TABLE IF NOT EXISTS users (
			id INTEGER PRIMARY KEY,
			username TEXT UNIQUE,
			password TEXT,
			email TEXT UNIQUE,
			role TEXT
		);

		CREATE TABLE IF NOT EXISTS shows (
			id INTEGER PRIMARY KEY,
			name TEXT default '',
			seatings INTEGER default '',
			start_time DATE,
			description TEXT default '',
			duration INTEGER,
			location TEXT,
			price_per_ticket REAL,
			enabled INTEGER default 0
		);

		CREATE TABLE IF NOT EXISTS tickets (
			id INTEGER PRIMARY KEY,
			user_id INTEGER,
			show_id INTEGER,
			seat_number TEXT,
			purchase_time TEXT,
			FOREIGN KEY(user_id) REFERENCES users(id),
			FOREIGN KEY(show_id) REFERENCES shows(id),
			UNIQUE(show_id, seat_number)
		);
	`);

	// Check if the admin user already exists to prevent duplicate entries
	const adminExists = db.prepare('SELECT 1 FROM users WHERE username = ?').get('admin');
	if (!adminExists) {
		// Hash the admin password
		const hashedPassword = await bcrypt.hash('admin', 10);

		// Insert the admin user into the database
		db.prepare(`INSERT INTO users (username, password, email, role) VALUES (?, ?, ?, ?)`).run(
			'admin',
			hashedPassword,
			'admin@tickethub.com',
			'admin'
		);
	}
}

initializeDatabase();

async function registerUser(username, password, email, role = 'user') {
	const hashedPassword = await bcrypt.hash(password, 10);
	try {
		const stmt = db.prepare(
			`INSERT INTO users (username, password, email, role) VALUES (?, ?, ?, ?)`
		);
		const result = stmt.run(username, hashedPassword, email, role);
		return { userId: result.lastInsertRowid };
	} catch (error) {
		throw new Error('Could not create user. The username/email might be already taken.');
	}
}

async function loginUser(username, password) {
	try {
		const stmt = db.prepare(`SELECT * FROM users WHERE username = ?`);
		const user = stmt.get(username);

		if (!user) {
			throw new Error('Invalid credentials.');
		}

		const passwordIsValid = await bcrypt.compare(password, user.password);
		if (!passwordIsValid) {
			throw new Error('Invalid credentials.');
		}

		// Assuming JWT_SECRET is defined somewhere
		const token = jwt.sign({ id: user.id, role: user.role, email: user.email }, JWT_SECRET, {
			expiresIn: 86400
		});
		return { auth: true, token };
	} catch (error) {
		throw error;
	}
}

function createShow(name, seatings, start_time, description, duration, location, price_per_ticket) {
	try {
		const stmt = db.prepare(
			`INSERT INTO shows (name, seatings, start_time, description, duration, location, price_per_ticket) VALUES (?, ?, ?, ?, ?, ?, ?)`
		);
		const result = stmt.run(
			name,
			seatings,
			start_time,
			description,
			duration,
			location,
			price_per_ticket
		);
		return result.lastInsertRowid;
	} catch (error) {
		throw new Error('Error creating show.');
	}
}

function getShowDetails(showId) {
	try {
		const stmt = db.prepare(`SELECT * FROM shows WHERE id = ?`);
		const show = stmt.get(showId);
		if (!show) {
			throw new Error('Show not found.');
		}
		return show;
	} catch (error) {
		throw new Error('Error fetching show details: ' + error.message);
	}
}

function updateShow(
	showId,
	name = null,
	seatings = null,
	start_time = null,
	description = null,
	duration = null,
	location = null,
	price_per_ticket = null,
	enabled = null // Added parameter for enabling/disabling a show
) {
	// Use COALESCE for each parameter to keep existing values if arguments are null
	const stmt = db.prepare(`
        UPDATE shows 
        SET 
            name = COALESCE(?, name), 
            seatings = COALESCE(?, seatings), 
            start_time = COALESCE(?, start_time), 
            description = COALESCE(?, description), 
            duration = COALESCE(?, duration), 
            location = COALESCE(?, location), 
            price_per_ticket = COALESCE(?, price_per_ticket),
            enabled = COALESCE(?, enabled)
        WHERE id = ?
    `);
	const result = stmt.run(
		name,
		seatings,
		start_time,
		description,
		duration,
		location,
		price_per_ticket,
		enabled,
		showId
	);
	if (result.changes === 0) {
		throw new Error('Show not found.');
	}
	return true;
}

function deleteShow(showId) {
	// Start a transaction to ensure atomic operations
	const transaction = db.transaction(() => {
		// First, delete tickets associated with the show
		const deleteTicketsStmt = db.prepare(`DELETE FROM tickets WHERE show_id = ?`);
		deleteTicketsStmt.run(showId);

		// Then, delete the show itself
		const deleteShowStmt = db.prepare(`DELETE FROM shows WHERE id = ?`);
		const result = deleteShowStmt.run(showId);

		if (result.changes === 0) {
			throw new Error('Show not found or already deleted.');
		}
	});

	try {
		transaction(); // Execute the transaction
		return true;
	} catch (error) {
		throw new Error('Error deleting show: ' + error.message);
	}
}

function listAllShows(limit = 10, offset = 0) {
	const stmt = db.prepare(`SELECT * FROM shows ORDER BY id DESC LIMIT ? OFFSET ?`);
	const shows = stmt.all(limit, offset);
	const totalStmt = db.prepare(`SELECT COUNT(id) AS total FROM shows`);
	const total = totalStmt.get().total;
	return { shows, total };
}

function listEnabledShows(limit = 10, offset = 0) {
	const stmt = db.prepare(
		`SELECT * FROM shows WHERE enabled = 1 ORDER BY id DESC LIMIT ? OFFSET ?`
	);
	const shows = stmt.all(limit, offset);
	const totalStmt = db.prepare(`SELECT COUNT(id) AS total FROM shows WHERE enabled = 1`);
	const total = totalStmt.get().total;
	return { shows, total };
}

function getAvailableSeats(showId) {
	// Assuming there is a predefined total seat layout
	const allSeats = generateAllSeats(); // A function that generates all seat IDs, e.g., A1, A2, ..., F10

	// Get the list of bought seats for the show
	const boughtSeatsStmt = db.prepare(`SELECT seat_number FROM tickets WHERE show_id = ?`);
	const boughtSeats = boughtSeatsStmt.all(showId).map((row) => row.seat_number);

	// Determine available seats by filtering out the bought seats
	const availableSeats = allSeats.filter((seat) => !boughtSeats.includes(seat));

	return availableSeats;
}

// Utility function to generate all seat IDs
function generateAllSeats(rows = ['A', 'B', 'C', 'D', 'E', 'F'], seatsPerRow = 10) {
	const allSeats = [];
	rows.forEach((row) => {
		for (let seat = 1; seat <= seatsPerRow; seat++) {
			allSeats.push(`${row}${seat}`);
		}
	});
	return allSeats;
}

async function buyTicket(userId, showId, seatId) {
	// Start a transaction to ensure atomic operations
	const transaction = db.transaction(() => {
		// Check if the seat is already taken
		const seatCheckStmt = db.prepare(`SELECT 1 FROM tickets WHERE show_id = ? AND seat_number = ?`);
		const seatTaken = seatCheckStmt.get(showId, seatId);
		if (seatTaken) {
			throw new Error('Seat already taken');
		}

		// Insert the new ticket
		const insertTicketStmt = db.prepare(
			`INSERT INTO tickets (user_id, show_id, seat_number, purchase_time) VALUES (?, ?, ?, datetime('now'))`
		);
		const result = insertTicketStmt.run(userId, showId, seatId);

		return result.lastInsertRowid;
	});

	try {
		const ticketId = transaction();
		return {
			ticketId,
			message: 'Ticket purchased successfully!'
		};
	} catch (error) {
		throw new Error('Error purchasing ticket: ' + error.message);
	}
}

function cancelTicket(showId, seatId) {
	const stmt = db.prepare(`DELETE FROM tickets WHERE show_id = ? and seat_number = ?`);
	const result = stmt.run(showId, seatId);
	if (result.changes === 0) {
		throw new Error('Ticket not found.');
	}
	return true;
}

function getUserTickets(userId, limit = 10, offset = 0) {
	try {
		const ticketsStmt = db.prepare(`
			SELECT t.*, s.name AS show_name, s.start_time, s.location
			FROM tickets t
			JOIN shows s ON t.show_id = s.id
			WHERE t.user_id = ?
			ORDER BY s.start_time DESC
			LIMIT ? OFFSET ?
        `);
		const tickets = ticketsStmt.all(userId, limit, offset);

		const countStmt = db.prepare(`
            SELECT COUNT(*) AS total
            FROM tickets
            WHERE user_id = ?
        `);
		const totalResult = countStmt.get(userId);

		return {
			tickets,
			total: totalResult.total
		};
	} catch (error) {
		throw new Error('Error fetching tickets: ' + error.message);
	}
}

export {
	registerUser,
	loginUser,
	createShow,
	deleteShow,
	getShowDetails,
	updateShow,
	listAllShows,
	listEnabledShows,
	getAvailableSeats,
	buyTicket,
	cancelTicket,
	getUserTickets
};
