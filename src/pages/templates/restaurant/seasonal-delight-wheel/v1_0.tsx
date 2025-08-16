import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import PublicNavBar from "../../../../components/PublicNavBar";

export const templateConfig = {
  name: "Seasonal Delight Wheel",
  slug: "seasonal-delight-wheel",
  vertical: "restaurant",
  version: "v1.0",
  description: "Show off your new seasonal menu and keep diners coming back.",
  expiry_days: 21,
  min_stars: 4,
  prizes: [
    { label: "Chef’s tasting menu for two", probability: 0.04 },
    { label: "Free appetizer with next order", probability: 0.3 },
    { label: "Buy one get one dessert", probability: 0.36 },
    { label: "10% off your next visit", probability: 0.3 },
  ],
  disclaimer: `Prizes are valid for 21 days after your review. Must be claimed in person. No cash value or substitutions unless stated by the restaurant. Limit one prize per guest per visit. Show your winning screen at checkout to redeem. Screenshots not accepted.`
};

export default function SeasonalDelightWheelPage() {
  const navigate = useNavigate();
  const template = templateConfig;

  return (
    <>
      <PublicNavBar />

      <div className="max-w-3xl mx-auto p-10 bg-white shadow-md rounded-xl mt-8">
        <h1 className="text-3xl font-bold text-green-700 mb-2">{template.name}</h1>
        <p className="text-gray-600 mb-6">{template.description}</p>

        <img
          src="https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=1200&q=80"
          alt="Seasonal restaurant dish"
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

        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-md text-sm text-gray-700 whitespace-pre-line">
          <strong className="block mb-1 text-green-700">Disclaimer:</strong>
          {template.disclaimer}
        </div>

        <div className="mt-8">
          <button
            className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition"
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
