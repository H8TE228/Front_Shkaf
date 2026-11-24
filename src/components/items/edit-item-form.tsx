import { zodResolver } from "@hookform/resolvers/zod";
import { isAxiosError } from "axios";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import z from "zod";
import { useDeleteItem, useItemTypes, useUpdateItem } from "@/hooks";
import type { TItem } from "@/types";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Field, FieldError, FieldGroup, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";

const editItemSchema = z.object({
  title: z.string().trim().min(2, "Укажите название вещи"),
  itemTypeId: z
    .string()
    .min(1, "Выберите категорию")
    .regex(/^\d+$/, "Выберите категорию")
    .transform(Number),
  condition: z.enum(["new", "good", "used"], {
    error: "Выберите состояние вещи",
  }),
  description: z.string(),
  exchangeFormat: z.enum(["free", "swap", "points"], {
    error: "Выберите формат передачи",
  }),
  district: z.string(),
});

type EditItemInput = z.input<typeof editItemSchema>;
type EditItemOutput = z.output<typeof editItemSchema>;

const conditionLabels: Record<TItem["condition"], string> = {
  new: "Новое",
  good: "Хорошее",
  used: "Б/у",
};

const exchangeFormatLabels: Record<TItem["exchange_format"], string> = {
  free: "Бесплатно",
  swap: "Обмен",
  points: "Баллы",
};

function getErrorMessage(
  error: unknown,
  fallback = "Не удалось сохранить изменения. Попробуйте ещё раз.",
) {
  if (isAxiosError(error)) {
    const detail = error.response?.data?.detail;
    if (typeof detail === "string") return detail;
  }

  return fallback;
}

export function ItemOwnerActions({ item }: { item: TItem }) {
  const navigate = useNavigate();
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [activationError, setActivationError] = useState<string | null>(null);
  const updateItem = useUpdateItem();

  function activateItem() {
    setActivationError(null);
    const itemData = new FormData();
    itemData.append("status", "active");

    updateItem.mutate(
      { id: String(item.id), itemData },
      {
        onError: (error) => {
          setActivationError(getErrorMessage(error));
        },
      },
    );
  }

  return (
    <>
      <div className="flex flex-wrap gap-3">
        <Button
          type="button"
          variant="outline"
          className="h-11"
          disabled={updateItem.isPending}
          onClick={() => setEditOpen(true)}
        >
          Редактировать
        </Button>
        {(item.status ?? "active") !== "active" && (
          <Button
            type="button"
            disabled={updateItem.isPending}
            onClick={activateItem}
            className="h-11"
          >
            {updateItem.isPending ? "Обновляем..." : "Сделать активным"}
          </Button>
        )}
        <Button
          type="button"
          variant="destructive"
          className="h-11"
          disabled={updateItem.isPending}
          onClick={() => {
            setDeleteOpen(true);
          }}
        >
          Удалить объявление
        </Button>
      </div>

      {activationError && (
        <Alert variant="destructive">
          <AlertTitle>Не удалось активировать объявление</AlertTitle>
          <AlertDescription>{activationError}</AlertDescription>
        </Alert>
      )}

      {deleteOpen && (
        <DeleteItemDialog
          item={item}
          open={deleteOpen}
          onOpenChange={setDeleteOpen}
          onDeleted={() => navigate("/catalog", { replace: true })}
        />
      )}

      {editOpen && (
        <EditItemDialog
          item={item}
          open={editOpen}
          onOpenChange={setEditOpen}
        />
      )}
    </>
  );
}

