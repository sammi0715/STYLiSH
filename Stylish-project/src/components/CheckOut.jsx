import React, { useContext, useState } from "react";
import styled from "styled-components";
import trashcan from "../images/cart-remove.png";
import { CartContext } from "./CartContext";

const CheckOut = () => {
  const { cart, updateCartItemQuantity, removeCartItem, clearCart } =
    useContext(CartContext);

  const [formValue, setFormValue] = useState({
    name: "",
    phone: "",
    address: "",
    email: "",
    deliveryTime: "",
    cardNumber: "",
    expirationDate: "",
    securityCode: "",
  });
  const [formErrors, setFormErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValue({ ...formValue, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = {};

    if (cart.length === 0) {
      alert("購物車沒有商品，請添加商品後再結帳");
    }
    if (!formValue.name) {
      errors.name = "請輸入名稱";
    }
    if (!formValue.phone) {
      errors.phone = "請輸入手機號碼";
    }
    if (!formValue.address) {
      errors.address = "請輸入地址";
    } else if (formValue.phone.length !== 10) {
      errors.phone = "手機號碼必須是10位數";
    }
    if (!formValue.email) {
      errors.email = "請輸入Email";
    }
    if (!formValue.deliveryTime) {
      errors.deliveryTime = "請選擇配送時間";
    }
    if (!formValue.cardNumber) {
      errors.cardNumber = "請輸入信用卡號碼";
    } else if (formValue.cardNumber.length !== 16) {
      errors.cardNumber = "信用卡號碼必須是16位數";
    }
    if (!formValue.expirationDate) {
      errors.expirationDate = "請輸入有效期限";
    }
    if (!formValue.securityCode) {
      errors.securityCode = "請輸入安全碼";
    } else if (formValue.securityCode.length !== 3) {
      errors.securityCode = "安全碼必須是3位數";
    }

    setFormErrors(errors);

    if (Object.keys(errors).length === 0 && cart.length !== 0) {
      alert("進行付款！請稍候");
      clearCart();
      setFormValue({
        name: "",
        phone: "",
        address: "",
        email: "",
        deliveryTime: "",
        cardNumber: "",
        expirationDate: "",
        securityCode: "",
      }); // 清空表單
    }
  };

  const totalPrice = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const shippingFee = totalPrice === 0 ? 0 : 30;
  const totalAmount = totalPrice + shippingFee;

  return (
    <CheckOutContainer>
      <CartTitleBox>
        <CartTitle>購物車</CartTitle>
        <CartSubTitle width="185px">數量</CartSubTitle>
        <CartSubTitle width="166px" $paddingLeft="7px">
          單價
        </CartSubTitle>
        <CartSubTitle width="167px" $paddingLeft="26px">
          小計
        </CartSubTitle>
      </CartTitleBox>
      <CartItemBox>
        {cart.map((item, index) => (
          <CartItem key={index}>
            <ItemPicture src={item.image}></ItemPicture>
            <ItemDetail>
              <ItemTitle>{item.title}</ItemTitle>
              <ItemId>{item.id}</ItemId>
              <ItemColor>顏色｜{item.colorName}</ItemColor>
              <ItemSize>尺寸｜{item.size}</ItemSize>
            </ItemDetail>
            <CartQuantityBox>
              <CartMobileTitle>數量</CartMobileTitle>
              <ItemQuantity
                value={item.quantity}
                onChange={(e) => {
                  const newQuantity = parseInt(e.target.value, 10);
                  updateCartItemQuantity(
                    item.id,
                    item.color,
                    item.size,
                    newQuantity
                  );
                }}
              >
                {[...Array(item.stock).keys()].map((n) => (
                  <SelectQuantity key={n} value={n + 1}>
                    {n + 1}
                  </SelectQuantity>
                ))}
              </ItemQuantity>
            </CartQuantityBox>
            <ItemPriceBox>
              <CartMobileTitle>單價</CartMobileTitle>
              <ItemPrice>{`TWD.${item.price}`}</ItemPrice>
            </ItemPriceBox>
            <ItemTotalBox>
              <CartMobileTitle>小計</CartMobileTitle>
              <ItemPrice>{`TWD.${item.price * item.quantity}`}</ItemPrice>
            </ItemTotalBox>
            <CartRemove
              onClick={() => removeCartItem(item.id, item.color, item.size)}
              src={trashcan}
            ></CartRemove>
          </CartItem>
        ))}
      </CartItemBox>

      <FormContainer onSubmit={handleSubmit}>
        <BookingFormBox $marginTop="50px">
          <FormTitle>訂購資料</FormTitle>
          <FormBox>
            <FormContent>收件人姓名</FormContent>
            <FormInput
              name="name"
              value={formValue.name}
              onChange={handleInputChange}
              style={{
                borderColor: formErrors.name ? "red" : "#979797",
              }}
            />
            {formErrors.name && <ErrorText>{formErrors.name}</ErrorText>}
          </FormBox>
          <FormNote>務必填寫完整收件人姓名，避免包裹無法順利簽收</FormNote>
          <FormBox>
            <FormContent>手機</FormContent>
            <FormInput
              type="number"
              name="phone"
              value={formValue.phone}
              onChange={handleInputChange}
              style={{
                borderColor: formErrors.phone ? "red" : "#979797",
              }}
            />
            {formErrors.phone && <ErrorText>{formErrors.phone}</ErrorText>}
          </FormBox>
          <FormBox>
            <FormContent>地址</FormContent>
            <FormInput
              name="address"
              value={formValue.address}
              onChange={handleInputChange}
              style={{
                borderColor: formErrors.address ? "red" : "#979797",
              }}
            />
            {formErrors.address && <ErrorText>{formErrors.address}</ErrorText>}
          </FormBox>
          <FormBox>
            <FormContent>Email</FormContent>
            <FormInput
              type="email"
              name="email"
              value={formValue.email}
              onChange={handleInputChange}
              style={{
                borderColor: formErrors.email ? "red" : "#979797",
              }}
            />
            {formErrors.email && <ErrorText>{formErrors.email}</ErrorText>}
          </FormBox>
          <FormBox>
            <FormContent>配送時間</FormContent>
            <RadioLabelBox>
              <FormInputRadio
                type="radio"
                name="deliveryTime"
                value="08:00-12:00"
                checked={formValue.deliveryTime === "08:00-12:00"}
                onChange={handleInputChange}
              />

              <RadioLabel>08:00-12:00</RadioLabel>
              <FormInputRadio
                type="radio"
                $marginLeft="32px"
                name="deliveryTime"
                value="14:00-18:00"
                checked={formValue.deliveryTime === "14:00-18:00"}
                onChange={handleInputChange}
              />
              <RadioLabel>14:00-18:00</RadioLabel>

              <FormInputRadio
                type="radio"
                $marginLeft="32px"
                name="deliveryTime"
                value="不指定"
                checked={formValue.deliveryTime === "不指定"}
                onChange={handleInputChange}
              />
              <RadioLabel>不指定</RadioLabel>
              {formErrors.deliveryTime && (
                <ErrorText>{formErrors.deliveryTime}</ErrorText>
              )}
            </RadioLabelBox>
          </FormBox>
        </BookingFormBox>
        <BookingFormBox $marginTop="37px">
          <FormTitle>付款資料</FormTitle>
          <FormBox>
            <FormContent>信用卡號碼</FormContent>
            <FormInput
              type="password"
              placeholder="**** **** **** ****"
              name="cardNumber"
              value={formValue.cardNumber}
              onChange={handleInputChange}
              style={{
                borderColor: formErrors.cardNumber ? "red" : "#979797",
              }}
            />
            {formErrors.cardNumber && (
              <ErrorText>{formErrors.cardNumber}</ErrorText>
            )}
          </FormBox>

          <FormBox>
            <FormContent>有效期限</FormContent>
            <FormInput
              placeholder="MM/YY"
              name="expirationDate"
              value={formValue.expirationDate}
              onChange={handleInputChange}
              style={{
                borderColor: formErrors.expirationDate ? "red" : "#979797",
              }}
            />
            {formErrors.expirationDate && (
              <ErrorText>{formErrors.expirationDate}</ErrorText>
            )}
          </FormBox>
          <FormBox>
            <FormContent>安全碼</FormContent>
            <FormInput
              placeholder="後三碼"
              name="securityCode"
              value={formValue.securityCode}
              onChange={handleInputChange}
              style={{
                borderColor: formErrors.securityCode ? "red" : "#979797",
              }}
            />
            {formErrors.securityCode && (
              <ErrorText>{formErrors.securityCode}</ErrorText>
            )}
          </FormBox>
          <Total $marginTop="33px">
            <TotalTitle>總金額</TotalTitle>
            <TotalNT>NT.</TotalNT>
            <TotalPrice $marginLeft="8px" $marginRight="4px">
              {totalPrice}
            </TotalPrice>
          </Total>
          <ShippingFee>
            <TotalTitle>運費</TotalTitle>
            <TotalNT>NT.</TotalNT>
            <TotalPrice $marginLeft="8px" $marginRight="4px">
              {shippingFee}
            </TotalPrice>
          </ShippingFee>
          <Total $marginTop="20px">
            <TotalTitle>應付金額</TotalTitle>
            <TotalNT>NT.</TotalNT>
            <TotalPrice $marginLeft="8px">{totalAmount}</TotalPrice>
          </Total>
          <CheckoutButton type="submit">確認付款</CheckoutButton>
        </BookingFormBox>
      </FormContainer>
    </CheckOutContainer>
  );
};

const CheckOutContainer = styled.div`
  margin: 140px auto 0;
  padding: 36px 0 147px;
  max-width: 1160px;
  line-height: 19px;
  font-size: 16px;
  @media (max-width: 1279px) {
    margin-top: 102px;
    padding: 20px 24px 236px;
  }
`;

const CartTitleBox = styled.div`
  display: flex;
  @media (max-width: 1279px) {
    padding-bottom: 10px;
    border-bottom: 1px solid #3f3a3a;
  }
`;

const CartTitle = styled.p`
  font-weight: 700;
  flex-grow: 1;
`;

const CartSubTitle = styled.p`
  font-size: 16px;
  line-height: 19px;
  color: #3f3a3a;
  width: ${(props) => props.width};
  padding-left: ${(props) => props.$paddingLeft};
  padding-right: ${(props) => props.$paddingRight};
  @media (max-width: 1279px) {
    display: none;
  }
`;

const CartItemBox = styled.div`
  padding: 39px 30px 7px 30px;
  border: 1px solid #979797;
  @media (max-width: 1279px) {
    padding: 0;
    margin-top: 10px;
    border: none;
  }
`;

const CartItem = styled.div`
  display: flex;
  align-items: center;
  padding-bottom: 30px;
  @media (max-width: 1279px) {
    align-items: flex-start;
    flex-wrap: wrap;
    padding-bottom: 20px;
    border-bottom: 1px solid #3f3a3a;
    font-size: 14px;
    line-height: 17px;
    margin-top: 20px;
    &:last-child {
      border-bottom: none;
    }
  }
`;

const ItemPicture = styled.img`
  width: 114px;
  @media (max-width: 1279px) {
    order: 1;
  }
`;

const ItemDetail = styled.div`
  margin-left: 16px;
  flex-grow: 1;
  align-self: flex-start;
  @media (max-width: 1279px) {
    width: calc(100% - 174px);
    order: 1;
  }
`;

const ItemTitle = styled.p`
  margin: 0;
`;

const ItemId = styled.p`
  margin-top: 18px;
`;

const ItemColor = styled.p`
  margin-top: 22px;
  margin-bottom: 0px;
`;

const ItemSize = styled.p`
  margin-top: 10px;
`;

const CartQuantityBox = styled.div`
  width: 192px;
  text-align: center;
  @media (max-width: 1279px) {
    width: calc(100% / 3);
    order: 2;
  }
`;

const CartMobileTitle = styled.p`
  display: none;
  @media (max-width: 1279px) {
    display: block;
  }
`;

const ItemQuantity = styled.select`
  width: 80px;
  height: 32px;
  padding-left: 9px;
  border-radius: 8px;
  border: solid 1px #979797;
  background-color: #f3f3f3;
`;

const SelectQuantity = styled.option``;

const ItemPriceBox = styled.div`
  width: 192px;
  text-align: center;
  @media (max-width: 1279px) {
    width: calc(100% / 3);
    order: 2;
  }
`;

const ItemTotalBox = styled.div`
  width: 192px;
  text-align: center;
  margin-right: 51px;
  @media (max-width: 1279px) {
    width: calc(100% / 3);
    order: 2;
    margin-right: 0;
  }
`;

const ItemPrice = styled.p``;

const CartRemove = styled.img`
  width: 44px;
  height: 44px;
  cursor: pointer;
  @media (max-width: 1279px) {
    order: 1;
  }
`;
const FormContainer = styled.form``;
const BookingFormBox = styled.div`
  margin-top: ${(props) => props.$marginTop};
  @media (max-width: 1279px) {
    font-size: 14px;
  }
`;

const FormTitle = styled.p`
  line-height: 19px;
  font-size: 16px;
  font-weight: 700;
  color: #3f3a3a;
  padding-bottom: 15px;
  border-bottom: 1px solid #3f3a3a;
`;

const FormBox = styled.div`
  display: flex;
  align-items: center;
  margin-top: 10px;
  @media (max-width: 1279px) {
    flex-wrap: wrap;
  }
`;

const FormContent = styled.p`
  width: 120px;
  line-height: 19px;
  font-size: 16px;
  color: #3f3a3a;
`;

const FormInput = styled.input`
  width: 564px;
  height: 28px;
  border-radius: 8px;
  border: solid 1px #979797;
  letter-spacing: 1px;
  line-height: 32px;
  padding-left: 8px;
  &::placeholder {
    font-size: 16px;
    color: #d3d3d3;
  }
`;

const FormNote = styled.div`
  line-height: 19px;
  margin-left: 344px;
  font-size: 16px;
  color: #8b572a;
  margin-bottom: 20px;
  @media (max-width: 1279px) {
    margin-left: 75px;
  }
`;

const RadioLabelBox = styled.div`
  display: flex;
  align-items: center;
`;

const RadioLabel = styled.label`
  margin-left: ${(props) => props.$marginLeft};
  margin-right: ${(props) => props.$marginRight};
`;

const FormInputRadio = styled.input`
  width: 16px;
  height: 16px;
  margin: 5px 8px 5px 0px;
  margin-left: ${(props) => props.$marginLeft};
`;

const Total = styled.div`
  margin-top: ${(props) => props.$marginTop};
  display: flex;
  align-items: center;
  width: 240px;
  height: 36px;
  margin-left: auto;
`;

const TotalTitle = styled.p`
  line-height: 19px;
  font-size: 16px;
  color: #3f3a3a;
`;

const TotalNT = styled.p`
  margin-left: auto;
  line-height: 19px;
  font-size: 16px;
  color: #3f3a3a;
`;

const TotalPrice = styled.p`
  line-height: 36px;
  margin-left: ${(props) => props.$marginLeft};
  margin-right: ${(props) => props.$marginRight};
  font-size: 30px;
  color: #3f3a3a;
`;

const ShippingFee = styled.div`
  display: flex;
  align-items: center;
  width: 240px;
  height: 36px;
  margin-left: auto;
  margin-top: 20px;
  padding-bottom: 19px;
  border-bottom: 1px solid #3f3a3a;
`;

const CheckoutButton = styled.button`
  display: block;
  width: 240px;
  height: 64px;
  background-color: #000000;
  color: #ffffff;
  font-size: 20px;
  letter-spacing: 4px;
  margin-left: auto;
  margin-top: 50px;
  cursor: pointer;
`;
const ErrorText = styled.span`
  color: #e10404;
  font-size: 14px;
  margin-top: 5px;
  margin-left: 10px;
`;
export default CheckOut;
