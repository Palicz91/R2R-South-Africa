import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import PublicNavBar from "../../../../components/PublicNavBar";

export const templateConfig = {
  name: "Seasonal Sip Surprise",
  slug: "seasonal-sip-surprise",
  vertical: "cafe",
  version: "v1.0",
  description: "Show off your limited-time lattes and keep guests coming back all season.",
  expiry_days: 21,
  min_stars: 4,
  prizes: [
    { label: "Seasonal gift box", probability: 0.03 },
    { label: "Free seasonal latte upgrade", probability: 0.15 },
    { label: "Buy 1 get 1 half-off seasonal drinks", probability: 0.25 },
    { label: "Free cookie with coffee", probability: 0.3 },
    { label: "15% off next seasonal item", probability: 0.2 },
    { label: "Sticker or pin from our café collection", probability: 0.07 }
  ],
  disclaimer: `Prizes must be redeemed in-store within 21 days of your review. One spin per customer per visit. Subject to availability. Not valid with other promotions or cash alternatives. Show your spin result at the counter to redeem.`
};

export default function SeasonalSipSurprisePage() {
  const navigate = useNavigate();
  const template = templateConfig;

  return (
    <>
      <PublicNavBar />

      <div className="max-w-3xl mx-auto p-10 bg-white shadow-md rounded-xl mt-8">
        <h1 className="text-3xl font-bold text-rose-700 mb-2">{template.name}</h1>
        <p className="text-gray-600 mb-6">{template.description}</p>

        <img
          src="https://images.unsplash.com/photo-1726114601623-8c5f0c573976?q=80&w=3130&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Seasonal coffee shop drinks"
          className="rounded-lg shadow-md mb-6 w-full object-cover max-h-72"
        />

        <ul className="text-sm text-gray-700 mb-6 space-y-1">
          <li>• <strong>Use within:</strong> {template.expiry_days} days</li>
          <li>• <strong>Minimum rating:</strong> {template.min_stars}★ review</li>
          <li>• <strong>Top prize:</strong> {template.prizes[0]?.label}</li>
        </ul>

        <div className="mb-4">
          <p className="text-md font-medium text-gray-800 mb-2">Prize options (with win chance):</p>
          <ul className="list-disc ml-6 text-sm text-gray-700 space-y-1">
            {template.prizes.map((prize, idx) => (
              <li key={idx}>
                {prize.label} <span className="text-gray-500">({Math.round(prize.probability * 100)}% probability)</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-6 p-4 bg-rose-50 border border-rose-200 rounded-md text-sm text-gray-700 whitespace-pre-line">
          <strong className="block mb-1 text-rose-700">Disclaimer:</strong>
          {template.disclaimer}
        </div>

        <div className="mt-8">
          <button
            className="inline-flex items-center px-6 py-3 bg-rose-600 text-white rounded-lg font-semibold hover:bg-rose-700 transition"
            onClick={() =>
              navigate(`/create?template=${encodeURIComponent(JSON.stringify(template))}`)
            }
          >
            Use this template
            <ArrowRight className="w-4 h-4 ml-2" />
          </button>
        </div>
      </div>
    </>
  );
}
