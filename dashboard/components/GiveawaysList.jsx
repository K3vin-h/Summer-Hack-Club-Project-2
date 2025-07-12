import { useEffect, useState } from "react";
import styles from "../styles/GiveawaysList.module.css";
import { useSession } from "next-auth/react";

export default function GiveawaysList({ guildId }) {
  const [giveaways, setGiveaways] = useState([]);
  const [filteredGiveaways, setFilteredGiveaways] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [prizeFilter, setPrizeFilter] = useState("");
  const { data: session } = useSession();

  const [entriesModal, setEntriesModal] = useState({
    open: false,
    messageId: null,
    entries: [],
    userSearch: "",
    allEntries: [],
  });

  const [detailsModal, setDetailsModal] = useState({
    open: false,
    giveaway: null,
  });

  const [editModal, setEditModal] = useState({
    open: false,
    giveaway: null,
    loading: false,
  });
  const [deleteModal, setDeleteModal] = useState({
    open: false,
    giveaway: null,
    loading: false,
  });

  const [notification, setNotification] = useState({ message: "", type: "" });
  const [showNotification, setShowNotification] = useState(false);

  function triggerNotification(message, type = "success") {
    setNotification({ message, type });
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  }

  async function fetchGiveaways() {
    if (!guildId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/giveaways/${guildId}`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setGiveaways(data);
        setFilteredGiveaways(data);
      } else {
        setError("Unexpected data format from giveaways API");
      }
    } catch {
      setError("Failed to load giveaways");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchGiveaways();
  }, [guildId]);

  useEffect(() => {
    if (!entriesModal.open) return;
    const search = entriesModal.userSearch.trim().toLowerCase();
    const filtered = search
      ? entriesModal.allEntries.filter((entry) =>
          entry.userId.toLowerCase().includes(search)
        )
      : entriesModal.allEntries;
    setEntriesModal((em) => ({ ...em, entries: filtered }));
  }, [entriesModal.userSearch]);

  useEffect(() => {
    const search = prizeFilter.trim().toLowerCase();
    const filtered = giveaways.filter((gw) =>
      gw.prize.toLowerCase().includes(search)
    );
    setFilteredGiveaways(filtered);
  }, [prizeFilter, giveaways]);

  async function openEntries(messageId) {
    setEntriesModal({
      open: true,
      messageId,
      entries: [],
      userSearch: "",
      allEntries: [],
    });
    try {
      const res = await fetch(`/api/giveaways/entries?messageId=${messageId}`);
      const rawEntries = await res.json();
      const aggregatedMap = new Map();
      for (const entry of rawEntries) {
        if (aggregatedMap.has(entry.userId)) {
          aggregatedMap.set(
            entry.userId,
            aggregatedMap.get(entry.userId) + entry.entries
          );
        } else {
          aggregatedMap.set(entry.userId, entry.entries);
        }
      }
      const aggregatedEntries = Array.from(aggregatedMap.entries()).map(
        ([userId, entries]) => ({ userId, entries })
      );
      setEntriesModal((em) => ({
        ...em,
        entries: aggregatedEntries,
        allEntries: aggregatedEntries,
      }));
    } catch {
      triggerNotification("Error loading entries", "error");
    }
  }

  function formatTagId(tag, id) {
    if (tag && id) return `${tag} | ${id}`;
    if (tag) return tag;
    if (id) return id;
    return "unknown";
  }

  function getTotalEntries(gw) {
    return Array.isArray(gw.entries)
      ? gw.entries.reduce((sum, e) => sum + (e.entries || 0), 0)
      : 0;
  }

  async function handleEditSubmit(e) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const winners = parseInt(formData.get("winners")) || 0;

    if (winners < 1) {
      alert("Winners must be at least 1.");
      return;
    }

    const endTimeStr = formData.get("endTime");
    const endTime = new Date(endTimeStr);
    const createdAt = new Date(editModal.giveaway.createdAt);

    if (endTime <= createdAt) {
      alert("End time must be after the giveaway creation time.");
      return;
    }

    setEditModal((prev) => ({ ...prev, loading: true }));

    const updated = {
      prize: formData.get("prize"),
      winners,
      endTime: endTime.toISOString(),
    };

    try {
      const res = await fetch("/api/giveaways/update-embed", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionUserId: session.user.id,
          sessionUserName: session.user.name,
          guildId,
          messageId: editModal.giveaway.messageId,
          ...updated,
        }),
      });

      if (!res.ok) throw new Error("Failed to update giveaway");
      triggerNotification("Giveaway updated!");
      setEditModal({ open: false, giveaway: null, loading: false });
      fetchGiveaways();
    } catch (err) {
      triggerNotification("Update failed", "error");
      setEditModal((prev) => ({ ...prev, loading: false }));
    }
  }

  async function deleteGiveaway(messageId) {
    setDeleteModal((prev) => ({ ...prev, loading: true }));
    try {
      const res = await fetch("/api/giveaways/delete-embed", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionUserId: session.user.id,
          sessionUserName: session.user.name,
          guildId,
          messageId,
        }),
      });

      if (!res.ok) throw new Error("Failed to delete giveaway");
      triggerNotification("Giveaway deleted!");
      setDeleteModal({ open: false, giveaway: null, loading: false });
      fetchGiveaways();
    } catch (err) {
      triggerNotification("Delete failed", "error");
      setDeleteModal((prev) => ({ ...prev, loading: false }));
    }
  }
  return (
    <>
      {showNotification && (
        <div className={`${styles.notification} ${styles[notification.type]}`}>
          {notification.message}
        </div>
      )}
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.heading}>Giveaways</h2>
          <button
            onClick={fetchGiveaways}
            disabled={loading}
            className={styles.refreshButton}
          >
            {loading ? "Refreshing..." : "Refresh"}
          </button>
        </div>

        <input
          type="text"
          placeholder="Search by prize..."
          value={prizeFilter}
          onChange={(e) => setPrizeFilter(e.target.value)}
          className={styles.input}
          style={{ marginBottom: 10, width: "100%" }}
        />

        {error && <p className={styles.error}>{error}</p>}

        <table className={styles.table}>
          <thead>
            <tr>
              <th>Prize</th>
              <th>Ends At</th>
              <th>Host</th>
              <th>Total Entries</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredGiveaways.map((gw) => (
              <tr key={gw._id}>
                <td>{gw.prize}</td>
                <td>
                  {gw.endTime ? new Date(gw.endTime).toLocaleString() : "N/A"}
                </td>
                <td>{formatTagId(gw.creatorTag, gw.created)}</td>
                <td>{getTotalEntries(gw)}</td>
                <td className={styles.actions}>
                  <button
                    onClick={() =>
                      setDetailsModal({ open: true, giveaway: gw })
                    }
                    className={styles.actionButton}
                  >
                    View
                  </button>
                  <button
                    onClick={() => openEntries(gw.messageId)}
                    className={styles.actionButton}
                  >
                    Entries
                  </button>
                  <button
                    onClick={() =>
                      setEditModal({
                        open: true,
                        giveaway: gw,
                        loading: false,
                      })
                    }
                    className={styles.actionButton}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() =>
                      setDeleteModal({
                        open: true,
                        giveaway: gw,
                        loading: false,
                      })
                    }
                    className={styles.actionButton}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {editModal.open && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h3>Edit Giveaway</h3>
            <form
              onSubmit={handleEditSubmit}
              onKeyDown={(e) => {
                if (e.key === "Enter" && e.target.tagName !== "TEXTAREA") {
                  e.preventDefault();
                }
              }}
            >
              <label className={styles.label}>
                Prize:
                <input
                  name="prize"
                  type="text"
                  required
                  defaultValue={editModal.giveaway.prize}
                  className={styles.editinput}
                />
              </label>
              <label className={styles.label}>
                Winners:
                <input
                  name="winners"
                  type="number"
                  required
                  min={1}
                  defaultValue={editModal.giveaway.winners}
                  className={styles.editinput}
                />
              </label>
              <label className={styles.label}>
                End Time:
                <input
                  name="endTime"
                  type="datetime-local"
                  required
                  defaultValue={
                    editModal.giveaway.endTime
                      ? new Date(editModal.giveaway.endTime)
                          .toISOString()
                          .slice(0, 16)
                      : ""
                  }
                  min={
                    editModal.giveaway.createdAt
                      ? new Date(editModal.giveaway.createdAt)
                          .toISOString()
                          .slice(0, 16)
                      : undefined
                  }
                  className={`${styles.editinput} ${styles.purpleDateTime}`}
                />
              </label>
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  marginTop: 20,
                }}
              >
                <button
                  type="button"
                  onClick={() => setEditModal({ open: false, giveaway: null })}
                  className={styles.secondaryButton}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={editModal.loading}
                  className={styles.secondaryButton}
                >
                  {editModal.loading ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {entriesModal.open && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h3>Entries for Giveaway: {entriesModal.messageId}</h3>
            <div className={styles.modalControls}>
              <input
                placeholder="Search userId"
                value={entriesModal.userSearch}
                onChange={(e) =>
                  setEntriesModal((em) => ({
                    ...em,
                    userSearch: e.target.value,
                  }))
                }
                className={styles.input}
              />
              <button
                onClick={() =>
                  setEntriesModal({
                    open: false,
                    messageId: null,
                    entries: [],
                    userSearch: "",
                    allEntries: [],
                  })
                }
                className={styles.secondaryButton}
                style={{ marginLeft: 10 }}
              >
                Close
              </button>
            </div>

            <table className={styles.table} style={{ marginTop: 10 }}>
              <thead>
                <tr>
                  <th>User ID</th>
                  <th>Entries</th>
                </tr>
              </thead>
              <tbody>
                {entriesModal.entries.length === 0 ? (
                  <tr>
                    <td colSpan={2} style={{ textAlign: "center" }}>
                      No entries found.
                    </td>
                  </tr>
                ) : (
                  entriesModal.entries.map(({ userId, entries }) => (
                    <tr key={userId}>
                      <td>{userId}</td>
                      <td>{entries}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {detailsModal.open && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h3>Giveaway Details</h3>
            <p>
              <strong>Message ID:</strong> {detailsModal.giveaway.messageId}
            </p>
            <p>
              <strong>Prize:</strong> {detailsModal.giveaway.prize}
            </p>
            <p>
              <strong>Winners:</strong> {detailsModal.giveaway.winners}
            </p>
            <p>
              <strong>Ends At:</strong>{" "}
              {detailsModal.giveaway.endTime
                ? new Date(detailsModal.giveaway.endTime).toLocaleString()
                : "N/A"}
            </p>
            <p>
              <strong>Channel:</strong>{" "}
              {detailsModal.giveaway.channelId || "Unknown"}
            </p>
            <p>
              <strong>Host:</strong>{" "}
              {formatTagId(
                detailsModal.giveaway.hostedTag,
                detailsModal.giveaway.hosted
              )}
            </p>
            <p>
              <strong>Created By:</strong>{" "}
              {formatTagId(
                detailsModal.giveaway.creatorTag,
                detailsModal.giveaway.created
              )}
            </p>
            <p>
              <strong>Total Entries:</strong>{" "}
              {getTotalEntries(detailsModal.giveaway)}
            </p>
            <p>
              <strong>Required Role ID:</strong>{" "}
              {detailsModal.giveaway.requiredRoleId || "None"}
            </p>
            <p>
              <strong>Required Join Server ID:</strong>{" "}
              {detailsModal.giveaway.requiredJoinServerId || "None"}
            </p>
            {detailsModal.giveaway.bonusEntries?.length > 0 && (
              <>
                <p>
                  <strong>Bonus Entries:</strong>
                </p>
                <ul>
                  {detailsModal.giveaway.bonusEntries.map((b, i) => (
                    <li key={i}>
                      Role ID: {b.roleId}, Entries: {b.entries}
                    </li>
                  ))}
                </ul>
              </>
            )}
            <div
              style={{
                marginTop: 20,
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
              <button
                onClick={() => setDetailsModal({ open: false, giveaway: null })}
                className={styles.secondaryButton}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      {deleteModal.open && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h3>Delete Giveaway</h3>
            <p>
              Are you sure you want to delete the giveaway for{" "}
              <strong>{deleteModal.giveaway.prize}</strong>?
            </p>
            <div
              style={{
                marginTop: 20,
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
              <button
                onClick={() => setDeleteModal({ open: false, giveaway: null })}
                className={styles.secondaryButton}
              >
                Cancel
              </button>
              <button
                onClick={() => deleteGiveaway(deleteModal.giveaway.messageId)}
                disabled={deleteModal.loading}
                className={styles.secondaryButton}
              >
                {deleteModal.loading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
