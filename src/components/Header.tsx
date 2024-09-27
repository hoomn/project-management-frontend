import useAuthUser from "react-auth-kit/hooks/useAuthUser";
import useIsAuthenticated from "react-auth-kit/hooks/useIsAuthenticated";
import useSignOut from "react-auth-kit/hooks/useSignOut";
import { Link, NavLink, useNavigate } from "react-router-dom";

import Container from "react-bootstrap/Container";
import Dropdown from "react-bootstrap/Dropdown";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";

import Icon from "./Icon";
import Version from "./Version";

export default function Header() {
  const isAuthenticated = useIsAuthenticated();
  const currentUser: UserProps | null = useAuthUser();
  const navigate = useNavigate();
  const signOut = useSignOut();

  const handleSignOut = () => {
    signOut();
    navigate("/login");
  };

  return (
    <Navbar expand="lg" className="bg-dark" data-bs-theme="dark">
      <Container>
        <Link to="/" className="navbar-brand">
          PM
        </Link>
        {isAuthenticated && (
          <>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="me-auto">
                <NavLink className="nav-link" to="/projects">
                  Projects
                </NavLink>
                <NavLink className="nav-link" to="/tasks">
                  Tasks
                </NavLink>
                <NavLink className="nav-link" to="/my-tasks">
                  My Tasks
                </NavLink>
              </Nav>
              <Dropdown drop="start">
                <Dropdown.Toggle className="btn-sm no-toggle-icon" variant="">
                  <div className="avatar bg-light text-dark">
                    <span>{currentUser?.initial}</span>
                  </div>
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Link key={0} className="dropdown-item" to="/profile">
                    <Icon icon={"person-bounding-box"} />
                    profile
                  </Link>
                  <button key={1} className="dropdown-item" onClick={handleSignOut}>
                    <Icon icon={"power"} />
                    sign out
                  </button>
                  <hr className="dropdown-divider mb-1" />
                  <div className="text-center">
                    <Version />
                  </div>
                </Dropdown.Menu>
              </Dropdown>
            </Navbar.Collapse>
          </>
        )}
      </Container>
    </Navbar>
  );
}
