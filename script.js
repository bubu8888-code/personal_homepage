const videos=[...document.querySelectorAll('.hero-video')];
const tabs=[...document.querySelectorAll('.brand-tab')];
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
let activeVideo=0;
let videoRequest=0;
const videoStage=document.querySelector('.video-stage');
const hero=document.querySelector('.hero');
const brandData={
  market:document.querySelector('.brand-market'),name:document.querySelector('.brand-name'),
  summary:document.querySelector('.brand-summary'),metric:document.querySelector('.brand-metric')
};
videos.forEach(video=>{
  video.addEventListener('loadeddata',()=>{if(video.classList.contains('active'))videoStage?.classList.add('video-ready')});
  video.addEventListener('error',()=>video.classList.add('video-error'));
});

function waitForVideoFrame(video,timeout=3500){
  if(video.readyState>=2)return Promise.resolve(true);
  video.load();
  return new Promise(resolve=>{
    let settled=false;
    const finish=value=>{if(settled)return;settled=true;clearTimeout(timer);video.removeEventListener('loadeddata',ready);video.removeEventListener('error',failed);resolve(value)};
    const ready=()=>finish(true);
    const failed=()=>finish(false);
    const timer=setTimeout(()=>finish(video.readyState>=2),timeout);
    video.addEventListener('loadeddata',ready,{once:true});
    video.addEventListener('error',failed,{once:true});
  });
}
async function activateVideo(index,{initial=false}={}){
  const request=++videoRequest;
  const next=videos[index];
  const previous=videos[activeVideo];
  if(!next)return;
  tabs.forEach((tab,i)=>tab.classList.toggle('active',i===index));
  const tab=tabs[index];
  if(tab&&brandData.market){
    brandData.market.textContent=tab.dataset.market;
    brandData.name.textContent=tab.dataset.name;
    brandData.summary.textContent=tab.dataset.summary;
    brandData.metric.innerHTML=`${tab.dataset.metric}<small>${tab.dataset.metricLabel}</small>`;
  }
  videoStage?.classList.add('video-switching');
  const playAttempt=next.play().catch(()=>null);
  const ready=await waitForVideoFrame(next);
  if(request!==videoRequest)return;
  if(!ready){
    tabs.forEach((tab,i)=>tab.classList.toggle('active',i===activeVideo));
    videoStage?.classList.remove('video-switching');
    return;
  }
  if(ready)await Promise.race([playAttempt,new Promise(resolve=>setTimeout(resolve,1200))]);
  if(request!==videoRequest)return;
  videos.forEach((video,i)=>video.classList.toggle('active',i===index));
  activeVideo=index;
  if(ready)videoStage?.classList.add('video-ready');
  videoStage?.classList.remove('video-switching');
  if(previous&&previous!==next)previous.pause();
}
tabs.forEach((tab,i)=>tab.addEventListener('click',()=>{completeHeroIntro();activateVideo(i);}));
activateVideo(0,{initial:true});

let introTimer;
function showHeroIntro(duration=3600){
  if(!hero)return;
  if(hero.classList.contains('intro-complete'))return;
  hero.classList.add('intro-visible');
  clearTimeout(introTimer);
  if(duration)introTimer=setTimeout(completeHeroIntro,duration);
}
function hideHeroIntro(delay=0){
  clearTimeout(introTimer);
  introTimer=setTimeout(()=>hero?.classList.remove('intro-visible'),delay);
}
function completeHeroIntro(){
  clearTimeout(introTimer);
  hero?.classList.remove('intro-visible');
  hero?.classList.add('intro-complete');
}
showHeroIntro(reduce?1800:4200);

if(!reduce){
  addEventListener('pointermove',event=>{
    document.body.style.setProperty('--pointer-x',`${event.clientX}px`);
    document.body.style.setProperty('--pointer-y',`${event.clientY}px`);
  },{passive:true});
  document.querySelectorAll('.split-cta,.header-cta').forEach(link=>{
    link.addEventListener('pointermove',event=>{
      const rect=link.getBoundingClientRect();
      link.style.transform=`translate(${(event.clientX-rect.left-rect.width/2)*.08}px,${(event.clientY-rect.top-rect.height/2)*.08}px)`;
    });
    link.addEventListener('pointerleave',()=>link.style.transform='');
  });
}

