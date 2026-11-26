import { Fragment, useEffect, useRef, useState, type RefObject } from "react";
import { Link } from "react-router-dom";
import { Camera, Check, ChevronRight, MapPin, Search, Send, X } from "lucide-react";
import { Button } from "../ui/button";
import {
  useAgreeExchange,
  useCancelExchange,
  useConfirmExchange,
  useConversationMessages,
  useConversations,
  useCreateItemExchange,
  useDeclineExchange,
  useExchanges,
  useItemById,
  useItemExchanges,
  useMarkConversationRead,
  useMe,
  useSendMessage,
} from "@/hooks";
import type {
  TConversation,
  TConversationCompanion,
  TConversationMessage,
  TExchange,
  TItem,
} from "@/types";

type ChatListFilter = "all" | "unread" | "transferred";

const filters: [ChatListFilter, string][] = [
  ["all", "Все"],
  ["unread", "Непрочитанные"],
  ["transferred", "Переданы"],
];

const exchangeFormatTitle: Record<TItem["exchange_format"], string> = {
  free: "Бесплатно",
  swap: "Обмен",
  points: "За баллы",
};

const exchangeCreateStarted = new Set<string>();

function dealExchange(conversation: TConversation, exchanges: TExchange[]) {
  const matches = exchanges.filter(
    (exchange) =>
      exchange.giver_id === conversation.owner_id &&
      exchange.receiver_id === conversation.requester_id &&
      exchange.item.id === conversation.item.id,
  );
  return matches.sort(
    (a, b) =>
      new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime(),
  )[0];
}

function isTransferred(conversation: TConversation, exchanges: TExchange[]) {
  return exchanges.some(
    (exchange) =>
      exchange.status === "completed" &&
      exchange.giver_id === conversation.owner_id &&
      exchange.receiver_id === conversation.requester_id &&
      exchange.item.id === conversation.item.id,
  );
}

function companionName(companion: TConversationCompanion) {
  const name = [companion.first_name, companion.last_name]
    .filter(Boolean)
    .join(" ");
  return name || companion.username;
}

function isSameDay(value: string, other: Date) {
  const date = new Date(value);
  return (
    date.getFullYear() === other.getFullYear() &&
    date.getMonth() === other.getMonth() &&
    date.getDate() === other.getDate()
  );
}

