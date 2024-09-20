/* eslint-disable no-unused-vars */
import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Provider } from "react-redux"; 
import { GoogleOAuthProvider } from "@react-oauth/google";
import { ToastContainer } from 'react-toastify'; // Import ToastContainer
import 'react-toastify/dist/ReactToastify.css'; // Import the CSS for Toastify
import store from './redux/store/store.js';
import App from "./App.jsx";
import "./index.css";
import Landingpage from './pages/landingpage/Landingpage.jsx';
import SignupPage from "./pages/signup/SignupPage.jsx";
import LoginPage from "./pages/login/LoginPage.jsx";
import RootLayout from "./RootLayout.jsx";
import Overview from "./pages/dashboard/overview/Overview.jsx";
import Behavioral from "./pages/interviews/Behavioral.jsx";
import Technical from "./pages/interviews/Technical.jsx";
import TechInterviewPage from "./pages/interviews/TechInterviewPage.jsx";
import Feedback from "./pages/feedback/Feedback.jsx";
import Quizes from './pages/quiz/Quizes.jsx';
import QuizPage from "./pages/quiz/QuizPage.jsx";
import Profile from "./pages/profile/Profile.jsx";
import InstructionsPage from "./pages/interviews/InstructionsPage.jsx";
import RootLayoutAdmin from "./RootLayoutAdmin.jsx";
import OverviewAdmin from "./pages/admin/OverviewAdmin.jsx"
import BehavioralAdmin from "./pages/admin/BehaviouralAdmin.jsx"
import TechnicalAdmin from "./pages/admin/TechnicalAdmin.jsx"
import AddTechScenario from "./pages/admin/AddTechScenario.jsx";
import ReviewFeedback from "./pages/admin/ReviewFeedback.jsx";
import ProfileAdmin from "./pages/admin/ProfileAdmin.jsx";
import AdminLogin from "./pages/admin/AdminLogin.jsx";


const router = createBrowserRouter([
  {
    path: "/",
    element: <Landingpage />,
  },
  {
    path: "/signup",
    element: <SignupPage />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path:"/admin/login",
    element: <AdminLogin/>

  },
  {
    path: "/admin",
    element: <RootLayoutAdmin />,
    children: [
      { path: "overview", element: <OverviewAdmin /> },
      { path: "behavioraladmin", element: <BehavioralAdmin /> },
      { path: "technicaladmin", element: <TechnicalAdmin /> },
      { path: "techscenario", element: <AddTechScenario /> },
      { path: "reviewfeedback", element: <ReviewFeedback /> },
      { path: "profileadmin", element: <ProfileAdmin /> },
      // { path: "quizzes", element: <Quizzes /> },
      // { path: "feedback", element: <FeedbackAdmin /> },
    ],
  },
 
  {
    path: "dashboard",
    element: <RootLayout />,
    children: [
      {
        path: "overview",
        element: <Overview />,
      },
      {
        path: "behavioral",
        element: <Behavioral />,
      },
      {
        path: "technical",
        element: <Technical />,
      },
      {
        path:"instructions/:interviewId",
        element:<InstructionsPage/>
      },
      {
        path: "techinterviewpage/:interviewId",
        element: <TechInterviewPage />,
      },
      {
        path: "feedback",
        element: <Feedback />,
      },
      {
        path: "quizes",
        element: <Quizes />,
      },
      {
        path: "/dashboard/quiz/:quizTopicId",
        element: <QuizPage />,
      },
      {
        path: "/dashboard/profile",
        element: <Profile />, 
      },
         
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <GoogleOAuthProvider clientId="266863559400-es7p8gjuvrde2osfh4rho8bc4re5v4rb.apps.googleusercontent.com">
      <Provider store={store}> 
        <RouterProvider router={router} />
        <ToastContainer
        theme="colored"
        autoClose={3000} 
        /> {/* Add ToastContainer here */}
      </Provider>
    </GoogleOAuthProvider>
  </StrictMode>
);
