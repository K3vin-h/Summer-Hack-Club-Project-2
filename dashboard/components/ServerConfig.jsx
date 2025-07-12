import { useState, useRef, useEffect } from "react";
import styles from "@/styles/ServerConfig.module.css";

export default function ServerConfig({ guildId }) {
  const [logConfig, setLogConfig] = useState(null);
  const [discordChannels, setDiscordChannels] = useState([]);
  const [discordRoles, setDiscordRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [notification, setNotification] = useState({ message: "", type: "" });
  const [showNotification, setShowNotification] = useState(false);

  function triggerNotification(message, type = "success") {
    setNotification({ message, type });
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  }

  useEffect(() => {
    if (!guildId) return;

    async function fetchData() {
      setLoading(true);
      try {
        const configRes = await fetch(`/api/log-config/${guildId}`);
        if (!configRes.ok) throw new Error("Failed to fetch log config");
        const configData = await configRes.json();

        const channelsRes = await fetch(`/api/discord/guild-metadata/${guildId}`);
        if (!channelsRes.ok) throw new Error("Failed to fetch guild channels");
        const { channels } = await channelsRes.json();

        const rolesRes = await fetch(`/api/discord/guild-roles/${guildId}`);
        if (!rolesRes.ok) throw new Error("Failed to fetch guild roles");
        const { roles } = await rolesRes.json();

        setLogConfig(
          configData || {
            channels: {
              giveawayCreate: null,
              giveawayEntry: null,
              giveawayReroll: null,
              giveawayEnd: null,
              giveawayLeave: null,
              giveawayDelete: null,
              giveawayConfig: null,
            },
            giveawayRole: null,
            giveawayManager: null,
          }
        );
        setDiscordChannels(channels || []);
        setDiscordRoles(roles || []);
        setError(null);
      } catch (err) {
        setError(err.message);
        setLogConfig(null);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [guildId]);

  if (loading && !logConfig)
    return (
      <div className={styles.loadingContainer} role="status" aria-live="polite">
        <span className={styles.loadingText}>Loading</span>
        <span className={styles.loadingDots} aria-hidden="true">
          <span>.</span>
          <span>.</span>
          <span>.</span>
        </span>
      </div>
    );

  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!logConfig) return <p>No log config found.</p>;


  function CustomDropdown({ options, value, onChange, placeholder }) {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
      function handleClickOutside(event) {
        if (ref.current && !ref.current.contains(event.target)) {
          setOpen(false);
        }
      }
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const normalizedValue = value === "" ? null : value;

    const selectedOption = options.find((o) => o.value === normalizedValue);

    return (
      <div
        className={styles.customDropdown}
        ref={ref}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Escape") setOpen(false);
        }}
      >
        <div
          className={styles.customDropdownHeader}
          onClick={() => setOpen((o) => !o)}
          role="button"
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-label="Select option"
        >
          {selectedOption ? selectedOption.label : placeholder}
          <span className={`${styles.arrow} ${open ? styles.arrowOpen : ""}`} />
        </div>
        {open && (
          <ul className={styles.customDropdownList} role="listbox">
            <li
              className={styles.customDropdownOption}
              onClick={() => {
                onChange(null);
                setOpen(false);
              }}
              role="option"
              aria-selected={normalizedValue === null}
              tabIndex={-1}
            >
              None
            </li>
            {options.map((opt) => (
              <li
                key={opt.value}
                className={`${styles.customDropdownOption} ${
                  normalizedValue === opt.value ? styles.selectedOption : ""
                }`}
                onClick={() => {
                  onChange(opt.value);
                  setOpen(false);
                }}
                role="option"
                aria-selected={normalizedValue === opt.value}
                tabIndex={-1}
              >
                {opt.label}
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }

  function handleChannelChange(key, value) {
    
    setLogConfig((prev) => ({
      ...prev,
      channels: {
        ...prev.channels,
        [key]: value || null,
      },
    }));
  }

  function handleRoleChange(value) {
    console.log("Giveaway Role change:", value);
    setLogConfig((prev) => ({
      ...prev,
      giveawayRole: value || null,
    }));
  }

  function handleManagerRoleChange(value) {
    console.log("Giveaway Manager change:", value);
    setLogConfig((prev) => ({
      ...prev,
      giveawayManager: value || null,
    }));
  }

  async function saveConfig() {
    setLoading(true);
    try {
      const response = await fetch(`/api/log-config/${guildId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          channels: logConfig.channels,
          giveawayRole: logConfig.giveawayRole,
          giveawayManager: logConfig.giveawayManager,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to save config");
      }

      triggerNotification("Config saved successfully!", "success");
    } catch (error) {
      console.error("Save config error:", error);
      triggerNotification(error.message || "Error saving config.", "error");
    } finally {
      setLoading(false);
    }
  }

  const channelOptions = discordChannels.map((ch) => ({
    label: `#${ch.name}`,
    value: ch.id,
  }));

  const roleOptions = discordRoles.map((role) => ({
    label: role.name,
    value: role.id,
  }));

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Server Log Channel Configuration</h2>

      {showNotification && (
        <div
          className={`${styles.notification} ${
            notification.type === "success"
              ? styles.notificationSuccess
              : styles.notificationError
          }`}
        >
          {notification.message}
        </div>
      )}

      {[
        "giveawayCreate",
        "giveawayEntry",
        "giveawayReroll",
        "giveawayEnd",
        "giveawayLeave",
        "giveawayDelete",
        "giveawayConfig",
      ].map((key) => (
        <div key={key} className={styles.section}>
          <label htmlFor={key} className={styles.label}>
            {key.replace("giveaway", "Giveaway ")}:
          </label>
          <CustomDropdown
            options={channelOptions}
            value={logConfig.channels?.[key] ?? null}
            onChange={(val) => handleChannelChange(key, val)}
            placeholder="Select a channel"
          />
        </div>
      ))}

      <div className={styles.section}>
        <label htmlFor="giveawayRole" className={styles.label}>
          Giveaway Role:
        </label>
        <CustomDropdown
          options={roleOptions}
          value={logConfig.giveawayRole ?? null}
          onChange={handleRoleChange}
          placeholder="Select a role"
        />
      </div>

      <div className={styles.section}>
        <label htmlFor="giveawayManager" className={styles.label}>
          Giveaway Manager Role:
        </label>
        <CustomDropdown
          options={roleOptions}
          value={logConfig.giveawayManager ?? null}
          onChange={handleManagerRoleChange}
          placeholder="Select a role"
        />
      </div>
      <button onClick={saveConfig} className={styles.button} disabled={loading}>
        {loading ? "Saving..." : "Save Configuration"}
      </button>
    </div>
  );
}
