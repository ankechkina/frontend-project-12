import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import getModal from './modals/index';
import { closeModalWindow } from '../store/entities/appSlice';

const ModalWindow = () => {
  const { modalWindowType, modalProps } = useSelector((state) => state.app);
  const isModalOpen = useSelector((state) => state.app.isModalOpen);
  const dispatch = useDispatch();

  const handleCloseModal = () => {
    dispatch(closeModalWindow());
  };

  const Component = getModal(modalWindowType);

  return Component && (
    <Component
      show={isModalOpen}
      handleClose={handleCloseModal}
      modalProps={modalProps}
    />
  );
};

export default ModalWindow;
