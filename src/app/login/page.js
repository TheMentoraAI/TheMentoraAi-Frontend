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
            <div className={styles.spaceBackground}>
                <div className={styles.stars}></div>
                <div className={styles.stars2}></div>
                <div className={styles.stars3}></div>
            </div>

            {/* Main Container */}
            <div className={styles.container}>
                {/* Login Card */}
                <div className={styles.loginCard}>
                    <div className={styles.cardGlow}></div>
                    
                    {/* Header */}
                    <div className={styles.header}>
                        <div className={styles.logo}>
                            <div className={styles.logoIcon}>🚀</div>
                        </div>
                        <h1 className={styles.title}>Welcome Back!</h1>
                        <p className={styles.subtitle}>Continue your journey to AI mastery</p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className={styles.form}>
                        {error && (
                            <div className={styles.errorMessage}>
                                <span className={styles.errorIcon}>⚠️</span>
                                <span>{error}</span>
                            </div>
                        )}

                        {/* Username Input */}
                        <div className={styles.inputGroup}>
                            <label htmlFor="username" className={styles.label}>
                                Username
                            </label>
                            <div className={styles.inputWrapper}>
                                <span className={styles.inputIcon}>👤</span>
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
                                <span className={styles.inputIcon}>🔒</span>
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
                    <div className={styles.footer}>
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
                                <div className={styles.statIcon}>👥</div>
                                <div className={styles.statContent}>
                                    <span className={styles.statNumber}>500+</span>
                                    <span className={styles.statLabel}>Active Learners</span>
                                </div>
                            </div>
                            <div className={styles.stat}>
                                <div className={styles.statIcon}>🎯</div>
                                <div className={styles.statContent}>
                                    <span className={styles.statNumber}>98%</span>
                                    <span className={styles.statLabel}>Success Rate</span>
                                </div>
                            </div>
                            <div className={styles.stat}>
                                <div className={styles.statIcon}>🚀</div>
                                <div className={styles.statContent}>
                                    <span className={styles.statNumber}>24/7</span>
                                    <span className={styles.statLabel}>AI Guidance</span>
                                </div>
                            </div>
                        </div>

                        {/* Test Credentials */}
                        <div className={styles.testCredentials}>
                            <div className={styles.testHeader}>
                                <span className={styles.testIcon}>🧪</span>
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
                                <span className={styles.featureIcon}>🤖</span>
                                <span className={styles.featureText}>AI-Powered Learning</span>
                            </div>
                            <div className={styles.feature}>
                                <span className={styles.featureIcon}>📊</span>
                                <span className={styles.featureText}>Progress Tracking</span>
                            </div>
                            <div className={styles.feature}>
                                <span className={styles.featureIcon}>🏆</span>
                                <span className={styles.featureText}>Gamified Experience</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}