import Search from "./Search"
import ThemeSwitcher from "./ThemeSwitcher"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { Dropdown } from "react-bootstrap"
import { logout } from "../../actions/userActions"
import { toast } from 'react-toastify'
import { ShoppingBag, User, LayoutDashboard, Package, LogOut, Heart } from 'lucide-react'

// These match the actual backend productModel category enum exactly
// Acceptable as UI config constants per data requirements (schema-level constants, not dynamic data)
const SCHEMA_CATEGORIES = [
  "PC Games",
  "PS3 Games",
  "PS4 Games",
  "Nintendo Games",
  "Xbox Games",
  "Business Books",
  "Cooking Books",
  "History Books",
  "Programming Books",
  "Sci-Fi Books",
  "Beauty & Personal Care",
  "Electronics & Gadgets",
  "Fashion & Apparel",
  "Home & Kitchen",
  "Health & Fitness",
  "Books",
  "Home Decor",
  "Kids & Toys",
  "Health & Wellness",
  "Clothing",
];

export default function Header() {
  const { isAuthenticated, user = {} } = useSelector(state => state.authState || {})
  const { items: cartItems } = useSelector(state => state.cartState || {})
  const location = useLocation()
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const logoutHandler = () => {
    dispatch(logout())
    navigate('/login')
  }

  const showLoginToast = (location.pathname === '/login' && !isAuthenticated)

  const handleCategoryClick = (category) => {
    if (!isAuthenticated && location.pathname === '/login') {
      toast.info('Please login to access', { position: 'bottom-right' })
      return
    }
    navigate(`/search/?category=${encodeURIComponent(category)}`)
  }

  return (
    <header className="site-header-wrap">
      {/* ── Main Nav ── */}
      <nav className="main-nav">

        {/* Left: Logo */}
        <div className="nav-logo">
          <Link
            to="/"
            className="logo-link"
            onClick={(e) => {
              if (showLoginToast) {
                e.preventDefault()
                toast.info('Please login to access', { position: 'bottom-right' })
              }
            }}
          >
            <span className="logo-text">VIP<span style={{ color: 'var(--accent)' }}>cart</span></span>
          </Link>
        </div>

        {/* Middle-Left: Categories from actual backend schema enum */}
        <div className="nav-categories-inline d-none d-lg-flex">
          {SCHEMA_CATEGORIES.map(cat => (
            <button
              key={cat}
              className="inline-cat-btn"
              onClick={() => handleCategoryClick(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Middle-Right: Search */}
        <div className="nav-search">
          <Search />
        </div>

        {/* Right: Actions (Profile, Wishlist, Bag) */}
        <div className="nav-actions stacked-actions">

          <ThemeSwitcher />

          {/* Profile Dropdown */}
          {isAuthenticated ? (
            <Dropdown className="user-dropdown" align="end">
              <Dropdown.Toggle as="button" className="action-stack-btn" id="user-menu-toggle">
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    style={{ width: 28, height: 28, borderRadius: '50%', objectFit: 'cover' }}
                  />
                ) : (
                  <User size={20} strokeWidth={2.5} />
                )}
                <span className="action-stack-label">Profile</span>
              </Dropdown.Toggle>

              <Dropdown.Menu className="user-menu shadow-lg border-0">
                <div className="user-menu-header">
                  <div>
                    <div className="menu-name">{user.name}</div>
                    <div className="menu-email">{user.email}</div>
                  </div>
                </div>
                <div className="menu-divider" />
                {user.role === 'admin' && (
                  <Dropdown.Item onClick={() => navigate('/admin/dashboard')} className="menu-item">
                    <LayoutDashboard size={15} /> Dashboard
                  </Dropdown.Item>
                )}
                <Dropdown.Item onClick={() => navigate('/myprofile')} className="menu-item">
                  <User size={15} /> My Profile
                </Dropdown.Item>
                <Dropdown.Item onClick={() => navigate('/orders')} className="menu-item">
                  <Package size={15} /> Orders
                </Dropdown.Item>
                <div className="menu-divider" />
                <Dropdown.Item onClick={logoutHandler} className="menu-item danger">
                  <LogOut size={15} /> Log Out
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          ) : (
            <Link to="/login" className="action-stack-btn text-decoration-none">
              <User size={20} strokeWidth={2.5} />
              <span className="action-stack-label">Login</span>
            </Link>
          )}

          {/* Wishlist */}
          <Link
            to="/myprofile?tab=wishlist"
            className="action-stack-btn text-decoration-none"
            onClick={(e) => {
              if (showLoginToast) {
                e.preventDefault()
                toast.info('Please login to access', { position: 'bottom-right' })
              }
            }}
          >
            <div className="icon-badge-wrap">
              <Heart size={20} strokeWidth={2.5} />
              {user?.wishlist?.length > 0 && (
                <span className="stacked-badge">{user.wishlist.length}</span>
              )}
            </div>
            <span className="action-stack-label">Wishlist</span>
          </Link>

          {/* Bag */}
          <Link
            to="/cart"
            className="action-stack-btn text-decoration-none"
            onClick={(e) => {
              if (showLoginToast) {
                e.preventDefault()
                toast.info('Please login to access', { position: 'bottom-right' })
              }
            }}
          >
            <div className="icon-badge-wrap">
              <ShoppingBag size={20} strokeWidth={2.5} />
              {cartItems.length > 0 && (
                <span className="stacked-badge">{cartItems.length}</span>
              )}
            </div>
            <span className="action-stack-label">Bag</span>
          </Link>
        </div>
      </nav>
    </header>
  )
}