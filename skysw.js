//https://developer.mozilla.org/ja/docs/Web/Progressive_web_apps/Offline_Service_workers
//https://developers.google.com/web/fundamentals/primers/service-workers?hl=ja
const cacheName='cache200906_1',STATIC_DATA=[
	'index.html',
	'style.js',
	'img/sky.svg',

	//info
	'info.html',
	'00.JPG','01.JPG','02.JPG',
	'10.JPG','11.JPG','12.JPG',
	'20.JPG','21.JPG',
	'30.JPG','31.JPG','32.JPG',
	'40.JPG','41.JPG',

	//instr
	'instr.html',
	'https://tonejs.github.io/build/Tone.js',
	'https://cdn.jsdelivr.net/npm/js-cookie@rc/dist/js.cookie.min.js',
	'img/tex.png',
	'audio/instr/musicbox/a3.mp3',
	'audio/instr/musicbox/a4.mp3',
	'audio/instr/musicbox/a5.mp3',
	'audio/instr/musicbox/a6.mp3',
	'audio/instr/musicbox/ds4.mp3',
	'audio/instr/musicbox/ds5.mp3',
	'audio/instr/musicbox/ds6.mp3',
	'audio/instr/musicbox/ds7.mp3'
];

self.addEventListener('install',(e)=>{
	e.waitUntil(
		caches.open(cacheName).then((cache)=>{
			return cache.addAll(STATIC_DATA);
		})
	);
	console.log('[ServiceWorker] Install');
});
self.addEventListener('activate',(e)=>{
	console.log('[ServiceWorker] Activate')
	e.waitUntil(
		caches.keys().then((keyList)=>{
			return Promise.all(keyList.map((key)=>{
				if(key !== cacheName){return caches.delete(key);}
			}));
		})
	);
});
self.addEventListener('fetch',(e)=>{
	e.respondWith(
		caches.match(e.request).then((r)=>{
			console.log('[ServiceWorker] Fetching resource: '+e.request.url);
			return r || fetch(e.request).then((response)=>{
				return caches.open(cacheName).then((cache)=>{
					console.log('[ServiceWorker] Caching new resource: '+e.request.url);
					cache.put(e.request,response.clone());
					return response;
				});
			});
		})
	);
});
