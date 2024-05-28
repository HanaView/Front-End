import React from "react";
import "../RootLayout/style.scss";
import { Outlet } from "react-router-dom";

const Footer = () => {
  return (
    <div className="root-layout">
      <main className="main-content">
        <Outlet />
      </main>
      <footer className="footer">
        {/* 푸터 내용 */}
        COPYRIGHT ⓒ 2024 HANAVIEW. ALL RIGHTS RESERVED.
      </footer>
    </div>
  );
};

export default Footer;
