import React from "react";
import { Github, Instagram, Twitter } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-gray-300 py-8 border-t border-gray-700">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-3 text-blue-400">
              SketchStyle AI
            </h3>
            <p className="text-sm">
              Transform your fashion sketches into realistic visualizations
              using our AI-powered design platform.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3 text-blue-400">
              Quick Links
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/" className="hover:text-blue-400 transition">
                  Home
                </a>
              </li>
              <li>
                <a href="/login" className="hover:text-blue-400 transition">
                  Login
                </a>
              </li>
              <li>
                <a href="/register" className="hover:text-blue-400 transition">
                  Register
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3 text-blue-400">
              Contact
            </h3>
            <p className="text-sm">Have questions or feedback? Reach Out:</p>
            <p className="text-sm mt-2">Email: sujalbista123@gmail.com</p>
          </div>
        </div>

        <div className="flex justify-center mt-8 space-x-6">
          <a href="#" className="text-gray-400 hover:text-blue-400 transition">
            <Twitter size={24} />
          </a>
          <a href="#" className="text-gray-400 hover:text-blue-400 transition">
            <Instagram size={24} />
          </a>
          <a href="#" className="text-gray-400 hover:text-blue-400 transition">
            <Github size={24} />
          </a>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-sm">
          <p>
            © {new Date().getFullYear()} SketchStyle AI. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
