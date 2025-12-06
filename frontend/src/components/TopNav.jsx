import { NavLink, useNavigate } from 'react-router-dom';

function TopNav() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear JWT from localStorage and send user back to login
    localStorage.removeItem('token');
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
