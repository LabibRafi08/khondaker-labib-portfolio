(() => {
  'use strict';
  const qs = (s, r=document) => r.querySelector(s);
  const qsa = (s, r=document) => [...r.querySelectorAll(s)];
  const cfg = window.PORTFOLIO_CONFIG || {};
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const toast = (text) => {
    const el = qs('.toast'); if (!el) return;
    el.textContent = text; el.classList.add('is-showing');
    clearTimeout(el._t); el._t = setTimeout(() => el.classList.remove('is-showing'), 2600);
  };

  // Intro only once per session.
  const intro = qs('.page-intro');
  if (intro) {
    const seen = sessionStorage.getItem('portfolioIntroSeen');
    if (seen || reduced) intro.remove();
    else setTimeout(() => { intro.classList.add('is-done'); sessionStorage.setItem('portfolioIntroSeen','1'); setTimeout(()=>intro.remove(),800); }, 1250);
  }

  // Mouse spotlight and cursor.
  window.addEventListener('pointermove', (e) => {
    document.documentElement.style.setProperty('--mouse-x', `${e.clientX}px`);
    document.documentElement.style.setProperty('--mouse-y', `${e.clientY}px`);
  }, {passive:true});
  const dot = qs('.cursor-dot'), ring = qs('.cursor-ring'), label = qs('.cursor-label');
  if (dot && ring && matchMedia('(pointer:fine)').matches && !reduced) {
    document.body.classList.add('cursor-ready');
    let rx=innerWidth/2, ry=innerHeight/2, mx=rx, my=ry;
    addEventListener('pointermove', e => { mx=e.clientX; my=e.clientY; dot.style.left=`${mx}px`; dot.style.top=`${my}px`; }, {passive:true});
    const loop=()=>{ rx+=(mx-rx)*.16; ry+=(my-ry)*.16; ring.style.left=`${rx}px`; ring.style.top=`${ry}px`; requestAnimationFrame(loop); }; loop();
    qsa('[data-cursor],a,button').forEach(el => {
      el.addEventListener('mouseenter',()=>{ ring.classList.add('is-active'); label.textContent=el.dataset.cursor || ''; });
      el.addEventListener('mouseleave',()=>{ ring.classList.remove('is-active'); label.textContent=''; });
    });
  }

  // Scroll progress.
  const progress = qs('.scroll-progress');
  const onScroll = () => {
    if (progress) {
      const h = document.documentElement.scrollHeight - innerHeight;
      progress.style.width = `${h > 0 ? (scrollY/h)*100 : 0}%`;
    }
  };
  addEventListener('scroll', onScroll, {passive:true}); onScroll();

  // Reveal.
  const revealEls = qsa('[data-reveal]');
  if (reduced || !('IntersectionObserver' in window)) revealEls.forEach(x=>x.classList.add('is-visible'));
  else {
    const io = new IntersectionObserver(entries => entries.forEach(e => { if(e.isIntersecting){e.target.classList.add('is-visible'); io.unobserve(e.target);} }), {threshold:.12,rootMargin:'0px 0px -40px'});
    revealEls.forEach(el=>io.observe(el));
  }

  // Count up.
  const counters = qsa('[data-count]');
  if ('IntersectionObserver' in window && !reduced) {
    const cio = new IntersectionObserver(entries => entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el=entry.target, target=Number(el.dataset.count||0), suffix=el.dataset.suffix||'';
      const start=performance.now(), duration=1200;
      const tick=(now)=>{ const p=Math.min(1,(now-start)/duration); el.textContent=`${Math.round(target*(1-Math.pow(1-p,3)))}${suffix}`; if(p<1)requestAnimationFrame(tick); };
      requestAnimationFrame(tick); cio.unobserve(el);
    }), {threshold:.5}); counters.forEach(el=>cio.observe(el));
  } else counters.forEach(el=>el.textContent=`${el.dataset.count}${el.dataset.suffix||''}`);

  // Theme.
  const themeButton = qs('[data-theme-toggle]');
  const savedTheme = localStorage.getItem('portfolioTheme');
  if (savedTheme) document.documentElement.dataset.theme = savedTheme;
  const updateThemeLabel=()=>{ if(themeButton) themeButton.setAttribute('aria-label', document.documentElement.dataset.theme==='light'?'Switch to dark theme':'Switch to light theme'); };
  updateThemeLabel();
  themeButton?.addEventListener('click',()=>{ const next=document.documentElement.dataset.theme==='light'?'dark':'light'; document.documentElement.dataset.theme=next; localStorage.setItem('portfolioTheme',next); updateThemeLabel(); });

  // Mobile menu.
  const menuBtn=qs('.menu-btn'), nav=qs('.site-nav');
  menuBtn?.addEventListener('click',()=>{ const open=nav.classList.toggle('is-open'); menuBtn.setAttribute('aria-expanded',String(open)); });
  qsa('.site-nav a').forEach(a=>a.addEventListener('click',()=>{nav?.classList.remove('is-open'); menuBtn?.setAttribute('aria-expanded','false');}));
  addEventListener('click',e=>{ if(nav?.classList.contains('is-open') && !nav.contains(e.target) && !menuBtn.contains(e.target)){nav.classList.remove('is-open');menuBtn.setAttribute('aria-expanded','false');}}, {passive:true});

  // Config links.
  qsa('[data-config-link]').forEach(el => {
    const key=el.dataset.configLink, value=cfg[key];
    if(value){ el.href=value; el.hidden=false; }
  });

  // Magnetic buttons and subtle tilt.
  if (!reduced && matchMedia('(pointer:fine)').matches) {
    qsa('[data-magnetic]').forEach(el=>{
      el.addEventListener('pointermove',e=>{ const r=el.getBoundingClientRect(); const x=(e.clientX-r.left-r.width/2)*.12, y=(e.clientY-r.top-r.height/2)*.12; el.style.transform=`translate(${x}px,${y}px)`; });
      el.addEventListener('pointerleave',()=>el.style.transform='');
    });
    qsa('[data-tilt]').forEach(el=>{
      el.addEventListener('pointermove',e=>{ const r=el.getBoundingClientRect(); const x=(e.clientX-r.left)/r.width-.5, y=(e.clientY-r.top)/r.height-.5; el.style.transform=`perspective(900px) rotateX(${(-y*3).toFixed(2)}deg) rotateY(${(x*3).toFixed(2)}deg) translateY(-2px)`; });
      el.addEventListener('pointerleave',()=>el.style.transform='');
    });
  }

  // Soundspace: local ambience + personal playlist.
  const panel=qs('.soundspace'), soundOpen=qs('[data-sound-open]'), soundClose=qs('.sound-close');
  soundOpen?.addEventListener('click',()=>panel?.classList.toggle('is-open'));
  soundClose?.addEventListener('click',()=>panel?.classList.remove('is-open'));
  addEventListener('keydown',e=>{ if(e.key==='Escape'){ panel?.classList.remove('is-open'); qs('.lightbox')?.classList.remove('is-open'); } });
  const audio=qs('#ambient-audio'), play=qs('.audio-play'), prog=qs('.audio-progress'), fill=qs('.audio-progress span'), time=qs('.audio-time');
  const fmt=s=>`${Math.floor(s/60)}:${String(Math.floor(s%60)).padStart(2,'0')}`;
  play?.addEventListener('click',async()=>{ try{ if(audio.paused){await audio.play();play.textContent='Ⅱ';}else{audio.pause();play.textContent='▶';} }catch{toast('Audio playback needs a user interaction.');} });
  audio?.addEventListener('timeupdate',()=>{ if(fill&&audio.duration)fill.style.width=`${audio.currentTime/audio.duration*100}%`; if(time)time.textContent=`${fmt(audio.currentTime)} / ${fmt(audio.duration||0)}`; });
  prog?.addEventListener('click',e=>{ if(audio?.duration){const r=prog.getBoundingClientRect();audio.currentTime=((e.clientX-r.left)/r.width)*audio.duration;} });
  const playlistBtn=qs('[data-playlist-open]'), frame=qs('.spotify-frame');
  const playlistEmbed = cfg.playlistEmbedUrl || cfg.spotifyEmbedUrl || '';
  if(playlistEmbed && frame){ frame.src=playlistEmbed; frame.classList.add('is-ready'); }
  if(cfg.playlistUrl && playlistBtn){ playlistBtn.href=cfg.playlistUrl; playlistBtn.hidden=false; }

  // Gallery filter and lightbox.
  qsa('.filter-btn').forEach(btn=>btn.addEventListener('click',()=>{
    qsa('.filter-btn').forEach(b=>b.classList.remove('is-active')); btn.classList.add('is-active');
    const f=btn.dataset.filter;
    qsa('.gallery-item').forEach(item=>item.classList.toggle('is-hidden',f!=='all' && item.dataset.category!==f));
  }));
  const lightbox=qs('.lightbox'), lbImg=qs('.lightbox img'), lbCap=qs('.lightbox-caption');
  qsa('.gallery-item').forEach(item=>item.addEventListener('click',()=>{ if(!lightbox||!lbImg)return; const img=qs('img',item); lbImg.src=img.dataset.original||img.src; lbImg.alt=img.alt; if(lbCap)lbCap.textContent=qs('.gallery-caption strong',item)?.textContent||img.alt; lightbox.classList.add('is-open'); }));
  qs('.lightbox-close')?.addEventListener('click',()=>lightbox?.classList.remove('is-open'));
  lightbox?.addEventListener('click',e=>{if(e.target===lightbox)lightbox.classList.remove('is-open');});

  // Contact form: endpoint if configured, mailto fallback otherwise.
  const form=qs('#contact-form');
  form?.addEventListener('submit',async e=>{
    e.preventDefault(); const fd=new FormData(form); const name=fd.get('name'), email=fd.get('email'), subject=fd.get('subject')||'Portfolio enquiry', message=fd.get('message');
    if(cfg.formEndpoint){
      try{ const res=await fetch(cfg.formEndpoint,{method:'POST',body:fd,headers:{Accept:'application/json'}}); if(!res.ok)throw new Error(); form.reset(); toast('Message sent successfully.'); }
      catch{ toast('Could not send the form. Please email directly.'); }
    } else {
      const body=`Hello Labib,\n\n${message}\n\nFrom: ${name} (${email})`;
      location.href=`mailto:labibrafi2000@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    }
  });
})();
