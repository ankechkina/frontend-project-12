import React, { useEffect, useCallback } from 'react';
import {
  Formik, Form, Field, ErrorMessage,
} from 'formik';
import { useSocket } from '../context/SocketContext';

const ChatWindow = ({
  filter, currentChannelName, filteredMessages, t, handleSendMessage, messageRef, refetchMessages,
}) => {
  const socket = useSocket();

  const onMessage = useCallback(() => {
    refetchMessages();
  }, [refetchMessages]);

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
        </div>
        <div className="mt-auto px-5 py-3">
          <Formik
            initialValues={{ message: '' }}
            onSubmit={handleSendMessage}
          >
            {({ handleSubmit, isSubmitting }) => (
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
