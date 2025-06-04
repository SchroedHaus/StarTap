// UpdatePassword.jsx
import { useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";

const UpdatePassword = () => {
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");

  async function handleUpdatePassword(e) {
    e.preventDefault();

    const { data, error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      alert(error.message);
    } else {
      alert("Password updated successfully!");
      navigate("/review-request");
    }
  }

  return (
    <div className="flex flex-col gap-3 w-80">
      <h2>Reset your password</h2>
      <input
        type="password"
        placeholder="New password"
        className="bg-blue-100 p-3"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
      />
      <button
        onClick={handleUpdatePassword}
        className="bg-[#c0c0c0] h-[59px] w-full"
      >
        Update Password
      </button>
    </div>
  );
};

export default UpdatePassword;
