import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { channelsApi } from '../api/channelsApi';

const useChannelName = (channelId) => {
  const { t } = useTranslation();
  const channels = useSelector((state) => channelsApi.endpoints.getChannels.select()(state)?.data);
  const currentChannel = channels?.find((channel) => channel.id === channelId);
  const channelName = currentChannel ? currentChannel.name : t('error.channelNotFound');
  return channelName;
};

export default useChannelName;
