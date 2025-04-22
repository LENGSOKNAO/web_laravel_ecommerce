import React from "react";
import Nav from "./Nav/Nav";
import Footer from "./Footer/Footer";

const Layout = ({ children }) => {
  return (
    <section>
      <Nav />
      {children}
      <Footer />
    </section>
  );
};

export default Layout;
