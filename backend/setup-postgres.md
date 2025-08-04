# PostgreSQL Migration Setup Guide

## 1. Set up Supabase Database

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Get your database connection string from the Settings > Database section
3. The connection string should look like:
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres
   ```

## 2. Configure Environment Variables

Create a `.env` file in the backend directory with:

```env
# Database
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres"

# JWT
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"

# Server
PORT=5000
NODE_ENV=development

# CORS
CORS_ORIGIN="http://localhost:3000"
```

## 3. Generate Prisma Client

Run these commands in the backend directory:

```bash
# Generate Prisma client
npx prisma generate

# Create and apply database migrations
npx prisma migrate dev --name init

# (Optional) View your database in Prisma Studio
npx prisma studio
```

## 4. Update Controllers

The controllers need to be updated to use the new services instead of Mongoose models. The main changes are:

- Replace Mongoose model imports with service imports
- Update method calls to use the new service methods
- Remove Mongoose-specific code (like `.toObject()`)

## 5. Test the Migration

1. Start the backend server: `npm run dev`
2. Test the API endpoints
3. Verify data is being stored in Supabase

## 6. Remove MongoDB Dependencies

After confirming everything works:

```bash
npm uninstall mongoose
```

## Key Differences from MongoDB

- **IDs**: Using CUID instead of MongoDB ObjectId
- **Relations**: Proper foreign key relationships instead of references
- **Queries**: Prisma's type-safe query builder instead of Mongoose
- **Transactions**: Better support for database transactions
- **Migrations**: Version-controlled database schema changes 