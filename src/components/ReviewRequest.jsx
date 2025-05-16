import React, { useEffect, useState } from "react";
import { userAuth } from "../context/Authcontext";
import { supabase } from "../supabaseClient";

const ReviewRequest = () => {
  const { session } = userAuth();
  const [defaultMessage, setDefaultMessage] = useState("");
  const [logo, setLogo] = useState("");
  const [reviewLink, setReviewLink] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      if (!session) return;

      const { data, error } = await supabase
        .from("profiles")
        .select("message, logo_url, review_link")
        .eq("id", session.user.id)
        .single();

      if (error) {
        console.error("Error fetching message: ", error.message);
      } else {
        setDefaultMessage(data.message || "");
        setLogo(data.logo_url);
        setReviewLink(data.review_link);
      }
    };

    fetchProfile();
  }, [session]);

  const reviewText = `${defaultMessage ? defaultMessage + "\n" : ""}Leave us a review: ${reviewLink}`;

  const sendSMS = () => {
    window.location.href = `sms:?&body=${encodeURIComponent(reviewText)}`;
  };

  const sendWhatsApp = () => {
    window.location.href = `https://wa.me/?text=${encodeURIComponent(
      reviewText
    )}`;
  };

  const sendEmail = () => {
    const emailSubject = "Please leave a review";
    window.location.href = `mailto:?subject=${encodeURIComponent(
      emailSubject
    )}&body=${encodeURIComponent(reviewText)}`;
  };

  return (
    <div className="flex flex-col items-center w-full max-w-[360px]">
      <img className="max-w-[300px] max-h-[200px] object-cover pt-6 pb-6" src={logo}/>
      <h2>Request a Google Business Profile Review</h2>
      <button className="mt-6 w-full h-[59px]" onClick={sendSMS}>
        SEND BY TEXT
      </button>
      <button
        className="mt-6 w-full h-[59px]"
        onClick={sendWhatsApp}
      >
        SEND BY WHATSAPP
      </button>
      <button className="mt-6 w-full h-[59px]" onClick={sendEmail}>
        SEND BY EMAIL
      </button>
    </div>
  );
};

export default ReviewRequest;
