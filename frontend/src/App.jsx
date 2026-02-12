import React, { useMemo, useState } from "react";
import AppShell from "./components/AppShell.jsx";
import ContactsListPage from "./pages/ContactsListPage.jsx";
import ContactFormPage from "./pages/ContactFormPage.jsx";
import { createContactsService } from "./services/contactsService.js";

/**
 * Minimal app-level navigation without external routing to keep dependencies small.
 * Routes:
 * - "list"
 * - "add"
 * - "edit" (requires selectedContactId)
 */
export default function App() {
  const contactsService = useMemo(() => createContactsService(), []);

  const [route, setRoute] = useState({ name: "list" });

  const onNavigate = (nextRoute) => setRoute(nextRoute);

  return (
    <AppShell
      routeName={route.name}
      onNavigateToList={() => onNavigate({ name: "list" })}
      onNavigateToAdd={() => onNavigate({ name: "add" })}
    >
      {route.name === "list" && (
        <ContactsListPage
          contactsService={contactsService}
          onAdd={() => onNavigate({ name: "add" })}
          onEdit={(id) => onNavigate({ name: "edit", contactId: id })}
        />
      )}

      {route.name === "add" && (
        <ContactFormPage
          mode="add"
          contactsService={contactsService}
          onCancel={() => onNavigate({ name: "list" })}
          onSaved={() => onNavigate({ name: "list" })}
        />
      )}

      {route.name === "edit" && (
        <ContactFormPage
          mode="edit"
          contactId={route.contactId}
          contactsService={contactsService}
          onCancel={() => onNavigate({ name: "list" })}
          onSaved={() => onNavigate({ name: "list" })}
        />
      )}
    </AppShell>
  );
}
