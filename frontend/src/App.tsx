import { BrowserRouter, Route, Routes } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";
import "./App.css";
import Home from "./pages/Home";
import About from "./pages/About";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Profile from "./pages/Profile";
import Contact from "./pages/Contact";
import Note from "./pages/Note";
import Upload from "./pages/Upload";
import Dashboard from "./pages/Dashboard";
import { useState } from "react";
import NavBar from "./components/NavBar";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const toggleLogin = () => {
    setIsLoggedIn(!isLoggedIn); // Toggle the login/logout state
  };

  return (
    <BrowserRouter>
      <div>
        {/* Pass the login state and toggle function to NavBar */}
        <NavBar isLoggedIn={isLoggedIn} toggleLogin={toggleLogin} />
      </div>

      <div>
        <Routes>
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact-us" element={<Contact />} />
          <Route path="/" element={<Home />} />
          <Route element={<PrivateRoute />}>
            <Route path="/profile" element={<Profile />} />
            <Route path="/note" element={<Note />} />
            <Route path="/upload" element={<Upload />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
