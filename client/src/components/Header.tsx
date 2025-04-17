import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Home, LogIn, UserPlus, LogOut, FileImage } from "lucide-react";
import { Button } from "../components/ui/button";

interface HeaderProps {
  isLoggedIn: boolean;
  handleLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ isLoggedIn, handleLogout }) => {
  const navigate = useNavigate();
  return (
    <header className="bg-gray-800 py-4 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-blue-400">
              SketchStyle AI
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {!isLoggedIn ? (
              <>
                <Button
                  onClick={() => navigate("/")}
                  variant="ghost"
                  className="flex items-center text-gray-300 hover:text-blue-400 hover:bg-gray-700/50"
                >
                  <Home className="mr-1" size={18} />
                  <span>Home</span>
                </Button>
                <Button
                  onClick={() => navigate("/login")}
                  variant="ghost"
                  className="flex items-center text-gray-300 hover:text-blue-400 hover:bg-gray-700/50"
                >
                  <LogIn className="mr-1" size={18} />
                  <span>Login</span>
                </Button>
                <Button
                  onClick={() => navigate("/register")}
                  variant="ghost"
                  className="flex items-center text-gray-300 hover:text-blue-400 hover:bg-gray-700/50 transition"
                >
                  <Link
                    to="/register"
                    className="flex items-center text-gray-300 hover:text-blue-400 hover:bg-gray-700/50 transition"
                  >
                    <UserPlus className="mr-1" size={18} />
                    <span>Register</span>
                  </Link>
                </Button>
              </>
            ) : (
              <>
                <Button
                  onClick={() => navigate("/")}
                  variant="ghost"
                  className="flex items-center text-gray-300 hover:text-blue-400 hover:bg-gray-700/50"
                >
                  <Home className="mr-1" size={18} />
                  <span>Home</span>
                </Button>
                <Button
                  onClick={() => navigate("/logs")}
                  variant="ghost"
                  className="flex items-center text-gray-300 hover:text-blue-400 hover:bg-gray-700/50"
                >
                  <FileImage className="mr-1" size={18} />
                  <span>My Logs</span>
                </Button>
                <Button
                  onClick={handleLogout}
                  variant="ghost"
                  className="flex items-center text-gray-300 hover:text-blue-400 hover:bg-gray-700/50"
                >
                  <LogOut className="mr-1" size={18} />
                  <span>Logout</span>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
