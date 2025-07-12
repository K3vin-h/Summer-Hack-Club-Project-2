import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import GiveawaysList from "../../components/GiveawaysList";
import ServerConfig from "../../components/ServerConfig";
import styles from "@/styles/GuildDashboard.module.css";
import { useTheme } from "@/context/themeContext";

export default function GuildDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { guildId } = router.query;
  const [activeTab, setActiveTab] = useState("giveaways");
  const { theme, toggleTheme } = useTheme();

  const [loading, setLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    document.documentElement.setAttribute("data-theme", savedTheme);
  }, []);
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status]);
  useEffect(() => {
    if (status !== "authenticated" || !guildId || !session?.user?.accessToken) {
      return;
    }

    async function checkAccess() {
      setLoading(true);
      try {
        const res = await fetch("https://discord.com/api/users/@me/guilds", {
          headers: {
            Authorization: `Bearer ${session.user.accessToken}`,
          },
        });

        if (!res.ok) throw new Error("Failed to fetch guilds");

        const guilds = await res.json();

        const guild = guilds.find((g) => g.id === guildId);

        if (!guild) {
          router.push("/dashboard");
          return;
        }

        const permissions = Number(guild.permissions);
        const hasManageGuild = (permissions & 0x20) === 0x20;

        if (hasManageGuild) {
          setHasAccess(true);
        } else {
          router.push("/dashboard");
        }
      } catch (err) {
        console.error("Error checking guild access:", err);
        router.push("/dashboard");
      } finally {
        setLoading(false);
      }
    }

    checkAccess();
  }, [status, guildId, session?.user?.accessToken, router]);

  if (status === "loading" || loading) {
    return <p className={styles.loading}>Loading session...</p>;
  }

  if (status === "unauthenticated") {
    router.push("/");
    return null;
  }

  if (!hasAccess) return null;

  function goBack() {
    router.push("/dashboard");
  }

  return (
    <>
      <div className={styles.container}>
        <header className={styles.header}>
          <div className={styles.leftHeader}>
            <h1 className={styles.title}>
              Guild:&nbsp;
              <span className={styles.guildName}>{guildId}</span>
            </h1>
          </div>

          <div className={styles.rightHeader}>
            <button onClick={goBack} className={styles.secondaryButton}>
              Back to Server List
            </button>
            <button onClick={toggleTheme} className={styles.toggleButton}>
              {theme === "light" ? "🌙 Dark Mode" : "☀️ Light Mode"}
            </button>

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

        <nav className={styles.nav}>
          <button
            onClick={() => setActiveTab("giveaways")}
            className={`${styles.tabButton} ${
              activeTab === "giveaways" ? styles.activeTab : ""
            }`}
          >
            Giveaways
          </button>
          <button
            onClick={() => setActiveTab("config")}
            className={`${styles.tabButton} ${
              activeTab === "config" ? styles.activeTab : ""
            }`}
          >
            Server Configuration
          </button>
        </nav>

        <section className={styles.content}>
          {guildId && activeTab === "giveaways" && (
            <GiveawaysList guildId={guildId} />
          )}
          {guildId && activeTab === "config" && (
            <ServerConfig guildId={guildId} />
          )}
        </section>
      </div>
      <footer className={styles.footer}>
        <p>&copy; {new Date().getFullYear()} Giveaway Bot Inc.</p>
      </footer>
    </>
  );
}
