import React from 'react';

const Signup = () => (
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
                    <form className="w-50">
                      <h1 className="text-center mb-4">Регистрация</h1>
                      <div className="form-floating mb-3">
                        <input
                          placeholder="От 3 до 20 символов"
                          name="username"
                          autoComplete="username"
                          required
                          id="username"
                          className="form-control is-invalid"
                        />
                        <label className="form-label" htmlFor="username">Имя пользователя</label>
                        <div className="invalid-tooltip">Обязательное поле</div>
                      </div>
                      <div className="form-floating mb-3">
                        <input
                          placeholder="Не менее 6 символов"
                          name="password"
                          aria-describedby="passwordHelpBlock"
                          required
                          autoComplete="new-password"
                          type="password"
                          id="password"
                          className="form-control"
                        />
                        <div className="invalid-tooltip">Обязательное поле</div>
                        <label className="form-label" htmlFor="password">Пароль</label>
                      </div>
                      <div className="form-floating mb-4">
                        <input
                          placeholder="Пароли должны совпадать"
                          name="confirmPassword"
                          required
                          autoComplete="new-password"
                          type="password"
                          id="confirmPassword"
                          className="form-control"
                        />
                        <div className="invalid-tooltip" />
                        <label className="form-label" htmlFor="confirmPassword">Подтвердите пароль</label>
                      </div>
                      <button type="submit" className="w-100 btn btn-outline-primary">Зарегистрироваться</button>
                    </form>
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

export default Signup;
