import type { components, operations } from "@/api/schema";

export type ICoordinates = {
  longitude: number;
  latitude: number;
};

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
export type TItemsQueryParams = operations["items_list"]["parameters"]["query"];
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

export type TExchangePoint = components["schemas"]["ExchangePoint"];
export type TExchangePointCreateRequest = Pick<
  TExchangePoint,
  "address" | "title"
> &
  Partial<
    Pick<
      TExchangePoint,
      | "description"
      | "opening_hours"
      | "phone"
      | "email"
      | "website"
      | "formats"
      | "item_type_ids"
      | "status"
    >
  >;
export type TExchangePointUpdateRequest = Partial<TExchangePointCreateRequest>;
export type TExchangePointsQueryParams =
  operations["exchangePoints_list"]["parameters"]["query"];
