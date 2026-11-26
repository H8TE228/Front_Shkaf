import type {} from "ymaps3";
import React from "react";
import ReactDom from "react-dom";

async function loadYandexMaps() {
  const key = import.meta.env.VITE_YANDEX_MAPS_API_KEY_JS3?.trim();
  if (!key) throw new Error("Ключ JavaScript API Яндекс Карт не настроен");

  const url = new URL("https://api-maps.yandex.ru/v3/");
  url.search = new URLSearchParams({ apikey: key, lang: "ru_RU" }).toString();
  const script = document.createElement("script");
  script.src = url.href;
  let timer: number | undefined;

  async function initialize() {
    await new Promise<void>((resolve, reject) => {
      script.onload = () => resolve();
      script.onerror = () => reject(new Error("SDK Яндекс Карт недоступен"));
      document.head.append(script);
    });
    if (typeof ymaps3 === "undefined") {
      throw new Error("SDK Яндекс Карт не инициализировался");
    }
    const sdk = ymaps3;
    const [reactifyModule] = await Promise.all([
      sdk.import("@yandex/ymaps3-reactify"),
      sdk.ready,
    ]);
    return { sdk, reactifyModule };
  }

  try {
    return await Promise.race([
      initialize(),
      new Promise<never>((_, reject) => {
        timer = window.setTimeout(
          () => reject(new Error("Яндекс Карты не ответили вовремя")),
          5000,
        );
      }),
    ]);
  } catch (error) {
    script.remove();
    throw error;
  } finally {
    window.clearTimeout(timer);
  }
}

const { sdk, reactifyModule } = await loadYandexMaps();

export const reactify = reactifyModule.reactify.bindTo(React, ReactDom);
export const {
  YMap,
  YMapDefaultSchemeLayer,
  YMapDefaultFeaturesLayer,
  YMapMarker,
} = reactify.module(sdk);
