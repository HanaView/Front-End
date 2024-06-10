import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAtom } from "jotai";
import { selectedSideButtonAtom, userTypeAtom } from "@/stores";
import { SideButtonTypes } from "@/stores/type";

const useRootLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = (path) => {
    navigate(path);
  };

  const [selectedSideButton, setSelectedSideButton] = useAtom(
    selectedSideButtonAtom
  );
  const [userType, setUserType] = useAtom(userTypeAtom);

  // URL 기준으로 버튼 상태 변화
  useEffect(() => {
    if (location.pathname.includes("/consulting/customer/loading")) {
      setSelectedSideButton(SideButtonTypes.CONSULTING);
      setUserType("USER");
    } else if (location.pathname.includes("/consulting/customer/explaining")) {
      setSelectedSideButton(SideButtonTypes.PRODUCT);
      setUserType("USER");
    } else if (location.pathname.includes("/consulting/customer/mydata")) {
      setSelectedSideButton(SideButtonTypes.ASSETS);
      setUserType("USER");
    } else if (location.pathname.includes("/consulting/teller/connecting")) {
      setSelectedSideButton(SideButtonTypes.CONSULTING);
      setUserType("TELLER");
    } else if (location.pathname.includes("/admin/dailyWorks")) {
      setSelectedSideButton(SideButtonTypes.DAILY_WORKS);
      setUserType("TELLER");
    } else if (location.pathname.includes("/admin/dailyScore")) {
      setSelectedSideButton(SideButtonTypes.DAILY_SCORE);
      setUserType("TELLER");
    } else if (location.pathname.includes("/admin/tellerLog")) {
      setSelectedSideButton(SideButtonTypes.TELLER_LOG);
      setUserType("TELLER");
    } else if (location.pathname.includes("/admin/customerLog")) {
      setSelectedSideButton(SideButtonTypes.CUSTOMER_LOG);
      setUserType("TELLER");
    } else {
      setSelectedSideButton(SideButtonTypes.NONE);
    }
  }, [location.pathname, setSelectedSideButton]);

  return {
    handleNavigation,
    selectedSideButton
  };
};

export default useRootLayout;
