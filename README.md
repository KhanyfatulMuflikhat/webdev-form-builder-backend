# FormBuilder Backend

Backend API untuk aplikasi Form Builder, dibangun dengan Express.js, Prisma, dan PostgreSQL.

## Tech Stack

- Node.js + Express.js
- Prisma ORM
- PostgreSQL (Neon.tech)
- JWT Authentication
- bcryptjs

## Prerequisites

- Node.js v18+
- npm

## Instalasi

1. Clone repository
```bash
   git clone https://github.com/KhanyfatulMuflikhat/webdev-form-builder-backend.git
   cd webdev-form-builder-backend
```

2. Install dependencies
```bash
   npm install
```

3. Buat file `.env` dari `.env.example`
```bash
   cp .env.example .env
```
   Lalu isi `DATABASE_URL` dengan connection string PostgreSQL kamu dan `JWT_SECRET` dengan string bebas.

4. Generate Prisma client
```bash
   npx prisma generate
```

5. Jalankan migrasi database
```bash
   npx prisma migrate dev
```

6. Jalankan server
```bash
   node index.js
```

Server berjalan di `http://localhost:3000`

## API Endpoints

### Auth
- `POST /api/auth/register` - Register akun baru
- `POST /api/auth/login` - Login

### Forms (butuh Authorization header)
- `GET /api/forms` - Ambil semua form milik user
- `GET /api/forms/:id` - Ambil detail form
- `POST /api/forms` - Buat form baru
- `PUT /api/forms/:id` - Update form
- `DELETE /api/forms/:id` - Hapus form

## Environment Variables

| Variable | Keterangan |
|----------|-----------|
| DATABASE_URL | Connection string PostgreSQL |
| JWT_SECRET | Secret key untuk JWT |
| PORT | Port server (default: 3000) |
