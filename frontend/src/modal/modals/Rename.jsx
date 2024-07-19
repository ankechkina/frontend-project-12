import React, { useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Modal, Button, Form } from 'react-bootstrap';
import { Formik, Field, ErrorMessage } from 'formik';
import { useEditChannelMutation, channelsApi } from '../../api/channelsApi';
import { getChannelNameSchema } from '../../utils/validationSchemas';
import { useToast } from '../../context/ToastContext';
import useChannelName from '../../hooks/useChannelName';

const Rename = ({
  show, handleClose, modalProps,
}) => {
  const { channelId } = modalProps;
  const [renameChannel] = useEditChannelMutation();
  const { t } = useTranslation();
  const toast = useToast();

  const previousChannelName = useChannelName(channelId);

  const inputRef = useRef(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const channels = useSelector((state) => channelsApi.endpoints.getChannels.select()(state)?.data);
  const channelNameSchema = getChannelNameSchema(t, channels);

  const handleRenameChannel = async (id, newChannelName) => {
    await renameChannel({ id, newChannelName: { name: newChannelName } }).unwrap();
    toast.success(t('channels.channelRenamed'));
  };

  const handleFormSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      await handleRenameChannel(channelId, values.name);
      handleClose();
      resetForm();
    } catch (err) {
      console.error(err);
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{t('modal.renameChannel')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Formik
          initialValues={{ name: previousChannelName || '' }}
          validationSchema={channelNameSchema}
          onSubmit={handleFormSubmit}
        >
          {({ handleSubmit, isSubmitting, errors }) => (
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="name">
                <label htmlFor="name" className="form-label visually-hidden">
                  {t('channels.channelName')}
                </label>
                <Field
                  name="name"
                  type="text"
                  innerRef={inputRef}
                  className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                  id="name"
                  autoComplete="off"
                />
                <ErrorMessage name="name" component="div" className="invalid-tooltip" />
              </Form.Group>
              <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                  {t('modal.cancel')}
                </Button>
                <Button type="submit" variant="primary" disabled={isSubmitting}>
                  {t('channels.send')}
                </Button>
              </Modal.Footer>
            </Form>
          )}
        </Formik>
      </Modal.Body>
    </Modal>
  );
};

export default Rename;
