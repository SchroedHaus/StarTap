// ReviewRequest.jsx
import { useEffect, useState } from "react";
import { userAuth } from "../context/Authcontext";
import { supabase } from "../supabaseClient";
import QRCode from "react-qr-code";
import { X } from "lucide-react";
import Button from "./Button";

const ReviewRequest = () => {
  const { session } = userAuth();
  const [defaultMessage, setDefaultMessage] = useState("");
  const [emailSubject, setEmailSubject] = useState("");
  const [logo, setLogo] = useState();
  const [reviewLink, setReviewLink] = useState("");
  const [showQR, setShowQR] = useState(false); // <- New state for overlay

  useEffect(() => {
    const fetchProfile = async () => {
      if (!session) return;

      const { data, error } = await supabase
        .from("profiles")
        .select("message, logo_url, review_link, email_subject")
        .eq("id", session.user.id)
        .single();

      if (error) {
        console.error("Error fetching message: ", error.message);
      } else {
        setDefaultMessage(data.message || "");
        setLogo(data.logo_url);
        setReviewLink(data.review_link);
        setEmailSubject(data.email_subject);
      }
    };

    fetchProfile();
  }, [session]);

  const sendSMS = () => {
    window.location.href = `sms:?&body=${encodeURIComponent(defaultMessage)}`;
  };

  const sendWhatsApp = () => {
    window.location.href = `https://wa.me/?text=${encodeURIComponent(
      defaultMessage
    )}`;
  };

  const sendEmail = () => {
    window.location.href = `mailto:?subject=${encodeURIComponent(
      emailSubject
    )}&body=${encodeURIComponent(defaultMessage)}`;
  };

  return (
    <div className="flex flex-col items-center w-full max-w-[360px] pb-20">
      {logo && (
        <img
          className="max-w-[300px] max-h-[200px] object-cover pt-6 pb-6"
          src={logo}
          alt="Business logo"
        />
      )}
      <h2>Request a Review</h2>
      <Button
        className="mt-6 w-full h-[59px] bg-[#c0c0c0] dark:text-black"
        onClick={sendSMS}
      >
        SEND BY TEXT
      </Button>
      <Button
        className="mt-6 w-full h-[59px] bg-[#c0c0c0] dark:text-black"
        onClick={sendWhatsApp}
      >
        SEND BY WHATSAPP
      </Button>
      <Button
        className="mt-6 w-full h-[59px] bg-[#c0c0c0] dark:text-black"
        onClick={sendEmail}
      >
        SEND BY EMAIL
      </Button>
      <Button
        onClick={() => setShowQR(true)}
        className="mt-6 w-full h-[59px] bg-[#c0c0c0] dark:text-black"
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
            <h3 className="mb-4 text-lg font-semibold pt-2 dark:text-black">
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
