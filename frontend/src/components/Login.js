import React, { useState } from 'react';
import { Formik, Form, Field } from 'formik';
import {
  FormGroup, Label, Input, Button,
} from 'reactstrap';
import classNames from 'classnames';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useLoginMutation } from '../api/authApi';
import { setUserData } from '../store/authSlice';
import { ROUTES } from '../utils/router';

const Login = () => {
  const [login, { isLoading }] = useLoginMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [authError, setAuthError] = useState(false);

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
    <div className="login-container">
      <Formik
        initialValues={{ username: '', password: '' }}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form>
            <h1>Войти</h1>
            <FormGroup>
              <Label htmlFor="username">Ваш ник</Label>
              <Field
                name="username"
                type="text"
                autoComplete="username"
                required
                placeholder="Ваш ник"
                id="username"
                className={classNames('form-control', { 'is-invalid': authError })}
                as={Input}
              />
            </FormGroup>
            <FormGroup>
              <Label htmlFor="password">Пароль</Label>
              <Field
                name="password"
                type="password"
                autoComplete="current-password"
                required
                placeholder="Пароль"
                id="password"
                className={classNames('form-control', { 'is-invalid': authError })}
                as={Input}
              />
              {authError && (
                <div style={{ color: 'red', marginTop: '0.5rem' }}>
                  Неверные имя пользователя или пароль
                </div>
              )}
            </FormGroup>
            <Button type="submit" color="primary" disabled={isSubmitting || isLoading}>
              Войти
            </Button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default Login;
