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
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { signInSuccess, signOut } from "./utils/userSlice";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5005";

function App() {
  const dispatch = useDispatch();
  const [terms, setTerms] = useState<{ value: string; text: string }[]>([]);
  const [isLoadingTerms, setIsLoadingTerms] = useState(true);

  // On app load, verify the cookie and hydrate Redux with the current user.
  // This runs after every OAuth redirect and on every page refresh.
  useEffect(() => {
    fetch(`${API_URL}/api/auth/me`, { credentials: "include" })
      .then((res) => res.json())
      .then((user) => {
        if (user) dispatch(signInSuccess(user));
        else dispatch(signOut());
      })
      .catch(() => dispatch(signOut()));
  }, [dispatch]);

  // fetch terms for upload when the site loads
  useEffect(() => {
    setIsLoadingTerms(true);
    fetch(`${API_URL}/terms`)
      .then((res) => res.json())
      .then((data) => setTerms(data.terms))
      .catch((err) => console.error("Error fetching terms:", err))
      .finally(() => setIsLoadingTerms(false));
  }, []);

  return (
    <BrowserRouter>
      <div>
        <NavBar />
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
            <Route path="/upload" element={<Upload terms={terms} isLoadingTerms={isLoadingTerms} />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Route>
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
