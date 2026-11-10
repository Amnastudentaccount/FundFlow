import { useEffect, useMemo, useRef, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import {
  getPool,
  getMembers,
  getTrustLog,
  deleteMember,
  inviteMember,
  loginUser,
  makeContribution,
  resetPool,
  searchProducts,
} from "./api/client";

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
  | "close"
  | "clock";
  

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
    clock: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
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
              "Bills, reminders, and purchases happen automatically-inside the lines.",
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
  setCurrentUser,
}: {
  mode: "signup" | "login";
  setMode: (m: "signup" | "login") => void;
  onDone: (needsOnboarding: boolean) => void;
  setCurrentUser: (user: any) => void;
}) {
  const [strength, setStrength] = useState(0);
  const [inputName, setInputName] = useState("Alice Smith");
  const [inputEmail, setInputEmail] = useState("alice@example.com");
  const [authError, setAuthError] = useState("");
  const signup = mode === "signup";
  async function submitAuth(needsOnboarding: boolean) {
    setAuthError("");
    try {
      const name = needsOnboarding ? inputName.trim() || undefined : undefined;
      const user = await loginUser(inputEmail.trim(), name);
      setCurrentUser(user);
      onDone(needsOnboarding);
    } catch (error) {
      setAuthError(error instanceof Error ? error.message : "Failed to log in.");
    }
  }
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
              <input
                placeholder="Alice Smith"
                value={inputName}
                onChange={(event) => setInputName(event.target.value)}
              />
            </label>
          )}
          <label>
            Email address
            <input
              type="email"
              placeholder="alice@example.com"
              value={inputEmail}
              onChange={(event) => setInputEmail(event.target.value)}
            />
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
          <Button onClick={() => void submitAuth(signup)} className="full">
            {signup ? "Create account" : "Log in"} <Icon name="arrow" />
          </Button>
          <div className="or">
            <span />
            OR
            <span />
          </div>
          <Button onClick={() => void submitAuth(signup)} variant="secondary" className="full paypal">
            P PayPal <small>Continue with PayPal</small>
          </Button>
          {!signup && (
            <div className="demo-users">
              <span>DEMO ACCESS</span>
              {["Alice · Owner", "Bob · Approver", "Sarah · Contributor"].map((x) => (
                <button key={x} onClick={() => void submitAuth(false)}>
                  {x}
                  <span>→</span>
                </button>
              ))}
            </div>
          )}
          {authError && <p>{authError}</p>}
          <p className="fineprint">
            Protected with encrypted sessions. By continuing, you agree to the Terms and Privacy
            Policy.
          </p>
        </section>
      </div>
    </main>
  );
}

