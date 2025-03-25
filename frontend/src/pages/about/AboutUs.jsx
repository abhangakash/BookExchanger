import React from "react";
import Navbar from "../../components/navbar/Navbar";
import Footer from "../../components/footer/Footer";
import "./AboutUs.css"; // Add your styles here
// ✅ Import team member images
import TeamImg from "../../assets/TeamImg.jpg";
// import TeamImg from "../../assets/TeamImg.jpg";
// import TeamImg from "../../assets/TeamImg.jpg";
// import TeamImg from "../../assets/TeamImg.jpg";

const teamMembers = [
    {
        name: "FirstName LastName",
        role: "Founder & Full Stack Developer",
        image: TeamImg,
    },
    {
        name: "FirstName LastName",
        role: "UI/UX Designer",
        image: TeamImg,
    },
    {
        name: "FirstName LastName",
        role: "Backend Engineer",
        image: TeamImg,
    },
    {
        name: "FirstName LastName",
        role: "Marketing & Growth",
        image: TeamImg,
    },
];

const AboutUs = () => {
    return (
        <div>
            <Navbar />
            <main className="about-container">
                {/* Intro Section */}
                <section className="about-hero">
                    <h1>About Book<span className="highlight">X</span>changer</h1>
                    <p>
                        BookXchanger is a community-driven platform created to help students and readers buy, sell, or rent books
                        with ease. Our mission is to promote sustainable book sharing and affordable learning access.
                    </p>
                </section>

                {/* Mission Section */}
                <section className="about-mission">
                    <h2>📘 Our Mission</h2>
                    <p>
                        We're on a journey to reduce book waste and connect book lovers through seamless book exchanges.
                        Whether you want to rent a textbook, sell a novel, or find affordable academic materials — we're here to help!
                    </p>
                </section>

                {/* Team Section */}
                <section className="about-team">
                    <h2>👨‍💻 Meet Our Team</h2>
                    <div className="team-grid">
                        {teamMembers.map((member, index) => (
                            <div key={index} className="team-card">
                                <img src={member.image} alt={member.name} />
                                <h3>{member.name}</h3>
                                <p>{member.role}</p>
                            </div>
                        ))}
                    </div>
                </section>
                <section className="about-cta">
                    <h2>🚀 Ready to Get Started?</h2>
                    <p>Join thousands of users exchanging books and knowledge every day.</p>
                    <button className="btn btn-join">Join Now</button>
                </section>
            </main>
            <Footer />
        </div>
    );
};

export default AboutUs;
