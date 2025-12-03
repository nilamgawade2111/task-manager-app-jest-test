// tests/graphql/task.gq.js

module.exports = {
  CREATE_TASK: `
    mutation CreateTask($input: TaskInput!) {
      createTask(input: $input) {
        id
        title
        description
        status
        owner { id email }
        assignedTo { id email }
      }
    }
  `,

  UPDATE_TASK: `
    mutation UpdateTask($id: ID!, $input: TaskInput!) {
      updateTask(id: $id, input: $input) {
        id
        title
        description
        status
        owner { id }
        assignedTo { id }
      }
    }
  `,

  CHANGE_TASK_STATUS: `
    mutation ChangeTaskStatus($id: ID!, $status: String!) {
      changeTaskStatus(id: $id, status: $status) {
        id
        title
        status
      }
    }
  `,

  DELETE_TASK: `
    mutation DeleteTask($id: ID!) {
      deleteTask(id: $id)
    }
  `,

  ASSIGN_TASK: `
    mutation AssignTask($id: ID!, $userId: ID!) {
      assignTask(id: $id, userId: $userId) {
        id
        assignedTo { id email }
      }
    }
  `,

  GET_TASK: `
    query GetTask($id: ID!) {
      task(id: $id) {
        id
        title
        description
        status
        owner { id email }
        assignedTo { id email }
      }
    }
  `,

  GET_TASKS: `
    query GetTasks($status: String, $assignedTo: ID) {
      tasks(status: $status, assignedTo: $assignedTo) {
        id
        title
        status
        owner { id }
        assignedTo { id }
      }
    }
  `
};
