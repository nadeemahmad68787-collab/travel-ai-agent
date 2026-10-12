"use client";

import { useEffect, useMemo, useState } from "react";

type Expense = {
  flight: number;
  hotel: number;
  food: number;
  transport: number;
};

type Trip = {
  id?: string;
  destination: string;
  budget: string;
  totalExpense: number;
  budgetStatus: string;
  expenses?: Expense;
  itinerary?: string[];
  createdAt?: string;
};

const defaultTrip: Trip = {
  destination: "",
  budget: "",
  totalExpense: 0,
  budgetStatus: "No Budget Set",
  expenses: {
    flight: 0,
    hotel: 0,
    food: 0,
    transport: 0,
  },
  itinerary: [],
};

function priceToNumber(value: string | number | undefined) {
  if (typeof value === "number") return value;

  if (!value) return 0;

  return Number(value.replace(/[₹,\s]/g, "")) || 0;
}

function formatPrice(value: number | undefined) {
  return `₹${(value ?? 0).toLocaleString("en-IN")}`;
}

function getBudgetStatus(budget: string, totalExpense: number) {
  const numericBudget = priceToNumber(budget);

  if (numericBudget <= 0) {
    return "No Budget Set";
  }

  if (totalExpense > numericBudget) {
    return "Over Budget";
  }

  if (totalExpense >= numericBudget * 0.8) {
    return "Near Budget";
  }

  return "Under Budget";
}

function getExpenses(destination: string): Expense {
  const place = destination.toLowerCase();

  if (place.includes("goa")) {
    return {
      flight: 4200,
      hotel: 4500,
      food: 2700,
      transport: 3000,
    };
  }

  if (place.includes("manali")) {
    return {
      flight: 5200,
      hotel: 4200,
      food: 2600,
      transport: 2400,
    };
  }

  if (place.includes("dubai")) {
    return {
      flight: 15000,
      hotel: 9000,
      food: 5500,
      transport: 4200,
    };
  }

  if (place.includes("mumbai")) {
    return {
      flight: 5000,
      hotel: 4500,
      food: 3000,
      transport: 2500,
    };
  }

  if (place.includes("delhi")) {
    return {
      flight: 3500,
      hotel: 4000,
      food: 2500,
      transport: 2000,
    };
  }

  if (place.includes("jaipur")) {
    return {
      flight: 4500,
      hotel: 3800,
      food: 2300,
      transport: 1800,
    };
  }

  if (place.includes("paris")) {
    return {
      flight: 45000,
      hotel: 24000,
      food: 12000,
      transport: 7000,
    };
  }

  return {
    flight: 6000,
    hotel: 4500,
    food: 3000,
    transport: 2500,
  };
}

function getItinerary(destination: string) {
  const place = destination.toLowerCase();

  if (place.includes("goa")) {
    return [
      "🏖️ Day 1 — Baga Beach & Candolim",
      "🌅 Day 2 — Old Goa, Panjim & Sunset",
      "🌴 Day 3 — South Goa & Beach Evening",
    ];
  }

  if (place.includes("manali")) {
    return [
      "🏔️ Day 1 — Mall Road & Hadimba Temple",
      "❄️ Day 2 — Solang Valley Adventure",
      "🌲 Day 3 — Old Manali & River Side",
    ];
  }

  if (place.includes("dubai")) {
    return [
      "🏙️ Day 1 — Burj Khalifa & Dubai Mall",
      "🏜️ Day 2 — Desert Safari & Marina",
      "🌆 Day 3 — Palm Jumeirah & Downtown",
    ];
  }

  if (place.includes("jaipur")) {
    return [
      "🏰 Day 1 — Amber Fort & Jal Mahal",
      "🕌 Day 2 — City Palace & Hawa Mahal",
      "🌇 Day 3 — Markets & Local Food",
    ];
  }

  if (place.includes("delhi")) {
    return [
      "🏛️ Day 1 — India Gate & Rashtrapati Bhavan",
      "🕌 Day 2 — Red Fort & Jama Masjid",
      "🍜 Day 3 — Old Delhi Food Walk",
    ];
  }

  return [
    `📍 Day 1 — Explore ${destination}`,
    `🌆 Day 2 — Local attractions & experiences`,
    `🍽️ Day 3 — Food, shopping & sightseeing`,
  ];
}

function getHotelImage(destination: string) {
  const place = destination.toLowerCase();

  if (place.includes("goa")) {
    return "https://images.unsplash.com/photo-1582610116397-edb318620f90?auto=format&fit=crop&w=1200&q=80";
  }

  if (place.includes("dubai")) {
    return "https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=1200&q=80";
  }

  if (place.includes("manali")) {
    return "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1200&q=80";
  }

  return "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80";
}

function getDestinationImage(destination: string) {
  const place = destination.toLowerCase();

  if (place.includes("goa")) {
    return "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1600&q=85";
  }

  if (place.includes("manali")) {
    return "https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=1600&q=85";
  }

  if (place.includes("dubai")) {
    return "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1600&q=85";
  }

  if (place.includes("jaipur")) {
    return "https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=1600&q=85";
  }

  return "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=85";
}

