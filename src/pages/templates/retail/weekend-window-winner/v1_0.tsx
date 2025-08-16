import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import PublicNavBar from "../../../../components/PublicNavBar";

export const templateConfig = {
  name: "Weekend Window Winner",
  slug: "weekend-window-winner",
  vertical: "retail",
  version: "v1.0",
  description: "Turn Saturday-Sunday shoppers into 5★ fans and mid-week buyers.",
  expiry_days: 7,
  min_stars: 4,
  prizes: [
    { label: "Free tote bag + goodies", probability: 0.15 },
    { label: "$5 voucher", probability: 0.2 },
    { label: "10% off next visit", probability: 0.3 },
    { label: "Free travel-size product", probability: 0.2 },
    { label: "Mystery scratch card", probability: 0.15 }
  ],
  disclaimer: `Prizes are valid for 7 days after leaving your review. One redemption per customer. No cash value. Stock may vary, but equivalent items will be substituted if needed. Please show your active prize screen during checkout to redeem.`
};

export default function WeekendWindowWinnerPage() {
  const navigate = useNavigate();
  const template = templateConfig;

  return (
    <>
      <PublicNavBar />

      <div className="max-w-3xl mx-auto p-10 bg-white shadow-md rounded-xl mt-8">
        <h1 className="text-3xl font-bold text-teal-600 mb-2">{template.name}</h1>
        <p className="text-gray-600 mb-6">{template.description}</p>

        <img
          src="https://images.unsplash.com/photo-1546213290-e1b492ab3eee?q=80&w=3174&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Retail store with weekend shoppers"
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

        <div className="mt-6 p-4 bg-teal-50 border border-teal-200 rounded-md text-sm text-gray-700 whitespace-pre-line">
          <strong className="block mb-1 text-teal-700">Disclaimer:</strong>
          {template.disclaimer}
        </div>

        <div className="mt-8">
          <button
            className="inline-flex items-center px-6 py-3 bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-700 transition"
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
