/* ==========================================================================
   script.js — membaca js/config.js lalu membangun halaman.
   Vanilla JavaScript, tanpa framework. Semua teks dari config disisipkan
   lewat textContent (aman dari injeksi HTML).
   ========================================================================== */
(function () {
  'use strict';

  var C = window.SITE_CONFIG;
  if (!C) {
    console.error('SITE_CONFIG tidak ditemukan. Pastikan js/config.js dimuat sebelum js/script.js.');
    return;
  }

  /* ---------- Helper ---------- */
  var $ = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function h(tag, props) {
    var el = document.createElement(tag);
    props = props || {};
    Object.keys(props).forEach(function (k) {
      var v = props[k];
      if (v === null || v === undefined || v === false) return;
      if (k === 'class') el.className = v;
      else if (k === 'text') el.textContent = v;
      else if (k.slice(0, 2) === 'on') el.addEventListener(k.slice(2), v);
      else el.setAttribute(k, v === true ? '' : v);
    });
    for (var i = 2; i < arguments.length; i++) {
      var kids = [].concat(arguments[i]);
      for (var j = 0; j < kids.length; j++) {
        var c = kids[j];
        if (c === null || c === undefined || c === false) continue;
        el.appendChild(c.nodeType ? c : document.createTextNode(c));
      }
    }
    return el;
  }
  function icon(cls) { return h('i', { class: cls, 'aria-hidden': 'true' }); }
  // URL dianggap belum diisi jika kosong atau masih mengandung kata GANTI.
  function isPlaceholder(url) { return !url || /GANTI/i.test(url); }
  function findLink(id) { return (C.links || []).filter(function (l) { return l.id === id; })[0]; }

  /* ---------- Toast ---------- */
  var toastRoot = $('#toast-root');
  function toast(message, type) {
    var t = h('div', { class: 'toast ' + (type || '') },
      icon(type === 'error' ? 'fa-solid fa-circle-exclamation' : type === 'ok' ? 'fa-solid fa-circle-check' : 'fa-solid fa-circle-info'),
      h('span', { text: message }));
    toastRoot.appendChild(t);
    setTimeout(function () {
      t.classList.add('leaving');
      setTimeout(function () { if (t.parentNode) t.parentNode.removeChild(t); }, 320);
    }, 3200);
  }

  /* ---------- Tema (Light / Dark, disimpan di localStorage) ---------- */
  var root = document.documentElement;
  var themeBtn = $('#theme-toggle');
  var themeMeta = $('meta[name="theme-color"]');
  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    themeBtn.setAttribute('aria-pressed', theme === 'dark' ? 'true' : 'false');
    themeBtn.setAttribute('aria-label', theme === 'dark' ? 'Ganti ke tema terang' : 'Ganti ke tema gelap');
    if (themeMeta) themeMeta.setAttribute('content', theme === 'dark' ? '#0A1430' : '#FBF6EA');
  }
  applyTheme(root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light');
  themeBtn.addEventListener('click', function () {
    var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    try { localStorage.setItem('fei-theme', next); } catch (e) { /* penyimpanan tidak tersedia */ }
  });

  /* ---------- Navigasi responsif ---------- */
  var menuBtn = $('#menu-toggle');
  var menu = $('#site-nav');
  function setMenu(open) {
    menu.classList.toggle('open', open);
    menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    menuBtn.setAttribute('aria-label', open ? 'Tutup menu' : 'Buka menu');
    menuBtn.firstElementChild.className = open ? 'fa-solid fa-xmark' : 'fa-solid fa-bars';
  }
  menuBtn.addEventListener('click', function () { setMenu(!menu.classList.contains('open')); });
  menu.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });
  document.addEventListener('click', function (e) {
    if (!menu.contains(e.target) && !menuBtn.contains(e.target)) setMenu(false);
  });

  /* ---------- Hero ---------- */
  var P = C.profile || {};
  $('#hero-name').textContent = P.fullName || '';
  $('#hero-nick').textContent = P.nickname || '';
  $('#hero-tagline').textContent = P.tagline || '';
  $('#hero-role').textContent = P.role || '';
  $('#hero-status').textContent = P.status || '';
  var photo = $('#hero-photo');
  photo.alt = P.photoAlt || 'Foto profil';
  photo.addEventListener('error', function onErr() {
    photo.removeEventListener('error', onErr);
    photo.src = 'assets/images/profile-placeholder.png'; // cadangan bila file foto tidak ditemukan
  });
  if (P.photo) photo.src = P.photo;
  // Foto sampul hero (URL internet). Jika gagal dimuat, ilustrasi SVG tetap tampil.
  var cover = $('#hero-cover');
  if (P.cover) {
    cover.addEventListener('load', function () { cover.hidden = false; $('#scene').classList.add('has-photo'); });
    cover.addEventListener('error', function () { cover.hidden = true; $('#scene').classList.remove('has-photo'); });
    cover.src = P.cover;
  }
  var fieldsEl = $('#hero-fields');
  (P.fields || []).forEach(function (f) { fieldsEl.appendChild(h('li', { text: f })); });

  // Salin tautan halaman
  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) return navigator.clipboard.writeText(text);
    return new Promise(function (resolve, reject) {
      var ta = h('textarea', { 'aria-hidden': 'true', readonly: true, style: 'position:fixed;left:-9999px;top:0' });
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      var ok = false;
      try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
      document.body.removeChild(ta);
      ok ? resolve() : reject(new Error('copy gagal'));
    });
  }
  $('#copy-link').addEventListener('click', function () {
    var url = window.location.href.split('#')[0];
    copyText(url).then(
      function () { toast('Tautan halaman disalin', 'ok'); },
      function () { toast('Tidak bisa menyalin otomatis. Salin dari bilah alamat.', 'error'); }
    );
  });

  /* ---------- Link hub ---------- */
  function onPlaceholderClick(e, label) {
    e.preventDefault();
    toast(label + ' belum diisi. Ubah URL-nya di js/config.js.', 'error');
  }
  var linkGrid = $('#link-grid');
  (C.links || []).forEach(function (l) {
    var ph = isPlaceholder(l.url);
    var a = h('a', {
      class: 'link-card' + (ph ? ' is-placeholder' : ''),
      href: ph ? '#' : l.url,
      target: !ph && l.newTab ? '_blank' : null,
      rel: !ph && l.newTab ? 'noopener noreferrer' : null
    },
      h('span', { class: 'link-icon' }, icon(l.icon)),
      h('span', {}, h('span', { class: 'link-title', text: l.title }), h('span', { class: 'link-desc', text: l.desc })),
      h('span', { class: 'link-go' }, icon('fa-solid fa-arrow-up-right-from-square'))
    );
    if (ph) a.addEventListener('click', function (e) { onPlaceholderClick(e, l.title); });
    linkGrid.appendChild(a);
  });

  /* ---------- Projects + filter ---------- */
  var grid = $('#project-grid');
  var filters = $('#filters');
  var projectEls = [];

  function projectButton(label, url, iconCls, what) {
    var ph = isPlaceholder(url);
    var b = h('a', {
      class: 'btn ' + (ph ? 'btn-ghost' : 'btn-soft'),
      href: ph ? '#' : url,
      target: ph ? null : '_blank',
      rel: ph ? null : 'noopener noreferrer',
      'aria-disabled': ph ? 'true' : null
    }, icon(iconCls), label);
    if (ph) b.addEventListener('click', function (e) { e.preventDefault(); toast(what + ' belum tersedia untuk proyek ini.', 'info'); });
    return b;
  }

  (C.projects || []).forEach(function (p) {
    var emoji = h('span', { class: 'emoji', 'aria-hidden': 'true', text: p.emoji || '📁' });
    var thumb = h('div', { class: 'thumb' + (p.image ? ' has-img' : '') }, emoji, h('span', { class: 'cat-tag', text: p.category }));
    if (p.image) {
      var im = h('img', { src: p.image, alt: '', loading: 'lazy', decoding: 'async', referrerpolicy: 'no-referrer', style: p.imagePos ? 'object-position:' + p.imagePos : null });
      // Jika gambar gagal dimuat: buang gambar, kembali ke emoji besar
      im.addEventListener('error', function () { if (im.parentNode) im.parentNode.removeChild(im); thumb.classList.remove('has-img'); });
      thumb.insertBefore(im, thumb.firstChild);
    }
    var card = h('article', { class: 'project', 'data-category': p.category },
      thumb,
      h('div', { class: 'project-body' },
        h('h3', { text: p.title }),
        h('p', { text: p.desc }),
        h('ul', { class: 'tech', 'aria-label': 'Teknologi' }, (p.tech || []).map(function (t) { return h('li', { text: t }); })),
        h('div', { class: 'project-actions' },
          projectButton('Start', p.demo, 'fa-solid fa-play', 'Start Project'),
          projectButton('Source Code', p.source, 'fa-solid fa-code', 'Source code')
        )
      )
    );
    projectEls.push(card);
    grid.appendChild(card);
  });
  var emptyMsg = h('p', { class: 'empty', text: 'Belum ada proyek di kategori ini.', hidden: true });
  grid.parentNode.insertBefore(emptyMsg, grid.nextSibling);

  function applyFilter(cat) {
    var shown = 0;
    projectEls.forEach(function (el) {
      var ok = cat === 'All' || el.getAttribute('data-category') === cat;
      el.hidden = !ok;
      if (ok) shown++;
    });
    emptyMsg.hidden = shown !== 0;
    $$('.chip', filters).forEach(function (c) { c.setAttribute('aria-pressed', c.getAttribute('data-cat') === cat ? 'true' : 'false'); });
  }
  (C.categories || ['All']).forEach(function (cat) {
    filters.appendChild(h('button', {
      class: 'chip', type: 'button', 'data-cat': cat, 'aria-pressed': 'false', text: cat,
      onclick: function () { applyFilter(cat); }
    }));
  });
  applyFilter('All');

  /* ---------- Contact ---------- */
  var K = C.contact || {};
  $('#contact-title').textContent = K.heading || '';
  $('#contact-text').textContent = K.text || '';
  var cb = $('#contact-buttons');
  (K.buttons || []).forEach(function (id) {
    var l = findLink(id);
    if (!l) return;
    var ph = isPlaceholder(l.url);
    var a = h('a', {
      class: 'btn btn-soft' + (ph ? ' is-placeholder' : ''),
      href: ph ? '#' : l.url,
      target: !ph && l.newTab ? '_blank' : null,
      rel: !ph && l.newTab ? 'noopener noreferrer' : null
    }, icon(l.icon), l.title);
    if (ph) a.addEventListener('click', function (e) { onPlaceholderClick(e, l.title); });
    cb.appendChild(a);
  });

  var form = $('#contact-form');
  var submitBtn = $('#form-submit');
  var formNote = $('#form-note');
  formNote.textContent = K.formEndpoint
    ? 'Pesan dikirim lewat layanan formulir.'
    : 'Saat ini tombol kirim akan membuka aplikasi email kamu dengan pesan yang sudah terisi.';

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!form.checkValidity()) { form.reportValidity(); return; }
    var data = {
      name: form.elements.name.value.trim(),
      email: form.elements.email.value.trim(),
      message: form.elements.message.value.trim()
    };
    if (form.elements._gotcha.value) return; // jebakan bot

    if (K.formEndpoint) {
      submitBtn.disabled = true;
      fetch(K.formEndpoint, {
        method: 'POST',
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      }).then(function (res) {
        if (res.ok) { toast('Pesan terkirim. Terima kasih!', 'ok'); form.reset(); }
        else toast('Pesan belum terkirim (kode ' + res.status + '). Coba lagi nanti.', 'error');
      }).catch(function () {
        toast('Tidak ada koneksi ke layanan formulir. Coba lagi nanti.', 'error');
      }).then(function () { submitBtn.disabled = false; });
      return;
    }

    if (isPlaceholder(K.email)) {
      toast('Email tujuan belum diisi di js/config.js.', 'error');
      return;
    }
    var subject = 'Pesan dari ' + data.name + ' (Fei\'s Digital Space)';
    var body = data.message + '\n\n— ' + data.name + ' <' + data.email + '>';
    window.location.href = 'mailto:' + K.email + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
    toast('Membuka aplikasi email kamu…', 'info');
  });

  /* ---------- Footer ---------- */
  var F = C.footer || {};
  $('#footer-text').textContent = F.text || '';
  $('#year').textContent = new Date().getFullYear();
  var fs = $('#footer-socials');
  (F.socials || []).forEach(function (id) {
    var l = findLink(id);
    if (!l) return;
    var ph = isPlaceholder(l.url);
    var a = h('a', {
      href: ph ? '#' : l.url,
      'aria-label': l.title,
      title: l.title,
      target: !ph && l.newTab ? '_blank' : null,
      rel: !ph && l.newTab ? 'noopener noreferrer' : null
    }, icon(l.icon));
    if (ph) a.addEventListener('click', function (e) { onPlaceholderClick(e, l.title); });
    fs.appendChild(a);
  });
  $('#to-top').addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
  });

  /* ---------- Pemutar musik (tanpa autoplay) ---------- */
  var M = C.music || {};
  var player = $('#player');
  if (M.enabled) {
    player.hidden = false;
    var playBtn = $('#play-btn');
    var prog = $('#progress');
    var vol = $('#volume');
    $('#track-title').textContent = M.title || '';
    $('#track-artist').textContent = M.artist ? '· ' + M.artist : '';

    if (isPlaceholder(M.src)) {
      playBtn.disabled = true;
      playBtn.setAttribute('aria-label', 'the sound of my all-time favorite musical instrument');
      playBtn.title = 'the sound of my all-time favorite musical instrument';
    } else {
      var audio = new Audio();
      audio.preload = 'none';
      audio.src = M.src;
      audio.volume = parseFloat(vol.value);
      var setPlaying = function (on) {
        player.classList.toggle('playing', on);
        playBtn.firstElementChild.className = on ? 'fa-solid fa-pause' : 'fa-solid fa-play';
        playBtn.setAttribute('aria-label', on ? 'Jeda musik' : 'Putar musik');
      };
      playBtn.addEventListener('click', function () {
        if (audio.paused) {
          var p = audio.play();
          if (p && p.catch) p.catch(function () { toast('Audio tidak bisa diputar. Periksa file atau URL-nya.', 'error'); setPlaying(false); });
        } else audio.pause();
      });
      audio.addEventListener('play', function () { setPlaying(true); });
      audio.addEventListener('pause', function () { setPlaying(false); });
      audio.addEventListener('ended', function () { setPlaying(false); prog.value = 0; });
      audio.addEventListener('loadedmetadata', function () { prog.disabled = false; });
      audio.addEventListener('error', function () { toast('File audio tidak ditemukan atau tidak didukung.', 'error'); setPlaying(false); });
      audio.addEventListener('timeupdate', function () {
        if (audio.duration) prog.value = (audio.currentTime / audio.duration) * 100;
      });
      prog.addEventListener('input', function () {
        if (audio.duration) audio.currentTime = (parseFloat(prog.value) / 100) * audio.duration;
      });
      vol.addEventListener('input', function () { audio.volume = parseFloat(vol.value); });
    }
  }

  /* ---------- Animasi scroll & penanda menu aktif ---------- */
  if ('IntersectionObserver' in window) {
    var links = $$('#site-nav a');
    var secObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        links.forEach(function (a) { a.classList.toggle('active', a.getAttribute('href') === '#' + en.target.id); });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    $$('main section[id]').forEach(function (s) { secObs.observe(s); });
  }

  /* ---------- Loader ringan ---------- */
  var loader = $('#loader');
  var finished = false;
  function finishLoading() {
    if (finished) return;
    finished = true;
    loader.classList.add('done');
    root.classList.add('ready');
    setTimeout(function () { if (loader.parentNode) loader.parentNode.removeChild(loader); }, 600);
  }
  if (document.readyState === 'complete') setTimeout(finishLoading, 350);
  else window.addEventListener('load', function () { setTimeout(finishLoading, 350); });
  setTimeout(finishLoading, 3000); // jaring pengaman bila ada aset yang lambat
})();
