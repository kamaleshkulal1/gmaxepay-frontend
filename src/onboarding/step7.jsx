import { useRef, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { postProfile } from "../redux/action/onboardingAction";
import { useNotification } from "../context/NotificationContext";

function Step7({ formData, setFormData, onComplete, onRefreshSteps }) {
  const dispatch = useDispatch();
  const { error: notifyError, success: notifySuccess } = useNotification();
  const {
    postProfileLoading,
    postProfileError,
    postProfileSuccess,
    postProfileMessage,
  } = useSelector((state) => state.onboarding);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const [isCameraActive, setIsCameraActive] = useState(false);

  const startCamera = async () => {
    try {
      // Stop any existing stream first
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((t) => t.stop());
      }

      // Try to get front camera first (for profile photos), fallback to any available camera
      let stream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: { ideal: "user" }, // Front camera for profile photos
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
          audio: false,
        });
      } catch (frontCameraError) {
        // Fallback to any available camera
        stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false,
        });
      }

      mediaStreamRef.current = stream;
      setIsCameraActive(true);

      // Ensure video element is ready and connected
      if (videoRef.current) {
        const video = videoRef.current;
        video.srcObject = stream;

        // Wait for video to be ready before playing
        const handleCanPlay = () => {
          video.play().catch((err) => {
            console.error("Error playing video:", err);
          });
        };

        if (video.readyState >= 2) {
          // Video already has data, play immediately
          video.play().catch((err) => {
            console.error("Error playing video:", err);
          });
        } else {
          // Wait for video to be ready
          video.addEventListener("canplay", handleCanPlay, { once: true });
        }
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
      setIsCameraActive(false);
      notifyError("Unable to access camera. Please check permissions.");
    }
  };

  const stopCamera = () => {
    if (mediaStreamRef.current) {
      try {
        mediaStreamRef.current.getTracks().forEach((t) => {
          t.stop();
          t.enabled = false;
        });
        mediaStreamRef.current = null;
      } catch (error) {
        console.error("Error stopping camera:", error);
      }
      setIsCameraActive(false);
    }
  };

  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;
    const width = video.videoWidth;
    const height = video.videoHeight;
    if (!width || !height) return;
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, width, height);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.9);
    stopCamera();
    setFormData((d) => ({ ...d, profilePhotoDataUrl: dataUrl }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (setFormData) {
      setFormData((d) => ({ ...d, [name]: value }));
    }
  };

  const handleSubmit = async () => {
    if (!formData.fatherName || !formData.fatherName.trim()) {
      notifyError("Please enter father name");
      return;
    }

    if (!formData.motherName || !formData.motherName.trim()) {
      notifyError("Please enter mother name");
      return;
    }

    if (!formData.profilePhotoDataUrl) {
      notifyError("Please capture a profile photo");
      return;
    }

    const token = localStorage.getItem("onboardingToken");
    if (!token) {
      notifyError("Onboarding token not found. Please refresh the page.");
      return;
    }

    // Upload the photo if not already uploaded
    const res = await dispatch(
      postProfile(formData.profilePhotoDataUrl, token, {
        fatherName: formData.fatherName?.trim(),
        motherName: formData.motherName?.trim(),
      })
    );

    if (res?.status === "SUCCESS") {
      notifySuccess(res?.message || "Profile posted successfully");
      if (onRefreshSteps) {
        onRefreshSteps();
      }
      setFormData((d) => ({ ...d, completed: true }));
      if (onComplete) {
        onComplete();
      }
    } else {
      notifyError(res?.message || "Failed to post profile");
    }
  };

  // Handle success when profile is posted successfully
  useEffect(() => {
    // Legacy effect removed mapping handled by handleSubmit promise.
  }, []);

  // Effect to ensure video stream is properly connected when camera becomes active
  useEffect(() => {
    if (isCameraActive && mediaStreamRef.current && videoRef.current) {
      const video = videoRef.current;
      const stream = mediaStreamRef.current;

      // Only set if not already set or if different
      if (video.srcObject !== stream) {
        video.srcObject = stream;
      }

      // Handle video ready state - ensure it plays when metadata is loaded
      const handleLoadedMetadata = () => {
        if (video.paused && isCameraActive) {
          video.play().catch((err) => {
            console.error("Error playing video after metadata loaded:", err);
          });
        }
      };

      const handlePlay = () => {
        console.log("Video started playing");
      };

      const handleError = (e) => {
        console.error("Video error:", e);
      };

      video.addEventListener("loadedmetadata", handleLoadedMetadata);
      video.addEventListener("play", handlePlay);
      video.addEventListener("error", handleError);

      // Try to play immediately if video is ready
      if (video.readyState >= 2) {
        // HAVE_CURRENT_DATA
        video.play().catch((err) => {
          console.error("Error playing video:", err);
        });
      }

      return () => {
        video.removeEventListener("loadedmetadata", handleLoadedMetadata);
        video.removeEventListener("play", handlePlay);
        video.removeEventListener("error", handleError);
      };
    }
  }, [isCameraActive]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  return (
    <div className="w-full h-full flex justify-center items-center  p-2 sm:p-3 md:p-4 overflow-hidden">
      <div className="w-full max-w-[98%] sm:max-w-[480px] md:max-w-[520px] lg:max-w-[580px] xl:max-w-[600px] 2xl:max-w-[700px] text-center mx-auto">
        <h3 className="text-base sm:text-lg  font-[Gilroy-Semibold] text-[#1B1717] mb-2">
          Profile
        </h3>
        <p className="text-xs sm:text-sm   font-[Gilroy-Medium] text-[#1B1717]/80 mb-4">
          Profile Picture To Complete Your KYC
        </p>

        {/* Father & Mother Name Inputs */}
        <div className="space-y-2 sm:space-y-3 mb-4 text-left">
          <div>
            <label
              htmlFor="fatherName"
              className="block text-xs sm:text-sm font-[Gilroy-Semibold] text-[#1B1717] mb-1.5"
            >
              Father Name
            </label>
            <div className="relative">
              <img
                src="/img/User.png"
                alt="Father"
                className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 opacity-70 z-10"
              />
              <div className="absolute left-9 md:left-11 top-1/2 -translate-y-1/2 h-4 md:h-5 w-px bg-gray-300" />
              <input
                type="text"
                id="fatherName"
                name="fatherName"
                value={formData?.fatherName || ""}
                onChange={handleInputChange}
                placeholder="Enter Father Name"
                className="w-full h-10 md:h-11 border-[0.5px] font-[Gilroy-Medium] border-[#1B1717]/80 rounded-lg pl-10 md:pl-12 pr-3 text-sm md:text-base outline-none focus:border-[#039155] transition"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="motherName"
              className="block text-xs sm:text-sm font-[Gilroy-Semibold] text-[#1B1717] mb-1.5"
            >
              Mother Name
            </label>
            <div className="relative">
              <img
                src="/img/User.png"
                alt="Mother"
                className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 opacity-70 z-10"
              />
              <div className="absolute left-9 md:left-11 top-1/2 -translate-y-1/2 h-4 md:h-5 w-px bg-gray-300" />
              <input
                type="text"
                id="motherName"
                name="motherName"
                value={formData?.motherName || ""}
                onChange={handleInputChange}
                placeholder="Enter Mother Name"
                className="w-full h-10 md:h-11 border-[0.5px] font-[Gilroy-Medium] border-[#1B1717]/80 rounded-lg pl-10 md:pl-12 pr-3 text-sm md:text-base outline-none focus:border-[#039155] transition"
              />
            </div>
          </div>
        </div>

        {/* Dotted Border Card */}
        <div className="h-[220px] sm:h-[240px] mx-auto mb-4">
          <div className="border-2 border-dashed border-[#1B1717] border-opacity-30 rounded-lg h-full relative overflow-hidden bg-[#FAFAFA]">
            {/* Always render video element but hide/show it based on state */}
            <video
              ref={videoRef}
              className={`w-full h-full object-cover rounded-lg ${isCameraActive ? "block" : "hidden"}`}
              playsInline
              muted
              autoPlay
              style={{
                minHeight: "100%",
                minWidth: "100%",
                backgroundColor: "#000",
              }}
            />

            {/* Show placeholder when no photo and camera not active */}
            {!formData.profilePhotoDataUrl && !isCameraActive && (
              <div
                className="h-full flex flex-col items-center justify-center p-4 cursor-pointer absolute inset-0"
                onClick={startCamera}
              >
                <img
                  src="/img/Camera.png"
                  alt="Camera"
                  className="w-12 h-12 mb-2"
                />
              </div>
            )}

            {/* Show captured image when photo exists and camera not active */}
            {formData.profilePhotoDataUrl && !isCameraActive && (
              <img
                src={formData.profilePhotoDataUrl}
                alt="Profile"
                className="w-full h-full object-cover rounded-lg absolute inset-0"
              />
            )}

            {/* Buttons - Show when camera is active or when photo exists */}
            {(isCameraActive || formData.profilePhotoDataUrl) && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-3 z-10">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (formData.profilePhotoDataUrl) {
                      setFormData((d) => ({ ...d, profilePhotoDataUrl: "" }));
                    }
                    if (isCameraActive) {
                      stopCamera();
                    }
                    startCamera();
                  }}
                  className="bg-[#039155] text-white px-4 py-1.5 rounded-lg text-sm font-[Gilroy-Medium] hover:bg-green-700 transition shadow-md"
                >
                  Retake
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    capturePhoto();
                  }}
                  disabled={!isCameraActive}
                  className={`px-4 py-1.5 rounded-lg text-sm font-[Gilroy-Medium] transition shadow-md ${isCameraActive
                      ? "bg-[#039155] text-white hover:bg-green-700"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                >
                  Capture
                </button>
              </div>
            )}
          </div>
          <canvas ref={canvasRef} className="hidden" />
        </div>

        {/* Image Upload Guidelines */}
        <div className="">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-7 ">
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <div className="w-2 h-2 rounded-full bg-[#039155] mt-2 flex-shrink-0" />
                <span className="text-sm text-[#1B1717]">
                  Capture A Clear Photo
                </span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-2 h-2 rounded-full bg-[#039155] mt-2 flex-shrink-0" />
                <span className="text-sm text-[#1B1717]">
                  Good Lighting Required – Avoid Dark Or Blurry Images.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-2 h-2 rounded-full bg-[#039155] mt-2 flex-shrink-0" />
                <span className="text-sm text-[#1B1717]">
                  Your Aadhaar Photo And Uploaded Profile Picture Must Match.
                </span>
              </li>
            </ul>
          </div>

          {/* Submit Button */}
          <button
            type="button"
            onClick={handleSubmit}
            disabled={
              postProfileLoading ||
              !formData.profilePhotoDataUrl ||
              !formData?.fatherName?.trim() ||
              !formData?.motherName?.trim()
            }
            className={`w-full mt-2
            h-10 md:h-11 lg:h-14
            bg-[#039155]
            text-white
            rounded-lg md:rounded-xl
            font-[Gilroy-Semibold]
            text-sm md:text-base
            transition
            shadow-lg
            flex items-center justify-center
            ${
              postProfileLoading ||
              !formData.profilePhotoDataUrl ||
              !formData?.fatherName?.trim() ||
              !formData?.motherName?.trim()
                ? "bg-gray-400 cursor-not-allowed"
                : "hover:bg-green-700"
            }
          `}
          >
            {postProfileLoading ? "Submitting..." : "Submit"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Step7;
