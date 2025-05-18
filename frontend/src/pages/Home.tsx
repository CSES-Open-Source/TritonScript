import { useDispatch, useSelector } from "react-redux";
import settings from "../utils/config";
import { signOut } from "../utils/userSlice";
import "../../src/pages/Home.css";
import { useEffect } from "react";

export default function Home() {
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state: any) => state.user);

  async function handleSignOut() {
    try {
      await fetch(`${settings.domain}/api/auth/signout`, {
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
      dispatch(signOut());
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    // Add a specific class to the body for Home page
    document.body.classList.add("home-background");

    // Cleanup: Remove the class when leaving the page
    return () => {
      document.body.classList.remove("home-background");
    };
  }, []);
  return (
    <div className="features-container">
      <div className="title">
        <h1 className="name">Share, learn, and interact</h1>
        <h2 className="title-small">all in one place</h2>
      </div>

      <div>
      <section className="key-features">
        <div className="features-grid">
          <div className="feature-card1">
            <img className="card-tape" src="src/assets/tape2.png"/>
            <p className="feature-text">
              A central repository where students can share their class notes
              and resources.
            </p>
          </div>
          <div className="feature-card2">
            <img className="card-tape" src="src/assets/tape2.png"/>
            <p className="feature-text">
              Accessible through both a mobile app and a web platform for
              seamless usability.
            </p>
          </div>
          <div className="feature-card3">
            <img className="card-tape" src="src/assets/tape2.png"/>
            <p className="feature-text">
              Securely log in using your UCSD credentials to ensure the
              authenticity of contributors.
            </p>
          </div>
        </div>
      </section>
        {/* <button onClick={handleSignOut}>Sign out</button> */}
      </div>
      
    </div>
  );
}
