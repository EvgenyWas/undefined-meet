import { BrowserRouter, Navigate, Route, Routes } from 'react-router';
import { SWRConfig, type BareFetcher } from 'swr';

import { Home } from '@/routes/Home';
import { MeetingRoom } from '@/routes/MeetingRoom';

const fetcher: BareFetcher = async (url) => {
  const res = await fetch(url);
  const data = await res
    .json()
    .catch(() => ({ message: 'Something went wrong...' }));
  if (res.ok) {
    return data;
  }

  return Promise.reject(data);
};

const App = () => {
  return (
    <SWRConfig value={{ fetcher, shouldRetryOnError: false }}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/room" element={<MeetingRoom />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </SWRConfig>
  );
};

export default App;
