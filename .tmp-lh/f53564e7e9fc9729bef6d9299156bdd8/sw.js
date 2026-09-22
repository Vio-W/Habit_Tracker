import {registerRoute as workbox_routing_registerRoute} from 'C:/Users/User/OneDrive - American University of Phnom Penh/Desktop/Habit-Tracker/habit-tracker/node_modules/workbox-routing/registerRoute.mjs';
import {ExpirationPlugin as workbox_expiration_ExpirationPlugin} from 'C:/Users/User/OneDrive - American University of Phnom Penh/Desktop/Habit-Tracker/habit-tracker/node_modules/workbox-expiration/ExpirationPlugin.mjs';
import {CacheFirst as workbox_strategies_CacheFirst} from 'C:/Users/User/OneDrive - American University of Phnom Penh/Desktop/Habit-Tracker/habit-tracker/node_modules/workbox-strategies/CacheFirst.mjs';
import {NetworkFirst as workbox_strategies_NetworkFirst} from 'C:/Users/User/OneDrive - American University of Phnom Penh/Desktop/Habit-Tracker/habit-tracker/node_modules/workbox-strategies/NetworkFirst.mjs';
import {precacheAndRoute as workbox_precaching_precacheAndRoute} from 'C:/Users/User/OneDrive - American University of Phnom Penh/Desktop/Habit-Tracker/habit-tracker/node_modules/workbox-precaching/precacheAndRoute.mjs';
import {cleanupOutdatedCaches as workbox_precaching_cleanupOutdatedCaches} from 'C:/Users/User/OneDrive - American University of Phnom Penh/Desktop/Habit-Tracker/habit-tracker/node_modules/workbox-precaching/cleanupOutdatedCaches.mjs';
import {NavigationRoute as workbox_routing_NavigationRoute} from 'C:/Users/User/OneDrive - American University of Phnom Penh/Desktop/Habit-Tracker/habit-tracker/node_modules/workbox-routing/NavigationRoute.mjs';
import {createHandlerBoundToURL as workbox_precaching_createHandlerBoundToURL} from 'C:/Users/User/OneDrive - American University of Phnom Penh/Desktop/Habit-Tracker/habit-tracker/node_modules/workbox-precaching/createHandlerBoundToURL.mjs';/**
 * Welcome to your Workbox-powered service worker!
 *
 * You'll need to register this file in your web app.
 * See https://goo.gl/nhQhGp
 *
 * The rest of the code is auto-generated. Please don't update this file
 * directly; instead, make changes to your Workbox build configuration
 * and re-run your build process.
 * See https://goo.gl/2aRDsh
 */




self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

/**
 * The precacheAndRoute() method efficiently caches and responds to
 * requests for URLs in the manifest.
 * See https://goo.gl/S9QRab
 */
