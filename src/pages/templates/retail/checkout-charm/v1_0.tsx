import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import PublicNavBar from "../../../../components/PublicNavBar";

export const templateConfig = {
  name: "Checkout Cheer Spin",
  slug: "checkout-cheer-spin",
  vertical: "retail",
  version: "v1.0",
  description: "Ask for a quick review right at the till → tempt them back within two weeks.",
  expiry_days: 14,
  min_stars: 4,
  prizes: [
    { label: "10% store credit", probability: 0.25 },
    { label: "Free accessory (under $10)", probability: 0.25 },
    { label: "Buy 1 Get 1 50% off coupon", probability: 0.2 },
    { label: "Mystery grab bag", probability: 0.15 },
    { label: "Reusable eco-bag", probability: 0.15 }
  ],
  disclaimer: `Prizes must be claimed in person within 14 days of your review. One reward per customer per purchase. All items subject to availability and may be swapped for equal value. No cash alternatives. Prize must be shown in-store to redeem.`
};

export default function CheckoutCheerSpinPage() {
  const navigate = useNavigate();
  const template = templateConfig;

  return (
    <>
      <PublicNavBar />

      <div className="max-w-3xl mx-auto p-10 bg-white shadow-md rounded-xl mt-8">
        <h1 className="text-3xl font-bold text-emerald-600 mb-2">{template.name}</h1>
        <p className="text-gray-600 mb-6">{template.description}</p>

        <img
          src="https://images.unsplash.com/photo-1526745925052-dd824d27b9ab?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Retail checkout"
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
