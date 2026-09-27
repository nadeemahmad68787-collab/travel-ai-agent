
"use client";

import { useState } from "react";

export default function Page() {
  const [destination, setDestination] = useState("");
  const [budget, setBudget] = useState("");
  const [showTrip, setShowTrip] = useState(false);

  return (
    <main className="min-h-screen bg-black text-white px-6 py-10">
      <div className="max-w-2xl mx-auto">
        <img
          src="https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?w=1200"
          alt="Travel"
          className="w-full h-64 object-cover rounded-3xl mb-8"
        />

        <h1 className="text-5xl font-bold text-center">Ainevor AI Travel</h1>

        <p className="text-center text-gray-400 mt-4">
          Plan your complete trip with AI in seconds.
        </p>

        <div className="mt-8 bg-zinc-900 rounded-3xl p-6 border border-zinc-800">
          <input
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            placeholder="Destination (Goa, Dubai...)"
            className="w-full p-4 rounded-xl bg-black border border-zinc-700 mb-4"
          />

          <input
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            placeholder="Budget (₹15,000)"
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

            <p className="mt-4 text-lg">💰 Budget: ₹{budget || "15,000"}</p>

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

            <h3 className="text-2xl font-bold mt-10 mb-4">Recommended Hotels</h3>

            <div className="space-y-4">
              <div className="bg-black rounded-2xl p-3 border border-zinc-800">
                <img
                  src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=900"
                  alt="Hotel"
                  className="w-full h-40 object-cover rounded-xl"
                />
                <h4 className="mt-3 font-semibold">Beach Resort</h4>
                <p className="text-gray-400">₹3,500 / night</p>
              </div>

              <div className="bg-black rounded-2xl p-3 border border-zinc-800">
                <img
                  src="https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=900"
                  alt="Hotel"
                  className="w-full h-40 object-cover rounded-xl"
                />
                <h4 className="mt-3 font-semibold">City Hotel</h4>
                <p className="text-gray-400">₹2,800 / night</p>
              </div>
            </div>

            <h3 className="text-2xl font-bold mt-10 mb-4">Must Try Food</h3>

            <div className="space-y-4">
              <div className="bg-black rounded-2xl p-3 border border-zinc-800">
                <img
                  src="https://images.unsplash.com/photo-1559847844-5315695dadae?w=900"
                  alt="Food"
                  className="w-full h-40 object-cover rounded-xl"
                />
                <h4 className="mt-3 font-semibold">Goan Seafood</h4>
              </div>

              <div className="bg-black rounded-2xl p-3 border border-zinc-800">
                <img
                  src="https://images.unsplash.com/photo-1512058564366-18510be2db19?w=900"
                  alt="Food"
                  className="w-full h-40 object-cover rounded-xl"
                />
                <h4 className="mt-3 font-semibold">Fish Curry Rice</h4>
              </div>

              <div className="bg-black rounded-2xl p-3 border border-zinc-800">
                <img
                  src="https://images.unsplash.com/photo-1509440159596-0249088772ff?w=900"
                  alt="Food"
                  className="w-full h-40 object-cover rounded-xl"
                />
                <h4 className="mt-3 font-semibold">Bebinca Dessert</h4>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}