import React, { useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Formik, Form, Field, ErrorMessage,
} from 'formik';
import { useNavigate } from 'react-router-dom';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import { ToastContainer } from 'react-toastify';
import { logOut } from '../store/entities/authSlice';
import { setCurrentChannel, setFetchedChannels, setChannelsError } from '../store/entities/channelsSlice';
import { setMessages, setMessagesError } from '../store/entities/messagesSlice';
import { API_ROUTES } from '../utils/router';
import { useGetChannelsQuery } from '../api/channelsApi';
import { useGetMessagesQuery, useAddMessageMutation } from '../api/messagesApi';
import ModalWindow from '../modal/ModalWindow';
import { useToast } from '../context/ToastContext';
import useFilter from '../utils/useFilter';

const Home = () => {
  const { token, username } = useSelector((state) => state.user);
  const { channels, currentChannelId } = useSelector((state) => state.channels);
  const { messages } = useSelector((state) => state.messages);

  const currentState = useSelector((state) => state);

  useEffect(() => {
    console.log(currentState);
  }, [currentState]);

  const { t } = useTranslation();

  if (!token) {
    return <div>{t('login.pleaseLogin')}</div>;
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

  const toast = useToast();

  const filter = useFilter();

  const messageRef = useRef(null);

  const { t } = useTranslation();

  useEffect(() => {
    if (messageRef.current) {
      messageRef.current.focus();
    }
  }, []);

  const {
    data: channelsData,
    error: channelsError,
    isLoading: isLoadingChannels,
  } = useGetChannelsQuery();
  const { data: messagesData, error: messagesError } = useGetMessagesQuery();

  const [addMessage] = useAddMessageMutation();

  const [dropdownsOpen, setDropdownsOpen] = useState({});

  const [modalInfo, setModalInfo] = useState({ type: null, props: {} });
  const handleShowModal = (type, props = {}) => setModalInfo({ type, props });
  const handleCloseModal = () => setModalInfo({ type: null, props: {} });

  const handleSendMessage = async (values, { setSubmitting, resetForm }) => {
    try {
      await addMessage({ body: values.message, channelId: currentChannelId, username }).unwrap();
      resetForm();
      dispatch(setMessagesError(null));
    } catch (error) {
      console.error(error);
      dispatch(setMessagesError(error.message));
      toast.error(t('error.networkError'));
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    if (channelsError) {
      console.error(channelsError);
      dispatch(setChannelsError(channelsError.message));
      toast.error(t('error.networkError'));
    } else {
      dispatch(setChannelsError(null));
    }
  }, [channelsError, dispatch, t, toast]);

  useEffect(() => {
    if (channelsData) {
      dispatch(setFetchedChannels(channelsData));
    }
  }, [channelsData, dispatch]);

  useEffect(() => {
    if (messagesError) {
      console.error(messagesError);
      dispatch(setMessagesError(messagesError.message));
      toast.error(t('error.networkError'));
    } else {
      dispatch(setMessagesError(null));
    }
  }, [messagesError, dispatch, t, toast]);

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

  const handleToggleDropdown = (channelId) => {
    setDropdownsOpen((prevState) => ({
      ...prevState,
      [channelId]: !prevState[channelId],
    }));
  };

  const currentChannel = channels.find((channel) => channel.id === currentChannelId);
  const currentChannelName = currentChannel ? currentChannel.name : t('error.channelNotFound');

  const filteredMessages = messages.filter((message) => message.channelId === currentChannelId);

  if (isLoadingChannels) {
    return <div>{t('channels.loading')}</div>;
  }

  return (
    <div className="h-100">
      <div id="chat" className="h-100">
        <div className="d-flex flex-column chat-page">
          <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm">
            <a className="navbar-brand" href="/">{t('login.navBrand')}</a>
            <button
              onClick={handleLogout}
              type="button"
              className="btn btn-primary logout-button"
            >
              {t('channels.logout')}
            </button>
          </nav>
          <div className="container h-100 my-4 overflow-hidden rounded shadow">
            <div className="row h-100 bg-white flex-md-row">
              <div className="col-4 col-md-2 border-end px-0 bg-light d-flex flex-column h-100">
                <div className="d-flex mt-1 justify-content-between mb-2 p-4 ps-4 pe-2">
                  <b>{t('channels.channels')}</b>
                  <button
                    type="button"
                    className="btn btn-group-vertical p-0 text-primary"
                    id="add-channel-button"
                    onClick={() => handleShowModal('adding')}
                  >
                    <span>+</span>
                  </button>
                </div>
                <ul
                  id="channels-box"
                  className="nav flex-column nav-pills nav-fill px-2 mb-3 overflow-auto h-100 d-block"
                >
                  {channels.map((channel) => (
                    <li key={channel.id} className="nav-item w-100">
                      <div role="group" className="d-flex dropdown btn-group">
                        <button
                          type="button"
                          className={classNames(
                            'w-100 rounded-0 text-start text-truncate btn',
                            { 'btn-secondary': channel.id === currentChannelId },
                          )}
                          onClick={() => handleChannelClick(channel.id)}
                        >
                          <span className="me-1">#</span>
                          {filter.clean(channel.name)}
                        </button>
                        {channel.removable && (
                        <>
                          <button
                            type="button"
                            aria-expanded={!!dropdownsOpen[channel.id]}
                            className={classNames(
                              'flex-grow-0 dropdown-toggle dropdown-toggle-split btn',
                              { 'btn-secondary': channel.id === currentChannelId },
                            )}
                            onClick={() => handleToggleDropdown(channel.id)}
                          >
                            <span className="visually-hidden">{t('channels.channelControl')}</span>
                          </button>
                          <div
                            className={classNames(
                              'dropdown-menu',
                              { show: !!dropdownsOpen[channel.id] },
                            )}
                          >
                            <a href="#" className="dropdown-item" onClick={() => { handleShowModal('renaming', { channelId: channel.id }); handleToggleDropdown(channel.id); }}>{t('channels.rename')}</a>
                            <a href="#" className="dropdown-item" onClick={() => { handleShowModal('removing', { channelId: channel.id }); handleToggleDropdown(channel.id); }}>{t('channels.delete')}</a>
                          </div>
                        </>
                        )}
                      </div>
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
                        {filter.clean(currentChannelName)}
                      </b>
                    </p>
                    <span className="text-muted">{`${t('channels.countMessages.messages', { count: filteredMessages.length })}`}</span>
                  </div>
                  <div id="messages-box" className="chat-messages overflow-auto px-5 ">
                    {filteredMessages.map((message) => (
                      <div key={message.id} className="text-break mb-2">
                        <b>{message.username}</b>
                        :
                        {' '}
                        {filter.clean(message.body)}
                      </div>
                    ))}
                  </div>
                  <div className="mt-auto px-5 py-3">
                    <Formik
                      initialValues={{ message: '' }}
                      onSubmit={handleSendMessage}
                    >
                      {({
                        values, handleChange, handleSubmit, isSubmitting,
                      }) => (
                        <Form noValidate="" className="py-1 border rounded-2" onSubmit={handleSubmit}>
                          <div className="input-group has-validation">
                            <Field
                              name="message"
                              innerRef={messageRef}
                              aria-label={t('channels.newMessage')}
                              placeholder={t('channels.enterMessage')}
                              className="border-0 p-0 ps-2 form-control"
                            />
                            <button
                              type="submit"
                              className="btn btn-group-vertical"
                              disabled={isSubmitting}
                            >
                              {t('channels.send')}
                            </button>
                            <div className="invalid-feedback">
                              <ErrorMessage name="body" />
                            </div>
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
      </div>
      <ToastContainer />
      <ModalWindow
        show={!!modalInfo.type}
        handleClose={handleCloseModal}
        modalType={modalInfo.type}
        modalProps={modalInfo.props}
      />
    </div>
  );
};

export default Home;
