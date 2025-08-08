import { useEffect, useState } from "react";
import Link from "next/link";
import styles from "@/styles/StatusPage.module.css";

export default function StatusPage() {
  const [status, setStatus] = useState(null);
  const [error, setError] = useState(null);
  const [incidents, setIncidents] = useState([]);

  useEffect(() => {
    async function fetchStatus() {
      try {
        const url = process.env.NEXT_PUBLIC_BOT_API_BASE_URL;
        const res = await fetch(`${url}/api/status`);
        if (!res.ok) throw new Error("Failed to fetch status");
        const data = await res.json();
        setStatus(data);
      } catch (err) {
        console.error(err);
      }
    }

    fetchStatus();
    const interval = setInterval(fetchStatus, 15000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    async function fetchIncidents() {
      try {
        const res = await fetch(`/api/incidents`);
        if (!res.ok) throw new Error("Failed to fetch incidents");
        const data = await res.json();
        setIncidents(data);
      } catch (err) {
        console.error("Error loading incidents:", err);
      }
    }

    fetchIncidents();
  }, []);

  const getStatusText = (value) => {
    if (value === "online" || value === "connected") return "Operational";
    if (value === "offline") return "Under Maintenance";
    return value;
  };

  const getStatusColor = (value) => {
    return value === "online" || value === "connected" ? "#2ecc71" : "#e74c3c";
  };

  const formatUptime = (seconds) => {
    if (!seconds) return "0s";
    const days = Math.floor(seconds / (3600 * 24));
    const hours = Math.floor((seconds % (3600 * 24)) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    return `${days}d ${hours}h ${minutes}m ${secs}s`;
  };

  const allSystemsOperational =
    status &&
    status.apiStatus === "online" &&
    status.dashboardStatus === "online" &&
    status.mongoStatus === "connected" &&
    status.botStatus === "online";

  const unresolvedIncidents = incidents.filter((i) => !i.resolved);
  const resolvedIncidents = incidents.filter((i) => i.resolved);

  return (
    <div className={styles.container}>
      <Link href="/" className={styles.backLink}>
        ← Back to Home
      </Link>

      <h1 className={styles.title}>System Status</h1>
      <div
        className={`${styles.statusHeader} ${
          allSystemsOperational ? styles.operational : styles.partial
        }`}
      >
        {allSystemsOperational ? "All Systems Operational" : "Partial Outage"}
      </div>

      {error && <p className={styles.error}>{error}</p>}

      {!status ? (
        <p className={styles.loading}>Checking services...</p>
      ) : (
        <>
          <div className={styles.statusTable}>
            <h3 className={styles.sectionTitle}>Core Services</h3>
            <StatusRow
              label="API"
              value={getStatusText(status.apiStatus)}
              color={getStatusColor(status.apiStatus)}
            />
            <StatusRow
              label="Dashboard"
              value={getStatusText(status.dashboardStatus)}
              color={getStatusColor(status.dashboardStatus)}
            />
            <StatusRow
              label="Database"
              value={getStatusText(status.mongoStatus)}
              color={getStatusColor(status.mongoStatus)}
            />
            <StatusRow
              label="Discord Bot"
              value={getStatusText(status.botStatus)}
              color={getStatusColor(status.botStatus)}
            />

            <h3 className={styles.sectionTitle}>Additional Information</h3>
            <StatusRow
              label="Uptime"
              value={formatUptime(status.uptime)}
              color="#3498db"
            />
            <StatusRow
              label="Guilds"
              value={status.guildCount}
              color="#3498db"
            />
            <StatusRow
              label="Server Time"
              value={new Date(status.serverTime).toLocaleString()}
              color="#f39c12"
            />
          </div>

          <div className={styles.pastIncidents}>
            <h2>Unresolved Incidents</h2>
            {unresolvedIncidents.length === 0 ? (
              <p className={styles.incidentDesc}>No active incidents!</p>
            ) : (
              unresolvedIncidents.map((incident) => (
                <div key={incident._id} className={styles.incident}>
                  <div className={styles.incidentDate}>
                    {new Date(incident.date).toLocaleString()}
                  </div>
                  <div className={styles.incidentDesc}>
                    <strong>{incident.severity.toUpperCase()}</strong>:{" "}
                    {incident.description}
                  </div>
                </div>
              ))
            )}

            <h2>Resolved Incidents</h2>
            {resolvedIncidents.length === 0 ? (
              <p className={styles.incidentDesc}>No past incidents reported.</p>
            ) : (
              resolvedIncidents.map((incident) => (
                <div key={incident._id} className={styles.incident}>
                  <div className={styles.incidentDate}>
                    {new Date(incident.date).toLocaleString()}
                  </div>
                  <div className={styles.incidentDesc}>
                    <strong>{incident.severity.toUpperCase()}</strong>:{" "}
                    {incident.description}
                    <div>
                      Resolved at:{" "}
                      {new Date(incident.resolvedAt).toLocaleString()}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
}

function StatusRow({ label, value, color, checkbox = false }) {
  return (
    <div className={styles.statusRow}>
      <div className={styles.serviceName}>
        {checkbox && <span className={styles.checkbox}>☐</span>}
        {label}
      </div>
      <div className={styles.statusValue} style={{ color }}>
        {value}
      </div>
    </div>
  );
}
