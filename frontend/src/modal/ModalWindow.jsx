import React from 'react';
import { useSelector } from 'react-redux';
import getModal from './modals/index';

const renderModal = ({
  modalType, props, show, handleClose,
}) => {
  const Component = getModal(modalType);

  if (!Component) {
    return null;
  }

  return <Component show={show} handleClose={handleClose} props={props} />;
};

const ModalWindow = ({ show, handleClose }) => {
  const { modalWindowType, props } = useSelector((state) => state.modalWindow);

  return (
    <>
      {renderModal({
        modalType: modalWindowType,
        props,
        show,
        handleClose,
      })}
    </>
  );
};

export default ModalWindow;
