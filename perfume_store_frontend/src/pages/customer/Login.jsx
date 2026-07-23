import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Login() {
  const { user, googleLogin } = useAuth();
  const navigate = useNavigate();
  const [clientId, setClientId] = useState("");

  useEffect(() => {
    if (user) navigate("/");
  }, [user, navigate]);

  useEffect(() => {
    fetch("/api/config/google")
      .then((res) => res.json())
      .then((data) => setClientId(data.clientId))
      .catch((err) => console.error("Failed to load Google config:", err));
  }, []);

  useEffect(() => {
    if (!clientId || !window.google) return;

    window.google.accounts.id.initialize({
      client_id: clientId,
      callback: async (response) => {
        try {
          await googleLogin(response.credential);
          navigate("/");
        } catch (err) {
          console.error("Login failed:", err);
        }
      },
    });

    window.google.accounts.id.renderButton(
      document.getElementById("google-signin-btn"),
      { theme: "outline", size: "large", width: "100%" }
    );
  }, [clientId, googleLogin, navigate]);

  return (
    <div className="min-h-screen bg-bg-main flex items-center justify-center py-12">
      <div className="w-full max-w-md mx-4">
        <div className="text-center mb-8">
          <h1 className="font-heading text-4xl mb-2">Welcome Back</h1>
          <p className="text-text-secondary">Sign in to your account</p>
        </div>

        <div className="bg-bg-secondary rounded-2xl p-8">
          <div id="google-signin-btn"></div>
          {!clientId && (
            <p className="text-center text-text-secondary text-sm mt-4">
              Loading Google Sign-In...
            </p>
          )}
        </div>

        <p className="text-center mt-6 text-text-secondary text-sm">
          Don't have an account?{" "}
          <Link to="/register" className="text-primary font-medium hover:text-primary-dark">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}
