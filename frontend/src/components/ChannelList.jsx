import React, { useEffect, useCallback } from 'react';
import classNames from 'classnames';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Dropdown, ButtonGroup } from 'react-bootstrap';
import { setCurrentChannel, openModalWindow } from '../store/entities/appSlice';
import { useSocket } from '../context/SocketContext';
import { useGetChannelsQuery, channelsApi } from '../api/channelsApi';
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
  } = useGetChannelsQuery();

  const onNewChannel = useCallback(
    (channel) => {
      dispatch(
        channelsApi.util.updateQueryData('getChannels', undefined, (draftChannels) => {
          draftChannels.push(channel);
        }),
      );
      if (channel.creatorName === username) {
        dispatch(setCurrentChannel(channel.id));
      }
    },
    [dispatch, username],
  );

  const onRenameChannel = useCallback(
    (updatedChannel) => {
      dispatch(
        channelsApi.util.updateQueryData('getChannels', undefined, (originalChannels) => {
          const draftChannels = [...originalChannels];
          const index = draftChannels.findIndex((channel) => channel.id === updatedChannel.id);
          if (index !== -1) {
            draftChannels[index] = updatedChannel;
          }
          return draftChannels;
        }),
      );
    },
    [dispatch],
  );

  const onRemoveChannel = useCallback(
    (removedChannel) => {
      dispatch(
        channelsApi.util.updateQueryData('getChannels', undefined, (draftChannels) => {
          const removedChannelId = removedChannel.id;
          return draftChannels.filter((channel) => channel.id !== removedChannelId);
        }),
      );
    },
    [dispatch],
  );

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
                <Dropdown as={ButtonGroup}>
                  <Dropdown.Toggle
                    split
                    variant={channel.id === currentChannelId ? 'secondary' : 'light'}
                  >
                    <span className="visually-hidden">{t('channels.channelControl')}</span>
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item
                      onClick={() => handleOpenModal('renaming', { channelId: channel.id })}
                    >
                      {t('channels.rename')}
                    </Dropdown.Item>
                    <Dropdown.Item
                      onClick={() => handleOpenModal('removing', { channelId: channel.id })}
                    >
                      {t('channels.delete')}
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ChannelList;
