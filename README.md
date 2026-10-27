# Hospital Appointment API

A TypeScript CRUD module for patients, doctors, and hospital appointments, using Prisma 7 and PostgreSQL. The Prisma models use clean PascalCase/camelCase names mapped to the existing snake_case database schema.

## Requirements

- Node.js 20 or later
- PostgreSQL
- A local database named `hospital_api`

## Setup

```sh
npm install
cp .env.example .env
# Edit .env and set DATABASE_URL for your PostgreSQL instance.
createdb hospital_api
psql -d hospital_api -f prisma/bootstrap.sql
npx prisma generate
```

The repository includes the cleaned schema. To reproduce the lesson's introspection step, run `npx prisma db pull` against the bootstrapped database **before** replacing the generated schema with the cleaned version in `prisma/schema.prisma`; `db pull` rewrites that file.

## Seed and test

```sh
npm run db:seed
npm run test:crud
npm run typecheck
```

The development seed replaces existing rows in the three fixture tables. The CRUD test creates temporary records, verifies the doctor delete restriction and patient cascade, and cleans up its test records. Do not run the seed against data you need to keep.

## CRUD surface

- `src/patients.ts`: create, get, search, update phone, and delete patients.
- `src/doctors.ts`: create, get, filter by specialty, and delete doctors. A doctor with appointments cannot be deleted until those appointments are removed.
- `src/appointments.ts`: connect a patient and doctor when booking, fetch nested relation data, list upcoming appointments, update/cancel statuses, and delete appointments.

`prisma.config.ts` configures the schema, PostgreSQL URL, and Prisma 7 seed command. `.env` and generated Prisma client files are excluded from Git.