function formatTime(value: string) {
  return new Intl.DateTimeFormat("ru", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function formatDay(value: string) {
  const today = new Date();
  if (isSameDay(value, today)) return "Сегодня";
  return new Intl.DateTimeFormat("ru", {
    day: "numeric",
    month: "long",
  }).format(new Date(value));
}

function formatStamp(value: string) {
  if (isSameDay(value, new Date())) return formatTime(value);
  return formatDay(value);
}

export function Chats() {
  const { data: user } = useMe();
  const { data: conversationPage, isLoading, isError } = useConversations({
    refetchInterval: 5000,
  });
  const conversations = conversationPage?.results;
  const { data: completedPage } = useExchanges({
    status: "completed",
    page_size: Math.max(conversationPage?.count ?? 0, 1),
  });
  const completed = completedPage?.results ?? [];
  const [selectedId, setSelectedId] = useState("");
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<ChatListFilter>("all");
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const log = useRef<HTMLDivElement>(null);
  const { mutate: markRead } = useMarkConversationRead();
  const { mutate: sendMessage, isPending: isSending } = useSendMessage();
  const activeId = selectedId || String(conversations?.[0]?.id ?? "");
  const {
    data: messages,
    isLoading: messagesLoading,
    isError: messagesError,
  } = useConversationMessages(activeId, { refetchInterval: 5000 });

  const conversation = conversations?.find(
    (entry) => String(entry.id) === activeId,
  );
  const draft = drafts[activeId] ?? "";
  const needle = query.trim().toLocaleLowerCase("ru");
  const list = (conversations ?? []).filter((entry) => {
    const name = companionName(entry.companion);
    const filterMatch =
      filter === "all" ||
      (filter === "unread" && entry.unread_count > 0) ||
      (filter === "transferred" && isTransferred(entry, completed));
    return (
      filterMatch &&
      `${name} ${entry.item.title}`.toLocaleLowerCase("ru").includes(needle)
    );
  });

  useEffect(() => {
    if (selectedId || !conversations?.[0]) return;
    if (conversations[0].unread_count > 0) {
      markRead(String(conversations[0].id));
    }
  }, [conversations, markRead, selectedId]);

  useEffect(() => {
    if (log.current) log.current.scrollTop = log.current.scrollHeight;
  }, [activeId, messages?.length]);

  function openConversation(id: string) {
    setSelectedId(id);
    const next = conversations?.find((entry) => String(entry.id) === id);
    if (next && next.unread_count > 0) markRead(id);
  }

  function submitMessage() {
    const body = draft.trim();
    if (!conversation || !body) return;
    const id = String(conversation.id);
    sendMessage(
      { id, body },
      {
        onSuccess: () => {
          setDrafts((current) => ({ ...current, [id]: "" }));
        },
      },
    );
  }

  return (
    <div>
      <section className="mx-auto w-full max-w-[1550px] px-6 pt-12 lg:px-0">
        <nav className="text-muted-foreground mb-5 flex items-center gap-2 text-sm [&_svg]:size-4 [&_svg]:shrink-0">
          <Link to="/" className="hover:underline hover:underline-offset-4">
            Главная
          </Link>
          <ChevronRight />
          <Link
            to="/chats"
            className="hover:underline hover:underline-offset-4"
          >
            Чаты
          </Link>
        </nav>
        <h1 className="mb-6 text-[32px] leading-10 font-semibold tracking-tight">
          Чаты
        </h1>
      </section>

      <section className="mx-auto w-full max-w-[1550px] px-6 pb-12 lg:px-0">
        {isLoading && <span>Загрузка...</span>}

        {!isLoading && isError && <span>Ошибка загрузки данных</span>}

        {!isLoading &&
          !isError &&
          (!conversations?.length ? (
            <div className="border-border bg-card rounded-2xl border px-6 py-16 text-center">
              <h2 className="text-lg font-semibold">У вас пока нет чатов</h2>
              <p className="text-muted-foreground mx-auto mt-2 max-w-[46ch]">
                Когда вы напишете о вещи или вам ответят на объявление,
                переписка появится здесь.
              </p>
              <Button
                render={<Link to="/catalog" />}
                nativeButton={false}
                className="mt-4 h-11 rounded-2xl px-5"
              >
                Перейти в каталог
              </Button>
            </div>
          ) : (
            <ChatPanes
              list={list}
              conversations={conversations}
              completed={completed}
              conversation={conversation}
              messages={messages}
              messagesLoading={messagesLoading}
              messagesError={messagesError}
              userId={user?.id}
              selectedId={activeId}
              query={query}
              filter={filter}
              draft={draft}
              isSending={isSending}
              log={log}
              onQuery={setQuery}
              onFilter={setFilter}
              onOpen={openConversation}
              onDraft={(value) =>
                setDrafts((current) => ({ ...current, [activeId]: value }))
              }
              onSubmit={submitMessage}
            />
          ))}
      </section>
    </div>
  );
}

function ChatPanes({
  list,
  conversations,
  completed,
  conversation,
  messages,
  messagesLoading,
  messagesError,
  userId,
  selectedId,
  query,
  filter,
  draft,
  isSending,
  log,
  onQuery,
  onFilter,
  onOpen,
  onDraft,
  onSubmit,
}: {
  list: TConversation[];
  conversations: TConversation[];
  completed: TExchange[];
  conversation?: TConversation;
  messages?: TConversationMessage[];
  messagesLoading: boolean;
  messagesError: boolean;
  userId?: number;
  selectedId: string;
  query: string;
  filter: ChatListFilter;
  draft: string;
  isSending: boolean;
  log: RefObject<HTMLDivElement | null>;
  onQuery: (value: string) => void;
  onFilter: (value: ChatListFilter) => void;
  onOpen: (id: string) => void;
  onDraft: (value: string) => void;
  onSubmit: () => void;
}) {
  const itemId = conversation ? String(conversation.item.id) : "";
  const { data: item, isLoading: itemLoading } = useItemById(itemId);
  const { data: exchangePage, isLoading: exchangesLoading } =
    useItemExchanges(itemId);
  const { mutate: createExchange, isPending: createPending } =
    useCreateItemExchange();
  const { mutate: agreeExchange, isPending: agreePending } =
    useAgreeExchange();
  const { mutate: declineExchange, isPending: declinePending } =
    useDeclineExchange();
  const { mutate: cancelExchange, isPending: cancelPending } =
    useCancelExchange();
  const { mutate: confirmExchange, isPending: confirmPending } =
    useConfirmExchange();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const person = conversation ? companionName(conversation.companion) : "";
  const role =
    userId == null || !conversation
      ? undefined
      : userId === conversation.owner_id
        ? "giver"
        : userId === conversation.requester_id
          ? "receiver"
          : undefined;
  const exchange = conversation
    ? dealExchange(conversation, exchangePage?.results ?? [])
    : undefined;
  const pending =
    createPending ||
    agreePending ||
    declinePending ||
    cancelPending ||
    confirmPending;

  useEffect(() => {
    setConfirmOpen(false);
  }, [conversation?.id]);

  useEffect(() => {
    if (exchange?.status === "completed") setConfirmOpen(false);
  }, [exchange?.status]);

  useEffect(() => {
    if (!conversation || userId == null) return;
    if (userId === conversation.owner_id) return;
    if (itemLoading || exchangesLoading || !exchangePage) return;
    const status = item?.status ?? conversation.item.status;
    if (status && status !== "active") return;
    const exists = exchangePage.results.some(
      (entry) =>
        entry.giver_id === conversation.owner_id &&
        entry.receiver_id === conversation.requester_id &&
        entry.item.id === conversation.item.id,
    );
    if (exists) return;
    const key = String(conversation.id);
    if (exchangeCreateStarted.has(key)) return;
    exchangeCreateStarted.add(key);
    createExchange(String(conversation.item.id));
  }, [
    conversation,
    createExchange,
    exchangePage,
    exchangesLoading,
    item,
    itemLoading,
    userId,
  ]);

  return (
    <div className="grid grid-cols-1 gap-5 lg:h-[clamp(520px,calc(100dvh-280px),720px)] lg:grid-cols-[340px_minmax(0,1fr)]">
      <aside
        aria-label="Чаты"
        className="border-border bg-card flex max-h-[520px] min-h-0 flex-col overflow-hidden rounded-2xl border lg:max-h-none"
      >
        <div className="flex shrink-0 flex-col gap-2.5 px-3.5 pt-3.5 pb-2">
          <div className="border-border bg-card text-muted-foreground focus-within:border-ring focus-within:ring-ring/30 flex h-11 items-center gap-2.5 rounded-2xl border px-3.5 focus-within:ring-3">
            <Search className="size-5 shrink-0" />
            <input
              aria-label="Поиск по имени или вещи"
              placeholder="Имя или название вещи"
              autoComplete="off"
              className="text-foreground placeholder:text-muted-foreground min-w-0 flex-1 bg-transparent text-sm outline-none"
              value={query}
              onChange={(event) => onQuery(event.target.value)}
            />
            {query && (
              <button
                type="button"
                aria-label="Очистить поиск"
                onClick={() => onQuery("")}
                className="cursor-pointer"
              >
                <X className="size-4" />
              </button>
            )}
          </div>
          <div className="flex gap-1" role="group" aria-label="Фильтр чатов">
            {filters.map(([id, label]) => (
              <button
                key={id}
                type="button"
                aria-pressed={filter === id}
                onClick={() => onFilter(id)}
                className={`inline-flex h-[34px] shrink-0 cursor-pointer items-center gap-1.5 rounded-xl px-2.5 text-[13px] font-medium whitespace-nowrap ${
                  filter === id
                    ? "bg-accent text-accent-foreground font-semibold"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                {label}
                <span className="text-[13px]">
                  {
                    conversations.filter((entry) => {
                      if (id === "all") return true;
                      if (id === "unread") return entry.unread_count > 0;
                      return isTransferred(entry, completed);
                    }).length
                  }
                </span>
              </button>
            ))}
          </div>
        </div>
        <ul
          aria-label="Список чатов"
          className="flex min-h-0 flex-1 flex-col gap-0.5 overflow-auto px-2 pt-1 pb-2.5"
        >
          {list.map((entry) => {
            const name = companionName(entry.companion);
            const selected = selectedId === String(entry.id);
            const mine = entry.last_message?.sender_id === userId;
            const stamp = entry.last_message?.created_at ?? entry.created_at;
            const transferred = isTransferred(entry, completed);
            return (
              <li key={entry.id}>
                <button
                  type="button"
                  onClick={() => onOpen(String(entry.id))}
                  aria-current={selected ? "true" : undefined}
                  className={`grid w-full cursor-pointer grid-cols-[40px_minmax(0,1fr)] gap-3 rounded-xl px-2.5 py-3 text-left ${
                    selected ? "bg-accent" : "hover:bg-muted"
                  }`}
                >
                  <CompanionAvatar
                    name={name}
                    avatar={entry.companion.avatar}
                    selected={selected}
                  />
                  <span className="flex min-w-0 flex-col gap-px">
                    <span className="flex items-center gap-2">
                      <strong className="min-w-0 flex-1 truncate font-semibold">
                        {name}
                      </strong>
                      <time
                        className={`text-[12.5px] ${
                          selected
                            ? "text-accent-foreground"
                            : "text-muted-foreground"
                        }`}
                      >
                        {formatStamp(stamp)}
                      </time>
                    </span>
                    <span className="flex items-center gap-2">
                      <span className="min-w-0 flex-1 truncate text-sm">
                        {entry.item.title}
                      </span>
                      {entry.unread_count > 0 && (
                        <span className="bg-primary text-primary-foreground grid h-[22px] min-w-[22px] place-items-center rounded-full px-[7px] text-xs font-semibold">
                          {entry.unread_count}
                        </span>
                      )}
                      {transferred && (
                        <span className="text-primary inline-flex shrink-0 items-center gap-1 text-[12.5px] font-semibold">
                          <Check className="size-3.5" />
                          Передано
                        </span>
                      )}
                    </span>
                    <span
                      className={`truncate text-[13.5px] ${
                        entry.unread_count > 0
                          ? "font-semibold"
                          : selected
                            ? "text-accent-foreground"
                            : "text-muted-foreground"
                      }`}
                    >
                      {entry.last_message
                        ? `${mine ? "Вы: " : ""}${entry.last_message.body}`
                        : "Сообщений пока нет"}
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
          {!list.length && (
            <li className="px-3 py-10 text-center">
              <h2 className="text-lg font-semibold">
                {query
                  ? "Ничего не нашлось"
                  : filter === "transferred"
                    ? "Передач пока нет"
                    : "Всё прочитано"}
              </h2>
              {query && (
                <p className="text-muted-foreground mt-2">
                  Попробуйте другое имя или название вещи.
                </p>
              )}
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  onQuery("");
                  onFilter("all");
                }}
                className="mt-3 h-10 rounded-2xl px-3.5"
              >
                {query ? "Очистить поиск" : "Показать все чаты"}
              </Button>
            </li>
          )}
        </ul>
      </aside>

      <section
        aria-label={`Переписка. ${person}`}
        className="border-border bg-card flex min-h-[520px] flex-col overflow-hidden rounded-2xl border lg:min-h-0"
      >
        {conversation ? (
          <>
            <header className="border-border shrink-0 border-b px-5 py-3.5">
              {confirmOpen ? (
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-semibold">
                      Отметить передачу?
                    </h3>
                    <p className="text-muted-foreground text-[13px] leading-5">
                      После отметки собеседник увидит статус передачи.
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setConfirmOpen(false)}
                      className="h-11 rounded-2xl px-5"
                    >
                      Отмена
                    </Button>
                    <Button
                      type="button"
                      disabled={pending || !exchange}
                      onClick={() => {
                        if (!exchange) return;
                        confirmExchange(String(exchange.id), {
                          onSuccess: () => setConfirmOpen(false),
                        });
                      }}
                      className="h-11 rounded-2xl px-5"
                    >
                      Подтвердить
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 items-center gap-4 sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:gap-6">
                  <div className="flex min-w-[150px] items-center gap-3">
                    <CompanionAvatar
                      name={person}
                      avatar={conversation.companion.avatar}
                      large
                    />
                    <div>
                      <h2 className="text-[17px] leading-[22px] font-semibold">
                        {person}
                      </h2>
                      <p className="text-muted-foreground text-[13px] leading-[18px]">
                        {role === "giver"
                          ? "Хочет забрать вещь"
                          : "Владелец вещи"}
                      </p>
                    </div>
                  </div>
                  <Link
                    to={`/item/${conversation.item.id}`}
                    className="hover:text-primary flex min-w-0 items-center gap-3"
                  >
                    {conversation.item.cover ? (
                      <img
                        src={conversation.item.cover}
                        alt=""
                        className="size-11 shrink-0 rounded-xl object-cover"
                      />
                    ) : (
                      <span className="bg-muted text-muted-foreground grid size-11 shrink-0 place-items-center rounded-xl">
                        <Camera className="size-5" />
                      </span>
                    )}
                    <span className="min-w-0">
                      <strong className="block truncate text-[15px] leading-5 font-semibold">
                        {conversation.item.title}
                      </strong>
                      <span className="text-muted-foreground flex flex-wrap gap-x-3 text-[13px] leading-[18px]">
                        {item && (
                          <span>
                            {exchangeFormatTitle[item.exchange_format]}
                          </span>
                        )}
                        {item?.size && <span>{item.size}</span>}
                        {item?.district && (
                          <span className="inline-flex items-center gap-1">
                            <MapPin className="size-3.5" />
                            {item.district}
                          </span>
                        )}
                      </span>
                    </span>
                  </Link>
                  <ExchangeActions
                    exchange={exchange}
                    role={role}
                    pending={pending}
                    onAgree={() =>
                      exchange && agreeExchange(String(exchange.id))
                    }
                    onDecline={() =>
                      exchange && declineExchange(String(exchange.id))
                    }
                    onCancel={() =>
                      exchange && cancelExchange(String(exchange.id))
                    }
                    onAskConfirm={() => setConfirmOpen(true)}
                  />
                </div>
              )}
            </header>
            <div
              ref={log}
              role="log"
              aria-label="Сообщения"
              tabIndex={0}
              className="flex min-h-0 flex-1 flex-col overflow-auto px-6 pt-5 pb-3"
            >
              <div className="flex-1" />
              {messagesLoading && <span>Загрузка...</span>}
              {!messagesLoading && messagesError && (
                <span>Ошибка загрузки данных</span>
              )}
              {!messagesLoading && !messagesError && messages?.length ? (
                <ol className="flex flex-col gap-2">
                  {messages.map((message, index) => {
                    const mine = message.sender_id === userId;
                    const previous = messages[index - 1];
                    const showDay =
                      !previous ||
                      !isSameDay(
                        message.created_at,
                        new Date(previous.created_at),
                      );
                    return (
                      <Fragment key={message.id}>
                        {showDay && (
                          <li className="text-muted-foreground self-center py-2 text-[12.5px]">
                            {formatDay(message.created_at)}
                          </li>
                        )}
                        <li className={`flex ${mine ? "justify-end" : ""}`}>
                          <div
                            className={`max-w-[78%] px-3.5 py-2 leading-[22px] wrap-anywhere ${
                              mine
                                ? "rounded-[16px_16px_4px_16px] bg-[#c9e6e3] text-[#0a2c2e] dark:bg-[#1d4547] dark:text-[#eaf7f6]"
                                : "bg-muted rounded-[16px_16px_16px_4px]"
                            }`}
                          >
                            <span className="sr-only">
                              {mine ? "Вы" : person}.{" "}
                            </span>
                            <p className="flow-root whitespace-pre-wrap">
                              {message.body}
                              <time
                                className={`float-right mt-1 -mb-0.5 ml-3.5 text-xs leading-4 tabular-nums ${
                                  mine
                                    ? "text-[#3c6563] dark:text-[#9ccac8]"
                                    : "text-muted-foreground"
                                }`}
                              >
                                {formatTime(message.created_at)}
                              </time>
                            </p>
                          </div>
                        </li>
                      </Fragment>
                    );
                  })}
                </ol>
              ) : null}
              {!messagesLoading && !messagesError && !messages?.length && (
                <div className="m-auto text-center">
                  <h2 className="text-lg font-semibold">Сообщений пока нет</h2>
                  <p className="text-muted-foreground">
                    Напишите участнику, чтобы начать разговор о вещи.
                  </p>
                </div>
              )}
            </div>
            <form
              className="border-border flex shrink-0 items-end gap-3 border-t px-5 py-3.5"
              onSubmit={(event) => {
                event.preventDefault();
                onSubmit();
              }}
            >
              <textarea
                rows={1}
                aria-label="Сообщение"
                placeholder="Напишите сообщение"
                maxLength={1500}
                value={draft}
                onChange={(event) => onDraft(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key !== "Enter" || event.shiftKey) return;
                  event.preventDefault();
                  if (!draft.trim() || isSending) return;
                  onSubmit();
                }}
                className="border-border bg-card focus-visible:border-ring focus-visible:ring-ring/30 max-h-[120px] min-h-11 flex-1 resize-none rounded-2xl border px-3.5 py-2.5 leading-[22px] outline-none focus-visible:ring-3"
              />
              <Button
                type="submit"
                disabled={!draft.trim() || isSending}
                className="h-11 rounded-2xl px-5"
              >
                <Send />
                Отправить
              </Button>
            </form>
          </>
        ) : (
          <div className="m-auto px-6 text-center">
            <h2 className="text-lg font-semibold">Выберите диалог</h2>
          </div>
        )}
      </section>
    </div>
  );
}

function ExchangeActions({
  exchange,
  role,
  pending,
  onAgree,
  onDecline,
  onCancel,
  onAskConfirm,
}: {
  exchange?: TExchange;
  role?: "giver" | "receiver";
  pending: boolean;
  onAgree: () => void;
  onDecline: () => void;
  onCancel: () => void;
  onAskConfirm: () => void;
}) {
  if (!exchange) return null;

  if (exchange.status === "completed") {
    return (
      <p className="text-primary inline-flex items-center gap-1.5 text-sm font-semibold">
        <Check className="size-4" />
        Передано
      </p>
    );
  }

  if (exchange.status === "declined") {
    return <p className="text-muted-foreground text-sm">Заявка отклонена</p>;
  }

  if (exchange.status === "cancelled") {
    return <p className="text-muted-foreground text-sm">Сделка отменена</p>;
  }

  if (exchange.status === "requested" && role === "giver") {
    return (
      <div className="flex flex-wrap justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          disabled={pending}
          onClick={onDecline}
          className="h-11 rounded-2xl px-5"
        >
          Отклонить
        </Button>
        <Button
          type="button"
          disabled={pending}
          onClick={onAgree}
          className="h-11 rounded-2xl px-5"
        >
          Принять
        </Button>
      </div>
    );
  }

  if (exchange.status === "requested" && role === "receiver") {
    return (
      <Button
        type="button"
        variant="outline"
        disabled={pending}
        onClick={onCancel}
        className="h-11 rounded-2xl px-5"
      >
        Отменить заявку
      </Button>
    );
  }

  if (exchange.status !== "agreed") return null;

  if (!role) return null;

  const marked =
    role === "giver"
      ? exchange.giver_confirmed_at
      : exchange.receiver_confirmed_at;

  return (
    <div className="flex flex-col items-end gap-2">
      {marked ? (
        <p className="text-muted-foreground max-w-64 text-right text-[13px] leading-5">
          Вы отметили передачу. Ожидается отметка собеседника.
        </p>
      ) : (
        <Button
          type="button"
          disabled={pending}
          onClick={onAskConfirm}
          className="h-11 rounded-2xl px-5"
        >
          <Check />
          Отметить передачу
        </Button>
      )}
      <Button
        type="button"
        variant="outline"
        disabled={pending}
        onClick={onCancel}
        className="h-11 rounded-2xl px-5"
      >
        Отменить сделку
      </Button>
    </div>
  );
}

function CompanionAvatar({
  name,
  avatar,
  selected = false,
  large = false,
}: {
  name: string;
  avatar?: string | null;
  selected?: boolean;
  large?: boolean;
}) {
  const size = large ? "size-12 text-[19px]" : "size-10 text-base";
  if (avatar) {
    return (
      <img
        src={avatar}
        alt=""
        className={`${size} shrink-0 rounded-full object-cover`}
      />
    );
  }
  return (
    <span
      className={`grid shrink-0 place-items-center rounded-full font-semibold ${size} ${
        selected
          ? "bg-card text-accent-foreground"
          : "bg-accent text-accent-foreground"
      }`}
    >
      {name[0]}
    </span>
  );
}
