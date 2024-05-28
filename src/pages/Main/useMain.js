import useUserInfo from "@/common/hooks/Auth/useUserInfo";
function useMain() {
  const { updateUserInfo } = useUserInfo();
  const onChangeUserType = (type) => {
    updateUserInfo(type);
  };
  return { onChangeUserType };
}
export default useMain;
