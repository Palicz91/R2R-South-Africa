import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import PublicNavBar from "../../../../components/PublicNavBar";

export const templateConfig = {
  name: "Guest Checkout Spin",
  slug: "guest-checkout-spin",
  vertical: "hospitality",
  version: "v1.0",
  description: "Collect fresh reviews right at checkout and inspire guests to return.",
  expiry_days: 10,
  min_stars: 4,
  prizes: [
    { label: "Free 1-night stay voucher", probability: 0.03 },
    { label: "Complimentary room upgrade next visit", probability: 0.12 },
    { label: "Free breakfast for two", probability: 0.2 },
    { label: "10% off next stay", probability: 0.25 },
    { label: "Free spa access or welcome drink", probability: 0.3 },
    { label: "Thank you card with local snack", probability: 0.1 }
  ],
  disclaimer: `Prizes must be claimed within 10 days of your stay. Limited to one spin per room per stay. Rewards are non-transferable, have no cash value, and are subject to availability. Show your spin result at the front desk or via email confirmation.`
};

export default function GuestCheckoutSpinPage() {
  const navigate = useNavigate();
  const template = templateConfig;

  return (
    <>
      <PublicNavBar />

      <div className="max-w-3xl mx-auto p-10 bg-white shadow-md rounded-xl mt-8">
        <h1 className="text-3xl font-bold text-indigo-700 mb-2">{template.name}</h1>
        <p className="text-gray-600 mb-6">{template.description}</p>

        <img
          src="https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=1200&q=80"
          alt="Hotel reception"
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

        <div className="mt-6 p-4 bg-indigo-50 border border-indigo-200 rounded-md text-sm text-gray-700 whitespace-pre-line">
          <strong className="block mb-1 text-indigo-700">Disclaimer:</strong>
          {template.disclaimer}
        </div>

        <div className="mt-8">
          <button
            className="inline-flex items-center px-6 py-3 bg-indigo-700 text-white rounded-lg font-semibold hover:bg-indigo-800 transition"
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
