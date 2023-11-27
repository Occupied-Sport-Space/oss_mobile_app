import { RecoilRoot } from 'recoil';
import AppRouter from './src/pages';
import eventsource from 'react-native-sse';

(global as any).EventSource = eventsource;

export default function App() {
  return (
    <RecoilRoot>
      <AppRouter />
    </RecoilRoot>
  );
}
