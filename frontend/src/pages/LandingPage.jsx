
import FindStation from '../components/FindStation';
import Nav from '../components/Nav';
import '../styles/LandingPage.css'
import Hero from '../components/Hero';
import WhatYouNeed from '../components/WhatYouNeed';
import MakeTheMostOfZ from '../components/makeTheMostOfZ';
import Footer from '../components/Footer';


/**
 * Mock "database" for the search UI.
 * You can swap this later for a real API.
 */
const MOCK_STATIONS = [
  { id: 1, name: "Z Quay Street", city: "Auckland", services: ["Car wash", "Trailer hire", "Coffee"], distanceKm: 0.6 },
  { id: 2, name: "Z Fanshawe", city: "Auckland", services: ["LPG bottle swap", "Food and drink"], distanceKm: 1.2 },
  { id: 3, name: "Z Great South Rd", city: "Auckland", services: ["Car wash", "Food and drink"], distanceKm: 7.8 },
  { id: 4, name: "Z Vivian Street", city: "Wellington", services: ["Trailer hire", "Coffee"], distanceKm: 494 },
  { id: 5, name: "Z Moorhouse", city: "Christchurch", services: ["LPG bottle swap", "Food and drink"], distanceKm: 764 },
];


/**
 * Very light client-side "auth".
 * Replace with a real request later (e.g., /auth/login).
 */
async function mockLogin({ email, password }) {
  await new Promise((r) => setTimeout(r, 650)); // simulate network
  if (email === "demo@z.co.nz" && password === "letmein") {
    return {
      ok: true,
      user: {
        email,
        name: "Demo User",
      },
      token: "mock-jwt-token-123",
    };
  }
  return { ok: false, error: "Invalid email or password." };
}