function Onboarding({
  currentUser,
  poolName,
  setPoolName,
  paypalStatus,
  onConnectPayPal,
  onDone,
}: {
  currentUser: { name: string; email: string };
  poolName: string;
  setPoolName: (poolName: string) => void;
  paypalStatus: "idle" | "loading" | "connected";
  onConnectPayPal: () => void;
  onDone: () => void;
}) {
  const [step, setStep] = useState(1);
  const [openingPool, setOpeningPool] = useState(false);
  const [poolMembers, setPoolMembers] = useState([
    { name: currentUser.name, email: currentUser.email, role: "Owner" },
  ]);
  function handleInviteMember() {
    const name = window.prompt("Enter the new member's name:")?.trim();
    if (!name) return;
    const email = window.prompt("Enter the new member's email:")?.trim();
    if (!email) return;

    setPoolMembers((existing) => [...existing, { name, email, role: "Contributor" }]);
  }

  async function handleOpenPool() {
    setOpeningPool(true);
    try {
      await resetPool();
      onDone();
    } catch (error) {
      window.alert(error instanceof Error ? error.message : "Could not reset the family pool.");
    } finally {
      setOpeningPool(false);
    }
  }
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
            <label>
              Pool Name
              <input value={poolName} onChange={(event) => setPoolName(event.target.value)} />
            </label>
            <div className="member-list">
              {poolMembers.map((member) => (
                <div key={member.email}>
                  <span className="avatar">
                    {member.name
                      .trim()
                      .split(/\s+/)
                      .map((part) => part[0])
                      .join("")
                      .slice(0, 2)
                      .toUpperCase()}
                  </span>
                  <span>
                    <b>{member.name}</b>
                    <small>{member.email}</small>
                  </span>
                  <select defaultValue={member.role}>
                    <option>Owner</option>
                    <option>Approver</option>
                    <option>Contributor</option>
                    <option>Beneficiary</option>
                  </select>
                </div>
              ))}
            </div>
            <button className="add-row" onClick={handleInviteMember}>
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
              <Button
                variant="secondary"
                onClick={onConnectPayPal}
                disabled={paypalStatus === "loading" || paypalStatus === "connected"}
                style={paypalStatus === "connected" ? { color: "green" } : undefined}
              >
                {paypalStatus === "loading"
                  ? "Connecting..."
                  : paypalStatus === "connected"
                    ? "Connected ✓"
                    : "Connect"}
              </Button>
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
          <Button
            onClick={() => (step === 3 ? void handleOpenPool() : setStep(step + 1))}
            disabled={openingPool}
          >
            {openingPool ? "Opening pool..." : step === 3 ? "Open my family pool" : "Continue"} <Icon name="arrow" />
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
  currentUser,
  poolName,
}: {
  children: React.ReactNode;
  screen: Screen;
  setScreen: (s: Screen) => void;
  paused: boolean;
  dark: boolean;
  toggleDark: () => void;
  currentUser: { name: string; email: string };
  poolName: string;
}) {
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationsRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!showNotifications) return;
    const closeOnOutsideClick = (event: PointerEvent) => {
      if (!notificationsRef.current?.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("pointerdown", closeOnOutsideClick);
    return () => document.removeEventListener("pointerdown", closeOnOutsideClick);
  }, [showNotifications]);
  const initials = currentUser.name
    .trim()
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const firstName = currentUser.name.trim().split(/\s+/)[0] || currentUser.name;
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
          <b>{poolName}</b>
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
          <div className="relative" ref={notificationsRef}>
            <button
              className="icon-button"
              aria-label="Notifications"
              aria-expanded={showNotifications}
              onClick={() => setShowNotifications((visible) => !visible)}
            >
              <Icon name="bell" />
              <i style={{ backgroundColor: showNotifications ? "#22c55e" : "#ef4444" }} />
            </button>
            {showNotifications && (
              <div className="absolute right-0 top-12 w-80 bg-[var(--panel)] border border-[var(--line)] rounded-lg shadow-xl p-4 z-50">
                <h3 className="font-bold mb-3">Notifications</h3>
                <div className="space-y-3">
                  {[
                    "Contribution received",
                    "Emergency bill paid",
                    "New member joined",
                  ].map((notification) => (
                    <div
                      className="border-t border-[var(--line)] pt-3 text-sm text-[var(--ink)]"
                      key={notification}
                    >
                      {notification}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          <button className="profile">
            <span>{initials}</span>
            <b>{firstName}</b>
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

function Home({
  currentUser,
  balance,
  setBalance,
  setScreen,
  liveLogs,
}: {
  currentUser: { name: string; email: string };
  balance: number;
  setBalance: (balance: number) => void;
  setScreen: (s: Screen) => void;
  liveLogs: any[];
}) {
  async function refreshBalance() {
    try {
      const pool = await getPool();
      setBalance(pool.balance);
    } catch (error) {
      console.error("Failed to load pool balance:", error);
    }
  }

  useEffect(() => {
    void refreshBalance();
  }, []);
  return (
    <>
      <PageTitle
        eyebrow="THURSDAY, NOVEMBER 14"
        title={`Good morning, ${currentUser?.name?.trim().split(/\s+/)[0] || "User"}.`}
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
              "For Emma · TechHub seller",
              "$269.00",
              "NEEDS APPROVAL",
              "normal",
            ],
            ["LOAN", "Sarah’s installment", "Due November 15", "$50.00", "DUE TOMORROW", "normal"],
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
          bill-I flagged its amount for you.
        </StewardNote>
        <MiniLedger liveLogs={liveLogs} />
      </div>
    </>
  );
}

function MiniLedger({ liveLogs }: { liveLogs: any[] }) {
  return (
    <section className="mini-ledger">
      <div className="section-head">
        <h3>Latest activity</h3>
        <button>Open trust log â†’</button>
      </div>
      {liveLogs.length === 0 ? <p>No recent activity</p> : liveLogs.slice(0, 3).map((log, index) => {
        const amount = Number(log.amount ?? 0);
        const amountText = amount === 0 ? "N/A" : `${amount > 0 ? "+" : "-"}$${Math.abs(amount).toFixed(2)}`;
        return (
          <div key={`${log.time}-${index}`}>
            <code>{log.time}</code>
            <span>
              <b>{log.action}</b>
              <small>{log.actor}</small>
            </span>
            <code className={amountText[0] === "+" ? "positive" : ""}>{amountText}</code>
            <Stamp>{log.status}</Stamp>
          </div>
        );
      })}
    </section>
  );
}
function Contribute({
  currentUser,
  poolName,
  setScreen,
  onContributionSuccess,
}: {
  currentUser: { name: string };
  poolName: string;
  setScreen: (s: Screen) => void;
  onContributionSuccess: () => void;
}) {
  const [amount, setAmount] = useState(100);
  const [monthly, setMonthly] = useState(true);
  const [paid, setPaid] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleContribution() {
    setSubmitting(true);
    setError("");
    try {
      await makeContribution(currentUser.name, amount);
      setPaid(true);
      onContributionSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to make contribution.");
    } finally {
      setSubmitting(false);
    }
  }
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
              <span>To {poolName}</span>
              <b>${amount.toFixed(2)}</b>
            </div>
            <Button onClick={handleContribution} className="full paypal-pay" disabled={submitting}>
              {submitting ? "Processing..." : "P Pay with PayPal"}
            </Button>
            {error && <p>{error}</p>}
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
              <b className="positive">Contribution complete</b>
            </div>
            <Button onClick={() => setScreen("home")}>Back home</Button>
          </section>
        )}
      </div>
    </>
  );
}

function Emergency({
  setScreen,
  currentUser,
  setTrustLogs,
}: {
  setScreen: (s: Screen) => void;
  currentUser: { name: string };
  setTrustLogs: React.Dispatch<React.SetStateAction<TrustLogItem[]>>;
}) {
  const [state, setState] = useState<"upload" | "scan" | "review" | "flagged" | "paid">("upload");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [vendor, setVendor] = useState("City Pharmacy");
  const [amount, setAmount] = useState("$86.20");
  const [billDate, setBillDate] = useState("Nov 14, 2024");
  const [scanError, setScanError] = useState("");

  function handleRejectBill() {
    window.alert("Bill rejected and flagged for manual review.");
    setTrustLogs((existing) => [
      ...existing,
      {
        time: new Date().toLocaleTimeString(),
        actor: currentUser.name,
        action: "Bill Rejected",
        amount: 0,
        rule: "Manual Reject",
        status: "REJECTED",
      },
    ]);
    setState("upload");
  }

  async function handleBillSelected(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setState("scan");
    setScanError("");
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://localhost:8000/api/emergency/scan", {
        method: "POST",
        body: formData,
      });
      if (!response.ok) throw new Error(`Bill scan failed (${response.status})`);

      const result = await response.json();
      if (result.error) throw new Error(result.error);
      setVendor(result.vendor);
      setAmount(`$${Number(result.amount).toFixed(2)}`);
      if (result.date) {
        const parsedDate = new Date(`${result.date}T00:00:00`);
        setBillDate(
          Number.isNaN(parsedDate.getTime())
            ? result.date
            : parsedDate.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              }),
        );
      }
      setState("review");
    } catch (error) {
      setScanError(error instanceof Error ? error.message : "Could not scan bill.");
      setState("upload");
    } finally {
      event.target.value = "";
    }
  }
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
            <>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleBillSelected}
              />
              <button className="dropzone" onClick={() => fileInputRef.current?.click()}>
              <span>
                <Icon name="upload" size={26} />
              </span>
              <h3>Drop a bill here</h3>
              <p>PDF, JPG, or PNG · Up to 10 MB</p>
              <b>Choose file</b>
              <small>Try demo: City Pharmacy · $86.20</small>
              </button>
              {scanError && <p>{scanError}</p>}
            </>
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
                  <b>{vendor.toUpperCase()}</b>
                </div>
                <p>Prescription medication</p>
                <strong>{state === "flagged" ? "$1,150.00" : amount}</strong>
                <small>{billDate}</small>
              </div>
              <div className="extracted">
                <span>
                  EXTRACTED DETAILS <b>98% CONFIDENCE</b>
                </span>
                <div>
                  <label>
                    Vendor
                    <input
                      value={state === "flagged" ? "MedPlus Pharmacy" : vendor}
                      onChange={(event) => setVendor(event.target.value)}
                    />
                  </label>
                  <label>
                    Amount
                    <input
                      value={state === "flagged" ? "$1,150.00" : amount}
                      onChange={(event) => setAmount(event.target.value)}
                    />
                  </label>
                  <label>
                    Date
                    <input value={billDate} onChange={(event) => setBillDate(event.target.value)} />
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
                  <Button variant="secondary" onClick={handleRejectBill}>Reject bill</Button>
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
    desc: "Phone for Emma",
    amount: "$269.00",
    status: "Needs approval",
  },
  {
    type: "LOAN",
    name: "Sarah Rahman",
    desc: "Four monthly installments",
    amount: "$200.00",
    status: "0 of 2 approvals",
  },
];
function Approvals({
  setScreen,
  currentUser,
  setTrustLogs,
}: {
  setScreen: (s: Screen) => void;
  currentUser: { name: string };
  setTrustLogs: React.Dispatch<React.SetStateAction<TrustLogItem[]>>;
}) {
  const [selected, setSelected] = useState(0);
  const [approved, setApproved] = useState(false);
  const selectedItem = approvalItems[selected];
  const selectedAmount = Number(selectedItem.amount.replace(/[^0-9.]/g, "")) || 0;

  function handleApprove() {
    setApproved(true);
    setTrustLogs((existing) => [
      ...existing,
      {
        time: new Date().toLocaleTimeString(),
        actor: currentUser.name,
        action: "Request Approved",
        amount: selectedAmount,
        rule: "Quorum Met",
        status: "APPROVED",
      },
    ]);
  }

  function handleReject() {
    const reason = window.prompt("Enter reason:");
    if (reason === null) return;
    setTrustLogs((existing) => [
      ...existing,
      {
        time: new Date().toLocaleTimeString(),
        actor: currentUser.name,
        action: "Request Rejected",
        amount: selectedAmount,
        rule: reason,
        status: "REJECTED",
      },
    ]);
    window.alert("Request rejected.");
  }
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
                <span className="decision-icon">{selectedItem.type[0]}</span>
                <div>
                  <small>{selectedItem.type} REQUEST</small>
                  <h2>{selectedItem.name}</h2>
                  <p>{selectedItem.desc}</p>
                </div>
                <strong>{selectedItem.amount}</strong>
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
                <Button variant="secondary" onClick={handleReject}>Reject with reason</Button>
                <Button onClick={handleApprove}>
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

type SmartBuyProduct = {
  name: string;
  price: number;
  seller: string;
  image?: string;
  badge?: string;
  delivery?: string;
  returns?: string;
  camera?: string;
};

const mockSmartBuyProducts: SmartBuyProduct[] = [
  { name: "Samsung Galaxy A35", price: 269, seller: "TechHub", badge: "STEWARD’S PICK", delivery: "Free · 2 days", returns: "30 days", camera: "yes" },
  { name: "Google Pixel 6a", price: 278, seller: "MobileMarket", badge: "BEST CAMERA", delivery: "$8 · 3 days", returns: "14 days", camera: "yes" },
  { name: "Samsung Galaxy A25", price: 239, seller: "PhoneBox", badge: "LOWEST PRICE", delivery: "Free · 5 days", returns: "30 days", camera: "no" },
];

function SmartBuy() {
  const [stage, setStage] = useState<"search" | "compare" | "mandate" | "bought">("search");
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState<SmartBuyProduct[]>(mockSmartBuyProducts);
  const [selectedProduct, setSelectedProduct] = useState<SmartBuyProduct>(mockSmartBuyProducts[0]);
  const [isThinking, setIsThinking] = useState(false);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const filteredProducts = activeFilters.includes("Under $280")
    ? products.filter((product) => product.price <= 280)
    : products;

  function toggleFilter(filter: string) {
    setActiveFilters((filters) =>
      filters.includes(filter) ? filters.filter((item) => item !== filter) : [...filters, filter],
    );
  }

  async function handleSearch() {
    setIsThinking(true);
    try {
      const results = await searchProducts(searchQuery);
      setProducts(Array.isArray(results) && results.length ? results : mockSmartBuyProducts);
    } catch (error) {
      console.error("Product search failed:", error);
      setProducts(mockSmartBuyProducts);
    } finally {
      setIsThinking(false);
      setStage("compare");
    }
  }
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
          <input
            placeholder="Ask Steward: e.g., Find a camera phone under $200"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                void handleSearch();
              }
            }}
          />
        </div>
        <Button onClick={() => void handleSearch()} disabled={isThinking}>
          <Icon name="search" /> {isThinking ? "Thinking..." : "Find safely"}
        </Button>
      </div>
      <div className="chip-row">
        {["Under $280", "Good camera", "New only", "Returns accepted", "Verified sellers"].map(
          (x) => (
            <button
              key={x}
              className={activeFilters.includes(x) ? "active" : ""}
              style={activeFilters.includes(x) ? { borderColor: "green" } : undefined}
              onClick={() => toggleFilter(x)}
            >
              {x} <span>×</span>
            </button>
          ),
        )}
      </div>
      {isThinking && (
        <div className="smart-empty">
          <span className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-current border-t-transparent" />
          <h2>Steward is thinking...</h2>
          <p>Steward is analyzing your request and searching 1000s of stores...</p>
        </div>
      )}
      {stage === "search" && !isThinking && (
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
              {filteredProducts.length} listings found</b>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {filteredProducts.map((product, index) => (
              <article
                className="bg-[var(--panel)] border border-[var(--line)] text-[var(--ink)] rounded-xl overflow-hidden p-4 flex flex-col"
                key={`${product.name}-${product.seller}`}
              >
                <span>{product.badge || (index === 0 ? "STEWARD’S PICK" : "PRODUCT MATCH")}</span>
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-48 object-contain bg-white rounded-md mb-4"
                  />
                ) : (
                  <div className="phone-visual">
                    <i />
                    <i />
                    <i />
                  </div>
                )}
                <h3>{product.name}</h3>
                <div className="text-2xl font-bold text-green-500">
                  {typeof product.price === "number" ? "$" + product.price.toFixed(2) : product.price}
                </div>
                <div className="text-sm text-gray-400 mt-1">Sold by: {product.seller}</div>
                <Button
                  className="mt-auto w-full"
                  onClick={() => {
                    setSelectedProduct(product);
                    setStage("mandate");
                  }}
                >
                  Choose this one
                </Button>
              </article>
            ))}
          </div>
        </>
      )}
      {stage === "mandate" && (
        <div className="mandate-layout">
          <section>
            <StewardNote>
              {`${selectedProduct.name} from ${selectedProduct.seller} is the selected match at $${Number(selectedProduct.price).toFixed(2)}.`}
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
              <b>${Number(selectedProduct.price).toFixed(2)}</b>
            </div>
            <p>
              <span>Seller</span>
              <b>{selectedProduct.seller} only</b>
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
          {selectedProduct?.image && (
            <img
              src={selectedProduct.image}
              alt={selectedProduct.name}
              className="max-h-48 w-auto object-contain mx-auto rounded-lg bg-white p-2 mb-4"
            />
          )}
          <h2 className="font-bold">{selectedProduct?.name || "Your item"} is on the way.</h2>
          <p className="text-gray-400">{selectedProduct?.seller || "Store"} · Order Confirmed</p>
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

type LoanItem = {
  id: number;
  borrower: string;
  amount: number;
  status: "ACTIVE" | "COMPLETED";
  remaining: number;
  progress: number;
};

type TrustLogItem = {
  time: string;
  actor: string;
  action: string;
  amount: number;
  rule: string;
  status: string;
};

function Loans({
  currentUser,
  loansList,
  setLoansList,
  setTrustLogs,
}: {
  currentUser: { name: string };
  loansList: LoanItem[];
  setLoansList: React.Dispatch<React.SetStateAction<LoanItem[]>>;
  setTrustLogs: React.Dispatch<React.SetStateAction<TrustLogItem[]>>;
}) {
  const [detail, setDetail] = useState(false);
  const [paid, setPaid] = useState(false);
  const [selectedLoanId, setSelectedLoanId] = useState(1);
  const selectedLoan = loansList.find((loan) => loan.id === selectedLoanId) ?? loansList[0];
  const installments = ["Oct 15, 2024", "Nov 15, 2024", "Dec 15, 2024", "Jan 15, 2025"];
  return (
    <>
      <PageTitle
        eyebrow="FAMILY LENDING"
        title="Loans"
        aside={
          <Button
            onClick={() => {
              const amountStr = window.prompt("Enter loan amount ($):");
              if (amountStr === null) return;
              const amount = parseFloat(amountStr.replace(/[^0-9.]/g, ""));
              if (isNaN(amount) || amount <= 0) {
                window.alert("Enter a valid loan amount.");
                return;
              }
              setLoansList((existing) => [
                ...existing,
                {
                  id: Date.now(),
                  borrower: currentUser.name,
                  amount,
                  status: "ACTIVE",
                  remaining: amount,
                  progress: 0,
                },
              ]);
              setTrustLogs((existing) => [
                ...existing,
                {
                  time: new Date().toLocaleTimeString(),
                  actor: currentUser.name,
                  action: "Loan Requested",
                  amount,
                  rule: "Manual Request",
                  status: "PENDING",
                },
              ]);
              window.alert("Loan requested successfully for $" + amount);
            }}
          >
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
          <section className="mt-6 rounded-2xl border border-[var(--line)] bg-[var(--panel)] p-6 text-[var(--ink)]">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">LOAN SCHEDULE</span>
                <h3 className="mt-1 text-lg font-semibold">Repayment timeline</h3>
              </div>
              <span className="text-sm text-gray-400">4 monthly installments</span>
            </div>
            <div className="relative mt-6">
              <span className="absolute bottom-4 left-4 top-4 w-px bg-[var(--line)]" />
              {installments.map((installment, index) => {
                const paidCount = Math.min(4, selectedLoan.progress / 25 + (paid ? 1 : 0));
                const status = index < paidCount ? "PAID" : index === paidCount ? "DUE" : "UPCOMING";
                const statusClasses = status === "PAID"
                  ? "bg-green-500 text-white"
                  : status === "DUE"
                    ? "bg-yellow-400 text-gray-900"
                    : "bg-[var(--panel)] text-gray-400 border border-[var(--line)]";
                return (
                  <div className="relative flex items-center gap-4 pb-6 last:pb-0" key={installment}>
                    <span className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${statusClasses}`}>
                      {status === "PAID" ? <Icon name="check" size={15} /> : status === "DUE" ? <Icon name="clock" size={15} /> : <span className="h-2 w-2 rounded-full bg-current" />}
                    </span>
                    <div className="min-w-0 flex-1">
                      <b className="block text-sm font-medium text-[var(--ink)]">
                        {new Date(installment).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </b>
                      <small className="mt-1 block text-xs tracking-wide text-gray-400">{status}</small>
                    </div>
                    <strong className="text-sm font-semibold text-[var(--ink)]">
                      ${(selectedLoan.amount / 4).toFixed(2)}
                    </strong>
                  </div>
                );
              })}
            </div>
          </section>
          <div className="loan-list">
            {loansList.map((loan) => {
              const initials = loan.borrower
                .trim()
                .split(/\s+/)
                .map((part) => part[0])
                .join("")
                .slice(0, 2)
                .toUpperCase();
              return (
                <button
                  key={loan.id}
                  onClick={() => {
                    setSelectedLoanId(loan.id);
                    setPaid(false);
                    setDetail(true);
                  }}
                >
                  <span className="avatar">{initials}</span>
                  <div>
                    <small>{loan.status === "ACTIVE" ? "ACTIVE · INTEREST-FREE" : "COMPLETED · INTEREST-FREE"}</small>
                    <h3>{loan.borrower}</h3>
                    <p>${loan.amount.toFixed(2)} · 4 × ${(loan.amount / 4).toFixed(2)} monthly</p>
                  </div>
                  <strong>
                    ${loan.remaining.toFixed(2)}<small>remaining</small>
                  </strong>
                  <div className="install-dots">
                    {[0, 1, 2, 3].map((index) => (
                      <i className={index < loan.progress / 25 ? "paid" : ""} key={index} />
                    ))}
                  </div>
                  <Stamp tone={loan.status === "COMPLETED" ? "neutral" : "green"}>
                    {loan.status === "COMPLETED" ? "SETTLED" : "ON TRACK"}
                  </Stamp>
                  <Icon name="arrow" />
                </button>
              );
            })}
          </div>
        </>
      ) : (
        <section className="loan-detail">
          <button className="back-link" onClick={() => setDetail(false)}>
            ← All loans
          </button>
          <div className="loan-detail-head">
            <span className="avatar">
              {selectedLoan.borrower
                .trim()
                .split(/\s+/)
                .map((part) => part[0])
                .join("")
                .slice(0, 2)
                .toUpperCase()}
            </span>
            <div>
              <span>ACTIVE LOAN</span>
              <h2>{selectedLoan.borrower}</h2>
              <p>Interest-free · Started Oct 15</p>
            </div>
            <strong>
              ${selectedLoan.remaining.toFixed(2)}<small>remaining</small>
            </strong>
            <Stamp>ON TRACK</Stamp>
          </div>
          <div className="loan-columns">
            <div>
              <h3>Repayment schedule</h3>
              <div className="border-l-2 border-gray-700 ml-4 pl-6 relative space-y-6">
                {installments.map((installment, index) => {
                  const paidCount = Math.min(4, selectedLoan.progress / 25 + (paid ? 1 : 0));
                  const status = index < paidCount ? "PAID" : index === paidCount ? "DUE" : "UPCOMING";
                  const statusClasses = status === "PAID"
                    ? "bg-green-500 text-white"
                    : status === "DUE"
                      ? "bg-yellow-400 text-gray-900"
                      : "bg-gray-500 text-white";
                  return (
                    <div className="relative flex items-center gap-4" key={installment}>
                      <span className={`absolute -left-10 flex h-8 w-8 items-center justify-center rounded-full ${statusClasses}`}>
                        {status === "PAID" ? <Icon name="check" size={15} /> : status === "DUE" ? "◷" : null}
                      </span>
                      <div className="flex-1">
                        <b>{installment}</b>
                        <small className="block text-gray-400">{status}</small>
                      </div>
                      <code>${(selectedLoan.amount / 4).toFixed(2)}</code>
                      {index === selectedLoan.progress / 25 &&
                        !paid &&
                        selectedLoan.status === "ACTIVE" && (
                          <Button variant="secondary" onClick={() => setPaid(true)}>
                            Pay now
                          </Button>
                        )}
                    </div>
                  );
                })}
              </div>
            </div>
            <aside>
              <StewardNote>
                {paid
                  ? `I recorded the PayPal invoice payment. ${selectedLoan.borrower} is still fully on track.`
                  : `${selectedLoan.borrower}’s next payment is due tomorrow. I drafted a gentle reminder in English.`}
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
                  Hi Sarah, a gentle reminder that your $50 family fund payment is due tomorrow. No
                  rush-tap the invoice when you’re ready.
                </p>
                <Button
                  variant="secondary"
                  className="full"
                  onClick={() => window.alert("Gentle reminder sent to the member!")}
                >
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

const fallbackLogs = [
  ["10:42:08", "STEWARD", "Paid City Pharmacy", "−$86.20", "Medical ≤ $150", "PAID"],
  ["10:41:51", "STEWARD", "Verified emergency bill", "-", "5 checks passed", "VERIFIED"],
  ["09:10:22", "SARA", "Monthly contribution", "+$100.00", "Scheduled contribution", "PAID"],
  ["YESTERDAY", "BILAL", "Approved Crescent Care", "-", "2 approvals required", "APPROVED"],
  ["YESTERDAY", "STEWARD", "Flagged MedPlus bill", "−$1,150.00", "Reserve floor breach", "FLAGGED"],
  ["NOV 12", "STEWARD", "Created PayPal invoice", "+$50.00", "Loan schedule", "INVOICED"],
];
function TrustLog({
  trustLogs,
  liveLogs,
}: {
  trustLogs: TrustLogItem[];
  liveLogs: any[];
}) {
  const [query, setQuery] = useState("");
  const colDefs = [
    { headerName: "Time", field: "time" },
    { headerName: "Actor", field: "actor" },
    { headerName: "Action", field: "action" },
    { headerName: "Amount", field: "amount" },
    { headerName: "Status", field: "status" },
  ];
  const displayedLogs = useMemo(() => {
    const localLogs = trustLogs.map((entry) => ({
      time: entry.time, actor: entry.actor, action: entry.action,
      amount: entry.amount, reason: entry.rule, status: entry.status,
    }));
    return [...localLogs, ...liveLogs].map((entry) => {
      const amount = Number(entry.amount ?? 0);
      return [entry.time, entry.actor, entry.action,
        amount === 0 ? "N/A" : `${amount > 0 ? "+" : "-"}$${Math.abs(amount).toFixed(2)}`,
        entry.reason || "N/A", entry.status, entry.reason || entry.action];
    });
  }, [liveLogs, trustLogs]);
  const gridRows = useMemo(
    () => [
      ...liveLogs,
      ...trustLogs.map((entry) => ({
        time: entry.time,
        actor: entry.actor,
        action: entry.action,
        amount: entry.amount,
        status: entry.status,
      })),
    ],
    [liveLogs, trustLogs],
  );
  function exportCsv() {
    const rows = [
      ["Time", "Actor", "Action", "Amount"],
      ...displayedLogs.map((entry) => entry.slice(0, 4)),
    ];
    const csv = rows
      .map((row) =>
        row
          .map((value) => `"${String(value ?? "").replace(/"/g, '""')}"`)
          .join(","),
      )
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "FundFlow_TrustLog.csv";
    link.click();
    URL.revokeObjectURL(url);
  }
  return (
    <>
      <PageTitle
        eyebrow="IMMUTABLE ACTIVITY"
        title="Trust Log"
        aside={
          <Button variant="secondary" onClick={exportCsv}>
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
      <div
        className="ag-theme-quartz-dark h-[500px] w-full"
        style={{
          "--ag-background-color": "var(--panel)",
          "--ag-foreground-color": "var(--ink)",
          "--ag-header-background-color": "var(--panel)",
          "--ag-odd-row-background-color": "var(--panel)",
          "--ag-border-color": "var(--line)",
        } as React.CSSProperties}
      >
        <AgGridReact
          rowData={gridRows}
          columnDefs={colDefs}
          pagination={true}
          quickFilterText={query}
          theme="legacy"
        />
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
                Alice and Bob will both be asked to confirm before Steward becomes active again.
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
  const [members, setMembers] = useState<
    { id: number; name: string; role: string; email: string }[]
  >([]);

  async function refreshMembers() {
    try {
      setMembers(await getMembers());
    } catch (error) {
      console.error("Failed to load members:", error);
      setMembers([]);
    }
  }

  useEffect(() => {
    void refreshMembers();
  }, []);

  async function handleInviteMember() {
    const name = window.prompt("Enter the new member's name:")?.trim();
    if (!name) return;
    const email = window.prompt("Enter the new member's email:")?.trim();
    if (!email) return;
    const role = window.prompt("Enter the member's role:", "Contributor")?.trim();
    if (!role) return;

    try {
      await inviteMember(name, email, role);
      await refreshMembers();
    } catch (error) {
      window.alert(error instanceof Error ? error.message : "Could not invite member.");
    }
  }

  async function handleDeleteMember(memberId: number) {
    try {
      await deleteMember(memberId);
      await refreshMembers();
    } catch (error) {
      window.alert(error instanceof Error ? error.message : "Could not delete member.");
    }
  }

  return (
    <>
      <PageTitle
        eyebrow="PEOPLE & PERMISSIONS"
        title="Members"
        aside={
          <Button onClick={() => void handleInviteMember()}>
            <Icon name="plus" /> Invite member
          </Button>
        }
      />
      <div className="settings-list">
        {members.map((member) => (
          <div key={member.id}>
            <span className="avatar">
              {member.name
                .trim()
                .split(/\s+/)
                .map((part) => part[0])
                .join("")
                .slice(0, 2)
                .toUpperCase()}
            </span>
            <span>
              <b>{member.name}</b>
              <small>{member.email}</small>
            </span>
            <label>{member.role}</label>
            <div>
              <button>Manage →</button>
              {member.role.toUpperCase() !== "OWNER" && (
                <button
                  className="text-red-500 text-sm ml-2"
                  onClick={() => void handleDeleteMember(member.id)}
                >
                  Delete
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
function Rules() {
  const [isTesting, setIsTesting] = useState(false);
  const [scenarioQuery, setScenarioQuery] = useState("");
  const [aiResponse, setAiResponse] = useState(
    "Steward says: I would hold the bill and ask two approvers. It’s above the $150 auto-pay limit.",
  );

  function handleTestRules() {
    const query = scenarioQuery.toLowerCase();
    let response = "Steward says: I will analyze this request against your family rules and let you know.";

    if (query.includes("loan")) {
      response = "Steward says: Any new loan requires 2 approvals. Since this fits within the pool limits, I will send it for approval.";
    } else if (["buy", "shop", "phone"].some((keyword) => query.includes(keyword))) {
      response = "Steward says: This looks like a Smart Buy. I will search verified sellers and ensure the price is under the $280 limit.";
    } else if (query.includes("bill") || query.includes("medical")) {
      response = "Steward says: I would hold the bill and ask two approvers. It’s above the $150 auto-pay limit.";
    }

    setIsTesting(true);
    window.setTimeout(() => {
      setAiResponse(response);
      setIsTesting(false);
    }, 1000);
  }

  return (
    <>
      <PageTitle
        eyebrow="STEWARD GUARDRAILS"
        title="Family Rules"
        aside={
          <Button
            onClick={() => {
              const rule = window.prompt("Enter new rule:");
              if (rule) window.alert("Rule added: " + rule);
            }}
          >
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
          <textarea value={scenarioQuery} onChange={(event) => setScenarioQuery(event.target.value)} />
          <Button onClick={handleTestRules}>
            {isTesting ? "Steward is analyzing..." : "Test my rules"}
          </Button>
          {isTesting ? (
            <p>Steward is analyzing...</p>
          ) : (
            <p>{aiResponse}</p>
          )}
        </aside>
      </div>
    </>
  );
}
function Settings({
  dark,
  toggleDark,
  onLogout,
  paypalStatus,
  onConnectPayPal,
}: {
  dark: boolean;
  toggleDark: () => void;
  onLogout: () => void;
  paypalStatus: "idle" | "loading" | "connected";
  onConnectPayPal: () => void;
}) {
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
            <Button
              variant="secondary"
              onClick={onConnectPayPal}
              disabled={paypalStatus === "loading" || paypalStatus === "connected"}
              style={paypalStatus === "connected" ? { color: "green" } : undefined}
            >
              {paypalStatus === "loading"
                ? "Connecting..."
                : paypalStatus === "connected"
                  ? "Connected ✓"
                  : "Connect"}
            </Button>
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
          <button className="setting-row logout" onClick={onLogout}>
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
  const [balance, setBalance] = useState(0);
  const [poolName, setPoolName] = useState("Rahman Family Fund");
  const [loansList, setLoansList] = useState<LoanItem[]>([
    { id: 1, borrower: "Sarah Rahman", amount: 200, status: "ACTIVE", remaining: 150, progress: 25 },
    { id: 2, borrower: "Bob Jones", amount: 200, status: "COMPLETED", remaining: 0, progress: 100 },
  ]);
  const [trustLogs, setTrustLogs] = useState<TrustLogItem[]>([]);
  const [liveLogs, setLiveLogs] = useState<any[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [paypalStatus, setPaypalStatus] = useState<"idle" | "loading" | "connected">("idle");
  const [paused, setPaused] = useState(false);
  const [dark, setDark] = useState(true);
  useEffect(() => {
    getTrustLog()
      .then((entries) => setLiveLogs(entries.map((entry: any) => {
        const action = String(entry.action ?? "Activity");
        return {
          time: Number.isNaN(Date.parse(entry.time)) ? entry.time : new Date(entry.time).toLocaleTimeString("en-US"),
          actor: entry.actor,
          action,
          amount: Number(entry.amount ?? 0),
          reason: entry.reason || "N/A",
          status: /paid|payment|contribution|captur/i.test(action) ? "PAID" : "VERIFIED",
        };
      })))
      .catch((error) => {
        console.error("Failed to load trust log:", error);
        setLiveLogs(fallbackLogs.slice(0, 3).map((entry) => ({
          time: entry[0], actor: entry[1], action: entry[2],
          amount: Number(String(entry[3]).replace(/[^0-9.-]/g, "")) || 0,
          reason: entry[4], status: entry[5],
        })));
      });
  }, []);
  function handleLogout() {
    setCurrentUser(null);
    setEntry("landing");
  }
  async function handleConnectPayPal() {
    if (!currentUser || paypalStatus === "loading" || paypalStatus === "connected") return;
    setPaypalStatus("loading");
    try {
      const response = await fetch("http://localhost:8000/api/members/connect-paypal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ member_name: currentUser.name }),
      });
      if (!response.ok) throw new Error(`PayPal connection failed (${response.status})`);
      setPaypalStatus("connected");
    } catch (error) {
      console.error("Failed to connect PayPal:", error);
      setPaypalStatus("idle");
    }
  }
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
        setCurrentUser={setCurrentUser}
        onDone={(needs) => setEntry(needs ? "onboarding" : "app")}
      />
    );
  if (entry === "onboarding" && currentUser) {
    return (
      <Onboarding
        currentUser={currentUser}
        poolName={poolName}
        setPoolName={setPoolName}
        paypalStatus={paypalStatus}
        onConnectPayPal={handleConnectPayPal}
        onDone={() => setEntry("app")}
      />
    );
  }
  if (!currentUser) {
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
  }
  const pages: Record<Screen, React.ReactNode> = {
    home: (
      <Home
        key={screen}
        currentUser={currentUser}
        balance={balance}
        setBalance={setBalance}
        setScreen={setScreen}
        liveLogs={liveLogs}
      />
    ),
    contribute: (
      <Contribute
        currentUser={currentUser}
        poolName={poolName}
        setScreen={setScreen}
        onContributionSuccess={async () => {
          try {
            const pool = await getPool();
            setBalance(pool.balance);
          } catch (error) {
            console.error("Failed to refresh pool balance:", error);
          }
        }}
      />
    ),
    emergency: (
      <Emergency
        setScreen={setScreen}
        currentUser={currentUser}
        setTrustLogs={setTrustLogs}
      />
    ),
    approvals: (
      <Approvals
        setScreen={setScreen}
        currentUser={currentUser}
        setTrustLogs={setTrustLogs}
      />
    ),
    smart: <SmartBuy />,
    loans: (
      <Loans
        currentUser={currentUser}
        loansList={loansList}
        setLoansList={setLoansList}
        setTrustLogs={setTrustLogs}
      />
    ),
    trust: <TrustLog trustLogs={trustLogs} liveLogs={liveLogs} />,
    kill: <KillSwitch paused={paused} setPaused={setPaused} />,
    members: <Members />,
    rules: <Rules />,
    settings: (
      <Settings
        dark={dark}
        toggleDark={() => setDark(!dark)}
        onLogout={handleLogout}
        paypalStatus={paypalStatus}
        onConnectPayPal={handleConnectPayPal}
      />
    ),
  };
  return (
    <Shell
      screen={screen}
      setScreen={setScreen}
      paused={paused}
      dark={dark}
      toggleDark={() => setDark(!dark)}
      currentUser={currentUser}
      poolName={poolName}
    >
      {pages[screen]}
    </Shell>
  );
}
