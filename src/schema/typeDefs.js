const { gql } = require('apollo-server');

module.exports = gql`
  enum Role { USER ADMIN }
  enum TaskStatus { TODO IN_PROGRESS DONE }

  type User {
    id: ID!
    email: String!
    name: String
    role: Role!
    createdAt: String
  }

  type Task {
    id: ID!
    title: String!
    description: String
    status: TaskStatus!
    owner: User!
    assignedTo: User
    createdAt: String
    updatedAt: String
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  input RegisterInput {
    email: String!
    password: String!
    name: String
  }

  input TaskInput {
    title: String!
    description: String
    assignedTo: ID
  }

  type Query {
    me: User
    users: [User!]!            # admin only
    tasks(status: TaskStatus, assignedTo: ID): [Task!]!
    task(id: ID!): Task
  }

  type Mutation {
    register(input: RegisterInput!): AuthPayload!
    login(email: String!, password: String!): AuthPayload!

    createTask(input: TaskInput!): Task!
    updateTask(id: ID!, input: TaskInput): Task!
    changeTaskStatus(id: ID!, status: TaskStatus!): Task!
    deleteTask(id: ID!): Boolean!

    assignTask(id: ID!, userId: ID!): Task!     # admin or owner
  }
`;
