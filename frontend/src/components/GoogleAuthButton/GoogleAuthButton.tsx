import classes from "./GoogleAuthButton.module.css";
import googleLogoUrl from "../../assets/google.svg";
import { signInFailure, signInStart } from "../../utils/userSlice.ts";
import { useDispatch } from "react-redux";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5005";

export default function GoogleAuthButton({ text }: { text: string }) {
  const dispatch = useDispatch();

  function handleClick() {
    dispatch(signInStart());
    window.location.href = `${API_URL}/api/auth/google/login`;
  }

  return <div className={classes.button} onClick={handleClick}>
    <div className={classes.googleLogo}>
      <svg width={40} height={40} className="svg">
        <image width={40} height={40} href={googleLogoUrl} />
      </svg>
    </div>
    <div className={classes.text}><span>{text}</span></div>
  </div>;
}
