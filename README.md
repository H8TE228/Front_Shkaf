# Добрый Шкаф

## Установка Bun

Если Bun ещё не установлен, установите его одним из способов:

### Windows

Откройте PowerShell и выполните:

```powershell
powershell -c "irm bun.sh/install.ps1 | iex"
```

После установки перезапустите терминал и проверьте:

```powershell
bun --version
```

### Linux / macOS

```powershell
curl -fsSL https://bun.sh/install | bash
```

После установки проверьте:

```powershell
bun --version
```

## Установка

Установите зависимости приложения командой:

```sh
npm install
```

или

```sh
bun install
```

## Яндекс Карты

Создайте файл `.env` на основе `.env.example` и укажите два ключа Яндекс:

```env
VITE_YANDEX_MAPS_API_KEY_JS3=ваш_ключ_JavaScript_API
VITE_YANDEX_MAPS_API_KEY_GEOCODER=ваш_ключ_Геокодера
```

- `VITE_YANDEX_MAPS_API_KEY_JS3` — ключ пакета «JavaScript API» для отображения
  карты.
- `VITE_YANDEX_MAPS_API_KEY_GEOCODER` — ключ API Геокодера для определения
  города по координатам.

Ключ JavaScript API должен быть активным. В поле HTTP Referer добавьте `localhost`
для разработки или домен сайта для продакшна. После изменения `.env`
перезапустите сервер разработки. Если Яндекс Карты недоступны, на карте пунктов
и в карточке пункта загружается резервная карта OpenStreetMap.

**Ключи заработают примерно через 15 мин**

## Режим разработки

Запустите приложение в режиме разработки командой:

```sh
npm run dev
```

или

```sh
bun run dev
```

## Режим продакшн

Соберите приложение для продакшна командой:

```sh
npm run build
```

или

```sh
bun run build
```
