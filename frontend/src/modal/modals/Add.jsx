import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Modal, Button, Form } from 'react-bootstrap';
import { Formik, Field, ErrorMessage } from 'formik';
import { useAddChannelMutation } from '../../api/channelsApi';
import { getChannelNameSchema } from '../../utils/validationSchemas';
import { useToast } from '../../context/ToastContext';

const Add = ({ show, handleClose, modalProps }) => {
  const { creatorName } = modalProps;
  const [addChannel] = useAddChannelMutation();
  const { channels } = useSelector((state) => state.channels);
  const { t } = useTranslation();
  const toast = useToast();
  const channelNameSchema = getChannelNameSchema(t, channels);

  const handleFormSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      await addChannel({ ...values, creatorName }).unwrap();
      toast.success(t('channels.channelCreated'));
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
        <Modal.Title>{t('modal.addChannel')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Formik
          initialValues={{ name: '' }}
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
                  className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                  id="name"
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

export default Add;
