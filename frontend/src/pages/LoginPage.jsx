import React, { useState } from "react";
import Navbar from "../components/Navbar";
import handleLoginUser from "../api/handleLoginUser";
import { useNavigate } from "react-router";
import Loader from "../components/Loader";
const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
        <div className="container mx-auto px-4 py-8 ">
          <div className="max-w-xl mx-auto ">
            <form onSubmit={(e) => handleLogin(e)} className="">
              <fieldset className="fieldset bg-base-300/50 border-base-300 rounded-box border p-4">
                <h1 className="fieldset-legend  text-2xl justify-center">
                  Login to Thinkboard
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
                <div className="card-actions justify-center">
                  <button
                    className="btn btn-primary"
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
