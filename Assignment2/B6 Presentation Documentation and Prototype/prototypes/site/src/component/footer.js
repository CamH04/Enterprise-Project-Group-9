import React from 'react';
import './footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">

        <div className="footer-block">
  <strong data-icon="ℹ️">About</strong>
  <ul>
    <li>
      <a href="#">MY Software</a>
    </li>
    <li>
      <a href="https://www.gatesheadhealth.nhs.uk/services/mental-health/" target="_blank" rel="noreferrer">
        Gateshead Mental Health Team
      </a>
    </li>
  </ul>
</div>

        <div className="footer-block">
          <strong data-icon="📞">Emergency contacts</strong>
          <ul>
            <li>116 123 — Samaritans (24/7)</li>
            <li>111 — NHS mental health line</li>
            <li>0800 1111 — Childline (under 19)</li>
          </ul>
        </div>

        <div className="footer-block">
          <strong data-icon="🔗">Useful links</strong>
          <ul>
            <li>
              <a href="https://www.nhs.uk/nhs-services/mental-health-services/find-nhs-talking-therapies-for-anxiety-and-depression/" target="_blank" rel="noreferrer">
                Talking therapies (NHS)
              </a>
            </li>
            <li>
              <a href="https://www.nhs.uk/nhs-services/mental-health-services/where-to-get-urgent-help-for-mental-health/" target="_blank" rel="noreferrer">
                Urgent mental health help
              </a>
            </li>
          </ul>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
