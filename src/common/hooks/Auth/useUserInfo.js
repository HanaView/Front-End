import { useAtom } from "jotai";
import {} from "react";
import { removeUserTypeFromStorage, saveUserTypeFromStorage } from ".";
import { userTypeAtom } from "@/stores";
const useUserInfo = () => {
  const [usertType, setUserType] = useAtom(userTypeAtom);

  const updateUserInfo = (newUserInfo) => {
    setUserType(newUserInfo);
    saveUserTypeFromStorage(newUserInfo);
  };

  const clearUserInfo = () => {
    setUserType(null);
    removeUserTypeFromStorage();
  };

  return { usertType, updateUserInfo, clearUserInfo };
};

export default useUserInfo;
