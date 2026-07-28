(() => {
  'use strict';
  const qs=(s,r=document)=>r.querySelector(s);
  const qsa=(s,r=document)=>[...r.querySelectorAll(s)];
  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer=matchMedia('(pointer:fine)').matches;

  const toast=(text)=>{const el=qs('.toast');if(!el)return;el.textContent=text;el.classList.add('is-showing');clearTimeout(el._t);el._t=setTimeout(()=>el.classList.remove('is-showing'),2400)};

  const intro=qs('.page-intro');
  if(intro){const seen=sessionStorage.getItem('portfolioIntroSeen');if(seen||reduced)intro.remove();else setTimeout(()=>{intro.classList.add('is-done');sessionStorage.setItem('portfolioIntroSeen','1');setTimeout(()=>intro.remove(),650)},1100)}

  addEventListener('pointermove',e=>{document.documentElement.style.setProperty('--mouse-x',`${e.clientX}px`);document.documentElement.style.setProperty('--mouse-y',`${e.clientY}px`)},{passive:true});

  const dot=qs('.cursor-dot'),ring=qs('.cursor-ring');
  if(dot&&ring&&finePointer&&!reduced){
    document.body.classList.add('cursor-ready');
    let mx=innerWidth/2,my=innerHeight/2,rx=mx,ry=my;
    addEventListener('pointermove',e=>{mx=e.clientX;my=e.clientY;dot.style.left=`${mx}px`;dot.style.top=`${my}px`},{passive:true});
    const loop=()=>{rx+=(mx-rx)*.2;ry+=(my-ry)*.2;ring.style.left=`${rx}px`;ring.style.top=`${ry}px`;requestAnimationFrame(loop)};loop();
    document.addEventListener('pointerover',e=>{if(e.target.closest('a,button,.gallery-item,input,textarea,select'))ring.classList.add('is-active')});
    document.addEventListener('pointerout',e=>{if(e.target.closest('a,button,.gallery-item,input,textarea,select'))ring.classList.remove('is-active')});
  }

  const progress=qs('.scroll-progress');
  const updateProgress=()=>{if(!progress)return;const h=document.documentElement.scrollHeight-innerHeight;progress.style.width=`${h>0?(scrollY/h)*100:0}%`};
  addEventListener('scroll',updateProgress,{passive:true});updateProgress();

  const themeBtn=qs('[data-theme-toggle]');
  const savedTheme=localStorage.getItem('portfolioTheme');
  if(savedTheme)document.documentElement.dataset.theme=savedTheme;
  const themeLabel=()=>themeBtn?.setAttribute('aria-label',document.documentElement.dataset.theme==='light'?'Switch to dark theme':'Switch to light theme');
  themeLabel();
  themeBtn?.addEventListener('click',()=>{const next=document.documentElement.dataset.theme==='light'?'dark':'light';document.documentElement.dataset.theme=next;localStorage.setItem('portfolioTheme',next);themeLabel()});

  const menuBtn=qs('.menu-btn'),nav=qs('.site-nav');
  menuBtn?.addEventListener('click',()=>{const open=nav.classList.toggle('is-open');menuBtn.setAttribute('aria-expanded',String(open))});
  document.addEventListener('click',e=>{if(nav?.classList.contains('is-open')&&!nav.contains(e.target)&&!menuBtn.contains(e.target)){nav.classList.remove('is-open');menuBtn.setAttribute('aria-expanded','false')}});

  const sound=qs('.soundspace'),soundOpen=qs('[data-sound-open]'),soundClose=qs('.sound-close'),musicFab=qs('.music-fab');
  const openSound=()=>sound?.classList.add('is-open');
  soundOpen?.addEventListener('click',openSound);musicFab?.addEventListener('click',openSound);soundClose?.addEventListener('click',()=>sound?.classList.remove('is-open'));
  addEventListener('keydown',e=>{if(e.key==='Escape'){sound?.classList.remove('is-open');qs('.lightbox')?.classList.remove('is-open')}});

  const audio=qs('#ambient-audio'),play=qs('.audio-play'),prev=qs('.track-prev'),next=qs('.track-next'),bar=qs('.audio-progress'),fill=qs('.audio-progress span'),time=qs('.audio-time'),volume=qs('.audio-volume');
  const library=window.PORTFOLIO_MUSIC||{tracks:[]};
  const tracks=Array.isArray(library.tracks)?library.tracks:[];
  let trackIndex=Math.min(Number(localStorage.getItem('portfolioTrackIndex')||0),Math.max(0,tracks.length-1));
  const fmt=s=>Number.isFinite(s)?`${Math.floor(s/60)}:${String(Math.floor(s%60)).padStart(2,'0')}`:'0:00';
  const updatePlay=()=>{if(play)play.textContent=audio&&!audio.paused?'Ⅱ':'▶'};
  const loadTrack=(index,autoplay=false)=>{
    if(!audio||!tracks.length)return;
    trackIndex=(index+tracks.length)%tracks.length;
    const t=tracks[trackIndex];
    audio.src=t.source;
    qs('[data-track-title]').textContent=t.title||'Untitled';
    qs('[data-track-artist]').textContent=t.artist||'Unknown artist';
    qs('[data-track-credit]').textContent=`Credit: ${t.credit||`${t.title||'Track'} - ${t.artist||'Artist'}`}`;
    localStorage.setItem('portfolioTrackIndex',String(trackIndex));
    if(autoplay)audio.play().catch(()=>toast('Press play to allow audio.'));
  };
  const savedVolume=Number(localStorage.getItem('portfolioAudioVolume'));
  if(audio){audio.volume=Number.isFinite(savedVolume)&&savedVolume>=0&&savedVolume<=1?savedVolume:.65;if(volume)volume.value=String(audio.volume);loadTrack(trackIndex,false);const savedTime=Number(localStorage.getItem('portfolioAudioTime'));if(Number.isFinite(savedTime)&&savedTime>0)audio.addEventListener('loadedmetadata',()=>{if(savedTime<audio.duration)audio.currentTime=savedTime},{once:true});}
  play?.addEventListener('click',async()=>{try{if(audio.paused)await audio.play();else audio.pause();updatePlay()}catch{toast('Press play again to allow audio.')}});
  prev?.addEventListener('click',()=>loadTrack(trackIndex-1,!audio.paused));
  next?.addEventListener('click',()=>loadTrack(trackIndex+1,!audio.paused));
  audio?.addEventListener('ended',()=>loadTrack(trackIndex+1,true));
  audio?.addEventListener('play',updatePlay);audio?.addEventListener('pause',updatePlay);
  audio?.addEventListener('timeupdate',()=>{if(fill&&audio.duration)fill.style.width=`${(audio.currentTime/audio.duration)*100}%`;if(time)time.textContent=`${fmt(audio.currentTime)} / ${fmt(audio.duration)}`;if(Math.floor(audio.currentTime)%5===0)localStorage.setItem('portfolioAudioTime',String(audio.currentTime))});
  volume?.addEventListener('input',()=>{audio.volume=Number(volume.value);localStorage.setItem('portfolioAudioVolume',String(audio.volume))});
  bar?.addEventListener('click',e=>{if(!audio?.duration)return;const r=bar.getBoundingClientRect();audio.currentTime=((e.clientX-r.left)/r.width)*audio.duration});

  let revealObserver=null,counterObserver=null;
  function initReveal(root=document){
    const els=qsa('[data-reveal]',root);if(reduced||!('IntersectionObserver'in window)){els.forEach(x=>x.classList.add('is-visible'));return}
    revealObserver?.disconnect();revealObserver=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('is-visible');revealObserver.unobserve(e.target)}}),{threshold:.1,rootMargin:'0px 0px -35px'});els.forEach(el=>revealObserver.observe(el));
  }
  function initCounters(root=document){
    const els=qsa('[data-count]',root);if(!els.length)return;
    if(reduced||!('IntersectionObserver'in window)){els.forEach(el=>el.textContent=`${el.dataset.count}${el.dataset.suffix||''}`);return}
    counterObserver?.disconnect();counterObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{if(!entry.isIntersecting)return;const el=entry.target,target=Number(el.dataset.count||0),suffix=el.dataset.suffix||'',start=performance.now(),dur=950;const tick=now=>{const p=Math.min(1,(now-start)/dur);el.textContent=`${Math.round(target*(1-Math.pow(1-p,3)))}${suffix}`;if(p<1)requestAnimationFrame(tick)};requestAnimationFrame(tick);counterObserver.unobserve(el)}),{threshold:.45});els.forEach(el=>counterObserver.observe(el));
  }
  function initMagnetic(root=document){
    if(reduced||!finePointer)return;
    qsa('[data-magnetic]',root).forEach(el=>{if(el.dataset.bound)return;el.dataset.bound='1';el.addEventListener('pointermove',e=>{const r=el.getBoundingClientRect();el.style.transform=`translate(${(e.clientX-r.left-r.width/2)*.09}px,${(e.clientY-r.top-r.height/2)*.09}px)`});el.addEventListener('pointerleave',()=>el.style.transform='')});
  }
  function initGallery(root=document){
    qsa('.filter-btn',root).forEach(btn=>btn.addEventListener('click',()=>{qsa('.filter-btn',root).forEach(b=>b.classList.remove('is-active'));btn.classList.add('is-active');const f=btn.dataset.filter;qsa('.gallery-item',root).forEach(item=>item.classList.toggle('is-hidden',f!=='all'&&item.dataset.category!==f))}));
    const lightbox=qs('.lightbox'),lbImg=qs('.lightbox img'),lbCap=qs('.lightbox-caption');
    qsa('.gallery-item',root).forEach(item=>item.addEventListener('click',()=>{const img=qs('img',item);if(!lightbox||!lbImg||!img)return;lbImg.src=img.dataset.original||img.src;lbImg.alt=img.alt;lbCap.textContent=qs('.gallery-caption strong',item)?.textContent||img.alt;lightbox.classList.add('is-open')}));
  }
  function initContact(root=document){
    const form=qs('#contact-form',root);if(!form)return;form.addEventListener('submit',e=>{e.preventDefault();const fd=new FormData(form),name=fd.get('name'),email=fd.get('email'),subject=fd.get('subject')||'Portfolio enquiry',message=fd.get('message');const body=`Hello Labib,\n\n${message}\n\nFrom: ${name} (${email})`;location.href=`mailto:labibrafi2000@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`});
  }
  function initPage(root=document){initReveal(root);initCounters(root);initMagnetic(root);initGallery(root);initContact(root);updateProgress()}
  initPage();
  qs('.lightbox-close')?.addEventListener('click',()=>qs('.lightbox')?.classList.remove('is-open'));
  qs('.lightbox')?.addEventListener('click',e=>{if(e.target.classList.contains('lightbox'))e.currentTarget.classList.remove('is-open')});

  const internalPages=new Set(['index.html','about.html','experience.html','research.html','journal.html','contact.html']);
  function updateNav(url){const name=url.pathname.split('/').pop()||'index.html';qsa('.site-nav a').forEach(a=>{const href=new URL(a.href,location.href).pathname.split('/').pop()||'index.html';a.classList.toggle('is-active',href===name)});nav?.classList.remove('is-open');menuBtn?.setAttribute('aria-expanded','false')}
  async function navigate(href,push=true){
    const url=new URL(href,location.href);if(url.origin!==location.origin)return location.href=url.href;
    const page=url.pathname.split('/').pop()||'index.html';if(!internalPages.has(page))return location.href=url.href;
    document.body.classList.add('is-navigating');
    try{const res=await fetch(url.href,{headers:{'X-Portfolio-Navigation':'1'}});if(!res.ok)throw new Error('Navigation failed');const html=await res.text(),doc=new DOMParser().parseFromString(html,'text/html'),newMain=doc.querySelector('main');if(!newMain)throw new Error('Missing main');await new Promise(r=>setTimeout(r,140));qs('main').replaceWith(newMain);document.title=doc.title;document.body.dataset.page=doc.body.dataset.page||'';if(push)history.pushState({href:url.href},'',url.href);updateNav(url);scrollTo({top:0,behavior:reduced?'auto':'smooth'});initPage(newMain);document.body.classList.remove('is-navigating');if(url.hash){setTimeout(()=>qs(url.hash)?.scrollIntoView({behavior:reduced?'auto':'smooth'}),100)}}catch(err){document.body.classList.remove('is-navigating');location.href=url.href}}
  document.addEventListener('click',e=>{const a=e.target.closest('a');if(!a||e.defaultPrevented||e.button!==0||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey||a.target==='_blank'||a.hasAttribute('download'))return;const url=new URL(a.href,location.href),page=url.pathname.split('/').pop()||'index.html';if(url.origin===location.origin&&internalPages.has(page)){e.preventDefault();navigate(url.href)}});
  addEventListener('popstate',()=>navigate(location.href,false));
})();
