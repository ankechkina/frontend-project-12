import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isModalOpen: false,
  modalWindowType: null,
  modalProps: null,
};

const appSlice = createSlice({
  name: 'modalWindow',
  initialState,
  reducers: {
    openModalWindow: (state, action) => ({
      ...state,
      isModalOpen: true,
      modalWindowType: action.payload.type,
      modalProps: action.payload.props,
    }),
    closeModalWindow: (state) => ({
      ...state,
      isModalOpen: false,
      modalWindowType: null,
      modalProps: null,
    }),
  },
});

export const { openModalWindow, closeModalWindow } = appSlice.actions;

export default appSlice.reducer;
