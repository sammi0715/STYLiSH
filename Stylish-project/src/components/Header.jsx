import React, { useContext, useEffect, useRef, useState } from "react";
import styled from "styled-components";

import logo from "../images/logo.png";
import searchIcon from "../images/search.png";
import cartIcon from "../images/cart.png";
import memberIcon from "../images/member.png";
import { CartContext } from "./CartContext";
import { Link } from "react-router-dom";

const Header = () => {
  const [showSearch, setShowSearch] = useState(false);
  const searchRef = useRef(null);

  const { cart } = useContext(CartContext);
  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);

  const handleSearchClick = () => {
    setShowSearch(true);
  };
  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      const search = event.target.value.trim();
      if (search) {
        const searchUrl = `home.html?keyword=${encodeURIComponent(search)}`;
        window.location.href = searchUrl;
      }
    }
  };
  const handleNavClick = (event, category) => {
    event.preventDefault();
    const categoryUrl = `home.html?category=${encodeURIComponent(category)}`;
    window.location.href = categoryUrl;
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearch(false);
      }
    };

    if (showSearch) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showSearch]);
  return (
    <HeaderContainer>
      <Logo src={logo} onClick={(event) => handleNavClick(event, "all")} />
      <Navbar>
        <NavLink onClick={(event) => handleNavClick(event, "women")}>
          女裝
        </NavLink>
        <NavLink onClick={(event) => handleNavClick(event, "men")}>
          男裝
        </NavLink>
        <NavLink onClick={(event) => handleNavClick(event, "accessories")}>
          配件
        </NavLink>
      </Navbar>
      <SearchBox>
        <SearchIconSpan onClick={handleSearchClick}>
          <SearchIcon src={searchIcon} />
        </SearchIconSpan>
        <SearchContainer $show={showSearch} ref={searchRef}>
          <SearchInput
            type="text"
            placeholder="西裝"
            onKeyPress={handleKeyPress}
          />
        </SearchContainer>
        <Icons>
          <IconLink to="/checkout">
            <IconImage src={cartIcon} />
            <CartCount>{cartItemCount}</CartCount>
          </IconLink>
          <IconLink to="/login">
            <IconImage src={memberIcon} />
          </IconLink>
        </Icons>
      </SearchBox>
    </HeaderContainer>
  );
};

const HeaderContainer = styled.header`
  width: 100%;
  max-height: 140px;
  display: flex;
  position: fixed;
  top: 0;
  margin-top: 0;
  background-color: #ffffff;
  border-bottom: 40px solid #313538;
  align-items: center;
  z-index: 99;

  @media (max-width: 1279px) {
    border: 0;
    justify-content: center;
  }

  @media (max-width: 480px) {
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    padding: 10px;
    border: none;
  }
`;

const Logo = styled.img`
  width: 258px;
  margin: 26px 60px;
  cursor: pointer;
  @media (max-width: 480px) {
    width: 129px;
    text-align: center;
    margin: 4px auto;
    display: flex;
    justify-content: center;
  }
`;

const Navbar = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  padding-left: 39px;
  padding-top: 17px;

  @media (max-width: 1279px) {
    justify-content: space-around;
    height: 50px;
    width: 100vw;
    background-color: #313538;
    position: absolute;
    top: 93px;
    padding: 0;
    text-align: center;
  }
  @media (max-width: 480px) {
    display: flex;
    justify-content: space-around;
    height: 50px;
    background-color: #313538;
    position: relative;
    top: 10px;
    right: 10px;
    padding: 0;
    text-align: center;
  }
`;

const NavLink = styled.a`
  display: block;
  width: 150px;
  text-decoration: none;
  position: relative;
  font-size: 20px;
  color: #3f3a3a;
  letter-spacing: 30px;

  &.selected {
    color: #8b572a;
  }

  &:hover {
    color: #8b572a;
  }

  &:after {
    content: "|";
    color: #3f3a3a;
    padding-left: 6px;
  }

  &:last-child:after {
    content: "";
  }

  @media (max-width: 1279px) {
    letter-spacing: normal;
    background-color: #313538;
    color: #828282;
    font-size: 16px;
    width: 100%;
    position: relative;
    border-left: 1px solid #808080;

    &.selected {
      color: #ffffff;
    }

    &:hover {
      color: #ffffff;
    }
  }
`;

const SearchBox = styled.div`
  display: flex;
  align-items: center;
  position: absolute;
  right: 38px;
  @media (max-width: 480px) {
    top: 3px;
  }
`;

const SearchIconSpan = styled.span`
  width: 44px;
  height: 44px;
  position: relative;
  right: -200px;
  @media (max-width: 1279px) {
    display: flex;
    position: absolute;
    right: 5px;
  }
  @media (max-width: 480px) {
    z-index: 99;
    width: 40px;
    height: 40px;
    top: 3px;
  }
`;

const SearchIcon = styled.img`
  cursor: pointer;

  &:hover {
    background-image: url(${searchIcon});
  }
  @media (max-width: 480px) {
    &:hover {
      background-size: 40px;
    }
  }
`;

const SearchContainer = styled.div`
  display: flex;
  height: 45px;
  align-items: center;
  border: 1px solid #979797;
  border-radius: 30px;
  padding: 0px 8px;
  width: 196px;
  background-color: #ffffff;

  @media (max-width: 1279px) {
    display: ${(props) => (props.$show ? "flex" : "none")};
    width: 90vw;
  }
`;

const SearchInput = styled.input`
  border: none;
  outline: none;
  padding: 4px 5px 2px 11px;
  font-size: 20px;
  width: 152px;

  &::placeholder {
    font-size: 20px;
    color: #8b572a;
  }
  @media (max-width: 1279px) {
    width: 90vw;
  }
`;

const Icons = styled.div`
  padding-top: 2px;
  padding-left: 21px;

  @media (max-width: 1279px) {
    display: none;
  }
`;

const IconLink = styled(Link)`
  margin-left: 20px;
  position: relative;
  text-decoration: none;
`;

const IconImage = styled.img`
  width: 44px;
  height: 44px;
  padding-right: 18px;
`;

const CartCount = styled.span`
  position: absolute;
  top: -5px;
  right: 20px;
  background-color: #8b4513;
  color: white;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  font-size: 16px;
  text-decoration: none;
  text-align: center;
  display: inline-block;
`;

export default Header;
