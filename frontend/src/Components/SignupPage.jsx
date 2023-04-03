import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import signups from "./../images/signup.jpg";
import { useAuth } from "../hooks/index.jsx";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import routes from "../routes";
import { useTranslation } from "react-i18next";

const SignupForm = () => {
  const { t } = useTranslation();
  const auth = useAuth();
  const [signupFailed, setSignupFailed] = useState(false);
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
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      username: Yup.string()
        .max(20, `${t("signupPage.validationMessages.maxNameLength")}`)
        .min(3, `${t("signupPage.validationMessages.maxNameLength")}`)
        .required(`${t("signupPage.validationMessages.required")}`),
      password: Yup.string()
        .required(`${t("signupPage.validationMessages.required")}`)
        .min(6, `${t("signupPage.validationMessages.minPwdLength")}`)
        .matches(
          /[a-zA-Z]/,
          `${t("signupPage.validationMessages.onlyLatinaPwd")}`
        ),
      confirmPassword: Yup.string()
        .required()
        .oneOf(
          [Yup.ref("password"), null],
          `${t("signupPage.validationMessages.notMatches")}`
        ),
    }),

    onSubmit: async (values) => {
      setSignupFailed(false);
      try {
        const res = await axios.post(routes.signUpPath(), values);
        localStorage.setItem("userId", JSON.stringify(res.data));
        const { from } = location.state || { from: { pathname: "/" } };
        auth.logIn();
        navigate(from.pathname, { replace: true });
      } catch (err) {
        formik.setSubmitting(false);
        if (err.isAxiosError && err.response.status === 409) {
          setSignupFailed(true);
          inputRef.current.select();
        }
        throw err;
      }
    },
  });

  return (
    <div>
      <nav>
        <a href="/">{t("signupPage.chatBtn")}</a>
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
            src={signups}
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
            {t("signupPage.greeting")}
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
            <label htmlFor="username">Имя пользователя</label>
            <input
              placeholder={t("signupPage.usernamePlaceholder")}
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
              placeholder={t("signupPage.pwdPlaceholder")}
              id="password"
              name="password"
              type="password"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.password}
              style={{ marginBottom: "2em" }}
              className="username input"
            />
            <label htmlFor="confirmPassword">Подтвердите пароль</label>
            <input
              placeholder={t("signupPage.confirmpwdPlaceholder")}
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.confirmPassword}
              style={{ marginBottom: "2em" }}
              className="username input"
            />
            {signupFailed ? (
              <p style={{ color: "red" }}>{t("signupPage.signUpFailed")}</p>
            ) : null}
            {formik.touched.password && formik.errors.password ? (
              <div>{formik.errors.password}</div>
            ) : null}
            {formik.touched.confirmPassword && formik.errors.confirmPassword ? (
              <div>{formik.errors.confirmPassword}</div>
            ) : null}
            <button
              type="submit"
              className="btn"
              style={{ marginTop: "2em", fontSize: "20px" }}
            >
              {t("signupPage.signUp")}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export const Signup = () => SignupForm();
