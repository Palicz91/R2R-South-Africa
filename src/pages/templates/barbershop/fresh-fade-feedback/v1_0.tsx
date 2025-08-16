import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
// Removed unused useSession import
import PublicNavBar from "../../../../components/PublicNavBar";

export const templateConfig = {
  name: "Fresh Fade Feedback",
  slug: "fresh-fade-feedback",
  vertical: "barbershop",
  version: "v1.0",
  description: "Grab those weekday lunch-hour cuts and get them back in the chair within two weeks.",
  expiry_days: 14,
  min_stars: 4,
  prizes: [
    { label: "Free premium skin-fade cut", probability: 0.05 },
    { label: "Free hair styling product", probability: 0.25 },
    { label: "10% off your next cut", probability: 0.4 },
    { label: "Free neck trim or beard touch-up", probability: 0.3 }
  ],
  disclaimer: `Prizes must be redeemed in person within 14 days of your review. One prize per client per visit. Rewards are subject to availability and may be swapped with equivalent alternatives. Not redeemable for cash. Show your prize screen during checkout to claim.`
};

export default function FreshFadeFeedbackPage() {
  // Removed unused session variable
  const navigate = useNavigate();
  const template = templateConfig;

  return (
    <>
      <PublicNavBar />

      <div className="max-w-3xl mx-auto p-10 bg-white shadow-md rounded-xl mt-8">
        <h1 className="text-3xl font-bold text-blue-600 mb-2">{template.name}</h1>
        <p className="text-gray-600 mb-6">{template.description}</p>

        <img
          src="https://images.unsplash.com/photo-1503951914875-452162b0f3f1?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Modern barbershop interior"
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

        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-md text-sm text-gray-700 whitespace-pre-line">
          <strong className="block mb-1 text-blue-700">Disclaimer:</strong>
          {template.disclaimer}
        </div>

        <div className="mt-8">
          <button
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
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
