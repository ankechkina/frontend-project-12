import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Formik, Form, Field, ErrorMessage,
} from 'formik';
import { useNavigate } from 'react-router-dom';
import classNames from 'classnames';
import { logOut } from '../store/entities/authSlice';
import { setCurrentChannel, setFetchedChannels, setChannelsError } from '../store/entities/channelsSlice';
import { setMessages, setMessagesError } from '../store/entities/messagesSlice';
import { API_ROUTES } from '../utils/router';
import { useGetChannelsQuery } from '../api/channelsApi';
import { useGetMessagesQuery, useAddMessageMutation } from '../api/messagesApi';

const Home = () => {
  const { token, username } = useSelector((state) => state.user);
  const { channels, currentChannelId } = useSelector((state) => state.channels);
  const { messages } = useSelector((state) => state.messages);

  const currentState = useSelector((state) => state);

  useEffect(() => {
    console.log(currentState);
  }, [currentState]);

  if (!token) {
    return <div>Please log in</div>;
  }

  return (
    <HomeContent
      token={token}
      channels={channels}
      currentChannelId={currentChannelId}
      messages={messages}
      username={username}
    />
  );
};

const HomeContent = ({
  channels, currentChannelId, messages, username,
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    data: channelsData,
    error: channelsError,
    isLoading: isLoadingChannels,
  } = useGetChannelsQuery();
  const { data: messagesData, error: messagesError } = useGetMessagesQuery();

  const [addMessage] = useAddMessageMutation();

  const handleSendMessage = async (values, { setSubmitting, resetForm }) => {
    try {
      await addMessage({ body: values.message, channelId: currentChannelId, username }).unwrap();
      resetForm();
      dispatch(setMessagesError(null));
    } catch (error) {
      console.error(error.message);
      dispatch(setMessagesError(error.message));
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    if (channelsError) {
      console.error(channelsError.message);
      dispatch(setChannelsError(channelsError.message));
    } else {
      dispatch(setChannelsError(null));
    }
  }, [channelsError, dispatch]);

  useEffect(() => {
    if (channelsData) {
      dispatch(setFetchedChannels(channelsData));
    }
  }, [channelsData, dispatch]);

  useEffect(() => {
    if (messagesError) {
      console.error(messagesError.message);
      dispatch(setMessagesError(messagesError.message));
    } else {
      dispatch(setMessagesError(null));
    }
  }, [messagesError, dispatch]);

  useEffect(() => {
    if (messagesData) {
      dispatch(setMessages(messagesData));
    }
  }, [messagesData, dispatch]);

  const handleLogout = () => {
    dispatch(logOut());
    navigate(API_ROUTES.login);
  };

  const handleChannelClick = (channelId) => {
    dispatch(setCurrentChannel(channelId));
  };

  const currentChannel = channels.find((channel) => channel.id === currentChannelId);
  const currentChannelName = currentChannel ? currentChannel.name : 'Unknown Channel';

  const filteredMessages = messages.filter((message) => message.channelId === currentChannelId);

  if (isLoadingChannels) {
    return <div>Loading...</div>;
  }

  return (
    <div className="h-100">
      <div id="chat" className="h-100">
        <div className="d-flex flex-column chat-page">
          <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm">
            <a className="navbar-brand" href="/">Hexlet Chat</a>
            <button
              onClick={handleLogout}
              type="button"
              className="btn btn-primary logout-button"
            >
              Выйти
            </button>
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
                <ul
                  id="channels-box"
                  className="nav flex-column nav-pills nav-fill px-2 mb-3 overflow-auto h-100 d-block"
                >
                  {channels.map((channel) => (
                    <li key={channel.id} className="nav-item w-100">
                      <button
                        type="button"
                        className={classNames(
                          'w-100 rounded-0 text-start btn',
                          { 'btn-secondary': channel.id === currentChannelId },
                        )}
                        onClick={() => handleChannelClick(channel.id)}
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
                        {currentChannelName}
                      </b>
                    </p>
                    <span className="text-muted">
                      {filteredMessages.length}
                      {' '}
                      сообщений
                    </span>
                  </div>
                  <div id="messages-box" className="chat-messages overflow-auto px-5">
                    {filteredMessages.map((message) => (
                      <div key={message.id} className="message">
                        <p>{message.body}</p>
                        <span className="text-muted">{message.username}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-auto px-5 py-3">
                    <Formik
                      initialValues={{ message: '' }}
                      onSubmit={handleSendMessage}
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
