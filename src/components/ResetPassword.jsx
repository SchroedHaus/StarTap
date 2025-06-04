import { useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../supabaseClient";

const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  async function handlePasswordReset(e) {
    e.preventDefault();
    setError("");

    if (!email) {
      setError("Please enter your email address.");
      return;
    }

    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/update-password`,
    });

    if (error) {
      setError(error.message);
    } else {
      setEmail("");
      alert("Check your email for the password reset link");
    }
  }

  return (
    <div className="flex flex-col items-center max-w-80 pb-20">
      <img className="size-40" src="/Star Tap Logo.png" alt="" />
      <form onSubmit={handlePasswordReset} className="max-w-md m-auto pt-5">
        <h2 className="font-bold pb-2">Reset Password</h2>
        <p>Enter the email address for your account.</p>
        <div>
          <input
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            placeholder="Email"
            className="p-3 mt-6 w-full bg-blue-100"
            type="email"
          />
          <button type="submit" className="mt-6 w-full h-[59px] bg-[#c0c0c0]">
            Submit
          </button>
          {error && <p className="text-red-600 text-center pt-4">{error}</p>}
          <p className="pt-4">
            Want to create a new account?{" "}
            <Link to="/signup" className="underline">
              Sign Up
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default ResetPassword;
