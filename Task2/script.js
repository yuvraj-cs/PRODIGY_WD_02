// DOM Elements
const minutesElement = document.getElementById('minutes');
const secondsElement = document.getElementById('seconds');
const millisecondsElement = document.getElementById('milliseconds');
const startButton = document.getElementById('start-btn');
const pauseButton = document.getElementById('pause-btn');
const resetButton = document.getElementById('reset-btn');
const lapButton = document.getElementById('lap-btn');
const clearLapsButton = document.getElementById('clear-laps-btn');
const saveLapsButton = document.getElementById('save-laps-btn');
const lapsList = document.getElementById('laps-list');
const stopwatchElement = document.querySelector('.stopwatch');
const themeButtons = document.querySelectorAll('.theme-btn');

// Stopwatch variables
let startTime;
let elapsedTime = 0;
let timerInterval;
let lapCount = 0;
let isRunning = false;
let lastLapTime = 0;

// Sound effects
const clickSound = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-simple-countdown-922.mp3');
const lapSound = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-fast-small-sweep-transition-166.mp3');
const resetSound = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-unlock-game-notification-253.mp3');

// Adjust sound volume
clickSound.volume = 0.3;
lapSound.volume = 0.3;
resetSound.volume = 0.3;

// Event listeners
startButton.addEventListener('click', startStopwatch);
pauseButton.addEventListener('click', pauseStopwatch);
resetButton.addEventListener('click', resetStopwatch);
lapButton.addEventListener('click', recordLap);
clearLapsButton.addEventListener('click', clearLaps);
saveLapsButton.addEventListener('click', saveLaps);

// Theme selection
themeButtons.forEach(button => {
    button.addEventListener('click', () => {
        const theme = button.getAttribute('data-theme');
        setTheme(theme);
        
        // Update active button
        themeButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        
        // Play sound
        clickSound.currentTime = 0;
        clickSound.play();
    });
});

// Set default theme as active
document.querySelector('[data-theme="default"]').classList.add('active');

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Prevent shortcuts when typing in input fields
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    
    switch(e.key.toLowerCase()) {
        case ' ':
            e.preventDefault();
            if (isRunning) {
                pauseStopwatch();
            } else {
                startStopwatch();
            }
            break;
        case 'r':
            e.preventDefault();
            if (!startButton.disabled || !pauseButton.disabled) {
                resetStopwatch();
            }
            break;
        case 'l':
            e.preventDefault();
            if (!lapButton.disabled) {
                recordLap();
            }
            break;
        case 'c':
            e.preventDefault();
            if (!clearLapsButton.disabled) {
                clearLaps();
            }
            break;
    }
});

// Format time to display with leading zeros
function formatTime(time, digits = 2) {
    return time.toString().padStart(digits, '0');
}

// Update the display with current time
function updateDisplay() {
    const currentTime = Date.now() - startTime + elapsedTime;
    
    const milliseconds = Math.floor((currentTime % 1000) / 10);
    const seconds = Math.floor((currentTime / 1000) % 60);
    const minutes = Math.floor((currentTime / (1000 * 60)) % 60);
    
    millisecondsElement.textContent = formatTime(milliseconds);
    secondsElement.textContent = formatTime(seconds);
    minutesElement.textContent = formatTime(minutes);
    
    // Update document title with current time
    document.title = `${formatTime(minutes)}:${formatTime(seconds)} - Stopwatch`;
    
    return currentTime;
}

// Start the stopwatch
function startStopwatch() {
    if (!isRunning) {
        isRunning = true;
        startTime = Date.now();
        
        timerInterval = setInterval(updateDisplay, 10);
        
        // Update button states
        startButton.disabled = true;
        pauseButton.disabled = false;
        resetButton.disabled = false;
        lapButton.disabled = false;
        
        // Add animation class
        stopwatchElement.classList.add('active-stopwatch');
        
        // Play sound
        clickSound.currentTime = 0;
        clickSound.play();
        
        // Add button press effect
        addButtonPressEffect(startButton);
    }
}

// Pause the stopwatch
function pauseStopwatch() {
    if (isRunning) {
        isRunning = false;
        clearInterval(timerInterval);
        elapsedTime += Date.now() - startTime;
        
        // Update button states
        startButton.disabled = false;
        pauseButton.disabled = true;
        
        // Remove animation class
        stopwatchElement.classList.remove('active-stopwatch');
        
        // Play sound
        clickSound.currentTime = 0;
        clickSound.play();
        
        // Add button press effect
        addButtonPressEffect(pauseButton);
    }
}

