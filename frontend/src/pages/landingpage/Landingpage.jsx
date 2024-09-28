import React from "react";
import Navbar from "./Navbar";
import Home from "./Home";
import About from "./About";
import Product from "./Product";
import Blog from "./Blog";
import Newsletter from "./Newsletter";
import Footer from "./Footer";
import FAQ from "./FAQ";
import Services from "./Services";
export default function Landingpage() {
  return (
    <div>
      <Navbar />
      <Home />
      <About />
      <Product />
      <Blog />
      <Services />
      <Newsletter />
      <FAQ />
      <Footer />
    </div>
  );
}
