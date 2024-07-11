import React from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { Formik, Field, ErrorMessage } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import { useAddChannelMutation, useEditChannelMutation, useRemoveChannelMutation } from '../api/channelsApi';
import {
  setCurrentChannel, removeChannel, defaultChannelId,
} from '../store/entities/channelsSlice';
import { getChannelNameSchema } from '../utils/validationSchemas';
import { useToast } from '../context/ToastContext';

const ModalWindow = ({ show, handleClose }) => {
  const dispatch = useDispatch();
  const toast = useToast();

  const { modalWindowType, props } = useSelector((state) => state.modalWindow);

  const [addChannel] = useAddChannelMutation();
  const [renameChannel] = useEditChannelMutation();
  const [removeChannelApi] = useRemoveChannelMutation();

  const { channels } = useSelector((state) => state.channels);

  const { t } = useTranslation();

  const channelNameSchema = getChannelNameSchema(t, channels);

  const handleRenameChannel = async (channelId, newChannelName) => {
    await renameChannel({ id: channelId, newChannelName: { name: newChannelName } }).unwrap();
    toast.success(t('channels.channelRenamed'));
  };

  const handleFormSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      if (modalWindowType === 'adding') {
        await addChannel({ ...values, creatorName: props.creatorName }).unwrap();
        toast.success(t('channels.channelCreated'));
      } else if (modalWindowType === 'renaming') {
        await handleRenameChannel(props.channelId, values.name);
      }
      handleClose();
      resetForm();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const { currentChannelId } = useSelector((state) => state.channels);

  const handleRemove = async () => {
    try {
      await removeChannelApi({ id: props.channelId }).unwrap();
      dispatch(removeChannel({ id: props.channelId }));
      if (props.channelId === currentChannelId) {
        dispatch(setCurrentChannel(defaultChannelId));
      }
      handleClose();
      toast.success(t('channels.channelDeleted'));
    } catch (err) {
      toast.error(err.message);
    }
  };

  const renderContent = () => {
    if (modalWindowType === 'adding' || modalWindowType === 'renaming') {
      return (
        <Formik
          initialValues={{ name: '' }}
          validationSchema={channelNameSchema}
          onSubmit={handleFormSubmit}
        >
          {({ handleSubmit, isSubmitting, errors }) => (
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="name">
                <label htmlFor="name" className="form-label visually-hidden">{t('channels.channelName')}</label>
                <Field
                  name="name"
                  type="text"
                  className={classNames('form-control', { 'is-invalid': errors.name })}
                  id="name"
                />
                <ErrorMessage name="name" component="div" className="invalid-tooltip" />
              </Form.Group>
              <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>{t('modal.cancel')}</Button>
                <Button type="submit" variant="primary" disabled={isSubmitting}>{t('channels.send')}</Button>
              </Modal.Footer>
            </Form>
          )}
        </Formik>
      );
    }

    if (modalWindowType === 'removing') {
      return (
        <>
          <p>{t('modal.confirmDeletion')}</p>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>{t('modal.cancel')}</Button>
            <Button onClick={handleRemove} className="btn btn-danger">{t('channels.delete')}</Button>
          </Modal.Footer>
        </>
      );
    }
    return null;
  };

  const getTitle = () => {
    if (modalWindowType === 'adding') return t('modal.addChannel');
    if (modalWindowType === 'renaming') return t('modal.renameChannel');
    if (modalWindowType === 'removing') return t('modal.deleteChannel');
    return '';
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{getTitle()}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {renderContent()}
      </Modal.Body>
    </Modal>
  );
};

export default ModalWindow;
