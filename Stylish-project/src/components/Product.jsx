import React, { useState, useEffect, useContext } from "react";
import styled from "styled-components";
import { CartContext } from "./CartContext";

const Product = () => {
  const [productData, setProductData] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedQuantity, setSelectedQuantity] = useState(0);
  const [buttonText, setButtonText] = useState("請選擇顏色");
  const [availableSizes, setAvailableSizes] = useState([]);
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    const getProductIdFromURL = () => {
      const parms = new URLSearchParams(window.location.search);
      return parms.get("id");
    };

    const productId = getProductIdFromURL();
    if (productId) {
      fetch(
        `https://api.appworks-school.tw/api/1.0/products/details?id=${productId}`
      )
        .then((response) => response.json())
        .then((product) => {
          console.log(product);
          const storedStock = localStorage.getItem(`stock-${productId}`);
          if (storedStock) {
            product.data.variants = JSON.parse(storedStock);
          }

          setProductData(product.data);
          const uniqueSizes = Array.from(
            new Set(product.data.variants.map((variant) => variant.size))
          ).map((size) => ({
            size,
            stock: product.data.variants
              .filter((variant) => variant.size === size)
              .reduce((total, variant) => total + variant.stock, 0),
          }));

          setAvailableSizes(uniqueSizes);
        })
        .catch((error) => {
          console.error("Error fetching product data:", error);
        });
    }
  }, []);

  useEffect(() => {
    if (!selectedColor) {
      setButtonText("請選擇顏色");
    } else if (selectedColor && !selectedSize) {
      setButtonText("請選擇尺寸");
    } else if (selectedColor && selectedSize && selectedQuantity === 0) {
      setButtonText("請選擇數量");
    } else {
      setButtonText("加入購物車");
    }
  }, [selectedColor, selectedSize, selectedQuantity]);

  const handleColorClick = (colorCode) => {
    setSelectedColor(colorCode);
    const sizesWithStock = productData.variants
      .filter((variant) => variant.color_code === colorCode)
      .map((variant) => ({ size: variant.size, stock: variant.stock }));
    setAvailableSizes(sizesWithStock);
    setSelectedSize(null);
    setSelectedQuantity(0);
  };

  const handleSizeClick = (size) => {
    setSelectedSize(size);
    setSelectedQuantity(0);
  };

  const handleQuantityChange = (change) => {
    const newQuantity = selectedQuantity + change;
    const maxStock = productData.variants.find(
      (variant) =>
        variant.color_code === selectedColor && variant.size === selectedSize
    ).stock;
    if (newQuantity > 0 && newQuantity <= maxStock) {
      setSelectedQuantity(newQuantity);
    }
  };
  const handleAddToCart = () => {
    if (buttonText === "加入購物車") {
      const selectedVariant = productData.variants.find(
        (variant) =>
          variant.color_code === selectedColor && variant.size === selectedSize
      );
      const selectedColorName = productData.colors.find(
        (color) => color.code === selectedColor
      );
      addToCart({
        id: productData.id,
        title: productData.title,
        color: selectedColor,
        colorName: selectedColorName.name,
        size: selectedSize,
        quantity: selectedQuantity,
        price: productData.price,
        image: productData.main_image,
        stock: selectedVariant.stock,
      });
      const newVariants = productData.variants.map((variant) => {
        if (
          variant.color_code === selectedColor &&
          variant.size === selectedSize
        ) {
          return { ...variant, stock: variant.stock - selectedQuantity };
        }
        return variant;
      });
      setProductData({ ...productData, variants: newVariants });

      localStorage.setItem(
        `stock-${productData.id}`,
        JSON.stringify(newVariants)
      );
      setSelectedColor(null);
      setSelectedSize(null);
      setSelectedQuantity(0);
      alert("商品已加入購物車");
    } else {
      alert(buttonText);
    }
  };

  if (!productData) {
    return <div>Loading...</div>;
  }
  return (
    <ProductContainer>
      <InfoPicture src={productData.main_image}></InfoPicture>
      <ProductTextBox>
        <ProductTitle>{productData.title}</ProductTitle>
        <ProductId>{productData.id}</ProductId>
        <ProductPrice>{`TWD.${productData.price}`}</ProductPrice>
        <CategoryContainer>
          <ColorTitle>顏色｜</ColorTitle>
          <ColorCubeBox>
            {productData.colors.map((color) => (
              <ColorCubeOutline
                key={color.code}
                $isSelected={selectedColor === color.code}
                onClick={() => handleColorClick(color.code)}
              >
                <ColorCube color={`#${color.code}`}></ColorCube>
              </ColorCubeOutline>
            ))}
          </ColorCubeBox>
        </CategoryContainer>
        <CategoryContainer>
          <SizeTitle>尺寸｜</SizeTitle>
          {availableSizes.map((sizeInfo) => (
            <ProductSize
              key={sizeInfo.size}
              $isSelected={selectedSize === sizeInfo.size}
              onClick={() =>
                !selectedColor || sizeInfo.stock === 0
                  ? null
                  : handleSizeClick(sizeInfo.size)
              }
              $isDisabled={!selectedColor || sizeInfo.stock === 0}
            >
              {sizeInfo.size}
            </ProductSize>
          ))}
        </CategoryContainer>
        <CategoryContainer>
          <QuantityTitle>數量｜</QuantityTitle>
          <ProductQuantitySelector>
            <ProductQuantityMinus onClick={() => handleQuantityChange(-1)}>
              -
            </ProductQuantityMinus>
            <ProductQuantityNumber>{selectedQuantity}</ProductQuantityNumber>
            <ProductQuantityPlus onClick={() => handleQuantityChange(+1)}>
              +
            </ProductQuantityPlus>
          </ProductQuantitySelector>
        </CategoryContainer>
        <AddCarrtBtn onClick={handleAddToCart}>{buttonText}</AddCarrtBtn>
        <ProductNote>{productData.note}</ProductNote>
        <ProductInfo>
          <ProductDescribe>{productData.texture}</ProductDescribe>
          <ProductDescribe>{productData.description}</ProductDescribe>
        </ProductInfo>
        <ProductWarning>
          <ProductDescribe>清洗：{productData.wash}</ProductDescribe>
          <ProductDescribe>產地：{productData.place}</ProductDescribe>
        </ProductWarning>
      </ProductTextBox>
      <MoreInfoContainer>
        <MoreInfoTitle>更多產品資訊</MoreInfoTitle>
        <InfoStory>{productData.story}</InfoStory>
      </MoreInfoContainer>
      <InnerProductPhotoBox>
        {productData.images.map((image, index) => (
          <InnerProductPhoto key={index} src={image}></InnerProductPhoto>
        ))}
      </InnerProductPhotoBox>
    </ProductContainer>
  );
};
export default Product;

