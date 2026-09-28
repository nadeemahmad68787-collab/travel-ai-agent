
"use client";

import { useEffect, useState } from "react";

type Trip = {
  destination: string;
  budget: string;
};

export default function Page() {
  const [destination, setDestination] = useState("");
  const [budget, setBudget] = useState("");
  const [showTrip, setShowTrip] = useState(false);
  const [savedTrips, setSavedTrips] = useState<Trip[]>([]);

  useEffect(() => {
    const data = localStorage.getItem("ainevor-saved-trips");
    if (data) {
      setSavedTrips(JSON.parse(data));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "ainevor-saved-trips",
      JSON.stringify(savedTrips)
    );
  }, [savedTrips]);

  function saveTrip() {
    if (!destination || !budget) return;

    const newTrip = { destination, budget };
    setSavedTrips((prev) => [...prev, newTrip]);
  }

  function clearTrips() {
    setSavedTrips([]);
    localStorage.removeItem("ainevor-saved-trips");
  }

  return (
    <main className="min-h-screen bg-black text-white px-6 py-10">
      <div className="max-w-2xl mx-auto">

        <img
          src="https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?w=1200"
          alt="Travel"
          className="w-full h-64 object-cover rounded-3xl mb-8"
        />

        <h1 className="text-5xl font-bold text-center">
          Ainevor AI Travel
        </h1>

        <p className="text-center text-gray-400 mt-4">
          Plan your complete trip with AI.
        </p>

        <div className="mt-8 bg-zinc-900 rounded-3xl p-6 border border-zinc-800">

          <input
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            placeholder="Destination"
            className="w-full p-4 rounded-xl bg-black border border-zinc-700 mb-4"
          />

          <input
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            placeholder="Budget"
            className="w-full p-4 rounded-xl bg-black border border-zinc-700 mb-4"
          />

          <button
            onClick={() => setShowTrip(true)}
            className="w-full bg-white text-black py-4 rounded-xl font-semibold"
          >
            Generate AI Trip
          </button>

        </div>

        {showTrip && (
          <div className="mt-8 bg-zinc-900 rounded-3xl p-6 border border-zinc-800">

            <h2 className="text-3xl font-bold">
              {destination || "Goa"} • 3 Days
            </h2>

            <p className="mt-3">
              💰 Budget: ₹{budget || "15,000"}
            </p>

            <div className="mt-6 space-y-4">

              <div className="bg-black rounded-2xl p-4 border border-zinc-800">
                🌅 Day 1 – Explore famous attractions
              </div>

              <div className="bg-black rounded-2xl p-4 border border-zinc-800">
                🍜 Day 2 – Local food & culture
              </div>

              <div className="bg-black rounded-2xl p-4 border border-zinc-800">
                🛍️ Day 3 – Shopping & return
              </div>

            </div>

            <h3 className="text-2xl font-bold mt-10 mb-4">
              Recommended Hotels
            </h3>

            <div className="space-y-4">

              <div className="bg-black rounded-2xl p-3 border border-zinc-800">
                <img
                  src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=900"
                  alt="Hotel"
                  className="w-full h-40 object-cover rounded-xl"
                />
                <h4 className="mt-3 font-semibold">
                  Beach Resort
                </h4>
                <p className="text-gray-400">
                  ₹3,500 / night
                </p>
              </div>

              <div className="bg-black rounded-2xl p-3 border border-zinc-800">
                <img
                  src="https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=900"
                  alt="Hotel"
                  className="w-full h-40 object-cover rounded-xl"
                />
                <h4 className="mt-3 font-semibold">
                  City Hotel
                </h4>
                <p className="text-gray-400">
                  ₹2,800 / night
                </p>
              </div>

            </div>

            <h3 className="text-2xl font-bold mt-10 mb-4">
              Must Try Food
            </h3>

            <div className="space-y-4">

              <div className="bg-black rounded-2xl p-3 border border-zinc-800">
                <img
                  src="https://images.unsplash.com/photo-1559847844-5315695dadae?w=900"
                  alt="Food"
                  className="w-full h-40 object-cover rounded-xl"
                />
                <h4 className="mt-3 font-semibold">
                  Goan Seafood
                </h4>
              </div>

              <div className="bg-black rounded-2xl p-3 border border-zinc-800">
                <img
                  src="https://images.unsplash.com/photo-1512058564366-18510be2db19?w=900"
                  alt="Food"
                  className="w-full h-40 object-cover rounded-xl"
                />
                <h4 className="mt-3 font-semibold">
                  Fish Curry Rice
                </h4>
              </div>

            </div>

            <button
              onClick={saveTrip}
              className="w-full mt-8 bg-green-500 text-black py-4 rounded-xl font-bold"
            >
              💾 Save My Trip
            </button>

          </div>
        )}

        {savedTrips.length > 0 && (
          <div className="mt-10">

            <div className="flex justify-between items-center mb-4">
              <h2 className="text-3xl font-bold">
                Saved Trips
              </h2>

              <button
                onClick={clearTrips}
                className="text-red-400 text-sm"
              >
                Clear All
              </button>
            </div>

            {savedTrips.map((trip, index) => (
              <div
                key={index}
                className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 mb-3"
              >
                <h3 className="font-semibold">
                  {trip.destination}
                </h3>

                <p className="text-gray-400">
                  Budget: ₹{trip.budget}
                </p>
              </div>
            ))}

          </div>
        )}

      </div>
    </main>
  );
}