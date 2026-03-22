"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import useAuth from "../hooks/useAuth";
import Sidebar from "../../components/Sidebar";
import Footer from "../../components/Footer";
import styles from "./Profile.module.css";

export default function ProfilePage() {
  const router = useRouter();
  const { user, logout, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");
  const [editMode, setEditMode] = useState(false);
  const [userData, setUserData] = useState({
    display_name: "",
    email: "",
    bio: "",
    avatar_icon: "astronaut"
  });

  const AVATAR_MAP = {
    astronaut: <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a4 4 0 0 0-4 4v3h8V6a4 4 0 0 0-4-4Z"/><path d="M9 13v9a2 2 0 0 0 4 0v-9"/><path d="M15 13v9a2 2 0 0 0 4 0v-9"/><path d="M5 13a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h2v-4a2 2 0 0 0-2-2Z"/><path d="M19 13a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2h-2v-4a2 2 0 0 1 2-2Z"/><rect width="10" height="4" x="7" y="9" rx="1"/></svg>,
    robot: <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="10" rx="2"/><circle cx="12" cy="5" r="2"/><path d="M12 7v4"/><line x1="8" y1="16" x2="8" y2="16"/><line x1="16" y1="16" x2="16" y2="16"/></svg>,
    alien: <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 12c-1.5 0-2-1-2-2"/><path d="M16 12c1.5 0 2-1 2-2"/><path d="M12 16v.01"/></svg>,
    wizard: <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22v-3"/><path d="M14 6L10 18"/><path d="M19 6L5 18"/></svg>,
    coder: <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
  };

  const AVATAR_OPTIONS = [
    { value: "astronaut", label: "Astronaut" },
    { value: "robot", label: "Robot" },
    { value: "alien", label: "Alien" },
    { value: "wizard", label: "Wizard" },
    { value: "coder", label: "Coder" }
  ];

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  // Initialize user data
  useEffect(() => {
    if (user) {
      setUserData({
        display_name: user?.display_name || user?.username || "Space Explorer",
        email: user?.email || "explorer@aimentora.com",
        bio: user?.bio || "Exploring the universe of AI tools and mastering new skills every day!",
        avatar_icon: user?.avatar_icon && AVATAR_MAP[user.avatar_icon] ? user.avatar_icon : "astronaut"
      });
    }
  }, [user]);

  const handleSignOut = () => {
    logout();
    router.push("/login");
  };

  const handleSaveProfile = () => {
    // In a real app, you would send this to your backend
    console.log("Saving profile:", userData);
    setEditMode(false);
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <main className={styles.page}>
      <div className={styles.layout}>
        <Sidebar />
        
        <div className={styles.content}>
          {/* HEADER */}
          <header className={styles.header}>
            <div className={styles.headerContent}>
              <h1 className={styles.title}>Space Cadet Profile</h1>
              <p className={styles.subtitle}>Your journey through the AI universe</p>
            </div>
            
            <div className={styles.headerStats}>
              <div className={styles.statBadge}>
                <span className={styles.statIcon}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/></svg></span>
                <span className={styles.statText}>Level {user?.stats?.level || 5}</span>
              </div>
              <div className={styles.statBadge}>
                <span className={styles.statIcon}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg></span>
                <span className={styles.statText}>{user?.stats?.total_xp || 1240} XP</span>
              </div>
            </div>
          </header>

          {/* PROFILE OVERVIEW */}
          <section className={styles.profileOverview}>
            <div className={styles.profileCard}>
              <div className={styles.profileGlow}></div>
              
              {/* AVATAR SECTION */}
              <div className={styles.avatarSection}>
                <div className={styles.avatarWrapper}>
                  <div className={styles.avatar}>
                    <span className={styles.avatarIcon}>{AVATAR_MAP[userData.avatar_icon] || AVATAR_MAP['astronaut']}</span>
                    {editMode && (
                      <div className={styles.avatarEdit}>
                        <select 
                          value={userData.avatar_icon}
                          onChange={(e) => setUserData({...userData, avatar_icon: e.target.value})}
                          className={styles.avatarSelect}
                          style={{ color: '#000', padding: '4px' }}
                        >
                          {AVATAR_OPTIONS.map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>
                  <div className={styles.avatarStatus}>
                    <div className={styles.statusIndicator}></div>
                    <span className={styles.statusText}>Online</span>
                  </div>
                </div>
                
                <div className={styles.profileInfo}>
                  {editMode ? (
                    <input
                      type="text"
                      value={userData.display_name}
                      onChange={(e) => setUserData({...userData, display_name: e.target.value})}
                      className={styles.editInput}
                      placeholder="Display Name"
                    />
                  ) : (
                    <h2 className={styles.profileName}>{userData.display_name}</h2>
                  )}
                  
                  <div className={styles.profileMeta}>
                    <span className={styles.userTag}>@{user?.username || "explorer"}</span>
                    <span className={styles.userEmail}>{userData.email}</span>
                  </div>
                  
                  {editMode ? (
                    <textarea
                      value={userData.bio}
                      onChange={(e) => setUserData({...userData, bio: e.target.value})}
                      className={styles.editTextarea}
                      placeholder="Write something about yourself..."
                      rows={3}
                    />
                  ) : (
                    <p className={styles.profileBio}>{userData.bio}</p>
                  )}
                </div>
              </div>

              {/* PROFILE ACTIONS */}
              <div className={styles.profileActions}>
                {editMode ? (
                  <>
                    <button className={styles.saveButton} onClick={handleSaveProfile}>
                      Save Changes
                    </button>
                    <button className={styles.cancelButton} onClick={() => setEditMode(false)}>
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button className={styles.editButton} onClick={() => setEditMode(true)}>
                      Edit Profile
                    </button>
                    <button className={styles.shareButton}>
                      Share Profile
                    </button>
                  </>
                )}
              </div>
            </div>
          </section>

          {/* TABS NAVIGATION */}
          <div className={styles.tabsContainer}>
            <div className={styles.tabs}>
              <button 
                className={`${styles.tab} ${activeTab === 'profile' ? styles.active : ''}`}
                onClick={() => setActiveTab('profile')}
              >
                <div style={{display:'flex', gap:'8px', alignItems:'center'}}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>
                  Overview
                </div>
              </button>
              <button 
                className={`${styles.tab} ${activeTab === 'stats' ? styles.active : ''}`}
                onClick={() => setActiveTab('stats')}
              >
                <div style={{display:'flex', gap:'8px', alignItems:'center'}}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
                  Statistics
                </div>
              </button>
              <button 
                className={`${styles.tab} ${activeTab === 'achievements' ? styles.active : ''}`}
                onClick={() => setActiveTab('achievements')}
              >
                <div style={{display:'flex', gap:'8px', alignItems:'center'}}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>
                  Achievements
                </div>
              </button>
              <button 
                className={`${styles.tab} ${activeTab === 'settings' ? styles.active : ''}`}
                onClick={() => setActiveTab('settings')}
              >
                <div style={{display:'flex', gap:'8px', alignItems:'center'}}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
                  Settings
                </div>
              </button>
            </div>
          </div>

          {/* MAIN CONTENT */}
          <div className={styles.mainContent}>
            {/* STATS SECTION */}
            <section className={styles.statsSection}>
              <div className={styles.sectionHeader}>
                <h3 className={styles.sectionTitle}>Learning Statistics</h3>
                <span className={styles.sectionSubtitle}>Your journey in numbers</span>
              </div>
              
              <div className={styles.statsGrid}>
                <StatCard 
                  icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>}
                  label="Current Streak"
                  value={user?.stats?.streak_days || 5}
                  unit="days"
                  color="orange"
                />
                <StatCard 
                  icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>}
                  label="Total XP"
                  value={user?.stats?.total_xp || 1240}
                  unit="XP"
                  color="yellow"
                />
                <StatCard 
                  icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>}
                  label="Hours Learned"
                  value={Math.round(user?.stats?.total_hours || 24)}
                  unit="hours"
                  color="blue"
                />
                <StatCard 
                  icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>}
                  label="Courses Completed"
                  value={user?.stats?.completed_courses || 3}
                  unit="courses"
                  color="purple"
                />
              </div>
            </section>

            {/* ACHIEVEMENTS */}
            <section className={styles.achievementsSection}>
              <div className={styles.sectionHeader}>
                <h3 className={styles.sectionTitle}>Recent Achievements</h3>
                <button className={styles.viewAllButton}>View All →</button>
              </div>
              
              <div className={styles.achievementsGrid}>
                <AchievementCard 
                  title="Quick Learner"
                  description="Complete 5 tasks in one day"
                  icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>}
                  earned={true}
                  date="Today"
                />
                <AchievementCard 
                  title="AI Conversationalist"
                  description="Master ChatGPT prompts"
                  icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/></svg>}
                  earned={true}
                  date="2 days ago"
                />
                <AchievementCard 
                  title="Design Explorer"
                  description="Complete Canva AI course"
                  icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/><path d="m15 5 4 4"/></svg>}
                  earned={false}
                />
                <AchievementCard 
                  title="Week Warrior"
                  description="7-day learning streak"
                  icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>}
                  earned={false}
                />
              </div>
            </section>

            {/* LEARNING ACTIVITY */}
            <section className={styles.activitySection}>
              <div className={styles.sectionHeader}>
                <h3 className={styles.sectionTitle}>Recent Activity</h3>
                <span className={styles.sectionSubtitle}>Your learning timeline</span>
              </div>
              
              <div className={styles.activityList}>
                <ActivityItem 
                  title="Completed: Advanced Prompt Engineering"
                  time="2 hours ago"
                  type="completed"
                  icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>}
                />
                <ActivityItem 
                  title="Started: AI Workflow Design Course"
                  time="Yesterday"
                  type="started"
                  icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/></svg>}
                />
                <ActivityItem 
                  title="Earned: 150 XP for daily streak"
                  time="2 days ago"
                  type="earned"
                  icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>}
                />
                <ActivityItem 
                  title="Unlocked: ChatGPT Mastery Badge"
                  time="3 days ago"
                  type="unlocked"
                  icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>}
                />
              </div>
            </section>

            {/* QUICK ACTIONS */}
            <section className={styles.actionsSection}>
              <div className={styles.sectionHeader}>
                <h3 className={styles.sectionTitle}>Quick Actions</h3>
              </div>
              
              <div className={styles.actionsGrid}>
                <ActionButton 
                  icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>}
                  label="Set Goals"
                  onClick={() => router.push('/dashboard')}
                />
                <ActionButton 
                  icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>}
                  label="View Progress"
                  onClick={() => router.push('/dashboard')}
                />
                <ActionButton 
                  icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>}
                  label="Notifications"
                  onClick={() => console.log("Notifications")}
                />
                <ActionButton 
                  icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg>}
                  label="Invite Friends"
                  onClick={() => console.log("Invite Friends")}
                />
              </div>
            </section>
          </div>

          <Footer />
        </div>
      </div>
    </main>
  );
}

