import React from 'react';
import { useSelector } from 'react-redux';
import getModal from './modals/index';

const renderModal = ({
  modalWindowType, modalProps, show, handleClose,
}) => {
  const Component = getModal(modalWindowType);

  if (!Component) {
    return null;
  }

  return <Component show={show} handleClose={handleClose} modalProps={modalProps} />;
};

const ModalWindow = ({ show, handleClose }) => {
  const { modalWindowType, modalProps } = useSelector((state) => state.app);

  return (
    <>
      {renderModal({
        modalWindowType,
        modalProps,
        show,
        handleClose,
      })}
    </>
  );
};

export default ModalWindow;
