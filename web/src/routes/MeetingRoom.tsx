import { JitsiMeeting } from '@jitsi/react-sdk';
import type { IJitsiMeetExternalApi } from '@jitsi/react-sdk/lib/types';
import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import useSWRImmutable from 'swr/immutable';

import { Spinner } from '@/components/Spinner';
import { apiEndpoints, jitsiConfig } from '@/constants';
import type { IApiError } from '@/types/IApiError';
import type { IWhoAmIData } from '@/types/IWhoAmIData';

const domain = import.meta.env.WEB_JITSI_DOMAIN;
const roomName = import.meta.env.WEB_JITSI_ROOM_NAME;

export const MeetingRoom = () => {
  const navigate = useNavigate();
  const {
    data: user,
    error,
    isLoading,
  } = useSWRImmutable<IWhoAmIData, IApiError>(apiEndpoints.whoAmI);

  const hasSpinner = isLoading || error || !user;

  const onApiReady = (api: IJitsiMeetExternalApi) => {
    api.on('videoConferenceLeft', () => {
      navigate('/');
    });
  };

  useEffect(() => {
    if (error) {
      navigate('/', { replace: true });
    }
  }, [error]);

  return hasSpinner ? (
    <Spinner centered />
  ) : (
    <JitsiMeeting
      domain={domain}
      roomName={roomName}
      userInfo={{ displayName: user.name, email: user.email }}
      jwt={user.jitsiJwt}
      configOverwrite={jitsiConfig}
      spinner={() => <Spinner centered />}
      onReadyToClose={() => console.log('Meeting ended')}
      onApiReady={onApiReady}
    />
  );
};
