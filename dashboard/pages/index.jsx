import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useSession, signIn } from "next-auth/react";
import styles from "../styles/Home.module.css";
export default function Home() {
  const { data: session, status } = useSession();

  return (
    <>
      <Head>
        <title>Giveaway</title>
        <meta
          name="description"
          content="Powerful giveaway discord bot with server and role requirements, bonus entries, bypass roles, and more! Includes detail logging and fully customizable settings of giveaway and manager role."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.container}>
        <nav className={styles.navbar}>
          <div className={styles.logoContainer}>
            {/* <Image
              src="/icon.png"
              alt="Giveaway Bot Logo"
              width={40}
              height={40}
            /> */}
            <span className={styles.logoText}>Giveaway</span>
          </div>
          <div className={styles.navLinks}>
            <Link href="/status" className={styles.navButton}>
              Status
            </Link>
            <a
              href="https://discord.com/oauth2/authorize?client_id=1382763637940420668&scope=bot%20applications.commands&permissions=268823648"
              className={styles.addButton}
            >
              Add to Server
            </a>
            {session ? (
              <Link href="/dashboard" className={styles.loginButton}>
                Dashboard
              </Link>
            ) : (
              <button
                onClick={() => signIn("discord", { callbackUrl: "/dashboard" })}
                className={styles.loginButton}
              >
                Sign In with Discord
              </button>
            )}
          </div>
        </nav>
        <main className={styles.mainContent}>
          <section className={styles.hero}>
            <h1 className={styles.heroTitle}>Discord Giveaways Done Right</h1>
            <p className={styles.heroSubtitle}>
              Track giveaways with ease using our sleek dashboard.
            </p>
          </section>
          <div className={styles.ctaContainer}>
            {!session && status !== "loading" && (
              <button
                onClick={() => signIn("discord", { callbackUrl: "/dashboard" })}
                className={styles.ctaButton}
              >
                Sign In with Discord
              </button>
            )}
            {session && (
              <Link href="/dashboard" className={styles.ctaButton}>
                Go to Dashboard
              </Link>
            )}
            <a
              href="https://discord.com/oauth2/authorize?client_id=1393742095331889182&scope=bot%20applications.commands&permissions=268823648"
              className={styles.ctaButton}
            >
              Add to Server
            </a>
          </div>

          <section className={styles.featuresSection}>
            <h2>Features</h2>
            <ul className={styles.featuresList}>
              <li>Simplified giveaway creation</li>
              <li>Role and server join requirements</li>
              <li>Customizable log channels</li>
              <li>Live entry tracking and rerolls</li>
            </ul>
          </section>
        </main>
        <footer className={styles.footer}>
          <p>&copy; {new Date().getFullYear()} Giveaway Bot Inc.</p>
        </footer>
      </div>
    </>
  );
}
