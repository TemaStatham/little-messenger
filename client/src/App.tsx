import { ChatComponent } from './components/chat/ChatComponent';
import { AuthComponent } from './components/auth/AuthComponent';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ChatComponent />} />
        <Route path="/auth" element={<AuthComponent />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
