import { atom } from "jotai";
import { SideButtonTypes } from "./type";

//네비게이션 버튼
export const selectedSideButtonAtom = atom(SideButtonTypes.NONE);

// 모달 초기 상태 정의
export const initialModalState = {
  isOpen: false,
  children: null,
  content: null,
  confirmButtonText: "Confirm",
  onClickConfirm: null
};
//모달
export const globalModalAtom = atom(initialModalState);

//카메라
export const capturedImageAtom =atom(null);