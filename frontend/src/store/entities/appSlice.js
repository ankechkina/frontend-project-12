import { createSlice } from '@reduxjs/toolkit';

export const defaultChannelId = '1';

const initialState = {
  currentChannelId: defaultChannelId,
  isModalOpen: false,
  modalWindowType: null,
  modalProps: null,
};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setCurrentChannel: (state, action) => ({
      ...state,
      currentChannelId: action.payload,
    }),
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

export const { openModalWindow, closeModalWindow, setCurrentChannel } = appSlice.actions;

export default appSlice.reducer;
