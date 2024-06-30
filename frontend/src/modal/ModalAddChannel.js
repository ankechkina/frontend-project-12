import React from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { Field, Formik } from 'formik';
import { useDispatch } from 'react-redux';
import { useAddChannelMutation } from '../api/channelsApi';
import { addNewChannel, setChannelsError, setCurrentChannel } from '../store/entities/channelsSlice';

const ModalAddChannel = ({ show, handleClose }) => {
  const [addChannel, { isLoading }] = useAddChannelMutation();
  const dispatch = useDispatch();

  const handleSubmitAdd = async (values, { setSubmitting, resetForm }) => {
    try {
      const response = await addChannel(values).unwrap();
      const { id } = response;
      dispatch(addNewChannel(response));
      dispatch(setCurrentChannel(id));
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
        <Modal.Title>Добавить канал</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Formik
          initialValues={{ name: '' }}
          onSubmit={handleSubmitAdd}
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

export default ModalAddChannel;
