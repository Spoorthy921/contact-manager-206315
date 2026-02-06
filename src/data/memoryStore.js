const EMAIL_RE =
  // pragmatic email check (not exhaustive, but good enough for basic validation)
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// In-memory store (module-scoped; resets when process restarts)
const contacts = new Map();
let nextId = 1;

function makeError(status, code, message) {
  const err = new Error(message);
  err.status = status;
  err.code = code;
  return err;
}

function assertValidEmail(email) {
  if (typeof email !== "string" || email.trim() === "" || !EMAIL_RE.test(email.trim())) {
    throw makeError(400, "VALIDATION_ERROR", "Invalid email.");
  }
}

function assertValidName(name) {
  if (typeof name !== "string" || name.trim() === "") {
    throw makeError(400, "VALIDATION_ERROR", "Name is required.");
  }
}

function normalizeContact(contact) {
  return {
    id: String(contact.id),
    name: contact.name,
    email: contact.email,
    phone: contact.phone ?? null,
    createdAt: contact.createdAt,
    updatedAt: contact.updatedAt,
  };
}

// PUBLIC_INTERFACE
function listContacts() {
  /** List all contacts (in insertion order). */
  return Array.from(contacts.values()).map(normalizeContact);
}

// PUBLIC_INTERFACE
function getContactById(id) {
  /** Get a single contact by ID; returns null if not found. */
  const key = String(id);
  const contact = contacts.get(key);
  return contact ? normalizeContact(contact) : null;
}

// PUBLIC_INTERFACE
function createContact(input) {
  /** Create a new contact. Requires {name, email}. */
  if (input == null || typeof input !== "object") {
    throw makeError(400, "VALIDATION_ERROR", "Body must be a JSON object.");
  }

  const name = input.name;
  const email = input.email;
  const phone = input.phone;

  assertValidName(name);
  assertValidEmail(email);

  const id = String(nextId++);
  const now = new Date().toISOString();

  const record = {
    id,
    name: String(name).trim(),
    email: String(email).trim(),
    phone: phone == null ? null : String(phone).trim(),
    createdAt: now,
    updatedAt: now,
  };

  contacts.set(id, record);
  return normalizeContact(record);
}

// PUBLIC_INTERFACE
function updateContact(id, patch) {
  /** Partially update a contact by ID. Validates email if present. */
  const key = String(id);
  const existing = contacts.get(key);
  if (!existing) {
    throw makeError(404, "NOT_FOUND", `Contact not found: ${key}`);
  }

  if (patch == null || typeof patch !== "object") {
    throw makeError(400, "VALIDATION_ERROR", "Body must be a JSON object.");
  }

  if (Object.prototype.hasOwnProperty.call(patch, "email")) {
    if (patch.email != null) {
      assertValidEmail(patch.email);
    } else {
      throw makeError(400, "VALIDATION_ERROR", "Email cannot be null.");
    }
  }

  if (Object.prototype.hasOwnProperty.call(patch, "name")) {
    if (patch.name != null) {
      assertValidName(patch.name);
    } else {
      throw makeError(400, "VALIDATION_ERROR", "Name cannot be null.");
    }
  }

  const updated = { ...existing };
  if (Object.prototype.hasOwnProperty.call(patch, "name")) {
    updated.name = String(patch.name).trim();
  }
  if (Object.prototype.hasOwnProperty.call(patch, "email")) {
    updated.email = String(patch.email).trim();
  }
  if (Object.prototype.hasOwnProperty.call(patch, "phone")) {
    updated.phone = patch.phone == null ? null : String(patch.phone).trim();
  }

  updated.updatedAt = new Date().toISOString();
  contacts.set(key, updated);

  return normalizeContact(updated);
}

// PUBLIC_INTERFACE
function deleteContact(id) {
  /** Delete a contact by ID; returns true if removed, false if not found. */
  const key = String(id);
  return contacts.delete(key);
}

// PUBLIC_INTERFACE
function seedContacts() {
  /** Seed the store with a couple of sample contacts (idempotent-ish). */
  // Avoid duplicating seeds if called multiple times
  if (contacts.size > 0) {
    return listContacts();
  }

  createContact({ name: "Ada Lovelace", email: "ada@example.com", phone: "+1-555-0100" });
  createContact({ name: "Grace Hopper", email: "grace@example.com", phone: "+1-555-0101" });

  return listContacts();
}

module.exports = {
  listContacts,
  getContactById,
  createContact,
  updateContact,
  deleteContact,
  seedContacts,
};
