import { useDispatch, useSelector } from "react-redux";
import settings from "../utils/config";
import { signOut } from "../utils/userSlice";
import "../../src/pages/Home.css";
import image from '../assets/cses-opensource-black-bg.png';

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
  return (
    <div className="features-container">
      <div className="title">
        <h1 className="name">Share, learn, and interact</h1>
        <h2 className="title-small">all in one place</h2>
      </div>
    {/* //   <div className="welcome-text">
    //     <p>Welcome to the CSES Open Source Class Notes Repository Project!</p> 
    //     <p>This repository is a collaborative effort undertaken by the 
    //         Computer Science and Engineering Society (CSES) at the University of California, San Diego (UCSD)
    //       </p>
    //   </div>
    //   <div className="goal-text-grid">
    //     <p className="goal-text">
    //       Our goal is to create a platform where every CSES member can actively contribute to building a valuable resource for UCSD students. 
    //         We aim to develop a community-driven forum for sharing class notes and educational resources. 
    //     </p>
    //     <img className="logo" src={image} alt="CSES Logo" />
    //   </div> */}
      <div>
      <section className="key-features">
        {/* <div className="key-features-title">
          <h2 className="features-title">Key Features</h2>
        </div> */}
        <div className="features-grid">
          <div className="feature-card">
            {/* <h3 className="feature-title">Repository <p className="feature-title small">of</p> Class Notes</h3> */}
            <p className="feature-text">
              A central repository where students can share their class notes
              and resources.
            </p>
          </div>
          <div className="feature-card">
            {/* <h3 className="feature-title">Mobile App <p className="feature-title small">and</p> Website</h3> */}
            <p className="feature-text">
              Accessible through both a mobile app and a web platform for
              seamless usability.
            </p>
          </div>
          <div className="feature-card">
            {/* <h3 className="feature-title">UCSD <p className="feature-title small">Credentials</p> Login</h3> */}
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
