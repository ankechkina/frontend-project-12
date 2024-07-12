import React, { useState, useEffect, useRef } from 'react';
import { Formik, Form, Field } from 'formik';
import {
  FormGroup, Label, Input, Button,
} from 'reactstrap';
import classNames from 'classnames';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLoginMutation } from '../api/authApi';
import { setUserData } from '../store/entities/authSlice';
import loginImage from '../assets/images/login.jpg';
import useAuth from '../hooks/useAuth';
import { ROUTES } from '../utils/router';
import Navigation from './Navigation';
import { useToast } from '../context/ToastContext';

const Login = () => {
  const [sendLoginData, { isLoading }] = useLoginMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [authError, setAuthError] = useState(false);
  const usernameRef = useRef(null);
  const { login } = useAuth();

  const { t } = useTranslation();
  const toast = useToast();

  useEffect(() => {
    usernameRef.current.focus();
  }, []);

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const user = await sendLoginData(values).unwrap();
      const { username } = values;
      dispatch(setUserData({ username, token: user.token }));
      login(user.token);
      navigate(ROUTES.home);
    } catch (err) {
      if (err.status === 401) {
        setAuthError(true);
      } else {
        console.error(err);
        toast.error(t('error.networkError'));
      }
      setSubmitting(false);
    }
  };

  return (
    <>
      <Navigation
        t={t}
        showLogoutButton={false}
      />
      <div className="container-fluid full-height">
        <div className="login-container row justify-content-center align-content-center full-height">
          <div className="col-12 col-md-8 col-xxl-6">
            <div className="card shadow-sm">
              <div className="card-body d-flex flex-column flex-md-row justify-content-around align-items-center p-5">
                <img src={loginImage} className="rounded-circle" alt={t('images.login')} />
                <div>
                  <Formik
                    initialValues={{ username: '', password: '' }}
                    onSubmit={handleSubmit}
                  >
                    {({ isSubmitting }) => (
                      <Form className="login-form">
                        <h1>{t('login.login')}</h1>
                        <FormGroup>
                          <Label htmlFor="username">{t('login.username')}</Label>
                          <Field
                            name="username"
                            type="text"
                            autoComplete="username"
                            required
                            placeholder={t('login.username')}
                            id="username"
                            innerRef={usernameRef}
                            className={classNames('form-control', { 'is-invalid': authError })}
                            as={Input}
                          />
                        </FormGroup>
                        <FormGroup>
                          <Label htmlFor="password">{t('login.password')}</Label>
                          <Field
                            name="password"
                            type="password"
                            autoComplete="current-password"
                            required
                            placeholder={t('login.password')}
                            id="password"
                            className={classNames('form-control', { 'is-invalid': authError })}
                            as={Input}
                          />
                          {authError && (
                          <div style={{ color: 'red', marginTop: '0.5rem' }}>
                            {t('error.usernameOrPassword')}
                          </div>
                          )}
                        </FormGroup>
                        <Button type="submit" color="primary" disabled={isSubmitting || isLoading}>
                          {t('login.login')}
                        </Button>
                      </Form>
                    )}
                  </Formik>
                  <div className="p-4">
                    <span>{t('login.noAccount')}</span>
                    <a href="/signup">{t('signup.registration')}</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
