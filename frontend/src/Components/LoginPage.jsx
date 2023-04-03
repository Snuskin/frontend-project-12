import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import welcomeImg from "./../images/p.jpg";
import { useAuth } from "../hooks/index.jsx";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import routes from "../routes";
import { useTranslation } from "react-i18next";

const LoginForm = () => {
  const { t } = useTranslation();
  const auth = useAuth();
  const [authFailed, setAuthFailed] = useState(false);
  const inputRef = useRef();
  const location = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    const inputEl = inputRef.current;
    inputEl.focus();
  }, []);

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    validationSchema: Yup.object({
      username: Yup.string().required(),
      password: Yup.string().required(),
    }),
    onSubmit: async (values) => {
      console.log(routes.loginPath());
      setAuthFailed(false);
      try {
        const res = await axios.post(routes.loginPath(), values);
        console.log(res);
        localStorage.setItem("userId", JSON.stringify(res.data));
        const { from } = location.state || { from: { pathname: "/" } };
        auth.logIn();
        navigate(from.pathname, { replace: true });
      } catch (err) {
        console.log(err);
        formik.setSubmitting(false);
        if (err.isAxiosError && err.response.status === 401) {
          setAuthFailed(true);
          inputRef.current.select();
          return;
        }
        throw err;
      }
    },
  });

  return (
    <div>
      <nav className="chat-navbar">
        <div className="container">
          <a href="/">{t("mainPage.header.chatLink")}</a>
        </div>
      </nav>
      <div
        style={{
          marginTop: "20vh",
          marginLeft: "15vw",
          marginBottom: "10vh",
          width: "70vw",
          height: "50vh",
          display: "flex",
          justifyContent: "space-around",
          alignItems: "center",
        }}
      >
        <div>
          <img
            style={{ width: "30vw", height: "50vh" }}
            src={welcomeImg}
            alt=""
          ></img>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-around",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <h1 style={{ marginBottom: "4em", color: "rgba(56, 168, 224, 1)" }}>
            {t("loginPage.greeting")}
          </h1>
          <form
            style={{
              margin: 0,
              height: "50%",
              display: "flex",
              justifyContent: "center",
              flexDirection: "column",
              alignItems: "center",
            }}
            onSubmit={formik.handleSubmit}
          >
            <label htmlFor="username">Ваш ник</label>
            <input
              placeholder={t("loginPage.usernamePlaceholder")}
              id="username"
              name="username"
              type="text"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.username}
              style={{ marginBottom: "2em" }}
              className="username input"
              ref={inputRef}
            />
            {formik.touched.username && formik.errors.username ? (
              <div>{formik.errors.username}</div>
            ) : null}

            <label htmlFor="password">Пароль</label>
            <input
              placeholder={t("loginPage.pwdPlaceholder")}
              id="password"
              name="password"
              type="password"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.password}
              style={{ marginBottom: "2em" }}
              className="username input"
            />
            {authFailed ? (
              <p style={{ color: "red" }}>{t("loginPage.autFailed")}</p>
            ) : null}
            {formik.touched.password && formik.errors.password ? (
              <div>{formik.errors.password}</div>
            ) : null}

            <button
              type="submit"
              className="btn"
              style={{ marginTop: "2em", fontSize: "20px" }}
            >
              {t("loginPage.logIn")}
            </button>
          </form>
        </div>
        <div>
          <p>{t("loginPage.noAccount")}</p>
          <a href="/signup">{t("loginPage.register")}</a>
        </div>
      </div>
    </div>
  );
};

export const Login = () => LoginForm();
