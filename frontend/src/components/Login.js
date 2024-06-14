import React from 'react';
import { Formik, Form, Field } from 'formik';

const Login = () => (
  <div>
    <Formik
      initialValues={{ username: '', password: '' }}
      onSubmit={({ setSubmitting }) => {
        console.log('success!');
        setSubmitting(false);
      }}
    >
      {({ isSubmitting }) => (
        <Form>
          <h1>Войти</h1>
          <div>
            <label htmlFor="username">Ваш ник</label>
            <Field
              name="username"
              type="text"
              autoComplete="username"
              required
              placeholder="Ваш ник"
              id="username"
            />
          </div>
          <div>
            <label htmlFor="password">Пароль</label>
            <Field
              name="password"
              type="password"
              autoComplete="current-password"
              required
              placeholder="Пароль"
              id="password"
            />
          </div>
          <button type="submit" disabled={isSubmitting}>
            Войти
          </button>
        </Form>
      )}
    </Formik>
  </div>
);

export default Login;