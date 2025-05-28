import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { userAuth } from "../context/Authcontext";
import Button from "./Button";

const UserProfile = () => {
  const { session } = userAuth();
  const [profile, setProfile] = useState({
    name: "",
    message: "",
    review_link: "",
    logo_url: "",
  });
  const [originalLogoUrl, setOriginalLogoUrl] = useState("");
  const [newLogoPath, setNewLogoPath] = useState("");
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
      setOriginalLogoUrl(data.logo_url || "");
    }
    setLoading(false);
  };

  const updateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Remove previous logo from storage if:
    // - It existed before
    // - and it's been removed or replaced
    if (originalLogoUrl && originalLogoUrl !== profile.logo_url) {
      const parts = originalLogoUrl.split("/");
      const oldPath = parts.slice(-2).join("/").split("?")[0];
      await supabase.storage.from("company-logos").remove([oldPath]);
    }

    const { error } = await supabase
      .from("profiles")
      .upsert({ id: session.user.id, ...profile });

    if (error) {
      setError("Error updating profile: " + error.message);
    } else {
      setError("");
      setOriginalLogoUrl(profile.logo_url || "");
      setNewLogoPath("");
    }

    setLoading(false);
  };

  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const fileExt = file.name.split(".").pop();
    const uniqueSuffix = `${Date.now()}`;
    const filePath = `${session.user.id}/company-logo-${uniqueSuffix}.${fileExt}`;

    let { error: uploadError } = await supabase.storage
      .from("company-logos")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: true,
      });

    if (uploadError) {
      setError("Error uploading logo: " + uploadError.message);
      return;
    }

    const { data: publicUrlData } = supabase.storage
      .from("company-logos")
      .getPublicUrl(filePath);

    const logoUrl = `${publicUrlData.publicUrl}?t=${Date.now()}`;

    setProfile((prev) => ({
      ...prev,
      logo_url: logoUrl,
    }));

    setNewLogoPath(filePath);
  };

  const handleRemoveLogo = () => {
    // Just clear from UI, but keep the actual deletion for Save
    setProfile((prev) => ({
      ...prev,
      logo_url: "",
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prevProfile) => ({
      ...prevProfile,
      [name]: value,
    }));
  };

  return (
    <div className="flex flex-col place-content-center items-left max-w-80 pb-20">
      <h2 className="font-bold text-2xl pt-6">User Profile</h2>
      {error && <p className="text-red-600 mt-2">{error}</p>}
      <form
        onSubmit={updateProfile}
        className="flex flex-col place-content-center items-left"
      >
        <div className="mt-6">
          <label>Company Logo:</label>

          <div className="flex flex-col items-center gap-4">
            <img
              src={profile.logo_url || "/logoPlaceholder.png"}
              alt="Company Logo"
              className="w-[300px] h-[200px] object-contain border rounded"
            />

            <label
              htmlFor="logo-upload"
              className="cursor-pointer px-4 py-2 bg-blue-600 text-white text-sm rounded text-center hover:bg-blue-700 transition"
            >
              Upload Logo
            </label>
            {profile.logo_url && (
              <button
                type="button"
                onClick={handleRemoveLogo}
                className="cursor-pointer px-4 py-2 bg-blue-600 text-white text-sm rounded text-center hover:bg-blue-700 transition"
              >
                Remove Logo
              </button>
            )}
          </div>

          <input
            id="logo-upload"
            type="file"
            accept="image/*"
            onChange={handleLogoUpload}
            className="hidden"
          />
        </div>

        <div className="mt-6">
          <label>
            Name:
            <input
              type="text"
              name="name"
              value={profile.name}
              onChange={handleChange}
              className="w-full border rounded-sm p-2"
            />
          </label>
        </div>
        <div className="mt-6">
          <label>
            Default Message:
            <textarea
              name="message"
              value={profile.message}
              onChange={handleChange}
              className="border w-full h-60 p-2 rounded-sm"
            />
          </label>
        </div>

        <div className="mt-6">
          <label>
            Review Link:
            <input
              type="text"
              name="review_link"
              value={profile.review_link}
              onChange={handleChange}
              className="w-full border rounded-sm p-2"
            />
          </label>
        </div>
        <div className="mt-6">
          <label>
            Signature:
            <textarea
              type="text"
              name="signature"
              value={profile.signature}
              onChange={handleChange}
              className="border w-full h-20 p-2 rounded-sm"
            />
          </label>
        </div>
        <Button
          type="submit"
          disabled={loading}
          className="mt-6 h-[59px] w-full"
        >
          {loading ? "Loading..." : "SAVE CHANGES"}
        </Button>
      </form>
    </div>
  );
};

export default UserProfile;
