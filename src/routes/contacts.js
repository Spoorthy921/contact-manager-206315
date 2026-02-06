const express = require("express");
const {
  listContacts,
  getContactById,
  createContact,
  updateContact,
  deleteContact,
  seedContacts,
} = require("../data/memoryStore");

const router = express.Router();

// Seed on first module load to make the API immediately usable for quick testing.
seedContacts();

router.get("/", (_req, res) => {
  res.json({ data: listContacts() });
});

router.get("/seed", (_req, res) => {
  // Re-seed only if empty (seedContacts() behaves that way)
  res.json({ data: seedContacts() });
});

router.get("/:id", (req, res, next) => {
  try {
    const contact = getContactById(req.params.id);
    if (!contact) {
      return res.status(404).json({
        error: { code: "NOT_FOUND", message: `Contact not found: ${req.params.id}` },
      });
    }
    return res.json({ data: contact });
  } catch (err) {
    return next(err);
  }
});

router.post("/", (req, res, next) => {
  try {
    const created = createContact(req.body);
    return res.status(201).json({ data: created });
  } catch (err) {
    return next(err);
  }
});

router.put("/:id", (req, res, next) => {
  try {
    const updated = updateContact(req.params.id, req.body);
    return res.json({ data: updated });
  } catch (err) {
    return next(err);
  }
});

router.delete("/:id", (req, res, next) => {
  try {
    const removed = deleteContact(req.params.id);
    if (!removed) {
      return res.status(404).json({
        error: { code: "NOT_FOUND", message: `Contact not found: ${req.params.id}` },
      });
    }
    return res.status(204).send();
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
