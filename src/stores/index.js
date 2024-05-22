import { atom } from "jotai";
import { SideButtonTypes } from "./type";

export const selectedSideButtonAtom = atom(SideButtonTypes.NONE);