const header=document.querySelector('.site-header');
addEventListener('scroll',()=>header.classList.toggle('scrolled',scrollY>40),{passive:true});

const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting)entry.target.classList.add('visible')}),{threshold:.12});
document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));

const chapterLinks=[...document.querySelectorAll('[data-chapter-link]')];
const chapters=[...document.querySelectorAll('[data-chapter]')];
let chapterFrame=0;
function updateChapter(){
  chapterFrame=0;
  const marker=scrollY+innerHeight*.42;
  let current=chapters[0];
  for(const section of chapters){if(section.offsetTop<=marker)current=section;else break;}
  chapterLinks.forEach(link=>link.classList.toggle('active',link.dataset.chapterLink===current?.dataset.chapter));
}
addEventListener('scroll',()=>{if(!chapterFrame)chapterFrame=requestAnimationFrame(updateChapter)},{passive:true});
addEventListener('resize',updateChapter,{passive:true});
updateChapter();
function getSectionScrollTop(target){
  if(!target||target.id==='top')return 0;
  const headerHeight=header?.getBoundingClientRect().height||0;
  const paddingTop=parseFloat(getComputedStyle(target).paddingTop)||0;
  return Math.max(0,target.offsetTop+paddingTop-headerHeight-20);
}
function navigateToSection(hash,{instant=false}={}){
  const target=document.querySelector(hash);
  if(!target)return;
  scrollTo({top:getSectionScrollTop(target),behavior:instant||reduce?'auto':'smooth'});
}
document.querySelectorAll('a[href^="#"]').forEach(link=>link.addEventListener('click',event=>{
  const hash=link.getAttribute('href');
  if(!hash||hash==='#')return;
  event.preventDefault();
  history.pushState(null,'',hash);
  navigateToSection(hash);
}));
addEventListener('popstate',()=>navigateToSection(location.hash||'#top'));
if(location.hash)addEventListener('load',()=>requestAnimationFrame(()=>navigateToSection(location.hash,{instant:true})),{once:true});
document.addEventListener('visibilitychange',()=>{
  if(document.visibilityState==='visible'){
    const current=videos[activeVideo];
    if(current)waitForVideoFrame(current).then(()=>current.play().catch(()=>{}));
  }
});

const systemButtons=[...document.querySelectorAll('.system-node[data-system]')];
const systemDetail=document.querySelector('.system-detail');
systemButtons.forEach((button,index)=>button.addEventListener('click',()=>{
  systemButtons.forEach(item=>item.classList.toggle('active',item===button));
  if(!systemDetail)return;
  systemDetail.querySelector('span').textContent=`SELECTED / ${String(index+1).padStart(2,'0')}`;
  systemDetail.querySelector('strong').textContent=button.dataset.system;
  systemDetail.querySelector('p').textContent=button.dataset.detail;
  const flow=document.querySelector('.system-flow');
  const steps=(button.dataset.steps||'').split('|');
  if(flow&&steps.length){flow.innerHTML=steps.map((step,stepIndex)=>`${stepIndex?'<i>→</i>':''}<span>${step}</span>`).join('');}
}));
const caseTabs=[...document.querySelectorAll('.case-tab')];
const caseCards=[...document.querySelectorAll('.case-deck .case')];
function activateCase(index){
  caseTabs.forEach((tab,i)=>{tab.classList.toggle('active',i===index);tab.setAttribute('aria-selected',i===index?'true':'false')});
  caseCards.forEach((card,i)=>{card.classList.toggle('case-active',i===index);card.setAttribute('aria-hidden',i===index?'false':'true')});
}
caseTabs.forEach((tab,index)=>tab.addEventListener('click',()=>activateCase(index)));
activateCase(0);
document.querySelectorAll('.work-toggle').forEach(toggle=>toggle.addEventListener('click',()=>{
  const item=toggle.closest('.work-item');
  const willOpen=!item.classList.contains('open');
  document.querySelectorAll('.work-item').forEach(other=>{
    const open=other===item&&willOpen;
    other.classList.toggle('open',open);
    const button=other.querySelector('.work-toggle');
    button.setAttribute('aria-expanded',open?'true':'false');
    button.querySelector('b').textContent=open?'−':'＋';
  });
}));
document.getElementById('year').textContent=new Date().getFullYear();
