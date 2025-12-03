const validator = require("validator");
const sanitizeHtml = require("sanitize-html");
const mongoose = require('mongoose');


// Block SQL injection patterns like: ' OR 1=1 --
const sqlInjectionRegex = /('|--|;|\/\*|\*\/)/g;

// Block NoSQL injection payloads
const noSqlOperators = ['$ne', '$gt', '$gte', '$lt', '$lte', '$where', '$regex'];

function containsNoSqlOperators(input) {
  if (typeof input !== "string") return false;
  return noSqlOperators.some(op => input.includes(op));
}

function sanitizeInput(input) {
  if (typeof input !== "string") return input;

  let sanitized = sanitizeHtml(input, { allowedTags: [], allowedAttributes: {} });
  sanitized = sanitized.replace(sqlInjectionRegex, "");

  if (containsNoSqlOperators(sanitized)) {
    throw new Error("Invalid characters detected");
  }

  return sanitized.trim();
}

function validateRegisterInput(email, password, name){
  if (!email || !password || !name) throw new Error("All fields are required");

  // Sanitize inputs
  email = sanitizeInput(email);
  password = sanitizeInput(password);
  name = sanitizeInput(name);

  // Email validation
  if (!validator.isEmail(email)) {
    throw new Error("Invalid email format");
  }

  // Password policy
  if (!validator.isLength(password, { min: 6 })) {
    throw new Error("Password must be at least 6 characters");
  }

  // Name validation
  if (!validator.isLength(name, { min: 2 })) {
    throw new Error("Name must be at least 2 characters");
  }

  return { email, password, name };
};

function validateLoginInput(email, password){
  if (!email || !password) throw new Error("Email & Password are required");

  email = sanitizeInput(email);
  password = sanitizeInput(password);

  if (!validator.isEmail(email)) {
    throw new Error("Invalid email format");
  }

  return { email, password };
};

function validateObjectId(id, field = 'ID') {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error(`${field} is invalid`);
  }
  return id;
}

function validateTitle(title) {
  if (!title || typeof title !== 'string') {
    throw new Error("Title is required and must be a string");
  }
  if (title.length < 3) {
    throw new Error("Title must be at least 3 characters long");
  }
  return title;
}

function validateDescription(description) {
  if (description && typeof description !== 'string') {
    throw new Error("Description must be a string");
  }
  return description;
}

const VALID_STATUSES = ["PENDING", "IN_PROGRESS", "COMPLETED"];

function validateStatus(status) {
  if (!status || typeof status !== 'string') {
    throw new Error("Status is required and must be a string");
  }
  if (!VALID_STATUSES.includes(status)) {
    throw new Error("Invalid task status");
  }

  return status;
}

function validateTaskInput(input) {
  if (!input) throw new Error("Task input is required");

  if ("title" in input) validateTitle(input.title);
  if ("description" in input) validateDescription(input.description);

  if (input.assignedTo) {
    validateObjectId(input.assignedTo, "assignedTo");
  }

  return input;
}

module.exports = {
  validateRegisterInput,
  validateLoginInput,
  validateObjectId,
  validateTitle,
  validateDescription,
  validateStatus,
  validateTaskInput,
  VALID_STATUSES
};


