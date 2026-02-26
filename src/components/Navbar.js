import Link from "next/link";
import styles from "./Navbar.module.css";

export default function Navbar() {
  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>The Mentora AI</div>

      <div className={styles.navLinks}>
        <a>Features</a>
        <a>How it Works</a>
        <a>Pricing</a>

        <Link href="/home">
          <button className={styles.cta}>Get Started</button>
        </Link>
      </div>
    </nav>
  );
}
