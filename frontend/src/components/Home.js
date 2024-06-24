/* eslint-disable react/no-array-index-key, max-len */

import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Formik, Form, Field, ErrorMessage,
} from 'formik';
import { useNavigate } from 'react-router-dom';
import classNames from 'classnames';
import {
  loadChannels, loadMessages, logOut, setCurrentChannel,
} from '../store/authSlice';
import { API_ROUTES } from '../utils/router';
import { useSocket } from '../context/SocketContext';

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    token, channels, currentChannel,
  } = useSelector((state) => state.auth);

  const { sendMessage, messages: socketMessages } = useSocket();

  useEffect(() => {
    if (token) {
      dispatch(loadChannels());
      dispatch(loadMessages());
    }
  }, [dispatch, token]);

  const handleLogout = () => {
    dispatch(logOut());
    navigate(API_ROUTES.login);
  };

  const handleChannelClick = (channelName) => {
    dispatch(setCurrentChannel(channelName));
  };

  return (
    <div className="h-100">
      <div id="chat" className="h-100">
        <div className="d-flex flex-column h-100">
          <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm">
            <div>
              <a className="navbar-brand" href="/">Hexlet Chat</a>
              <button onClick={handleLogout} type="button" className="btn btn-primary">Выйти</button>
            </div>
          </nav>
          <div className="container h-100 my-4 overflow-hidden rounded shadow">
            <div className="row h-100 bg-white flex-md-row">
              <div className="col-4 col-md-2 border-end px-0 bg-light d-flex flex-column h-100">
                <div className="d-flex mt-1 justify-content-between mb-2 p-4 ps-4 pe-2">
                  <b>Каналы</b>
                  <button type="button" className="btn btn-group-vertical p-0 text-primary">
                    <span>+</span>
                  </button>
                </div>
                <ul id="channels-box" className="nav flex-column nav-pills nav-fill px-2 mb-3 overflow-auto h-100 d-block">
                  {channels.map((channel) => (
                    <li key={channel.id} className="nav-item w-100">
                      <button
                        type="button"
                        className={classNames(
                          'w-100 rounded-0 text-start btn',
                          { 'btn-secondary': channel.name === currentChannel },
                        )}
                        onClick={() => handleChannelClick(channel.name)}
                      >
                        <span className="me-1">#</span>
                        {channel.name}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="col p-0 h-100">
                <div className="d-flex flex-column h-100">
                  <div className="bg-light mb-4 p-3 shadow-sm small">
                    <p className="m-0">
                      <b>
                        #
                        {currentChannel}
                      </b>
                    </p>
                    <span className="text-muted">
                      {socketMessages.length}
                      {' '}
                      сообщений
                    </span>
                  </div>
                  <div id="messages-box" className="chat-messages overflow-auto px-5">
                    {console.log('socketMessages:', socketMessages)}
                    {socketMessages.map((message, index) => (
                      <div key={index} className="message">
                        <p>{message.body}</p>
                        <span className="text-muted">{message.username}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-auto px-5 py-3">
                    <Formik
                      initialValues={{ message: '' }}
                      onSubmit={(values, { setSubmitting, resetForm }) => {
                        const channelId = channels.find((channel) => channel.name === currentChannel).id;
                        sendMessage({ body: values.message, channelId, username: 'YourUsername' }); // Измените на реальное имя пользователя
                        setSubmitting(false);
                        resetForm();
                      }}
                    >
                      {({ isSubmitting }) => (
                        <Form className="py-1 border rounded-2">
                          <div className="input-group has-validation">
                            <Field
                              type="text"
                              name="message"
                              placeholder="Введите сообщение..."
                              className="border-0 p-0 ps-2 form-control"
                            />
                            <ErrorMessage name="message" component="div" className="invalid-feedback" />
                            <button type="submit" disabled={isSubmitting} className="btn btn-group-vertical">
                              <span>Отправить</span>
                            </button>
                          </div>
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
  );
};

export default Home;
