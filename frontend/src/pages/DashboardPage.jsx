function DashboardPage() {
  return (
    <section>
      <h2>Dashboard</h2>

      <h3>Project Topic: Generative AI for Antibiotic Discovery</h3>
      <p>
        M80 focuses on a recent generative AI breakthrough in the fight against antibiotic-resistant
        bacteria. Researchers built deep learning models that can design entirely new antibiotic
        molecules instead of only screening existing ones. These models are trained on many
        thousands of chemical structures and learn which fragments are likely to have strong
        antibacterial activity while remaining safe and drug-like. In the study, the team used
        generative models that either expand a known active fragment or grow a molecule step by
        step, starting from a single atom. From several hundred AI-designed candidates, chemists
        were able to synthesize a smaller set in the lab. Seven of these compounds showed real
        antibiotic activity, and two lead molecules &mdash; NG1 and DN1 &mdash; were especially
        effective against multidrug-resistant gonorrhea, with DN1 also killing MRSA. This work
        shows how generative AI can move beyond discovery into true molecular design, potentially
        speeding up the development of much-needed new antibiotics.
      </p>

      <p>
        <strong>Source:</strong>{' '}
        <a
          href="https://www.fiercebiotech.com/research/deep-learning-generative-ai-models-build-new-antibiotics-starting-single-atom"
          target="_blank"
          rel="noreferrer"
        >
          Generative AI models build new antibiotics starting from a single atom
        </a>
        .
      </p>

      <h3>Technical Overview of M80</h3>
      <p>
        M80 is built as a decoupled single page application. The backend is a Node.js and Express
        server running on port 3000. It exposes a login endpoint that returns a JSON Web Token
        (JWT), plus two protected endpoints that provide chart data about the antibiotic pipeline
        and hit rates. Chart data is stored in MongoDB and re
