import React, { useEffect, useMemo, useState } from "react";
import "./ContactsListPage.css";

/**
 * @param {{
 *  contactsService: import("../services/contactsService.js").ContactsService,
 *  onAdd: () => void,
 *  onEdit: (id: string) => void
 * }} props
 */
export default function ContactsListPage({ contactsService, onAdd, onEdit }) {
  const [query, setQuery] = useState("");
  const [contacts, setContacts] = useState([]);
  const [status, setStatus] = useState({ kind: "idle" }); // idle | loading | error

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return contacts;

    return contacts.filter((c) => {
      return (
        c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.phone.toLowerCase().includes(q)
      );
    });
  }, [contacts, query]);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setStatus({ kind: "loading" });
      try {
        const all = await contactsService.listContacts();
        if (cancelled) return;
        setContacts(all);
        setStatus({ kind: "idle" });
      } catch (e) {
        if (cancelled) return;
        setStatus({
          kind: "error",
          message: e instanceof Error ? e.message : "Failed to load contacts"
        });
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [contactsService]);

  const onDelete = async (id) => {
    const ok = window.confirm("Delete this contact?");
    if (!ok) return;

    try {
      await contactsService.deleteContact(id);
      const all = await contactsService.listContacts();
      setContacts(all);
    } catch (e) {
      window.alert(e instanceof Error ? e.message : "Failed to delete contact");
    }
  };

  return (
    <section className="contactsPage" aria-label="Contacts list">
      <header className="contactsPage__header">
        <div>
          <h1 className="contactsPage__title">Contacts</h1>
          <p className="contactsPage__subtitle">
            Search, add, edit, and delete contacts.
          </p>
        </div>

        <button type="button" className="btn btnPrimary" onClick={onAdd}>
          Add contact
        </button>
      </header>

      <div className="card contactsPage__controls">
        <label className="field">
          <span className="field__label">Search</span>
          <input
            className="input"
            type="text"
            placeholder="Filter by name, email, or phone…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>
      </div>

      {status.kind === "loading" && (
        <div className="card contactsPage__state" role="status">
          Loading…
        </div>
      )}

      {status.kind === "error" && (
        <div className="card contactsPage__state isError" role="alert">
          {status.message}
        </div>
      )}

      {status.kind !== "loading" && (
        <div className="card contactsPage__listCard">
          {filtered.length === 0 ? (
            <div className="contactsPage__empty">
              <div className="contactsPage__emptyTitle">No contacts found</div>
              <div className="contactsPage__emptyBody">
                Try adjusting your search or add a new contact.
              </div>
            </div>
          ) : (
            <div className="tableWrap" role="region" aria-label="Contacts table">
              <table className="table">
                <thead>
                  <tr>
                    <th scope="col">Name</th>
                    <th scope="col">Email</th>
                    <th scope="col">Phone</th>
                    <th scope="col" className="table__actionsHeader">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((c) => (
                    <tr key={c.id}>
                      <td className="table__primaryCell">{c.name}</td>
                      <td>
                        <a className="link" href={`mailto:${c.email}`}>
                          {c.email}
                        </a>
                      </td>
                      <td>
                        <a className="link" href={`tel:${c.phone}`}>
                          {c.phone}
                        </a>
                      </td>
                      <td className="table__actionsCell">
                        <button
                          type="button"
                          className="btn btnSmall"
                          onClick={() => onEdit(c.id)}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          className="btn btnSmall btnDanger"
                          onClick={() => onDelete(c.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