const ProductContainer = styled.div`
  display: flex;
  width: 100%;
  max-width: 960px;
  min-height: 100vh;
  margin: 140px auto 0;
  padding: 65px 0 164px;
  flex-wrap: wrap;
  @media (max-width: 1279px) {
    margin-top: 102px;
    padding: 0 0 49px;
  }
`;
const InfoPicture = styled.img`
  width: 560px;
  @media (max-width: 1279px) {
    width: 100%;
  }
`;
const ProductTextBox = styled.div`
  margin-left: 40px;
  width: 360px;
  @media (max-width: 1279px) {
    margin: 17px 24px 0;
    width: 100%;
  }
`;
const ProductTitle = styled.h1`
  font-weight: 400;
  font-size: 32px;
  line-height: 38px;
  letter-spacing: 6.4px;
`;
const ProductId = styled.p`
  color: #bababa;
  font-size: 20px;
  line-height: 24px;
  letter-spacing: 4px;
  margin-top: 16px;
`;
const ProductPrice = styled.p`
  font-weight: 400;
  font-size: 30px;
  line-height: 36px;
  margin-top: 40px;
  padding-bottom: 20px;
  border-bottom: 1px solid #3f3a3a;
`;
const CategoryContainer = styled.div`
  display: flex;
  align-items: center;
`;
const ColorTitle = styled.p`
  font-size: 20px;
  line-height: 24px;
  padding-right: 10px;
  letter-spacing: 4px;
`;
const ColorCubeBox = styled.div`
  display: flex;
  align-items: center;
`;
const ColorCubeOutline = styled.div`
  display: flex;
  width: 36px;
  height: 36px;
  border: 1px solid ${(props) => (props.$isSelected ? "#979797" : "#97979722")};
  margin-right: 27px;
  cursor: pointer;
  align-items: center;
  justify-content: center;
`;
const ColorCube = styled.div`
  width: 24px;
  height: 24px;
  border: 1px solid #d3d3d3;
  background-color: ${(prop) => prop.color};
  cursor: pointer;
`;

