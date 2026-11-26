
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
DATE FUNCTIONALITY
*/

// Cache for date formatting to avoid repeated calculations
let lastDate = null;
let cachedFecha = '';

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



/* WALLPAPER FUNCTIONALITY */


const wallpaperNext = document.getElementById('wallpaperNext');
const WallpaperLast = document.getElementById('WallpaperLast');
const reloj = document.getElementById('reloj');
const videoElement = document.getElementById('myVideo');
let currentWallpaper = parseInt(localStorage.getItem('currentWallpaper') || '0');

videoElement.src = `./wallpapers/${wallpapers[currentWallpaper]}`;

function changeWallpaper(movement) {
	if (movement === 'next') {
		currentWallpaper = (currentWallpaper + 1) % wallpapers.length;
	} else if (movement === 'last') {
		currentWallpaper = (currentWallpaper - 1 + wallpapers.length) % wallpapers.length;
	}
	videoElement.src = `./wallpapers/${wallpapers[currentWallpaper]}`;
	localStorage.setItem('currentWallpaper', currentWallpaper);
}

wallpaperNext.addEventListener('click', () => changeWallpaper('next'));
WallpaperLast.addEventListener('click', () => changeWallpaper('last'));

// Date click fullscreen
elementoFecha.addEventListener('click', () => {
	if (document.fullscreenElement) {
		document.exitFullscreen();
	} else {
		document.documentElement.requestFullscreen().catch(() => { });
	}
});

function playPause() {
	if (videoElement.paused) {
		videoElement.play();
	} else {
		videoElement.pause();
	}
}

function displayWallpaperSelection() {
	const wallpaperSelection = document.getElementById('wallpaper-selection');
	wallpaperSelection.style.display = 'grid';
	wallpaperSelection.classList.add('animated-wallpaper-selection');
}
function hideWallpaperSelection() {
	const wallpaperSelection = document.getElementById('wallpaper-selection');
	wallpaperSelection.style.display = 'none';
	wallpaperSelection.classList.remove('animated-wallpaper-selection');
}


/* DEBUG INFO */

reloj.addEventListener('click', () => {
	playPause();
});
reloj.addEventListener('contextmenu', () => {
	switchDebugInfo();
});

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
	debugInfo.innerHTML = `Version:202610051<br>Screen: ${wScreen.width}x${wScreen.height}<br>Page Size: ${window.innerWidth}x${window.innerHeight}<br>Orientation: ${window.innerWidth > window.innerHeight ? 'Landscape' : 'Portrait'}<br>Pixel Depth: ${wScreen.pixelDepth} bits`;
}

window.addEventListener('resize', () => {
	displayDebugInfo();
});
switchDebugInfo();
switchDebugInfo();




/* FILE DOWNLOAD FUNCTIONALITY */

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
