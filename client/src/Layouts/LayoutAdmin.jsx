import React from "react";
import NavAdmin from "./Nav/NavAdmin";
import FooterAdmin from "./Footer/FooterAdmin";

const LayoutAdmin = ({ children }) => {
 

  return (
    <div className="flex w-full">
      <NavAdmin />
      <div className="  w-full">
        <FooterAdmin />
        {children}
      </div>
    </div>
  );
};

export default LayoutAdmin;
