/* eslint-disable no-unused-vars */
import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Provider } from "react-redux"; 
import store from './redux/store/store.js'
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
        path: "techinterviewpage",
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
        path: "/dashboard/quiz/:id",
        element: <QuizPage />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}> 
      <RouterProvider router={router} />
    </Provider>
  </StrictMode>
);
