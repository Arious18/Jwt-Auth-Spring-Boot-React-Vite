import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Eye, EyeOff, Mail, Lock, ArrowRight } from 'lucide-react';
import { useAuth } from '../../Auth/components/AuthContext.jsx'; // Adjust path as needed

export const LoginPage = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [floatingElements, setFloatingElements] = useState([]);
    const [hoveredButton, setHoveredButton] = useState(null);

    const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

    useEffect(() => {
        const elements = Array.from({ length: 6 }, (_, i) => ({
            id: i,
            x: Math.random() * 100,
            y: Math.random() * 100,
            size: Math.random() * 60 + 20,
            duration: Math.random() * 20 + 15
        }));
        setFloatingElements(elements);
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const payload = {
            email: formData.email,
            password: formData.password,
        };

        console.log('Login payload:', { email: payload.email, passwordLength: payload.password.length });

        try {
            const response = await axios.post(`${API_BASE_URL}/auth/login`, payload, {
                headers: { 'Content-Type': 'application/json' },
                withCredentials: true,
            });

            console.log('Login response status:', response.status);

            if (response.data && response.data.token) {
                const userData = {
                    token: response.data.token,
                    userId: response.data.userId,
                    name: response.data.name,
                    email: response.data.email,
                    access: response.data.access,
                };

                login(userData);
                console.log('Login successful, redirecting to home');
                navigate('/');
            } else {
                console.error('Invalid response format:', response.data);
                setError('Invalid response from server');
            }
        } catch (error) {
            console.error('Login error:', {
                message: error.message,
                status: error.response?.status,
                data: error.response?.data,
            });

            if (error.response?.status === 401) {
                setError('Invalid email or password');
            } else if (error.response?.data) {
                setError(typeof error.response.data === 'string'
                    ? error.response.data
                    : 'Login failed. Please try again.');
            } else {
                setError('Unable to connect to server. Please check your network connection.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const styles = {
        container: {
            minHeight: '100vh',
            position: 'relative',
            overflow: 'hidden',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem'
        },
        background: {
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        },
        floatingElement: {
            position: 'absolute',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            animation: 'float 20s ease-in-out infinite alternate'
        },
        gridOverlay: {
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: 0.1,
            backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.3) 1px, transparent 1px)',
            backgroundSize: '50px 50px'
        },
        loginContent: {
            position: 'relative',
            zIndex: 10,
            background: 'rgba(255, 255, 255, 0.12)',
            backdropFilter: 'blur(25px)',
            border: '1px solid rgba(255, 255, 255, 0.18)',
            borderRadius: '24px',
            padding: '3rem',
            width: '100%',
            maxWidth: '420px',
            textAlign: 'center',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.2)'
        },
        title: {
            fontSize: '2.5rem',
            fontWeight: '800',
            color: 'white',
            marginBottom: '0.5rem',
            letterSpacing: '-0.02em'
        },
        subtitle: {
            fontSize: '1.1rem',
            color: 'rgba(255, 255, 255, 0.8)',
            marginBottom: '2.5rem',
            lineHeight: '1.5'
        },
        form: {
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem'
        },
        formGroup: {
            textAlign: 'left'
        },
        label: {
            display: 'block',
            fontSize: '0.95rem',
            fontWeight: '600',
            color: 'white',
            marginBottom: '0.5rem'
        },
        inputGroup: {
            position: 'relative'
        },
        inputIcon: {
            position: 'absolute',
            left: '1rem',
            top: '50%',
            transform: 'translateY(-50%)',
            color: 'rgba(255, 255, 255, 0.6)',
            zIndex: 2
        },
        input: {
            width: '100%',
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '12px',
            padding: '1rem 1rem 1rem 2.5rem',
            fontSize: '1rem',
            color: 'white',
            outline: 'none',
            transition: 'all 0.3s ease',
            '::placeholder': {
                color: 'rgba(255, 255, 255, 0.5)'
            }
        },
        passwordToggle: {
            position: 'absolute',
            right: '1rem',
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'none',
            border: 'none',
            color: 'rgba(255, 255, 255, 0.6)',
            cursor: 'pointer',
            padding: '0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'color 0.2s ease'
        },
        loginButton: {
            background: 'linear-gradient(45deg, #00f5ff, #8a2be2)',
            color: 'white',
            border: 'none',
            padding: '1rem 2rem',
            borderRadius: '12px',
            fontSize: '1.1rem',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            boxShadow: '0 8px 25px rgba(0, 245, 255, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            marginTop: '1rem',
            userSelect: 'none'
        },
        signupPrompt: {
            marginTop: '2rem',
            fontSize: '0.95rem',
            color: 'rgba(255, 255, 255, 0.8)'
        },
        signupLink: {
            color: '#00f5ff',
            textDecoration: 'none',
            fontWeight: '600',
            transition: 'color 0.2s ease'
        },
        errorMessage: {
            background: 'rgba(239, 68, 68, 0.15)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '8px',
            padding: '0.75rem',
            color: '#fca5a5',
            fontSize: '0.9rem',
            marginBottom: '1rem'
        }
    };

    return (
        <div style={styles.container}>
            {/* CSS Animations */}
            <style>{`
                @keyframes float {
                    0% { transform: translateY(0px) rotate(0deg); }
                    100% { transform: translateY(-30px) rotate(360deg); }
                }
                
                .login-input:focus {
                    border-color: rgba(0, 245, 255, 0.5) !important;
                    box-shadow: 0 0 0 3px rgba(0, 245, 255, 0.1) !important;
                }
                
                .login-input::placeholder {
                    color: rgba(255, 255, 255, 0.5) !important;
                }
                
                .password-toggle:hover {
                    color: rgba(255, 255, 255, 0.9) !important;
                }
                
                .signup-link:hover {
                    color: #8a2be2 !important;
                }
            `}</style>

            {/* Animated Background */}
            <div style={styles.background}>
                <div style={styles.gridOverlay} />

                {/* Floating Elements */}
                {floatingElements.map((element) => (
                    <div
                        key={element.id}
                        style={{
                            ...styles.floatingElement,
                            left: `${element.x}%`,
                            top: `${element.y}%`,
                            width: `${element.size}px`,
                            height: `${element.size}px`,
                            animationDuration: `${element.duration}s`
                        }}
                    />
                ))}
            </div>

            {/* Login Form */}
            <div style={styles.loginContent}>
                <h1 style={styles.title}>Welcome Back</h1>
                <p style={styles.subtitle}>
                    Enter your credentials to access your account
                </p>

                {error && (
                    <div style={styles.errorMessage}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} style={styles.form}>
                    <div style={styles.formGroup}>
                        <label htmlFor="email" style={styles.label}>Email</label>
                        <div style={styles.inputGroup}>
                            <Mail style={styles.inputIcon} size={18} />
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="name@company.com"
                                required
                                className="login-input"
                                style={styles.input}
                            />
                        </div>
                    </div>

                    <div style={styles.formGroup}>
                        <label htmlFor="password" style={styles.label}>Password</label>
                        <div style={styles.inputGroup}>
                            <Lock style={styles.inputIcon} size={18} />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="••••••••"
                                required
                                className="login-input"
                                style={styles.input}
                            />
                            <button
                                type="button"
                                className="password-toggle"
                                style={styles.passwordToggle}
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            ...styles.loginButton,
                            ...(hoveredButton === 'login' ? {
                                transform: 'translateY(-2px)',
                                boxShadow: '0 12px 35px rgba(0, 245, 255, 0.4)'
                            } : {})
                        }}
                        onMouseEnter={() => setHoveredButton('login')}
                        onMouseLeave={() => setHoveredButton(null)}
                    >
                        {loading ? 'Signing in...' : 'Sign in'}
                        {!loading && <ArrowRight size={18} />}
                    </button>
                </form>

                <p style={styles.signupPrompt}>
                    Don't have an account?{' '}
                    <a href="/register" style={styles.signupLink} className="signup-link">
                        Create account
                    </a>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;