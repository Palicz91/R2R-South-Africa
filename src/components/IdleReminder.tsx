import { Clock } from 'lucide-react';

interface IdleReminderProps {
  onDismiss: () => void;
}

export default function IdleReminder({ onDismiss }: IdleReminderProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl p-6 max-w-md w-full animate-modal-slide-up">
        <div className="text-center">
          <Clock className="w-12 h-12 text-blue-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Did you finish your review?
          </h3>
          <p className="text-gray-600 mb-6">
            Don't forget to come back and spin the wheel to claim your reward!
          </p>
          <button
            onClick={onDismiss}
            className="w-full py-3 px-6 bg-blue-600 text-white rounded-lg font-medium
                     hover:bg-blue-700 transition-colors"
          >
            I'm Ready to Spin!
          </button>
        </div>
      </div>
    </div>
  );
}