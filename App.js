import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LockKeyhole,
  ArrowRight,
  ShieldCheck,
  UserRound,
  Globe,
  KeyRound,
  Eye,
  EyeOff,
  Send,
  Sparkles,
  BookOpen,
  RotateCcw,
  ChevronRight,
  Info,
  ShieldAlert,
} from "lucide-react";

import "./App.css";


function modPower(base, exponent, modulus) {
  let result = 1;

  for (let i = 0; i < exponent; i++) {
    result = (result * base) % modulus;
  }

  return result;
}


function App() {

  const [page, setPage] = useState("home");

  const [step, setStep] = useState(1);

  const [p, setP] = useState(23);
  const [g, setG] = useState(5);

  const [aliceSecret, setAliceSecret] = useState(6);
  const [bobSecret, setBobSecret] = useState(15);

  const [showAliceSecret, setShowAliceSecret] = useState(false);
  const [showBobSecret, setShowBobSecret] = useState(false);

  const [explain, setExplain] = useState(null);

  const alicePublic = modPower(g, aliceSecret, p);
  const bobPublic = modPower(g, bobSecret, p);

  const aliceShared = modPower(bobPublic, aliceSecret, p);
  const bobShared = modPower(alicePublic, bobSecret, p);


  const resetExperiment = () => {
    setStep(1);
    setP(23);
    setG(5);
    setAliceSecret(6);
    setBobSecret(15);
    setShowAliceSecret(false);
    setShowBobSecret(false);
    setExplain(null);
  };


  /* ---------------- HOME ---------------- */

  if (page === "home") {

    return (
      <div className="app">

        <Background />

        <Navbar
          onHome={() => setPage("home")}
          onSimulator={() => {
            resetExperiment();
            setPage("simulator");
          }}
          onLearn={() => setPage("learn")}
        />

        <main className="hero">

          <motion.div
            className="badge"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <ShieldCheck size={16} />
            INTERACTIVE CRYPTOGRAPHY
          </motion.div>


          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            The Art of
            <br />
            <span>Shared Secrets.</span>
          </motion.h1>


          <motion.p
            className="hero-description"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            See how two strangers can create the same secret
            <br />
            without ever sending the secret itself.
          </motion.p>


          <motion.button
            className="start-button"
            onClick={() => {
              resetExperiment();
              setPage("simulator");
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
          >
            Start Experiment
            <ArrowRight size={19} />
          </motion.button>


          <Network />

        </main>

      </div>
    );
  }


  /* ---------------- LEARN ---------------- */

  if (page === "learn") {

    return (
      <div className="app">

        <Background />

        <Navbar
          onHome={() => setPage("home")}
          onSimulator={() => setPage("simulator")}
          onLearn={() => setPage("learn")}
        />

        <LearnPage
          onBack={() => setPage("home")}
          onSimulator={() => {
            resetExperiment();
            setPage("simulator");
          }}
        />

      </div>
    );
  }


  /* ---------------- SIMULATOR ---------------- */

  return (
    <div className="app">

      <Background />

      <Navbar
        onHome={() => setPage("home")}
        onSimulator={() => setPage("simulator")}
        onLearn={() => setPage("learn")}
      />


      <main className="simulator-content">

        <div className="simulator-heading">

          <span className="step-label">
            EXPERIMENT {step} / 5
          </span>

          <h1>
            Diffie–Hellman
            <span> Key Exchange</span>
          </h1>

          <p>
            Watch Alice and Bob create the same secret
            without ever sharing their private keys.
          </p>

        </div>


        {/* Progress */}

        <div className="progress-bar">

          {[1, 2, 3, 4, 5].map((number) => (

            <div
              key={number}
              className={
                number <= step
                  ? "progress-item active"
                  : "progress-item"
              }
            >
              <div className="progress-circle">
                {number}
              </div>

              <span>
                {number === 1 && "Public"}
                {number === 2 && "Private"}
                {number === 3 && "Keys"}
                {number === 4 && "Exchange"}
                {number === 5 && "Secret"}
              </span>
            </div>

          ))}

        </div>


        <AnimatePresence mode="wait">

          {/* STEP 1 */}

          {step === 1 && (

            <motion.section
              key="step1"
              className="step-section"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
            >

              <StepTitle
                number="01"
                title="Choose public values"
                description="Everyone can see these values. They are not secret."
              />


              <div className="values-grid">

                <ValueInput
                  label="Prime Number (p)"
                  value={p}
                  setValue={setP}
                  min={5}
                />

                <ValueInput
                  label="Generator (g)"
                  value={g}
                  setValue={setG}
                  min={2}
                />

              </div>


              <InfoBox>
                <Globe size={20} />

                <div>
                  <strong>Public information</strong>
                  <p>
                    Alice, Bob, and even an attacker can see
                    <b> p = {p}</b> and <b>g = {g}</b>.
                  </p>
                </div>
              </InfoBox>


              <NavigationButtons
                next={() => setStep(2)}
                nextText="Choose Private Keys"
              />

            </motion.section>

          )}


          {/* STEP 2 */}

          {step === 2 && (

            <motion.section
              key="step2"
              className="step-section"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
            >

              <StepTitle
                number="02"
                title="Choose private keys"
                description="These numbers belong only to Alice and Bob."
              />


              <div className="people-grid">

                <PersonCard
                  name="ALICE"
                  icon="👩"
                  secret={aliceSecret}
                  setSecret={setAliceSecret}
                  visible={showAliceSecret}
                  setVisible={setShowAliceSecret}
                  color="cyan"
                />

                <PersonCard
                  name="BOB"
                  icon="👨"
                  secret={bobSecret}
                  setSecret={setBobSecret}
                  visible={showBobSecret}
                  setVisible={setShowBobSecret}
                  color="purple"
                />

              </div>


              <InfoBox>

                <LockKeyhole size={20} />

                <div>
                  <strong>Keep these secret!</strong>

                  <p>
                    Alice's private key is <b>a</b>.
                    Bob's private key is <b>b</b>.
                    These values never travel through the network.
                  </p>
                </div>

              </InfoBox>


              <NavigationButtons
                back={() => setStep(1)}
                next={() => setStep(3)}
                nextText="Generate Public Keys"
              />

            </motion.section>

          )}


          {/* STEP 3 */}

          {step === 3 && (

            <motion.section
              key="step3"
              className="step-section"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
            >

              <StepTitle
                number="03"
                title="Generate public keys"
                description="Each person combines the public values with their private key."
              />


              <div className="calculation-grid">

                <CalculationCard
                  person="ALICE"
                  emoji="👩"
                  formula={`${g}^${aliceSecret} mod ${p}`}
                  result={alicePublic}
                  secret={aliceSecret}
                />

                <CalculationCard
                  person="BOB"
                  emoji="👨"
                  formula={`${g}^${bobSecret} mod ${p}`}
                  result={bobPublic}
                  secret={bobSecret}
                />

              </div>


              <div className="explain-row">

                <button
                  className="explain-button"
                  onClick={() =>
                    setExplain(
                      "A public key is calculated from the public values and a private key. The result can safely be shared with everyone."
                    )
                  }
                >
                  <Info size={16} />
                  Explain this
                </button>

              </div>


              {explain && (
                <InfoBox>
                  <Sparkles size={20} />

                  <div>
                    <strong>Simple explanation</strong>
                    <p>{explain}</p>
                  </div>
                </InfoBox>
              )}


              <NavigationButtons
                back={() => setStep(2)}
                next={() => setStep(4)}
                nextText="Exchange Public Keys"
              />

            </motion.section>

          )}


          {/* STEP 4 */}

          {step === 4 && (

            <motion.section
              key="step4"
              className="step-section"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
            >

              <StepTitle
                number="04"
                title="Exchange public keys"
                description="The public keys can travel openly across the network."
              />


              <div className="exchange">

                <ExchangePerson
                  name="ALICE"
                  emoji="👩"
                  secret={aliceSecret}
                />


                <div className="exchange-network">

                  <div className="network-line"></div>

                  <motion.div
                    className="moving-key"
                    animate={{
                      x: ["-130%", "130%", "-130%"],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    <KeyRound size={20} />
                  </motion.div>

                  <div className="exchange-globe">
                    <Globe size={30} />
                  </div>

                  <span className="network-label">
                    PUBLIC NETWORK
                  </span>

                </div>


                <ExchangePerson
                  name="BOB"
                  emoji="👨"
                  secret={bobSecret}
                />

              </div>


              <div className="exchange-values">

                <div className="exchange-value">
                  <span>Alice's public key</span>
                  <strong>{alicePublic}</strong>
                </div>

                <Send size={20} />

                <div className="exchange-value">
                  <span>Bob's public key</span>
                  <strong>{bobPublic}</strong>
                </div>

              </div>


              <InfoBox>

                <Eye size={20} />

                <div>
                  <strong>What can Eve see?</strong>

                  <p>
                    She can see <b>p</b>, <b>g</b>,
                    Alice's public key ({alicePublic}) and
                    Bob's public key ({bobPublic}).
                  </p>

                  <p>
                    She still cannot directly see their private keys.
                  </p>
                </div>

              </InfoBox>


              <NavigationButtons
                back={() => setStep(3)}
                next={() => setStep(5)}
                nextText="Create Shared Secret"
              />

            </motion.section>

          )}


          {/* STEP 5 */}

          {step === 5 && (

            <motion.section
              key="step5"
              className="step-section"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >

              <StepTitle
                number="05"
                title="The shared secret"
                description="Both sides perform a final calculation — and arrive at the same number."
              />


              <div className="secret-calculation">

                <motion.div
                  className="secret-side"
                  initial={{ opacity: 0, x: -40 }}
                  animate={{ opacity: 1, x: 0 }}
                >

                  <div className="secret-person">
                    👩
                    <span>ALICE</span>
                  </div>

                  <div className="big-formula">
                    {bobPublic}
                    <sup>{aliceSecret}</sup>
                    <small> mod {p}</small>
                  </div>

                  <div className="equals">
                    =
                  </div>

                  <div className="result-number">
                    {aliceShared}
                  </div>

                </motion.div>


                <div className="secret-divider">
                  <Sparkles size={25} />
                </div>


                <motion.div
                  className="secret-side"
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                >

                  <div className="secret-person">
                    👨
                    <span>BOB</span>
                  </div>

                  <div className="big-formula">
                    {alicePublic}
                    <sup>{bobSecret}</sup>
                    <small> mod {p}</small>
                  </div>

                  <div className="equals">
                    =
                  </div>

                  <div className="result-number">
                    {bobShared}
                  </div>

                </motion.div>

              </div>


              <motion.div
                className="success-card"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
              >

                <Sparkles size={28} />

                <h2>
                  SHARED SECRET ESTABLISHED
                </h2>

                <div className="shared-secret">
                  🔐 {aliceShared}
                </div>

                <p>
                  Alice and Bob calculated the same secret.
                </p>

              </motion.div>


              <div className="final-actions">

                <button
                  className="secondary-button"
                  onClick={() => setStep(4)}
                >
                  <ArrowRight size={17} />
                  See the Exchange
                </button>

                <button
                  className="start-button"
                  onClick={resetExperiment}
                >
                  <RotateCcw size={17} />
                  Run Again
                </button>

              </div>


              <EveCard
                p={p}
                g={g}
                alicePublic={alicePublic}
                bobPublic={bobPublic}
              />

            </motion.section>

          )}

        </AnimatePresence>

      </main>

    </div>
  );
}


/* =========================================================
   COMPONENTS
========================================================= */


function Background() {

  return (
    <>
      <div className="background-glow glow-one"></div>
      <div className="background-glow glow-two"></div>

      <div className="grid-background"></div>
    </>
  );
}


function Navbar({ onHome, onSimulator, onLearn }) {

  return (
    <nav className="navbar">

      <div
        className="logo"
        onClick={onHome}
        style={{ cursor: "pointer" }}
      >
        <LockKeyhole size={22} />
        <span>KEYFLOW</span>
      </div>


      <div className="nav-links">

        <span onClick={onSimulator}>
          Simulator
        </span>

        <span onClick={onLearn}>
          Learn
        </span>

        <span onClick={onHome}>
          About
        </span>

      </div>

    </nav>
  );
}


function Network() {

  return (

    <motion.div
      className="network"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.8 }}
    >

      <div className="person">

        <div className="person-icon">
          <UserRound size={24} />
        </div>

        <span>ALICE</span>

      </div>


      <div className="connection">

        <div className="connection-line"></div>

        <motion.div
          className="traveling-key"
          animate={{
            x: ["-100%", "100%", "-100%"],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
          }}
        >
          <KeyRound size={17} />
        </motion.div>


        <div className="network-node">
          <Globe size={24} />
        </div>

      </div>


      <div className="person">

        <div className="person-icon">
          <UserRound size={24} />
        </div>

        <span>BOB</span>

      </div>

    </motion.div>
  );
}


function StepTitle({ number, title, description }) {

  return (

    <div className="step-title">

      <span>{number}</span>

      <h2>{title}</h2>

      <p>{description}</p>

    </div>
  );
}


function ValueInput({ label, value, setValue, min }) {

  return (

    <div className="value-card">

      <label>{label}</label>

      <input
        type="number"
        min={min}
        value={value}
        onChange={(e) => setValue(Number(e.target.value))}
      />

      <span>
        Public
      </span>

    </div>
  );
}


function PersonCard({
  name,
  icon,
  secret,
  setSecret,
  visible,
  setVisible,
}) {

  return (

    <div className="person-card">

      <div className="person-avatar">
        {icon}
      </div>

      <h3>{name}</h3>

      <span className="private-label">
        PRIVATE KEY
      </span>


      <div className="secret-input">

        <input
          type={visible ? "number" : "password"}
          value={secret}
          onChange={(e) => setSecret(Number(e.target.value))}
          min="1"
        />

        <button
          onClick={() => setVisible(!visible)}
        >
          {visible
            ? <EyeOff size={18} />
            : <Eye size={18} />
          }
        </button>

      </div>

      <p>
        Only {name} knows this.
      </p>

    </div>
  );
}


function CalculationCard({
  person,
  emoji,
  formula,
  result,
  secret,
}) {

  return (

    <motion.div
      className="calculation-card"
      whileHover={{ y: -5 }}
    >

      <div className="calc-person">
        <span>{emoji}</span>
        <strong>{person}</strong>
      </div>


      <div className="formula">
        {formula}
      </div>


      <div className="calc-equals">
        =
      </div>


      <motion.div
        className="public-result"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
      >
        {result}
      </motion.div>


      <span className="public-key-label">
        PUBLIC KEY
      </span>

    </motion.div>
  );
}


function ExchangePerson({ name, emoji }) {

  return (

    <div className="exchange-person">

      <div className="exchange-avatar">
        {emoji}
      </div>

      <strong>{name}</strong>

      <span>
        PRIVATE KEY 🔒
      </span>

    </div>
  );
}


function InfoBox({ children }) {

  return (

    <div className="info-box">
      {children}
    </div>
  );
}


function NavigationButtons({
  back,
  next,
  nextText,
}) {

  return (

    <div className="navigation-buttons">

      {back && (

        <button
          className="secondary-button"
          onClick={back}
        >
          ← Back
        </button>

      )}

      <button
        className="start-button"
        onClick={next}
      >
        {nextText}
        <ChevronRight size={18} />
      </button>

    </div>
  );
}


function EveCard({
  p,
  g,
  alicePublic,
  bobPublic,
}) {

  return (

    <div className="eve-card">

      <div className="eve-icon">
        <ShieldAlert size={25} />
      </div>


      <div className="eve-content">

        <h3>
          🕵️ Eve — The Attacker
        </h3>

        <p>
          Eve can watch the public network, but she only sees:
        </p>


        <div className="eve-grid">

          <div>
            <span>Prime</span>
            <strong>{p}</strong>
          </div>

          <div>
            <span>Generator</span>
            <strong>{g}</strong>
          </div>

          <div>
            <span>Alice's Public</span>
            <strong>{alicePublic}</strong>
          </div>

          <div>
            <span>Bob's Public</span>
            <strong>{bobPublic}</strong>
          </div>

        </div>


        <div className="eve-hidden">

          <div>
            <EyeOff size={17} />
            Alice's private key
          </div>

          <div>
            <EyeOff size={17} />
            Bob's private key
          </div>

          <div>
            <EyeOff size={17} />
            Shared secret
          </div>

        </div>

      </div>

    </div>
  );
}


function LearnPage({ onBack, onSimulator }) {

  const concepts = [
    {
      number: "01",
      title: "Choose public numbers",
      text: "Alice and Bob agree on a prime number p and a generator g. Everyone is allowed to know these values.",
      formula: "p , g",
    },
    {
      number: "02",
      title: "Choose private numbers",
      text: "Alice chooses a private number a. Bob chooses a private number b. They keep these values secret.",
      formula: "Alice → a    Bob → b",
    },
    {
      number: "03",
      title: "Create public keys",
      text: "Each person uses the public values and their private number to calculate a public key.",
      formula: "A = gᵃ mod p",
    },
    {
      number: "04",
      title: "Exchange",
      text: "Alice and Bob send their public keys across the network. Their private keys stay with them.",
      formula: "A ↔ B",
    },
    {
      number: "05",
      title: "Create the shared secret",
      text: "Alice uses Bob's public key with her private key. Bob does the opposite. Both calculations produce the same result.",
      formula: "Bᵃ = Aᵇ = gᵃᵇ mod p",
    },
  ];


  return (

    <main className="learn-page">

      <div className="learn-header">

        <span className="step-label">
          <BookOpen size={14} />
          LEARNING MODE
        </span>

        <h1>
          How does
          <span> Diffie–Hellman</span>
          work?
        </h1>

        <p>
          Learn the idea first. Then watch it happen.
        </p>

      </div>


      <div className="learn-timeline">

        {concepts.map((concept) => (

          <motion.div
            className="learn-card"
            key={concept.number}
            whileHover={{ x: 8 }}
          >

            <div className="learn-number">
              {concept.number}
            </div>


            <div className="learn-card-content">

              <h2>
                {concept.title}
              </h2>

              <p>
                {concept.text}
              </p>

              <div className="learn-formula">
                {concept.formula}
              </div>

            </div>

          </motion.div>

        ))}

      </div>


      <div className="learn-bottom">

        <button
          className="secondary-button"
          onClick={onBack}
        >
          ← Home
        </button>


        <button
          className="start-button"
          onClick={onSimulator}
        >
          Try the Simulation
          <ArrowRight size={18} />
        </button>

      </div>

    </main>
  );
}


export default App;
