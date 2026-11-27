
const TIMEZONE = "America/Costa_Rica";
const DIAS_SEMANA = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
const elementoReloj = document.getElementById('reloj');
const elementoFecha = document.getElementById('date');
const wallpapers = [
	"vdd(3).mp4",
	"vdd(5).mp4",
	"vdd(14).mp4",
	"vdd(13).mp4",
	"vdd(9).mp4",
	"vdd(10).mp4",
	"vdd(4).mp4",
	"vdd(1).mp4",
	"vdd(2).mp4",
	"vdd(8).mp4",
	"vdd(19).mp4",
	"vdd(20).mp4",
	"vdd(21).mp4",
	"vdd(12).mp4",
	"vdd(15).mp4",
	"vdd(7).mp4",
	"vdd(11).mp4",
	"vdd(6).mp4",
	"vdd(16).webm",
	"vdd(17).webm",
	"vdd(18).mp4",
];


/* 
-----------------------------
DATE FUNCTIONALITY
-----------------------------
*/

// Cache for date formatting to avoid repeated calculations
let lastDate = null;
let cachedFecha = '';
const reloj = document.getElementById('reloj');

function obtenerFechaLocal() {
	return new Date(new Date().toLocaleString("en-US", { timeZone: TIMEZONE }));
}

function formatearHora(fecha) {
	const horas = String(fecha.getHours()).padStart(2, '0');
	const minutos = String(fecha.getMinutes()).padStart(2, '0');
	const segundos = String(fecha.getSeconds()).padStart(2, '0');
	return `${horas}:${minutos}:${segundos}`;
}

function formatearFecha(fecha) {
	const dia = fecha.getDate();
	// Only recalculate if date changed
	if (lastDate !== dia) {
		lastDate = dia;
		const anio = fecha.getFullYear();
		const mes = String(fecha.getMonth() + 1).padStart(2, '0');
		const diaStr = String(dia).padStart(2, '0');
		const diaSemana = DIAS_SEMANA[fecha.getDay()];
		cachedFecha = `${diaSemana}, ${anio}-${mes}-${diaStr}`;
	}
	return cachedFecha;
}

function actualizar() {
	const ahora = obtenerFechaLocal();
	const horaTexto = formatearHora(ahora);
	const fechaTexto = formatearFecha(ahora);

	elementoReloj.textContent = horaTexto;
	elementoReloj.setAttribute('datetime', horaTexto);
	elementoFecha.textContent = fechaTexto;
}

actualizar();
setInterval(actualizar, 1000);

// Date click fullscreen
elementoFecha.addEventListener('click', () => {
	if (document.fullscreenElement) {
		document.exitFullscreen();
	} else {
		document.documentElement.requestFullscreen().catch(() => { });
	}
});

reloj.addEventListener('click', () => {
	playPause();
});
reloj.addEventListener('contextmenu', () => {
	switchDebugInfo();
});



/*
-----------------------------
WALLPAPER FUNCTIONALITY
-----------------------------
*/


const wallpaperNext = document.getElementById('wallpaperNext');
const WallpaperLast = document.getElementById('WallpaperLast');
const videoElement = document.getElementById('myVideo');
const wallpaperSelection = document.getElementById('wallpaper-selection');
let currentWallpaper = localStorage.getItem('currentWallpaper')

videoElement.children[0].src = `./wallpapers/${currentWallpaper}`;
videoElement.load();
videoElement.play().catch(() => { });

wallpapers.forEach((wallpaper, index) => {
	const option = document.createElement('img');
	const thumbnail = wallpaper.replace(/\.[^.]+$/, '.avif');

	option.src = `./wallpapers/as image/${thumbnail}`;
	option.alt = `Wallpaper ${index + 1}`;
	option.className = 'wallpaper-option';
	option.dataset.wallpaper = wallpaper;
	option.addEventListener('click', () => changeWallpaper(option));
	wallpaperSelection.appendChild(option);
});

function changeWallpaper(infoSelection) {
	let videoElementToSet = infoSelection.dataset.wallpaper

	/* if wallpaper is the same, don't do anything */
	if (videoElementToSet === currentWallpaper) {
		return;
	}

	videoElement.children[0].src = `./wallpapers/${videoElementToSet}`;
	localStorage.setItem('currentWallpaper', videoElementToSet);
	currentWallpaper = videoElementToSet;
	videoElement.load();
	videoElement.play().catch(() => { });
	hideWallpaperSelection()
}

wallpaperNext.addEventListener('click', () => displayWallpaperSelection());
WallpaperLast.addEventListener('click', () => displayWallpaperSelection());



function playPause() {
	if (videoElement.paused) {
		videoElement.play();
	} else {
		videoElement.pause();
	}
}

var wallpaperDisplayed = false;
let wallpaperSelectionTimeout;

function displayWallpaperSelection() {
	if (wallpaperDisplayed) {
		hideWallpaperSelection();
		return;
	}
	const wallpaperSelection = document.getElementById('wallpaper-selection');
	wallpaperSelection.style.display = 'grid';
	wallpaperSelection.classList.add('animated-wallpaper-selection');
	wallpaperDisplayed = true;
	wallpaperSelectionTimeout = setTimeout(() => {
		hideWallpaperSelection();
	}, 15000);
}
function hideWallpaperSelection() {
	const wallpaperSelection = document.getElementById('wallpaper-selection');
	wallpaperSelection.classList.remove('animated-wallpaper-selection');
	wallpaperSelection.style.display = 'none';
	wallpaperDisplayed = false;
	clearTimeout(wallpaperSelectionTimeout);
}



/*
-----------------------------
DEBUG INFO
-----------------------------
*/

function switchDebugInfo() {
	const debugInfo = document.getElementById('debug-info');
	if (debugInfo.style.display === 'none') {
		debugInfo.style.display = 'block';
		displayDebugInfo();
	} else {
		debugInfo.style.display = 'none';
	}
}
function displayDebugInfo() {
	const debugInfo = document.getElementById('debug-info');
	const wScreen = window.screen;
	debugInfo.innerHTML = `Version:202611272<br>Screen: ${wScreen.width}x${wScreen.height}<br>Page Size: ${window.innerWidth}x${window.innerHeight}<br>Orientation: ${window.innerWidth > window.innerHeight ? 'Landscape' : 'Portrait'}<br>Pixel Depth: ${wScreen.pixelDepth} bits<br>Color Depth: ${wScreen.colorDepth} bits<br>Current Wallpaper: ${currentWallpaper}`;
}

window.addEventListener('resize', () => {
	displayDebugInfo();
});
/* switchDebugInfo();
switchDebugInfo(); */




/*
-----------------------------
FILE DOWNLOAD FUNCTIONALITY
-----------------------------
*/

/* CTRL ALT SHIFT PageUp keys pressed */
document.addEventListener('keydown', (e) => {
	if (e.ctrlKey && e.altKey && e.shiftKey && e.code === 'PageUp') {
		downloadFile();
	}
});

function downloadFile() {
	const fileName = 'doc-20261108.pdf';

	if (!fileExists(`./bridge/${fileName}`)) {
		elementoFecha.style.color = 'red';
		return;
	}

	const link = document.createElement('a');
	link.href = `./bridge/${fileName}`;
	link.download = 'Print.pdf';
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
}

function fileExists(url) {
	const xhr = new XMLHttpRequest();
	xhr.open('HEAD', url, false);
	xhr.send();
	return xhr.status !== 404;
}