// Reset the stopwatch
function resetStopwatch() {
    // Clear the interval
    clearInterval(timerInterval);
    
    // Reset variables
    isRunning = false;
    elapsedTime = 0;
    lapCount = 0;
    lastLapTime = 0;
    
    // Reset display
    millisecondsElement.textContent = '00';
    secondsElement.textContent = '00';
    minutesElement.textContent = '00';
    document.title = 'Stopwatch Application';
    
    // Clear laps list
    lapsList.innerHTML = '';
    
    // Update button states
    startButton.disabled = false;
    pauseButton.disabled = true;
    resetButton.disabled = true;
    lapButton.disabled = true;
    clearLapsButton.disabled = true;
    saveLapsButton.disabled = true;
    
    // Remove animation class
    stopwatchElement.classList.remove('active-stopwatch');
    
    // Play sound
    resetSound.currentTime = 0;
    resetSound.play();
    
    // Add button press effect
    addButtonPressEffect(resetButton);
}

// Format time for display in lap list
function formatTimeForDisplay(timeInMs) {
    const milliseconds = Math.floor((timeInMs % 1000) / 10);
    const seconds = Math.floor((timeInMs / 1000) % 60);
    const minutes = Math.floor((timeInMs / (1000 * 60)) % 60);
    
    return `${formatTime(minutes)}:${formatTime(seconds)}:${formatTime(milliseconds)}`;
}

// Record a lap time
function recordLap() {
    if (isRunning) {
        lapCount++;
        const currentTime = updateDisplay();
        const lapTime = currentTime - lastLapTime;
        lastLapTime = currentTime;
        
        // Create lap item
        const lapItem = document.createElement('li');
        
        // Create lap number element
        const lapNumberElement = document.createElement('span');
        lapNumberElement.classList.add('lap-number');
        lapNumberElement.textContent = `Lap ${lapCount}`;
        
        // Create lap time element
        const lapTimeElement = document.createElement('span');
        lapTimeElement.classList.add('lap-time');
        lapTimeElement.textContent = formatTimeForDisplay(lapTime);
        
        // Add elements to lap item
        lapItem.appendChild(lapNumberElement);
        lapItem.appendChild(lapTimeElement);
        
        // Add lap item to list (at the beginning)
        lapsList.insertBefore(lapItem, lapsList.firstChild);
        
        // Add highlight animation to the new lap
        lapItem.style.animation = 'fadeIn 0.5s';
        
        // Enable clear and save buttons
        clearLapsButton.disabled = false;
        saveLapsButton.disabled = false;
        
        // Play sound
        lapSound.currentTime = 0;
        lapSound.play();
        
        // Add button press effect
        addButtonPressEffect(lapButton);
    }
}

// Clear all lap times
function clearLaps() {
    lapsList.innerHTML = '';
    clearLapsButton.disabled = true;
    saveLapsButton.disabled = true;
    
    // Play sound
    resetSound.currentTime = 0;
    resetSound.play();
    
    // Add button press effect
    addButtonPressEffect(clearLapsButton);
}

// Save lap times
function saveLaps() {
    if (lapsList.children.length === 0) return;
    
    let lapData = 'Stopwatch Lap Times\n';
    lapData += '===================\n\n';
    
    // Convert NodeList to Array and reverse to get chronological order
    Array.from(lapsList.children)
        .reverse()
        .forEach(lap => {
            const lapNumber = lap.querySelector('.lap-number').textContent;
            const lapTime = lap.querySelector('.lap-time').textContent;
            lapData += `${lapNumber}: ${lapTime}\n`;
        });
    
    // Create a blob and download link
    const blob = new Blob([lapData], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'stopwatch_laps.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    // Play sound
    clickSound.currentTime = 0;
    clickSound.play();
    
    // Add button press effect
    addButtonPressEffect(saveLapsButton);
}

// Set theme
function setTheme(theme) {
    document.body.className = '';
    
    switch(theme) {
        case 'dark':
            document.body.classList.add('dark-theme');
            break;
        case 'neon':
            document.body.classList.add('neon-theme');
            break;
        default:
            // Default theme, no class needed
            break;
    }
    
    // Save theme preference
    localStorage.setItem('stopwatch-theme', theme);
}

// Add button press effect
function addButtonPressEffect(button) {
    button.classList.add('pressed');
    setTimeout(() => {
        button.classList.remove('pressed');
    }, 200);
}

// Load saved theme preference
function loadSavedTheme() {
    const savedTheme = localStorage.getItem('stopwatch-theme') || 'default';
    setTheme(savedTheme);
    
    // Update active button
    document.querySelector(`[data-theme="${savedTheme}"]`).classList.add('active');
}

// Add CSS for animations
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(-10px); }
        to { opacity: 1; transform: translateY(0); }
    }
    
    .pressed {
        transform: scale(0.95) !important;
        opacity: 0.9;
    }
    
    .time-display span {
        display: inline-block;
        transition: transform 0.1s;
    }
    
    .time-display span.changed {
        transform: scale(1.1);
    }
`;
document.head.appendChild(style);

// Initialize theme on load
loadSavedTheme();