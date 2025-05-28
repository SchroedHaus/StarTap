import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { userAuth } from "../context/Authcontext";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState("");

  const { signUpNewUser } = userAuth();
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await signUpNewUser(email, password);

      if (result.success) {
        navigate("/profile");
      }
    } catch (error) {
      setError("an error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <img className="size-60" src="/Star Tap Logo.png" alt="" />
      <form onSubmit={handleSignUp} action="" className="max-w-md m-auto pt-5">
        <h2 className="font-bold pb-2">Sign up today!</h2>
        <p>
          Already have an account?
          <Link to="/signin">Sign in!</Link>
        </p>
        <div>
          <input
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="p-3 mt-6 w-full"
            type="email"
          />
          <input
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="p-3 mt-6 w-full"
            type="password"
          />
          <button type="submit" disabled={loading} className="mt-6 w-full h-[59px]">
            Sign up!
          </button>
          {error && <p className="text-red-600 text-center pt-4">{error}</p>}
        </div>
      </form>
    </div>
  );
};

export default Signup;
