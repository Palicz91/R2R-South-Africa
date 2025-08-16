import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import PublicNavBar from "../../../../components/PublicNavBar";

export const templateConfig = {
  name: "Weekend Fun Wheel",
  slug: "weekend-fun-wheel",
  vertical: "hospitality",
  version: "v1.0",
  description: "Turn Sunday smiles into 5★ buzz & new bookings.",
  expiry_days: 30,
  min_stars: 4,
  prizes: [
    { label: "50% off a 2-night stay", probability: 0.04 },
    { label: "Free late checkout", probability: 0.15 },
    { label: "Complimentary welcome drink next visit", probability: 0.25 },
    { label: "Discount on local tour booking", probability: 0.2 },
    { label: "Free parking pass for your next stay", probability: 0.2 },
    { label: "Local snack gift pack", probability: 0.16 }
  ],
  disclaimer: `Everyone wins. 🎉

All prizes must be redeemed within 30 days of submitting your review. One reward per room per visit. Subject to availability. No cash alternatives. Show your reward screen at reception to claim.`
};

export default function WeekendFunWheelPage() {
  const navigate = useNavigate();
  const template = templateConfig;

  return (
    <>
      <PublicNavBar />

      <div className="max-w-3xl mx-auto p-10 bg-white shadow-md rounded-xl mt-8">
        <h1 className="text-3xl font-bold text-sky-600 mb-2">{template.name}</h1>
        <p className="text-gray-600 mb-6">{template.description}</p>

        <img
          src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80"
          alt="Guests enjoying a weekend stay"
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

        <div className="mt-6 p-4 bg-sky-50 border border-sky-200 rounded-md text-sm text-gray-700 whitespace-pre-line">
          <strong className="block mb-1 text-sky-700">Disclaimer:</strong>
          {template.disclaimer}
        </div>

        <div className="mt-8">
          <button
            className="inline-flex items-center px-6 py-3 bg-sky-600 text-white rounded-lg font-semibold hover:bg-sky-700 transition"
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
