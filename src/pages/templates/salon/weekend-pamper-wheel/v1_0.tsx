import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import PublicNavBar from "../../../../components/PublicNavBar";

export const templateConfig = {
  name: "Weekend Pamper Wheel",
  slug: "weekend-pamper-wheel",
  vertical: "salon",
  version: "v1.0",
  description: "Turn Saturday spa vibes into weekday bookings & 5★ love online.",
  expiry_days: 7,
  min_stars: 4,
  prizes: [
    { label: "Free deluxe manicure", probability: 0.08 },
    { label: "15% off your next service", probability: 0.3 },
    { label: "Free travel-size lotion", probability: 0.25 },
    { label: "Free hair mask treatment", probability: 0.2 },
    { label: "5% loyalty bonus credit", probability: 0.17 }
  ],
  disclaimer: `All prizes must be redeemed within 7 days of your review. Only one reward can be claimed per client per visit. Rewards are non-transferable, non-refundable, and hold no cash value. Salon reserves the right to substitute prizes of equal or greater value if needed.\n\nShow your reward screen at checkout. Screenshots or reused codes will not be accepted.`
};

export default function WeekendPamperWheelPage() {
  const navigate = useNavigate();
  const template = templateConfig;

  return (
    <>
      <PublicNavBar />

      <div className="max-w-3xl mx-auto p-10 bg-white shadow-md rounded-xl mt-8">
        <h1 className="text-3xl font-bold text-purple-600 mb-2">{template.name}</h1>
        <p className="text-gray-600 mb-6">{template.description}</p>

        <img
          src="https://images.unsplash.com/photo-1595871151608-bc7abd1caca3?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Weekend spa vibe"
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

        <div className="mt-6 p-4 bg-purple-50 border border-purple-200 rounded-md text-sm text-gray-700 whitespace-pre-line">
          <strong className="block mb-1 text-purple-700">Disclaimer:</strong>
          {template.disclaimer}
        </div>

        <div className="mt-8">
          <button
            className="inline-flex items-center px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition"
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
