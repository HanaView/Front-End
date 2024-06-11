import { SideButtonTypes } from "@/stores/type";
import React from "react";
import useRootLayout from "../useRootLayout";
import classNames from "classnames";
import Button from "@/components/Button";
import { useAtom } from "jotai";
import { userTypeAtom } from "@/stores";
import TaskList from "@/components/TellerTask";

function ButtonList() {
  const { handleNavigation, selectedSideButton } = useRootLayout();
  const [userType] = useAtom(userTypeAtom);
  const redisKey = localStorage.getItem("key");

  const CustomerButtons = React.memo(() => {
    return (
      <>
        <Button
          className={classNames("side-button", {
            selected: selectedSideButton === SideButtonTypes.CONSULTING
          })}
          color="default"
          shape="none"
          onClick={() =>
            handleNavigation("/consulting/customer/loading?key=" + redisKey)
          }
        >
          화상 상담
        </Button>
        <Button
          className={classNames("side-button", {
            selected: selectedSideButton === SideButtonTypes.PRODUCT
          })}
          color="default"
          shape="none"
          onClick={() =>
            handleNavigation("/consulting/customer/explaining?key=" + redisKey)
          }
        >
          상품 연결
        </Button>
        <Button
          className={classNames("side-button", {
            selected: selectedSideButton === SideButtonTypes.ASSETS
          })}
          color="default"
          shape="none"
          onClick={() =>
            handleNavigation("/consulting/customer/mydata?key=" + redisKey)
          }
        >
          마이 자산 연결
        </Button>
      </>
    );
  });

  const TellerButtons = React.memo(() => {
    return (
      <>
        <Button
          className={classNames("side-button", {
            selected: selectedSideButton === SideButtonTypes.CONSULTING
          })}
          color="default"
          shape="none"
          onClick={() =>
            handleNavigation("/consulting/teller/loading?key=" + redisKey)
          }
        >
          화상 상담(텔러)
        </Button>
        <Button
          className={classNames("side-button", {
            selected: selectedSideButton === SideButtonTypes.DAILY_WORKS
          })}
          color="default"
          shape="none"
          onClick={() => handleNavigation("/admin/dailyWorks")}
        >
          마이 상담 현황
        </Button>
        <Button
          className={classNames("side-button", {
            selected: selectedSideButton === SideButtonTypes.DAILY_SCORE
          })}
          color="default"
          shape="none"
          onClick={() => handleNavigation("/admin/dailyScore")}
        >
          업무 기록 관리
        </Button>
        <Button
          className={classNames("side-button", {
            selected: selectedSideButton === SideButtonTypes.TELLER_LOG
          })}
          color="default"
          shape="none"
          onClick={() => handleNavigation("/admin/tellerLog")}
        >
          텔러 업무 기록 관리
        </Button>
        <Button
          className={classNames("side-button", {
            selected: selectedSideButton === SideButtonTypes.CUSTOMER_LOG
          })}
          color="default"
          shape="none"
          onClick={() => handleNavigation("/admin/customerLog")}
        >
          손님 업무 기록 관리
        </Button>
        {selectedSideButton === SideButtonTypes.CONSULTING && <TaskList />}
      </>
    );
  });

  CustomerButtons.displayName = "UserButton";
  TellerButtons.displayName = "TellerButtons";

  const SideButton = (type) => {
    const BUTTON_TYPE = {
      USER: CustomerButtons,
      TELLER: TellerButtons
    };
    const Component = BUTTON_TYPE[type] || CustomerButtons;
    return <Component />;
  };

  return <>{SideButton(userType)}</>;
}

export default ButtonList;
