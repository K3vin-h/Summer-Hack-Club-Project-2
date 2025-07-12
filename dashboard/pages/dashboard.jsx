import { useSession, signOut } from "next-auth/react";
import { useEffect, useState, useRef } from "react";
import { useTheme } from "@/context/themeContext";
import GiveawaysList from "@/components/OwnerGiveawaysList";
import styles from "@/styles/Dashboard.module.css";
import { useRouter } from "next/router";
import Link from "next/link";

export default function Dashboard() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [guilds, setGuilds] = useState([]);
  const [giveaways, setGiveaways] = useState([]);
  const { theme, toggleTheme } = useTheme();
  const didRun = useRef(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status]);

  useEffect(() => {
    if (status !== "authenticated") return;
    if (didRun.current) return;
    didRun.current = true;

    const fetchData = async () => {
      try {
        const guildRes = await fetch("/api/discord/guild", {
          headers: { Authorization: `Bearer ${session.user.accessToken}` },
        });

        const guildData = await guildRes.json();
        console.log("Guild Data:", guildData);
        if (!guildRes.ok)
          throw new Error(guildData.message || "Failed to fetch guilds");

        const manageable = guildData.filter(
          (g) => (g.permissions & 0x20) === 0x20
        );
        setGuilds(manageable || []);

        if (session.isOwner) {
          const giveawaysRes = await fetch("/api/giveaways");
          const giveawaysData = await giveawaysRes.json();

          if (!giveawaysRes.ok)
            throw new Error(
              giveawaysData.message || "Failed to fetch giveaways"
            );

          setGiveaways(giveawaysData.giveaways || []);
        }
      } catch (err) {
        console.error("Dashboard fetch error:", err);
        setGuilds([]);
        setGiveaways([]);
      }
    };

    fetchData();
  }, [status, session]);

  if (status === "loading") return <p className={styles.status}>Loading...</p>;

  return (
    <>
      <div className={styles.container}>
        <header className={styles.header}>
          <h2>Your Servers</h2>

          <div className={styles.userSection}>
            <div className={styles.ownerControls}>
              <button onClick={toggleTheme} className={styles.themeToggle}>
                {theme === "light" ? "🌙 Dark Mode" : "☀️ Light Mode"}
              </button>
              {session?.isOwner && (
                <>
                  <Link href="/incidents" className={styles.addIncidentButton}>
                    Incidents
                  </Link>
                </>
              )}
            </div>

            {session?.user && (
              <div className={styles.userInfo}>
                <img
                  src={session.user.image || "/default-avatar.png"}
                  alt="User avatar"
                  className={styles.userAvatar}
                />
                <span className={styles.userName}>{session.user.name}</span>
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className={styles.signOutButton}
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </header>

        <div className={styles.guildGrid}>
          {guilds.map((guild) => (
            <a
              key={guild.id}
              href={`/dashboard/${guild.id}`}
              className={styles.guildBox}
              title={guild.name}
            >
              <img
                className={styles.guildIcon}
                src={
                  guild.icon
                    ? `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png`
                    : "/default-server-icon.png"
                }
                alt={`${guild.name} icon`}
              />
              <span className={styles.guildName}>{guild.name}</span>
            </a>
          ))}
        </div>
        {session?.isOwner && (
          <section className={styles.giveawaySection}>
            <h3>Active Giveaways</h3>
            <GiveawaysList giveaways={giveaways} />
          </section>
        )}
      </div>
      <footer className={styles.footer}>
        <p>&copy; {new Date().getFullYear()} Giveaway Bot Inc.</p>
      </footer>
    </>
  );
}
