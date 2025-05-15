import React, { useEffect, useState } from "react";
import { userAuth } from "../context/Authcontext";
import { supabase } from "../supabaseClient";

const ReviewRequest = () => {
  const { session } = userAuth();
  const [defaultMessage, setDefaultMessage] = useState("");

  const googleReviewLink = "https://g.page/r/CODE/review"; // Replace 'CODE' with your Google Business Profile code

  useEffect(() => {
    const fetchProfile = async () => {
      if (!session) return;

      const { data, error } = await supabase
        .from("profiles")
        .select("message")
        .eq("id", session.user.id)
        .single();

      if (error) {
        console.error("Error fetching message: ", error.message);
      } else {
        setDefaultMessage(data.message || "");
      }
    };

    fetchProfile();
  }, [session]);

  const reviewText = `${defaultMessage ? defaultMessage + " " : ""}Leave us a review: ${googleReviewLink}`;

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
    <div>
      <h2>Request a Google Business Profile Review</h2>
      <button onClick={sendSMS}>Send SMS</button>
      <button onClick={sendWhatsApp}>Send WhatsApp Message</button>
      <button onClick={sendEmail}>Send Email</button>
    </div>
  );
};

export default ReviewRequest;
