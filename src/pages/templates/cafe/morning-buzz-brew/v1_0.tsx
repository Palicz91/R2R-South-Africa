import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import PublicNavBar from "../../../../components/PublicNavBar";

export const templateConfig = {
  name: "Morning Buzz Brew",
  slug: "morning-buzz-brew",
  vertical: "cafe",
  version: "v1.0",
  description: "Turn the 7–11 AM rush into fresh 5★ reviews and bring them back this week.",
  expiry_days: 7,
  min_stars: 4,
  prizes: [
    { label: "Free 250 g house-roast beans", probability: 0.05 },
    { label: "Free espresso shot upgrade", probability: 0.15 },
    { label: "10% off next visit", probability: 0.25 },
    { label: "Free croissant or pastry", probability: 0.3 },
    { label: "Free loyalty stamp (x1)", probability: 0.25 }
  ],
  disclaimer: `Every spin wins something. ☕️

Prizes must be claimed in person within 7 days from review submission. Limited to one prize per guest per visit. Not redeemable for cash and not valid with other offers. Present your prize screen at checkout — screenshots won't count.`
};

export default function MorningBuzzBrewPage() {
  const navigate = useNavigate();
  const template = templateConfig;

  return (
    <>
      <PublicNavBar />

      <div className="max-w-3xl mx-auto p-10 bg-white shadow-md rounded-xl mt-8">
        <h1 className="text-3xl font-bold text-amber-600 mb-2">{template.name}</h1>
        <p className="text-gray-600 mb-6">{template.description}</p>

        <img
          src="https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=1200&q=80"
          alt="Coffee shop morning rush"
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
                {prize.label}{" "}
                <span className="text-gray-500">({Math.round(prize.probability * 100)}% probability)</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-md text-sm text-gray-700 whitespace-pre-line">
          <strong className="block mb-1 text-amber-700">Disclaimer:</strong>
          {template.disclaimer}
        </div>

        <div className="mt-8">
          <button
            className="inline-flex items-center px-6 py-3 bg-amber-600 text-white rounded-lg font-semibold hover:bg-amber-700 transition"
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
