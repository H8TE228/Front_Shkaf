import type { components } from "@/api/schema";

export type TUser = components["schemas"]["User"];
export type TLoginRequest = components["schemas"]["CustomTokenObtainPair"];
export type TRegisterRequest = Omit<
  components["schemas"]["Register"],
  "created_at" | "id"
>;
export type TRegisterResponse = Pick<
  components["schemas"]["User"],
  "id" | "email" | "username" | "created_at"
>;
export type TPatchPassword = components["schemas"]["ChangePassword"];

export type TItem = components["schemas"]["Item"];
export type TItemCreateRequest = Pick<
  components["schemas"]["Item"],
  | "item_type"
  | "title"
  | "description"
  | "condition"
  | "size"
  | "exchange_format"
  | "status"
  | "district"
>;
export type TItemPhoto = components["schemas"]["ItemPhoto"];
export type TItemType = components["schemas"]["ItemType"];
