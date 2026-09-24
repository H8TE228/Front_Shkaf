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
