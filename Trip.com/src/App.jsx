// App.jsx
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './components/HomePage/HomePage.jsx';
import LoginModal from './components/Login/LoginModal.jsx';
import Places from './components/TouristSpot/Places.jsx';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginModal />} />
        <Route path="/touristspot" element={<Places />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/" element={<HomePage />} />
        {/* Other routes go here */}
      </Routes>
    </Router>
  );
}

export default App;
