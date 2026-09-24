import { Fragment } from "react/jsx-runtime";
import MetaData from '../layouts/MetaData'
import { useEffect, useState } from "react";
import { clearAuthError, login } from "../../actions/userActions";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Link, useLocation, useNavigate } from "react-router-dom";
import GoogleIcon from "../icons/GoogleIcon";


export default function Login() {


    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [didSubmit, setDidSubmit] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const { loading, error, isAuthenticated } = useSelector(state => state.authState);
    const params = new URLSearchParams(location.search);
    const redirectParam = params.get('redirect');
    const redirect = redirectParam ? decodeURIComponent(redirectParam) : '/';

    const submitHandler = (e) => {
        e.preventDefault();
        setDidSubmit(true);
        dispatch(login(email, password))
    }

    useEffect(() => {
        if (error) {
            setDidSubmit(false);
            toast(error, {
                position: "bottom-right",
                autoClose: 5000,
                theme: "light",
                pauseOnHover: false,
                draggable: true,
                progress: undefined,
                closeOnClick: true,
                type: 'error',
                onOpen: () => { dispatch(clearAuthError()) }
            })
            return;
        }

        if (didSubmit && !loading && isAuthenticated) {
            toast.success('Login successful', {
                position: 'bottom-right',
                autoClose: 2000,
                theme: 'light',
                pauseOnHover: false,
                draggable: true,
                progress: undefined,
                closeOnClick: true,
            });
            setDidSubmit(false);
            navigate(redirect);
        }
    }, [error, isAuthenticated, loading, navigate, dispatch, didSubmit, redirect])
    const googleLogin = () => {
        const base =
            process.env.REACT_APP_BACKEND_URL ||
            (window.location.hostname === "localhost"
                ? "http://localhost:8000"
                : window.location.origin);

        const redirect = encodeURIComponent(window.location.origin);
        window.location.href = `${base}/api/auth/google?redirect=${redirect}`;
    };




    return (
        <Fragment>
            <MetaData title={`Login`} />
            <div className="auth-container">
                <div className="auth-card">
                    <form onSubmit={submitHandler}>
                        <h2 className="auth-title">Welcome Back</h2>
                        <p className="auth-subtitle">Please sign in to your account</p>

                        <div className="form-group">
                            <label htmlFor="email_field">Email Address</label>
                            <input
                                type="email"
                                id="email_field"
                                className="form-control"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                placeholder="name@example.com"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="password_field">Password</label>
                            <input
                                type="password"
                                id="password_field"
                                className="form-control"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                placeholder="••••••••"
                                autoComplete="current-password"
                                required
                            />
                        </div>

                        <div className="auth-links">
                            <Link to="/password/forget" className="auth-link">Forgot Password?</Link>
                        </div>

                        <button
                            id="login_button"
                            type="submit"
                            className="da-btn da-btn-primary w-100 py-3 mt-3"
                            disabled={loading}
                        >
                            {loading ? "Logging in..." : "Login"}
                        </button>
                        
                        <div className="auth-divider">
                            <span>or continue with</span>
                        </div>

                        <button
                            type="button"
                            onClick={googleLogin}
                            className="da-btn da-btn-outline w-100 py-3 d-flex align-items-center justify-content-center gap-2 google-btn"
                        >
                            <GoogleIcon size={20} />
                            <span>Google</span>
                        </button>

                        <div className="auth-footer mt-4 text-center">
                            <span className="text-muted">New here? </span>
                            <Link to="/register" className="auth-link fw-bold">Create an account</Link>
                        </div>
                    </form>
                </div>
            </div>
        </Fragment>
    )
}