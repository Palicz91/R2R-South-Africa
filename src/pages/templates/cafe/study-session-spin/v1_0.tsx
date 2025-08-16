import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import PublicNavBar from "../../../../components/PublicNavBar";

export const templateConfig = {
  name: "Study Session Spin",
  slug: "study-session-spin",
  vertical: "cafe",
  version: "v1.0",
  description: "Laptop warriors drop a review now → snag a drink-plus-pastry deal next visit.",
  expiry_days: 14,
  min_stars: 4,
  prizes: [
    { label: "Drink + pastry flight for two", probability: 0.04 },
    { label: "Free espresso shot", probability: 0.16 },
    { label: "Buy one coffee, get one free", probability: 0.3 },
    { label: "10% off next visit", probability: 0.3 },
    { label: "Free reusable straw set", probability: 0.2 }
  ],
  disclaimer: `All prizes must be claimed within 14 days. One per customer. Screenshots or reused codes not accepted. Offers can't be stacked with other discounts. If an item is unavailable, the cafe will offer something of equal or greater value.`
};

export default function StudySessionSpinPage() {
  const navigate = useNavigate();
  const template = templateConfig;

  return (
    <>
      <PublicNavBar />

      <div className="max-w-3xl mx-auto p-10 bg-white shadow-md rounded-xl mt-8">
        <h1 className="text-3xl font-bold text-teal-600 mb-2">{template.name}</h1>
        <p className="text-gray-600 mb-6">{template.description}</p>

        <img
          src="https://images.unsplash.com/photo-1453614512568-c4024d13c247?q=80&w=3132&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Study setup in a coffee shop"
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
