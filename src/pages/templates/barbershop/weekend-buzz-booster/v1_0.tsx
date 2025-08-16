import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import PublicNavBar from "../../../../components/PublicNavBar";

export const templateConfig = {
  name: "Weekend Buzz Booster",
  slug: "weekend-buzz-booster",
  vertical: "barbershop",
  version: "v1.0",
  description: "Turn Saturday-Sunday hype into fresh 5★ reviews and mid-week bookings.",
  expiry_days: 7,
  min_stars: 4,
  prizes: [
    { label: "“Sharp All-Year” annual pass", probability: 0.02 },
    { label: "Free hair styling product", probability: 0.18 },
    { label: "15% off your next cut", probability: 0.35 },
    { label: "Free beard trim", probability: 0.45 }
  ],
  disclaimer: `Prizes must be redeemed within 7 days of your review. One prize per client per visit. Rewards are subject to availability and may be substituted. No cash value. Please show your prize screen during checkout. Screenshots are not accepted.`
};

export default function WeekendBuzzBoosterPage() {
  const navigate = useNavigate();
  const template = templateConfig;

  return (
    <>
      <PublicNavBar />

      <div className="max-w-3xl mx-auto p-10 bg-white shadow-md rounded-xl mt-8">
        <h1 className="text-3xl font-bold text-indigo-600 mb-2">{template.name}</h1>
        <p className="text-gray-600 mb-6">{template.description}</p>

        <img
          src="https://images.unsplash.com/photo-1678356164573-9a534fe43958?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Busy barbershop weekend"
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
            className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition"
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
