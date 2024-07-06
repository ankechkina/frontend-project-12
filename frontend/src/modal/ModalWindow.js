import React from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { Formik, Field, ErrorMessage } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import { useAddChannelMutation, useEditChannelMutation, useRemoveChannelMutation } from '../api/channelsApi';
import {
  addNewChannel, setChannelsError, setCurrentChannel, changeChannelName, removeChannel, defaultChannelId,
} from '../store/entities/channelsSlice';
import { getChannelNameSchema } from '../utils/validationSchemas';
import { useToast } from '../context/ToastContext';

const ModalWindow = ({
  show, handleClose, modalType, modalProps,
}) => {
  const dispatch = useDispatch();

  const toast = useToast();

  const [addChannel] = useAddChannelMutation();
  const [renameChannel] = useEditChannelMutation();
  const [removeChannelApi] = useRemoveChannelMutation();

  const { channels } = useSelector((state) => state.channels);

  const { username } = useSelector((state) => state.user);

  const { t } = useTranslation();

  const channelNameSchema = getChannelNameSchema(t, channels);

  const handleFormSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      if (modalType === 'adding') {
        await addChannel(values).unwrap();

        const response = await addChannel(values).unwrap();
        dispatch(addNewChannel(response));

        if (modalProps.creatorName === username) {
          console.log('имена равны');
          dispatch(setCurrentChannel(response.id));
        } else {
          console.log('имена НЕ равны');
        }
        toast.success(t('channels.channelCreated'));
      } else if (modalType === 'renaming') {
        await renameChannel({ id: modalProps.channelId, newChannelName: { name: values.name } }).unwrap();
        toast.success(t('channels.channelRenamed'));
      }
      handleClose();
      resetForm();
    } catch (err) {
      dispatch(setChannelsError(err));
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const { currentChannelId } = useSelector((state) => state.channels);

  const handleRemove = async () => {
    try {
      await removeChannelApi({ id: modalProps.channelId }).unwrap();
      dispatch(removeChannel({ id: modalProps.channelId }));
      if (modalProps.channelId === currentChannelId) {
        dispatch(setCurrentChannel(defaultChannelId));
      }
      handleClose();
      toast.success(t('channels.channelDeleted'));
    } catch (err) {
      dispatch(setChannelsError(err));
      toast.error(err.message);
    }
  };

  const renderContent = () => {
    if (modalType === 'adding' || modalType === 'renaming') {
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

    if (modalType === 'removing') {
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
    if (modalType === 'adding') return t('modal.addChannel');
    if (modalType === 'renaming') return t('modal.renameChannel');
    if (modalType === 'removing') return t('modal.deleteChannel');
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
