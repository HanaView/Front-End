import { SideButtonTypes } from "@/stores/type";
import React from "react";
import useRootLayout from "../useRootLayout";
import classNames from "classnames";
import Button from "@/components/Button";
import { useAtom } from "jotai";
import { userTypeAtom } from "@/stores";
function ButtonList() {
  const { handleNavigation, selectedSideButton } = useRootLayout();
  const [userType] = useAtom(userTypeAtom);
  const CustomerButtons = React.memo(() => {
    return (
      <>
        <Button
          className={classNames("side-button", {
            selected: selectedSideButton === SideButtonTypes.CONSULTING
          })}
          color="default"
          shape="none"
          onClick={() => handleNavigation("/consulting/customer/loading")}
        >
          화상연결
        </Button>
        <Button
          className={classNames("side-button", {
            selected: selectedSideButton === SideButtonTypes.PRODUCT
          })}
          color="default"
          shape="none"
          onClick={() => handleNavigation("/consulting/customer/explaining")}
        >
          상품 연결
        </Button>
        <Button
          className="side-button"
          color="default"
          shape="none"
          onClick={() => console.log("마이 자산 연결")}
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
          onClick={() => handleNavigation("/consulting")}
        >
          화상연결(텔러)
        </Button>
        <Button
          className="side-button"
          color="default"
          shape="none"
          onClick={() => console.log("상품 연결")}
        >
          텔러 버튼
        </Button>
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
