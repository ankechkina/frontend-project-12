import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { Modal, Button } from 'react-bootstrap';
import { useRemoveChannelMutation } from '../../api/channelsApi';
import { useToast } from '../../context/ToastContext';
import { setCurrentChannel, defaultChannelId } from '../../store/entities/appSlice';

const Rename = ({ show, handleClose, modalProps }) => {
  const { channelId } = modalProps;
  const [removeChannelApi] = useRemoveChannelMutation();
  const { t } = useTranslation();
  const toast = useToast();
  const dispatch = useDispatch();
  const { currentChannelId } = useSelector((state) => state.app);

  const handleRemove = async () => {
    try {
      await removeChannelApi(channelId).unwrap();
      if (channelId === currentChannelId) {
        dispatch(setCurrentChannel(defaultChannelId));
      }
      handleClose();
      toast.success(t('channels.channelDeleted'));
    } catch (err) {
      console.error(err);
      toast.error(err.message);
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{t('modal.deleteChannel')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>{t('modal.confirmDeletion')}</p>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            {t('modal.cancel')}
          </Button>
          <Button onClick={handleRemove} className="btn btn-danger">
            {t('channels.delete')}
          </Button>
        </Modal.Footer>
      </Modal.Body>
    </Modal>
  );
};

export default Rename;
