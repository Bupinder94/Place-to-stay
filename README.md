# PlacesToStay

A simple web application for finding and booking accommodations. Built with **Node.js**, **Express**, **TypeScript**, **SQLite**, and **Leaflet** maps.

---

## Features

- Search accommodations by **location** and **type** (hotel, bed & breakfast, hostel)
- Interactive **Leaflet map** showing accommodation locations
- User **authentication** (login/logout with session-based auth)
- **Booking system** with date and party size selection
- SQLite database with seeded sample data

---

## Tech Stack

| Layer        | Technology                          |
|--------------|-------------------------------------|
| Backend      | Node.js, Express, TypeScript        |
| Database     | SQLite3 (`sqlite` + `sqlite3`)      |
| Frontend     | HTML, CSS, Vanilla JavaScript       |
| Maps         | Leaflet.js + OpenStreetMap tiles    |
| Auth         | `express-session`, `bcrypt`         |

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+ recommended)
- npm (comes with Node.js)

### Installation

```bash
# Clone the repository
git clone https://github.com/Bupinder94/Place-to-stay.git
cd Place-to-stay

# Install dependencies
npm install

# Build the project
npm run build

# Start the server
npm start
```

The app will be running at `http://localhost:3000`.

### Development Mode

```bash
npm run dev
```

Runs the server with `ts-node` (no build step required).

---

## Project Structure

```
PlaceToStay/
├── src/                          # Server-side TypeScript source
│   ├── server.ts                 # Express app entry point
│   ├── db.ts                     # SQLite DB setup & seeding
│   ├── routes/                   # API route definitions
│   ├── controllers/              # Request handlers
│   ├── daos/                     # Data Access Objects
│   ├── middleware/               # Auth middleware
│   └── types/                    # TypeScript declarations
│
├── public/                       # Static frontend assets
│   ├── index.html                # Main HTML page
│   ├── css/style.css             # Styles
│   ├── js/main.js                # Compiled frontend JS
│   └── ts/main.ts                # Frontend TypeScript source
│
├── dist/                         # Compiled server JS (generated)
├── places.db                     # SQLite database (generated)
├── package.json
├── tsconfig.json                 # Server TS config
└── tsconfig.frontend.json        # Frontend TS config
```

---

## API Endpoints

| Method | Endpoint                              | Description                        |
|--------|---------------------------------------|------------------------------------|
| `GET`  | `/api/accommodation/location`         | Search by location                 |
| `GET`  | `/api/accommodation/type-location`    | Search by type + location          |
| `POST` | `/api/book`                           | Create a booking                   |
| `POST` | `/api/user/login`                     | User login                         |
| `POST` | `/api/user/logout`                    | User logout                        |
| `GET`  | `/api/user/session`                   | Check current session              |

---

## Sample Data

The database is automatically seeded with:

- **7 accommodations** across Southampton, London, Hampshire, Normandy, and Colorado
- **3 available dates** (June 30 – July 2, 2026) with 5 slots each
- **2 users**: `jsmith` / `password123` and `admin` / `adminpass`

---

## Authentication

- Session-based login using `express-session`
- Passwords hashed with `bcrypt` (10 salt rounds)
- Cookie max age: **24 hours**

---

## Scripts

| Script      | Command                        | Purpose                    |
|-------------|--------------------------------|----------------------------|
| `build`     | `tsc && tsc -p tsconfig.frontend.json` | Compile TS → JS      |
| `start`     | `node dist/server.js`          | Run production server      |
| `dev`       | `ts-node src/server.ts`        | Run development server     |

---

## Notes

- The SQLite database (`places.db`) and `node_modules/` are **gitignored**.
- The `dist/` folder is rebuilt via `npm run build` and should not be edited directly.
- Ensure port `3000` is free before starting the server.

---

## Author

**Bupinder94** — [bhupinder29052005@gmail.com](mailto:bhupinder29052005@gmail.com)
