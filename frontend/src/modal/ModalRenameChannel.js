import React from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { Field, Formik } from 'formik';
import { useDispatch } from 'react-redux';
import { useEditChannelMutation } from '../api/channelsApi';
import { changeChannelName, setChannelsError } from '../store/entities/channelsSlice';

const ModalRenameChannel = ({ show, handleClose, channelId }) => {
  const [renameChannel, { isLoading }] = useEditChannelMutation();
  const dispatch = useDispatch();

  const handleSubmitRename = async (values, { setSubmitting, resetForm }) => {
    try {
      const response = await renameChannel({ id: channelId, newChannelName: { name: values.name } }).unwrap();
      dispatch(changeChannelName(response));
      dispatch(setChannelsError(null));
      handleClose();
      resetForm();
    } catch (err) {
      console.error(err);
      dispatch(setChannelsError(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Переименовать канал</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Formik
          initialValues={{ name: '' }}
          onSubmit={handleSubmitRename}
        >
          {({
            values, handleChange, handleSubmit, isSubmitting,
          }) => (
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="name">
                <label htmlFor="name" className="form-label visually-hidden">Имя канала</label>
                <Field name="name" type="text" className="form-control" id="name" />
              </Form.Group>
              <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                  Отменить
                </Button>
                <Button type="submit" variant="primary" disabled={isSubmitting || isLoading}>
                  Отправить
                </Button>
              </Modal.Footer>
            </Form>
          )}
        </Formik>
      </Modal.Body>
    </Modal>
  );
};

export default ModalRenameChannel;
