import React from "react";
import { CartProvider } from "./components/CartContext";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Product from "./components/Product";
import Header from "./components/Header";
import Footer from "./components/Footer";
import CheckOut from "./components/CheckOut";
import Login from "./components/Login";
import FruitList from "./components/test";
import styled, { createGlobalStyle } from "styled-components";
const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    font-family: "Noto Sans TC", sans-serif;
    }
`;
function App() {
  return (
    <>
      <CartProvider>
        <GlobalStyle />

        <Header />
        <Routes>
          <Route path="/product" element={<Product />} />
          <Route path="/checkout" element={<CheckOut />} />
          <Route path="/login" element={<Login />} />
        </Routes>
        <Footer />
      </CartProvider>
    </>
  );
}

export default App;
