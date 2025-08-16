import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import PublicNavBar from "../../../../components/PublicNavBar";

export const templateConfig = {
  name: "Fresh Glow Spin",
  slug: "fresh-glow-spin",
  vertical: "salon",
  version: "v1.0",
  description:
    "Catch the “wow” right after the mirror moment → book their next trim or facial on the spot.",
  expiry_days: 14,
  min_stars: 4,
  prizes: [
    { label: "20% off your next service", probability: 0.3 },
    { label: "Free sample-size product", probability: 0.25 },
    { label: "Complimentary brow shaping", probability: 0.2 },
    { label: "Free upgrade to deluxe treatment", probability: 0.15 },
    { label: "Mini aromatherapy oil gift", probability: 0.1 }
  ],
  disclaimer: `Prizes are valid for 14 days from the review submission date and must be redeemed in person. No cash alternative. Cannot be combined with other discounts or offers. One reward per visit.\n\nPlease show your prize screen at checkout. Screenshots or reused QR codes will not be accepted.`
};

export default function FreshGlowSpinPage() {
  const navigate = useNavigate();
  const template = templateConfig;

  return (
    <>
      <PublicNavBar />

      <div className="max-w-3xl mx-auto p-10 bg-white shadow-md rounded-xl mt-8">
        <h1 className="text-3xl font-bold text-pink-600 mb-2">{template.name}</h1>
        <p className="text-gray-600 mb-6">{template.description}</p>

        <img
          src="https://images.unsplash.com/photo-1556760544-74068565f05c?q=80&w=2929&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Salon experience"
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

        <div className="mt-6 p-4 bg-pink-50 border border-pink-200 rounded-md text-sm text-gray-700 whitespace-pre-line">
          <strong className="block mb-1 text-pink-700">Disclaimer:</strong>
          {template.disclaimer}
        </div>

        <div className="mt-8">
          <button
            className="inline-flex items-center px-6 py-3 bg-pink-600 text-white rounded-lg font-semibold hover:bg-pink-700 transition"
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
