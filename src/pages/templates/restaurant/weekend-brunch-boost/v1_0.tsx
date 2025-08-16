import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import PublicNavBar from "../../../../components/PublicNavBar";

export const templateConfig = {
  name: "Weekend Brunch Boost",
  slug: "weekend-brunch-boost",
  vertical: "restaurant",
  version: "v1.0",
  description: "Ride the Sat–Sun buzz for 5★ reviews and extra drink sales.",
  expiry_days: 7,
  min_stars: 4,
  prizes: [
    { label: "Brunch for two", probability: 0.03 },
    { label: "Free specialty coffee", probability: 0.22 },
    { label: "10% off your next brunch", probability: 0.4 },
    { label: "Free pastry", probability: 0.35 },
  ],
  disclaimer: `Prizes must be claimed within 7 days of your review. All prizes are redeemable in-store only and are non-transferable. No cash value. Prizes may be substituted with items of similar value if unavailable. One prize per customer per visit. Present your prize screen at checkout to redeem.`
};

export default function WeekendBrunchBoostPage() {
  const navigate = useNavigate();
  const template = templateConfig;

  return (
    <>
      <PublicNavBar />

      <div className="max-w-3xl mx-auto p-10 bg-white shadow-md rounded-xl mt-8">
        <h1 className="text-3xl font-bold text-yellow-600 mb-2">{template.name}</h1>
        <p className="text-gray-600 mb-6">{template.description}</p>

        <img
          src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80"
          alt="Brunch table with drinks"
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

        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-md text-sm text-gray-700 whitespace-pre-line">
          <strong className="block mb-1 text-yellow-700">Disclaimer:</strong>
          {template.disclaimer}
        </div>

        <div className="mt-8">
          <button
            className="inline-flex items-center px-6 py-3 bg-yellow-500 text-white rounded-lg font-semibold hover:bg-yellow-600 transition"
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
