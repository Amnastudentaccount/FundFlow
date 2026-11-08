import { useEffect, useMemo, useState } from "react";

type Screen =
  | "home"
  | "emergency"
  | "approvals"
  | "smart"
  | "loans"
  | "trust"
  | "members"
  | "rules"
  | "settings"
  | "contribute"
  | "kill";

type IconName =
  | "home"
  | "plus"
  | "check"
  | "cart"
  | "loan"
  | "log"
  | "more"
  | "bell"
  | "arrow"
  | "shield"
  | "upload"
  | "search"
  | "download"
  | "users"
  | "rules"
  | "settings"
  | "close";

const nav: { id: Screen; label: string; icon: IconName }[] = [
  { id: "home", label: "Home", icon: "home" },
  { id: "emergency", label: "Emergency", icon: "plus" },
  { id: "approvals", label: "Approvals", icon: "check" },
  { id: "smart", label: "Smart Buy", icon: "cart" },
  { id: "loans", label: "Loans", icon: "loan" },
  { id: "trust", label: "Trust Log", icon: "log" },
];

function Icon({ name, size = 18 }: { name: IconName; size?: number }) {
  const paths: Record<IconName, React.ReactNode> = {
    home: (
      <>
        <path d="m3 11 9-8 9 8" />
        <path d="M5 10v11h14V10M9 21v-7h6v7" />
      </>
    ),
    plus: (
      <>
        <path d="M12 5v14M5 12h14" />
      </>
    ),
    check: (
      <>
        <path d="m5 12 4 4L19 6" />
      </>
    ),
    cart: (
      <>
        <path d="M3 4h2l2.4 11h10.8l2-8H6" />
        <circle cx="9" cy="20" r="1" />
        <circle cx="18" cy="20" r="1" />
      </>
    ),
    loan: (
      <>
        <rect x="3" y="6" width="18" height="12" rx="1" />
        <path d="M7 14h4M7 10h10" />
      </>
    ),
    log: (
      <>
        <path d="M6 3h12v18H6zM9 8h6M9 12h6M9 16h4" />
      </>
    ),
    more: (
      <>
        <circle cx="5" cy="12" r="1" />
        <circle cx="12" cy="12" r="1" />
        <circle cx="19" cy="12" r="1" />
      </>
    ),
    bell: (
      <>
        <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4" />
      </>
    ),
    arrow: (
      <>
        <path d="M5 12h14M14 7l5 5-5 5" />
      </>
    ),
    shield: (
      <>
        <path d="M12 3 4 6v5c0 5 3.4 8.6 8 10 4.6-1.4 8-5 8-10V6z" />
        <path d="m9 12 2 2 4-5" />
      </>
    ),
    upload: (
      <>
        <path d="M12 16V4M7 9l5-5 5 5M4 16v4h16v-4" />
      </>
    ),
    search: (
      <>
        <circle cx="10" cy="10" r="6" />
        <path d="m15 15 6 6" />
      </>
    ),
    download: (
      <>
        <path d="M12 4v12M7 11l5 5 5-5M4 20h16" />
      </>
    ),
    users: (
      <>
        <circle cx="9" cy="8" r="4" />
        <path d="M2 21c0-4 3-7 7-7s7 3 7 7M16 4c3 0 5 2 5 5s-2 5-5 5" />
      </>
    ),
    rules: (
      <>
        <path d="M5 4h14M5 12h14M5 20h14" />
        <circle cx="9" cy="4" r="2" />
        <circle cx="15" cy="12" r="2" />
        <circle cx="11" cy="20" r="2" />
      </>
    ),
    settings: (
      <>
        <circle cx="12" cy="12" r="3" />
        <path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2" />
      </>
    ),
    close: (
      <>
        <path d="m6 6 12 12M18 6 6 18" />
      </>
    ),
  };
  return (
    <svg
      aria-hidden="true"
      className="icon"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="square"
      strokeLinejoin="miter"
    >
      {paths[name]}
    </svg>
  );
}

function Button({
  children,
  variant = "primary",
  onClick,
  className = "",
  disabled = false,
}: {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "danger" | "text";
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
}) {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={`button button-${variant} ${className}`}
    >
      {children}
    </button>
  );
}

function Stamp({
  children,
  tone = "green",
}: {
  children: React.ReactNode;
  tone?: "green" | "red" | "neutral";
}) {
  return <span className={`stamp stamp-${tone}`}>{children}</span>;
}

function StewardNote({ children }: { children: React.ReactNode }) {
  return (
    <div className="steward-note">
      <div className="steward-note-head">
        <span className="s-mark">S</span>
        <b>STEWARD NOTE</b>
        <span>JUST NOW</span>
      </div>
      <p>{children}</p>
    </div>
  );
}

