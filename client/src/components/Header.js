import React, { useState } from "react";
import {
  MDBNavbar,
  MDBContainer,
  MDBIcon,
  MDBNavbarNav,
  MDBNavbarItem,
  MDBNavbarLink,
  MDBNavbarToggler,
  MDBCollapse,
  MDBNavbarBrand,
} from "mdb-react-ui-kit";
import { useSelector, useDispatch } from "react-redux";
import { setLogout } from "../redux/features/authSlice";
import { searchTours } from "../redux/features/tourSlice";
import { useNavigate } from "react-router-dom";
import decode from "jwt-decode";

const Header = () => {
  const [show, setShow] = useState(false);
  const [search, setSearch] = useState("");
  const { user } = useSelector((state) => ({ ...state.auth }));
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = user?.token;

  if (token) {
    const decodedToken = decode(token);
    if (decodedToken.exp * 1000 < new Date().getTime()) {
      dispatch(setLogout());
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (search) {
      dispatch(searchTours(search));
      navigate(`/tours/search?searchQuery=${search}`);
      setSearch("");
    } else {
      navigate("/");
    }
  };

  const handleLogout = () => {
    dispatch(setLogout());
  };

  // CSS intégré en ligne
  const styles = {
    navbar: {
      backgroundColor: "#f0e6ea",
      padding: "15px 30px",
      borderBottom: "2px solid #d1b7d0",
      boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
    },
    brand: {
      color: "#4b4b4d",
      fontWeight: "700",
      fontSize: "24px",
      letterSpacing: "2px",
    },
    navbarItem: {
      marginRight: "20px",
    },
    navbarLink: {
      color: "#4b4b4d",
      fontSize: "18px",
      fontWeight: "500",
      transition: "color 0.3s",
    },
    navbarLinkHover: {
      color: "#ff6f61",
    },
    searchInput: {
      padding: "8px 12px",
      borderRadius: "20px",
      border: "1px solid #d1b7d0",
      outline: "none",
      fontSize: "16px",
      transition: "border-color 0.3s ease",
    },
    searchIcon: {
      cursor: "pointer",
      color: "#ff6f61",
      fontSize: "20px",
      marginTop: "8px",
    },
    userName: {
      marginRight: "30px",
      marginTop: "27px",
      fontSize: "16px",
      fontWeight: "600",
      color: "#4b4b4d",
    },
    mobileNav: {
      color: "#606080",
      fontSize: "22px",
    },
  };

  return (
    <MDBNavbar fixed="top" expand="lg" style={styles.navbar}>
      <MDBContainer>
        <MDBNavbarBrand href="/" style={styles.brand}>
          Evopedia
        </MDBNavbarBrand>
        <MDBNavbarToggler
          type="button"
          aria-expanded="false"
          aria-label="Toggle navigation"
          onClick={() => setShow(!show)}
          style={styles.mobileNav}
        >
          <MDBIcon icon="bars" fas />
        </MDBNavbarToggler>
        <MDBCollapse show={show} navbar>
          <MDBNavbarNav right fullWidth={false} className="mb-2 mb-lg-0">
            {user?.result?._id && (
              <h5 style={styles.userName}>
                Logged in as: {user?.result?.name}
              </h5>
            )}
            <MDBNavbarItem style={styles.navbarItem}>
              <MDBNavbarLink href="/" style={styles.navbarLink} className="header-text">
                Home
              </MDBNavbarLink>
            </MDBNavbarItem>
            {user?.result?._id && (
              <>
                <MDBNavbarItem style={styles.navbarItem}>
                  <MDBNavbarLink href="/addTour" style={styles.navbarLink}>
                    Add Tour
                  </MDBNavbarLink>
                </MDBNavbarItem>
                <MDBNavbarItem style={styles.navbarItem}>
                  <MDBNavbarLink href="/dashboard" style={styles.navbarLink}>
                    Dashboard
                  </MDBNavbarLink>
                </MDBNavbarItem>
              </>
            )}
            {user?.result?._id ? (
              <MDBNavbarItem style={styles.navbarItem}>
                <MDBNavbarLink href="/login" style={styles.navbarLink} onClick={handleLogout}>
                  Logout
                </MDBNavbarLink>
              </MDBNavbarItem>
            ) : (
              <MDBNavbarItem style={styles.navbarItem}>
                <MDBNavbarLink href="/login" style={styles.navbarLink}>
                  Login
                </MDBNavbarLink>
              </MDBNavbarItem>
            )}
          </MDBNavbarNav>
          <form className="d-flex input-group w-auto" onSubmit={handleSubmit}>
            <input
              type="text"
              className="form-control"
              placeholder="Search Tour"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={styles.searchInput}
            />
            <div style={{ marginTop: "5px", marginLeft: "5px" }}>
              <MDBIcon fas icon="search" style={styles.searchIcon} />
            </div>
          </form>
        </MDBCollapse>
      </MDBContainer>
    </MDBNavbar>
  );
};

export default Header;
