"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import useAuth from '../hooks/useAuth';
import styles from './register.module.css';

export default function RegisterPage() {
    const router = useRouter();
    const { register, isAuthenticated } = useAuth();
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        display_name: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState(0);

    // Redirect if already logged in
    useEffect(() => {
        if (isAuthenticated) {
            router.push('/home');
        }
    }, [isAuthenticated, router]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
        
        if (name === 'password') {
            calculatePasswordStrength(value);
        }
        
        setError('');
    };

    const calculatePasswordStrength = (password) => {
        let strength = 0;
        if (password.length >= 6) strength += 1;
        if (password.length >= 8) strength += 1;
        if (/[A-Z]/.test(password)) strength += 1;
        if (/[0-9]/.test(password)) strength += 1;
        if (/[^A-Za-z0-9]/.test(password)) strength += 1;
        setPasswordStrength(strength);
    };

    const validateForm = () => {
        if (!formData.username || !formData.email || !formData.password) {
            setError('Please fill in all required fields');
            return false;
        }

        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters');
            return false;
        }

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            setError('Please enter a valid email address');
            return false;
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!validateForm()) {
            return;
        }

        setLoading(true);

        const result = await register({
            username: formData.username,
            email: formData.email,
            password: formData.password,
            display_name: formData.display_name || formData.username,
        });

        if (result.success) {
            router.push('/home');
        } else {
            setError(result.error || 'Registration failed');
        }

        setLoading(false);
    };

    const getStrengthColor = () => {
        if (passwordStrength === 0) return '#ef4444';
        if (passwordStrength <= 2) return '#f59e0b';
        if (passwordStrength <= 3) return '#10b981';
        return '#00d4ff';
    };

    return (
        <div className={styles.page}>
            {/* Animated Space Background */}
            <div className={styles.spaceBackground} style={{ pointerEvents: 'none' }}>
                <div className={styles.stars}></div>
                <div className={styles.stars2}></div>
                <div className={styles.stars3}></div>
            </div>

            {/* Register Container */}
            <div className={styles.container}>
                <div className={styles.registerCard}>
                    <div className={styles.cardGlow} style={{ pointerEvents: 'none' }}></div>
                    
                    {/* Header */}
                    <div className={styles.header}>
                        <div className={styles.logo}>
                            <div className={styles.logoIcon}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/></svg>
                            </div>
                        </div>
                        <h1 className={styles.title}>Join The Mentora AI</h1>
                        <p className={styles.subtitle}>Begin your journey to AI mastery</p>
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

                        <div className={styles.inputGrid}>
                            {/* Username */}
                            <div className={styles.inputGroup}>
                                <label htmlFor="username" className={styles.label}>
                                    <span className={styles.labelText}>Username</span>
                                    <span className={styles.required}>*</span>
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
                                        placeholder="Choose your username"
                                        disabled={loading}
                                        autoComplete="username"
                                    />
                                </div>
                            </div>

                            {/* Email */}
                            <div className={styles.inputGroup}>
                                <label htmlFor="email" className={styles.label}>
                                    <span className={styles.labelText}>Email</span>
                                    <span className={styles.required}>*</span>
                                </label>
                                <div className={styles.inputWrapper}>
                                    <span className={styles.inputIcon}>
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                                    </span>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className={styles.input}
                                        placeholder="your.email@example.com"
                                        disabled={loading}
                                        autoComplete="email"
                                    />
                                </div>
                            </div>

                            {/* Display Name */}
                            <div className={styles.inputGroup}>
                                <label htmlFor="display_name" className={styles.label}>
                                    <span className={styles.labelText}>Display Name</span>
                                    <span className={styles.optional}>(optional)</span>
                                </label>
                                <div className={styles.inputWrapper}>
                                    <span className={styles.inputIcon}>
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                                    </span>
                                    <input
                                        type="text"
                                        id="display_name"
                                        name="display_name"
                                        value={formData.display_name}
                                        onChange={handleChange}
                                        className={styles.input}
                                        placeholder="What should we call you?"
                                        disabled={loading}
                                    />
                                </div>
                            </div>

                            {/* Password */}
                            <div className={styles.inputGroup}>
                                <label htmlFor="password" className={styles.label}>
                                    <span className={styles.labelText}>Password</span>
                                    <span className={styles.required}>*</span>
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
                                        placeholder="Create a strong password"
                                        disabled={loading}
                                        autoComplete="new-password"
                                    />
                                </div>
                                {formData.password && (
                                    <div className={styles.passwordStrength}>
                                        <div className={styles.strengthBar}>
                                            <div 
                                                className={styles.strengthFill}
                                                style={{
                                                    width: `${(passwordStrength / 5) * 100}%`,
                                                    backgroundColor: getStrengthColor()
                                                }}
                                            ></div>
                                        </div>
                                        <span className={styles.strengthText}>
                                            {passwordStrength <= 2 ? 'Weak' : 
                                             passwordStrength <= 3 ? 'Good' : 
                                             'Strong'}
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Confirm Password */}
                            <div className={styles.inputGroup}>
                                <label htmlFor="confirmPassword" className={styles.label}>
                                    <span className={styles.labelText}>Confirm Password</span>
                                    <span className={styles.required}>*</span>
                                </label>
                                <div className={styles.inputWrapper}>
                                    <span className={styles.inputIcon}>
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                                    </span>
                                    <input
                                        type="password"
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        className={styles.input}
                                        placeholder="Re-enter your password"
                                        disabled={loading}
                                        autoComplete="new-password"
                                    />
                                </div>
                            </div>
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
                                    Creating Account...
                                </>
                            ) : (
                                'Launch Your Journey'
                            )}
                        </button>

                        {/* Terms */}
                        <div className={styles.terms}>
                            <p className={styles.termsText}>
                                By creating an account, you agree to our{' '}
                                <a href="#" className={styles.termsLink}>Terms</a> and{' '}
                                <a href="#" className={styles.termsLink}>Privacy Policy</a>
                            </p>
                        </div>
                    </form>

                    {/* Footer */}
                    <div className={styles.footer} style={{ position: 'relative', zIndex: 10 }}>
                        <p className={styles.footerText}>
                            Already have an account?{' '}
                            <Link href="/login" className={styles.link}>
                                Sign In Now
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Side Info Panel */}
                <div className={styles.infoPanel}>
                    <div className={styles.infoContent}>
                        <h3 className={styles.infoTitle}>Why Join AI Mentora?</h3>
                        
                        <div className={styles.infoList}>
                            <div className={styles.infoItem}>
                                <span className={styles.infoIcon}>
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/></svg>
                                </span>
                                <div>
                                    <h4>Personalized Learning</h4>
                                    <p>AI-powered paths based on your goals</p>
                                </div>
                            </div>
                            
                            <div className={styles.infoItem}>
                                <span className={styles.infoIcon}>
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="10" rx="2"/><circle cx="12" cy="5" r="2"/><path d="M12 7v4"/><line x1="8" y1="16" x2="8" y2="16"/><line x1="16" y1="16" x2="16" y2="16"/></svg>
                                </span>
                                <div>
                                    <h4>Real AI Practice</h4>
                                    <p>Learn by doing with actual AI tools</p>
                                </div>
                            </div>
                            
                            <div className={styles.infoItem}>
                                <span className={styles.infoIcon}>
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
                                </span>
                                <div>
                                    <h4>Progress Tracking</h4>
                                    <p>Monitor your growth and achievements</p>
                                </div>
                            </div>
                            
                            <div className={styles.infoItem}>
                                <span className={styles.infoIcon}>
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>
                                </span>
                                <div>
                                    <h4>Gamified Experience</h4>
                                    <p>Earn XP, unlock levels, and compete</p>
                                </div>
                            </div>
                        </div>

                        <div className={styles.stats}>
                            <div className={styles.stat}>
                                <span className={styles.statNumber}>500+</span>
                                <span className={styles.statLabel}>Active Learners</span>
                            </div>
                            <div className={styles.stat}>
                                <span className={styles.statNumber}>98%</span>
                                <span className={styles.statLabel}>Satisfaction</span>
                            </div>
                            <div className={styles.stat}>
                                <span className={styles.statNumber}>100+</span>
                                <span className={styles.statLabel}>AI Tools</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}