function Landing({ onStart, onLogin }: { onStart: () => void; onLogin: () => void }) {
  return (
    <main className="landing">
      <header className="public-nav">
        <button className="brand" aria-label="FundFlow home">
          <span>F</span>FundFlow
        </button>
        <div className="public-actions">
          <button onClick={onLogin}>Log in</button>
          <Button onClick={onStart}>
            Create family pool <Icon name="arrow" />
          </Button>
        </div>
      </header>
      <section className="hero">
        <div className="eyebrow">
          <span className="pulse-dot" /> HUMAN RULES. AGENT SPEED.
        </div>
        <h1>
          <span>Your family’s money.</span>
          <span>
            AI-run. <em>Human-ruled.</em>
          </span>
        </h1>
        <p>
          A transparent family fund that handles the busywork, follows your rules, and never forgets
          who’s in charge.
        </p>
        <div className="hero-actions">
          <Button onClick={onStart}>
            Create family pool <Icon name="arrow" />
          </Button>
          <button onClick={onLogin} className="text-link">
            Log in <span>→</span>
          </button>
        </div>
        <div className="hero-ledger" aria-label="Live activity">
          <span className="live">LIVE</span>
          <b>STEWARD</b>
          <span>Medical bill checked against 6 family rules</span>
          <span className="money positive">+$0 risk</span>
          <span className="ledger-status">
            <Icon name="check" size={14} /> VERIFIED
          </span>
        </div>
      </section>
      <section className="how">
        <div className="section-kicker">HOW IT WORKS</div>
        <div className="steps">
          {[
            [
              "01",
              "Pool together",
              "Everyone contributes. You decide who can spend, approve, or receive.",
            ],
            [
              "02",
              "Set human rules",
              "Write them normally. Steward turns them into clear, enforceable guardrails.",
            ],
            [
              "03",
              "Let Steward work",
              "Bills, reminders, and purchases happen automatically—inside the lines.",
            ],
          ].map(([n, t, d]) => (
            <article key={n}>
              <span>{n}</span>
              <h3>{t}</h3>
              <p>{d}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="stats">
        <div>
          <strong>37%</strong>
          <p>can’t cover a $400 emergency</p>
        </div>
        <div>
          <strong>23%</strong>
          <p>trust AI with payments</p>
        </div>
        <div className="stats-answer">
          <span>That’s why FundFlow is</span>
          <b>
            AI-RUN.
            <br />
            HUMAN-RULED.
          </b>
        </div>
      </section>
      <footer className="trust-strip">
        <span>
          <Icon name="shield" /> PAYPAL SANDBOX
        </span>
        <span>EVERY ACTION LOGGED</span>
        <span>HUMANS CAN PAUSE ANYTIME</span>
      </footer>
    </main>
  );
}

function Auth({
  mode,
  setMode,
  onDone,
}: {
  mode: "signup" | "login";
  setMode: (m: "signup" | "login") => void;
  onDone: (needsOnboarding: boolean) => void;
}) {
  const [strength, setStrength] = useState(0);
  const signup = mode === "signup";
  return (
    <main className="auth-page">
      <header className="public-nav">
        <button className="brand" onClick={() => location.reload()}>
          <span>F</span>FundFlow
        </button>
        <button onClick={() => setMode(signup ? "login" : "signup")}>
          {signup ? "Already a member? Log in" : "New here? Create a pool"} →
        </button>
      </header>
      <div className="auth-layout">
        <section className="auth-copy">
          <div className="eyebrow">PRIVATE BY DESIGN</div>
          <h1>
            {signup ? (
              <>
                Money works better
                <br />
                when family does.
              </>
            ) : (
              <>
                Welcome
                <br />
                back.
              </>
            )}
          </h1>
          <p>
            {signup
              ? "Build a shared safety net with clear rules, transparent decisions, and an agent that does the admin."
              : "Your family fund, approvals, and complete trust log are waiting."}
          </p>
        </section>
        <section className="auth-card">
          <div className="step-meta">{signup ? "STEP 1 OF 2" : "SECURE ACCESS"}</div>
          <h2>{signup ? "Create your account" : "Log in to FundFlow"}</h2>
          {signup && (
            <label>
              Full name
              <input placeholder="Ayesha Rahman" />
            </label>
          )}
          <label>
            Email address
            <input type="email" placeholder="ayesha@example.com" />
          </label>
          <label>
            Password
            <input
              type="password"
              placeholder="At least 8 characters"
              onChange={(e) => setStrength(Math.min(4, Math.floor(e.target.value.length / 3)))}
            />
          </label>
          {signup && (
            <div className="strength">
              <div>
                {[1, 2, 3, 4].map((x) => (
                  <i className={strength >= x ? "on" : ""} key={x} />
                ))}
              </div>
              <span>
                {strength < 3 ? "Use 8+ characters, a number, and symbol" : "Strong password"}
              </span>
            </div>
          )}
          {signup && (
            <label>
              Country
              <select defaultValue="CA">
                <option value="CA">Canada</option>
                <option>Pakistan</option>
                <option>Malaysia</option>
                <option>UAE</option>
              </select>
            </label>
          )}
          <Button onClick={() => onDone(signup)} className="full">
            {signup ? "Create account" : "Log in"} <Icon name="arrow" />
          </Button>
          <div className="or">
            <span />
            OR
            <span />
          </div>
          <Button onClick={() => onDone(signup)} variant="secondary" className="full paypal">
            P PayPal <small>Continue with PayPal</small>
          </Button>
          {!signup && (
            <div className="demo-users">
              <span>DEMO ACCESS</span>
              {["Ayesha · Owner", "Bilal · Approver", "Sara · Contributor"].map((x) => (
                <button key={x} onClick={() => onDone(false)}>
                  {x}
                  <span>→</span>
                </button>
              ))}
            </div>
          )}
          <p className="fineprint">
            Protected with encrypted sessions. By continuing, you agree to the Terms and Privacy
            Policy.
          </p>
        </section>
      </div>
    </main>
  );
}

function Onboarding({ onDone }: { onDone: () => void }) {
  const [step, setStep] = useState(1);
  return (
    <main className="onboarding">
      <header className="public-nav">
        <div className="brand">
          <span>F</span>FundFlow
        </div>
        <div className="onboarding-progress">
          <b>POOL SETUP</b>
          <span>{step} / 3</span>
          <i>
            <i style={{ width: `${(step / 3) * 100}%` }} />
          </i>
        </div>
        <button>Save & exit</button>
      </header>
      <section className="onboard-card">
        <div className="eyebrow">STEP {step} OF 3</div>
        {step === 1 && (
          <>
            <h1>Who’s in the pool?</h1>
            <p>Invite your family and give everyone a clear role. You can change these later.</p>
            <div className="member-list">
              {[
                ["AR", "Ayesha Rahman", "ayesha@email.com", "Owner"],
                ["BR", "Bilal Rahman", "bilal@email.com", "Approver"],
                ["SR", "Sara Rahman", "sara@email.com", "Contributor"],
              ].map((x) => (
                <div key={x[0]}>
                  <span className="avatar">{x[0]}</span>
                  <span>
                    <b>{x[1]}</b>
                    <small>{x[2]}</small>
                  </span>
                  <select defaultValue={x[3]}>
                    <option>Owner</option>
                    <option>Approver</option>
                    <option>Contributor</option>
                    <option>Beneficiary</option>
                  </select>
                </div>
              ))}
            </div>
            <button className="add-row">
              <Icon name="plus" /> Invite another member
            </button>
          </>
        )}
        {step === 2 && (
          <>
            <h1>Tell Steward the rules.</h1>
            <p>
              Write naturally. Steward will turn your words into guardrails everyone can inspect.
            </p>
            <label>
              Your family rule
              <textarea defaultValue="Pay medical bills under $150 automatically. Anything above that needs two approvals. Never let our reserve drop below $500." />
            </label>
            <StewardNote>I understood four enforceable rules. Did I get this right?</StewardNote>
            <div className="rule-chips">
              <span>
                MEDICAL ≤ $150 <b>AUTO-PAY</b>
              </span>
              <span>
                MEDICAL &gt; $150 <b>2 APPROVALS</b>
              </span>
              <span>
                RESERVE FLOOR <b>$500</b>
              </span>
              <span>
                DAILY CAP <b>$300</b>
              </span>
            </div>
          </>
        )}
        {step === 3 && (
          <>
            <h1>Fund the safety net.</h1>
            <p>
              Choose a reserve floor, set a contribution rhythm, and connect your PayPal Sandbox
              account.
            </p>
            <div className="two-fields">
              <label>
                Reserve floor
                <div className="money-input">
                  <span>$</span>
                  <input defaultValue="500" />
                </div>
              </label>
              <label>
                Monthly contribution
                <div className="money-input">
                  <span>$</span>
                  <input defaultValue="100" />
                </div>
              </label>
            </div>
            <div className="connect-card">
              <div className="paypal-logo">P</div>
              <span>
                <b>PayPal Sandbox</b>
                <small>Secure payouts and subscriptions</small>
              </span>
              <Button variant="secondary">Connect</Button>
            </div>
            <div className="callout">
              <Icon name="shield" />
              <span>
                <b>You stay in control.</b> Steward can only move money inside your rules. Every
                action is logged and reversible when possible.
              </span>
            </div>
          </>
        )}
        <div className="onboard-actions">
          {step > 1 && (
            <Button variant="secondary" onClick={() => setStep(step - 1)}>
              Back
            </Button>
          )}
          <Button onClick={() => (step === 3 ? onDone() : setStep(step + 1))}>
            {step === 3 ? "Open my family pool" : "Continue"} <Icon name="arrow" />
          </Button>
        </div>
      </section>
    </main>
  );
}

function Shell({
  children,
  screen,
  setScreen,
  paused,
  dark,
  toggleDark,
}: {
  children: React.ReactNode;
  screen: Screen;
  setScreen: (s: Screen) => void;
  paused: boolean;
  dark: boolean;
  toggleDark: () => void;
}) {
  return (
    <div className={`app-shell ${dark ? "dark" : "light"}`}>
      {paused && (
        <div className="paused-banner">
          <span>
            <i /> STEWARD PAUSED
          </span>
          <button onClick={() => setScreen("kill")}>Review & resume →</button>
        </div>
      )}
      <aside>
        <button className="brand" onClick={() => setScreen("home")}>
          <span>F</span>FundFlow
        </button>
        <div className="pool-switch">
          <small>FAMILY POOL</small>
          <b>Rahman Family Fund</b>
          <span>4 members · Owner</span>
        </div>
        <nav>
          {nav.map((n) => (
            <button
              key={n.id}
              className={screen === n.id ? "active" : ""}
              onClick={() => setScreen(n.id)}
            >
              <Icon name={n.icon} />
              {n.label}
              {n.id === "approvals" && <i>3</i>}
            </button>
          ))}
        </nav>
        <div className="side-bottom">
          <button onClick={() => setScreen("members")}>
            <Icon name="users" />
            Members
          </button>
          <button onClick={() => setScreen("rules")}>
            <Icon name="rules" />
            Rules
          </button>
          <button onClick={() => setScreen("settings")}>
            <Icon name="settings" />
            Settings
          </button>
        </div>
      </aside>
      <div className="app-main">
        <header className="topbar">
          <div className="sandbox">SANDBOX</div>
          <button
            className={`agent-pill ${paused ? "is-paused" : ""}`}
            onClick={() => setScreen("kill")}
          >
            <span>S</span>
            <b>Steward</b>
            <i />
            {paused ? "Paused" : "Active"}
          </button>
          <button className="icon-button" aria-label="Notifications">
            <Icon name="bell" />
            <i />
          </button>
          <button className="profile">
            <span>AR</span>
            <b>Ayesha</b>
            <small>Owner</small>
          </button>
          <button className="theme-toggle" onClick={toggleDark} aria-label="Toggle theme">
            {dark ? "☼" : "●"}
          </button>
        </header>
        <div className="screen">{children}</div>
      </div>
      <nav className="mobile-nav">
        {nav
          .filter((x) => ["home", "approvals", "smart", "loans"].includes(x.id))
          .map((n) => (
            <button
              key={n.id}
              className={screen === n.id ? "active" : ""}
              onClick={() => setScreen(n.id)}
            >
              <Icon name={n.icon} />
              <span>{n.label}</span>
            </button>
          ))}
        <button onClick={() => setScreen("trust")}>
          <Icon name="more" />
          <span>More</span>
        </button>
      </nav>
      <button className="mobile-emergency" onClick={() => setScreen("emergency")}>
        <Icon name="plus" /> Emergency
      </button>
    </div>
  );
}

function PageTitle({
  eyebrow,
  title,
  aside,
}: {
  eyebrow: string;
  title: string;
  aside?: React.ReactNode;
}) {
  return (
    <div className="page-title">
      <div>
        <span>{eyebrow}</span>
        <h1>{title}</h1>
      </div>
      {aside}
    </div>
  );
}

function Home({ setScreen }: { setScreen: (s: Screen) => void }) {
  const [balance, setBalance] = useState(0);
  useEffect(() => {
    const start = Date.now();
    const t = setInterval(() => {
      const p = Math.min(1, (Date.now() - start) / 700);
      setBalance(2184.5 * p);
      if (p === 1) clearInterval(t);
    }, 16);
    return () => clearInterval(t);
  }, []);
  return (
    <>
      <PageTitle
        eyebrow="THURSDAY, NOVEMBER 14"
        title="Good morning, Ayesha."
        aside={
          <Button variant="danger" onClick={() => setScreen("kill")}>
            <span className="power" /> Kill switch
          </Button>
        }
      />
      <section className="balance-grid">
        <div className="balance-card">
          <span>TOTAL POOL BALANCE</span>
          <strong>
            $
            {balance.toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </strong>
          <div className="balance-meta">
            <span>
              <i className="reserve" />
              Reserve <b>$1,200</b>
            </span>
            <span>
              <i className="smart" />
              Smart Buy <b>$640</b>
            </span>
            <span>
              <i className="lent" />
              Lent <b>$150</b>
            </span>
          </div>
          <div className="segment-bar">
            <i />
            <i />
            <i />
            <b style={{ left: "23%" }}>
              <span>$500 floor</span>
            </b>
          </div>
          <div className="balance-actions">
            <Button onClick={() => setScreen("contribute")}>Contribute</Button>
            <Button variant="secondary" onClick={() => setScreen("trust")}>
              View ledger
            </Button>
          </div>
        </div>
        <div className="health-card">
          <div>
            <span>POOL HEALTH</span>
            <small>Strong</small>
          </div>
          <strong>
            78<small>/100</small>
          </strong>
          <div className="health-bar">
            <i style={{ width: "78%" }} />
          </div>
          <p>
            <Icon name="arrow" size={15} /> Up 6 points this month
          </p>
          <ul>
            <li>
              <Icon name="check" />
              Reserve is 2.4× above floor
            </li>
            <li>
              <Icon name="check" />
              All contributions are on time
            </li>
            <li className="muted">
              <span>!</span>One loan payment due tomorrow
            </li>
          </ul>
        </div>
      </section>
      <section className="needs-section">
        <div className="section-head">
          <div>
            <span className="section-kicker">NEEDS YOU</span>
            <h2>4 decisions waiting</h2>
          </div>
          <button onClick={() => setScreen("approvals")}>View all →</button>
        </div>
        <div className="decision-list">
          {[
            [
              "MEDICAL",
              "Crescent Care Clinic",
              "Routine blood work",
              "$320.00",
              "1 OF 2 APPROVALS",
              "normal",
            ],
            ["MEDICAL", "MedPlus Pharmacy", "Prescription refill", "$1,150.00", "FLAGGED", "flag"],
            [
              "SMART BUY",
              "Samsung Galaxy A35",
              "For Ammi · TechHub seller",
              "$269.00",
              "NEEDS APPROVAL",
              "normal",
            ],
            ["LOAN", "Sara’s installment", "Due November 15", "$50.00", "DUE TOMORROW", "normal"],
          ].map((x) => (
            <button
              key={x[1]}
              className={x[5]}
              onClick={() => setScreen(x[5] === "flag" ? "emergency" : "approvals")}
            >
              <span className="decision-icon">{x[0][0]}</span>
              <span>
                <small>{x[0]}</small>
                <b>{x[1]}</b>
                <em>{x[2]}</em>
              </span>
              <span className="decision-amount">
                <b>{x[3]}</b>
                <small>{x[4]}</small>
              </span>
              <Icon name="arrow" />
            </button>
          ))}
        </div>
      </section>
      <div className="home-lower">
        <StewardNote>
          I checked 12 transactions overnight. Everything matches your rules except the MedPlus
          bill—I flagged its amount for you.
        </StewardNote>
        <MiniLedger />
      </div>
    </>
  );
}

function MiniLedger() {
  return (
    <section className="mini-ledger">
      <div className="section-head">
        <h3>Latest activity</h3>
        <button>Open trust log →</button>
      </div>
      {[
        ["10:42", "STEWARD", "Paid City Pharmacy", "−$86.20", "PAID"],
        ["09:10", "SARA", "Monthly contribution", "+$100.00", "RECEIVED"],
        ["YESTERDAY", "BILAL", "Approved Crescent Care", "—", "APPROVED"],
      ].map((x) => (
        <div key={x[0]}>
          <code>{x[0]}</code>
          <span>
            <b>{x[2]}</b>
            <small>{x[1]}</small>
          </span>
          <code className={x[3][0] === "+" ? "positive" : ""}>{x[3]}</code>
          <Stamp>{x[4]}</Stamp>
        </div>
      ))}
    </section>
  );
}

function Contribute({ setScreen }: { setScreen: (s: Screen) => void }) {
  const [amount, setAmount] = useState(100);
  const [monthly, setMonthly] = useState(true);
  const [paid, setPaid] = useState(false);
  return (
    <>
      <PageTitle
        eyebrow="ADD TO THE POOL"
        title="Contribute"
        aside={
          <button className="close-page" onClick={() => setScreen("home")}>
            <Icon name="close" />
          </button>
        }
      />
      <div className="narrow-flow">
        {!paid ? (
          <section className="flow-card">
            <label>Choose an amount</label>
            <div className="amount-options">
              {[50, 100, 150].map((x) => (
                <button
                  className={amount === x ? "active" : ""}
                  onClick={() => setAmount(x)}
                  key={x}
                >
                  ${x}
                </button>
              ))}
              <button>Custom</button>
            </div>
            <div className="big-input">
              <span>$</span>
              <input value={amount} onChange={(e) => setAmount(Number(e.target.value))} />
              <small>USD</small>
            </div>
            <button
              className={`toggle-row ${monthly ? "on" : ""}`}
              onClick={() => setMonthly(!monthly)}
            >
              <span>
                <b>Make this monthly</b>
                <small>PayPal Subscription · Cancel anytime</small>
              </span>
              <i>
                <i />
              </i>
            </button>
            <div className="summary-row">
              <span>To Rahman Family Fund</span>
              <b>${amount.toFixed(2)}</b>
            </div>
            <Button onClick={() => setPaid(true)} className="full paypal-pay">
              P Pay with PayPal
            </Button>
            <p className="security-line">
              <Icon name="shield" />
              You’ll complete this securely in PayPal Sandbox.
            </p>
          </section>
        ) : (
          <section className="receipt">
            <Stamp>PAID</Stamp>
            <span className="receipt-check">
              <Icon name="check" size={32} />
            </span>
            <h2>${amount.toFixed(2)} added</h2>
            <p>Your contribution is now part of the family safety net.</p>
            <div>
              <span>PAYPAL SANDBOX ID</span>
              <code>8JE94218R7283104P</code>
              <span>FREQUENCY</span>
              <b>{monthly ? "Monthly" : "One time"}</b>
              <span>NEW POOL BALANCE</span>
              <b className="positive">${(2184.5 + amount).toFixed(2)}</b>
            </div>
            <Button onClick={() => setScreen("home")}>Back home</Button>
          </section>
        )}
      </div>
    </>
  );
}

function Emergency({ setScreen }: { setScreen: (s: Screen) => void }) {
  const [state, setState] = useState<"upload" | "scan" | "review" | "flagged" | "paid">("upload");
  useEffect(() => {
    if (state === "scan") {
      const t = setTimeout(() => setState("review"), 1500);
      return () => clearTimeout(t);
    }
  }, [state]);
  return (
    <>
      <PageTitle
        eyebrow="EMERGENCY PAYMENT"
        title="Get help with a bill."
        aside={
          <div className="rule-badge">
            <Icon name="shield" />
            <span>
              Auto-pay up to <b>$150</b>
            </span>
          </div>
        }
      />
      <div className="emergency-layout">
        <section className={`bill-panel ${state === "flagged" ? "flagged-panel" : ""}`}>
          {state === "upload" && (
            <button className="dropzone" onClick={() => setState("scan")}>
              <span>
                <Icon name="upload" size={26} />
              </span>
              <h3>Drop a bill here</h3>
              <p>PDF, JPG, or PNG · Up to 10 MB</p>
              <b>Choose file</b>
              <small>Try demo: City Pharmacy · $86.20</small>
            </button>
          )}
          {state === "scan" && (
            <div className="scanning">
              <div className="bill-mock">
                <span>CITY PHARMACY</span>
                <i />
                <i />
                <i />
                <strong>$86.20</strong>
                <b />
              </div>
              <div className="scan-line" />
              <h3>Steward is reading the bill…</h3>
              <p>Checking vendor, amount, date, and possible edits.</p>
            </div>
          )}
          {(state === "review" || state === "flagged") && (
            <>
              <div className="bill-preview">
                <div>
                  <span>CP</span>
                  <b>CITY PHARMACY</b>
                </div>
                <p>Prescription medication</p>
                <strong>{state === "flagged" ? "$1,150.00" : "$86.20"}</strong>
                <small>November 14, 2024</small>
              </div>
              <div className="extracted">
                <span>
                  EXTRACTED DETAILS <b>98% CONFIDENCE</b>
                </span>
                <div>
                  <label>
                    Vendor
                    <input
                      defaultValue={state === "flagged" ? "MedPlus Pharmacy" : "City Pharmacy"}
                    />
                  </label>
                  <label>
                    Amount
                    <input defaultValue={state === "flagged" ? "$1,150.00" : "$86.20"} />
                  </label>
                  <label>
                    Date
                    <input defaultValue="Nov 14, 2024" />
                  </label>
                  <label>
                    Category
                    <select>
                      <option>Medical</option>
                    </select>
                  </label>
                </div>
              </div>
            </>
          )}
          {state === "paid" && (
            <div className="paid-state">
              <Stamp>PAID</Stamp>
              <span>
                <Icon name="check" size={34} />
              </span>
              <h2>City Pharmacy paid.</h2>
              <strong>$86.20</strong>
              <p>
                PayPal Payout <code>3HG01922</code>
              </p>
              <div className="undo">
                <span>Payment can be reversed for</span>
                <b>00:08</b>
                <Button variant="secondary">Undo</Button>
              </div>
              <Button onClick={() => setScreen("home")}>Done</Button>
            </div>
          )}
        </section>
        <aside className="checks-panel">
          <span className="section-kicker">STEWARD CHECKS</span>
          {state === "upload" || state === "scan" ? (
            <div className="checks-idle">
              <span>S</span>
              <p>I’ll check this bill against your family rules before any money moves.</p>
            </div>
          ) : (
            <>
              <div className="check-list">
                {[
                  ["Vendor match", "Known pharmacy", "ok"],
                  [
                    "Typical amount",
                    state === "flagged" ? "842% above usual" : "Within usual range",
                    state === "flagged" ? "bad" : "ok",
                  ],
                  ["Duplicate check", "No match found", "ok"],
                  [
                    "Edited text",
                    state === "flagged" ? "Possible amount edit" : "No signs detected",
                    state === "flagged" ? "bad" : "ok",
                  ],
                  [
                    "Reserve after",
                    state === "flagged" ? "$50.00 · Below floor" : "$1,113.80",
                    "ok",
                  ],
                ].map((x) => (
                  <div className={x[2]} key={x[0]}>
                    <span>{x[2] === "ok" ? <Icon name="check" /> : "!"}</span>
                    <b>{x[0]}</b>
                    <small>{x[1]}</small>
                  </div>
                ))}
              </div>
              {state === "flagged" ? (
                <div className="flag-box">
                  <Stamp tone="red">FLAGGED</Stamp>
                  <h3>I stopped this payment.</h3>
                  <p>
                    The amount is unusual, may have been edited, and would break the $500 reserve
                    floor.
                  </p>
                  <Button variant="danger" onClick={() => setScreen("kill")}>
                    Pause Steward
                  </Button>
                  <Button variant="secondary">Reject bill</Button>
                </div>
              ) : (
                <>
                  <StewardNote>
                    This is a verified medical bill under your $150 auto-pay rule. I can pay it now.
                  </StewardNote>
                  <Button className="full" onClick={() => setState("paid")}>
                    Pay $86.20 now
                  </Button>
                  <button className="flag-demo" onClick={() => setState("flagged")}>
                    Preview flagged bill state
                  </button>
                </>
              )}
            </>
          )}
        </aside>
      </div>
    </>
  );
}

const approvalItems = [
  {
    type: "MEDICAL",
    name: "Crescent Care Clinic",
    desc: "Routine blood work",
    amount: "$320.00",
    status: "1 of 2 approvals",
  },
  {
    type: "SMART BUY",
    name: "Samsung Galaxy A35",
    desc: "Phone for Ammi",
    amount: "$269.00",
    status: "Needs approval",
  },
  {
    type: "LOAN",
    name: "Sara Rahman",
    desc: "Four monthly installments",
    amount: "$200.00",
    status: "0 of 2 approvals",
  },
];
function Approvals({ setScreen }: { setScreen: (s: Screen) => void }) {
  const [selected, setSelected] = useState(0);
  const [approved, setApproved] = useState(false);
  const item = approvalItems[selected];
  return (
    <>
      <PageTitle
        eyebrow="HUMAN CONTROL"
        title="Approvals"
        aside={
          <div className="countdown">
            <span>NEXT EXPIRY</span>
            <code>18:42:09</code>
          </div>
        }
      />
      <div className="filter-row">
        {["All 3", "Emergencies 1", "Purchases 1", "Loans 1"].map((x, i) => (
          <button className={i === 0 ? "active" : ""} key={x}>
            {x}
          </button>
        ))}
      </div>
      <div className="approval-layout">
        <div className="approval-list">
          {approvalItems.map((x, i) => (
            <button
              className={i === selected ? "active" : ""}
              onClick={() => {
                setSelected(i);
                setApproved(false);
              }}
              key={x.name}
            >
              <span>{x.type[0]}</span>
              <div>
                <small>{x.type}</small>
                <b>{x.name}</b>
                <em>{x.desc}</em>
                <code>{x.amount}</code>
              </div>
              <label>{x.status}</label>
            </button>
          ))}
        </div>
        <section className="approval-detail">
          {approved ? (
            <div className="approved-state">
              <Stamp>APPROVED</Stamp>
              <span>
                <Icon name="check" size={34} />
              </span>
              <h2>Your vote is recorded.</h2>
              <p>
                {selected === 0
                  ? "Quorum reached. Steward is sending the payout through PayPal Sandbox."
                  : "One more human approval may be required."}
              </p>
              <Button onClick={() => setApproved(false)}>Back to details</Button>
            </div>
          ) : (
            <>
              <div className="approval-head">
                <span className="decision-icon">{item.type[0]}</span>
                <div>
                  <small>{item.type} REQUEST</small>
                  <h2>{item.name}</h2>
                  <p>{item.desc}</p>
                </div>
                <strong>{item.amount}</strong>
              </div>
              <StewardNote>
                {selected === 0
                  ? "I verified the clinic and bill. It is above the $150 auto-pay limit, so your rules require two people to approve."
                  : "This request is within the pool limit, but your rules require a human decision."}
              </StewardNote>
              <div className="impact">
                <span>BALANCE IMPACT</span>
                <div>
                  <b>Current pool</b>
                  <code>$2,184.50</code>
                </div>
                <div>
                  <b>After approval</b>
                  <code>
                    ${selected === 0 ? "1,864.50" : selected === 1 ? "1,915.50" : "1,984.50"}
                  </code>
                </div>
                <div>
                  <b>Reserve floor</b>
                  <code className="positive">$500 protected</code>
                </div>
              </div>
              <div className="quorum">
                <div>
                  <span>APPROVAL QUORUM</span>
                  <b>{selected === 0 ? "1 of 2" : "0 of 2"} approved</b>
                </div>
                <div className="avatars">
                  <i>BR</i>
                  <i className="pending">AR</i>
                </div>
                <div className="quorum-bar">
                  <i style={{ width: selected === 0 ? "50%" : "0%" }} />
                </div>
              </div>
              <label>
                Optional note
                <textarea placeholder="Add a reason for your decision…" />
              </label>
              <div className="approval-actions">
                <Button variant="secondary">Reject with reason</Button>
                <Button onClick={() => setApproved(true)}>
                  Approve request <Icon name="check" />
                </Button>
              </div>
            </>
          )}
        </section>
      </div>
    </>
  );
}

function SmartBuy() {
  const [stage, setStage] = useState<"search" | "compare" | "mandate" | "bought">("search");
  return (
    <>
      <PageTitle
        eyebrow="RULE-BOUND SHOPPING"
        title="Smart Buy"
        aside={
          <div className="guardrail-inline">
            <span>LIMIT</span>
            <b>$100 auto · Electronics need approval</b>
          </div>
        }
      />
      <div className="smart-prompt">
        <span className="s-mark">S</span>
        <div>
          <label>What do you need?</label>
          <input defaultValue="Phone for Ammi, good camera, under $280" />
        </div>
        <Button onClick={() => setStage("compare")}>
          <Icon name="search" /> Find safely
        </Button>
      </div>
      <div className="chip-row">
        {["Under $280", "Good camera", "New only", "Returns accepted", "Verified sellers"].map(
          (x) => (
            <button key={x}>
              {x} <span>×</span>
            </button>
          ),
        )}
      </div>
      {stage === "search" && (
        <div className="smart-empty">
          <span>S</span>
          <h2>Ready when you are.</h2>
          <p>
            I’ll compare verified sellers, remove risky listings, and bring back the best three
            options.
          </p>
        </div>
      )}
      {stage === "compare" && (
        <>
          <div className="search-status">
            <span>
              <i />
              LIVE SEARCH COMPLETE
            </span>
            <b>
              42 listings · 6 sellers · <em>11 unverified removed</em>
            </b>
          </div>
          <div className="product-grid">
            {[
              [
                "STEWARD’S PICK",
                "Samsung Galaxy A35",
                "$269",
                "TechHub",
                "Free · 2 days",
                "30 days",
                "yes",
              ],
              [
                "BEST CAMERA",
                "Google Pixel 6a",
                "$278",
                "MobileMarket",
                "$8 · 3 days",
                "14 days",
                "yes",
              ],
              [
                "LOWEST PRICE",
                "Samsung Galaxy A25",
                "$239",
                "PhoneBox",
                "Free · 5 days",
                "30 days",
                "no",
              ],
            ].map((x, i) => (
              <article className={i === 0 ? "pick" : ""} key={x[1]}>
                <span>{x[0]}</span>
                <div className="phone-visual">
                  <i />
                  <i />
                  <i />
                </div>
                <h3>{x[1]}</h3>
                <strong>
                  {x[2]}
                  <small>.00</small>
                </strong>
                <dl>
                  <dt>SELLER</dt>
                  <dd>
                    {x[3]} <Icon name="check" />
                  </dd>
                  <dt>DELIVERY</dt>
                  <dd>{x[4]}</dd>
                  <dt>RETURNS</dt>
                  <dd>{x[5]}</dd>
                  <dt>CAMERA</dt>
                  <dd>{x[6] === "yes" ? "✓ Must-have met" : "✕ Not ideal"}</dd>
                </dl>
                {i === 0 && <Button onClick={() => setStage("mandate")}>Choose this one</Button>}
              </article>
            ))}
          </div>
        </>
      )}
      {stage === "mandate" && (
        <div className="mandate-layout">
          <section>
            <StewardNote>
              The Galaxy A35 is the strongest match: verified seller, best camera in budget, free
              two-day delivery, and a 30-day return window.
            </StewardNote>
            <div className="safety-checks">
              <h3>Safety checks</h3>
              {[
                "Seller identity verified",
                "Price is typical across 6 stores",
                "Returns policy confirmed",
                "No hidden delivery fees",
              ].map((x) => (
                <p key={x}>
                  <Icon name="check" />
                  {x}
                </p>
              ))}
            </div>
          </section>
          <section className="mandate">
            <span>PURCHASE MANDATE</span>
            <h2>Permission, with boundaries.</h2>
            <div>
              <small>MAXIMUM</small>
              <b>$280.00</b>
            </div>
            <p>
              <span>Seller</span>
              <b>TechHub only</b>
            </p>
            <p>
              <span>Expires</span>
              <b>November 20</b>
            </p>
            <p>
              <span>Usage</span>
              <b>Single purchase</b>
            </p>
            <Button className="full" onClick={() => setStage("bought")}>
              Approve & PayPal checkout
            </Button>
          </section>
        </div>
      )}
      {stage === "bought" && (
        <div className="bought-state">
          <Stamp>BOUGHT</Stamp>
          <span>
            <Icon name="check" size={34} />
          </span>
          <h2>Ammi’s phone is on the way.</h2>
          <p>Samsung Galaxy A35 · TechHub</p>
          <div className="tracking">
            <span>
              ORDERED
              <i />
            </span>
            <span>
              SHIPPED
              <i />
            </span>
            <span className="muted">
              DELIVERED
              <i />
            </span>
          </div>
          <code>PAYPAL SANDBOX · 7VT209142K</code>
        </div>
      )}
    </>
  );
}

function Loans() {
  const [detail, setDetail] = useState(false);
  const [paid, setPaid] = useState(false);
  return (
    <>
      <PageTitle
        eyebrow="FAMILY LENDING"
        title="Loans"
        aside={
          <Button>
            <Icon name="plus" /> Request a loan
          </Button>
        }
      />
      {!detail ? (
        <>
          <section className="loan-summary">
            <div>
              <span>ACTIVE LOANS</span>
              <strong>$150.00</strong>
              <small>Outstanding</small>
            </div>
            <div>
              <span>REPAID THIS YEAR</span>
              <strong>$250.00</strong>
              <small>5 payments</small>
            </div>
            <div>
              <span>ON-TIME RATE</span>
              <strong>100%</strong>
              <small>All on track</small>
            </div>
          </section>
          <div className="loan-list">
            <button onClick={() => setDetail(true)}>
              <span className="avatar">SR</span>
              <div>
                <small>ACTIVE · INTEREST-FREE</small>
                <h3>Sara Rahman</h3>
                <p>$200 · 4 × $50 monthly</p>
              </div>
              <strong>
                $150.00<small>remaining</small>
              </strong>
              <div className="install-dots">
                <i className="paid" />
                <i />
                <i />
                <i />
              </div>
              <Stamp>ON TRACK</Stamp>
              <Icon name="arrow" />
            </button>
            <button>
              <span className="avatar">BR</span>
              <div>
                <small>COMPLETED · INTEREST-FREE</small>
                <h3>Bilal Rahman</h3>
                <p>$200 · Repaid in full</p>
              </div>
              <strong>
                $0.00<small>remaining</small>
              </strong>
              <Stamp tone="neutral">SETTLED</Stamp>
              <Icon name="arrow" />
            </button>
          </div>
        </>
      ) : (
        <section className="loan-detail">
          <button className="back-link" onClick={() => setDetail(false)}>
            ← All loans
          </button>
          <div className="loan-detail-head">
            <span className="avatar">SR</span>
            <div>
              <span>ACTIVE LOAN</span>
              <h2>Sara Rahman</h2>
              <p>Interest-free · Started Oct 15</p>
            </div>
            <strong>
              $150<small>remaining</small>
            </strong>
            <Stamp>ON TRACK</Stamp>
          </div>
          <div className="calendar-strip">
            {["OCT 15", "NOV 15", "DEC 15", "JAN 15"].map((x, i) => (
              <div className={i === 0 || paid ? "paid" : ""} key={x}>
                <span>{i === 0 || paid ? <Icon name="check" /> : i + 1}</span>
                <b>{x}</b>
                <small>{i === 0 || paid ? "PAID" : "$50 DUE"}</small>
              </div>
            ))}
          </div>
          <div className="loan-columns">
            <div>
              <h3>Repayment schedule</h3>
              {["Oct 15", "Nov 15", "Dec 15", "Jan 15"].map((x, i) => (
                <div className="payment-row" key={x}>
                  <span>{i === 0 || paid ? <Icon name="check" /> : i + 1}</span>
                  <b>
                    {x}
                    <small>PayPal invoice {i === 0 || paid ? "paid" : "scheduled"}</small>
                  </b>
                  <code>$50.00</code>
                  {i === 1 && !paid && <Button onClick={() => setPaid(true)}>Pay now</Button>}
                </div>
              ))}
            </div>
            <aside>
              <StewardNote>
                {paid
                  ? "I recorded the PayPal invoice payment. Sara is still fully on track."
                  : "Sara’s next payment is due tomorrow. I drafted a gentle reminder in English."}
              </StewardNote>
              <div className="reminder">
                <span>REMINDER DRAFT</span>
                <div>
                  <button className="active">English</button>
                  <button>Urdu</button>
                  <button className="active">Gentle</button>
                  <button>Firm</button>
                </div>
                <p>
                  Hi Sara, a gentle reminder that your $50 family fund payment is due tomorrow. No
                  rush—tap the invoice when you’re ready.
                </p>
                <Button variant="secondary" className="full">
                  Send reminder
                </Button>
              </div>
            </aside>
          </div>
        </section>
      )}
    </>
  );
}

const logs = [
  ["10:42:08", "STEWARD", "Paid City Pharmacy", "−$86.20", "Medical ≤ $150", "PAID"],
  ["10:41:51", "STEWARD", "Verified emergency bill", "—", "5 checks passed", "VERIFIED"],
  ["09:10:22", "SARA", "Monthly contribution", "+$100.00", "Scheduled contribution", "PAID"],
  ["YESTERDAY", "BILAL", "Approved Crescent Care", "—", "2 approvals required", "APPROVED"],
  ["YESTERDAY", "STEWARD", "Flagged MedPlus bill", "−$1,150.00", "Reserve floor breach", "FLAGGED"],
  ["NOV 12", "STEWARD", "Created PayPal invoice", "+$50.00", "Loan schedule", "INVOICED"],
];
function TrustLog() {
  const [query, setQuery] = useState("");
  const filtered = useMemo(
    () => logs.filter((x) => x.join(" ").toLowerCase().includes(query.toLowerCase())),
    [query],
  );
  return (
    <>
      <PageTitle
        eyebrow="IMMUTABLE ACTIVITY"
        title="Trust Log"
        aside={
          <Button variant="secondary">
            <Icon name="download" /> Export CSV
          </Button>
        }
      />
      <div className="log-tools">
        <label>
          <Icon name="search" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search actions, people, amounts…"
          />
        </label>
        <div>
          {["All", "Money moved", "Decisions", "Flags", "System"].map((x, i) => (
            <button className={i === 0 ? "active" : ""} key={x}>
              {x}
            </button>
          ))}
        </div>
      </div>
      <div className="log-table">
        <div className="log-header">
          <span>TIME</span>
          <span>ACTOR</span>
          <span>ACTION</span>
          <span>AMOUNT</span>
          <span>RULE APPLIED</span>
          <span>STATUS</span>
          <span />
        </div>
        {filtered.map((x, i) => (
          <details key={i}>
            <summary>
              <code>{x[0]}</code>
              <b>{x[1]}</b>
              <span>{x[2]}</span>
              <code className={x[3][0] === "+" ? "positive" : ""}>{x[3]}</code>
              <span>{x[4]}</span>
              <Stamp tone={x[5] === "FLAGGED" ? "red" : "green"}>{x[5]}</Stamp>
              <b>Why? +</b>
            </summary>
            <p>
              Steward evaluated this action against the current version of your family rules. The
              event, decision inputs, and PayPal Sandbox reference are preserved.
            </p>
          </details>
        ))}
      </div>
    </>
  );
}

function KillSwitch({ paused, setPaused }: { paused: boolean; setPaused: (p: boolean) => void }) {
  const [holding, setHolding] = useState(false);
  useEffect(() => {
    if (holding && !paused) {
      const t = setTimeout(() => {
        setPaused(true);
        setHolding(false);
      }, 2000);
      return () => clearTimeout(t);
    }
  }, [holding, paused, setPaused]);
  return (
    <>
      <PageTitle
        eyebrow="EMERGENCY CONTROL"
        title={paused ? "Steward is paused." : "Kill Switch"}
      />
      <div className="kill-layout">
        <section className="kill-control">
          <div className={`hold-ring ${holding ? "holding" : ""} ${paused ? "paused" : ""}`}>
            <button
              onMouseDown={() => setHolding(true)}
              onMouseUp={() => setHolding(false)}
              onMouseLeave={() => setHolding(false)}
              onTouchStart={() => setHolding(true)}
              onTouchEnd={() => setHolding(false)}
            >
              {paused ? (
                <>
                  <span>II</span>
                  <b>PAUSED</b>
                </>
              ) : (
                <>
                  <span className="power large" />
                  <b>HOLD 2 SECONDS</b>
                </>
              )}
            </button>
          </div>
          <h2>{paused ? "No automated money can move." : "Press and hold to pause Steward"}</h2>
          <p>
            {paused
              ? "All family members have been notified. Existing funds are safe."
              : "Use this if something looks wrong. Human approvals and viewing the trust log will still work."}
          </p>
        </section>
        <section className="kill-effects">
          <span className="section-kicker">WHAT HAPPENS IMMEDIATELY</span>
          {[
            "Stops automatic payments and purchases",
            "Cancels pending PayPal payouts",
            "Revokes all active mandates",
            "Notifies all four family members",
          ].map((x) => (
            <div key={x}>
              <Icon name="check" />
              <b>{x}</b>
            </div>
          ))}
          {paused && (
            <div className="resume-box">
              <span>RESUME CONTROL</span>
              <h3>Two approvers must agree.</h3>
              <p>
                Ayesha and Bilal will both be asked to confirm before Steward becomes active again.
              </p>
              <div>
                <i>
                  AR<small>READY</small>
                </i>
                <i>
                  BR<small>WAITING</small>
                </i>
              </div>
              <Button onClick={() => setPaused(false)}>Request resume approvals</Button>
            </div>
          )}
        </section>
      </div>
    </>
  );
}

function Members() {
  return (
    <>
      <PageTitle
        eyebrow="PEOPLE & PERMISSIONS"
        title="Members"
        aside={
          <Button>
            <Icon name="plus" /> Invite member
          </Button>
        }
      />
      <div className="settings-list">
        {[
          ["AR", "Ayesha Rahman", "Owner", "Toronto · Full control"],
          ["BR", "Bilal Rahman", "Approver", "Kuala Lumpur · Approves payments"],
          ["SR", "Sara Rahman", "Contributor", "Dubai · Contributes & borrows"],
          ["AM", "Ammi Rahman", "Beneficiary", "Karachi · Receives support"],
        ].map((x) => (
          <div key={x[0]}>
            <span className="avatar">{x[0]}</span>
            <span>
              <b>{x[1]}</b>
              <small>{x[3]}</small>
            </span>
            <label>{x[2]}</label>
            <button>Manage →</button>
          </div>
        ))}
      </div>
    </>
  );
}
function Rules() {
  return (
    <>
      <PageTitle
        eyebrow="STEWARD GUARDRAILS"
        title="Family Rules"
        aside={
          <Button>
            <Icon name="plus" /> Add a rule
          </Button>
        }
      />
      <div className="rules-layout">
        <section className="rule-list">
          {[
            ["MEDICAL", "Auto-pay medical bills up to $150", "Above this amount needs 2 approvals"],
            ["SMART BUY", "Spend up to $100 without approval", "Electronics always need approval"],
            ["LOANS", "Every family loan needs 2 approvals", "No interest may be charged"],
            [
              "RESERVE",
              "Never let reserve fall below $500",
              "Blocks payments that cross the floor",
            ],
            ["DAILY CAP", "Maximum $300 in one day", "Applies across all automatic actions"],
          ].map((x, i) => (
            <div key={x[0]}>
              <span>{String(i + 1).padStart(2, "0")}</span>
              <div>
                <small>{x[0]}</small>
                <h3>{x[1]}</h3>
                <p>{x[2]}</p>
              </div>
              <button>Edit</button>
            </div>
          ))}
        </section>
        <aside className="scenario">
          <span className="s-mark">S</span>
          <span className="section-kicker">TRY A SCENARIO</span>
          <h2>Ask before it happens.</h2>
          <textarea defaultValue="What if a $180 medical bill arrives tomorrow?" />
          <Button>Test my rules</Button>
          <p>
            <b>Steward says:</b> I would hold the bill and ask two approvers. It’s above the $150
            auto-pay limit.
          </p>
        </aside>
      </div>
    </>
  );
}
function Settings({ dark, toggleDark }: { dark: boolean; toggleDark: () => void }) {
  return (
    <>
      <PageTitle eyebrow="POOL ADMINISTRATION" title="Settings" />
      <div className="settings-grid">
        <section>
          <h3>PAYMENTS</h3>
          <div className="setting-row">
            <span className="paypal-logo">P</span>
            <span>
              <b>PayPal Sandbox</b>
              <small>Connected as sb-ayesha@personal.example.com</small>
            </span>
            <Stamp>CONNECTED</Stamp>
          </div>
          <div className="setting-row">
            <Icon name="cart" />
            <span>
              <b>1 active mandate</b>
              <small>TechHub · Up to $280 · Expires Nov 20</small>
            </span>
            <button>Revoke</button>
          </div>
        </section>
        <section>
          <h3>APPEARANCE & ACCOUNT</h3>
          <button className="setting-row" onClick={toggleDark}>
            <span className="theme-preview">{dark ? "☼" : "●"}</span>
            <span>
              <b>{dark ? "Switch to light mode" : "Switch to dark mode"}</b>
              <small>Current: {dark ? "Dark" : "Light"}</small>
            </span>
            <i>→</i>
          </button>
          <button className="setting-row">
            <Icon name="log" />
            <span>
              <b>Data & exports</b>
              <small>Download your family fund records</small>
            </span>
            <i>→</i>
          </button>
          <button className="setting-row logout">
            <Icon name="arrow" />
            <span>
              <b>Log out</b>
              <small>End this secure session</small>
            </span>
          </button>
        </section>
      </div>
    </>
  );
}

export default function App() {
  const [entry, setEntry] = useState<"landing" | "auth" | "onboarding" | "app">("landing");
  const [authMode, setAuthMode] = useState<"signup" | "login">("signup");
  const [screen, setScreen] = useState<Screen>("home");
  const [paused, setPaused] = useState(false);
  const [dark, setDark] = useState(true);
  if (entry === "landing")
    return (
      <Landing
        onStart={() => {
          setAuthMode("signup");
          setEntry("auth");
        }}
        onLogin={() => {
          setAuthMode("login");
          setEntry("auth");
        }}
      />
    );
  if (entry === "auth")
    return (
      <Auth
        mode={authMode}
        setMode={setAuthMode}
        onDone={(needs) => setEntry(needs ? "onboarding" : "app")}
      />
    );
  if (entry === "onboarding") return <Onboarding onDone={() => setEntry("app")} />;
  const pages: Record<Screen, React.ReactNode> = {
    home: <Home setScreen={setScreen} />,
    contribute: <Contribute setScreen={setScreen} />,
    emergency: <Emergency setScreen={setScreen} />,
    approvals: <Approvals setScreen={setScreen} />,
    smart: <SmartBuy />,
    loans: <Loans />,
    trust: <TrustLog />,
    kill: <KillSwitch paused={paused} setPaused={setPaused} />,
    members: <Members />,
    rules: <Rules />,
    settings: <Settings dark={dark} toggleDark={() => setDark(!dark)} />,
  };
  return (
    <Shell
      screen={screen}
      setScreen={setScreen}
      paused={paused}
      dark={dark}
      toggleDark={() => setDark(!dark)}
    >
      {pages[screen]}
    </Shell>
  );
}
