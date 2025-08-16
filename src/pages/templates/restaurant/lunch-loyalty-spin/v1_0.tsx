import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import PublicNavBar from "../../../../components/PublicNavBar";

// Static template config
export const templateConfig = {
  name: "Lunch Loyalty Spin",
  slug: "lunch-loyalty-spin",
  vertical: "restaurant",
  version: "v1.0",
  description: "Snag weekday-lunch reviews and tempt guests back within two weeks.",
  expiry_days: 14,
  min_stars: 4,
  prizes: [
    { label: "Free 2-course dinner for two", probability: 0.05 },
    { label: "Free dessert", probability: 0.25 },
    { label: "10% off your next visit", probability: 0.4 },
    { label: "Free coffee or soft drink", probability: 0.3 }
  ],
  disclaimer: `Prizes are valid for 14 days from the review submission date and must be claimed in person. No cash value. Not combinable with other promotions or discounts. 
All rewards are subject to availability and may be substituted with items of equal or greater value at the restaurant's discretion.

Redemption is limited to one prize per guest per visit. 
Please present your prize screen at checkout. Screenshots or reused QR codes will not be accepted.`,
};

export default function LunchLoyaltySpinPage() {
  const navigate = useNavigate();
  const template = templateConfig;

  return (
    <>
      <PublicNavBar />

      <div className="max-w-3xl mx-auto p-10 bg-white shadow-md rounded-xl mt-8">
        <h1 className="text-3xl font-bold text-orange-600 mb-2">{template.name}</h1>
        <p className="text-gray-600 mb-6">{template.description}</p>

        <img
          src="https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&w=1200&q=80"
          alt="Restaurant table setting"
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
                <span className="text-gray-500">
                  ({Math.round(prize.probability * 100)}% probability)
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-6 p-4 bg-orange-50 border border-orange-200 rounded-md text-sm text-gray-700 whitespace-pre-line">
          <strong className="block mb-1 text-orange-700">Disclaimer:</strong>
          {template.disclaimer}
        </div>

        <div className="mt-8">
          <button
            className="inline-flex items-center px-6 py-3 bg-orange-600 text-white rounded-lg font-semibold hover:bg-orange-700 transition"
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
