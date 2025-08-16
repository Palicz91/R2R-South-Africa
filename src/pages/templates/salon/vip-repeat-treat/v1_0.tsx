import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import PublicNavBar from "../../../../components/PublicNavBar";

export const templateConfig = {
  name: "VIP Repeat Treat",
  slug: "vip-repeat-treat",
  vertical: "salon",
  version: "v1.0",
  description:
    "Show love to loyal clients, upsell add-ons, and spark referrals.",
  expiry_days: 30,
  min_stars: 4,
  prizes: [
    { label: "Free full-size product bundle", probability: 0.05 },
    { label: "20% off next visit", probability: 0.3 },
    { label: "Free brow shaping", probability: 0.25 },
    { label: "10% off any add-on treatment", probability: 0.25 },
    { label: "Free product sample", probability: 0.15 },
  ],
  disclaimer: `Prizes must be redeemed within 30 days of leaving a review. Rewards are non-transferable and subject to availability. One prize per guest per visit.\n\nSome items may be substituted for similar products. Please show your prize screen at checkout. Screenshots or reused QR codes will not be accepted.`
};

export default function VIPRepeatTreatPage() {
  const navigate = useNavigate();
  const template = templateConfig;

  return (
    <>
      <PublicNavBar />

      <div className="max-w-3xl mx-auto p-10 bg-white shadow-md rounded-xl mt-8">
        <h1 className="text-3xl font-bold text-fuchsia-600 mb-2">
          {template.name}
        </h1>
        <p className="text-gray-600 mb-6">{template.description}</p>

        <img
          src="https://images.unsplash.com/photo-1532926381893-7542290edf1d?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Salon loyalty rewards"
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

        <div className="mt-6 p-4 bg-fuchsia-50 border border-fuchsia-200 rounded-md text-sm text-gray-700 whitespace-pre-line">
          <strong className="block mb-1 text-fuchsia-700">Disclaimer:</strong>
          {template.disclaimer}
        </div>

        <div className="mt-8">
          <button
            className="inline-flex items-center px-6 py-3 bg-fuchsia-600 text-white rounded-lg font-semibold hover:bg-fuchsia-700 transition"
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
