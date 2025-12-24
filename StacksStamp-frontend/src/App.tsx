import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { WalletProvider } from './contexts/WalletContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import CreateEvent from './pages/CreateEvent';
import EventDetail from './pages/EventDetail';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <WalletProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="create" element={<CreateEvent />} />
            <Route path="event/:id" element={<EventDetail />} />
            <Route path="dashboard" element={<Dashboard />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </WalletProvider>
  );
}

export default App;
