// tests/task.test.js

const { createTestServer, generateTestToken } = require("./test-server");
const { connect, closeDatabase, clearDatabase } = require("./test-db");

const User = require("../src/models/User");
const Task = require("../src/models/Task");
const bcrypt = require("bcryptjs");

// GQL operations
const {
  CREATE_TASK,
  UPDATE_TASK,
  DELETE_TASK,
  CHANGE_TASK_STATUS,
  ASSIGN_TASK,
  GET_TASK,
  GET_TASKS
} = require("./graphql/task.gq");

beforeAll(async () => await connect());
afterEach(async () => await clearDatabase());
afterAll(async () => await closeDatabase());

describe("Task Mutations & Queries", () => {
  let server;
  let user;
  let token;

  beforeEach(async () => {
    server = createTestServer();

    // Create test user
    const hashed = await bcrypt.hash("pass123", 10);
    user = await User.create({
      name: "TaskUser",
      email: "taskuser@example.com",
      password: hashed,
      role: "USER"
    });

    // Generate JWT for context
    token = generateTestToken(user);
  });

  // -------------------------------------------------
  it("creates a task successfully", async () => {
    const res = await server.executeOperation(
      {
        query: CREATE_TASK,
        variables: {
          input: {
            title: "My First Task",
            description: "Do something important"
          }
        }
      },
      { req: { headers: { authorization: `Bearer ${token}` } } }
    );

    expect(res.errors).toBeUndefined();
    expect(res.data.createTask.title).toBe("My First Task");

    const saved = await Task.findOne({ title: "My First Task" });
    expect(saved).not.toBeNull();
    expect(saved.owner.toString()).toBe(user._id.toString());
  });

  // -------------------------------------------------
  it("rejects invalid task title", async () => {
    const res = await server.executeOperation(
      {
        query: CREATE_TASK,
        variables: { input: { title: "", description: "Invalid test" } }
      },
      { req: { headers: { authorization: `Bearer ${token}` } } }
    );

    expect(res.errors).toBeDefined();
    expect(res.errors[0].message).toMatchInlineSnapshot(`"Title is required and must be a string"`);
  });

  // -------------------------------------------------
  it("updates a task", async () => {
    const task = await Task.create({
      title: "Old Title",
      description: "Old description",
      owner: user._id
    });

    const res = await server.executeOperation(
      {
        query: UPDATE_TASK,
        variables: {
          id: task._id.toString(),
          input: { title: "New Title" }
        }
      },
      { req: { headers: { authorization: `Bearer ${token}` } } }
    );

    expect(res.errors).toBeUndefined();
    expect(res.data.updateTask.title).toBe("New Title");
  });

  // -------------------------------------------------
  it("changes task status", async () => {
  });

  // -------------------------------------------------
  it("deletes a task", async () => {
    const task = await Task.create({
      title: "To Delete",
      description: "Test",
      owner: user._id
    });

    const res = await server.executeOperation(
      {
        query: DELETE_TASK,
        variables: { id: task._id.toString() }
      },
      { req: { headers: { authorization: `Bearer ${token}` } } }
    );

    expect(res.errors).toBeUndefined();
    expect(res.data.deleteTask).toBe(true);
  });

  // -------------------------------------------------
  it("fetches a task", async () => {
    const task = await Task.create({
      title: "Fetch Task",
      description: "Fetch test",
      owner: user._id
    });

    const res = await server.executeOperation(
      {
        query: GET_TASK,
        variables: { id: task._id.toString() }
      },
      { req: { headers: { authorization: `Bearer ${token}` } } }
    );

    expect(res.errors).toBeUndefined();
    expect(res.data.task.title).toBe("Fetch Task");
  });

  // -------------------------------------------------
  it("fetches all user tasks", async () => {
  });
});
