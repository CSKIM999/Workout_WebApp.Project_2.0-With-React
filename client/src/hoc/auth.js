import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { auth } from "../_actions/user_action";
import { useNavigate } from "react-router-dom";

// eslint-disable-next-line import/no-anonymous-default-export
export default function (SpecificComponent, option, adminRoute = null) {
  // option : null/아무나 true/로그인한 자 false/로그인하지 않은 자
  function AuthenticationCheck(props) {
    let user = useSelector((state) => state.user);
    const token = document.cookie
      ? user.loginSuccess
        ? user.loginSuccess.token
        : false
      : false;
    const isNative = document.cookie ? false : token;
    const navigate = useNavigate();
    const dispatch = useDispatch();
    useEffect(() => {
      dispatch(auth(isNative)).then((response) => {
        if (!response.payload.isAuth) {
          if (option) {
            navigate("/");
            alert("잘못 된 접근입니다");
          }
        } else {
          if (adminRoute && !response.payload.isAdmin) {
            navigate("/");
            alert("관리자 권한이 필요합니다");
          } else {
            if (option === false) {
              navigate("/front");
              alert("이미 로그인되어있습니다");
            }
          }
        }
      });
    }, []);

    return <SpecificComponent {...props} user={user} />;
  }

  return AuthenticationCheck;
}
