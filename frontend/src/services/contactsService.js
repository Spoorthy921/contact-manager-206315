/**
 * @typedef {{ id: string, name: string, email: string, phone: string, createdAt: string, updatedAt: string }} Contact
 * @typedef {{ name: string, email: string, phone: string }} ContactInput
 *
 * @typedef {{
 *  listContacts: () => Promise<Contact[]>,
 *  getContact: (id: string) => Promise<Contact | null>,
 *  createContact: (input: ContactInput) => Promise<Contact>,
 *  updateContact: (id: string, input: ContactInput) => Promise<Contact>,
 *  deleteContact: (id: string) => Promise<void>
 * }} ContactsService
 */

function nowIso() {
  return new Date().toISOString();
}

function randomId() {
  // Good enough for in-memory demo purposes.
  return `${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

function delay(ms = 120) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function normalizeInput(input) {
  return {
    name: input.name.trim(),
    email: input.email.trim(),
    phone: input.phone.trim()
  };
}

function assertValid(input) {
  const v = normalizeInput(input);

  if (!v.name) throw new Error("Name is required.");
  if (!v.email) throw new Error("Email is required.");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email)) {
    throw new Error("Invalid email address.");
  }
  if (!v.phone) throw new Error("Phone is required.");

  return v;
}

function seedContacts() {
  const t = nowIso();
  return [
    {
      id: randomId(),
      name: "Ada Lovelace",
      email: "ada@example.com",
      phone: "+1 555 010 0001",
      createdAt: t,
      updatedAt: t
    },
    {
      id: randomId(),
      name: "Grace Hopper",
      email: "grace@example.com",
      phone: "+1 555 010 0002",
      createdAt: t,
      updatedAt: t
    },
    {
      id: randomId(),
      name: "Alan Turing",
      email: "alan@example.com",
      phone: "+1 555 010 0003",
      createdAt: t,
      updatedAt: t
    }
  ];
}

// PUBLIC_INTERFACE
export function createContactsService() {
  /** Create a contacts service instance backed by an in-memory store. */
  /** @type {Contact[]} */
  let contacts = seedContacts();

  /** @type {ContactsService} */
  const service = {
    async listContacts() {
      await delay();
      // Return a copy sorted by name for stable UI.
      return [...contacts].sort((a, b) => a.name.localeCompare(b.name));
    },

    async getContact(id) {
      await delay();
      const found = contacts.find((c) => c.id === id);
      return found ? { ...found } : null;
    },

    async createContact(input) {
      await delay();
      const v = assertValid(input);
      const t = nowIso();

      const created = {
        id: randomId(),
        ...v,
        createdAt: t,
        updatedAt: t
      };

      contacts = [created, ...contacts];
      return { ...created };
    },

    async updateContact(id, input) {
      await delay();
      const v = assertValid(input);

      const idx = contacts.findIndex((c) => c.id === id);
      if (idx === -1) throw new Error("Contact not found.");

      const updated = {
        ...contacts[idx],
        ...v,
        updatedAt: nowIso()
      };

      contacts = contacts.map((c) => (c.id === id ? updated : c));
      return { ...updated };
    },

    async deleteContact(id) {
      await delay();
      const exists = contacts.some((c) => c.id === id);
      if (!exists) throw new Error("Contact not found.");

      contacts = contacts.filter((c) => c.id !== id);
    }
  };

  return service;
}
