import React from "react"
import { FaGithub } from "@react-icons/all-files/fa/FaGithub"
import { FaLinkedin } from "@react-icons/all-files/fa/FaLinkedin"
import { FaMedium } from "@react-icons/all-files/fa/FaMedium"

const SocialLinks = () => {
  return (
    <section className="social-link-cointainer">
      <ul className="link-container">
        <li className="link-item">
          <a href="https://github.com/shkim04" target="_blank" rel="noreferrer">
            <FaGithub />Github
          </a>
        </li>
        <li className="link-item">
          <a href="https://linkedin.com/in/shkim04" target="_blank" rel="noreferrer">
            <FaLinkedin />LinkedIn
          </a>
        </li>
        <li className="link-item">
          <a href="https://medium.com/@shkim04" target="_blank" rel="noreferrer">
            <FaMedium />Medium
          </a>
        </li>
      </ul>
    </section>
  );
};

export default SocialLinks;
