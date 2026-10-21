/* CampusMate – prototipe web
 * Tanpa framework dan tanpa build step. Navigasi memakai hash (#/beranda, #/jadwal, ...)
 * sehingga bisa langsung di-deploy sebagai situs statis (GitHub Pages, Vercel, dll).
 * Semua data di bawah ini adalah DATA CONTOH, sama seperti pada prototipe PowerPoint.
 */
(function () {
  'use strict';

  /* ------------------------------------------------------------------ */
  /* Data contoh                                                         */
  /* ------------------------------------------------------------------ */
  var DEFAULT_USER = { name: 'Ahmad Satrio Wibowo', prodi: 'Informatika', nim: '2025520060' };

  var SCHEDULE = {
    Sel: {
      label: 'Selasa, 20 Oktober 2026',
      classes: [
        { start: '08:00', end: '09:40', name: 'Struktur Data',   room: 'Lab Komputer 2', sks: 3, type: 'Praktikum' },
        { start: '10:00', end: '11:40', name: 'Basis Data',      room: 'Ruang 204',      sks: 3, type: 'Teori' },
        { start: '13:00', end: '14:40', name: 'Pemrograman Web', room: 'Ruang 301',      sks: 3, type: 'Teori' }
      ]
    }
  };
  var DAYS = [
    ['Sen', 'Senin'], ['Sel', 'Selasa'], ['Rab', 'Rabu'], ['Kam', 'Kamis'], ['Jum', 'Jumat']
  ];

  var TASKS = [
    { id: 't1', title: 'Tugas Struktur Data',           desc: 'Implementasi Linked List', date: '20 Okt 2026', full: '20 Oktober 2026', left: 'Hari ini',   level: 'urgent' },
    { id: 't2', title: 'Laporan Praktikum Basis Data',  desc: 'Basis Data',               date: '22 Okt 2026', full: '22 Oktober 2026', left: '2 hari lagi', level: 'soon' },
    { id: 't3', title: 'Proyek Mini Pemrograman Web',   desc: 'Pemrograman Web',          date: '25 Okt 2026', full: '25 Oktober 2026', left: '5 hari lagi', level: 'later' },
    { id: 't4', title: 'Makalah Pancasila',             desc: 'Pendidikan Pancasila',     date: '28 Okt 2026', full: '28 Oktober 2026', left: '8 hari lagi', level: 'later' }
  ];

  var ANNOUNCEMENTS = [
    { title: 'Jadwal UTS Semester Ganjil telah dirilis', meta: 'Info Akademik • 18 Okt 2026', icon: 'award' },
    { title: 'Pembaruan layanan perpustakaan digital',    meta: 'Perpustakaan • 15 Okt 2026',  icon: 'book' }
  ];

  /* ------------------------------------------------------------------ */
  /* Penyimpanan ringan (aman jika localStorage diblokir)                */
  /* ------------------------------------------------------------------ */
  var store = {
    get: function (k) { try { return JSON.parse(localStorage.getItem(k)); } catch (e) { return null; } },
    set: function (k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* abaikan */ } },
    del: function (k) { try { localStorage.removeItem(k); } catch (e) { /* abaikan */ } }
  };
  var mem = { user: store.get('cm_user'), done: store.get('cm_done') || [], day: 'Sel' };

  function isDone(id) { return mem.done.indexOf(id) !== -1; }
  function pending() { return TASKS.filter(function (t) { return !isDone(t.id); }); }

  /* ------------------------------------------------------------------ */
  /* Util                                                                */
  /* ------------------------------------------------------------------ */
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  var ICON_PATHS = {
    home: '<path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>',
    calendar: '<rect x="3" y="4" width="18" height="17" rx="2"/><path d="M8 2v4M16 2v4M3 10h18"/>',
    clipboard: '<rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 3h6v3H9zM9 12h6M9 16h4"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-6 8-6s8 2 8 6"/>',
    bell: '<path d="M6 8a6 6 0 0 1 12 0c0 7 3 8 3 8H3s3-1 3-8"/><path d="M10 20a2 2 0 0 0 4 0"/>',
    chevron: '<path d="m9 6 6 6-6 6"/>',
    pin: '<path d="M12 21s7-6.2 7-11a7 7 0 0 0-14 0c0 4.8 7 11 7 11z"/><circle cx="12" cy="10" r="2.5"/>',
    check: '<path d="m5 12 5 5 9-10"/>',
    logout: '<path d="M9 4H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h4"/><path d="m16 8 4 4-4 4M20 12H9"/>',
    hash: '<path d="M5 9h14M5 15h14M10 4 8 20M16 4l-2 16"/>',
    mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',
    book: '<path d="M12 6c-2-1.5-5-2-8-2v14c3 0 6 .5 8 2 2-1.5 5-2 8-2V4c-3 0-6 .5-8 2zM12 6v14"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    award: '<circle cx="12" cy="9" r="6"/><path d="m8.5 14-1.5 7 5-3 5 3-1.5-7"/>'
  };
  function icon(name, cls) {
    return '<svg class="ico ' + (cls || '') + '" viewBox="0 0 24 24" aria-hidden="true">' + ICON_PATHS[name] + '</svg>';
  }

  function nickname(user) {
    var parts = user.name.trim().split(/\s+/);
    if (user.name === DEFAULT_USER.name) return 'Satrio';
    return parts[0];
  }
  function initials(user) {
    var parts = user.name.trim().split(/\s+/);
    return (parts[0][0] + (parts[1] ? parts[1][0] : '')).toUpperCase();
  }
  function emailOf(user) { return nickname(user).toLowerCase().replace(/[^a-z0-9]/g, '') + '.mahasiswa@kampus.ac.id'; }
  function angkatan(user) { return /^\d{4}/.test(user.nim) ? user.nim.slice(0, 4) : '2025'; }

  /* ------------------------------------------------------------------ */
  /* Komponen bersama                                                    */
  /* ------------------------------------------------------------------ */
  function header(title, subtitle) {
    return '<header class="app-header">' +
      '<div class="brand-row">' +
        '<div class="brand"><img src="logo-unira.png" alt="Logo Universitas Madura"><span>CampusMate</span></div>' +
        '<button class="icon-btn" type="button" aria-label="Notifikasi" data-action="notif">' + icon('bell') + '</button>' +
      '</div>' +
      '<h1>' + title + '</h1><p>' + subtitle + '</p>' +
    '</header>';
  }

  var NAV = [
    ['beranda', 'Beranda', 'home'],
    ['jadwal',  'Jadwal',  'calendar'],
    ['tugas',   'Tugas',   'clipboard'],
    ['info',    'Info',    'info'],
    ['profil',  'Profil',  'user']
  ];
  function bottomNav(active) {
    return '<nav class="bottom-nav" aria-label="Navigasi utama">' + NAV.map(function (n) {
      return '<a href="#/' + n[0] + '"' + (n[0] === active ? ' aria-current="page"' : '') + '>' + icon(n[2]) + '<span>' + n[1] + '</span></a>';
    }).join('') + '</nav>';
  }

  function page(active, title, subtitle, inner) {
    return '<div class="screen">' + header(title, subtitle) +
      '<section class="content" id="content">' + inner + '</section>' + bottomNav(active) + '</div>';
  }

  /* ------------------------------------------------------------------ */
  /* Layar                                                               */
  /* ------------------------------------------------------------------ */
  function nextDeadline() {
    var p = pending();
    return p.length ? p[0] : null;
  }
  function deadlineBlock(asLinkToInfo, withIcon) {
    var d = nextDeadline();
    var title = d ? d.title : 'Tidak ada tugas';
    var date = d ? d.full + ' • ' + d.left : 'Semua tugas sudah selesai';
    var body = withIcon
      ? '<div class="ico-circle">' + icon('clock') + '</div><div><div class="label">Deadline terdekat</div><div class="title">' + esc(title) + '</div><div class="date">' + esc(date) + '</div></div>'
      : '<div class="label">Deadline terdekat</div><div class="title">' + esc(title) + '</div><div class="date">' + esc(date) + '</div>';
    var cls = 'deadline-card' + (withIcon ? ' with-icon' : '');
    return asLinkToInfo
      ? '<a class="' + cls + '" href="#/info">' + body + '</a>'
      : '<div class="' + cls + '">' + body + '</div>';
  }

  function viewLogin() {
    var u = mem.user || DEFAULT_USER;
    return '<div class="screen dark">' +
      '<div class="login-brand"><img src="logo-unira.png" alt="Logo Universitas Madura"><h1>CampusMate</h1><p>Universitas Madura</p></div>' +
      '<form class="login-card" id="login-form" novalidate>' +
        '<h2>Masuk</h2><p class="sub">Isi identitas akademikmu untuk melanjutkan.</p>' +
        '<div class="field"><label for="f-name">Nama Lengkap</label><div class="input">' + icon('user') + '<input id="f-name" name="name" autocomplete="name" value="' + esc(u.name) + '" required></div></div>' +
        '<div class="field"><label for="f-prodi">Identitas Akademik (Program Studi)</label><div class="input">' + icon('book') + '<input id="f-prodi" name="prodi" value="' + esc(u.prodi) + '" required></div></div>' +
        '<div class="field"><label for="f-nim">NIM</label><div class="input">' + icon('hash') + '<input id="f-nim" name="nim" inputmode="numeric" value="' + esc(u.nim) + '" required></div></div>' +
        '<p class="error" id="login-error" role="alert" hidden></p>' +
        '<button class="btn-primary" type="submit">Masuk</button>' +
      '</form>' +
      '<p class="footnote">Universitas Madura • CampusMate</p>' +
    '</div>';
  }

  function viewBeranda() {
    var u = mem.user;
    var n = pending().length;
    var inner =
      '<a class="card stat" href="#/jadwal"><div class="ico-circle">' + icon('calendar') + '</div>' +
        '<div class="grow"><div class="label">Jadwal hari ini</div><div class="value">' + SCHEDULE.Sel.classes.length + ' Kelas</div></div>' +
        '<span class="arrow">' + icon('chevron') + '</span></a>' +
      '<a class="card stat" href="#/tugas"><div class="ico-circle">' + icon('clipboard') + '</div>' +
        '<div class="grow"><div class="label">Tugas belum selesai</div><div class="value">' + n + ' Tugas</div></div>' +
        '<span class="arrow">' + icon('chevron') + '</span></a>' +
      deadlineBlock(true, false) +
      '<h2>Kelas berikutnya</h2>' +
      '<div class="card next-class"><div class="time"><b>08:00</b><span>09:40</span></div>' +
        '<div><div class="name">Struktur Data</div><div class="where">Lab Komputer 2 • 3 SKS</div></div></div>' +
      '<p class="footnote">20 Oktober 2026</p>';
    return page('beranda', 'Halo, ' + esc(nickname(u)) + '!', 'Mahasiswa ' + esc(u.prodi) + ' • NIM ' + esc(u.nim), inner);
  }

  function viewJadwal() {
    var day = mem.day;
    var data = SCHEDULE[day];
    var dayName = DAYS.filter(function (d) { return d[0] === day; })[0][1];
    var chips = '<div class="days" role="group" aria-label="Pilih hari">' + DAYS.map(function (d) {
      return '<button class="day" type="button" data-day="' + d[0] + '" aria-pressed="' + (d[0] === day) + '">' + d[0] + '</button>';
    }).join('') + '</div>';
    var list = data
      ? data.classes.map(function (c) {
          return '<div class="card class-card"><div class="time-box"><b>' + c.start + '</b><span>' + c.end + '</span></div>' +
            '<div class="class-info"><div class="name">' + esc(c.name) + '</div><div class="where">' + icon('pin') + esc(c.room) + ' • ' + c.sks + ' SKS</div></div>' +
            '<span class="chip">' + esc(c.type) + '</span></div>';
        }).join('')
      : '<div class="empty">Belum ada jadwal contoh untuk hari ' + esc(dayName) + '.<br>Prototipe hanya memuat jadwal hari Selasa.</div>';
    var sub = data ? data.label + ' • ' + data.classes.length + ' kelas hari ini' : dayName + ' • belum ada data contoh';
    return page('jadwal', 'Jadwal Kuliah', esc(sub), chips + list);
  }

  function viewTugas() {
    var list = TASKS.map(function (t) {
      var done = isDone(t.id);
      return '<div class="card task' + (done ? ' is-done' : '') + '">' +
        '<button class="check" type="button" data-task="' + t.id + '" aria-pressed="' + done + '" aria-label="Tandai ' + esc(t.title) + ' selesai">' + icon('check') + '</button>' +
        '<div class="task-main"><div class="title">' + esc(t.title) + '</div><div class="desc">' + esc(t.desc) + '</div></div>' +
        '<div class="task-side"><div class="date">' + t.date + '</div><div class="left ' + (done ? 'done' : t.level) + '">' + (done ? 'Selesai' : t.left) + '</div></div>' +
      '</div>';
    }).join('');
    var n = pending().length;
    return page('tugas', 'Daftar Tugas', n + ' tugas belum selesai', list);
  }

  function viewInfo() {
    var news = ANNOUNCEMENTS.map(function (a) {
      return '<div class="card news" style="display:flex;align-items:center;gap:14px"><div class="ico-circle">' + icon(a.icon) + '</div>' +
        '<div><div class="title">' + esc(a.title) + '</div><div class="news-meta">' + esc(a.meta) + '</div></div></div>';
    }).join('');
    return page('info', 'Info Kampus', 'Pengingat dan pengumuman terbaru',
      deadlineBlock(false, true) + '<h2>Pengumuman</h2>' + news);
  }

  function viewProfil() {
    var u = mem.user;
    var inner =
      '<div class="card profile-card"><div class="avatar">' + esc(initials(u)) + '</div><div>' +
        '<div class="name">' + esc(u.name) + '</div><div class="campus">Mahasiswa Universitas Madura</div><span class="status">Mahasiswa Aktif</span></div></div>' +
      '<h2>Informasi Pribadi</h2>' +
      '<div class="card info-list">' +
        row('hash', 'NIM', u.nim) + row('mail', 'Email', emailOf(u)) + row('book', 'Program Studi', u.prodi) +
        row('calendar', 'Semester', 'Semester 3 • Angkatan ' + angkatan(u)) +
      '</div>' +
      '<button class="btn-logout" type="button" data-action="logout">' + icon('logout') + 'Log Out</button>';
    return page('profil', 'Profil Saya', 'Informasi akun mahasiswa', inner);
  }
  function row(ic, k, v) {
    return '<div class="info-row">' + icon(ic) + '<div><div class="k">' + k + '</div><div class="v">' + esc(v) + '</div></div></div>';
  }

  function viewKeluar() {
    var name = mem.lastName || 'Satrio';
    return '<div class="screen dark">' +
      '<div class="logout-wrap"><div class="logout-card">' +
        '<div class="logo-tile"><img src="logo-unira.png" alt="Logo Universitas Madura"></div>' +
        '<div class="ok">' + icon('check') + '</div>' +
        '<h1>Kamu telah keluar</h1>' +
        '<p>Sampai jumpa lagi, ' + esc(name) + '! Terima kasih sudah menggunakan CampusMate.</p>' +
        '<a class="btn-primary" href="#/login">Masuk Kembali</a>' +
      '</div></div>' +
      '<p class="footnote">Universitas Madura • CampusMate</p>' +
    '</div>';
  }

  /* ------------------------------------------------------------------ */
  /* Router                                                              */
  /* ------------------------------------------------------------------ */
  var ROUTES = {
    login: { view: viewLogin, auth: false },
    beranda: { view: viewBeranda, auth: true },
    jadwal: { view: viewJadwal, auth: true },
    tugas: { view: viewTugas, auth: true },
    info: { view: viewInfo, auth: true },
    profil: { view: viewProfil, auth: true },
    keluar: { view: viewKeluar, auth: false }
  };
  var app = document.getElementById('app');
  var TITLES = { login: 'Masuk', beranda: 'Beranda', jadwal: 'Jadwal Kuliah', tugas: 'Daftar Tugas', info: 'Info Kampus', profil: 'Profil Saya', keluar: 'Keluar' };

  function currentRoute() {
    var name = (location.hash || '').replace(/^#\/?/, '').split(/[/?]/)[0];
    return ROUTES[name] ? name : 'login';
  }

  function render() {
    var name = currentRoute();
    var route = ROUTES[name];
    if (route.auth && !mem.user) { location.replace('#/login'); return; }
    app.innerHTML = route.view();
    document.title = TITLES[name] + ' – CampusMate';
    var content = document.getElementById('content');
    if (content) content.scrollTop = 0;
  }

  /* ------------------------------------------------------------------ */
  /* Interaksi                                                           */
  /* ------------------------------------------------------------------ */
  app.addEventListener('submit', function (e) {
    if (e.target.id !== 'login-form') return;
    e.preventDefault();
    var f = e.target;
    var name = f.name.value.trim(), prodi = f.prodi.value.trim(), nim = f.nim.value.trim();
    var err = document.getElementById('login-error');
    var msg = '';
    if (!name || !prodi || !nim) msg = 'Lengkapi nama, program studi, dan NIM.';
    else if (!/^\d{6,15}$/.test(nim)) msg = 'NIM hanya berisi angka (6–15 digit).';
    if (msg) { err.textContent = msg; err.hidden = false; return; }
    mem.user = { name: name, prodi: prodi, nim: nim };
    store.set('cm_user', mem.user);
    location.hash = '#/beranda';
  });

  app.addEventListener('click', function (e) {
    var el = e.target.closest('[data-day],[data-task],[data-action]');
    if (!el) return;

    if (el.dataset.day) {
      mem.day = el.dataset.day;
      render();
    } else if (el.dataset.task) {
      var id = el.dataset.task, i = mem.done.indexOf(id);
      if (i === -1) mem.done.push(id); else mem.done.splice(i, 1);
      store.set('cm_done', mem.done);
      render();
    } else if (el.dataset.action === 'logout') {
      mem.lastName = nickname(mem.user);
      mem.user = null;
      store.del('cm_user');
      location.hash = '#/keluar';
    } else if (el.dataset.action === 'notif') {
      /* Prototipe belum memiliki halaman notifikasi. */
      el.animate([{ transform: 'rotate(0)' }, { transform: 'rotate(-14deg)' }, { transform: 'rotate(12deg)' }, { transform: 'rotate(0)' }], { duration: 350 });
    }
  });

  window.addEventListener('hashchange', render);
  if (!location.hash) location.replace('#/login');
  render();
})();
