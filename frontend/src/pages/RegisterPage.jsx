import React, { useState } from "react";
import Navbar from "../components/Navbar";
import handleRegisterUser from "../api/handleRegisterUser";
import { useNavigate } from "react-router";
import { Eye, EyeOff } from "lucide-react";
const RegisterPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    await handleRegisterUser({
      email,
      password,
      username,
      setLoading,
      navigate,
    });
    setEmail("");
    setUsername("");
    setPassword("");
    setConfirmPassword("");
  };
  return (
    <div className="min-h-screen bg-base-200">
      <Navbar link="login" linkName="Login" />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-xl mx-auto">
          <form onSubmit={(e) => handleRegister(e)}>
            <fieldset className="fieldset bg-base-300/50 border-base-300 rounded-box border p-4">
              <h1 className="fieldset-legend  text-2xl justify-center">
                Register to Thinkboard
              </h1>
              <div className="form-control m-4 ">
                <label className="floating-label min-w-fit ml-2">
                  <span className="label-text">Email</span>
                </label>
                <input
                  type="text"
                  placeholder="john@email.com"
                  className="input w-lg placeholder:pl-2 "
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="form-control m-4 ">
                <label className="floating-label min-w-fit ml-2">
                  <span className="label-text">Username</span>
                </label>
                <input
                  type="text"
                  placeholder="johndoe"
                  className="input w-lg placeholder:pl-2 "
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div className="form-control m-4 ">
                <label className="floating-label min-w-fit ml-2">
                  <span className="label-text">Password</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="********"
                    className="input w-full pr-10 placeholder:pl-2"
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
              <div className="form-control m-4 ">
                <label className="floating-label min-w-fit ml-2">
                  <span className="label-text">Confirm Password</span>
                </label>

                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="********"
                    className="input w-lg placeholder:pl-2 "
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                    tabIndex={-1}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="size-5" />
                    ) : (
                      <Eye className="size-5" />
                    )}
                  </button>
                </div>
              </div>
              <div className="card-actions justify-center">
                <button
                  className="btn btn-primary"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? "Registering..." : "Register"}
                </button>
              </div>
            </fieldset>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
