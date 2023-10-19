import { RecoilRoot } from 'recoil';
import AppRouter from './src/pages';

export default function App() {
  return (
    <RecoilRoot>
      <AppRouter />
    </RecoilRoot>
  );
}