function normalizeTrip(trip: Partial<Trip>): Trip {
  const expenses: Expense = {
    flight: Number(trip.expenses?.flight ?? 0),
    hotel: Number(trip.expenses?.hotel ?? 0),
    food: Number(trip.expenses?.food ?? 0),
    transport: Number(trip.expenses?.transport ?? 0),
  };

  const calculatedExpense =
    expenses.flight +
    expenses.hotel +
    expenses.food +
    expenses.transport;

  const totalExpense =
    typeof trip.totalExpense === "number"
      ? trip.totalExpense
      : calculatedExpense;

  return {
    id: trip.id ?? Date.now().toString(),
    destination: trip.destination ?? "Unknown",
    budget: trip.budget ?? "",
    totalExpense,
    budgetStatus:
      trip.budgetStatus ??
      getBudgetStatus(trip.budget ?? "", totalExpense),
    expenses,
    itinerary: trip.itinerary ?? getItinerary(trip.destination ?? "Your Trip"),
    createdAt: trip.createdAt ?? new Date().toISOString(),
  };
}

export default function Home() {
  const [destination, setDestination] = useState("");
  const [budget, setBudget] = useState("");
  const [activeTab, setActiveTab] = useState("plan");

  const [trip, setTrip] = useState<Trip>(defaultTrip);

  const [savedTrips, setSavedTrips] = useState<Trip[]>([]);

  const [showSaved, setShowSaved] = useState(false);

  const [message, setMessage] = useState("");

  useEffect(() => {
    try {
      const stored = localStorage.getItem("ainevor-saved-trips");

      if (stored) {
        const parsed = JSON.parse(stored);

        if (Array.isArray(parsed)) {
          setSavedTrips(parsed.map((item) => normalizeTrip(item)));
        }
      }
    } catch {
      setSavedTrips([]);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(
        "ainevor-saved-trips",
        JSON.stringify(savedTrips)
      );
    } catch {
      // Ignore localStorage errors
    }
  }, [savedTrips]);

  const totalExpense = useMemo(() => {
    return (
      (trip.expenses?.flight ?? 0) +
      (trip.expenses?.hotel ?? 0) +
      (trip.expenses?.food ?? 0) +
      (trip.expenses?.transport ?? 0)
    );
  }, [trip.expenses]);

  const numericBudget = priceToNumber(trip.budget);

  const budgetPercentage =
    numericBudget > 0
      ? Math.min(Math.round((totalExpense / numericBudget) * 100), 100)
      : 0;

  function generateTrip() {
    if (!destination.trim()) {
      setMessage("Please enter a destination first.");
      return;
    }

    const cleanDestination = destination.trim();

    const expenses = getExpenses(cleanDestination);

    const total =
      expenses.flight +
      expenses.hotel +
      expenses.food +
      expenses.transport;

    const newTrip: Trip = {
      id: Date.now().toString(),
      destination: cleanDestination,
      budget,
      totalExpense: total,
      budgetStatus: getBudgetStatus(budget, total),
      expenses,
      itinerary: getItinerary(cleanDestination),
      createdAt: new Date().toISOString(),
    };

    setTrip(newTrip);
    setMessage("✨ AI trip plan generated!");
    setActiveTab("plan");
  }

  function saveTrip() {
    if (!trip.destination) {
      setMessage("Generate a trip first.");
      return;
    }

    const safeTrip = normalizeTrip(trip);

    const alreadySaved = savedTrips.some(
      (item) =>
        item.destination.toLowerCase() ===
          safeTrip.destination.toLowerCase() &&
        item.budget === safeTrip.budget
    );

    if (alreadySaved) {
      setMessage("This trip is already saved.");
      return;
    }

    setSavedTrips((current) => [safeTrip, ...current]);
    setMessage("❤️ Trip saved successfully!");
  }

  function deleteTrip(index: number) {
    setSavedTrips((current) =>
      current.filter((_, tripIndex) => tripIndex !== index)
    );

    setMessage("Trip deleted.");
  }

  function clearAllTrips() {
    setSavedTrips([]);
    setMessage("All saved trips cleared.");
  }

  function viewSavedTrip(saved: Trip) {
    const safeTrip = normalizeTrip(saved);

    setTrip(safeTrip);
    setDestination(safeTrip.destination);
    setBudget(safeTrip.budget);
    setActiveTab("plan");
    setShowSaved(false);
    setMessage("Trip opened.");
  }

  function selectDestination(value: string) {
    setDestination(value);

    if (value) {
      setMessage("");
    }
  }

  const statusClass =
    trip.budgetStatus === "Over Budget"
      ? "status-danger"
      : trip.budgetStatus === "Near Budget"
      ? "status-warning"
      : "status-success";

  return (
    <main className="app">
      <div className="background-glow glow-one" />
      <div className="background-glow glow-two" />

      <header className="header">
        <div className="brand">
          <div className="brand-icon">✦</div>

          <div>
            <div className="brand-name">Ainevor AI</div>
            <div className="brand-subtitle">TRAVEL INTELLIGENCE</div>
          </div>
        </div>

        <nav className="nav">
          <button
            className={activeTab === "plan" ? "nav-btn active" : "nav-btn"}
            onClick={() => setActiveTab("plan")}
          >
            Plan
          </button>

          <button
            className={activeTab === "flights" ? "nav-btn active" : "nav-btn"}
            onClick={() => setActiveTab("flights")}
          >
            Flights
          </button>

          <button
            className={activeTab === "hotels" ? "nav-btn active" : "nav-btn"}
            onClick={() => setActiveTab("hotels")}
          >
            Hotels
          </button>

          <button
            className={activeTab === "budget" ? "nav-btn active" : "nav-btn"}
            onClick={() => setActiveTab("budget")}
          >
            Budget
          </button>

          <button
            className="saved-nav"
            onClick={() => setShowSaved(true)}
          >
            ♡ Saved
            {savedTrips.length > 0 && (
              <span className="saved-count">{savedTrips.length}</span>
            )}
          </button>
        </nav>
      </header>

      <section className="hero">
        <div className="hero-overlay" />

        <div className="hero-content">
          <div className="eyebrow">
            <span className="pulse" />
            AI-POWERED TRAVEL PLANNER
          </div>

          <h1>
            Your journey.
            <br />
            <span>Intelligently planned.</span>
          </h1>

          <p>
            Tell Ainevor where you want to go and your budget.
            <br />
            We&apos;ll turn it into a complete travel experience.
          </p>
        </div>
      </section>

      <section className="planner-card">
        <div className="planner-top">
          <div>
            <span className="section-label">PLAN YOUR TRIP</span>
            <h2>Where are you going?</h2>
          </div>

          <div className="ai-badge">✦ AI READY</div>
        </div>

        <div className="inputs">
          <div className="input-group">
            <label>DESTINATION</label>

            <div className="input-wrapper">
              <span>📍</span>

              <input
                value={destination}
                onChange={(e) => selectDestination(e.target.value)}
                placeholder="Goa, Dubai, Manali..."
              />
            </div>
          </div>

          <div className="input-group">
            <label>BUDGET</label>

            <div className="input-wrapper">
              <span>₹</span>

              <input
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                placeholder="30,000"
                inputMode="numeric"
              />
            </div>
          </div>

          <button className="generate-btn" onClick={generateTrip}>
            <span>✦</span>
            Generate AI Trip
            <span>→</span>
          </button>
        </div>

        {message && <div className="message">{message}</div>}

        <div className="quick-destinations">
          <span>Try:</span>

          {["Goa", "Manali", "Dubai", "Jaipur"].map((place) => (
            <button
              key={place}
              onClick={() => selectDestination(place)}
            >
              {place}
            </button>
          ))}
        </div>
      </section>

      {activeTab === "plan" && trip.destination && (
        <section className="content">
          <div className="destination-card">
            <div
              className="destination-image"
              style={{
                backgroundImage: `url(${getDestinationImage(
                  trip.destination
                )})`,
              }}
            >
              <div className="image-shade" />

              <div className="destination-info">
                <span>YOUR AI ITINERARY</span>
                <h2>{trip.destination}</h2>
                <p>3 Days · Personalized for you</p>
              </div>

              <div className={`status-pill ${statusClass}`}>
                {trip.budgetStatus === "Under Budget" && "✓ "}
                {trip.budgetStatus}
              </div>
            </div>

            <div className="trip-body">
              <div className="trip-heading">
                <div>
                  <span className="section-label">AI GENERATED PLAN</span>
                  <h2>Your {trip.destination} escape</h2>
                </div>

                <button className="save-btn" onClick={saveTrip}>
                  ♡ Save My Trip
                </button>
              </div>

              <div className="days">
                {(trip.itinerary ?? []).map((day, index) => (
                  <div className="day-card" key={index}>
                    <div className="day-number">
                      {index + 1}
                    </div>

                    <div>
                      <div className="day-label">
                        DAY {index + 1}
                      </div>

                      <h3>{day.replace(/^.*?—\s*/, "")}</h3>

                      <p>
                        AI selected this experience based on your
                        destination and travel plan.
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="stats-grid">
            <div className="stat-card">
              <span>TRIP BUDGET</span>
              <strong>
                {trip.budget
                  ? formatPrice(numericBudget)
                  : "Not set"}
              </strong>
            </div>

            <div className="stat-card">
              <span>ESTIMATED EXPENSE</span>
              <strong>{formatPrice(totalExpense)}</strong>
            </div>

            <div className="stat-card">
              <span>BUDGET USED</span>
              <strong>
                {numericBudget > 0
                  ? `${budgetPercentage}%`
                  : "—"}
              </strong>
            </div>

            <div className={`stat-card ${statusClass}`}>
              <span>STATUS</span>
              <strong>{trip.budgetStatus}</strong>
            </div>
          </div>
        </section>
      )}

      {activeTab === "flights" && (
        <section className="content">
          <div className="section-title">
            <span className="section-label">FLIGHT OPTIONS</span>
            <h2>Smart flight planning</h2>
            <p>
              Estimated flight cost based on your selected destination.
            </p>
          </div>

          <div className="flight-card">
            <div className="airline-icon">✈️</div>

            <div className="flight-route">
              <strong>India</strong>
              <span>→</span>
              <strong>
                {destination || "Your destination"}
              </strong>
            </div>

            <div className="flight-meta">
              <span>Economy</span>
              <span>Round Trip</span>
            </div>

            <div className="flight-price">
              {formatPrice(trip.expenses?.flight ?? 0)}
            </div>
          </div>

          <div className="flight-card">
            <div className="airline-icon">🌐</div>

            <div className="flight-route">
              <strong>Best Value</strong>
              <span>→</span>
              <strong>
                {destination || "Destination"}
              </strong>
            </div>

            <div className="flight-meta">
              <span>Flexible</span>
              <span>AI Recommended</span>
            </div>

            <div className="flight-price">
              {formatPrice(trip.expenses?.flight ?? 0)}
            </div>
          </div>
        </section>
      )}

      {activeTab === "hotels" && (
        <section className="content">
          <div className="section-title">
            <span className="section-label">HOTEL STAYS</span>
            <h2>Stay somewhere great</h2>
            <p>
              Ainevor recommends hotels that fit your travel budget.
            </p>
          </div>

          <div className="hotel-card">
            <div
              className="hotel-image"
              style={{
                backgroundImage: `url(${getHotelImage(
                  trip.destination || destination || "Goa"
                )})`,
              }}
            />

            <div className="hotel-info">
              <div className="hotel-tag">✦ AI PICK</div>

              <h3>
                {trip.destination || destination || "Your Destination"}{" "}
                Premium Stay
              </h3>

              <p>
                ★ 4.7 · Great location · Breakfast available
              </p>

              <div className="hotel-bottom">
                <div>
                  <span>3 NIGHTS</span>
                  <strong>
                    {formatPrice(
                      trip.expenses?.hotel ?? 0
                    )}
                  </strong>
                </div>

                <button className="outline-btn">
                  View Hotel
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {activeTab === "budget" && (
        <section className="content">
          <div className="section-title">
            <span className="section-label">TRAVEL BUDGET</span>
            <h2>Your trip calculator</h2>
            <p>
              See exactly where your travel money is going.
            </p>
          </div>

          <div className="budget-layout">
            <div className="budget-main">
              <div className="budget-total">
                <span>TOTAL ESTIMATED EXPENSE</span>
                <strong>{formatPrice(totalExpense)}</strong>

                {numericBudget > 0 && (
                  <div className="progress">
                    <div
                      className="progress-bar"
                      style={{
                        width: `${budgetPercentage}%`,
                      }}
                    />
                  </div>
                )}

                <div className="budget-row">
                  <span>
                    Budget:{" "}
                    {numericBudget > 0
                      ? formatPrice(numericBudget)
                      : "Not set"}
                  </span>

                  <span>{budgetPercentage}% used</span>
                </div>
              </div>

              <div className="expense-list">
                <div className="expense-item">
                  <span className="expense-icon">✈️</span>

                  <div>
                    <strong>Flights</strong>
                    <small>Estimated airfare</small>
                  </div>

                  <b>{formatPrice(trip.expenses?.flight)}</b>
                </div>

                <div className="expense-item">
                  <span className="expense-icon">🏨</span>

                  <div>
                    <strong>Hotel</strong>
                    <small>3 night stay</small>
                  </div>

                  <b>{formatPrice(trip.expenses?.hotel)}</b>
                </div>

                <div className="expense-item">
                  <span className="expense-icon">🍽️</span>

                  <div>
                    <strong>Food</strong>
                    <small>Meals & experiences</small>
                  </div>

                  <b>{formatPrice(trip.expenses?.food)}</b>
                </div>

                <div className="expense-item">
                  <span className="expense-icon">🚕</span>

                  <div>
                    <strong>Transport</strong>
                    <small>Local transportation</small>
                  </div>

                  <b>{formatPrice(trip.expenses?.transport)}</b>
                </div>
              </div>
            </div>

            <div className={`budget-status ${statusClass}`}>
              <div className="status-icon">
                {trip.budgetStatus === "Over Budget"
                  ? "!"
                  : "✓"}
              </div>

              <span>BUDGET STATUS</span>

              <h3>{trip.budgetStatus}</h3>

              {numericBudget > 0 ? (
                <p>
                  {totalExpense <= numericBudget
                    ? `${formatPrice(
                        numericBudget - totalExpense
                      )} remaining`
                    : `${formatPrice(
                        totalExpense - numericBudget
                      )} over budget`}
                </p>
              ) : (
                <p>Set a budget to track your spending.</p>
              )}
            </div>
          </div>
        </section>
      )}

      {showSaved && (
        <div
          className="modal-backdrop"
          onClick={() => setShowSaved(false)}
        >
          <div
            className="saved-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <div>
                <span className="section-label">YOUR COLLECTION</span>
                <h2>Saved Trips</h2>
              </div>

              <button
                className="close-btn"
                onClick={() => setShowSaved(false)}
              >
                ×
              </button>
            </div>

            {savedTrips.length === 0 ? (
              <div className="empty-state">
                <div>♡</div>
                <h3>No saved trips yet</h3>
                <p>
                  Generate a trip and save it here for later.
                </p>
              </div>
            ) : (
              <>
                <div className="saved-list">
                  {savedTrips.map((savedTrip, index) => {
                    const safeTrip = normalizeTrip(savedTrip);

                    return (
                      <div
                        className="saved-card"
                        key={
                          safeTrip.id ??
                          `${safeTrip.destination}-${index}`
                        }
                      >
                        <div className="saved-image">
                          <img
                            src={getDestinationImage(
                              safeTrip.destination
                            )}
                            alt={safeTrip.destination}
                          />
                        </div>

                        <div className="saved-info">
                          <span>TRAVEL PLAN</span>

                          <h3>{safeTrip.destination}</h3>

                          <p>
                            Budget:{" "}
                            {safeTrip.budget
                              ? formatPrice(
                                  priceToNumber(
                                    safeTrip.budget
                                  )
                                )
                              : "Not set"}
                          </p>

                          <p>
                            Estimated:{" "}
                            {formatPrice(
                              safeTrip.totalExpense ?? 0
                            )}
                          </p>
                        </div>

                        <div className="saved-actions">
                          <button
                            className="view-btn"
                            onClick={() =>
                              viewSavedTrip(safeTrip)
                            }
                          >
                            👁️ View Trip
                          </button>

                          <button
                            className="delete-btn"
                            onClick={() =>
                              deleteTrip(index)
                            }
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <button
                  className="clear-btn"
                  onClick={clearAllTrips}
                >
                  Clear All Saved Trips
                </button>
              </>
            )}
          </div>
        </div>
      )}

      <footer>
        <div>
          <strong>✦ Ainevor AI</strong>
          <span>Personal Travel Intelligence</span>
        </div>

        <span>Built for smarter journeys.</span>
      </footer>

      <style jsx>{`
        * {
          box-sizing: border-box;
        }

        .app {
          min-height: 100vh;
          background:
            radial-gradient(
              circle at 15% 10%,
              rgba(99, 102, 241, 0.12),
              transparent 30%
            ),
            radial-gradient(
              circle at 85% 40%,
              rgba(56, 189, 248, 0.08),
              transparent 30%
            ),
            #07090f;
          color: #f7f8ff;
          font-family:
            Inter,
            ui-sans-serif,
            system-ui,
            -apple-system,
            BlinkMacSystemFont,
            "Segoe UI",
            sans-serif;
          min-height: 100vh;
          overflow-x: hidden;
        }

        .background-glow {
          position: fixed;
          width: 450px;
          height: 450px;
          border-radius: 50%;
          filter: blur(120px);
          opacity: 0.12;
          pointer-events: none;
        }

        .glow-one {
          background: #6366f1;
          top: 100px;
          left: -250px;
        }

        .glow-two {
          background: #06b6d4;
          right: -250px;
          top: 600px;
        }

        .header {
          height: 76px;
          padding: 0 5vw;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid rgba(255, 255, 255, 0.07);
          background: rgba(7, 9, 15, 0.78);
          backdrop-filter: blur(20px);
          position: sticky;
          top: 0;
          z-index: 30;
        }

        .brand {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .brand-icon {
          width: 38px;
          height: 38px;
          border-radius: 12px;
          display: grid;
          place-items: center;
          background: linear-gradient(
            135deg,
            #7c3aed,
            #2563eb
          );
          box-shadow: 0 8px 30px rgba(99, 102, 241, 0.3);
          font-size: 20px;
        }

        .brand-name {
          font-size: 16px;
          font-weight: 800;
          letter-spacing: -0.3px;
        }

        .brand-subtitle {
          font-size: 8px;
          letter-spacing: 2px;
          color: #71778a;
          margin-top: 2px;
        }

        .nav {
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .nav-btn,
        .saved-nav {
          border: 0;
          background: transparent;
          color: #858b9d;
          padding: 9px 13px;
          border-radius: 10px;
          cursor: pointer;
          font-size: 13px;
          transition: 0.2s;
        }

        .nav-btn:hover,
        .nav-btn.active {
          color: #fff;
          background: rgba(255, 255, 255, 0.07);
        }

        .saved-nav {
          color: #d9dbea;
          margin-left: 5px;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .saved-count {
          margin-left: 7px;
          background: #6366f1;
          color: white;
          padding: 2px 6px;
          border-radius: 20px;
          font-size: 10px;
        }

        .hero {
          position: relative;
          min-height: 450px;
          display: flex;
          align-items: center;
          background-image: url("https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=2200&q=90");
          background-size: cover;
          background-position: center;
          overflow: hidden;
        }

        .hero-overlay {
          position: absolute;
          inset: 0;
          background:
            linear-gradient(
              90deg,
              rgba(4, 6, 12, 0.97) 0%,
              rgba(4, 6, 12, 0.82) 45%,
              rgba(4, 6, 12, 0.35) 100%
            ),
            linear-gradient(
              0deg,
              #07090f 0%,
              transparent 45%
            );
        }

        .hero-content {
          position: relative;
          z-index: 1;
          width: 90%;
          max-width: 1200px;
          margin: auto;
          padding: 65px 0 95px;
        }

        .eyebrow,
        .section-label {
          color: #8b8ff8;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 2px;
        }

        .eyebrow {
          display: flex;
          align-items: center;
          gap: 9px;
          margin-bottom: 18px;
        }

        .pulse {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #6ee7b7;
          box-shadow: 0 0 14px #6ee7b7;
        }

        .hero h1 {
          margin: 0;
          max-width: 760px;
          font-size: clamp(45px, 6vw, 78px);
          line-height: 0.98;
          letter-spacing: -4px;
          font-weight: 850;
        }

        .hero h1 span {
          background: linear-gradient(
            90deg,
            #a78bfa,
            #60a5fa
          );
          -webkit-background-clip: text;
          color: transparent;
        }

        .hero p {
          color: #b4bac9;
          line-height: 1.7;
          margin-top: 25px;
          font-size: 15px;
        }

        .planner-card {
          width: 90%;
          max-width: 1200px;
          margin: -58px auto 0;
          position: relative;
          z-index: 5;
          padding: 26px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 22px;
          background: rgba(15, 18, 29, 0.93);
          backdrop-filter: blur(25px);
          box-shadow: 0 25px 80px rgba(0, 0, 0, 0.35);
        }

        .planner-top {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 20px;
        }

        .planner-top h2 {
          margin: 7px 0 0;
          font-size: 22px;
          letter-spacing: -0.7px;
        }

        .ai-badge {
          border: 1px solid rgba(139, 92, 246, 0.35);
          color: #a78bfa;
          background: rgba(139, 92, 246, 0.08);
          padding: 7px 11px;
          border-radius: 9px;
          font-size: 9px;
          letter-spacing: 1.4px;
          font-weight: 800;
        }

        .inputs {
          display: grid;
          grid-template-columns: 1fr 0.65fr 1fr;
          gap: 12px;
        }

        .input-group label {
          display: block;
          color: #73798b;
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 1.5px;
          margin-bottom: 8px;
        }

        .input-wrapper {
          height: 52px;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 0 15px;
          border-radius: 12px;
          background: #0a0d15;
          border: 1px solid rgba(255, 255, 255, 0.08);
        }

        .input-wrapper:focus-within {
          border-color: rgba(129, 140, 248, 0.65);
        }

        .input-wrapper span {
          color: #8b8ff8;
        }

        .input-wrapper input {
          width: 100%;
          border: 0;
          outline: 0;
          background: transparent;
          color: white;
          font-size: 14px;
        }

        .input-wrapper input::placeholder {
          color: #52586a;
        }

        .generate-btn {
          height: 52px;
          margin-top: 21px;
          border: 0;
          border-radius: 12px;
          color: white;
          background: linear-gradient(
            100deg,
            #6d4aff,
            #4263e8
          );
          font-weight: 750;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          box-shadow: 0 12px 35px rgba(79, 70, 229, 0.25);
          transition: 0.2s;
        }

        .generate-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 16px 45px rgba(79, 70, 229, 0.38);
        }

        .message {
          color: #a7f3d0;
          margin-top: 13px;
          font-size: 12px;
        }

        .quick-destinations {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-top: 17px;
          color: #666d80;
          font-size: 11px;
        }

        .quick-destinations button {
          border: 1px solid rgba(255, 255, 255, 0.08);
          background: rgba(255, 255, 255, 0.03);
          color: #aeb4c4;
          border-radius: 20px;
          padding: 5px 10px;
          cursor: pointer;
        }

        .content {
          width: 90%;
          max-width: 1200px;
          margin: 50px auto 80px;
        }

        .destination-card {
          overflow: hidden;
          border-radius: 22px;
          background: #10131d;
          border: 1px solid rgba(255, 255, 255, 0.08);
        }

        .destination-image {
          min-height: 330px;
          position: relative;
          background-size: cover;
          background-position: center;
          display: flex;
          align-items: flex-end;
          padding: 30px;
        }

        .image-shade {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            0deg,
            rgba(5, 7, 12, 0.95),
            transparent 75%
          );
        }

        .destination-info {
          position: relative;
          z-index: 2;
        }

        .destination-info span {
          font-size: 9px;
          letter-spacing: 2px;
          color: #a5b4fc;
          font-weight: 800;
        }

        .destination-info h2 {
          font-size: 42px;
          margin: 6px 0;
          letter-spacing: -2px;
        }

        .destination-info p {
          margin: 0;
          color: #c0c5d2;
        }

        .status-pill {
          position: absolute;
          top: 25px;
          right: 25px;
          z-index: 2;
          border-radius: 20px;
          padding: 8px 13px;
          font-size: 10px;
          font-weight: 800;
        }

        .status-success {
          color: #6ee7b7;
          background: rgba(16, 185, 129, 0.09);
          border-color: rgba(16, 185, 129, 0.2);
        }

        .status-warning {
          color: #fcd34d;
          background: rgba(245, 158, 11, 0.09);
        }

        .status-danger {
          color: #fb7185;
          background: rgba(244, 63, 94, 0.09);
        }

        .trip-body {
          padding: 28px;
        }

        .trip-heading {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 20px;
        }

        .trip-heading h2 {
          margin: 7px 0 0;
          font-size: 24px;
        }

        .save-btn {
          border: 1px solid rgba(167, 139, 250, 0.35);
          color: #c4b5fd;
          background: rgba(124, 58, 237, 0.08);
          border-radius: 10px;
          padding: 10px 15px;
          cursor: pointer;
        }

        .days {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
          margin-top: 24px;
        }

        .day-card {
          padding: 19px;
          border-radius: 15px;
          background: #0a0d15;
          border: 1px solid rgba(255, 255, 255, 0.06);
        }

        .day-number {
          width: 30px;
          height: 30px;
          border-radius: 9px;
          display: grid;
          place-items: center;
          background: rgba(99, 102, 241, 0.15);
          color: #a5b4fc;
          font-size: 12px;
          font-weight: 800;
          margin-bottom: 15px;
        }

        .day-label {
          color: #747b8e;
          font-size: 9px;
          letter-spacing: 1.4px;
          font-weight: 800;
        }

        .day-card h3 {
          margin: 6px 0;
          font-size: 15px;
        }

        .day-card p {
          color: #747b8e;
          font-size: 11px;
          line-height: 1.6;
          margin: 8px 0 0;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 12px;
          margin-top: 15px;
        }

        .stat-card {
          padding: 20px;
          border-radius: 15px;
          background: #10131d;
          border: 1px solid rgba(255, 255, 255, 0.07);
        }

        .stat-card span {
          display: block;
          color: #6e7588;
          font-size: 8px;
          font-weight: 800;
          letter-spacing: 1.4px;
          margin-bottom: 8px;
        }

        .stat-card strong {
          font-size: 19px;
        }

        .section-title {
          margin-bottom: 25px;
        }

        .section-title h2 {
          margin: 7px 0;
          font-size: 32px;
          letter-spacing: -1.5px;
        }

        .section-title p {
          color: #7f8698;
          margin: 0;
        }

        .flight-card {
          display: grid;
          grid-template-columns: 50px 1fr auto auto;
          align-items: center;
          gap: 20px;
          padding: 22px;
          margin-bottom: 12px;
          border-radius: 18px;
          background: #10131d;
          border: 1px solid rgba(255, 255, 255, 0.07);
        }

        .airline-icon {
          width: 48px;
          height: 48px;
          display: grid;
          place-items: center;
          border-radius: 13px;
          background: rgba(99, 102, 241, 0.12);
          font-size: 21px;
        }

        .flight-route {
          display: flex;
          gap: 14px;
          align-items: center;
        }

        .flight-route span {
          color: #747b8d;
        }

        .flight-meta {
          display: flex;
          gap: 7px;
        }

        .flight-meta span {
          font-size: 10px;
          color: #8d94a7;
          padding: 6px 9px;
          border-radius: 7px;
          background: rgba(255, 255, 255, 0.04);
        }

        .flight-price {
          font-weight: 800;
          font-size: 17px;
        }

        .hotel-card {
          display: grid;
          grid-template-columns: 42% 1fr;
          overflow: hidden;
          border-radius: 20px;
          background: #10131d;
          border: 1px solid rgba(255, 255, 255, 0.07);
        }

        .hotel-image {
          min-height: 310px;
          background-size: cover;
          background-position: center;
        }

        .hotel-info {
          padding: 30px;
          display: flex;
          flex-direction: column;
        }

        .hotel-tag {
          color: #a5b4fc;
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 1.5px;
        }

        .hotel-info h3 {
          font-size: 28px;
          margin: 12px 0 8px;
          letter-spacing: -1px;
        }

        .hotel-info p {
          color: #818899;
          font-size: 13px;
        }

        .hotel-bottom {
          margin-top: auto;
          padding-top: 30px;
          display: flex;
          align-items: end;
          justify-content: space-between;
        }

        .hotel-bottom span {
          display: block;
          color: #71788a;
          font-size: 8px;
          letter-spacing: 1.5px;
          margin-bottom: 5px;
        }

        .hotel-bottom strong {
          font-size: 21px;
        }

        .outline-btn {
          border: 1px solid rgba(255, 255, 255, 0.13);
          background: transparent;
          color: white;
          padding: 10px 15px;
          border-radius: 9px;
          cursor: pointer;
        }

        .budget-layout {
          display: grid;
          grid-template-columns: 1fr 280px;
          gap: 15px;
        }

        .budget-main {
          background: #10131d;
          border-radius: 20px;
          padding: 25px;
          border: 1px solid rgba(255, 255, 255, 0.07);
        }

        .budget-total {
          padding-bottom: 25px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.07);
        }

        .budget-total > span {
          color: #71788a;
          font-size: 9px;
          letter-spacing: 1.5px;
          font-weight: 800;
        }

        .budget-total > strong {
          display: block;
          font-size: 36px;
          margin: 7px 0 18px;
          letter-spacing: -1.5px;
        }

        .progress {
          height: 7px;
          background: #202431;
          border-radius: 20px;
          overflow: hidden;
        }

        .progress-bar {
          height: 100%;
          border-radius: inherit;
          background: linear-gradient(
            90deg,
            #6366f1,
            #8b5cf6
          );
        }

        .budget-row {
          display: flex;
          justify-content: space-between;
          color: #747b8e;
          font-size: 10px;
          margin-top: 9px;
        }

        .expense-list {
          padding-top: 10px;
        }

        .expense-item {
          display: grid;
          grid-template-columns: 42px 1fr auto;
          align-items: center;
          gap: 12px;
          padding: 13px 0;
        }

        .expense-icon {
          width: 39px;
          height: 39px;
          display: grid;
          place-items: center;
          border-radius: 10px;
          background: rgba(255, 255, 255, 0.04);
        }

        .expense-item strong {
          display: block;
          font-size: 13px;
        }

        .expense-item small {
          color: #6d7486;
          font-size: 10px;
        }

        .expense-item b {
          font-size: 13px;
        }

        .budget-status {
          border-radius: 20px;
          padding: 28px;
          border: 1px solid rgba(255, 255, 255, 0.07);
          background: #10131d;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .status-icon {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          display: grid;
          place-items: center;
          margin-bottom: 25px;
          background: rgba(16, 185, 129, 0.12);
          font-size: 21px;
        }

        .budget-status span {
          font-size: 8px;
          font-weight: 800;
          letter-spacing: 1.5px;
          opacity: 0.7;
        }

        .budget-status h3 {
          font-size: 24px;
          margin: 8px 0;
        }

        .budget-status p {
          color: #7b8294;
          font-size: 12px;
          line-height: 1.6;
        }

        .modal-backdrop {
          position: fixed;
          inset: 0;
          z-index: 100;
          background: rgba(0, 0, 0, 0.72);
          backdrop-filter: blur(12px);
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 20px;
        }

        .saved-modal {
          width: min(900px, 100%);
          max-height: 85vh;
          overflow: auto;
          padding: 28px;
          border-radius: 22px;
          background: #10131d;
          border: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: 0 30px 100px rgba(0, 0, 0, 0.5);
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 22px;
        }

        .modal-header h2 {
          margin: 7px 0 0;
          font-size: 28px;
        }

        .close-btn {
          width: 35px;
          height: 35px;
          border: 0;
          border-radius: 10px;
          background: rgba(255, 255, 255, 0.06);
          color: white;
          font-size: 23px;
          cursor: pointer;
        }

        .saved-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .saved-card {
          display: grid;
          grid-template-columns: 90px 1fr auto;
          gap: 15px;
          align-items: center;
          padding: 12px;
          border-radius: 15px;
          background: #0a0d15;
          border: 1px solid rgba(255, 255, 255, 0.06);
        }

        .saved-image {
          width: 90px;
          height: 80px;
          border-radius: 10px;
          overflow: hidden;
        }

        .saved-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .saved-info span {
          color: #737a8c;
          font-size: 8px;
          letter-spacing: 1.3px;
          font-weight: 800;
        }

        .saved-info h3 {
          margin: 5px 0;
          font-size: 16px;
        }

        .saved-info p {
          margin: 2px 0;
          color: #757c8f;
          font-size: 10px;
        }

        .saved-actions {
          display: flex;
          gap: 7px;
          align-items: center;
        }

        .view-btn {
          border: 1px solid rgba(129, 140, 248, 0.25);
          background: rgba(99, 102, 241, 0.08);
          color: #a5b4fc;
          padding: 9px 11px;
          border-radius: 9px;
          cursor: pointer;
          font-size: 11px;
        }

        .delete-btn {
          width: 35px;
          height: 35px;
          border: 0;
          background: rgba(244, 63, 94, 0.08);
          color: #fb7185;
          border-radius: 9px;
          cursor: pointer;
        }

        .clear-btn {
          width: 100%;
          margin-top: 15px;
          padding: 11px;
          border-radius: 10px;
          border: 1px solid rgba(244, 63, 94, 0.18);
          background: rgba(244, 63, 94, 0.05);
          color: #fb7185;
          cursor: pointer;
        }

        .empty-state {
          padding: 70px 20px;
          text-align: center;
        }

        .empty-state > div {
          font-size: 50px;
          color: #6366f1;
        }

        .empty-state h3 {
          margin: 15px 0 7px;
        }

        .empty-state p {
          margin: 0;
          color: #737a8d;
          font-size: 12px;
        }

        footer {
          width: 90%;
          max-width: 1200px;
          margin: 0 auto;
          padding: 25px 0 35px;
          border-top: 1px solid rgba(255, 255, 255, 0.07);
          display: flex;
          justify-content: space-between;
          color: #555c6d;
          font-size: 10px;
        }

        footer div {
          display: flex;
          gap: 12px;
        }

        footer strong {
          color: #8d94a6;
        }

        @media (max-width: 850px) {
          .header {
            padding: 0 20px;
          }

          .nav {
            display: none;
          }

          .hero-content {
            padding-left: 10px;
            padding-right: 10px;
          }

          .inputs {
            grid-template-columns: 1fr;
          }

          .generate-btn {
            margin-top: 0;
          }

          .days,
          .stats-grid {
            grid-template-columns: 1fr;
          }

          .budget-layout {
            grid-template-columns: 1fr;
          }

          .flight-card {
            grid-template-columns: 45px 1fr;
          }

          .flight-meta,
          .flight-price {
            grid-column: 2;
          }

          .hotel-card {
            grid-template-columns: 1fr;
          }

          .hotel-image {
            min-height: 230px;
          }
        }

        @media (max-width: 600px) {
          .planner-card,
          .content {
            width: 94%;
          }

          .hero h1 {
            font-size: 44px;
            letter-spacing: -2.5px;
          }

          .hero {
            min-height: 430px;
          }

          .destination-image {
            min-height: 300px;
          }

          .trip-heading {
            align-items: flex-start;
            flex-direction: column;
          }

          .saved-card {
            grid-template-columns: 70px 1fr;
          }

          .saved-image {
            width: 70px;
            height: 70px;
          }

          .saved-actions {
            grid-column: 1 / -1;
          }

          footer {
            flex-direction: column;
            gap: 10px;
          }
        }
      `}</style>
    </main>
  );
}