const videos=[...document.querySelectorAll('.hero-video')];
const tabs=[...document.querySelectorAll('.brand-tab')];
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
let activeVideo=0;
const videoStage=document.querySelector('.video-stage');
const hero=document.querySelector('.hero');
const brandData={
  market:document.querySelector('.brand-market'),name:document.querySelector('.brand-name'),
  summary:document.querySelector('.brand-summary'),metric:document.querySelector('.brand-metric')
};
videos.forEach(video=>{
  video.addEventListener('canplay',()=>videoStage?.classList.add('video-ready'),{once:true});
  video.addEventListener('error',()=>video.classList.add('video-error'));
});

function activateVideo(index){
  activeVideo=index;
  videos.forEach((video,i)=>{video.classList.toggle('active',i===index); if(i!==index) video.pause();});
  tabs.forEach((tab,i)=>tab.classList.toggle('active',i===index));
  const tab=tabs[index];
  if(tab&&brandData.market){
    brandData.market.textContent=tab.dataset.market;
    brandData.name.textContent=tab.dataset.name;
    brandData.summary.textContent=tab.dataset.summary;
    brandData.metric.innerHTML=`${tab.dataset.metric}<small>${tab.dataset.metricLabel}</small>`;
  }
  if(!reduce) videos[index].play().catch(()=>{});
}
tabs.forEach((tab,i)=>tab.addEventListener('click',()=>{activateVideo(i);hideHeroIntro(350);}));
activateVideo(0);

let introTimer;
function showHeroIntro(duration=3600){
  if(!hero)return;
  hero.classList.add('intro-visible');
  clearTimeout(introTimer);
  if(!reduce&&duration)introTimer=setTimeout(()=>hero.classList.remove('intro-visible'),duration);
}
function hideHeroIntro(delay=0){
  clearTimeout(introTimer);
  introTimer=setTimeout(()=>hero?.classList.remove('intro-visible'),delay);
}
if(reduce)hero?.classList.add('intro-visible');
else{
  showHeroIntro(4200);
  hero?.addEventListener('pointerenter',()=>showHeroIntro(3600));
  hero?.addEventListener('pointerleave',()=>hideHeroIntro(500));
  hero?.addEventListener('focusin',()=>showHeroIntro(0));
  hero?.addEventListener('focusout',()=>hideHeroIntro(500));
  hero?.addEventListener('click',event=>{if(!event.target.closest('a,button'))showHeroIntro(3000)});
}

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
const chapterObserver=new IntersectionObserver(entries=>{
  const current=entries.filter(entry=>entry.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio)[0];
  if(!current)return;
  chapterLinks.forEach(link=>link.classList.toggle('active',link.dataset.chapterLink===current.target.dataset.chapter));
},{rootMargin:'-30% 0px -45%',threshold:[0,.15,.35,.6]});
document.querySelectorAll('[data-chapter]').forEach(section=>chapterObserver.observe(section));

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
document.getElementById('year').textContent=new Date().getFullYear();
