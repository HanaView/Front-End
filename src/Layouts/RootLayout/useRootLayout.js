import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAtom } from "jotai";
import { selectedSideButtonAtom } from "@/stores";
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

  // URL 기준으로 버튼 상태 변화
  useEffect(() => {
    if (location.pathname.includes("/consulting")) {
      setSelectedSideButton(SideButtonTypes.CONSULTING);
    } else if (location.pathname.includes("/product")) {
      setSelectedSideButton(SideButtonTypes.PRODUCT);
    } else if (location.pathname.includes("/assets")) {
      setSelectedSideButton(SideButtonTypes.ASSETS);
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
