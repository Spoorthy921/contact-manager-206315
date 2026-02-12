import React, { useEffect, useMemo, useState } from "react";
import "./ContactFormPage.css";

/**
 * @param {{
 *  mode: "add" | "edit",
 *  contactId?: string,
 *  contactsService: import("../services/contactsService.js").ContactsService,
 *  onCancel: () => void,
 *  onSaved: () => void
 * }} props
 */
export default function ContactFormPage({
  mode,
  contactId,
  contactsService,
  onCancel,
  onSaved
}) {
  const isEdit = mode === "edit";

  const [status, setStatus] = useState({ kind: "idle" }); // idle | loading | saving | error
  const [values, setValues] = useState({ name: "", email: "", phone: "" });
  const [touched, setTouched] = useState({
    name: false,
    email: false,
    phone: false
  });

  useEffect(() => {
    let cancelled = false;

    async function loadForEdit() {
      if (!isEdit) return;
      setStatus({ kind: "loading" });

      try {
        const found = await contactsService.getContact(contactId);
        if (cancelled) return;

        if (!found) {
          setStatus({
            kind: "error",
            message: "Contact not found. It may have been deleted."
          });
          return;
        }

        setValues({ name: found.name, email: found.email, phone: found.phone });
        setStatus({ kind: "idle" });
      } catch (e) {
        if (cancelled) return;
        setStatus({
          kind: "error",
          message: e instanceof Error ? e.message : "Failed to load contact"
        });
      }
    }

    loadForEdit();
    return () => {
      cancelled = true;
    };
  }, [isEdit, contactId, contactsService]);

  const errors = useMemo(() => validate(values), [values]);
  const canSubmit = Object.keys(errors).length === 0;

  const setField = (key, value) => {
    setValues((v) => ({ ...v, [key]: value }));
  };

  const touchAll = () => {
    setTouched({ name: true, email: true, phone: true });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    touchAll();
    if (!canSubmit) return;

    setStatus({ kind: "saving" });

    try {
      if (isEdit) {
        await contactsService.updateContact(contactId, values);
      } else {
        await contactsService.createContact(values);
      }
      setStatus({ kind: "idle" });
      onSaved();
    } catch (err) {
      setStatus({
        kind: "error",
        message: err instanceof Error ? err.message : "Failed to save contact"
      });
    }
  };

  return (
    <section className="formPage" aria-label={isEdit ? "Edit contact" : "Add contact"}>
      <header className="formPage__header">
        <div>
          <h1 className="formPage__title">{isEdit ? "Edit contact" : "Add contact"}</h1>
          <p className="formPage__subtitle">
            {isEdit
              ? "Update contact details and save."
              : "Enter contact details and save."}
          </p>
        </div>

        <button type="button" className="btn" onClick={onCancel}>
          Back to list
        </button>
      </header>

      {status.kind === "loading" && (
        <div className="card formPage__state" role="status">
          Loading…
        </div>
      )}

      {status.kind === "error" && (
        <div className="card formPage__state isError" role="alert">
          {status.message}
        </div>
      )}

      {status.kind !== "loading" && (
        <form className="card formPage__card" onSubmit={onSubmit}>
          <div className="formGrid">
            <Field
              label="Name"
              value={values.name}
              onChange={(v) => setField("name", v)}
              onBlur={() => setTouched((t) => ({ ...t, name: true }))}
              placeholder="e.g., Ada Lovelace"
              error={touched.name ? errors.name : undefined}
              autoComplete="name"
            />

            <Field
              label="Email"
              value={values.email}
              onChange={(v) => setField("email", v)}
              onBlur={() => setTouched((t) => ({ ...t, email: true }))}
              placeholder="e.g., ada@example.com"
              error={touched.email ? errors.email : undefined}
              inputMode="email"
              autoComplete="email"
            />

            <Field
              label="Phone"
              value={values.phone}
              onChange={(v) => setField("phone", v)}
              onBlur={() => setTouched((t) => ({ ...t, phone: true }))}
              placeholder="e.g., +1 555 123 4567"
              error={touched.phone ? errors.phone : undefined}
              inputMode="tel"
              autoComplete="tel"
            />
          </div>

          <div className="formActions">
            <button type="button" className="btn" onClick={onCancel}>
              Cancel
            </button>

            <button
              type="submit"
              className="btn btnPrimary"
              disabled={!canSubmit || status.kind === "saving"}
            >
              {status.kind === "saving" ? "Saving…" : "Save contact"}
            </button>
          </div>
        </form>
      )}
    </section>
  );
}

function Field({
  label,
  value,
  onChange,
  onBlur,
  placeholder,
  error,
  inputMode,
  autoComplete
}) {
  const id = useMemo(() => `field_${label.toLowerCase()}`, [label]);

  return (
    <label className="field" htmlFor={id}>
      <span className="field__label">{label}</span>
      <input
        id={id}
        className={`input ${error ? "input--error" : ""}`}
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        inputMode={inputMode}
        autoComplete={autoComplete}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}_error` : undefined}
      />
      {error ? (
        <span className="field__error" id={`${id}_error`} role="alert">
          {error}
        </span>
      ) : (
        <span className="field__hint"> </span>
      )}
    </label>
  );
}

/**
 * Basic client-side validation.
 * - name: required
 * - email: required and basic format
 * - phone: required and basic allowed characters
 */
function validate(values) {
  const errs = {};

  if (!values.name.trim()) {
    errs.name = "Name is required.";
  } else if (values.name.trim().length < 2) {
    errs.name = "Name must be at least 2 characters.";
  }

  if (!values.email.trim()) {
    errs.email = "Email is required.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
    errs.email = "Please enter a valid email address.";
  }

  if (!values.phone.trim()) {
    errs.phone = "Phone is required.";
  } else if (!/^[0-9+()\-\s.]{7,}$/.test(values.phone.trim())) {
    errs.phone = "Please enter a valid phone number.";
  }

  return errs;
}
