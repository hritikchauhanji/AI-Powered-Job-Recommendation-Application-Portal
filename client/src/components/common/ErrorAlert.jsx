import { AlertCircle, X } from "lucide-react";

export default function ErrorAlert({ message, onClose }) {
  return (
    <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start justify-between">
      <div className="flex items-start space-x-3">
        <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
        <p className="text-red-800">{message}</p>
      </div>
      {onClose && (
        <button onClick={onClose} className="text-red-600 hover:text-red-700">
          <X size={20} />
        </button>
      )}
    </div>
  );
}
