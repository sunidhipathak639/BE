# Backend Setup for TeamTasker

## Prerequisites

Before you begin, ensure that you have the following installed:
- [Node.js](https://nodejs.org/) (v14 or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [PostgreSQL](https://www.postgresql.org/) (or use a cloud database service)
- [Prisma](https://www.prisma.io/) ORM and Client

## Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-repository.git
   cd your-repository/BE
Install the required dependencies:
npm install
Setting up the Database
Follow these steps to set up and initialize the database with Prisma.

1. Reset the Database
To reset the database and apply any migrations, run the following command. This will drop the database schema and reapply migrations.
npx prisma migrate reset
Warning: This command will delete all data in the database.

You will be prompted to confirm the reset. Type yes to proceed.

2. Apply Migrations
If there are any new migrations, or you need to apply the migrations to your freshly reset database, run:
npx prisma migrate dev --name initial_migration
This will:

Apply any migrations in the prisma/migrations/ folder to the database.

Update the database schema to match the Prisma schema in schema.prisma.

Generate the Prisma client.

3. Verify Database Schema
After applying migrations, you can check the status of your database schema:
npx prisma migrate status
This command will tell you if your database schema is up to date with your Prisma schema.

4. Generate Prisma Client
After migrations are applied, ensure that the Prisma Client is generated:
npx prisma generate
This will regenerate the Prisma Client based on your updated schema.

Creating the Admin User
After resetting and applying migrations, you can create the default Admin user if it doesn't already exist in the database. The Admin user will have the email admin@sunidhi.com and the password password.

Run the Script to Create Admin User
Create the Admin user by running the following script:
npx ts-node createAdmin.ts
This script will:

Check if the Admin user (admin@sunidhi.com) already exists.

If not, it will create the Admin user with the default password (password).

If the user already exists, it will log that the Admin user is already created.

Common Prisma Commands
Here are some other commonly used Prisma commands:

Generate Prisma Client:
npx prisma generate
Check Prisma Status:
npx prisma migrate status
Prisma Studio (Database UI):
npx prisma studio
Running the Backend Server
Once the database is set up, you can start the backend server:
npm run dev
This will start the Express server on the configured port (usually http://localhost:5000).

API Endpoints
Authentication:
POST /register: Register a new user (returns a token and user details).

POST /login: Login as a user (returns a token and user details).

Task Management:
GET /tasks: Get all tasks (paginated).

POST /tasks: Create a new task (Admin, Project Manager).

GET /tasks/:id: Get task by ID.

PUT /tasks/:id: Update a task (Admin, Project Manager).

DELETE /tasks/:id: Delete a task (Admin, Project Manager).

Project Management:
GET /projects: Get all projects.

POST /projects: Create a new project (Admin, Project Manager).

PUT /projects/:id: Update a project (Admin, Project Manager).

DELETE /projects/:id: Delete a project (Admin, Project Manager).


---

### **Explanation of Sections**:

1. **Prerequisites**: 
   - Lists the software you need installed (Node.js, npm/yarn, PostgreSQL, Prisma).

2. **Installation**: 
   - Instructions for cloning the repository and installing dependencies.

3. **Setting up the Database**: 
   - Walkthrough for resetting the database, applying migrations, and generating the Prisma client.

4. **Creating the Admin User**: 
   - Explains how to create the default Admin user (`admin@sunidhi.com`) after resetting the database and applying migrations.

5. **Common Prisma Commands**: 
   - Lists the most common Prisma commands to generate the client, check migration status, and open Prisma Studio.

6. **Running the Backend Server**: 
   - How to start the backend server (`npm run dev`).

7. **API Endpoints**: 
   - A summary of the available API endpoints for authentication, task management, and project management.

8. **Additional Information**: 
   - Link to the official Prisma documentation for further reading.

---

### Next Steps:

1. **Save** the provided content as `README.md` in the **Backend** (`BE`) directory.
2. **Share** this file with other developers or team members to ensure they follow the correct setup process.

Let me know if you need any adjustments or further assistance!
