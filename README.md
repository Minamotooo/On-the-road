<div align="center">

# 🛣️ On the Road

### Discover, stay and dine across Bangladesh: all in one place.

A full-stack travel platform for exploring tourist spots, booking hotel rooms and finding restaurants in every division of Bangladesh.

![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![Bootstrap](https://img.shields.io/badge/Bootstrap-5-7952B3?style=for-the-badge&logo=bootstrap&logoColor=white)

<br/>

<img src="screenshots/homepage.png" alt="On the Road home page" width="90%"/>

</div>

---

## ✨ Features

### 🧳 For Travellers
- **Explore tourist spots** by division, with photos, descriptions and nearby spots
- **Read and write reviews** for tourist spots and hotels
- **Search hotels**, view room details and **send booking requests**
- **Find restaurants** with a dedicated search
- **Personal dashboard** to manage your profile and bookings
- **Home page** that highlights the top-reviewed tourist spots and hotels

### 🏨 For Hotel Owners
- Register a hotel with its full location (Division → District → Upazilla → Union)
- Add and edit rooms
- **Approve or reject booking requests** and track pending and approved bookings
- Edit the hotel profile

### 🍽️ For Restaurant Owners
- Sign up as a business and manage the restaurant from a dashboard

### 🛡️ For Admins
- Analytics dashboard with **revenue charts** (ApexCharts / MUI X Charts)
- **Activity log table**
- Manage **suspicious users**, and view and restore **deleted users**
- Add new tourist spots

### 🗄️ Database Highlights
The PostgreSQL backend does much of its work inside the database ([`database/03_plsql.sql`](database/03_plsql.sql)):
- `update_average_ratings` / `update_average_hotel_ratings`: recompute ratings for the home page's *Top Reviewed* rows
- `trg_booking_room_stock`: approving a booking takes rooms out of stock; finishing a stay puts them back
- `check_and_update_payment_completion_status`: closes stays whose check-out date has passed
- `calculate_monthly_revenue`: the admin's 5% commission chart
- `find_spots_under_division` / `find_neighboring_spots`: division pages and "More around…" suggestions
- `flag_if_suspicious` + `remove_user_from_sus_list`: travellers with 3 denied bookings or 3 one-star reviews get flagged for the admin
- `trg_archive_deleted_client`: deleted accounts are archived so the admin can restore them
- Every procedure writes to `log_table`, shown on the admin dashboard

---

## 🧰 Tech Stack

| Layer      | Technologies |
|------------|--------------|
| Frontend   | React 18, Vite, React Router v6, React-Bootstrap, styled-components, MUI X Charts, ApexCharts, react-multi-carousel |
| Backend    | Node.js, Express, express-session, bcrypt, CORS |
| Database   | PostgreSQL (`pg`) |

---

## 📁 Project Structure

```
On-the-road/
├── Trip.com/            # React + Vite frontend
│   └── src/components/
│       ├── HomePage/    # Navbar, hero header, popular spots and hotels
│       ├── TouristSpot/ # Division-wise spots, details, reviews
│       ├── hotel/       # Hotel search, rooms, reservations, reviews
│       ├── hotelside/   # Hotel owner dashboard
│       ├── Restaurant/  # Restaurant search and dashboard
│       ├── Client/      # Traveller dashboard and profile
│       ├── Admin/       # Analytics, logs, user moderation
│       └── Signin&up/   # Auth for every user type
├── database/            # SQL schema, PL/pgSQL and seed data
├── backend/             # Express API
│   ├── homepage.js      # ⭐ Server entry point (port 4000)
│   ├── signInRouter.js  # /signin
│   ├── touristSpotRouter.js / touristSpotDetailsRouter
│   ├── hotelProfile.js  # /hotel
│   ├── hotelSignUpRouter.js
│   ├── restaurantRouter.js
│   ├── admin.js         # /admin
│   └── db/              # PostgreSQL connection + setup script
└── Data insertion/      # Sample hotel and tourist-spot data
```

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) 18 or newer
- [PostgreSQL](https://www.postgresql.org/) 14 or newer

### 1. Clone the repository
```bash
git clone https://github.com/Minamotooo/On-the-road.git
cd On-the-road
```

### 2. Set up the database
Make sure PostgreSQL is running, then let the backend create and fill the database:

```bash
cd backend
npm install
npm run db:setup            # creates "ontheroad" and runs database/01_schema.sql … 04_seed.sql
```

By default the backend connects to `localhost:5432` as `postgres` with the password `1`. If your PostgreSQL password is different, add it to `backend/.env`:

```
PGPASSWORD=your_password
```

`PGUSER`, `PGHOST`, `PGPORT` and `PGDATABASE` can be set there the same way. `npm run db:setup` drops and rebuilds everything, so run it again whenever you want a fresh copy of the sample data.

| File | Contents |
|---|---|
| `database/01_schema.sql` | Tables, keys and constraints |
| `database/02_locations.sql` | All 8 divisions, 64 districts, 494 upazillas and 4,540 unions of Bangladesh |
| `database/03_plsql.sql` | Procedures, functions and triggers |
| `database/04_seed.sql` | 28 tourist spots, 12 hotels, 15 restaurants, travellers, reviews and a year of bookings |

### 3. Start the backend
```bash
cd backend
npm start                   # runs on http://localhost:4000
```

### 4. Start the frontend
```bash
cd Trip.com
npm install
npm run dev                 # runs on http://localhost:5173
```

Open **http://localhost:5173** in your browser. 🎉

### Demo accounts
Every sample account uses the password **`1`**.

| Role | How to log in | Username |
|---|---|---|
| Traveller | Login → Client | `traveller` (also `rafiq_h`, `nusrat.j`, `tanvir99`, …) |
| Hotel owner | Login → Business → Hotel | `seapearl` (has pending booking requests), `grandsultan`, `panpacific`, … |
| Restaurant owner | Login → Business → Restaurant | `panshi`, `hajibiryani`, `mezbanbari`, … |
| Admin | Login → Admin | `Admin` |

Photo credits are listed in [IMAGE_CREDITS.md](IMAGE_CREDITS.md).

---

## 🔌 API Overview

| Base route         | Purpose |
|--------------------|---------|
| `/signin`          | Login and sign-up for clients, hotels and restaurants; profile update and delete |
| `/touristSpot`     | Division-wise spot listings, posting comments |
| `/touristSpotInfo` | Spot details, neighbouring spots, reviews |
| `/hotel`           | Hotel search, rooms, bookings, reviews, top-reviewed lists |
| `/hotelSignUp`     | Location lookups (divisions, districts, upazillas, unions) and hotel registration |
| `/restaurant`      | Restaurant search |
| `/admin`           | Dashboard stats, revenue, logs, user moderation, adding tourist spots |

---

## 👥 Team

Built as a Level 2, Term 1 database project at **BUET** by:

- [**Minamotooo**](https://github.com/Minamotooo)
- [**Fanboyingeneral**](https://github.com/Fanboyingeneral)

---

<div align="center">

Made with ❤️ in Bangladesh 🇧🇩

</div>
