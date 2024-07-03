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
import { ROUTES } from '../utils/router';

const Login = () => {
  const [login, { isLoading }] = useLoginMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [authError, setAuthError] = useState(false);
  const usernameRef = useRef(null);

  const { t } = useTranslation();

  useEffect(() => {
    usernameRef.current.focus();
  }, []);

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const user = await login(values).unwrap();
      const { username } = values;
      dispatch(setUserData({ username, token: user.token }));
      localStorage.setItem('token', user.token);
      navigate(ROUTES.home);
    } catch (err) {
      setAuthError(true);
      setSubmitting(false);
    }
  };

  return (
    <>
      <nav className="shadow-sm navbar navbar-expand-lg bg-white">
        <div>
          <a className="navbar-brand" href="/">{t('login.navBrand')}</a>
        </div>
      </nav>
      <div className="login-container">
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
    </>
  );
};

export default Login;
