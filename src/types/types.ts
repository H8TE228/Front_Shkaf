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
export type TPaginatedItemList = components["schemas"]["PaginatedItemList"];
export type TPaginatedUserList = components["schemas"]["PaginatedUserList"];
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

export type TBookmarkItem = components["schemas"]["PaginatedBookmarkList"];

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

export type TConversationItem = components["schemas"]["ItemBrief"];
export type TConversationCompanion = components["schemas"]["Participant"];
export type TConversationMessage = components["schemas"]["Message"];
export type TConversation = components["schemas"]["Conversation"];
export type TPaginatedConversationList =
  components["schemas"]["PaginatedConversationList"];

export type TConversationCreateRequest = {
  item_id: string;
};

export type TConversationMessageCreateRequest = {
  id: string;
  body: string;
};

export type TConversationReadResponse = components["schemas"]["MarkRead"];

export type TPatchedUser = Pick<
  components["schemas"]["PatchedUser"],
  | "username"
  | "first_name"
  | "last_name"
  | "phone_number"
  | "city"
  | "district"
  | "avatar"
  | "email"
>;

export type TNotification = components["schemas"]["Notification"];
export type TPaginatedNotificationList =
  components["schemas"]["PaginatedNotificationList"];
export type TNotificationType = components["schemas"]["TypeEnum"];

export type TExchange = components["schemas"]["Exchange"];
export type TPaginatedExchangeList =
  components["schemas"]["PaginatedExchangeList"];
export type TExchangeStatus = components["schemas"]["ExchangeStatusEnum"];

export type TReview = components["schemas"]["Review"];
export type TReviewCreateRequest = {
  exchange_id: number;
  rating: number;
  comment?: string;
};
export type TReviewsQueryParams = {
  author?: number;
  rating?: number;
  target_user?: number;
};

export type TRating = components["schemas"]["Rating"];

export type TSubscription = components["schemas"]["Subscription"];
export type TSubscriptionCreateRequest = {
  item_type?: number | null;
};
