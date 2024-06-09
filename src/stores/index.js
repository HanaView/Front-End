import { atom } from "jotai";
import { SideButtonTypes } from "./type";
import { getUserTypeFromStorage } from "@/common/hooks/Auth";

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
//비번 요청 시 떠야하는 모달
export const passwordRequestlModalAtom = atom(initialModalState);

//카메라
export const capturedImageAtom = atom(null);

//인증
export const userTypeAtom = atom(getUserTypeFromStorage());

// 약관 모달
export const agreementModalAtom = atom(initialModalState);

// 텔러 업무창
export const taskAtom = atom(
  null, // 초기 값
  (get, set, newTaskId) => {
    set(taskAtom, newTaskId);
  }
);

// WebSocket 연결 정보를 저장할 atom
// socketAtom을 쓰기 가능한 Atom으로 설정
export const socketAtom = atom(
  null, // 초기 값
  (get, set, newSocket) => {
    set(socketAtom, newSocket);
  }
);