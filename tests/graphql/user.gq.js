// tests/graphql/user.gq.js

module.exports = {
  REGISTER_USER: `
    mutation RegisterUser($input: RegisterInput!) {
      register(input: $input) {
        token
        user {
          id
          email
          name
          role
        }
      }
    }
  `,

  LOGIN_USER: `
    mutation LoginUser($email: String!, $password: String!) {
      login(email: $email, password: $password) {
        token
        user {
          id
          email
          name
        }
      }
    }
  `,

  GET_ME: `
    query GetCurrentUser {
      me {
        id
        email
        name
        role
      }
    }
  `,

  GET_USERS: `
    query GetUsers {
      users {
        id
        email
        name
        role
      }
    }
  `
};
