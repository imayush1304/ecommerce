import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { logout } from "../../actions/userActions";
import { Home, Search, ShoppingCart, User, LayoutDashboard } from "lucide-react";

export default function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { items = [] } = useSelector(state => state.cartState || {});
  const { isAuthenticated, user = {} } = useSelector(state => state.authState || {});

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bottom-nav" role="navigation" aria-label="Mobile navigation">

      <Link to="/" className={`bnav-item${isActive("/") ? " bnav-active" : ""}`} id="bnav-home">
        <Home size={22} />
        <span>Home</span>
        {isActive("/") && <span className="bnav-indicator" />}
      </Link>

      <Link to="/search/" className={`bnav-item${location.pathname.startsWith("/search") ? " bnav-active" : ""}`} id="bnav-search">
        <Search size={22} />
        <span>Search</span>
        {location.pathname.startsWith("/search") && <span className="bnav-indicator" />}
      </Link>

      <Link
        to="/cart"
        className={`bnav-item bnav-cart-item${isActive("/cart") ? " bnav-active" : ""}`}
        id="bnav-cart"
      >
        <div className="bnav-cart-bubble">
          <ShoppingCart size={24} />
          {items.length > 0 && <span className="bnav-cart-count">{items.length}</span>}
        </div>
      </Link>

      <Link
        to={isAuthenticated ? "/myprofile" : "/login"}
        className={`bnav-item${isActive("/myprofile") ? " bnav-active" : ""}`}
        id="bnav-profile"
      >
        {isAuthenticated && user?.avatar ? (
          <img src={user.avatar} alt={user.name} className="bnav-avatar" />
        ) : (
          <User size={22} />
        )}
        <span>Profile</span>
        {isActive("/myprofile") && <span className="bnav-indicator" />}
      </Link>

      {user?.role === "admin" && (
        <Link
          to="/admin/dashboard"
          className={`bnav-item${isActive("/admin/dashboard") ? " bnav-active" : ""}`}
          id="bnav-admin"
        >
          <LayoutDashboard size={22} />
          <span>Admin</span>
          {isActive("/admin/dashboard") && <span className="bnav-indicator" />}
        </Link>
      )}
    </nav>
  );
}
