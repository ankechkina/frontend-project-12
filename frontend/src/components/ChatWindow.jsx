import React, {
  useMemo, useEffect, useCallback, useRef,
} from 'react';
import {
  Formik, Form, Field, ErrorMessage,
} from 'formik';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useSocket } from '../context/SocketContext';
import { useGetMessagesQuery, useAddMessageMutation, messagesApi } from '../api/messagesApi';
import useFilter from '../hooks/useFilter';
import { useToast } from '../context/ToastContext';
import useChannelName from '../hooks/useChannelName';

const ChatWindow = ({ handleLogout }) => {
  const socket = useSocket();
  const { username } = useSelector((state) => state.user);
  const { currentChannelId } = useSelector((state) => state.app);
  const { t } = useTranslation();
  const filter = useFilter();
  const toast = useToast();
  const dispatch = useDispatch();

  const {
    data: messagesData,
    error: messagesError,
  } = useGetMessagesQuery();

  const filteredMessages = useMemo(() => {
    const result = messagesData?.filter((m) => m.channelId === currentChannelId) ?? [];
    return result;
  }, [messagesData, currentChannelId]);

  const currentChannelName = useChannelName(currentChannelId);

  useEffect(() => {
    if (messagesError) {
      if (messagesError.status === 403) {
        handleLogout();
      } else {
        console.error(messagesError);
        toast.error(t('error.networkError'));
      }
    }
  }, [messagesError, t, toast, handleLogout]);

  const [addMessage] = useAddMessageMutation();

  const handleSendMessage = async (values, { setSubmitting, resetForm }) => {
    try {
      await addMessage({ body: values.message, channelId: currentChannelId, username }).unwrap();
      resetForm();
    } catch (error) {
      console.error(error);
      toast.error(t('error.networkError'));
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmitMessage = (values, { setSubmitting, resetForm }) => {
    const trimmedMessage = values.message.trim();
    if (trimmedMessage !== '') {
      handleSendMessage(values, { setSubmitting, resetForm });
    } else {
      setSubmitting(false);
    }
  };

  const inputRef = useRef(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [filteredMessages]);

  const onMessage = useCallback((newMessage) => {
    dispatch(
      messagesApi.util.updateQueryData('getMessages', undefined, (draftMessages) => {
        draftMessages.push(newMessage);
      }),
    );
  }, [dispatch]);

  useEffect(() => {
    socket.on('newMessage', onMessage);
    return () => {
      socket.off('newMessage', onMessage);
    };
  }, [socket, onMessage]);

  return (
    <div className="col p-0 h-100">
      <div className="d-flex flex-column h-100">
        <div className="bg-light mb-4 p-3 shadow-sm small">
          <p className="m-0">
            <b>
              #
              {filter.clean(currentChannelName)}
            </b>
          </p>
          <span className="text-muted">
            {`${t('channels.countMessages.messages', { count: filteredMessages.length })}`}
          </span>
        </div>
        <div id="messages-box" className="chat-messages overflow-auto px-5">
          {filteredMessages.map((message) => (
            <div key={message.id} className="text-break mb-2">
              <b>{message.username}</b>
              :
              {' '}
              {filter.clean(message.body)}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <div className="mt-auto px-5 py-3">
          <Formik
            initialValues={{ message: '' }}
            onSubmit={handleSubmitMessage}
          >
            {({ handleSubmit, isSubmitting }) => (
              <Form noValidate="" className="py-1 border rounded-2" onSubmit={handleSubmit}>
                <div className="input-group has-validation">
                  <Field
                    name="message"
                    innerRef={inputRef}
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
                    <ErrorMessage name="message" />
                  </div>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
