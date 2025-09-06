import "./Footer.css"

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-left">
        <a href="mailto:cses@ucsd.edu" target="_blank" rel="noopener noreferrer">
            <img src="src/assets/email.svg" alt="Email" className="social-icon" />
        </a>
        <a href="https://www.instagram.com/cses_ucsd/" target="_blank" rel="noopener noreferrer">
            <img src="src/assets/instagram.svg" alt="Instagram" className="social-icon" />
        </a>
        <a href="https://www.facebook.com/csesucsd" target="_blank" rel="noopener noreferrer">
            <img src="src/assets/facebook.svg" alt="Facebook" className="social-icon" />
        </a>
        <a href="https://www.linkedin.com/in/csesucsd/" target="_blank" rel="noopener noreferrer">
            <img src="src/assets/linkedin.svg" alt="LinkedIn" className="social-icon" />
        </a>
        <a href="https://discord.com/invite/UkdACyy2h8" target="_blank" rel="noopener noreferrer">
            <img src="src/assets/discord.svg" alt="Discord" className="social-icon-discord"/>
        </a>
        <a href="https://linktr.ee/csesucsd" target="_blank" rel="noopener noreferrer">
            <img src="src/assets/linktree.svg" alt="LinkTree" className="social-icon-linktree" />
        </a>
        <a href="https://github.com/CSES-Open-Source/TritonScript" target="_blank" rel="noopener noreferrer">
            <img src="src/assets/githublogo.svg" alt="Contribute to the GitHub" className="social-icon" />
        </a>
      </div>
      <div className="footer-right">
        <img src="src/assets/cses-opensource.png" alt="Logo" className="footer-logo" />
      </div>
    </footer>
  );
}