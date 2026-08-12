const videos=[...document.querySelectorAll('.hero-video')];
const tabs=[...document.querySelectorAll('.brand-tab')];
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
let activeVideo=0;
let videoTimer;

function activateVideo(index){
  activeVideo=index;
  videos.forEach((video,i)=>{video.classList.toggle('active',i===index); if(i!==index) video.pause();});
  tabs.forEach((tab,i)=>tab.classList.toggle('active',i===index));
  if(!reduce) videos[index].play().catch(()=>{});
  clearInterval(videoTimer);
  if(!reduce) videoTimer=setInterval(()=>activateVideo((activeVideo+1)%videos.length),8000);
}
tabs.forEach((tab,i)=>tab.addEventListener('click',()=>activateVideo(i)));
activateVideo(0);

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
document.getElementById('year').textContent=new Date().getFullYear();

const root=document.documentElement;
const editables=[...document.querySelectorAll('[data-edit-id]')];
const toolbar=document.querySelector('.editor-toolbar');
const toggle=document.querySelector('.edit-toggle');
const status=document.querySelector('.editor-status');
const baseKey=`chen-jia-xian-homepage-edits:${location.pathname}`;
const versionKey=`${baseKey}:${root.dataset.editVersion}`;
let editing=false;

function savedData(){try{return JSON.parse(localStorage.getItem(versionKey)||localStorage.getItem(baseKey)||'{}')}catch{return {}}}
function restore(){const data=savedData();editables.forEach(el=>{if(data[el.dataset.editId]!==undefined)el.innerHTML=data[el.dataset.editId]})}
function save(){const data={};editables.forEach(el=>data[el.dataset.editId]=el.innerHTML);localStorage.setItem(versionKey,JSON.stringify(data));localStorage.setItem(baseKey,JSON.stringify(data));status.textContent='已儲存';setTimeout(()=>status.textContent='',1200)}
function setEditing(value){editing=value;document.body.classList.toggle('editing',editing);toolbar.classList.toggle('open',editing);editables.forEach(el=>el.contentEditable=editing?'true':'false');toggle.textContent=editing?'完成':'編輯';if(!editing)save()}
toggle.addEventListener('click',()=>setEditing(!editing));
document.addEventListener('keydown',event=>{if((event.metaKey||event.ctrlKey)&&event.key.toLowerCase()==='s'){event.preventDefault();save()}if(event.key.toLowerCase()==='e'&&!event.metaKey&&!event.ctrlKey&&!event.target.closest('[contenteditable="true"],input,textarea'))setEditing(!editing)});

document.querySelector('.export-html').addEventListener('click',()=>{
  save();
  const clone=document.documentElement.cloneNode(true);
  clone.dataset.editVersion=`export-${Date.now()}`;
  clone.querySelector('body').classList.remove('editing');
  clone.querySelector('.editor-toolbar')?.classList.remove('open');
  clone.querySelectorAll('[contenteditable]').forEach(el=>el.setAttribute('contenteditable','false'));
  const blob=new Blob(['<!doctype html>\n'+clone.outerHTML],{type:'text/html;charset=utf-8'});
  const link=document.createElement('a');link.href=URL.createObjectURL(blob);link.download='chen-jia-xian-homepage-edited.html';link.click();URL.revokeObjectURL(link.href);
});
restore();
