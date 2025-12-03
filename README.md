# Task Manager API (Apollo Server + GraphQL + MongoDB)

A fully functional **Task Management API** built using:

- Apollo Server (GraphQL)
- Node.js
- MongoDB (Mongoose)
- JWT Authentication
- Role-based Access (USER & ADMIN)

This API allows users to register, login, and manage tasks. Admin users have elevated access across all tasks.

### User
- Register / Login
- Create personal tasks
- View own tasks
- Update own tasks
- Delete own tasks

### Admin
- All user features
- View all tasks
- Update/delete any task
- Assign tasks to any user

### Project Structure

```text
src/
├── config/
│   └── db.js
├── models/
│   ├── User.js
│   └── Task.js
├── schema/
│   ├── typeDefs.js
│   ├── resolvers/
│   │   ├── userQueries.js
│   │   ├── userMutations.js
│   │   ├── taskQueries.js
│   │   ├── taskMutations.js
│   │   └── index.js
├── utils/
│   ├── auth.js
│   └── generateToken.js
├── seeds/
│   └── createAdmin.js
└── server.js


### Clone the project

### Install dependencies

 - npm install

### Environment Variables

- PORT=4000
- MONGO_URI=mongodb://localhost:27017/taskmanager
- JWT_SECRET=your_secret_key
- TOKEN_EXPIRY=7d
- ADMIN_EMAIL=admin@example.com
- ADMIN_PASSWORD=admin123

### Run the Server

- npm start

### Running Tests

- Running Tests

### Test Environment

- .env.test

