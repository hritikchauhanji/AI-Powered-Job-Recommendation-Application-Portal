import { Briefcase } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-20">
      <div className="container-max py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Briefcase className="h-8 w-8 text-primary-500" />
              <span className="text-xl font-bold text-white">JobPortal AI</span>
            </div>
            <p className="text-sm text-gray-400">
              AI-powered job matching platform
            </p>
          </div>

          <div>
            <h3 className="text-white font-bold mb-4">For Job Seekers</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="text-gray-400 hover:text-primary-500">
                  Browse Jobs
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-primary-500">
                  My Applications
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-primary-500">
                  My Profile
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-bold mb-4">For Recruiters</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="text-gray-400 hover:text-primary-500">
                  Post a Job
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-primary-500">
                  Manage Jobs
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-primary-500">
                  View Candidates
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-bold mb-4">Company</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="text-gray-400 hover:text-primary-500">
                  About
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-primary-500">
                  Contact
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-primary-500">
                  Privacy
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 text-center text-sm">
          <p>&copy; 2025 JobPortal AI. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
