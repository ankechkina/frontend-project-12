import React, { useState } from 'react';
import {
  Formik, Form, Field, ErrorMessage,
} from 'formik';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import classNames from 'classnames';
import { useCreateNewUserMutation } from '../api/authApi';
import { ROUTES } from '../utils/router';
import { setUserData } from '../store/entities/authSlice';
import { signupSchema } from '../utils/validationSchemas';

const Signup = () => {
  const [createNewUser] = useCreateNewUserMutation();
  const [serverError, setServerError] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (values, { setSubmitting }) => {
    setServerError('');
    try {
      const response = await createNewUser(values).unwrap();
      const { token } = response;
      dispatch(setUserData(response));
      localStorage.setItem('token', token);
      navigate(ROUTES.home);
    } catch (error) {
      if (error.status === 409) {
        setServerError('Такой пользователь уже существует');
      } else {
        console.error('Необработанная ошибка:', error);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="registration-page">
      <div className="full-height">
        <div id="chat" className="full-height">
          <div className="d-flex flex-column full-height">
            <nav className="shadow-sm navbar navbar-expand-lg bg-white">
              <div>
                <a className="navbar-brand" href="/">Hexlet Chat</a>
              </div>
            </nav>
            <div className="container-fluid full-height">
              <div className="login-container row justify-content-center align-content-center full-height">
                <div className="col-12 col-md-8 col-xxl-6">
                  <div className="card shadow-sm">
                    <div className="card-body d-flex flex-column flex-md-row justify-content-around align-items-center p-5">
                      <div>добавить картинку</div>
                      <Formik
                        initialValues={{
                          username: '',
                          password: '',
                          confirmPassword: '',
                        }}
                        validationSchema={signupSchema}
                        validateOnChange={false}
                        validateOnBlur={false}
                        onSubmit={handleSubmit}
                      >
                        {({ isSubmitting, errors }) => (
                          <Form className="w-50">
                            <h1 className="text-center mb-4">Регистрация</h1>
                            <div className="form-floating mb-3">
                              <Field
                                placeholder="От 3 до 20 символов"
                                name="username"
                                autoComplete="username"
                                required
                                id="username"
                                className={classNames('form-control', { 'is-invalid': errors.username || serverError })}
                              />
                              <label className="form-label" htmlFor="username">Имя пользователя</label>
                              {serverError && <div className="invalid-tooltip">{serverError}</div>}
                              <ErrorMessage name="username" component="div" className="invalid-tooltip" />
                            </div>
                            <div className="form-floating mb-3">
                              <Field
                                placeholder="Не менее 6 символов"
                                name="password"
                                aria-describedby="passwordHelpBlock"
                                required
                                autoComplete="new-password"
                                type="password"
                                id="password"
                                className={classNames('form-control', { 'is-invalid': errors.password })}
                              />
                              <label className="form-label" htmlFor="password">Пароль</label>
                              <ErrorMessage name="password" component="div" className="invalid-tooltip" />
                            </div>
                            <div className="form-floating mb-4">
                              <Field
                                placeholder="Пароли должны совпадать"
                                name="confirmPassword"
                                required
                                autoComplete="new-password"
                                type="password"
                                id="confirmPassword"
                                className={classNames('form-control', { 'is-invalid': errors.confirmPassword })}
                              />
                              <label className="form-label" htmlFor="confirmPassword">Подтвердите пароль</label>
                              <ErrorMessage name="confirmPassword" component="div" className="invalid-tooltip" />
                            </div>
                            <button type="submit" className="w-100 btn btn-outline-primary" disabled={isSubmitting}>
                              Зарегистрироваться
                            </button>
                          </Form>
                        )}
                      </Formik>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="Toastify" />
        </div>
      </div>
    </div>
  );
};

export default Signup;
