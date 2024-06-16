import React from 'react';
import { Formik, Form, Field } from 'formik';
import {
  FormGroup, Label, Input, Button,
} from 'reactstrap';

const Login = () => (
  <div className="container">
    <Formik
      initialValues={{ username: '', password: '' }}
      onSubmit={({ setSubmitting }) => {
        console.log('Form is validated! Submitting the form...');
        setSubmitting(false);
      }}
    >
      {({ isSubmitting }) => (
        <Form>
          <h1>Войти</h1>
          <FormGroup>
            {' '}
            <Label htmlFor="username">Ваш ник</Label>
            <Field
              name="username"
              type="text"
              autoComplete="username"
              required
              placeholder="Ваш ник"
              id="username"
              className="form-control"
              as={Input}
            />
          </FormGroup>
          <FormGroup>
            {' '}
            <Label htmlFor="password">Пароль</Label>
            <Field
              name="password"
              type="password"
              autoComplete="current-password"
              required
              placeholder="Пароль"
              id="password"
              className="form-control"
              as={Input}
            />
          </FormGroup>
          <Button type="submit" color="primary" disabled={isSubmitting}>
            {' '}
            Войти
          </Button>
        </Form>
      )}
    </Formik>
  </div>
);

export default Login;
