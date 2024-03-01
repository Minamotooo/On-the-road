// App.jsx
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";

import SignUp from "../../my-app/src/Routes/SignUp.jsx";
import { AuthProvider } from "./AuthContext.jsx";
import Dashboard from "./components/Client/Dashboard.jsx";
import Details from "./components/Details.jsx";
import HomePage from "./components/HomePage/HomePage.jsx";
import LoginAs from "./components/Login/LoginAs.jsx";
import LoginModal from "./components/Login/LoginModal.jsx";
import Places from "./components/TouristSpot/Places.jsx";
import Hotel from "./components/hotel/Hotel.jsx";
import HotelDetails from "./components/hotel/hotelDetails.jsx";
import HotelProfile from "./components/hotelside/Hotelprofile.jsx";
import EditProfile from "./components/Client/EditProfile.jsx";
import Restaurant from "./components/Restaurant/RestaurantHome.jsx";
//import HotelDetails from './HotelDetails';
function App() {
  // const { user } = useAuth();
  // console.log(user);
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginModal />} />
          <Route path="/loginas" element={<LoginAs />} />
          <Route path="/touristspot" element={<Places />} />
          <Route path="/hotel" element={<Hotel />} />
          <Route path="/touristspot/:spot_id" element={<Details />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/client/:username" element={<Dashboard />} />
          <Route
            path="/clientsidehotelpage/:hotelId"
            element={<HotelDetails />}
          />
          <Route path="/:business/:username" element={<HotelProfile />} />
          <Route path="/edit-profile/:username" element={<EditProfile />} />
          <Route path="/restaurant" element={<Restaurant />} />

          {/* Other routes go here */}
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
