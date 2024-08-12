import React, { useContext } from "react";
import styled from "styled-components";

import lineIcon from "../images/line.png";
import twitterIcon from "../images/twitter.png";
import facebookIcon from "../images/facebook.png";
import cartMobileIcon from "../images/cart-mobile.png";
import memberMobileIcon from "../images/member-mobile.png";
import { CartContext } from "./CartContext";
import { Link } from "react-router-dom";

const Footer = () => {
  const { cart } = useContext(CartContext);
  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);
  return (
    <FooterContainer>
      <FooterContent>
        <FooterNav>
          <FooterLink href="#">關於STYLISH</FooterLink>
          <FooterLink href="#">服務條款</FooterLink>
          <FooterLink href="#">隱私政策</FooterLink>
          <FooterLink href="#">聯絡我們</FooterLink>
          <FooterLink href="#">FAQ</FooterLink>
        </FooterNav>
        <SocialIcons>
          <SocialIconsLink href="#">
            <SocialIcon src={lineIcon} alt="line" />
          </SocialIconsLink>
          <SocialIconsLink href="#">
            <SocialIcon src={twitterIcon} alt="twitter" />
          </SocialIconsLink>
          <SocialIconsLink href="#">
            <SocialIcon src={facebookIcon} alt="facebook" />
          </SocialIconsLink>
        </SocialIcons>
        <FooterText1>© 2018. All rights reserved.</FooterText1>
      </FooterContent>

      <FooterIcons>
        <IconBox>
          <CartIconBoxLink to="/checkout">
            <Icon src={cartMobileIcon} alt="cart" />
            <FooterText2>購物車</FooterText2>
            <CartCount>{cartItemCount}</CartCount>
          </CartIconBoxLink>
        </IconBox>
        <IconBox>
          <MemberIconBoxLink to="/login">
            <Icon src={memberMobileIcon} alt="member" />
            <FooterText2>會員</FooterText2>
          </MemberIconBoxLink>
        </IconBox>
      </FooterIcons>
    </FooterContainer>
  );
};

const FooterContainer = styled.footer`
  display: flex;
  background-color: #313538;
  color: white;
  justify-content: center;
  width: 100vw;
  flex-direction: column;

  @media (max-width: 1279px), (max-width: 480px) {
    padding: 40px 0px 20px 0;
    height: 146px;
    position: relative;
  }
`;

const FooterContent = styled.div`
  display: flex;
  justify-content: center;
  padding: 25px 11px 32px 11px;
  align-items: center;
  flex-wrap: wrap;

  @media (max-width: 1279px), (max-width: 480px) {
    padding: 0;
    margin-bottom: 109px;
    position: relative;
  }
  @media (max-width: 360px) {
    flex-wrap: nowrap;
  }
`;

const FooterNav = styled.div`
  display: flex;
  padding-right: 77px;

  @media (max-width: 1279px), (max-width: 480px) {
    display: grid;
    grid: repeat(3, 1fr) / repeat(2, 1fr);
    grid-auto-flow: column dense;
    gap: 8px;
    padding: 0 0 11px 25px;
  }
  @media (max-width: 360px) {
    padding: 0 0 0 34px;
  }
`;

const FooterLink = styled.a`
  display: block;
  width: 134px;
  text-align: center;
  font-weight: 400;
  color: #f5f5f5;
  text-decoration: none;
  position: relative;
  right: -5px;
  top: 1px;

  &::after {
    content: "|";
    color: white;
    margin: 0px 0px 0px 30px;
  }

  &:last-child::after {
    content: "";
  }

  @media (max-width: 1279px), (max-width: 480px) {
    display: flex;
    font-size: 14px;
    padding: 0;
    width: fit-content;

    &::after {
      content: "";
    }
  }
  @media (max-width: 480px) {
    display: flex;
    font-size: 14px;
    padding: 0;
    width: max-content;
  }
`;

const SocialIcons = styled.div`
  display: flex;
  position: relative;
  top: 4px;

  @media (max-width: 1279px), (max-width: 480px) {
    right: 18px;
    top: -13px;
  }

  @media (max-width: 360px) {
    top: -6px;
    right: 25px;
  }
`;

const SocialIcon = styled.img`
  width: 50px;
  height: 50px;
  padding-right: 10px;

  @media (max-width: 1279px), (max-width: 480px) {
    width: 20px;
    height: 20px;
    padding-right: 14px;
  }
`;
const SocialIconsLink = styled.a`
  margin: 0 10px;
  @media (max-width: 1279px) {
    margin: 0;
  }
`;
const FooterText1 = styled.span`
  display: flex;
  font-size: 12px;
  color: #828282;
  align-self: center;

  @media (max-width: 1279px) {
    display: flex;
    position: absolute;
    bottom: -32px;
    left: 0;
    width: 100%;
    justify-content: center;
    margin-bottom: 15px;
    font-size: 10px;
  }
`;

const FooterText2 = styled.span`
  @media (max-width: 1279px) {
    color: #ffffff;
    position: relative;
    top: -14px;
    right: -2px;
  }
`;

const FooterIcons = styled.div`
  display: none;

  @media (max-width: 1279px), (max-width: 480px) {
    display: flex;
    width: 100vw;
    background-color: #313538;
    margin-top: 35px;
    padding-top: 15px;
    position: fixed;
    bottom: 0;
  }

  @media (max-width: 360px) {
    margin-top: 20px;
  }
`;

const IconBox = styled.div`
  display: flex;
  text-align: center;
  position: relative;
  width: 100vw;
  &:after {
    content: "|";
    color: #ffffff;
    font-size: 21px;
    position: relative;
    top: 4px;
  }
  &:last-child:after {
    content: "";
  }

  @media (max-width: 1279px), (max-width: 480px) {
    top: -4px;
  }

  @media (max-width: 360px) {
    top: 3px;
  }
`;

const MemberIconBoxLink = styled(Link)`
  text-decoration: none;
  display: block;
  width: 100%;
  position: relative;
  top: -7px;
  @media (max-width: 480px) {
    text-decoration: none;
    display: block;
  }
`;
const CartIconBoxLink = styled(Link)`
  text-decoration: none;
  display: block;
  width: 100%;
  position: relative;
  top: -7px;
  @media (max-width: 480px) {
    text-decoration: none;
    display: block;
  }
`;
const Icon = styled.img`
  @media (max-width: 1279px), (max-width: 480px) {
    position: relative;
    right: -6px;
  }

  @media (max-width: 360px) {
    right: -13px;
  }
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
  text-align: center;
  text-decoration: none;
  display: inline-block;

  @media (max-width: 1279px), (max-width: 480px) {
    position: relative;
    right: 68px;
  }
`;

export default Footer;
