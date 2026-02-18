# 🎓 School – Student API & MCP Server

A modular **Node.js + Express** backend application that manages **schools and students** with a relational structure and exposes its capabilities via:

- REST API
- Model Context Protocol (MCP) server for AI integrations

The project uses **MongoDB Atlas (cloud database)** and follows a clean layered architecture.


## 🚀 Features

- School & Student CRUD operations
- Get all students by school
- MongoDB ObjectId based relations
- Auto-increment numeric IDs (custom counter collection)
- Centralized error handling
- MCP tool integration
- Scalable and modular folder structure

## 🧱 Tech Stack

- Node.js
- Express.js
- **MongoDB Atlas (Cloud)**
- Mongoose
- Zod
- dotenv
- express-session & passport (session infrastructure)

## ☁️ Database

This project uses **MongoDB Atlas** as a cloud-hosted database.

Advantages:

- No local database setup required
- Cloud scalability
- Secure connection via environment variables

## 📂 Project Structure
db/
├─ schemas/
│ ├─ schoolSchema.mjs
│ ├─ studentSchema.mjs
│ └─ counterSchema.mjs

links/
├─ controller/
├─ routes/

utils/
server.mjs
mcp-server.mjs


[YOUTUBE VIDEO](https://youtu.be/ukBfxPz8iNk)



## ⚙️ Environment Variables

Create a `.env` file:

```env
PORT=3000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_secret
API_BASE_URL=http://localhost:3000
```

npm install
node server.mjs
node mcp-server.mjs


MCP Tools
Available tools:

add-school
get-school
get-all-schools
delete-school
add-student
get-student
get-students-by-school

These tools allow LLM-based systems to interact with the API in a structured way.


