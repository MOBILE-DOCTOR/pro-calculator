// service-worker.js
// This is a basic service worker for PWA functionality.

const CACHE_NAME = 'my-app-cache-v1';
// List of URLs to cache when the service worker is installed.
// This should include all static assets that your app needs to function offline.
// IMPORTANT: These paths are relative to the *root of the deployed PWA*.
// For GitHub Pages: https://mobile-doctor.github.io/pro-calculator/my-download-app/
// So, the actual path is relative to 'my-download-app/'
const urlsToCache = [
    '/pro-calculator/my-download-app/', // Root of your React app
    '/pro-calculator/my-download-app/index.html',
    // Vite generates assets with hashes, so we'll rely on network-first for them
    // or you'd need to dynamically cache them. For simplicity, we cache the main entry.
    // The main JS/CSS bundles are typically loaded by index.html and handled by Vite's build output.
    // If you add icons to public/icons, include them here:
    '/pro-calculator/my-download-app/icons/icon-192x192.png',
    '/pro-calculator/my-download-app/icons/icon-512x512.png'
];

// Install event: caches the static assets
self.addEventListener('install', (event) => {
    console.log('[Service Worker] Installing...');
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('[Service Worker] Caching app shell');
                return cache.addAll(urlsToCache);
            })
            .catch(error => {
                console.error('[Service Worker] Cache addAll failed:', error);
            })
    );
    self.skipWaiting(); // Activates the service worker immediately
});

// Activate event: cleans up old caches
self.addEventListener('activate', (event) => {
    console.log('[Service Worker] Activating...');
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('[Service Worker] Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    self.clients.claim(); // Ensures the active service worker controls all clients immediately
});

// Fetch event: serves cached content first, then falls back to network
self.addEventListener('fetch', (event) => {
    // Only handle HTTP/HTTPS requests, ignore chrome-extension:// etc.
    if (!event.request.url.startsWith('http')) {
        return;
    }

    // Skip requests that contain common development-related query parameters
    const url = new URL(event.request.url);
    if (url.searchParams.has('__vite_update__')) {
        return;
    }

    event.respondWith(
        caches.match(event.request).then((response) => {
            // Return cached response if found
            if (response) {
                return response;
            }
            // If not in cache, fetch from network
            return fetch(event.request)
                .then((networkResponse) => {
                    // Cache new requests for future use
                    if (networkResponse.ok && networkResponse.type === 'basic') {
                        const clonedResponse = networkResponse.clone();
                        caches.open(CACHE_NAME).then((cache) => {
                            cache.put(event.request, clonedResponse);
                        });
                    }
                    return networkResponse;
                })
                .catch(() => {
                    // Fallback for network errors (e.g., offline)
                    // You might want to serve a specific offline page here
                    console.log('[Service Worker] Network request failed for:', event.request.url);
                    // For simplicity, just return a network error or a fallback
                    return new Response('<h1>Offline</h1><p>Please check your internet connection.</p>', {
                        headers: { 'Content-Type': 'text/html' }
                    });
                });
        })
    );
});
