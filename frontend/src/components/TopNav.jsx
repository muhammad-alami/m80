import { NavLink, useNavigate } from 'react-router-dom';

function TopNav() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Phase 5: we will clear the JWT token here.
    // For now, just send user to login page.
    navigate('/login');
  };

  return (
    <header>
      <nav aria-label="Main navigation">
        <h1>M80</h1>
        <ul>
          <li>
            <NavLink to="/dashboard">Dashboard</NavLink>
          </li>
          <li>
            <NavLink to="/summary">Summary</NavLink>
          </li>
          <li>
            <NavLink to="/reports">Reports</NavLink>
          </li>
        </ul>
        <button type="button" onClick={handleLogout}>
          Logout
        </button>
      </nav>
    </header>
  );
}

export default TopNav;