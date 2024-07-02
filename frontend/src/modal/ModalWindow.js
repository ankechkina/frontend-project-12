import React from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { Formik, Field, ErrorMessage } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import classNames from 'classnames';
import { useAddChannelMutation, useEditChannelMutation, useRemoveChannelMutation } from '../api/channelsApi';
import {
  addNewChannel, setChannelsError, setCurrentChannel, changeChannelName, removeChannel, defaultChannelId,
} from '../store/entities/channelsSlice';
import { channelNameSchema } from '../utils/validationSchemas';

const ModalWindow = ({
  show, handleClose, modalType, modalProps,
}) => {
  const dispatch = useDispatch();

  const [addChannel] = useAddChannelMutation();
  const [renameChannel] = useEditChannelMutation();
  const [removeChannelApi] = useRemoveChannelMutation();

  const { channels } = useSelector((state) => state.channels);

  const handleFormSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      if (modalType === 'adding') {
        const response = await addChannel(values).unwrap();
        dispatch(addNewChannel(response));
        dispatch(setCurrentChannel(response.id));
      } else if (modalType === 'renaming') {
        const response = await renameChannel({ id: modalProps.channelId, newChannelName: { name: values.name } }).unwrap();
        dispatch(changeChannelName(response));
      }
      handleClose();
      resetForm();
    } catch (err) {
      dispatch(setChannelsError(err));
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
    } catch (err) {
      dispatch(setChannelsError(err));
    }
  };

  const renderContent = () => {
    if (modalType === 'adding' || modalType === 'renaming') {
      return (
        <Formik
          initialValues={{ name: '' }}
          validationSchema={channelNameSchema(channels)}
          onSubmit={handleFormSubmit}
        >
          {({ handleSubmit, isSubmitting, errors }) => (
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="name">
                <label htmlFor="name" className="form-label visually-hidden">Имя канала</label>
                <Field
                  name="name"
                  type="text"
                  className={classNames('form-control', { 'is-invalid': errors.name })}
                  id="name"
                />
                <ErrorMessage name="name" component="div" className="invalid-tooltip" />
              </Form.Group>
              <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>Отменить</Button>
                <Button type="submit" variant="primary" disabled={isSubmitting}>Отправить</Button>
              </Modal.Footer>
            </Form>
          )}
        </Formik>
      );
    }

    if (modalType === 'removing') {
      return (
        <>
          <p>Уверены?</p>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>Отменить</Button>
            <Button onClick={handleRemove} className="btn btn-danger">Удалить</Button>
          </Modal.Footer>
        </>
      );
    }
    return null;
  };

  const getTitle = () => {
    if (modalType === 'adding') return 'Добавить канал';
    if (modalType === 'renaming') return 'Переименовать канал';
    if (modalType === 'removing') return 'Удалить канал';
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
