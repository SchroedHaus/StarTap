// UserProfile.jsx
import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { userAuth } from "../context/Authcontext";
import Button from "./Button";

const UserProfile = () => {
  const { session } = userAuth();
  const [profile, setProfile] = useState({
    email_subject: "",
    message: "",
    review_link: "",
    logo_url: "",
  });
  const [originalLogoUrl, setOriginalLogoUrl] = useState("");
  const [newLogoPath, setNewLogoPath] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isDirty, setIsDirty] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");


  useEffect(() => {
    if (session) {
      fetchProfile();
    }
  }, [session]);

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (isDirty) {
        event.preventDefault();
        event.returnValue = ""; // Required for Chrome
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [isDirty]);





  const fetchProfile = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", session.user.id)
      .single();

    if (error) {
      setError("Update Your Profile");
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
      setSuccessMessage("");
    } else {
      setError("");
      setOriginalLogoUrl(profile.logo_url || "");
      setNewLogoPath("");
      setSuccessMessage("Profile updated successfully");
      setTimeout(() => {
        setSuccessMessage("");
      }, 3000); // hides after 3 seconds
    }
    setLoading(false);
    setIsDirty(false);
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
    setIsDirty(true);
  };

  const handleRemoveLogo = () => {
    // Just clear from UI, but keep the actual deletion for Save
    setProfile((prev) => ({
      ...prev,
      logo_url: "",
    }));
    setIsDirty(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prevProfile) => ({
      ...prevProfile,
      [name]: value,
    }));
    setIsDirty(true);
  };

  const handleDeleteAccount = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (error || !user) {
      alert("User not authenticated");
      return;
    }

    const {
      data: { session },
    } = await supabase.auth.getSession();

    const accessToken = session?.access_token;

    const response = await fetch(
      "https://yguhpjjcpkwrwuxwawct.supabase.co/functions/v1/delete-user",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ user_id: user.id }),
      }
    );

    const result = await response.json();

    if (response.ok) {
      await supabase.auth.signOut();
      alert("Account deleted successfully.");
    } else {
      alert("Error deleting account: " + result.error);
    }
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
              {profile.logo_url ? <p>Change Logo</p> : <p>Upload Logo</p>}
            </label>
            <input
              id="logo-upload"
              type="file"
              accept="image/*"
              onChange={handleLogoUpload}
              className="hidden"
            />

            {profile.logo_url && (
              <a
                type="button"
                onClick={handleRemoveLogo}
                className="text-[14px] cursor-pointer px-4 py-2 text-center underline"
              >
                Remove Logo
              </a>
            )}
          </div>
        </div>
        <div className="mt-6">
          <label>
            Email subject line:
            <input
              type="text"
              name="email_subject"
              value={profile.email_subject}
              placeholder="Please leave me a review"
              onChange={handleChange}
              className="border w-full p-2 rounded-sm"
            ></input>
          </label>
        </div>
        <div className="mt-6">
          <label>
            Default Message:
            <textarea
              name="message"
              value={profile.message}
              onChange={handleChange}
              className="border w-full h-80 p-2 rounded-sm"
              placeholder={`Thank you for your business.\n\nIt was a pleasure working with you.\n\nPlease leave us a review:\nhttps://yourgooglebusinessprofile.com\n\nThank You,\nYour Name
                `}
            ></textarea>
          </label>
        </div>

        <div className="mt-6">
          <label>
            Review Link for QR Code:
            <input
              type="url"
              name="review_link"
              value={profile.review_link}
              onChange={handleChange}
              className="w-full border rounded-sm p-2"
              placeholder="https://yourgooglebusinessprofile.com"
            />
          </label>
        </div>
        <Button
          type="submit"
          disabled={loading}
          className="mt-6 h-[59px] w-full bg-[#c0c0c0] dark:text-black"
        >
          {loading ? "Loading..." : "SAVE CHANGES"}
        </Button>
        {successMessage && (
          <p className="text-green-600 mt-2">{successMessage}</p>
        )}
      </form>
      <a
        href="#"
        onClick={handleDeleteAccount}
        className="text-red-600 mt-6 cursor-pointer text-center underline"
      >
        Delete Account
      </a>
    </div>
  );
};

export default UserProfile;
