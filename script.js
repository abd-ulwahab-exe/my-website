
function updateClocks() {
  const now = new Date();

  const damascusTimeString = now.toLocaleTimeString('en-US', {
    timeZone: 'Asia/Damascus',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });
  document.getElementById('damascus-time').innerHTML = `${damascusTimeString} - <span class="timezone">Damascus</span>`;

  const utcTimeString = now.toLocaleTimeString('en-US', {
    timeZone: 'UTC',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });
  document.getElementById('utc-time').innerHTML = `${utcTimeString} - <span class="timezone">UTC</span>`;
}

updateClocks();
setInterval(updateClocks, 1000);

// 2. تفعيل زر اللغة
const langBtn = document.getElementById('lang-toggle');
let currentLang = 'en';

langBtn.addEventListener('click', () => {
  if (currentLang === 'en') {
    currentLang = 'ar';
    langBtn.textContent = 'English';
    document.documentElement.dir = 'rtl';
    document.documentElement.lang = 'ar';
  } else {
    currentLang = 'en';
    langBtn.textContent = 'العربية';
    document.documentElement.dir = 'ltr';
    document.documentElement.lang = 'en';
  }

  const translatableElements = document.querySelectorAll('[data-en]');
  translatableElements.forEach(el => {
    el.textContent = el.getAttribute(`data-${currentLang}`);
  });
});

// 3. عداد الزيارات المحلي
function initVisitorCounter() {
  let visits = localStorage.getItem('abdulwahab_visits') || 0;
  visits = parseInt(visits) + 1;
  localStorage.setItem('abdulwahab_visits', visits);
  document.getElementById('visits-count').textContent = visits;
}

initVisitorCounter();

// 4. نسخ حساب الديسكورد عند الضغط على الأيقونة
const discordBtn = document.getElementById('copy-discord');
const toast = document.getElementById('toast');

discordBtn.addEventListener('click', () => {
  navigator.clipboard.writeText('@cw1h').then(() => {
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 3000);
  });
});



// --- 3. Lanyard API Integration ---
const DISCORD_ID = "1395288519735378043";

async function updateLanyard() {
  try {
    const res = await fetch(`https://api.lanyard.rest/v1/users/${DISCORD_ID}`);
    const json = await res.json();

    if (!json.success) return;

    const data = json.data;

    // 1. تحديث نقطة الحالة (online, idle, dnd, offline)
    const statusDot = document.querySelector('.status-dot');
    if (statusDot) {
      statusDot.className = `status-dot ${data.discord_status}`;
    }

    // 2. تحديث نص وشكل شارة الحالة
    // 2. تحديث نص وشكل شارة الحالة تلقائياً
    const statusBadge = document.querySelector('.status-badge');
    if (statusBadge) {
      // نحدد كلاس الشارة ليتغير لونها في CSS
      statusBadge.className = `status-badge ${data.discord_status}`;

      switch (data.discord_status) {
        case 'online':
          statusBadge.textContent = 'Online';
          statusBadge.setAttribute('data-en', 'Online');
          statusBadge.setAttribute('data-ar', 'متصل');
          break;
        case 'idle':
          statusBadge.textContent = 'Idle';
          statusBadge.setAttribute('data-en', 'Idle');
          statusBadge.setAttribute('data-ar', 'خامل');
          break;
        case 'dnd':
          statusBadge.textContent = 'Do Not Disturb';
          statusBadge.setAttribute('data-en', 'Do Not Disturb');
          statusBadge.setAttribute('data-ar', 'ممنوع الإزعاج');
          break;
        case 'offline':
        default:
          statusBadge.textContent = 'Offline';
          statusBadge.setAttribute('data-en', 'Offline');
          statusBadge.setAttribute('data-ar', 'غير متصل');
          break;
      }
    }
    // 3. نشاط Spotify
    const spotifyBox = document.getElementById('spotify-activity') || document.getElementById('Spotify-activity');
    if (spotifyBox) {
      if (data.listening_to_spotify && data.spotify) {
        spotifyBox.innerHTML = `🎵 <b>${data.spotify.song}</b> - ${data.spotify.artist}`;
        spotifyBox.style.display = 'block';
      } else {
        spotifyBox.style.display = 'none';
      }
    }
  } catch (err) {
    console.error("Lanyard Error:", err);
  }
}

// تشغيل الدالة فوراً والتكرار كل 6 ثوانٍ
updateLanyard();
setInterval(updateLanyard, 6000);