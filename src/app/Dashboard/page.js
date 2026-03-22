"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Footer from "../../components/Footer";
import styles from "./Dashboard.module.css";
import Sidebar from "../../components/Sidebar";
import useAuth from "../hooks/useAuth";
import { userAPI, trackAPI } from "../../utils/api";
import Link from "next/link";

export default function Dashboard() {
  const router = useRouter();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [stats, setStats] = useState(null);
  const [enrolledTracks, setEnrolledTracks] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  // Auth check
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, authLoading, router]);

  // Fetch dashboard data
  useEffect(() => {
    const fetchData = async () => {
      if (!isAuthenticated) return;

      try {
        setLoading(true);

        // Fetch stats
        const statsResponse = await userAPI.getStats();
        setStats(statsResponse.data);

        // Fetch enrolled tracks
        const tracksResponse = await trackAPI.getEnrolled();
        setEnrolledTracks(tracksResponse.data);

        // In a real app, you'd fetch recent activity too.
        // For now, we'll fetch completed tasks for the first track as activity.
        if (tracksResponse.data.length > 0) {
          const activityResponse = await trackAPI.getCompletedTasks(tracksResponse.data[0].track_slug);
          setRecentActivity(activityResponse.data.slice(0, 5)); // Last 5 tasks
        }
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isAuthenticated]);

  if (!isAuthenticated && !authLoading) return null;

  const currentTrack = enrolledTracks[0];

  return (
    <main className={styles.page}>
      <div className={styles.layout}>
        <Sidebar />

        <div className={styles.content}>
          {/* HEADER */}
          <header className={styles.header}>
            <h1 className={styles.title}>Dashboard</h1>
            <p className={styles.subtitle}>Your AI learning progress at a glance</p>
          </header>

          {/* STATS GRID */}
          <section className={styles.statsSection}>
            <div className={styles.statsGrid}>
              <StatCard
                title="XP Earned"
                value={loading ? "..." : `${stats?.total_xp?.toLocaleString() || 0} XP`}
                icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>}
                color="primary"
              />
              <StatCard
                title="Current Streak"
                value={loading ? "..." : `${stats?.streak_days || 0} Days`}
                icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>}
                color="secondary"
              />
              <StatCard
                title="Completed Tasks"
                value={loading ? "..." : enrolledTracks.reduce((acc, t) => acc + t.tasks_completed, 0)}
                icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>}
                color="accent"
              />
              <StatCard
                title="Courses Started"
                value={loading ? "..." : enrolledTracks.length}
                icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>}
                color="purple"
              />
            </div>
          </section>

          {/* CURRENT TRACK */}
          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Current Track</h2>
              <span className={styles.sectionBadge}>
                {currentTrack ? "Active" : "None"}
              </span>
            </div>

            {currentTrack ? (
              <div className={styles.currentTrack}>
                <div className={styles.trackInfo}>
                  <div className={styles.trackIcon}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/></svg>
                  </div>
                  <div>
                    <h3 className={styles.trackName}>{currentTrack.track_name}</h3>
                    <p className={styles.trackDesc}>Continue where you left off</p>
                  </div>
                </div>

                <div className={styles.trackProgress}>
                  <div className={styles.progressBar}>
                    <div className={styles.progressFill} style={{ width: `${currentTrack.percent_complete}%` }}></div>
                  </div>
                  <span className={styles.progressText}>{Math.round(currentTrack.percent_complete)}% Complete</span>
                </div>

                <div className={styles.trackActions}>
                  <Link href={`/track/${currentTrack.track_slug}`} className={styles.primaryBtn}>
                    Continue Learning
                  </Link>
                  <Link href="/home" className={styles.secondaryBtn}>Explore Others</Link>
                </div>
              </div>
            ) : (
              <div className={styles.currentTrack}>
                <p>No active tracks yet. Start one from the Home page!</p>
              </div>
            )}
          </section>

          {/* RECENT ACTIVITY */}
          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Recent Activity</h2>
              <button className={styles.viewAllBtn} onClick={() => router.push("/home")}>Browse Tracks</button>
            </div>

            <div className={styles.activityList}>
              {recentActivity.length > 0 ? (
                recentActivity
                  .filter(activity => activity.task_id && /^\d+-\d+$/.test(activity.task_id)) // Filter legacy IDs like 't1'
                  .map((activity, i) => (
                    <ActivityItem
                      key={`${activity.id || 'act'}-${i}`}
                      title={`Completed Task: ${activity.task_id}`}
                      time={new Date(activity.completed_at).toLocaleString()}
                      type="completed"
                    />
                  ))
              ) : (
                <p>No recent activity found.</p>
              )}
            </div>
          </section>

          <Footer />
        </div>
      </div>
    </main>
  );
}

/* COMPONENTS */

function StatCard({ title, value, icon, color = 'primary' }) {
  return (
    <div className={`${styles.statCard} ${styles[color]}`}>
      <div className={styles.statHeader}>
        <span className={styles.statIcon}>{icon}</span>
        <span className={styles.statTitle}>{title}</span>
      </div>
      <h3 className={styles.statValue}>{value}</h3>
    </div>
  );
}

function ActivityItem({ title, time, type }) {
  const getTypeIcon = () => {
    switch (type) {
      case 'completed': return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>;
      case 'started': return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/></svg>;
      case 'earned': return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>;
      default: return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>;
    }
  };

  return (
    <div className={styles.activityItem}>
      <div className={styles.activityIcon}>{getTypeIcon()}</div>
      <div className={styles.activityContent}>
        <h4 className={styles.activityTitle}>{title}</h4>
        <span className={styles.activityTime}>{time}</span>
      </div>
    </div>
  );
}