import React from "react";
import { Outlet } from "react-router-dom";
import "./style.scss";
import ButtonList from "./ButtonList";
import TaskList from "@/components/TellerTask";

function RootLayout() {
  return (
    <div className="root-layout">
      <div className="root-content">
        <aside className="sidebar">
          <div className="logo" />
          <ButtonList />
        </aside>
        <main className="main-content">
          <Outlet />
        </main>
      </div>
      <footer className="footer">
        {/* 푸터 내용 */}
        COPYRIGHT ⓒ 2024 HANAVIEW. ALL RIGHTS RESERVED.
      </footer>
    </div>
  );
}

export default RootLayout;
