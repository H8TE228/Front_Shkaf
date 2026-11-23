import type { components, operations } from "@/api/schema";

export type ICoordinates = {
  longitude: number;
  latitude: number;
};

export type TLocationData = {
  longitude: number;
  latitude: number;
  city: string;
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

export type TBookmarkItem = TItem & {
  latitude: number | null;
  longitude: number | null;
  distance: number | null;
};

export type TBookmarkExchangePoint = TExchangePoint & {
  distance: number | null;
};

export type TBookmark = {
  id: number;
  created_at: string;
  item: TBookmarkItem | null;
  point: TBookmarkExchangePoint | null;
};

export type TBookmarkType = "item" | "point";

export type TBookmarksQueryParams = {
  type?: TBookmarkType;
};

export type TConversationItem = {
  id: number;
  title: string;
  status: components["schemas"]["ItemStatusEnum"];
  cover: string;
};

export type TConversationCompanion = {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  avatar: string;
};

export type TConversationMessage = {
  id: number;
  conversation_id: number;
  sender_id: number;
  body: string;
  read_at: string;
  created_at: string;
};

export type TConversation = {
  id: number;
  item: TConversationItem;
  owner_id: number;
  requester_id: number;
  companion: TConversationCompanion;
  last_message: TConversationMessage | null;
  unread_count: number;
  created_at: string;
};

export type TConversationCreateRequest = {
  item_id: string;
};

export type TConversationMessageCreateRequest = {
  id: string;
  body: string;
};

export type TConversationReadResponse = {
  marked_read: number;
};
