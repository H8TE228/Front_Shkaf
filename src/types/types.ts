import type { components } from "@/api/schema";

export type TUser = components["schemas"]["User"];
export type TLoginRequest = components["schemas"]["CustomTokenObtainPair"];
export type TRegisterRequest = components["schemas"]["Register"];
export type TChangePasswordRequest = components["schemas"]["ChangePassword"];

export type TItem = components["schemas"]["Item"];
export type TItemPhoto = components["schemas"]["ItemPhoto"];
export type TItemType = components["schemas"]["ItemType"];