const SizeTitle = styled.p`
  font-size: 20px;
  line-height: 24px;
  padding-right: 10px;
  letter-spacing: 4px;
`;
const ProductSize = styled.div`
  font-size: 20px;
  line-height: 36px;
  width: 36px;
  height: 36px;
  border-radius: 50px;
  background-color: ${(props) =>
    props.$isSelected
      ? "black"
      : props.$isDisabled
      ? "rgba(236, 236, 236, 0.251)"
      : "#ececec"};
  color: ${(props) =>
    props.$isSelected ? "white" : props.$isDisabled ? "#3f3a3a40" : "black"};
  text-align: center;
  margin-right: 27px;
  cursor: ${(props) => (props.$isDisabled ? "not-allowed" : "pointer")};
  &:hover {
    background-color: ${(props) => !props.$isDisabled && "black"};
    color: ${(props) => !props.$isDisabled && "#ececec"};
  }
`;
const ProductSizeNone = styled.div`
  font-size: 20px;
  line-height: 36px;
  width: 36px;
  height: 36px;
  border-radius: 50px;
  background-color: rgba(236, 236, 236, 0.251);
  color: #3f3a3a40;
  margin-right: 20px;
  text-align: center;
`;
const QuantityTitle = styled.p`
  font-size: 20px;
  line-height: 24px;
  padding-right: 10px;
  letter-spacing: 4px;
  @media (max-width: 1279px) {
    display: none;
  }
`;
const ProductQuantitySelector = styled.div`
  display: flex;
  width: 160px;
  height: 44px;
  border: 1px solid #979797;
  align-items: center;
  justify-content: space-around;
  @media (max-width: 1279px) {
    width: 90vw;
  }
`;
const ProductQuantityMinus = styled.div`
  width: 6px;
  font-size: 16px;
  cursor: pointer;
`;
const ProductQuantityPlus = styled.div`
  width: 6px;
  font-size: 16px;
  cursor: pointer;
`;
const ProductQuantityNumber = styled.div`
  font-size: 16px;
  color: #8b572a;
`;
const AddCarrtBtn = styled.button`
  background-color: black;
  width: 100%;
  height: 64px;
  margin-top: 29px;
  color: white;
  font-size: 20px;
  letter-spacing: 4px;
  cursor: pointer;
`;

const ProductNote = styled.p`
  margin-top: 40px;
  line-height: 30px;
  font-weight: 400;
  font-size: 20px;
`;
const ProductInfo = styled.div``;
const ProductDescribe = styled.p`
  font-weight: 400;
  font-size: 20px;
  margin: 0;
  line-height: 30px;
  white-space: pre-line;
`;
const ProductWarning = styled.div`
  margin-top: 30px;
  line-height: 30px;
`;
const MoreInfoContainer = styled.div`
  margin-top: 50px;
  width: 100%;
  @media (max-width: 1279px) {
    margin: 28px 24px 0;
  }
`;
const MoreInfoTitle = styled.div`
  display: flex;
  color: #8b572a;
  letter-spacing: 3px;
  line-height: 30px;
  align-items: center;
  &:after {
    content: "";
    flex-grow: 1;
    height: 1px;
    margin-left: 64px;
    background-color: #3f3a3a;
  }
  @media (max-width: 1279px) {
    font-size: 16px;
    letter-spacing: 3.2px;
    &:after {
      margin-left: 35px;
    }
  }
  @media (max-width: 480px) {
    &:after {
      margin-left: 35px;
    }
  }
`;
const InfoStory = styled.p`
  font-size: 20px;
  line-height: 30px;
  margin-top: 28px;
  margin-bottom: 0;
  @media (max-width: 1279px) {
    line-height: 25px;
    margin-top: 12px;
    font-size: 14px;
  }
`;
const InnerProductPhotoBox = styled.div`
  margin-top: 30px;
  @media (max-width: 1279px) {
    margin: 20px 24px 0;
  }
`;
const InnerProductPhoto = styled.img`
  margin-top: 30px;
  @media (max-width: 1279px) {
    width: 100%;
  }
`;
