import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { userAuth } from "../context/Authcontext";
import { Link } from "react-router-dom";

const UserProfile = () => {
  const { session } = userAuth();
  const [profile, setProfile] = useState({
    name: "",
    message: "",
    avatar_url: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (session) {
      fetchProfile();
    }
  }, [session]);

  const fetchProfile = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", session.user.id)
      .single();

    if (error) {
      setError("Error fetching profile: " + error.message);
    } else {
      setProfile(data);
    }
    setLoading(false);
  };

  const updateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase
      .from("profiles")
      .upsert({ id: session.user.id, ...profile });

    if (error) {
      setError("Error updating profile: " + error.message);
    } else {
      setError("");
    }
    setLoading(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prevProfile) => ({
      ...prevProfile,
      [name]: value,
    }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) {
      setError("No file selected");
      return;
    }

    const fileExt = file.name.split(".").pop();
    const fileName = `${session.user.id}.${fileExt}`;
    const filePath = `public/${fileName}`;

    setLoading(true);

    const { error: uploadError } = await supabase.storage
      .from("profile-images")
      .upload(filePath, file);

    if (uploadError) {
      setError("Error uploading image: " + uploadError.message);
      setLoading(false);
      return;
    }

    const {
      data: { publicUrl },
      error: urlError,
    } = supabase.storage.from("profile-images").getPublicUrl(filePath);

    if (urlError) {
      setError("Error getting public URL: " + urlError.message);
      setLoading(false);
      return;
    }

    setProfile((prevProfile) => ({
      ...prevProfile,
      avatar_url: publicUrl,
    }));

    setLoading(false);
  };

  return (
    <div>
      <h2>User Profile</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={updateProfile}>
        <label>
          Name:
          <input
            type="text"
            name="name"
            value={profile.name}
            onChange={handleChange}
          />
        </label>
        <label>
          Default Message:
          <textarea name="message" value={profile.message} onChange={handleChange} />
        </label>
        <label>
          Profile Image:
          <input type="file" onChange={handleImageUpload} />
        </label>
        {profile.avatar_url && (
          <img src={profile.avatar_url} alt="Profile" width="150" />
        )}
        <button type="submit" disabled={loading}>
          {loading ? "Loading..." : "Update Profile"}
        </button>
      </form>
      <button>
        {" "}
        <Link to="/review-request">Send a request</Link>
      </button>
      <button>
        {" "}
        <Link to="/dashboard">Go to dashboard</Link>
      </button>
    </div>
  );
};

export default UserProfile;
