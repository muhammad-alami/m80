// src/pages/DashboardPage.jsx

import React from 'react';

function DashboardPage() {
  return (
    <main>
      <h1>Generative AI for Antibiotic Discovery</h1>

      {/* 200-word-ish summary of the article */}
      <p>
        M80 focuses on a recent generative AI breakthrough in the fight against
        antibiotic-resistant bacteria. Researchers at the Broad Institute of MIT
        and Harvard, together with collaborators, built deep learning models that
        can design entirely new antibiotic molecules instead of only screening
        existing ones. These models are trained on tens of thousands of chemical
        structures and learn which fragments are likely to have strong
        antibacterial activity while still remaining non-toxic and drug-like.
        In the study, the team used two generative AI platforms. One model
        started from a known active fragment and “decorated” it by adding atoms
        and bonds, scoring each new compound for its ability to kill bacteria and
        its likelihood of being safe. The second model built molecules starting
        from a single atom and grew them step by step. From several hundred
        AI-designed candidates, chemists synthesized 24 molecules in the lab;
        seven showed real antibiotic effects, and two lead compounds – NG1 and
        DN1 – were especially effective against multidrug-resistant gonorrhea,
        with DN1 also killing MRSA.
      </p>

      {/* Source URL */}
      <p>
        <strong>Source:&nbsp;</strong>
        <a
          href="https://www.fiercebiotech.com/research/deep-learning-generative-ai-models-build-new-antibiotics-starting-single-atom"
          target="_blank"
          rel="noopener noreferrer"
        >
          FierceBiotech – Generative AI models build new antibiotics starting
          from a single atom
        </a>
      </p>

      {/* Tech stack / infrastructure paragraph */}
	<p>
  This M80 project uses a fully decoupled architecture consisting of a Node.js and
  Express backend running on port 3000, and a React single-page application built
  with Vite and served through NGINX on port 80. The backend exposes protected
  endpoints using JSON Web Tokens (JWT), including routes for user authentication,
  a health check, and two chart data sources (Summary and Reports). All chart data
  is stored in MongoDB and retrieved via authenticated HTTP GET requests from the
  frontend. NGINX is configured both to serve the React build files and to
  reverse-proxy any request beginning with <code>/api</code> to the backend
  service, enabling the frontend and backend to operate independently while
  appearing as a unified application to the user.
	</p>
    </main>
  );
}

export default DashboardPage;

