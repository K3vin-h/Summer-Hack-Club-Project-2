// components/GiveawaysList.js
import { useState, useMemo } from "react";
import styles from "../styles/OwnerGiveawaysList.module.css";

export default function GiveawaysList({ giveaways, onRefresh }) {
  const [searchGuildId, setSearchGuildId] = useState("");
  const [selectedGiveaway, setSelectedGiveaway] = useState(null); 

  const filteredGiveaways = useMemo(() => {
    if (!searchGuildId) return giveaways;
    return giveaways.filter((g) =>
      g.guildId.toLowerCase().includes(searchGuildId.toLowerCase())
    );
  }, [giveaways, searchGuildId]);

  function formatTagId(tag, id) {
    if (tag && id) return `${tag} | ${id}`;
    if (tag) return tag;
    if (id) return id;
    return "unknown";
  }

  return (
    <div className={styles.container}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
        <p>
          Active giveaways: <strong>{giveaways.length}</strong>
        </p>
        <button className={styles.moreInfoBtn} onClick={onRefresh}>
          Refresh
        </button>
      </div>

      <input
        type="text"
        placeholder="Search by Guild ID"
        value={searchGuildId}
        onChange={(e) => setSearchGuildId(e.target.value)}
        className={styles.searchInput}
      />

      {filteredGiveaways.length === 0 ? (
        <p>No giveaways found for that Guild ID.</p>
      ) : (
        <div className={styles.list}>
          {filteredGiveaways.map((g) => (
            <div key={g._id} className={styles.card}>
              <h4>{g.prize}</h4>
              <p>
                <strong>Server:</strong> {g.guildName || g.guildId}
              </p>
              <p>
                <strong>Hosted by:</strong> {g.hostedTag || g.creatorTag}
              </p>
              <p>
                <strong>Ends at:</strong> {g.endTime ? new Date(g.endTime).toLocaleString() : "N/A"}
              </p>

              <button
                className={styles.moreInfoBtn}
                onClick={() => setSelectedGiveaway(g)}
              >
                More Info
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {selectedGiveaway && (
        <div className={styles.modalOverlay} onClick={() => setSelectedGiveaway(null)}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <h3>Giveaway Details</h3>
            <p><strong>Message ID:</strong> {selectedGiveaway.messageId}</p>
            <p><strong>Prize:</strong> {selectedGiveaway.prize}</p>
            <p><strong>Winners:</strong> {selectedGiveaway.winners}</p>
            <p><strong>Ends At:</strong> {selectedGiveaway.endTime ? new Date(selectedGiveaway.endTime).toLocaleString() : "N/A"}</p>
            <p><strong>Ended:</strong> {selectedGiveaway.ended ? "Yes" : "No"}</p>
            <p><strong>Channel ID:</strong> {selectedGiveaway.channelId || "Unknown"}</p>
            <p><strong>Guild ID:</strong> {selectedGiveaway.guildId}</p>
            <p><strong>Guild Name:</strong> {selectedGiveaway.guildName || "Unknown"}</p>
            <p><strong>Hosted By:</strong> {formatTagId(selectedGiveaway.hostedTag, selectedGiveaway.hosted)}</p>
            <p><strong>Created By:</strong> {formatTagId(selectedGiveaway.creatorTag, selectedGiveaway.created)}</p>
            <p><strong>Required Role ID:</strong> {selectedGiveaway.requiredRoleId || "None"}</p>
            <p><strong>Required Join Server ID:</strong> {selectedGiveaway.requiredJoinServerId || "None"}</p>
            {selectedGiveaway.bonusEntries?.length > 0 && (
              <>
                <p><strong>Bonus Entries:</strong></p>
                <ul>
                  {selectedGiveaway.bonusEntries.map((b, i) => (
                    <li key={i}>Role ID: {b.roleId}, Entries: {b.entries}</li>
                  ))}
                </ul>
              </>
            )}
            <button className={styles.moreInfoBtn} onClick={() => setSelectedGiveaway(null)}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}