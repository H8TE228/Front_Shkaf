import { Fragment, useEffect, useRef, useState, type RefObject } from "react";
import { Link } from "react-router-dom";
import { Camera, ChevronRight, Search, Send, X } from "lucide-react";
import { Button } from "../ui/button";
import {
  useConversationMessages,
  useConversations,
  useMarkConversationRead,
  useMe,
  useSendMessage,
} from "@/hooks";
import type {
  TConversation,
  TConversationCompanion,
  TConversationMessage,
} from "@/types";

type ChatListFilter = "all" | "unread";

const filters: [ChatListFilter, string][] = [
  ["all", "Все"],
  ["unread", "Непрочитанные"],
];

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
  const { data: conversations, isLoading, isError } = useConversations();
  const [selectedId, setSelectedId] = useState("");
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<ChatListFilter>("all");
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const log = useRef<HTMLDivElement>(null);
  const { mutate: markRead } = useMarkConversationRead();
  const { mutate: sendMessage, isPending: isSending } = useSendMessage();
  const {
    data: messages,
    isLoading: messagesLoading,
    isError: messagesError,
  } = useConversationMessages(selectedId);

  const conversation = conversations?.find(
    (entry) => String(entry.id) === selectedId,
  );
  const draft = drafts[selectedId] ?? "";
  const needle = query.trim().toLocaleLowerCase("ru");
  const list = (conversations ?? []).filter((entry) => {
    const name = companionName(entry.companion);
    const unreadMatch = filter === "all" || entry.unread_count > 0;
    return (
      unreadMatch &&
      `${name} ${entry.item.title}`.toLocaleLowerCase("ru").includes(needle)
    );
  });

  useEffect(() => {
    if (selectedId || !conversations?.[0]) return;
    const id = String(conversations[0].id);
    setSelectedId(id);
    if (conversations[0].unread_count > 0) markRead(id);
  }, [conversations, markRead, selectedId]);

  useEffect(() => {
    if (log.current) log.current.scrollTop = log.current.scrollHeight;
  }, [selectedId, messages?.length]);

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
          <span>Чаты</span>
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
              conversation={conversation}
              messages={messages}
              messagesLoading={messagesLoading}
              messagesError={messagesError}
              userId={user?.id}
              selectedId={selectedId}
              query={query}
              filter={filter}
              draft={draft}
              isSending={isSending}
              log={log}
              onQuery={setQuery}
              onFilter={setFilter}
              onOpen={openConversation}
              onDraft={(value) =>
                setDrafts((current) => ({ ...current, [selectedId]: value }))
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
  const person = conversation ? companionName(conversation.companion) : "";
  const owner = conversation ? userId === conversation.owner_id : false;

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
                    conversations.filter(
                      (entry) => id === "all" || entry.unread_count > 0,
                    ).length
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
                {query ? "Ничего не нашлось" : "Всё прочитано"}
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
            <header className="border-border grid shrink-0 grid-cols-1 items-center gap-4 border-b px-5 py-3.5 sm:grid-cols-[auto_minmax(0,1fr)] sm:gap-6">
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
                    {owner ? "Хочет забрать вещь" : "Владелец вещи"}
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
                <strong className="truncate text-[15px] leading-5 font-semibold">
                  {conversation.item.title}
                </strong>
              </Link>
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

function CompanionAvatar({
  name,
  avatar,
  selected = false,
  large = false,
}: {
  name: string;
  avatar?: string;
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