export default function LandingPage() {
  // ---- auth state ----
  const [user, setUser] = useState(null);
  const [loginOpen, setLoginOpen] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState("");

  // ---- search state ----
  const [query, setQuery] = useState("");
  const [serviceFilters, setServiceFilters] = useState([]); // e.g., ["Car wash"]
  const [showSearch, setShowSearch] = useState(false);

  // read a remembered session (mock)
  useEffect(() => {
    const cached = localStorage.getItem("z-demo-session");
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (parsed?.user) setUser(parsed.user);
      } catch {}
    }
  }, []);

  // ---- search logic (client-side) ----
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return MOCK_STATIONS.filter((s) => {
      const matchesText =
        !q ||
        s.name.toLowerCase().includes(q) ||
        s.city.toLowerCase().includes(q) ||
        s.services.some((v) => v.toLowerCase().includes(q));
      const matchesFilter =
        serviceFilters.length === 0 ||
        serviceFilters.every((f) =>
          s.services.map((x) => x.toLowerCase()).includes(f.toLowerCase())
        );
      return matchesText && matchesFilter;
    }).sort((a, b) => a.distanceKm - b.distanceKm);
  }, [query, serviceFilters]);

  // ---- login modal handlers ----
  async function handleLoginSubmit(e) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const email = (form.get("email") || "").toString().trim();
    const password = (form.get("password") || "").toString();

    setLoginError("");
    setLoginLoading(true);
    const res = await mockLogin({ email, password });
    setLoginLoading(false);

    if (res.ok) {
      setUser(res.user);
      localStorage.setItem("z-demo-session", JSON.stringify({ user: res.user, token: res.token }));
      setLoginOpen(false);
    } else {
      setLoginError(res.error || "Login failed.");
    }
  }

  function handleLogout() {
    setUser(null);
    localStorage.removeItem("z-demo-session");
  }

  function toggleService(tag) {
    setServiceFilters((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  }

  // For avatar initials after login
  const initials = user?.name
    ? user.name
        .split(" ")
        .map((p) => p[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "";

  return (
    <div className="z-landing">
      {/* ======= TOP BAR ======= */}
      <header className="topbar">
        <div className="brand">
          <img src="/z-logo.png" alt="Z logo" className="logo-img" />
        </div>

        <nav className="tabs">
          <button className="tab active">For personal</button>
          <button className="tab">For business</button>
        </nav>

        <nav className="links">
          <a href="#">Z App</a>
          <a href="#">About Z</a>

          {!user ? (
            <button
              className="login"
              onClick={() => setLoginOpen(true)}
              aria-haspopup="dialog"
              aria-expanded={loginOpen}
            >
              Login
            </button>
          ) : (
            <div className="userMenu">
              <button className="avatar-btn" aria-haspopup="menu">
                <span className="avatar-pill">{initials}</span>
                <span className="avatar-name">{user.name}</span>
              </button>
              <div className="userMenu__dropdown" role="menu">
                <button className="dropdown-item" onClick={handleLogout}>
                  Log out
                </button>
              </div>
            </div>
          )}
        </nav>
      </header>

      {/* ======= MAIN NAV ======= */}
      <div className="mainnav">
        <a href="#">At the station ▾</a>
        <a href="#">Power ▾</a>
        <a href="#">Rewards and promotions ▾</a>
        <a href="#">Locations</a>
      </div>

      {/* ======= SEARCH SECTION ======= */}
      <section className="search section">
        <div className="search__shell">
          <div className="search__header">
            <h3>Find your closest Z</h3>
            <button className="toggleSearch" onClick={() => setShowSearch((s) => !s)}>
              {showSearch ? "Hide search" : "Open search"}
            </button>
          </div>

          {showSearch && (
            <>
              <div className="search__bar">
                <input
                  className="searchInput"
                  placeholder="Search by station, city, or service (e.g., Car wash)"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  aria-label="Search stations"
                />
              </div>

              <div className="search__filters">
                {["Car wash", "Trailer hire", "LPG bottle swap", "Food and drink", "Coffee"].map(
                  (tag) => (
                    <button
                      key={tag}
                      className={
                        "filterPill" + (serviceFilters.includes(tag) ? " filterPill--active" : "")
                      }
                      onClick={() => toggleService(tag)}
                      aria-pressed={serviceFilters.includes(tag)}
                    >
                      {tag}
                    </button>
                  )
                )}
              </div>

              <div className="search__results">
                {filtered.length === 0 ? (
                  <div className="empty">No stations match your search.</div>
                ) : (
                  filtered.map((s) => (
                    <div key={s.id} className="resultCard">
                      <div className="result__title">
                        <span className="pin">📍</span>
                        <strong>{s.name}</strong>
                      </div>
                      <div className="result__meta">
                        <span>{s.city}</span> · <span>{s.distanceKm} km</span>
                      </div>
                      <div className="result__services">
                        {s.services.map((sv) => (
                          <span key={sv} className="svcPill">
                            {sv}
                          </span>
                        ))}
                      </div>
                      <button className="cta-secondary small">View details</button>
                    </div>
                  ))
                )}
              </div>
            </>
          )}
        </div>
      </section>

      {/* ======= HERO A ======= */}
      <section className="heroA">
        <div className="heroA__copy">
          <h1>
            There where you
            <br />
            need us
          </h1>
          <button className="cta-primary">
            Find your closest Z <span>➜</span>
          </button>
        </div>
        <div className="heroA__mapPin">📍</div>
      </section>

      {/* ======= HERO B (IMAGE ONLY) ======= */}
      <section className="heroB heroB--photo" aria-label="Z Station banner" />

      {/* ======= SERVICES ======= */}
      <section className="services section">
        <div className="section__left">
          <h3>What you need, made easy</h3>
          <p>
            Moving furniture? Hungry for a pie and barista made coffee? Have a dirty
            car that needs some love? Come on in — we’ve got you covered.
          </p>
          <button className="cta-secondary">Products and services</button>
        </div>

        <div className="services__cards">
          <button className="serviceCard">
            Trailer hire <span>➜</span>
          </button>
          <button className="serviceCard">
            Car wash <span>➜</span>
          </button>
          <button className="serviceCard">
            LPG bottle swap <span>➜</span>
          </button>
          <button className="serviceCard">
            Food and drink <span>➜</span>
          </button>
        </div>
      </section>

      {/* ======= HIGHLIGHTS ======= */}
      <section className="highlights">
        <h4>Make the most of Z</h4>
        <div className="highlight__grid">
          <a className="highlight" href="#">
            <h5>Rewards and promotions</h5>
            <h6>Z Rewards</h6>
            <p>
              Save 6c per litre every time you fill up to 100 litres, plus get points
              on almost everything you buy.
            </p>
            <span className="arrow">➜</span>
          </a>

          <a className="highlight" href="#">
            <h5>For businesses</h5>
            <h6>Your business is our business</h6>
            <p>
              With our fuel, card, distribution network and Kiwi-can-do attitude,
              we’ll help your business get to where you want it to be.
            </p>
            <span className="arrow">➜</span>
          </a>

          <a className="highlight" href="#">
            <h5>Z App</h5>
            <h6>Z in the palm of your hand</h6>
            <p>Pay for fuel, pre-buy with Sharetank, pre-order drinks and more.</p>
            <span className="arrow">➜</span>
          </a>
        </div>
      </section>

      {/* ======= FEATURE ======= */}
      <section className="feature">
        <div className="feature__text">
          <span className="eyebrow">Z App</span>
          <h3>Sharetank</h3>
          <p>
            Sign up to Sharetank, the virtual fuel tank you can fill anytime, anywhere
            and share with up to 5 friends or whānau.
          </p>
          <button className="cta-primary">
            Learn more <span>➜</span>
          </button>
        </div>
        <div className="feature__image" aria-hidden="true" />
      </section>

      {/* ======= FOOTER ======= */}
      <footer className="footer">
        <div className="footer__cols">
          <div>
            <img src="/z-logo.png" alt="Z logo" className="logo-img pill" />
            <ul>
              <li>
                <a href="#">At the station</a>
              </li>
              <li>
                <a href="#">Z App</a>
              </li>
              <li>
                <a href="#">Rewards and promotions</a>
              </li>
            </ul>
          </div>

          <div>
            <h6>For businesses</h6>
            <ul>
              <li>
                <a href="#">Z Business fuel card</a>
              </li>
              <li>
                <a href="#">Fuels and services</a>
              </li>
              <li>
                <a href="#">Business tips and stories</a>
              </li>
            </ul>
          </div>

          <div>
            <h6>About Z</h6>
            <ul>
              <li>
                <a href="#">Our story</a>
              </li>
              <li>
                <a href="#">Our people</a>
              </li>
              <li>
                <a href="#">Sustainability</a>
              </li>
              <li>
                <a href="#">Careers at Z</a>
              </li>
            </ul>
          </div>

          <div>
            <button className="cta-secondary">Contact us</button>
            <div className="apps">
              <div className="store">Google Play</div>
              <div className="store">App Store</div>
            </div>
          </div>
        </div>

        <div className="footer__legal">
          <a href="#">Privacy</a>
          <a href="#">Terms of use</a>
          <a href="#">Investor relations</a>
          <span>© Z Energy Limited</span>
        </div>
      </footer>

      {/* ======= LOGIN MODAL ======= */}
      {loginOpen && (
        <div
          className="modal__backdrop"
          role="dialog"
          aria-modal="true"
          aria-label="Login"
          onClick={(e) => {
            if (e.target.classList.contains("modal__backdrop")) setLoginOpen(false);
          }}
        >
          <form className="modal" onSubmit={handleLoginSubmit}>
            <div className="modal__head">
              <h4>Welcome back</h4>
              <button
                type="button"
                className="iconbtn"
                aria-label="Close login"
                onClick={() => setLoginOpen(false)}
              >
                ✕
              </button>
            </div>

            <label className="field">
              <span>Email</span>
              <input name="email" type="email" placeholder="demo@z.co.nz" required />
            </label>

            <label className="field">
              <span>Password</span>
              <input name="password" type="password" placeholder="••••••••" required />
              <small className="hint">Try: <code>demo@z.co.nz</code> / <code>letmein</code></small>
            </label>

            {loginError && <div className="error">{loginError}</div>}

            <button className="cta-primary wide" disabled={loginLoading}>
              {loginLoading ? "Signing in…" : "Sign in"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
