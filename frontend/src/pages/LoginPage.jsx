import React, { useState } from "react";
import Navbar from "../components/Navbar";
import handleLoginUser from "../api/handleLoginUser";
import { useNavigate } from "react-router";
import Loader from "../components/Loader";
import { Eye, EyeOff } from "lucide-react";

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    await handleLoginUser({ email, password, setLoading, navigate });
    setEmail("");
    setPassword("");
  };

  return (
    <div className="min-h-screen bg-base-200">
      <Navbar link="register" linkName="Register" />
      {loading ? (
        <Loader />
      ) : (
        <div className="container mx-auto px-8 py-16">
          <div className="w-full max-w-xl sm:max-w-md mx-auto ">
            <form onSubmit={handleLogin} className="w-full">
              <fieldset className="fieldset bg-base-300/50 border-base-300 rounded-box border p-10 max-sm:p-4">
                <h1 className="font-bold text-2xl text-center mb-2">
                  Login to Thinkboard
                </h1>

                {/* Email */}
                <div className="form-control mb-4">
                  <label className="label">
                    <span className="label-text">Email</span>
                  </label>
                  <input
                    type="email"
                    placeholder="john@email.com"
                    className="input input-bordered w-full placeholder:pl-2"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                {/* Password */}
                <div className="form-control mb-4">
                  <label className="label">
                    <span className="label-text">Password</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="********"
                      className="input input-bordered w-full pr-10 placeholder:pl-2"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                      tabIndex={-1}
                    >
                      {showPassword ? (
                        <EyeOff className="size-5" />
                      ) : (
                        <Eye className="size-5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Submit */}
                <div className="card-actions justify-center mt-6">
                  <button
                    className="btn btn-primary w-full"
                    type="submit"
                    disabled={loading}
                  >
                    {loading ? "Logging In..." : "Login"}
                  </button>
                </div>
              </fieldset>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginPage;
