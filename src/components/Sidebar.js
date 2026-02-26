"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import styles from "./sidebar.module.css";
import useAuth from "../app/hooks/useAuth";
import { userAPI } from "../utils/api";

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [activeItem, setActiveItem] = useState("");
  const { user, logout, isAuthenticated } = useAuth();
  const [dailyProgress, setDailyProgress] = useState(null);
  const [loadingProgress, setLoadingProgress] = useState(true);

  const menuItems = [
    { id: "home", label: "Home", path: "/home" },
    { id: "dashboard", label: "Dashboard", path: "/Dashboard" },
    { id: "settings", label: "Settings", path: null }
  ];

  // Fetch daily progress
  useEffect(() => {
    const fetchDailyProgress = async () => {
      if (!isAuthenticated) {
        setLoadingProgress(false);
        return;
      }

      try {
        const response = await userAPI.getDailyProgress();
        setDailyProgress(response.data);
      } catch (error) {
        console.error('Failed to fetch daily progress:', error);
      } finally {
        setLoadingProgress(false);
      }
    };

    fetchDailyProgress();
  }, [isAuthenticated]);

  // Set active item based on current pathname
  useEffect(() => {
    // Extract the base path (without potential query params)
    const currentPath = pathname.split('/').filter(Boolean)[0] || '';

    // Find which menu item matches the current path
    const active = menuItems.find(item => {
      if (!item.path) return false;
      const itemPath = item.path.replace('/', '');
      return currentPath.toLowerCase() === itemPath.toLowerCase();
    });

    if (active) {
      setActiveItem(active.id);
    }
  }, [pathname]);

  const handleItemClick = (id, path) => {
    setActiveItem(id);
    if (path) {
      router.push(path);
    }
  };

  const handleSignOut = () => {
    logout();
    router.push("/login");
  };

  return (
    <aside className={styles.sidebar}>
      {/* LOGO / TITLE */}
      <div className={styles.logoSection}>
        <div className={styles.logoIcon}>🚀</div>
        <div className={styles.logoText}>
          <span className={styles.logoTitle}>The Mentora AI</span>
          <span className={styles.logoSubtitle}>Learning Platform</span>
        </div>
      </div>

      {/* NAVIGATION */}
      <nav className={styles.nav}>
        <ul className={styles.menu}>
          {menuItems.map((item) => (
            <li key={item.id} className={styles.menuItem}>
              {item.path ? (
                <div
                  className={`${styles.menuLink} ${activeItem === item.id ? styles.active : ""
                    }`}
                  onClick={() => handleItemClick(item.id, item.path)}
                >
                  <span className={styles.menuIcon}>
                    {getIconForItem(item.id)}
                  </span>
                  <span className={styles.menuLabel}>{item.label}</span>
                  {activeItem === item.id && (
                    <span className={styles.activeIndicator}></span>
                  )}
                </div>
              ) : (
                <div
                  className={`${styles.menuLink} ${activeItem === item.id ? styles.active : ""
                    }`}
                  onClick={() => {
                    setActiveItem(item.id);
                    setOpen(!open);
                  }}
                >
                  <span className={styles.menuIcon}>
                    {getIconForItem(item.id)}
                  </span>
                  <span className={styles.menuLabel}>{item.label}</span>
                  <span className={styles.dropdownArrow}>
                    {open ? "▼" : "►"}
                  </span>
                </div>
              )}

              {/* SETTINGS DROPDOWN */}
              {item.id === "settings" && open && (
                <div className={styles.dropdown}>
                  <div
                    className={styles.dropdownItem}
                    onClick={() => {
                      router.push("/Profile");
                      setActiveItem("settings");
                    }}
                  >
                    <span className={styles.dropdownIcon}>👤</span>
                    <span>Profile</span>
                  </div>
                  <div
                    className={styles.dropdownItem}
                    onClick={handleSignOut}
                  >
                    <span className={styles.dropdownIcon}>🚪</span>
                    <span>Sign Out</span>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      </nav>

      {/* PROGRESS / STATS */}
      <div className={styles.statsSection}>
        <div className={styles.statsCard}>
          <div className={styles.statsHeader}>
            <span className={styles.statsIcon}>📊</span>
            <span className={styles.statsTitle}>Today's Progress</span>
          </div>
          <div className={styles.statsBar}>
            <div
              className={styles.statsProgress}
              style={{ width: `${dailyProgress?.percentage || 0}%` }}
            />
          </div>
          <div className={styles.statsText}>
            <span>
              {loadingProgress ? 'Loading...' :
                `${dailyProgress?.tasks_completed || 0} of 5 tasks completed`}
            </span>
            <span className={styles.statsPercent}>
              {Math.round(dailyProgress?.percentage || 0)}%
            </span>
          </div>
        </div>
      </div>

      {/* USER PROFILE */}
      <div
        className={styles.profileSection}
        onClick={() => router.push("/Profile")}
        style={{ cursor: 'pointer' }}
      >
        <div className={styles.profileAvatar}>
          <span className={styles.avatarIcon}>
            {user?.avatar_icon || "👨‍🚀"}
          </span>
        </div>
        <div className={styles.profileInfo}>
          <span className={styles.profileName}>
            {user?.display_name || user?.username || "Guest"}
          </span>
          <span className={styles.profileRole}>
            {user ? "AI Learner" : "Not logged in"}
          </span>
        </div>
        <div className={styles.onlineIndicator}></div>
      </div>
    </aside>
  );
}

function getIconForItem(id) {
  const icons = {
    home: "🏠",
    courses: "📚",
    dashboard: "📈",
    settings: "⚙️"
  };
  return icons[id] || "⭐";
}