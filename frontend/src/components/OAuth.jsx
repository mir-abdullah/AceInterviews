import React from "react";
// import { app } from "../firebase";
// import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
// import { signInSuccess } from "../redux/user/userSlice";

import { useNavigate } from "react-router-dom";
// import { useDispatch } from "react-redux";

// Hey lover boy idr ap ne auth Implement kar na ha google ke liye using the node library Redux bhi shyd apko khud karna pare

const OAuth = () => {
  //   const navigate = useNavigate();
  //   const dispatch = useDispatch();
  //   const handleGoogleClick = async () => {
  //     try {
  //       const provider = new GoogleAuthProvider();
  //       const auth = getAuth(app);
  //       const result = await signInWithPopup(auth, provider);

  //       const res = await fetch("/backend/auth/google", {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify({
  //           name: result.user.displayName,
  //           email: result.user.email,
  //           photo: result.user.photoURL,
  //         }),
  //       });

  //       const data = await res.json();
  //       dispatch(signInSuccess(data));
  //       navigate("/dashboard");
  //     } catch (error) {
  //       console.log("Could not Connect through Google", error);
  //     }
  //   };

  return (
    <div>
      <button
        // onClick={handleGoogleClick}
        className="flex items-center justify-center py-2 px-4 md:px-20 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-blue-600 hover:to-red-600 focus:ring-2 focus:ring-offset-2 focus:ring-blue-300 focus:ring-offset-gray-900 text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none rounded-lg"
      >
        <svg
          viewBox="0 0 24 24"
          height="25"
          width="25"
          xmlns="http://www.w3.org/2000/svg"
          fill="none" // Added to handle the SVG fill uniformly with CSS
          className="text-current" // Ensures the SVG inherits the current text color
        >
          <path
            d="M12,5c1.6167603,0,3.1012573,0.5535278,4.2863159,1.4740601l3.637146-3.4699707 C17.8087769,1.1399536,15.0406494,0,12,0C7.392395,0,3.3966675,2.5999146,1.3858032,6.4098511l4.0444336,3.1929321 C6.4099731,6.9193726,8.977478,5,12,5z"
            fill="#F44336"
          ></path>
          <path
            d="M23.8960571,13.5018311C23.9585571,13.0101929,24,12.508667,24,12 c0-0.8578491-0.093689-1.6931763-0.2647705-2.5H12v5h6.4862061c-0.5247192,1.3637695-1.4589844,2.5177612-2.6481934,3.319458 l4.0594482,3.204834C22.0493774,19.135437,23.5219727,16.4903564,23.8960571,13.5018311z"
            fill="#2196F3"
          ></path>
          <path
            d="M5,12c0-0.8434448,0.1568604-1.6483765,0.4302368-2.3972168L1.3858032,6.4098511 C0.5043335,8.0800171,0,9.9801636,0,12c0,1.9972534,0.4950562,3.8763428,1.3582153,5.532959l4.0495605-3.1970215 C5.1484375,13.6044312,5,12.8204346,5,12z"
            fill="#FFC107"
          ></path>
          <path
            d="M12,19c-3.0455322,0-5.6295776-1.9484863-6.5922241-4.6640625L1.3582153,17.532959 C3.3592529,21.3734741,7.369812,24,12,24c3.027771,0,5.7887573-1.1248169,7.8974609-2.975708l-4.0594482-3.204834 C14.7412109,18.5588989,13.4284058,19,12,19z"
            fill="#00B060"
          ></path>
        </svg>
        <span className="ml-4 md:ml-8">Sign in with Google</span>
      </button>
    </div>
  );
};
export default OAuth;
