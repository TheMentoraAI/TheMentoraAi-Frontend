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
        <div className={styles.logoIcon}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/></svg>
        </div>
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
                    <span className={styles.dropdownIcon}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                    </span>
                    <span>Profile</span>
                  </div>
                  <div
                    className={styles.dropdownItem}
                    onClick={handleSignOut}
                  >
                    <span className={styles.dropdownIcon}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                    </span>
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
            <span className={styles.statsIcon}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
            </span>
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
            {user?.avatar_icon || <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>}
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
    home: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
    courses: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>,
    dashboard: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
    settings: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
  };
  return icons[id] || <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>;
}