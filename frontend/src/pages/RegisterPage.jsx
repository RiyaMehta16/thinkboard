import React, { useState } from "react";
import Navbar from "../components/Navbar";
import handleRegisterUser from "../api/handleRegisterUser";
import { useNavigate } from "react-router";
const RegisterPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
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
    <div>
      <Navbar link="login" linkName="Login" />
      <div className="min-h-screen bg-base-200">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-xl mx-auto">
            <form onSubmit={(e) => handleRegister(e)}>
              <fieldset className="fieldset bg-base-300/50 border-base-300 rounded-box border p-4">
                <legend className="fieldset-legend ml-2 text-xl">
                  Register to Thinkboard
                </legend>
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
                  <input
                    type="password"
                    placeholder="********"
                    className="input w-lg placeholder:pl-2 "
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <div className="form-control m-4 ">
                  <label className="floating-label min-w-fit ml-2">
                    <span className="label-text">Confirm Password</span>
                  </label>
                  <input
                    type="password"
                    placeholder="********"
                    className="input w-lg placeholder:pl-2 "
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
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
    </div>
  );
};

export default RegisterPage;
