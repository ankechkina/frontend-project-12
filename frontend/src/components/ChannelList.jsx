import React, { useEffect, useState, useCallback } from 'react';
import classNames from 'classnames';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { setCurrentChannel, openModalWindow } from '../store/entities/appSlice';
import { useSocket } from '../context/SocketContext';
import { useGetChannelsQuery } from '../api/channelsApi';
import { useToast } from '../context/ToastContext';
import useFilter from '../hooks/useFilter';

const ChannelList = ({ handleLogout }) => {
  const dispatch = useDispatch();
  const socket = useSocket();
  const { username } = useSelector((state) => state.user);
  const { currentChannelId } = useSelector((state) => state.app);
  const toast = useToast();
  const { t } = useTranslation();
  const filter = useFilter();

  const handleOpenModal = (type, props) => {
    dispatch(openModalWindow({ type, props }));
  };

  const {
    data: channels,
    error: channelsError,
    isLoading: isLoadingChannels,
    refetch: refetchChannels,
  } = useGetChannelsQuery();

  const [dropdownsOpen, setDropdownsOpen] = useState({});

  const onNewChannel = useCallback((channel) => {
    refetchChannels();
    if (channel.creatorName === username) {
      dispatch(setCurrentChannel(channel.id));
    }
  }, [dispatch, username, refetchChannels]);

  const onRenameChannel = useCallback(() => {
    refetchChannels();
  }, [refetchChannels]);

  const onRemoveChannel = useCallback(() => {
    refetchChannels();
  }, [refetchChannels]);

  useEffect(() => {
    if (channelsError) {
      if (channelsError.status === 403) {
        handleLogout();
      } else {
        console.error(channelsError);
        toast.error(t('error.networkError'));
      }
    }
  }, [channelsError, t, toast, handleLogout]);

  useEffect(() => {
    socket.on('newChannel', onNewChannel);
    socket.on('renameChannel', onRenameChannel);
    socket.on('removeChannel', onRemoveChannel);

    return () => {
      socket.off('newChannel', onNewChannel);
      socket.off('renameChannel', onRenameChannel);
      socket.off('removeChannel', onRemoveChannel);
    };
  }, [socket, onNewChannel, onRenameChannel, onRemoveChannel]);

  if (isLoadingChannels) {
    return <div>{t('channels.loading')}</div>;
  }

  const handleChannelClick = (channelId) => {
    dispatch(setCurrentChannel(channelId));
  };

  const handleToggleDropdown = (channelId) => {
    setDropdownsOpen((prevState) => ({
      ...prevState,
      [channelId]: !prevState[channelId],
    }));
  };

  return (
    <div className="col-4 col-md-2 border-end px-0 bg-light d-flex flex-column h-100">
      <div className="d-flex mt-1 justify-content-between mb-2 p-4 ps-4 pe-2">
        <b>{t('channels.channels')}</b>
        <button
          type="button"
          className="btn btn-group-vertical p-0 text-primary"
          id="add-channel-button"
          onClick={() => handleOpenModal('adding', { creatorName: username })}
        >
          <span>+</span>
        </button>
      </div>
      <ul
        id="channels-box"
        className="nav flex-column nav-pills nav-fill px-2 mb-3 overflow-auto h-100 d-block"
      >
        {channels.map((channel) => (
          <li key={channel.id} className="nav-item w-100">
            <div role="group" className="d-flex dropdown btn-group">
              <button
                type="button"
                className={classNames(
                  'w-100 rounded-0 text-start text-truncate btn',
                  { 'btn-secondary': channel.id === currentChannelId },
                )}
                onClick={() => handleChannelClick(channel.id)}
              >
                <span className="me-1">#</span>
                {filter.clean(channel.name)}
              </button>
              {channel.removable && (
                <>
                  <button
                    type="button"
                    aria-expanded={!!dropdownsOpen[channel.id]}
                    className={classNames(
                      'flex-grow-0 dropdown-toggle dropdown-toggle-split btn',
                      { 'btn-secondary': channel.id === currentChannelId },
                    )}
                    onClick={() => handleToggleDropdown(channel.id)}
                  >
                    <span className="visually-hidden">{t('channels.channelControl')}</span>
                  </button>
                  <div
                    className={classNames(
                      'dropdown-menu',
                      { show: !!dropdownsOpen[channel.id] },
                    )}
                  >
                    <button
                      type="button"
                      className="dropdown-item"
                      onClick={() => {
                        handleOpenModal('renaming', { channelId: channel.id });
                        handleToggleDropdown(channel.id);
                      }}
                    >
                      {t('channels.rename')}
                    </button>
                    <button
                      type="button"
                      className="dropdown-item"
                      onClick={() => {
                        handleOpenModal('removing', { channelId: channel.id });
                        handleToggleDropdown(channel.id);
                      }}
                    >
                      {t('channels.delete')}
                    </button>
                  </div>
                </>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ChannelList;
