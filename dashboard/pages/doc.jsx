import { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import styles from "../styles/Doc.module.css";

export default function Documentation() {
  const [activePage, setActivePage] = useState("about");

  const pages = {
    about: (
      <>
        <h1>About the Giveaway Bot</h1>
        <p>
          Giveaway Bot is a fully customizable Discord bot designed to create
          and manage giveaways effortlessly for your Discord server.
        </p>
        <p>
          It supports role- and server-based entry requirements, ensuring only
          eligible members can participate and win. The bot grants bonus
          entries to specific roles, includes bypass roles for special
          permissions, and allows a wide range of customizable requirements to
          fit your server’s needs.
        </p>
        <p>
          With its powerful dashboard, you can edit and end giveaways in
          real-time, view all active giveaways across your servers, and see live
          entry counts for each giveaway. It also includes a server logging
          feature, so you can track every giveaway event and update.
        </p>
      </>
    ),

    setup: (
      <>
        <h1>Initial Setup</h1>
        <p>
          Before creating any giveaways, you must set up the{" "}
          <strong>Giveaway Role</strong>. Without this role, the bot will not
          allow you to create giveaways.
        </p>

        <h2>Step 1 – Set up the Giveaway Role</h2>
        <pre>
          <code>/set_giveaway_roles</code>
        </pre>
        <p>
          Select the role that will act as the <strong>Giveaway Role</strong>.
          Only members with this role can create giveaways.
        </p>

        <h2>Step 2 – Verify the Giveaway Role</h2>
        <pre>
          <code>/view_settings</code>
        </pre>
        <p>
          This will display your server’s configurations, including the assigned
          Giveaway Role.
        </p>

        <h2>Step 3 – Create your first giveaway</h2>
        <pre>
          <code>/create</code>
        </pre>
        <p>Create your first giveaway and start engaging your community!</p>

        <h2>Dashboard Setup Option</h2>
        <p>
          You can also sign in to the dashboard and configure the Giveaway Role
          there.
        </p>
        <ul>
          <li>
            <strong>Giveaway Role:</strong> Can create giveaways and reroll
            winners.
          </li>
          <li>
            <strong>Giveaway Manager Role:</strong> Can delete and end giveaways.
          </li>
        </ul>
      </>
    ),

    commands: (
      <>
        <h1>Bot Commands</h1>
        <ul>
          <li>
            <code>/set_giveaway_roles</code> – Set the required role for
            giveaways.
          </li>
          <li>
            <code>/create</code> – Create a giveaway (requires the Giveaway
            Role).
          </li>
          <li>
            <code>/set_giveaway_log</code> – Set the log channel for giveaway
            events.
          </li>
          <li>
            <code>/view_settings</code> – View current settings.
          </li>
          <li>
            <code>/delete</code> – Delete a giveaway.
          </li>
          <li>
            <code>/reroll</code> – Reroll giveaway winners.
          </li>
          <li>
            <code>/end</code> – End a giveaway early.
          </li>
        </ul>
      </>
    ),

    dashboard: (
      <>
        <h1>Dashboard Guide</h1>
        <p>
          The dashboard lets you manage giveaways visually without typing
          commands.
        </p>
        <ul>
          <li>View active giveaways</li>
          <li>Edit prizes and durations</li>
          <li>End giveaways early</li>
          <li>See real-time participation stats</li>
          <li>Configure Giveaway Role and logs</li>
        </ul>
      </>
    ),
  };

  return (
    <>
      <Head>
        <title>Giveaway Bot Documentation</title>
        <meta
          name="description"
          content="Documentation for the Giveaway Bot and dashboard."
        />
      </Head>
      <div className={styles.container}>
        <nav className={styles.sidebar}>
          <h2 className={styles.sidebarTitle}>Docs</h2>
          <ul>
            <li
              className={activePage === "about" ? styles.active : ""}
              onClick={() => setActivePage("about")}
            >
              About
            </li>
            <li
              className={activePage === "commands" ? styles.active : ""}
              onClick={() => setActivePage("commands")}
            >
              Commands
            </li>
            <li
              className={activePage === "setup" ? styles.active : ""}
              onClick={() => setActivePage("setup")}
            >
              Setup
            </li>
            <li
              className={activePage === "dashboard" ? styles.active : ""}
              onClick={() => setActivePage("dashboard")}
            >
              Dashboard
            </li>
          </ul>
          <Link href="/" className={styles.backHome}>
            ← Back Home
          </Link>
        </nav>

        <main className={styles.content}>{pages[activePage]}</main>
      </div>
    </>
  );
}
