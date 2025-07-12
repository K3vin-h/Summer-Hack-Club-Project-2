import { useEffect, useState } from "react";
import styles from "../styles/Incidents.module.css";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

export default function IncidentsPage() {
  const [incidents, setIncidents] = useState([]);
  const [form, setForm] = useState({ description: "", severity: "medium" });
  const { data: session, status } = useSession();
 const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status]);

  useEffect(() => {
    if (session) {
      if (!session.isOwner) {
        router.push("/");
        return;
      }
    }
  }, [session]);
  const fetchIncidents = async () => {
    const res = await fetch("/api/incidents");
    const data = await res.json();
    setIncidents(data.filter((i) => !i.resolved));
  };

  useEffect(() => {
    fetchIncidents();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch("/api/incidents", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setForm({ description: "", severity: "medium" });
    fetchIncidents();
  };

  const resolveIncident = async (id) => {
    await fetch(`/api/incidents/${id}`, {
      method: "PATCH",
    });
    fetchIncidents();
  };

  return (
    <>
     {session?.isOwner && ( 
      <div className={styles.container}>
        <Link href="/" className={styles.backLink}>
          ← Back to Home
        </Link>
        <h1>Incident Manager</h1>

        <form className={styles.form} onSubmit={handleSubmit}>
          <textarea
            placeholder="Describe the incident..."
            minLength={10}
            required
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          <select
            value={form.severity}
            onChange={(e) => setForm({ ...form, severity: e.target.value })}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          <button type="submit">Create Incident</button>
        </form>

        <h2>Unresolved Incidents</h2>
        {incidents.length === 0 ? (
          <p className={styles.empty}>🎉 All incidents are resolved!</p>
        ) : (
          <ul className={styles.list}>
            {incidents.map((incident) => (
              <li key={incident._id} className={styles.incident}>
                <div>
                  <p>{incident.description}</p>
                  <small>
                    Severity: {incident.severity} | Date:{" "}
                    {new Date(incident.date).toLocaleString()}
                  </small>
                </div>
                <button onClick={() => resolveIncident(incident._id)}>
                  Resolve
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
      )}
    </>
  );
}
