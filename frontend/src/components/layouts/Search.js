import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { Search as SearchIcon } from 'lucide-react';

export default function Search() {
  const navigate = useNavigate();
  const location = useLocation();
  const [keyword, setKeyword] = useState("");
  const { isAuthenticated } = useSelector(state => state.authState || {});

  const searchHandler = (e) => {
    e.preventDefault();
    if (location.pathname === '/login' && !isAuthenticated) {
      toast.info('Please login to access', { position: 'bottom-right' });
      return;
    }
    navigate(`/search/${keyword}`);
  };

  const clearKeyword = () => setKeyword("");

  useEffect(() => {
    if (location.pathname === "/") clearKeyword();
  }, [location.pathname]);

  return (
    <form onSubmit={searchHandler} className="search-form">
      <div className="search-input-wrap">
        <SearchIcon size={17} className="search-icon-left" />
        <input
          type="text"
          id="search_field"
          className="search-input"
          placeholder="Search products, brands, categories..."
          onChange={(e) => setKeyword(e.target.value)}
          value={keyword}
          autoComplete="off"
        />
        <button type="submit" id="search_btn" className="search-submit-btn" aria-label="Search">
          Search
        </button>
      </div>
    </form>
  );
}