export function DeleteItemDialog({
  item,
  open,
  onOpenChange,
  onDeleted,
}: {
  item: TItem;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDeleted?: () => void;
}) {
  const deleteItem = useDeleteItem();
  const [deleteError, setDeleteError] = useState<string | null>(null);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Удалить объявление?</DialogTitle>
          <DialogDescription>
            Объявление «{item.title}» будет удалено без возможности
            восстановления.
          </DialogDescription>
        </DialogHeader>
        {deleteError && (
          <Alert variant="destructive">
            <AlertTitle>Не удалось удалить объявление</AlertTitle>
            <AlertDescription>{deleteError}</AlertDescription>
          </Alert>
        )}
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            className="h-11"
            disabled={deleteItem.isPending}
            onClick={() => onOpenChange(false)}
          >
            Отмена
          </Button>
          <Button
            type="button"
            variant="destructive"
            className="h-11"
            disabled={deleteItem.isPending}
            onClick={() => {
              deleteItem.mutate(String(item.id), {
                onSuccess: () => {
                  onOpenChange(false);
                  onDeleted?.();
                },
                onError: (error) => {
                  setDeleteError(
                    getErrorMessage(
                      error,
                      "Не удалось удалить объявление. Попробуйте ещё раз.",
                    ),
                  );
                },
              });
            }}
          >
            {deleteItem.isPending ? "Удаляем..." : "Удалить"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function EditItemDialog({
  item,
  open,
  onOpenChange,
}: {
  item: TItem;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const updateItem = useUpdateItem();
  const itemTypesQuery = useItemTypes();
  const [serverError, setServerError] = useState<string | null>(null);
  const form = useForm<EditItemInput, unknown, EditItemOutput>({
    resolver: zodResolver(editItemSchema),
    defaultValues: {
      title: item.title,
      itemTypeId: String(item.item_type),
      condition: item.condition,
      description: item.description ?? "",
      exchangeFormat: item.exchange_format,
      district: item.district ?? "",
    },
    mode: "onSubmit",
  });

  function onSubmit(data: EditItemOutput) {
    setServerError(null);
    const itemData = new FormData();
    itemData.append("title", data.title);
    itemData.append("item_type", String(data.itemTypeId));
    itemData.append("condition", data.condition);
    itemData.append("description", data.description);
    itemData.append("exchange_format", data.exchangeFormat);
    itemData.append("district", data.district);

    updateItem.mutate(
      { id: String(item.id), itemData },
      {
        onSuccess: () => onOpenChange(false),
        onError: (error) => setServerError(getErrorMessage(error)),
      },
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Редактировать объявление</DialogTitle>
          <DialogDescription>
            Измените информацию о вещи и сохраните её.
          </DialogDescription>
        </DialogHeader>

        <form
          noValidate
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-5"
        >
          <FieldGroup>
            <Controller
              name="title"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="edit-item-title">Название *</FieldLabel>
                  <Input
                    id="edit-item-title"
                    aria-invalid={fieldState.invalid}
                    disabled={updateItem.isPending}
                    className="h-12 rounded-lg"
                    {...field}
                    onChange={(event) => {
                      field.onChange(event);
                      setServerError(null);
                    }}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <div className="grid gap-x-2 gap-y-6 sm:grid-cols-2">
              <Controller
                name="itemTypeId"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="edit-item-type">
                      Категория *
                    </FieldLabel>
                    <Select
                      value={field.value}
                      onValueChange={(value) => {
                        field.onChange(value ?? "");
                        setServerError(null);
                      }}
                      disabled={
                        updateItem.isPending ||
                        itemTypesQuery.isLoading ||
                        itemTypesQuery.isError
                      }
                    >
                      <SelectTrigger
                        id="edit-item-type"
                        aria-invalid={fieldState.invalid}
                        className="h-12! w-full cursor-pointer! rounded-lg!"
                      >
                        <SelectValue placeholder="Выберите категорию">
                          {itemTypesQuery.data?.find(
                            (type) => String(type.id) === field.value,
                          )?.title ?? item.item_type_title}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent alignItemWithTrigger={false}>
                        {itemTypesQuery.data?.map((type) => (
                          <SelectItem key={type.id} value={String(type.id)}>
                            {type.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="condition"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="edit-item-condition">
                      Состояние *
                    </FieldLabel>
                    <Select
                      value={field.value}
                      onValueChange={(value) => {
                        field.onChange(value ?? "");
                        setServerError(null);
                      }}
                      disabled={updateItem.isPending}
                    >
                      <SelectTrigger
                        id="edit-item-condition"
                        aria-invalid={fieldState.invalid}
                        className="h-12! w-full cursor-pointer! rounded-lg!"
                      >
                        <SelectValue placeholder="Выберите состояние">
                          {conditionLabels[field.value]}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent alignItemWithTrigger={false}>
                        <SelectItem value="new">Новое</SelectItem>
                        <SelectItem value="good">Хорошее</SelectItem>
                        <SelectItem value="used">Б/у</SelectItem>
                      </SelectContent>
                    </Select>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </div>

            <Controller
              name="description"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="edit-item-description">
                    Описание
                  </FieldLabel>
                  <Textarea
                    id="edit-item-description"
                    rows={5}
                    className="min-h-32 rounded-lg"
                    disabled={updateItem.isPending}
                    {...field}
                    onChange={(event) => {
                      field.onChange(event);
                      setServerError(null);
                    }}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <div className="grid gap-x-2 gap-y-6 sm:grid-cols-2">
              <Controller
                name="exchangeFormat"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="edit-item-exchange">
                      Формат передачи *
                    </FieldLabel>
                    <Select
                      value={field.value}
                      onValueChange={(value) => {
                        field.onChange(value ?? "");
                        setServerError(null);
                      }}
                      disabled={updateItem.isPending}
                    >
                      <SelectTrigger
                        id="edit-item-exchange"
                        aria-invalid={fieldState.invalid}
                        className="h-12! w-full cursor-pointer! rounded-lg!"
                      >
                        <SelectValue placeholder="Выберите формат">
                          {exchangeFormatLabels[field.value]}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent alignItemWithTrigger={false}>
                        <SelectItem value="free">Бесплатно</SelectItem>
                        <SelectItem value="swap">Обмен</SelectItem>
                        <SelectItem value="points">Баллы</SelectItem>
                      </SelectContent>
                    </Select>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="district"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="edit-item-district">Район</FieldLabel>
                    <Input
                      id="edit-item-district"
                      aria-invalid={fieldState.invalid}
                      disabled={updateItem.isPending}
                      {...field}
                      onChange={(event) => {
                        field.onChange(event);
                        setServerError(null);
                      }}
                      className="h-12! w-full rounded-lg!"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </div>
          </FieldGroup>

          {itemTypesQuery.isError && (
            <Alert variant="destructive">
              <AlertTitle>Не удалось загрузить категории</AlertTitle>
              <AlertDescription className="flex items-center justify-between gap-4">
                Попробуйте загрузить список ещё раз.
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => itemTypesQuery.refetch()}
                >
                  Повторить
                </Button>
              </AlertDescription>
            </Alert>
          )}

          {serverError && (
            <Alert variant="destructive">
              <AlertTitle>Не удалось сохранить</AlertTitle>
              <AlertDescription>{serverError}</AlertDescription>
            </Alert>
          )}

          <DialogFooter className="mt-2">
            <Button
              type="button"
              variant="outline"
              className="h-11"
              disabled={updateItem.isPending}
              onClick={() => onOpenChange(false)}
            >
              Отмена
            </Button>
            <Button
              type="submit"
              className="h-11"
              disabled={updateItem.isPending || itemTypesQuery.isError}
            >
              {updateItem.isPending ? "Сохраняем..." : "Сохранить"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
