import React, { useEffect, useState } from "react";
import { userAuth } from "../context/Authcontext";
import { supabase } from "../supabaseClient";
import QRCode from "react-qr-code";
import { X } from "lucide-react";
import Button from "./Button";

const ReviewRequest = () => {
  const { session } = userAuth();
  const [defaultMessage, setDefaultMessage] = useState("");
  const [logo, setLogo] = useState();
  const [reviewLink, setReviewLink] = useState("");
  const [signature, setSignature] = useState("");
  const [showQR, setShowQR] = useState(false); // <- New state for overlay

  useEffect(() => {
    const fetchProfile = async () => {
      if (!session) return;

      const { data, error } = await supabase
        .from("profiles")
        .select("message, logo_url, review_link, signature")
        .eq("id", session.user.id)
        .single();

      if (error) {
        console.error("Error fetching message: ", error.message);
      } else {
        setDefaultMessage(data.message || "");
        setLogo(data.logo_url);
        setReviewLink(data.review_link);
        setSignature(data.signature);
      }
    };

    fetchProfile();
  }, [session]);

  const reviewText = `${defaultMessage ? defaultMessage : ""}`;

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
      {logo && (
        <img
          className="max-w-[300px] max-h-[200px] object-cover pt-6 pb-6"
          src={logo}
          alt="Business logo"
        />
      )}
      <h2>Request a Review</h2>
      <Button className="mt-6 w-full h-[59px] bg-[#c0c0c0]" onClick={sendSMS}>
        SEND BY TEXT
      </Button>
      <Button
        className="mt-6 w-full h-[59px] bg-[#c0c0c0]"
        onClick={sendWhatsApp}
      >
        SEND BY WHATSAPP
      </Button>
      <Button className="mt-6 w-full h-[59px] bg-[#c0c0c0]" onClick={sendEmail}>
        SEND BY EMAIL
      </Button>
      <Button
        onClick={() => setShowQR(true)}
        className="mt-6 w-full h-[59px] bg-[#c0c0c0]"
      >
        SCAN QR CODE
      </Button>

      {/* QR Code Overlay */}
      {showQR && (
        <div className="fixed inset-0 bg-black/75 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl flex flex-col items-center relative">
            <button
              className="absolute top-2 right-2 text-black text-lg"
              onClick={() => setShowQR(false)}
            >
              <X size={24} />
            </button>
            <h3 className="mb-4 text-lg font-semibold pt-2">
              Scan to Leave a Review
            </h3>
            {reviewLink && (
              <QRCode
                value={reviewLink}
                style={{ height: "200px", width: "200px" }}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewRequest;
