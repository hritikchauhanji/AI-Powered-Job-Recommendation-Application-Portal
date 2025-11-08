import { Loader } from "lucide-react";

export default function LoadingSpinner({ message = "Loading..." }) {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <Loader className="h-12 w-12 text-primary-600 animate-spin" />
      <p className="mt-4 text-gray-600 font-medium">{message}</p>
    </div>
  );
}
