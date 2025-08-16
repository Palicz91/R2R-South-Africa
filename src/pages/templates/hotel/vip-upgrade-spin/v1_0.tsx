import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import PublicNavBar from "../../../../components/PublicNavBar";

export const templateConfig = {
  name: "VIP Upgrade Spin",
  slug: "vip-upgrade-spin",
  vertical: "hospitality",
  version: "v1.0",
  description: "Say thanks to repeat guests → get fresh reviews that rank.",
  expiry_days: 60,
  min_stars: 4,
  prizes: [
    { label: "Free room upgrade", probability: 0.05 },
    { label: "Spa voucher for two", probability: 0.15 },
    { label: "Complimentary welcome drink", probability: 0.2 },
    { label: "Free breakfast next stay", probability: 0.2 },
    { label: "Late checkout", probability: 0.2 },
    { label: "10% off your next booking", probability: 0.2 }
  ],
  disclaimer: `Prizes are valid for 60 days after your review. One reward per room per stay. Must be claimed in person and shown at check-in. Subject to availability. No cash value or transfer.`
};

export default function VIPUpgradeSpinPage() {
  const navigate = useNavigate();
  const template = templateConfig;

  return (
    <>
      <PublicNavBar />

      <div className="max-w-3xl mx-auto p-10 bg-white shadow-md rounded-xl mt-8">
        <h1 className="text-3xl font-bold text-emerald-700 mb-2">{template.name}</h1>
        <p className="text-gray-600 mb-6">{template.description}</p>

        <img
          src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80"
          alt="Modern hotel room interior"
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

        <div className="mt-6 p-4 bg-emerald-50 border border-emerald-200 rounded-md text-sm text-gray-700 whitespace-pre-line">
          <strong className="block mb-1 text-emerald-700">Disclaimer:</strong>
          {template.disclaimer}
        </div>

        <div className="mt-8">
          <button
            className="inline-flex items-center px-6 py-3 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition"
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