/* STAT CARD COMPONENT */
function StatCard({ icon, label, value, unit, color = "blue" }) {
  return (
    <div className={`${styles.statCard} ${styles[color]}`}>
      <div className={styles.statHeader}>
        <span className={styles.statIcon}>{icon}</span>
        <span className={styles.statLabel}>{label}</span>
      </div>
      <div className={styles.statValue}>
        <span className={styles.valueNumber}>{value}</span>
        <span className={styles.valueUnit}>{unit}</span>
      </div>
    </div>
  );
}

/* ACHIEVEMENT CARD COMPONENT */
function AchievementCard({ title, description, icon, earned = false, date }) {
  return (
    <div className={`${styles.achievementCard} ${earned ? styles.earned : ''}`}>
      <div className={styles.achievementIcon}>{icon}</div>
      <div className={styles.achievementContent}>
        <h4 className={styles.achievementTitle}>{title}</h4>
        <p className={styles.achievementDesc}>{description}</p>
        {earned && <span className={styles.achievementDate}>{date}</span>}
      </div>
      <div className={styles.achievementStatus}>
        {earned ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg> : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>}
      </div>
    </div>
  );
}

/* ACTIVITY ITEM COMPONENT */
function ActivityItem({ title, time, type, icon }) {
  return (
    <div className={styles.activityItem}>
      <div className={styles.activityIcon}>{icon}</div>
      <div className={styles.activityContent}>
        <h4 className={styles.activityTitle}>{title}</h4>
        <span className={styles.activityTime}>{time}</span>
      </div>
      <div className={styles.activityType}>{type}</div>
    </div>
  );
}

/* ACTION BUTTON COMPONENT */
function ActionButton({ icon, label, onClick }) {
  return (
    <button className={styles.actionButton} onClick={onClick}>
      <span className={styles.actionIcon}>{icon}</span>
      <span className={styles.actionLabel}>{label}</span>
    </button>
  );
}