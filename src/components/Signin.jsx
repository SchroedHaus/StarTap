import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { userAuth } from "../context/Authcontext";

const Signin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { signInUser } = userAuth();
  const navigate = useNavigate();

  const handleSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await signInUser(email, password);

      if (result.success) {
        navigate("/review-request");
      } else {
        setError("Invalid Credentials. Try Signing Up.");
      }
    } catch (error) {
      setError("An error occurred: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center max-w-80 pb-20">
      <img className="size-40" src="/Star Tap Logo.png" alt="" />
      <form onSubmit={handleSignIn} action="" className="max-w-md m-auto pt-5">
        <h2 className="font-bold pb-2">Sign in!</h2>
        <p>
          Want to create an account?
          <Link to="/signup"> Sign up!</Link>
        </p>
        <div>
          <input
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="p-3 mt-6 w-full bg-blue-100"
            type="email"
          />
          <input
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="p-3 mt-6 w-full bg-blue-100"
            type="password"
          />
          <button
            type="submit"
            disabled={loading}
            className="mt-6 w-full h-[59px] bg-[#c0c0c0]"
          >
            Sign in!
          </button>
          {error && <p className="text-red-600 text-center pt-4">{error}</p>}
        </div>
      </form>
    </div>
  );
};

export default Signin;
