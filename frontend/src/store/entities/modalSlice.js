import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isOpen: false,
  modalWindowType: null,
  props: null,
};

const modalSlice = createSlice({
  name: 'modalWindow',
  initialState,
  reducers: {
    openModalWindow: (state, action) => ({
      ...state,
      isOpen: true,
      modalWindowType: action.payload.type,
      props: action.payload.props,
    }),
    closeModalWindow: (state) => ({
      ...state,
      isOpen: false,
      modalWindowType: null,
      props: null,
    }),
  },
});

export const { openModalWindow, closeModalWindow } = modalSlice.actions;

export default modalSlice.reducer;
