import React from "react";
import { Outlet } from "react-router-dom";
import "./style.scss";
import Button from "@/components/Button";
import useRootLayout from "./useRootLayout";
import classNames from "classnames";
import { SideButtonTypes } from "@/stores/type";
function RootLayout() {
  const { handleNavigation, selectedSideButton } = useRootLayout();

  return (
    <div className="root-layout">
      <div className="root-content">
        <aside className="sidebar">
          <div className="logo" />
          <Button
            className={classNames("side-button", {
              selected: selectedSideButton === SideButtonTypes.CONSULTING
            })}
            color="default"
            shape="none"
            onClick={() => handleNavigation("/consulting")}
          >
            화상연결
          </Button>
          <Button
            className="side-button"
            color="default"
            shape="none"
            onClick={() => console.log("??")}
          >
            상품 연결
          </Button>
          <Button
            className="side-button"
            color="default"
            shape="none"
            onClick={() => console.log("??")}
          >
            마이 자산 연결
          </Button>
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
