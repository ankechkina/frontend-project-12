import React from 'react';
import {
  Formik, Form, Field, ErrorMessage,
} from 'formik';
import * as Yup from 'yup';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useCreateNewUserMutation } from '../api/authApi';
import { ROUTES } from '../utils/router';
import { setUserData } from '../store/entities/authSlice';

const SignupSchema = Yup.object().shape({
  username: Yup.string()
    .min(3, 'От 3 до 20 символов')
    .max(20, 'От 3 до 20 символов')
    .required('Обязательное поле'),
  password: Yup.string()
    .min(6, 'Не менее 6 символов')
    .required('Обязательное поле'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Пароли должны совпадать')
    .required('Обязательное поле'),
});

const Signup = () => {
  const [createNewUser] = useCreateNewUserMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const response = await createNewUser(values);
      const { token } = response.data;
      dispatch(setUserData(response.data));
      localStorage.setItem('token', token);
      navigate(ROUTES.home);
    } catch (error) {
      console.error('Failed to create a new user:', error);
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
                        validationSchema={SignupSchema}
                        validateOnChange={false}
                        validateOnBlur={false}
                        onSubmit={handleSubmit}
                      >
                        {({ isSubmitting, errors, touched }) => (
                          <Form className="w-50">
                            <h1 className="text-center mb-4">Регистрация</h1>
                            <div className="form-floating mb-3">
                              <Field
                                placeholder="От 3 до 20 символов"
                                name="username"
                                autoComplete="username"
                                required
                                id="username"
                                className={`form-control ${errors.username && touched.username ? 'is-invalid' : ''}`}
                              />
                              <label className="form-label" htmlFor="username">Имя пользователя</label>
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
                                className={`form-control ${errors.password && touched.password ? 'is-invalid' : ''}`}
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
                                className={`form-control ${errors.confirmPassword && touched.confirmPassword ? 'is-invalid' : ''}`}
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
