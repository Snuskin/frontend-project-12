import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import welcomeImg from './../images/p.jpg'; 
import useAuth from '../hooks/index.jsx';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import routes from '../api/routes/routes';
const SignupForm = () => {

  const auth = useAuth();
  const [authFailed, setAuthFailed] = useState(false);
  const inputRef = useRef();
  const location = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    const inputEl = inputRef.current
    inputEl.focus();
  }, []);

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
    validationSchema: Yup.object({
      username: Yup.string()
        .max(15, 'Must be 15 characters or less')
        .required('Required'),
        password: Yup.string()
        .required('No password provided.') 
        .min(5, 'Password is too short - should be 8 chars minimum.')
        .matches(/[a-zA-Z]/, 'Password can only contain Latin letters.')
    }),
    onSubmit: async (values) => {
      console.log(values);
      setAuthFailed(false)
      
      try {
        console.log(location.state)
        console.log(routes.loginPath())
        const res = await axios.post(routes.loginPath(), values);
        console.log(res.data)
        localStorage.setItem('userId', JSON.stringify(res.data));
        auth.logIn();
        const { from } = location.state || { from: { pathname: '/' } };
        
        navigate(from);
      } catch (err) {
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
    <div style={{marginTop: '20vh', marginLeft: '15vw', marginBottom: '10vh', width:'70vw', height: '50vh', display: 'flex', justifyContent: 'space-around', alignItems: "center" }}>
    <div>
    <img style={{width:'30vw', height: '50vh'}} src={welcomeImg} alt='' ></img>
    </div>
    <div style={{  display: 'flex', justifyContent: 'space-around', flexDirection: 'column', alignItems: "center" }}>
      <h1 style={{marginBottom: '4em', color: 'rgba(56, 168, 224, 1)'}}>Welcome to the club, Buddy!</h1>
    <form style={{margin: 0, height: '50%', display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: "center" }} onSubmit={formik.handleSubmit}>
      <label htmlFor="username" ></label>
      <input
      placeholder='Ваш ник'
        id="username"
        name="username"
        type="text"
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        value={formik.values.username}
        style={{marginBottom: '2em'}}
        className='username input'
        ref={inputRef}
      />
      {formik.touched.username && formik.errors.username ? (
        <div>{formik.errors.username}</div>
      ) : null}

      <label htmlFor="password"></label>
      <input
      placeholder='Пароль'
        id="password"
        name="password"
        type="password"
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        value={formik.values.password}
        style={{marginBottom: '2em'}}
        className='username input'
      />

      {formik.touched.password && formik.errors.password ? (
        <div>{formik.errors.password}</div>
      ) : null}

      <button type="submit" className='btn' style={{marginTop: '5em', fontSize: '20px'}}>Войти</button>
    </form>
    </div>
    </div>
  );
};

export const Login = () => SignupForm();