workbox_precaching_precacheAndRoute([
  {
    "url": "index.html",
    "revision": "d68b1ee9a79b1799d1e282703b0783f9"
  },
  {
    "url": "icons.svg",
    "revision": "3b4fcfcf393eca4d264dca4a4663bc37"
  },
  {
    "url": "favicon.svg",
    "revision": "7e840862161341271697daa99a40d76b"
  },
  {
    "url": "icons/icon-apple-180.png",
    "revision": "e1824e3ad87d23a5d62c560542f6b8ee"
  },
  {
    "url": "icons/icon-apple-167.png",
    "revision": "b986650558f9098aec884dce68c4b0df"
  },
  {
    "url": "icons/icon-apple-152.png",
    "revision": "74ba2c11a432fb3e844c11bae6031c3f"
  },
  {
    "url": "icons/icon-apple-120.png",
    "revision": "aaa8e8eb487d5fb6f3b269f697228d2b"
  },
  {
    "url": "icons/icon-96.png",
    "revision": "ebdcd567631092d33f4205c0aac2d26e"
  },
  {
    "url": "icons/icon-72.png",
    "revision": "8da01c26902031b37265e6fff32a57fc"
  },
  {
    "url": "icons/icon-512.png",
    "revision": "b4ede0a691f5ccb12d32e25ec7fc1882"
  },
  {
    "url": "icons/icon-384.png",
    "revision": "075b872b8c43f6a2e49e811588d7106c"
  },
  {
    "url": "icons/icon-256.png",
    "revision": "4d40132de1a39815c0f01dc4e5c052a6"
  },
  {
    "url": "icons/icon-192.png",
    "revision": "7c5488d56201e7164bdc232dfb5b7aed"
  },
  {
    "url": "icons/icon-152.png",
    "revision": "1456d923b94a1efa04966073ef515b46"
  },
  {
    "url": "icons/icon-144.png",
    "revision": "ac86f787481cbcba6389826b9b8a7929"
  },
  {
    "url": "icons/icon-128.png",
    "revision": "8eee6e54f7095551e0d22f23f42a353b"
  },
  {
    "url": "assets/workbox-window.prod.es5-Bd17z0YL.js",
    "revision": null
  },
  {
    "url": "assets/index-CtVGDxKS.js",
    "revision": null
  },
  {
    "url": "assets/index-BX3UwV1G.css",
    "revision": null
  },
  {
    "url": "favicon.svg",
    "revision": "7e840862161341271697daa99a40d76b"
  },
  {
    "url": "icons/icon-128.png",
    "revision": "8eee6e54f7095551e0d22f23f42a353b"
  },
  {
    "url": "icons/icon-144.png",
    "revision": "ac86f787481cbcba6389826b9b8a7929"
  },
  {
    "url": "icons/icon-152.png",
    "revision": "1456d923b94a1efa04966073ef515b46"
  },
  {
    "url": "icons/icon-192.png",
    "revision": "7c5488d56201e7164bdc232dfb5b7aed"
  },
  {
    "url": "icons/icon-256.png",
    "revision": "4d40132de1a39815c0f01dc4e5c052a6"
  },
  {
    "url": "icons/icon-384.png",
    "revision": "075b872b8c43f6a2e49e811588d7106c"
  },
  {
    "url": "icons/icon-512.png",
    "revision": "b4ede0a691f5ccb12d32e25ec7fc1882"
  },
  {
    "url": "icons/icon-72.png",
    "revision": "8da01c26902031b37265e6fff32a57fc"
  },
  {
    "url": "icons/icon-96.png",
    "revision": "ebdcd567631092d33f4205c0aac2d26e"
  },
  {
    "url": "icons/icon-apple-120.png",
    "revision": "aaa8e8eb487d5fb6f3b269f697228d2b"
  },
  {
    "url": "icons/icon-apple-152.png",
    "revision": "74ba2c11a432fb3e844c11bae6031c3f"
  },
  {
    "url": "icons/icon-apple-167.png",
    "revision": "b986650558f9098aec884dce68c4b0df"
  },
  {
    "url": "icons/icon-apple-180.png",
    "revision": "e1824e3ad87d23a5d62c560542f6b8ee"
  },
  {
    "url": "manifest.webmanifest",
    "revision": "e71bbd4ce914e542f4dceead7687fb47"
  }
], {});
workbox_precaching_cleanupOutdatedCaches();workbox_routing_registerRoute(new workbox_routing_NavigationRoute(workbox_precaching_createHandlerBoundToURL("index.html")));
workbox_routing_registerRoute(({ request }) => request.destination === "image", new workbox_strategies_CacheFirst({ "cacheName":"habit-images", plugins: [new workbox_expiration_ExpirationPlugin({ maxEntries: 50, maxAgeSeconds: 604800 })] }), 'GET');
workbox_routing_registerRoute(({ url }) => url.origin.includes("supabase") || url.pathname.includes("/rest/v1/") || url.pathname.includes("/storage/v1/"), new workbox_strategies_NetworkFirst({ "cacheName":"habit-api","networkTimeoutSeconds":5, plugins: [new workbox_expiration_ExpirationPlugin({ maxEntries: 50, maxAgeSeconds: 86400 })] }), 'GET');


