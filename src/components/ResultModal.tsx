import { X } from 'lucide-react';

interface ResultModalProps {
  isOpen: boolean;
  prize: string;
  onClose: () => void;
}

export default function ResultModal({ isOpen, prize, onClose }: ResultModalProps) {
  if (!isOpen) return null;

  const isTryAgain = prize === 'Try Again';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full transform transition-all animate-modal-slide-up">
        <div className="relative p-6">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          
          <div className="text-center pt-4">
            <div className="mb-4">
              {isTryAgain ? (
                <span className="text-4xl">😢</span>
              ) : (
                <span className="text-4xl">🎉</span>
              )}
            </div>
            
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              {isTryAgain ? 'Better luck next time!' : 'Congratulations!'}
            </h3>
            
            <p className="text-lg text-gray-600 mb-6">
              {isTryAgain ? 'Give it another spin!' : `You've won: ${prize}`}
            </p>

            <button
              onClick={onClose}
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold
                         hover:bg-blue-700 transform transition-all duration-200
                         hover:scale-105 active:scale-95"
            >
              {isTryAgain ? 'Try Again' : 'Claim Prize'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}