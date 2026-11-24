import { zodResolver } from "@hookform/resolvers/zod";
import { Camera, ChevronRight, ImagePlus, MapPin, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { isAxiosError } from "axios";
import z from "zod";
import { useCreateItem, useCreateItemPhoto, useItemTypes } from "@/hooks";
import type { TItem } from "@/types";
import { ItemCard } from "../item-card";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
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

const formSchema = z.object({
  title: z.string().trim().min(2, "Укажите название вещи"),
  itemTypeId: z
    .string()
    .min(1, "Выберите категорию")
    .regex(/^\d+$/, "Выберите категорию")
    .transform(Number),
  condition: z.enum(["new", "good", "used"], {
    error: "Выберите состояние вещи",
  }),
  description: z.string().trim().min(1, "Добавьте описание вещи"),
  exchangeFormat: z.enum(["free", "swap", "points"], {
    error: "Выберите формат передачи",
  }),
  district: z.string().trim().min(1, "Укажите район"),
  photos: z
    .array(z.instanceof(File))
    .min(1, "Добавьте хотя бы одну фотографию")
    .max(10, "Можно загрузить не более 10 фотографий"),
});

type FormInput = z.input<typeof formSchema>;
type FormOutput = z.output<typeof formSchema>;

const conditionLabels: Record<TItem["condition"], string> = {
  new: "Новое",
  good: "Хорошее",
  used: "Б/у",
};

const exchangeOptions = [
  { value: "free", label: "Бесплатно" },
  { value: "swap", label: "Обмен" },
  { value: "points", label: "Баллы" },
] as const;

function getErrorMessage(error: unknown, fallback: string) {
  if (isAxiosError(error)) {
    const detail = error.response?.data?.detail;
    if (typeof detail === "string") return detail;
  }

  return fallback;
}

function createItemFormData(data: FormOutput) {
  const formData = new FormData();
  formData.append("item_type", String(data.itemTypeId));
  formData.append("title", data.title);
  formData.append("description", data.description);
  formData.append("condition", data.condition);
  formData.append("exchange_format", data.exchangeFormat);
  formData.append("district", data.district);
  return formData;
}

export function CreateItemForm() {
  const navigate = useNavigate();
  const photoInputRef = useRef<HTMLInputElement>(null);
  const photoPreviewUrls = useRef(new Set<string>());
  const createItem = useCreateItem();
  const createItemPhoto = useCreateItemPhoto();
  const itemTypesQuery = useItemTypes();
  const [serverError, setServerError] = useState<string | null>(null);
  const [createdItemId, setCreatedItemId] = useState<string | null>(null);
  const [uploadedPhotoCount, setUploadedPhotoCount] = useState(0);
  const [photoLimitMessage, setPhotoLimitMessage] = useState<string | null>(
    null,
  );
  const [photoPreviews, setPhotoPreviews] = useState<
    { file: File; url: string }[]
  >([]);

  useEffect(
    () => () => {
      photoPreviewUrls.current.forEach((url) => URL.revokeObjectURL(url));
      photoPreviewUrls.current.clear();
    },
    [],
  );

  const form = useForm<FormInput, unknown, FormOutput>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      itemTypeId: "",
      condition: undefined,
      description: "",
      exchangeFormat: "free",
      district: "",
      photos: [],
    },
    mode: "onSubmit",
  });

  const title = useWatch({ control: form.control, name: "title" });
  const itemTypeId = useWatch({ control: form.control, name: "itemTypeId" });
  const condition = useWatch({ control: form.control, name: "condition" });
  const description = useWatch({ control: form.control, name: "description" });
  const exchangeFormat = useWatch({
    control: form.control,
    name: "exchangeFormat",
  });
  const district = useWatch({ control: form.control, name: "district" });
  const photos = useWatch({ control: form.control, name: "photos" });
  const itemType = itemTypesQuery.data?.find(
    (type) => String(type.id) === itemTypeId,
  );
  const previewItem: TItem = {
    id: 0,
    owner_id: 0,
    item_type: Number(itemTypeId) || 0,
    item_type_title: itemType?.title ?? "Категория",
    title: title.trim() || "Здесь появится ваша вещь",
    description: description.trim(),
    condition: condition ?? "new",
    exchange_format: exchangeFormat,
    status: "draft",
    district: district.trim() || "Район",
    distance: null,
    photos: photoPreviews[0]
      ? [{ id: 0, image: photoPreviews[0].url, position: 0 }]
      : [],
    created_at: "",
    updated_at: "",
  };
  const isPending = createItem.isPending || createItemPhoto.isPending;
  const isLocked = createdItemId !== null;

  async function onSubmit(data: FormOutput) {
    setServerError(null);
    let itemId = createdItemId;
    let uploadedCount = uploadedPhotoCount;

    try {
      if (!itemId) {
        const item = await createItem.mutateAsync(createItemFormData(data));
        itemId = String(item.id);
        setCreatedItemId(itemId);
      }

      for (let index = uploadedCount; index < data.photos.length; index += 1) {
        const photoData = new FormData();
        photoData.append("image", data.photos[index]);
        await createItemPhoto.mutateAsync({ id: itemId, photoData });
        uploadedCount += 1;
        setUploadedPhotoCount(uploadedCount);
      }

      navigate(`/item/${itemId}`);
    } catch (error) {
      if (itemId) {
        setCreatedItemId(itemId);
        setServerError(
          `Объявление уже создано, но удалось загрузить только ${uploadedCount} из ${data.photos.length} фото. Нажмите «Повторить загрузку фото». ${getErrorMessage(error, "Ошибка загрузки фото.")}`,
        );
        return;
      }

      setServerError(
        getErrorMessage(
          error,
          "Не удалось разместить вещь. Попробуйте ещё раз.",
        ),
      );
    }
  }

  return (
    <section className="mx-auto w-full max-w-[1550px] px-6 pt-12 lg:px-0">
      <nav className="text-muted-foreground mb-5 flex items-center gap-2 text-sm [&_svg]:size-4 [&_svg]:shrink-0">
        <Link to="/" className="hover:text-foreground">
          Главная
        </Link>
        <ChevronRight className="sm:hidden" />
        <div className="hidden items-center gap-2 sm:flex">
          <ChevronRight />
          <Link to="/my-items" className="hover:text-foreground">
            Мои вещи
          </Link>
          <ChevronRight />
        </div>
        <Link to="/items/new" className="hover:text-foreground">
          Размещение
        </Link>
      </nav>

      <div className="mb-6">
        <h1 className="text-3xl font-semibold">Разместить вещь</h1>
        <p className="text-muted-foreground mt-2">
          Добавьте фотографии и расскажите о вещи, которую хотите передать.
        </p>
        <p className="text-muted-foreground mt-7 text-sm">
          * Обязательные поля
        </p>
      </div>

      <form
        noValidate
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid items-start gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(280px,0.9fr)]"
      >
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Фотографии *</CardTitle>
            </CardHeader>
            <CardContent>
              <Controller
                name="photos"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
                      <div className="bg-muted text-muted-foreground flex size-12 shrink-0 items-center justify-center rounded-xl">
                        <Camera className="size-6" />
                      </div>
                      <div className="flex flex-col gap-3">
                        <p className="text-sm">
                          Покажите вещь целиком и крупным планом. До 10 фото.
                        </p>
                        <p className="text-muted-foreground text-xs">
                          Выбрано: {field.value.length} из 10
                        </p>
                        <input
                          ref={photoInputRef}
                          id="item-photos"
                          type="file"
                          accept="image/*"
                          multiple
                          className="sr-only"
                          disabled={
                            isPending || isLocked || field.value.length >= 10
                          }
                          onChange={(event) => {
                            const selectedFiles = Array.from(
                              event.currentTarget.files ?? [],
                            );
                            if (selectedFiles.length > 0) {
                              const availableSlots = Math.max(
                                0,
                                10 - field.value.length,
                              );
                              const acceptedFiles = selectedFiles.slice(
                                0,
                                availableSlots,
                              );
                              setPhotoLimitMessage(
                                selectedFiles.length > availableSlots
                                  ? "Можно загрузить не более 10 фотографий. Лишние файлы не добавлены."
                                  : null,
                              );
                              if (acceptedFiles.length > 0) {
                                field.onChange([
                                  ...field.value,
                                  ...acceptedFiles,
                                ]);
                                setPhotoPreviews((current) => [
                                  ...current,
                                  ...acceptedFiles.map((file) => {
                                    const url = URL.createObjectURL(file);
                                    photoPreviewUrls.current.add(url);
                                    return { file, url };
                                  }),
                                ]);
                              }
                              setServerError(null);
                            }
                            event.currentTarget.value = "";
                          }}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => photoInputRef.current?.click()}
                          disabled={
                            isPending || isLocked || field.value.length >= 10
                          }
                          className="h-11"
                        >
                          Добавить фото
                        </Button>
                      </div>
                    </div>

                    {field.value.length > 0 && (
                      <ul className="mt-5 grid gap-2 sm:grid-cols-2">
                        {field.value.map((file, index) => (
                          <li
                            key={`${file.name}-${index}`}
                            className="flex min-w-0 items-center gap-3 rounded-xl border p-3"
                          >
                            <ImagePlus className="text-muted-foreground size-5 shrink-0" />
                            <span className="min-w-0 flex-1 truncate text-sm">
                              {file.name}
                            </span>
                            {!isLocked && (
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon-sm"
                                aria-label={`Удалить фото ${file.name}`}
                                onClick={() => {
                                  const preview = photoPreviews[index];
                                  if (preview) {
                                    URL.revokeObjectURL(preview.url);
                                    photoPreviewUrls.current.delete(
                                      preview.url,
                                    );
                                  }
                                  setPhotoPreviews((current) =>
                                    current.filter(
                                      (_, photoIndex) => photoIndex !== index,
                                    ),
                                  );
                                  field.onChange(
                                    field.value.filter(
                                      (_, photoIndex) => photoIndex !== index,
                                    ),
                                  );
                                  setPhotoLimitMessage(null);
                                  setServerError(null);
                                }}
                              >
                                <X />
                              </Button>
                            )}
                          </li>
                        ))}
                      </ul>
                    )}
                    {photoLimitMessage && (
                      <p
                        role="status"
                        className="text-muted-foreground text-sm"
                      >
                        {photoLimitMessage}
                      </p>
                    )}
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>О вещи</CardTitle>
            </CardHeader>
            <CardContent>
              <FieldGroup>
                <Controller
                  name="title"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={field.name}>Название *</FieldLabel>
                      <Input
                        id={field.name}
                        placeholder="Например, зимний комбинезон"
                        aria-invalid={fieldState.invalid}
                        disabled={isPending || isLocked}
                        {...field}
                        onChange={(event) => {
                          field.onChange(event);
                          setServerError(null);
                        }}
                        className="h-12 rounded-lg"
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                <div className="grid gap-5 sm:grid-cols-2">
                  <Controller
                    name="itemTypeId"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="item-type">Категория *</FieldLabel>
                        <Select
                          value={field.value}
                          onValueChange={(value) => {
                            field.onChange(value ?? "");
                            setServerError(null);
                          }}
                          disabled={
                            isPending ||
                            isLocked ||
                            itemTypesQuery.isLoading ||
                            itemTypesQuery.isError
                          }
                        >
                          <SelectTrigger
                            id="item-type"
                            aria-invalid={fieldState.invalid}
                            className="h-12! w-full cursor-pointer! rounded-lg!"
                          >
                            <SelectValue
                              placeholder={
                                itemTypesQuery.isLoading
                                  ? "Загрузка..."
                                  : "Выберите категорию"
                              }
                            >
                              {itemType?.title ??
                                (field.value ? "Категория выбрана" : undefined)}
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
                        <FieldLabel htmlFor="item-condition">
                          Состояние *
                        </FieldLabel>
                        <Select
                          value={field.value}
                          onValueChange={(value) => {
                            field.onChange(value ?? "");
                            setServerError(null);
                          }}
                          disabled={isPending || isLocked}
                        >
                          <SelectTrigger
                            id="item-condition"
                            aria-invalid={fieldState.invalid}
                            className="h-12! w-full cursor-pointer! rounded-lg!"
                          >
                            <SelectValue placeholder="Выберите состояние">
                              {field.value
                                ? conditionLabels[field.value]
                                : undefined}
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
                      <FieldLabel htmlFor={field.name}>Описание *</FieldLabel>
                      <Textarea
                        id={field.name}
                        placeholder="Как долго пользовались вещью? Есть ли особенности или недостатки?"
                        rows={5}
                        className="min-h-32 rounded-lg"
                        aria-invalid={fieldState.invalid}
                        disabled={isPending || isLocked}
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
              </FieldGroup>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Передача</CardTitle>
            </CardHeader>
            <CardContent>
              <FieldGroup>
                <Controller
                  name="exchangeFormat"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel>Формат передачи *</FieldLabel>
                      <div className="grid gap-3 sm:grid-cols-2">
                        {exchangeOptions.map((option) => (
                          <label
                            key={option.value}
                            className={`flex min-h-12 cursor-pointer items-center gap-3 rounded-xl border px-4 transition-colors ${
                              field.value === option.value
                                ? "border-primary bg-primary/10"
                                : "border-border hover:bg-muted/50"
                            } ${isPending || isLocked ? "cursor-not-allowed opacity-60" : ""}`}
                          >
                            <input
                              type="radio"
                              name={field.name}
                              value={option.value}
                              checked={field.value === option.value}
                              disabled={isPending || isLocked}
                              onChange={() => {
                                field.onChange(option.value);
                                setServerError(null);
                              }}
                              className="accent-primary"
                            />
                            <span className="text-sm">{option.label}</span>
                          </label>
                        ))}
                      </div>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                <div className="text-muted-foreground flex items-center gap-2 text-sm">
                  <MapPin className="size-4" />
                  <span>Екатеринбург</span>
                </div>

                <Controller
                  name="district"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={field.name}>Район *</FieldLabel>
                      <Input
                        id={field.name}
                        placeholder="Например, Уралмаш"
                        className="h-12 rounded-lg!"
                        aria-invalid={fieldState.invalid}
                        disabled={isPending || isLocked}
                        {...field}
                        onChange={(event) => {
                          field.onChange(event);
                          setServerError(null);
                        }}
                      />
                      <p className="text-muted-foreground text-sm">
                        Точный адрес и время встречи можно уточнить в переписке.
                      </p>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </FieldGroup>
            </CardContent>
          </Card>

          {serverError && (
            <Alert variant="destructive">
              <AlertTitle>
                {createdItemId
                  ? "Не все фото загружены"
                  : "Не удалось отправить"}
              </AlertTitle>
              <AlertDescription>
                {serverError}{" "}
                {createdItemId && (
                  <Link to={`/item/${createdItemId}`}>Открыть объявление</Link>
                )}
              </AlertDescription>
            </Alert>
          )}

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

          <div className="flex flex-wrap items-center gap-3">
            <Button type="submit" className="h-11" disabled={isPending}>
              {isPending
                ? "Публикуем..."
                : createdItemId
                  ? "Повторить загрузку фото"
                  : "Опубликовать"}
            </Button>
            <Button
              type="button"
              variant="ghost"
              disabled={isPending}
              onClick={() => navigate("/catalog")}
              className="h-11"
            >
              Отмена
            </Button>
          </div>
        </div>

        <aside className="lg:sticky lg:top-24">
          <h2 className="mb-3 text-lg font-semibold">Предпросмотр</h2>
          <div className="max-w-[320px]">
            <ItemCard item={previewItem} preview />
          </div>
          {photos.length > 0 && (
            <p className="text-muted-foreground mt-2 text-sm">
              Фото: {photos.length}
              {uploadedPhotoCount > 0
                ? ` · Загружено: ${uploadedPhotoCount}`
                : ""}
            </p>
          )}
        </aside>
      </form>
    </section>
  );
}
