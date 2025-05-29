import { useEffect } from "react";
import { useSelector } from "react-redux";
import { Outlet, Navigate, useNavigate } from "react-router-dom";
import settings from "../utils/config";

export default function PrivateRoute() {
  const { currentUser } = useSelector((state: any) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    async function checkAuth() {
      fetch(`http://localhost:5173/api/auth/isAuth/${currentUser._id}`, {
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => {
          if (response.ok) {
            return response.json();
          }
        })
        .then((data) => {
          if (!data) {
            navigate("/signin");
          }
        })
        .catch((err) => console.error(err));
    }

    if (!currentUser) return;
    checkAuth();
  }, [currentUser, navigate]);

  return currentUser ? <Outlet /> : <Navigate to="/signin" />;
}
