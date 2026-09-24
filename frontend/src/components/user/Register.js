import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux";
import { clearAuthError, register } from "../../actions/userActions";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import GoogleIcon from "../icons/GoogleIcon";

export default function Register() {


    const [userData, setUserData] = useState({
        name: "",
        email: "",
        password: "",
    });

    const [avatar, setAvatar] = useState("");
    const [avatarPreview, setAvatarPreview] = useState("/images/default_avatar.png");
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error, isAuthenticated } = useSelector(state => state.authState)

    const onChange = (e) => {
        if (e.target.name === 'avatar') {
            const reader = new FileReader;
            reader.onload = () => {
                if (reader.readyState === 2) {
                    setAvatarPreview(reader.result);
                    setAvatar(e.target.files[0]);

                }
            };

            reader.readAsDataURL(e.target.files[0])
        }
        else {
            setUserData({ ...userData, [e.target.name]: e.target.value })
        }
    };


    const submitHandler = (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('name', userData.name);
        formData.append('email', userData.email);
        formData.append('password', userData.password);
        formData.append('avatar', avatar);

        dispatch(register(formData));
    }

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/');
            return
        }

        if (error) {
            toast(error, {
                position: "bottom-right",
                autoClose: 5000,
                theme: "light",
                pauseOnHover: false,
                draggable: true,
                progress: undefined,
                closeOnClick: true,
                type: 'error',
                onOpen: () => { dispatch(clearAuthError) }
            })
            return;
        }

    }, [error, isAuthenticated, dispatch, navigate])

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
        <div className="auth-container">
            <div className="auth-card">
                <form onSubmit={submitHandler} encType='multipart/form-data'>
                    <h2 className="auth-title">Create Account</h2>
                    <p className="auth-subtitle">Join us and start shopping</p>

                    <div className="form-group">
                        <label htmlFor="name_field">Full Name</label>
                        <input 
                            name="name" 
                            onChange={onChange} 
                            type="text" 
                            id="name_field" 
                            className="form-control" 
                            value={userData.name} 
                            placeholder="John Doe"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="email_field">Email Address</label>
                        <input
                            type="email"
                            name="email"
                            onChange={onChange}
                            id="email_field"
                            className="form-control"
                            value={userData.email}
                            placeholder="name@example.com"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password_field">Password</label>
                        <input
                            type="password"
                            name="password"
                            onChange={onChange}
                            id="password_field"
                            className="form-control"
                            value={userData.password}
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <div className='form-group mb-4'>
                        <label htmlFor='avatar_upload'>Profile Picture (Optional)</label>
                        <div className='d-flex align-items-center gap-3 mt-2'>
                            <figure className='avatar item-rtl m-0'>
                                <img
                                    src={avatarPreview}
                                    className='rounded-circle'
                                    alt='Avatar Preview'
                                    style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                                />
                            </figure>
                            <div className='custom-file flex-grow-1'>
                                <input
                                    type='file'
                                    name='avatar'
                                    onChange={onChange}
                                    className='custom-file-input'
                                    id='customFile'
                                />
                                <label className='custom-file-label m-0' htmlFor='customFile'>
                                    Choose File
                                </label>
                            </div>
                        </div>
                    </div>

                    <button
                        id="register_button"
                        type="submit"
                        className="da-btn da-btn-primary w-100 py-3"
                        disabled={loading}
                    >
                        {loading ? "Registering..." : "Create Account"}
                    </button>

                    <div className="auth-divider mt-4">
                        <span>or sign up with</span>
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
                        <span className="text-muted">Already have an account? </span>
                        <Link to="/login" className="auth-link fw-bold">Sign In</Link>
                    </div>
                </form>
            </div>
        </div>
    )
}