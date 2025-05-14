import './About.css'

export default function About() {
  return (
    <div className="container">
      <div className='card'>
        <h2 className="heading">What is CSES?</h2>
        <p className="paragraph">
          CSE Society was the first CSE organization at UCSD, starting over twenty years ago.
          We have innovated over the years to stay relevant in serving the CSE community.
          We are open to all majors and individuals who are interested in computing.
        </p>
        <h3 className="subheading">Want to learn more about CSES?</h3>
        <a href="https://csesucsd.com/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="link">
          Check out the CSES website
        </a>
      </div>

      <div className='card'>
        <h2 className="heading">What is Open Source at CSES?</h2>
        <p className="paragraph">
          No projects? No problem! Build your skills and collaborate with other students on real projects—no application required!
        </p>
        <h3 className="subheading">Want to contribute to this project?</h3>
        <a href="https://github.com/CSES-Open-Source/cses-tritonscript" 
          target="_blank" 
          rel="noopener noreferrer"
          className="link">
          Check out our GitHub repo
        </a>
      </div>

      <h2 className="heading">Meet Our Team!</h2>
      <div className="team-container">
        {teamMembers.map(({ name, role }) => (
          <div key={name} className="team-member">
            <h4 className="member-name">{name}</h4>
            <h5 className="role">{role}</h5>
          </div>
        ))}
      </div>
    </div>
  );
}

const teamMembers = [
  { name: "Aryen Singhal", role: "Engineering Manager" },
  { name: "Riyana Dutta", role: "Developer" },
  { name: "Thanh Trinh", role: "Developer" },
  { name: "Victoria Tran", role: "Developer" },
  { name: "Mallika Dasgupta", role: "Developer" },
];

