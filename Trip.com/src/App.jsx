// App.jsx
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './components/HomePage/HomePage.jsx';
import LoginModal from './components/Login/LoginModal.jsx';
import LoginAs from './components/Login/LoginAs.jsx';
import Places from './components/TouristSpot/Places.jsx';
import Details from './components/Details.jsx';
import SignUp from '../../my-app/src/Routes/SignUp.jsx';
import UserProfile from '../../my-app/src/Routes/UserProfile.jsx';
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginModal />} />
        <Route path="/loginas" element={<LoginAs />} />
        <Route path="/touristspot" element={<Places />} />
        <Route path="/touristspot/:spot_id" element={<Details />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/user/:username" element={<UserProfile />} />
        {/* Other routes go here */}
      </Routes>
    </Router>
  );
}

export default App;
