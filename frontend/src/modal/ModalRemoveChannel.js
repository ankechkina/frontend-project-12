import React from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { useRemoveChannelMutation } from '../api/channelsApi';
import {
  removeChannel, setChannelsError, setCurrentChannel, defaultChannelId,
} from '../store/entities/channelsSlice';

const ModalRemoveChannel = ({ show, handleClose, channelId }) => {
  const [removeChannelApi, { isLoading }] = useRemoveChannelMutation();
  const dispatch = useDispatch();

  const handleClickRemove = async () => {
    try {
      await removeChannelApi({ id: channelId }).unwrap();
      dispatch(removeChannel({ id: channelId }));
      dispatch(setChannelsError(null));
      dispatch(setCurrentChannel(defaultChannelId));
      handleClose();
    } catch (err) {
      console.error(err);
      dispatch(setChannelsError(err));
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Удалить канал</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Уверены?</p>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Отменить
          </Button>
          <Button onClick={handleClickRemove} type="button" className="btn btn-danger" disabled={isLoading}>
            Удалить
          </Button>
        </Modal.Footer>
      </Modal.Body>
    </Modal>
  );
};

export default ModalRemoveChannel;
