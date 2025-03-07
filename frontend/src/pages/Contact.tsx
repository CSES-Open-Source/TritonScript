import "./Contact.css";

export default function Contact(){
    return (
        <div>
            <div className="header">
                <h3>Find us on these platforms!</h3>
            </div>
            <div className="contact-container">
                <a href="mailto:cses@ucsd.edu" target="_blank" rel="noopener noreferrer">
                    <img src="/email.svg" alt="Email" className="social-icon" />
                </a>
                <a href="https://www.instagram.com/cses_ucsd/" target="_blank" rel="noopener noreferrer">
                    <img src="/instagram.svg" alt="Instagram" className="social-icon" />
                </a>
                <a href="https://www.facebook.com/csesucsd" target="_blank" rel="noopener noreferrer">
                    <img src="/facebook.svg" alt="Facebook" className="social-icon" />
                </a>
                <a href="https://www.linkedin.com/in/csesucsd/" target="_blank" rel="noopener noreferrer">
                    <img src="/linkedin.svg" alt="LinkedIn" className="social-icon" />
                </a>
                <a href="https://discord.com/invite/UkdACyy2h8" target="_blank" rel="noopener noreferrer">
                    <img src="/discord.svg" alt="Discord" className="social-icon" />
                </a>
                <a href="https://linktr.ee/csesucsd" target="_blank" rel="noopener noreferrer">
                    <img src="/linktree.svg" alt="LinkTree" className="social-icon" />
                </a>
                
            </div>
        </div>
    );
}