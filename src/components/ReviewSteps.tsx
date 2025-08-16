import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

interface ReviewStepsProps {
  currentStep: 'rating' | 'wheel' | 'claim';
}

export default function ReviewSteps({ currentStep }: ReviewStepsProps) {
  const steps = [
    { key: 'rating', label: 'Rate' },
    { key: 'wheel', label: 'Spin' },
    { key: 'claim', label: 'Claim' }
  ];

  const currentIndex = steps.findIndex(step => step.key === currentStep);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50"
    >
      <div className="bg-white/90 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg border border-gray-200">
        <div className="flex items-center gap-3 text-sm">
          {steps.map((step, index) => (
            <div key={step.key} className="flex items-center gap-3">
              <div
                className={`flex items-center gap-2 ${
                  index === currentIndex
                    ? 'text-blue-600 font-medium'
                    : index < currentIndex
                    ? 'text-green-600'
                    : 'text-gray-400'
                }`}
              >
                <span>{step.label}</span>
              </div>
              {index < steps.length - 1 && (
                <ArrowRight className="w-4 h-4 text-gray-400" />
              )}
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}