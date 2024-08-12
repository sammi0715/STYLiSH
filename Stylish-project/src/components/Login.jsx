import React, { useEffect, useState } from "react";
import styled from "styled-components";

const initFacebookSdk = () => {
  return new Promise((resolve, reject) => {
    if (document.getElementById("facebook-jssdk")) {
      resolve();
      return;
    }

    window.fbAsyncInit = () => {
      window.FB.init({
        appId: "490702933553091",
        xfbml: true,
        version: "v20.0",
      });
      resolve();
    };

    const js = document.createElement("script");
    js.id = "facebook-jssdk";
    js.src = "https://connect.facebook.net/en_US/sdk.js";
    js.onload = resolve;
    js.onerror = reject;
    document.body.appendChild(js);
  });
};

const fbLogin = () => {
  return new Promise((resolve, reject) => {
    window.FB.login(
      (response) => {
        if (response.authResponse) {
          resolve(response.authResponse.accessToken);
        } else {
          reject("User cancelled login or did not fully authorize.");
        }
      },
      { scope: "public_profile,email" }
    );
  });
};

const Login = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    initFacebookSdk()
      .then(() => {
        console.log("Facebook SDK initialized");
      })
      .catch((error) => {
        console.error("Error initializing Facebook SDK:", error);
      });
  }, []);

  const handleLogin = () => {
    console.log("Reached log in button");
    fbLogin()
      .then((accessToken) => {
        console.log("Access Token:", accessToken);

        fetch("https://api.appworks-school.tw/api/1.0/user/signin", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            provider: "facebook",
            access_token: accessToken,
          }),
        })
          .then((response) => response.json())
          .then((data) => {
            console.log("API Response:", data);

            if (data) {
              console.log("User Data:", data.user);
              setUser(data.data);
            } else {
              console.error("User data not found in response");
            }
          })
          .catch((error) => {
            console.error("Error:", error);
          });
      })
      .catch((error) => {
        console.error("Login failed:", error);
      });
  };

  return (
    <LoginContainer>
      <LoginText>會員登入</LoginText>
      <LoginButton onClick={handleLogin}>Facebook 登入</LoginButton>

      {user && (
        <ProfileBox>
          <ProfileImage src={user.user.picture} alt="Profile" />
          <ProfileName>{user.user.name}</ProfileName>
          <ProfileEmail>{user.user.email}</ProfileEmail>
        </ProfileBox>
      )}
    </LoginContainer>
  );
};

const LoginContainer = styled.div`
  max-width: 100vw;
  height: 100vh;
  margin-top: 300px;
  text-align: center;
  @media (max-width: 1279px) {
    margin-top: 102px;
    padding: 20px 24px 236px;
  }
`;

const LoginText = styled.h1``;

const LoginButton = styled.button`
  letter-spacing: 2px;
`;

const ProfileBox = styled.div`
  margin-top: 50px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ProfileImage = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 50%;
`;

const ProfileName = styled.h2`
  margin-top: 20px;
`;

const ProfileEmail = styled.p`
  margin-top: 10px;
  color: gray;
`;

export default Login;
