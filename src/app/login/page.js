"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import useAuth from '../hooks/useAuth';
import styles from './login.module.css';

export default function LoginPage() {
    const router = useRouter();
    const { login, isAuthenticated, error: authError } = useAuth();
    const [formData, setFormData] = useState({
        username: '',
        password: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);

    // Redirect if already logged in
    useEffect(() => {
        if (isAuthenticated) {
            router.push('/home');
        }
    }, [isAuthenticated, router]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        if (!formData.username || !formData.password) {
            setError('Please fill in all fields');
            setLoading(false);
            return;
        }

        const result = await login(formData.username, formData.password);

        if (result.success) {
            router.push('/home');
        } else {
            setError(result.error || 'Login failed');
        }

        setLoading(false);
    };

    return (
        <div className={styles.page}>
            {/* Animated Space Background */}
            <div className={styles.spaceBackground} style={{ pointerEvents: 'none' }}>
                <div className={styles.stars}></div>
                <div className={styles.stars2}></div>
                <div className={styles.stars3}></div>
            </div>

            {/* Main Container */}
            <div className={styles.container}>
                {/* Login Card */}
                <div className={styles.loginCard}>
                    <div className={styles.cardGlow} style={{ pointerEvents: 'none' }}></div>
                    
                    {/* Header */}
                    <div className={styles.header}>
                        <div className={styles.logo}>
                            <div className={styles.logoIcon}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/></svg>
                            </div>
                        </div>
                        <h1 className={styles.title}>Welcome Back!</h1>
                        <p className={styles.subtitle}>Continue your journey to AI mastery</p>
                    </div>

                    {/* Form */}
                    <form style={{position: 'relative', zIndex: 10}} onSubmit={handleSubmit} className={styles.form}>
                        {error && (
                            <div className={styles.errorMessage}>
                                <span className={styles.errorIcon}>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                                </span>
                                <span>{error}</span>
                            </div>
                        )}

                        {/* Username Input */}
                        <div className={styles.inputGroup}>
                            <label htmlFor="username" className={styles.label}>
                                Username
                            </label>
                            <div className={styles.inputWrapper}>
                                <span className={styles.inputIcon}>
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                                </span>
                                <input
                                    type="text"
                                    id="username"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    className={styles.input}
                                    placeholder="Enter your username"
                                    disabled={loading}
                                    autoComplete="username"
                                />
                            </div>
                        </div>

                        {/* Password Input */}
                        <div className={styles.inputGroup}>
                            <label htmlFor="password" className={styles.label}>
                                Password
                            </label>
                            <div className={styles.inputWrapper}>
                                <span className={styles.inputIcon}>
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                                </span>
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className={styles.input}
                                    placeholder="Enter your password"
                                    disabled={loading}
                                    autoComplete="current-password"
                                />
                            </div>
                        </div>

                        {/* Options */}
                        <div className={styles.options}>
                            <label className={styles.rememberMe}>
                                <input
                                    type="checkbox"
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                    className={styles.checkbox}
                                />
                                <span className={styles.checkboxLabel}>Remember me</span>
                            </label>
                            <Link href="/forgot-password" className={styles.forgotPassword}>
                                Forgot Password?
                            </Link>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className={styles.submitButton}
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <span className={styles.spinner}></span>
                                    Launching...
                                </>
                            ) : (
                                'Access Mission Control'
                            )}
                        </button>

                        {/* Divider */}
                        {/* <div className={styles.divider}>
                            <span className={styles.dividerLine}></span>
                            <span className={styles.dividerText}>or continue with</span>
                            <span className={styles.dividerLine}></span>
                        </div> */}

                        {/* Social Login */}
                        {/* <div className={styles.socialLogin}>
                            <button type="button" className={styles.socialButton}>
                                <span className={styles.socialIcon}>🐦</span>
                                <span>Twitter</span>
                            </button>
                            <button type="button" className={styles.socialButton}>
                                <span className={styles.socialIcon}>🔍</span>
                                <span>Google</span>
                            </button>
                        </div> */}
                    </form>

                    {/* Footer */}
                    <div className={styles.footer} style={{ position: 'relative', zIndex: 10 }}>
                        <p className={styles.footerText}>
                            New to AI Mentora?{' '}
                            <Link href="/register" className={styles.link}>
                                Start Your Journey
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Info Panel */}
                <div className={styles.infoPanel}>
                    <div className={styles.infoContent}>
                        <h3 className={styles.infoTitle}>Mission Status</h3>
                        
                        <div className={styles.statsCard}>
                            <div className={styles.stat}>
                                <div className={styles.statIcon}>
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                                </div>
                                <div className={styles.statContent}>
                                    <span className={styles.statNumber}>500+</span>
                                    <span className={styles.statLabel}>Active Learners</span>
                                </div>
                            </div>
                            <div className={styles.stat}>
                                <div className={styles.statIcon}>
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>
                                </div>
                                <div className={styles.statContent}>
                                    <span className={styles.statNumber}>98%</span>
                                    <span className={styles.statLabel}>Success Rate</span>
                                </div>
                            </div>
                            <div className={styles.stat}>
                                <div className={styles.statIcon}>
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/></svg>
                                </div>
                                <div className={styles.statContent}>
                                    <span className={styles.statNumber}>24/7</span>
                                    <span className={styles.statLabel}>AI Guidance</span>
                                </div>
                            </div>
                        </div>

                        {/* Test Credentials */}
                        <div className={styles.testCredentials}>
                            <div className={styles.testHeader}>
                                <span className={styles.testIcon}>
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 2v7.31"/><path d="M14 9.3V1.99"/><path d="M8.5 2h7"/><path d="M14 9.3a6.5 6.5 0 1 1-4 0"/><line x1="5.52" y1="16" x2="18.48" y2="16"/></svg>
                                </span>
                                <h4 className={styles.testTitle}>Test Credentials</h4>
                            </div>
                            <div className={styles.testInfo}>
                                <div className={styles.testField}>
                                    <span className={styles.testLabel}>Username:</span>
                                    <code className={styles.testValue}>testuser</code>
                                </div>
                                <div className={styles.testField}>
                                    <span className={styles.testLabel}>Password:</span>
                                    <code className={styles.testValue}>test123</code>
                                </div>
                            </div>
                            <p className={styles.testNote}>
                                Use these credentials to test the platform without registration
                            </p>
                        </div>

                        {/* Features */}
                        <div className={styles.features}>
                            <div className={styles.feature}>
                                <span className={styles.featureIcon}>
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="10" rx="2"/><circle cx="12" cy="5" r="2"/><path d="M12 7v4"/><line x1="8" y1="16" x2="8" y2="16"/><line x1="16" y1="16" x2="16" y2="16"/></svg>
                                </span>
                                <span className={styles.featureText}>AI-Powered Learning</span>
                            </div>
                            <div className={styles.feature}>
                                <span className={styles.featureIcon}>
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
                                </span>
                                <span className={styles.featureText}>Progress Tracking</span>
                            </div>
                            <div className={styles.feature}>
                                <span className={styles.featureIcon}>
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>
                                </span>
                                <span className={styles.featureText}>Gamified Experience</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}