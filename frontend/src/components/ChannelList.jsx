import React from 'react';
import classNames from 'classnames';

const ChannelList = ({
  t,
  handleOpenModal,
  username,
  channels,
  currentChannelId,
  handleChannelClick,
  filter,
  dropdownsOpen,
  handleToggleDropdown,
}) => (
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

export default ChannelList;
