import React from "react";
import "./AppShell.css";

/**
 * @param {{routeName: string, onNavigateToList: () => void, onNavigateToAdd: () => void, children: React.ReactNode}} props
 */
export default function AppShell({
  routeName,
  onNavigateToList,
  onNavigateToAdd,
  children
}) {
  return (
    <div className="appShell">
      <header className="appShell__header">
        <div className="appShell__brand">
          <div className="appShell__title">Contact Manager</div>
          <div className="appShell__subtitle">Minimal in-memory UI scaffold</div>
        </div>

        <nav className="appShell__nav" aria-label="Primary">
          <button
            type="button"
            className={`appShell__navBtn ${
              routeName === "list" ? "isActive" : ""
            }`}
            onClick={onNavigateToList}
          >
            Contacts
          </button>
          <button
            type="button"
            className={`appShell__navBtn ${
              routeName === "add" ? "isActive" : ""
            }`}
            onClick={onNavigateToAdd}
          >
            Add Contact
          </button>
        </nav>
      </header>

      <main className="appShell__main">
        <div className="appShell__content">{children}</div>
      </main>

      <footer className="appShell__footer">
        <span>
          Data is stored in-memory in the browser. Refreshing will reset it.
        </span>
      </footer>
    </div>
  );
}
