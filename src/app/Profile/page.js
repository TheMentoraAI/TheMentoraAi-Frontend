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
    avatar_icon: "👨‍🚀"
  });

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
        avatar_icon: user?.avatar_icon || "👨‍🚀"
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

  const avatarIcons = ["👨‍🚀", "👩‍🚀", "🤖", "👽", "🦸", "🧙", "🧑‍💻", "🧑‍🎨"];

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
                <span className={styles.statIcon}>🚀</span>
                <span className={styles.statText}>Level {user?.stats?.level || 5}</span>
              </div>
              <div className={styles.statBadge}>
                <span className={styles.statIcon}>⭐</span>
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
                    <span className={styles.avatarIcon}>{userData.avatar_icon}</span>
                    {editMode && (
                      <div className={styles.avatarEdit}>
                        <select 
                          value={userData.avatar_icon}
                          onChange={(e) => setUserData({...userData, avatar_icon: e.target.value})}
                          className={styles.avatarSelect}
                        >
                          {avatarIcons.map(icon => (
                            <option key={icon} value={icon}>{icon} Icon</option>
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
                🎯 Overview
              </button>
              <button 
                className={`${styles.tab} ${activeTab === 'stats' ? styles.active : ''}`}
                onClick={() => setActiveTab('stats')}
              >
                📊 Statistics
              </button>
              <button 
                className={`${styles.tab} ${activeTab === 'achievements' ? styles.active : ''}`}
                onClick={() => setActiveTab('achievements')}
              >
                🏆 Achievements
              </button>
              <button 
                className={`${styles.tab} ${activeTab === 'settings' ? styles.active : ''}`}
                onClick={() => setActiveTab('settings')}
              >
                ⚙️ Settings
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
                  icon="🔥"
                  label="Current Streak"
                  value={user?.stats?.streak_days || 5}
                  unit="days"
                  color="orange"
                />
                <StatCard 
                  icon="⭐"
                  label="Total XP"
                  value={user?.stats?.total_xp || 1240}
                  unit="XP"
                  color="yellow"
                />
                <StatCard 
                  icon="⏱️"
                  label="Hours Learned"
                  value={Math.round(user?.stats?.total_hours || 24)}
                  unit="hours"
                  color="blue"
                />
                <StatCard 
                  icon="📚"
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
                  icon="⚡"
                  earned={true}
                  date="Today"
                />
                <AchievementCard 
                  title="AI Conversationalist"
                  description="Master ChatGPT prompts"
                  icon="💬"
                  earned={true}
                  date="2 days ago"
                />
                <AchievementCard 
                  title="Design Explorer"
                  description="Complete Canva AI course"
                  icon="🎨"
                  earned={false}
                />
                <AchievementCard 
                  title="Week Warrior"
                  description="7-day learning streak"
                  icon="🛡️"
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
                  icon="✅"
                />
                <ActivityItem 
                  title="Started: AI Workflow Design Course"
                  time="Yesterday"
                  type="started"
                  icon="🚀"
                />
                <ActivityItem 
                  title="Earned: 150 XP for daily streak"
                  time="2 days ago"
                  type="earned"
                  icon="⭐"
                />
                <ActivityItem 
                  title="Unlocked: ChatGPT Mastery Badge"
                  time="3 days ago"
                  type="unlocked"
                  icon="🏆"
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
                  icon="🎯"
                  label="Set Goals"
                  onClick={() => router.push('/dashboard')}
                />
                <ActionButton 
                  icon="📊"
                  label="View Progress"
                  onClick={() => router.push('/dashboard')}
                />
                <ActionButton 
                  icon="🔔"
                  label="Notifications"
                  onClick={() => console.log("Notifications")}
                />
                <ActionButton 
                  icon="🤝"
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
        {earned ? '✅' : '🔒'}
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