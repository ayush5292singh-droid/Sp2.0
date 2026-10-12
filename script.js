// State Management
let currentObStep = 0;
let userProfile = JSON.parse(localStorage.getItem('studyx_profile')) || {
    name: 'Ayush Singh',
    email: 'ayush5292singh@gmail.com',
    class: 'Class 8 ICSE',
    roll: '12',
    reg: 'SX-2026',
    targetExam: 'Final Exams',
    targetDate: '2027-03-15',
    effortHours: 4
};

let tasks = JSON.parse(localStorage.getItem('studyx_tasks')) || [];
let notes = JSON.parse(localStorage.getItem('studyx_notes')) || [];
let timerSeconds = 0;
let timerInterval = null;

window.onload = function() {
    if (localStorage.getItem('studyx_onboarded') === 'true') {
        document.getElementById('onboarding-overlay').style.display = 'none';
    }
    updateProfileDisplays();
    startCountdown();
    renderTasks();
};

// Onboarding Logic
function nextObStep() {
    const steps = document.querySelectorAll('.ob-step');
    const dots = document.querySelectorAll('.ob-dots .dot');

    steps[currentObStep].classList.remove('active');
    if (dots[currentObStep]) dots[currentObStep].classList.remove('active');

    currentObStep++;

    if (currentObStep < steps.length) {
        steps[currentObStep].classList.add('active');
        if (dots[currentObStep]) dots[currentObStep].classList.add('active');
    }
}

function setTargetMode(mode) {
    document.getElementById('btn-has-date').classList.toggle('active', mode === 'date');
    document.getElementById('btn-no-date').classList.toggle('active', mode === 'later');
    document.getElementById('target-inputs').style.display = mode === 'date' ? 'flex' : 'none';
}

function skipTargetStep() {
    nextObStep();
}

function selectStruggle(element) {
    document.querySelectorAll('.struggle-card').forEach(el => el.classList.remove('active'));
    element.classList.add('active');
}

function updateEffortVal(val) {
    document.getElementById('effort-hours').innerText = `${val} h/day`;
    userProfile.effortHours = val;
}

function completeOnboarding() {
    const examInput = document.getElementById('ob-exam-name').value;
    const dateInput = document.getElementById('ob-exam-date').value;

    if (examInput) userProfile.targetExam = examInput;
    if (dateInput) userProfile.targetDate = dateInput;

    localStorage.setItem('studyx_profile', JSON.stringify(userProfile));
    localStorage.setItem('studyx_onboarded', 'true');
    document.getElementById('onboarding-overlay').style.display = 'none';
    updateProfileDisplays();
    startCountdown();
}

// Sidebar Navigation
function switchTab(tabId, element) {
    document.querySelectorAll('.tab-page').forEach(page => page.classList.remove('active'));
    document.querySelectorAll('.nav-link').forEach(nav => nav.classList.remove('active'));

    document.getElementById(`tab-${tabId}`).classList.add('active');
    if (element) element.classList.add('active');
}

// Countdown Engine
function startCountdown() {
    setInterval(() => {
        if (!userProfile.targetDate) return;
        const target = new Date(userProfile.targetDate).getTime();
        const now = new Date().getTime();
        const diff = target - now;

        if (diff > 0) {
            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const secs = Math.floor((diff % (1000 * 60)) / 1000);

            document.getElementById('cd-days').innerText = String(days).padStart(2, '0');
            document.getElementById('cd-hours').innerText = String(hours).padStart(2, '0');
            document.getElementById('cd-mins').innerText = String(mins).padStart(2, '0');
            document.getElementById('cd-secs').innerText = String(secs).padStart(2, '0');
        }
    }, 1000);
}

// Focus Timer Logic
function setFocusCategory(cat, btn) {
    document.querySelectorAll('.tag-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
}

function setDurationPreset(mins, btn) {
    document.querySelectorAll('.dur-pill').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    timerSeconds = mins * 60;
    updateTimerDisplay();
}

function promptCustomDuration(btn) {
    const mins = prompt('Enter custom focus time in minutes:', '45');
    if (mins) setDurationPreset(parseInt(mins), btn);
}

function updateTimerDisplay() {
    const h = Math.floor(timerSeconds / 3600);
    const m = Math.floor((timerSeconds % 3600) / 60);
    const s = timerSeconds % 60;
    document.getElementById('timer-display').innerText = 
        `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
}

function toggleTimer() {
    const btn = document.getElementById('play-timer-btn');
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
        btn.innerHTML = `<i class="fa-solid fa-play"></i>`;
    } else {
        timerInterval = setInterval(() => {
            timerSeconds++;
            updateTimerDisplay();
        }, 1000);
        btn.innerHTML = `<i class="fa-solid fa-pause"></i>`;
    }
}

function resetTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
    timerSeconds = 0;
    updateTimerDisplay();
    document.getElementById('play-timer-btn').innerHTML = `<i class="fa-solid fa-play"></i>`;
}

// Profile & Storage Updates
function updateProfileDisplays() {
    document.getElementById('id-name').innerText = userProfile.name;
    document.getElementById('id-class').innerText = userProfile.class;
    document.getElementById('id-roll').innerText = `Roll No: ${userProfile.roll}`;
    document.getElementById('id-reg').innerText = `Reg No: ${userProfile.reg}`;
    document.getElementById('account-name-disp').innerText = userProfile.name;
    document.getElementById('account-email-disp').innerText = userProfile.email;
    document.getElementById('cd-title-display').innerText = userProfile.targetExam;
    document.getElementById('avatar-initial').innerText = userProfile.name.charAt(0);
}

function editProfileCard() {
    const newName = prompt('Enter Student Name:', userProfile.name);
    const newClass = prompt('Enter Class / Grade:', userProfile.class);
    if (newName) userProfile.name = newName;
    if (newClass) userProfile.class = newClass;
    localStorage.setItem('studyx_profile', JSON.stringify(userProfile));
    updateProfileDisplays();
}

function resetAllData() {
    if (confirm('Are you sure you want to reset all local Study X data?')) {
        localStorage.clear();
        location.reload();
    }
}
