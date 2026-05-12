import React from "react";
import { useState, useEffect, useRef, useId } from "react";
import { THEME_IDS, BASE_ZOOM, TEXT_STEPS, getThemeCssVars } from "./theme.js";

// ── Ships ─────────────────────────────────────────────────────────────────────

const SHIPS = {
  boss:      ({size=28,color="#ff9f00"})=><svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden="true"><polygon points="16,2 28,20 22,18 22,28 16,24 10,28 10,18 4,20" fill={color} opacity="0.9"/><polygon points="16,6 24,18 16,14" fill="#fff" opacity="0.3"/><circle cx="16" cy="20" r="2.5" fill="#fff" opacity="0.6"/></svg>,
  "self-care":({size=26,color="#22d3ee"})=><svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden="true"><polygon points="16,3 20,14 30,14 22,21 25,30 16,24 7,30 10,21 2,14 12,14" fill={color} opacity="0.85"/><circle cx="16" cy="16" r="4" fill="#fff" opacity="0.35"/></svg>,
  movement:  ({size=26,color="#4ade80"})=><svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden="true"><polygon points="16,2 26,28 16,22 6,28" fill={color} opacity="0.9"/><ellipse cx="16" cy="28" rx="6" ry="2.5" fill={color} opacity="0.35"/></svg>,
  space:     ({size=26,color="#fbbf24"})=><svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden="true"><rect x="8" y="6" width="16" height="20" rx="4" fill={color} opacity="0.85"/><rect x="3" y="14" width="6" height="8" rx="2" fill={color} opacity="0.55"/><rect x="23" y="14" width="6" height="8" rx="2" fill={color} opacity="0.55"/><circle cx="16" cy="16" r="3" fill="#fff" opacity="0.45"/></svg>,
  mind:      ({size=26,color="#a78bfa"})=><svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden="true"><polygon points="16,3 19,12 29,12 21,18 24,28 16,22 8,28 11,18 3,12 13,12" fill={color} opacity="0.85"/></svg>,
  social:    ({size=26,color="#f472b6"})=><svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden="true"><ellipse cx="16" cy="14" rx="10" ry="12" fill={color} opacity="0.85"/><ellipse cx="8" cy="18" rx="5" ry="8" fill={color} opacity="0.5"/><ellipse cx="24" cy="18" rx="5" ry="8" fill={color} opacity="0.5"/><circle cx="16" cy="13" r="3.5" fill="#fff" opacity="0.4"/></svg>,
  mine:      ({size=26,color="#94a3b8"})=><svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden="true"><polygon points="16,4 20,13 30,13 22,19 25,29 16,23 7,29 10,19 2,13 12,13" fill={color} opacity="0.7"/></svg>,
};
const ShipIcon=({cat,size,done})=>{const C=SHIPS[cat]||SHIPS.mine;const color=done?"var(--mc-ship-done)":(CATS[cat]||{color:"#94a3b8"}).color;return <C size={size||26} color={color}/>;};

// ── Data ──────────────────────────────────────────────────────────────────────

const DEFAULT_MISSIONS=[
  {id:"shower",   title:"Shower",            cat:"self-care",min:45, icon:"🚿",desc:"Full shower"},
  {id:"teeth",    title:"Brush Teeth",       cat:"self-care",min:20, icon:"🦷",desc:"Morning or night"},
  {id:"clothes",  title:"Fresh Clothes",     cat:"self-care",min:15, icon:"👕",desc:"Change into clean clothes"},
  {id:"outside",  title:"Go Outside 10min",  cat:"movement", min:35, icon:"🌤️",desc:"Spend 10+ min outside"},
  {id:"walk",     title:"Walk the Block",    cat:"movement", min:50, icon:"🚶",desc:"A full loop outside"},
  {id:"move",     title:"Move 10 min",       cat:"movement", min:20, icon:"💪",desc:"Anything active"},
  {id:"floor",    title:"Clear the Floor",   cat:"space",    min:20, icon:"🗂️",desc:"5+ items put away"},
  {id:"dishes",   title:"Kitchen Dishes",    cat:"space",    min:15, icon:"🍽️",desc:"Bring dishes from room"},
  {id:"laundry",  title:"Laundry in Basket", cat:"space",    min:20, icon:"🧺",desc:"Put all dirty clothes in the basket"},
  {id:"read",     title:"Read 20 min",       cat:"mind",     min:30, icon:"📖",desc:"Any book or article"},
  {id:"code",     title:"Code Project",      cat:"mind",     min:50, icon:"⌨️", desc:"Build something — not gaming"},
  {id:"chess",    title:"Chess Puzzles",     cat:"mind",     min:30, icon:"♟️",desc:"10 puzzles or one full game"},
  {id:"chat",     title:"5-min Conversation",cat:"social",   min:20, icon:"💬",desc:"Talk about anything"},
  {id:"boss_code",title:"Marathon Code",     cat:"boss",     min:120,icon:"💻",desc:"2 hours coding or building",boss:true},
  {id:"boss_clean",title:"Room Deep Clean",  cat:"boss",     min:90, icon:"🏠",desc:"Full room clean and reorganize",boss:true},
  {id:"boss_out2",title:"Outside Twice",     cat:"boss",     min:100,icon:"🌳",desc:"Go outside two separate times today",boss:true},
  {id:"boss_fam", title:"Device-Free Hour",  cat:"boss",     min:90, icon:"🤝",desc:"1 full hour with family, no devices",boss:true},
];

const CATS={
  boss:      {label:"Boss Missions",color:"#ff9f00"},
  "self-care":{label:"Self-Care",   color:"#22d3ee"},
  movement:  {label:"Movement",     color:"#4ade80"},
  space:     {label:"Space",        color:"#fbbf24"},
  mind:      {label:"Mind",         color:"#a78bfa"},
  social:    {label:"Social",       color:"#f472b6"},
  mine:      {label:"My Missions",  color:"#94a3b8"},
};

const ACHV=[
  {id:"first",    icon:"⚡",title:"First Mission",  desc:"Complete your first ever mission",        chk:s=>s.total>=1},
  {id:"unlock",   icon:"🔓",title:"System Online",  desc:"Meet the gate for the first time",        chk:s=>s.gateDays>=1},
  {id:"s3",       icon:"🔥",title:"On Fire",        desc:"3 days in a row",                         chk:s=>s.maxStreak>=3},
  {id:"s7",       icon:"⭐",title:"Week Strong",    desc:"7-day streak",                            chk:s=>s.maxStreak>=7},
  {id:"s14",      icon:"💫",title:"Two Weeks",      desc:"14-day streak",                           chk:s=>s.maxStreak>=14},
  {id:"s30",      icon:"🏆",title:"Month Mode",     desc:"30-day streak",                           chk:s=>s.maxStreak>=30},
  {id:"d7",       icon:"📅",title:"Week Done",      desc:"Gate met on 7 total days",                chk:s=>s.gateDays>=7},
  {id:"d30",      icon:"🗓️",title:"Month One",     desc:"Gate met on 30 total days",               chk:s=>s.gateDays>=30},
  {id:"d60",      icon:"🎯",title:"Two Months",     desc:"Gate met on 60 total days",               chk:s=>s.gateDays>=60},
  {id:"d90",      icon:"👑",title:"Summer Legend",  desc:"Gate met all 90 days",                    chk:s=>s.gateDays>=90},
  {id:"power",    icon:"💪",title:"Power Day",      desc:"Earn 3+ hours in one day",                chk:s=>s.maxDayMin>=180},
  {id:"spectrum", icon:"🌈",title:"Full Spectrum",  desc:"Every category in one day",               chk:s=>s.allCatsDay},
  {id:"builder",  icon:"⌨️",title:"The Builder",   desc:"Code Project 10 times",                   chk:s=>s.codeCount>=10},
  {id:"outdoorsy",icon:"🌿",title:"Outdoorsy",      desc:"Outside 20 times total",                  chk:s=>s.outCount>=20},
  {id:"boss",     icon:"🦁",title:"Boss Level",     desc:"Complete any Boss Mission",               chk:s=>s.bossCount>=1},
  {id:"voice",    icon:"✍️",title:"In My Own Words",desc:"Send 5 messages to parents",             chk:s=>s.msgCount>=5},
  {id:"mood10",   icon:"🧠",title:"Self-Aware",     desc:"Log mood 10 days",                        chk:s=>s.moodCount>=10},
];

// Growth mindset messages — effort-focused, neutral tone, not parenty
const GM_COMPLETE=[
  "Missions running.","Logged.","That one's done.","One more in the bank.",
  "Progress noted.","Consistent.","It adds up.","Showed up. That's it.",
];
const GM_GATE=[
  "Gate cleared. Time bank open.",
  "Threshold met. Well done.",
  "Daily minimum: done.",
  "Bank unlocked. You earned the access.",
  "Gate open. Rest of the day is yours.",
];

const EMOTION_CORES=[
  {id:"joy",label:"Joy",color:"#fbbf24",emoji:"🌟"},
  {id:"trust",label:"Trust",color:"#4ade80",emoji:"🤝"},
  {id:"fear",label:"Fear",color:"#a78bfa",emoji:"😰"},
  {id:"surprise",label:"Surprise",color:"#00e5ff",emoji:"✨"},
  {id:"sadness",label:"Sadness",color:"#60a5fa",emoji:"💙"},
  {id:"disgust",label:"Disgust",color:"#f472b6",emoji:"😶"},
  {id:"anger",label:"Anger",color:"#f87171",emoji:"🔥"},
  {id:"anticipation",label:"Anticipation",color:"#fb923c",emoji:"🔮"},
];

const EMOTION_VARIANTS={
  joy:[
    {id:"happy",label:"Happy",hint:"Light feeling, smile muscles easy, breathing feels open"},
    {id:"excited",label:"Excited",hint:"Buzz in chest or limbs, restless energy, want to jump into what's next"},
    {id:"grateful",label:"Grateful",hint:"Warm steady chest, shoulders drop a little, quiet satisfaction"},
    {id:"content",label:"Content",hint:"Relaxed body, easy breathing, no urge to change anything"},
  ],
  trust:[
    {id:"safe",label:"Safe",hint:"Shoulders lower, stomach unclenched, slow steady heartbeat feels normal"},
    {id:"calm",label:"Calm",hint:"Even breath, thoughts spaced out, body feels heavier in a good way"},
    {id:"accepted",label:"Accepted",hint:"Open posture, less jaw tension, like sitting in a good chair"},
    {id:"proud",label:"Proud",hint:"Standing taller, chest open, steady warm pressure behind sternum"},
  ],
  fear:[
    {id:"anxious",label:"Anxious",hint:"Racing thoughts, stomach tightness, wanting to escape"},
    {id:"worried",label:"Worried",hint:"Thought loops in head, shallow breath, tight band across forehead"},
    {id:"overwhelmed",label:"Overwhelmed",hint:"Skin prickly or hot, senses feel turned up, hard to pick one thing"},
    {id:"nervous",label:"Nervous",hint:"Wobbly stomach, cold hands, legs feel ready to move"},
  ],
  surprise:[
    {id:"confused",label:"Confused",hint:"Eyes narrow slightly, head tilt, brain feels like buffering"},
    {id:"curious",label:"Curious",hint:"Leaning forward, eyes wider, attention locks onto the unknown"},
    {id:"shocked",label:"Shocked",hint:"Frozen for a second, wide eyes, breath catches"},
    {id:"amazed",label:"Amazed",hint:"Breath slows, staring, feels like the room got bigger"},
  ],
  sadness:[
    {id:"down",label:"Down",hint:"Heavy feeling, low energy, quiet inside"},
    {id:"lonely",label:"Lonely",hint:"Hollow or cold chest, urge to hide or wrap up in something soft"},
    {id:"disappointed",label:"Disappointed",hint:"Sagging face muscles, sigh comes easy, less interest in moving"},
    {id:"empty",label:"Empty",hint:"Flat line feeling, numb limbs, time feels stretched"},
  ],
  disgust:[
    {id:"annoyed",label:"Annoyed",hint:"Jaw tight, skin crawls a little, want sounds to stop"},
    {id:"uncomfortable",label:"Uncomfortable",hint:"Skin doesn't fit right, need to shift seat or clothes"},
    {id:"bored",label:"Bored",hint:"Heavy eyelids, slow blinks, everything feels gray and slow"},
    {id:"disgusted",label:"Disgusted",hint:"Squint, nose wrinkles, push-away feeling in gut"},
  ],
  anger:[
    {id:"frustrated",label:"Frustrated",hint:"Tight chest, clenched jaw, wanting things to move faster"},
    {id:"irritated",label:"Irritated",hint:"Teeth press, short breaths, every small sound feels too loud"},
    {id:"angry",label:"Angry",hint:"Heat in face and neck, fist wants to close, muscles coiled"},
    {id:"furious",label:"Furious",hint:"Loud heartbeat, tunnel vision, body feels ready to burst forward"},
  ],
  anticipation:[
    {id:"hopeful",label:"Hopeful",hint:"Lift in chest, eyes on the horizon, fingers tap without trying"},
    {id:"eager",label:"Eager",hint:"Leg bouncing, leaning in, can't sit still but it's focused"},
    {id:"unsure",label:"Unsure",hint:"Stomach flip-flops, scanning for signals, shoulders halfway up"},
    {id:"restless",label:"Restless",hint:"Need to pace or shift, energy with nowhere to land yet"},
  ],
};

const LEGACY_MOOD_DISPLAY={
  low:{emoji:"🔋",label:"Low (legacy)",color:"#22d3ee"},
  okay:{emoji:"😐",label:"Okay (legacy)",color:"#94a3b8"},
  high:{emoji:"⚡",label:"High (legacy)",color:"#fbbf24"},
};

export function getMoodDisplay(moodStr){
  if(!moodStr)return{emoji:"",label:"",color:"#8ab0d0"};
  if(LEGACY_MOOD_DISPLAY[moodStr])return LEGACY_MOOD_DISPLAY[moodStr];
  const dash=moodStr.indexOf("-");
  if(dash===-1)return{emoji:"○",label:moodStr,color:"#8ab0d0"};
  const coreId=moodStr.slice(0,dash),varId=moodStr.slice(dash+1);
  const core=EMOTION_CORES.find(c=>c.id===coreId);
  if(!core)return{emoji:"○",label:moodStr,color:"#8ab0d0"};
  const list=EMOTION_VARIANTS[coreId]||[];
  const v=list.find(x=>x.id===varId);
  const vlabel=v?v.label:varId.replace(/-/g," ");
  return{emoji:core.emoji,label:`${vlabel} · ${core.label}`,color:core.color};
}

function polarPt(cx,cy,r,deg){
  const rad=(deg*Math.PI)/180;
  return{x:cx+r*Math.cos(rad),y:cy+r*Math.sin(rad)};
}

function annulusWedge(cx,cy,rInner,rOuter,deg0,deg1){
  const p0=polarPt(cx,cy,rInner,deg0),p1=polarPt(cx,cy,rInner,deg1),p2=polarPt(cx,cy,rOuter,deg1),p3=polarPt(cx,cy,rOuter,deg0);
  const large=Math.abs(deg1-deg0)>180?1:0;
  return`M ${p0.x} ${p0.y} L ${p3.x} ${p3.y} A ${rOuter} ${rOuter} 0 ${large} 1 ${p2.x} ${p2.y} L ${p1.x} ${p1.y} A ${rInner} ${rInner} 0 ${large} 0 ${p0.x} ${p0.y} Z`;
}

const K={
  pin:"jg_pin",missions:"jg_missions",done:"jg_done",bank:"jg_bank",
  history:"jg_history",gate:"jg_gate",myM:"jg_my_missions",
  start:"jg_summer_start",milestones:"jg_milestones",
  skipped:"jg_skipped",mood:"jg_mood",messages:"jg_messages",
  theme:"jg_theme",uiText:"jg_ui_text",missionLayout:"jg_mission_layout",
};
const DEFAULT_START="2026-06-23";

const MISSION_LAYOUTS=["compact","comfort","cards"];
function normalizeMissionLayout(raw){
  if(MISSION_LAYOUTS.includes(raw))return raw;
  if(raw==="list")return"compact";
  if(raw==="card")return"comfort";
  return"comfort";
}

// ── Storage ───────────────────────────────────────────────────────────────────

const sg=async k=>{try{const v=localStorage.getItem(k);return v;}catch{return null;}};
const ss=async(k,v)=>{try{localStorage.setItem(k,String(v));}catch{}};

// ── Helpers ───────────────────────────────────────────────────────────────────

function getStats(history,gateMin){
  const srt=[...history].sort((a,b)=>new Date(a.date)-new Date(b.date));
  const total=history.reduce((s,h)=>s+h.completed.length,0);
  const gateDays=history.filter(h=>h.completed.length>=gateMin).length;
  const maxDayMin=history.reduce((mx,h)=>Math.max(mx,h.totalMin),0);
  const bossCount=history.reduce((s,h)=>s+h.completed.filter(m=>m.cat==="boss").length,0);
  const codeCount=history.reduce((s,h)=>s+h.completed.filter(m=>["code","boss_code"].includes(m.id)).length,0);
  const outCount=history.reduce((s,h)=>s+h.completed.filter(m=>["outside","walk","boss_out2"].includes(m.id)).length,0);
  const allCatsDay=history.some(h=>{const c=new Set(h.completed.map(m=>m.cat));return["self-care","movement","space","mind","social"].every(x=>c.has(x));});
  let maxStreak=0,cur=0;
  srt.forEach((h,i)=>{
    if(h.completed.length>=gateMin){if(i===0)cur=1;else{const df=(new Date(h.date)-new Date(srt[i-1].date))/86400000;cur=df===1?cur+1:1;}maxStreak=Math.max(maxStreak,cur);}else cur=0;
  });
  return{total,gateDays,maxStreak,maxDayMin,allCatsDay,codeCount,outCount,bossCount,msgCount:0,moodCount:0};
}

function currentStreak(history,gateMin){
  let s=0;
  for(let i=1;i<=90;i++){const d=new Date();d.setDate(d.getDate()-i);const e=history.find(h=>h.date===d.toDateString());if(e&&e.completed.length>=gateMin)s++;else break;}
  return s;
}

function buildCal(startStr,history,gateMin){
  const pd=s=>{const[y,m,d]=s.split("-").map(Number);return new Date(y,m-1,d);};
  const start=pd(startStr);
  const dow=start.getDay(),toMon=dow===0?-6:1-dow;
  const gs=new Date(start);gs.setDate(gs.getDate()+toMon);
  const today=new Date();today.setHours(0,0,0,0);
  const end=new Date(start);end.setDate(start.getDate()+90);
  const cells=[];
  for(let i=0;i<91;i++){
    const d=new Date(gs);d.setDate(gs.getDate()+i);d.setHours(0,0,0,0);
    const ds=d.toDateString(),inSum=d>=start&&d<end,isFut=d>today;
    const e=history.find(h=>h.date===ds);
    cells.push({ds,inSum,isFut,d,metGate:inSum&&!isFut&&!!e&&e.completed.length>=gateMin,count:e?e.completed.length:0,isToday:ds===today.toDateString()});
  }
  return cells;
}

function fmtDate(ds){
  const d=new Date(ds),t=new Date().toDateString(),y=new Date(Date.now()-86400000).toDateString();
  if(ds===t)return"Today";if(ds===y)return"Yesterday";
  return d.toLocaleDateString("en-US",{weekday:"short",month:"short",day:"numeric"});
}
function fmtTime(ts){return new Date(ts).toLocaleTimeString("en-US",{hour:"numeric",minute:"2-digit"});}
function pick(arr){return arr[Math.floor(Math.random()*arr.length)];}

// ── Root ──────────────────────────────────────────────────────────────────────

export default function App(){
  const [missions, setMissions]=useState(DEFAULT_MISSIONS);
  const [myM,      setMyM]     =useState([]);
  const [done,     setDone]    =useState([]);
  const [skipped,  setSkipped] =useState([]);
  const [bank,     setBank]    =useState(0);
  const [history,  setHistory] =useState([]);
  const [mood,     setMood]    =useState(null);
  const [messages, setMessages]=useState([]);
  const [gateMin,  setGateMin] =useState(3);
  const [sumStart, setSumStart]=useState(DEFAULT_START);
  const [milestones,setMilestones]=useState({m30:"",m60:"",m90:""});
  const [view,     setView]    =useState("board");
  const [flash,    setFlash]   =useState(null);
  const [toast,    setToast]   =useState(null);
  const [gmMsg,    setGmMsg]   =useState(null);
  const [prevGateOpen,setPrevGateOpen]=useState(false);
  const [ready,    setReady]   =useState(false);
  const [theme,    setTheme]   =useState(()=>{try{const t=localStorage.getItem(K.theme);if(t&&THEME_IDS.includes(t))return t;}catch{}return"space";});
  const [textStep, setTextStep]=useState(()=>{try{const u=localStorage.getItem(K.uiText);if(u!=null){const n=parseInt(u,10);if(!Number.isNaN(n)&&n>=0&&n<TEXT_STEPS.length)return n;}}catch{}return 0;});
  const [scrollY,setScrollY]=useState(0);
  const rootRef=useRef(null);

  useEffect(()=>{
    const onScroll=()=>{
      const y=window.scrollY||document.documentElement.scrollTop;
      setScrollY(y);
      const el=rootRef.current;
      if(el)el.dataset.scrolled=y>12?"1":"0";
    };
    onScroll();
    window.addEventListener("scroll",onScroll,{passive:true});
    return()=>window.removeEventListener("scroll",onScroll);
  },[]);

  useEffect(()=>{
    (async()=>{
      const today=new Date().toDateString();
      const m=await sg(K.missions);    if(m)setMissions(JSON.parse(m));
      const mm=await sg(K.myM);        if(mm)setMyM(JSON.parse(mm));
      const d=await sg(K.done);
      if(d){const p=JSON.parse(d);if(p.date===today)setDone(p.ids);else{await ss(K.done,JSON.stringify({date:today,ids:[]}));await ss(K.bank,0);}}
      const sk=await sg(K.skipped);
      if(sk){const p=JSON.parse(sk);if(p.date===today)setSkipped(p.ids);else await ss(K.skipped,JSON.stringify({date:today,ids:[]}));}
      const savedDone=await sg(K.done);
      if(savedDone&&JSON.parse(savedDone).date===today){const b=await sg(K.bank);if(b)setBank(Number(b));}
      const h=await sg(K.history);     if(h)setHistory(JSON.parse(h));
      const g=await sg(K.gate);        if(g)setGateMin(Number(g));
      const st=await sg(K.start);      if(st)setSumStart(st);
      const ml=await sg(K.milestones); if(ml)setMilestones(JSON.parse(ml));
      const mo=await sg(K.mood);
      if(mo){const p=JSON.parse(mo);if(p.date===today)setMood(p.value);}
      const msg=await sg(K.messages);  if(msg)setMessages(JSON.parse(msg));
      setReady(true);
    })();
  },[]);

  const pushHistory=async(ids,allM,moodVal)=>{
    const today=new Date().toDateString();
    const completed=allM.filter(m=>ids.includes(m.id)).map(m=>({id:m.id,title:m.title,icon:m.icon,cat:m.cat,min:m.min}));
    const moodForEntry=moodVal===undefined?mood:moodVal;
    const entry={date:today,completed,totalMin:completed.reduce((s,m)=>s+m.min,0),...(moodForEntry!=null?{mood:moodForEntry}:{})};
    setHistory(prev=>{const upd=[entry,...prev.filter(h=>h.date!==today)].slice(0,90);ss(K.history,JSON.stringify(upd));return upd;});
  };

  const complete=async(m)=>{
    if(done.includes(m.id))return;
    const today=new Date().toDateString();
    const newDone=[...done,m.id],newBank=bank+m.min;
    setDone(newDone);setBank(newBank);
    setFlash(m.id);setTimeout(()=>setFlash(null),1200);
    // growth mindset message on completion
    const msg=pick(GM_COMPLETE);setGmMsg(msg);setTimeout(()=>setGmMsg(null),2200);
    await ss(K.done,JSON.stringify({date:today,ids:newDone}));
    await ss(K.bank,newBank);
    const allM=[...missions,...myM];
    await pushHistory(newDone,allM);
    // check gate just opened
    const wasOpen=prevGateOpen,nowOpen=newDone.length>=gateMin;
    if(!wasOpen&&nowOpen){
      const gm=pick(GM_GATE);setTimeout(()=>{setGmMsg(gm);setTimeout(()=>setGmMsg(null),3000);},2400);
      setPrevGateOpen(true);
    }
    // check achievements
    const newHist=[{date:today,completed:allM.filter(x=>newDone.includes(x.id)).map(x=>({...x})),totalMin:newBank},...history.filter(h=>h.date!==today)];
    const stats=getStats(newHist,gateMin),prevStats=getStats(history,gateMin);
    const newA=ACHV.find(a=>a.chk(stats)&&!a.chk(prevStats));
    if(newA){setTimeout(()=>{setToast(newA);setTimeout(()=>setToast(null),3500);},nowOpen&&!wasOpen?5600:2400);}
  };

  const uncomplete=async(m)=>{
    if(!done.includes(m.id))return;
    const today=new Date().toDateString();
    const newDone=done.filter(id=>id!==m.id),newBank=Math.max(0,bank-m.min);
    setDone(newDone);setBank(newBank);
    if(newDone.length<gateMin)setPrevGateOpen(false);
    await ss(K.done,JSON.stringify({date:today,ids:newDone}));
    await ss(K.bank,newBank);
    await pushHistory(newDone,[...missions,...myM]);
  };

  const skip=async(m)=>{
    if(skipped.includes(m.id)||done.includes(m.id))return;
    const today=new Date().toDateString();
    const newSkipped=[...skipped,m.id];
    setSkipped(newSkipped);
    await ss(K.skipped,JSON.stringify({date:today,ids:newSkipped}));
  };

  const unskip=async(m)=>{
    const today=new Date().toDateString();
    const newSkipped=skipped.filter(id=>id!==m.id);
    setSkipped(newSkipped);
    await ss(K.skipped,JSON.stringify({date:today,ids:newSkipped}));
  };

  const saveMood=async val=>{
    const today=new Date().toDateString();
    setMood(val);
    await ss(K.mood,JSON.stringify({date:today,value:val}));
    await pushHistory(done,[...missions,...myM],val);
  };

  const clearMood=async()=>{
    const today=new Date().toDateString();
    setMood(null);
    try{localStorage.removeItem(K.mood);}catch{}
    await pushHistory(done,[...missions,...myM],null);
  };

  const sendMessage=async(text)=>{
    const msg={id:`msg_${Date.now()}`,text,timestamp:Date.now(),read:false};
    const updated=[msg,...messages].slice(0,50);
    setMessages(updated);
    await ss(K.messages,JSON.stringify(updated));
  };

  const markRead=async(id)=>{
    const updated=messages.map(m=>m.id===id?{...m,read:true}:m);
    setMessages(updated);
    await ss(K.messages,JSON.stringify(updated));
  };

  const markAllRead=async()=>{
    const updated=messages.map(m=>({...m,read:true}));
    setMessages(updated);
    await ss(K.messages,JSON.stringify(updated));
  };

  const useTime=async(min)=>{const nb=Math.max(0,bank-min);setBank(nb);await ss(K.bank,nb);};
  const resetDay=async()=>{
    const today=new Date().toDateString();
    setDone([]);setSkipped([]);setBank(0);setPrevGateOpen(false);
    await ss(K.done,JSON.stringify({date:today,ids:[]}));
    await ss(K.skipped,JSON.stringify({date:today,ids:[]}));
    await ss(K.bank,0);
    await pushHistory([],[...missions,...myM]);
  };
  const updateMissions=async m=>{setMissions(m);await ss(K.missions,JSON.stringify(m));};
  const updateMyM=async m=>{setMyM(m);await ss(K.myM,JSON.stringify(m));};
  const updateGate=async n=>{setGateMin(n);await ss(K.gate,n);};
  const updateStart=async s=>{setSumStart(s);await ss(K.start,s);};
  const updateMilestones=async m=>{setMilestones(m);await ss(K.milestones,JSON.stringify(m));};

  const gateOpen=done.length>=gateMin;
  const streak=currentStreak(history,gateMin);
  const stats={...getStats(history,gateMin),msgCount:messages.length,moodCount:history.filter(h=>h.mood).length};
  const earned=ACHV.filter(a=>a.chk(stats)).map(a=>a.id);
  const unreadCount=messages.filter(m=>!m.read).length;

  if(!ready)return(
    <div ref={rootRef} className={`mission-control-root theme-${theme}`} data-theme={theme} style={{...getThemeCssVars(theme),zoom:BASE_ZOOM*TEXT_STEPS[textStep],minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"var(--mc-font-mono)",color:"var(--mc-accent)",fontSize:16,letterSpacing:3,position:"relative",paddingRight:96}}>
      <style>{CSS}</style>
      <AppearanceBar theme={theme} setTheme={setTheme} textStep={textStep} setTextStep={setTextStep}/>
      <div style={{textAlign:"center"}}><div style={{fontSize:38,marginBottom:16}}>🚀</div><div>INITIALIZING...</div></div>
    </div>
  );

  const cssVars=getThemeCssVars(theme);
  const uiZoom=BASE_ZOOM*TEXT_STEPS[textStep];

  return(
    <div ref={rootRef} className={`mission-control-root theme-${theme}`} data-theme={theme} style={{...cssVars,zoom:uiZoom,fontFamily:"var(--mc-font-ui)",background:"var(--mc-bg)",minHeight:"100vh",color:"var(--mc-text)",paddingBottom:80,position:"relative",overflow:"hidden"}}>
      <style>{CSS}</style>
      <Starfield themeId={theme} scrollY={scrollY}/>
      {toast&&<Toast achv={toast}/>}
      {gmMsg&&<GmToast msg={gmMsg}/>}
      <AppearanceBar theme={theme} setTheme={setTheme} textStep={textStep} setTextStep={setTextStep}/>
      <div style={{position:"relative",zIndex:1,paddingRight:96}}>
        <div className="mc-sticky-head">
          <Header bank={bank} gateOpen={gateOpen} done={done.length} gateMin={gateMin} streak={streak}/>
          <Nav view={view} setView={setView} unread={unreadCount}/>
        </div>
        <main className="mc-main" style={{padding:"0 16px",maxWidth:680,margin:"0 auto",scrollMarginTop:96}}>
          {view==="board"    &&<Board missions={missions} myM={myM} done={done} skipped={skipped} flash={flash} mood={mood} onComplete={complete} onUncomplete={uncomplete} onSkip={skip} onUnskip={unskip} onSaveMood={saveMood} onClearMood={clearMood} onSendMessage={sendMessage} onUpdateMyM={updateMyM}/>}
          {view==="progress" &&<Progress history={history} gateMin={gateMin} streak={streak} stats={stats} earned={earned} sumStart={sumStart} milestones={milestones}/>}
          {view==="bank"     &&<Bank bank={bank} gateOpen={gateOpen} done={done.length} gateMin={gateMin} onUse={useTime}/>}
          {view==="ops"      &&<Ops missions={missions} myM={myM} done={done} bank={bank} gateMin={gateMin} sumStart={sumStart} milestones={milestones} messages={messages} history={history} onReset={resetDay} onUpdateMissions={updateMissions} onUpdateGate={updateGate} onUpdateStart={updateStart} onUpdateMilestones={updateMilestones} onMarkRead={markRead} onMarkAllRead={markAllRead}/>}
        </main>
      </div>
    </div>
  );
}

// ── CSS ───────────────────────────────────────────────────────────────────────

const CSS=`
  @import url('https://fonts.googleapis.com/css2?family=Oxanium:wght@300;400;600;700;800&family=JetBrains+Mono:wght@300;400;500&display=swap');
  :root{--mc-ease-out:cubic-bezier(0.22,1,0.36,1);--mc-ease-spring:cubic-bezier(0.34,1.56,0.64,1);}
  *{box-sizing:border-box;margin:0;padding:0;}
  html{scroll-behavior:smooth;}
  body{overscroll-behavior-y:contain;}
  .mc-main{scroll-padding-top:96px;}
  ::-webkit-scrollbar{width:5px;}
  ::-webkit-scrollbar-track{background:var(--mc-scroll-track);}
  ::-webkit-scrollbar-thumb{background:var(--mc-scroll-thumb);border-radius:4px;transition:background 0.25s var(--mc-ease-out),box-shadow 0.25s ease;}
  ::-webkit-scrollbar-thumb:hover{background:var(--mc-accent);box-shadow:0 0 10px color-mix(in srgb,var(--mc-accent) 45%,transparent);}
  @keyframes fadeUp{from{opacity:0;transform:translateY(12px);}to{opacity:1;transform:translateY(0);}}
  @keyframes twinkle{0%,100%{opacity:0.2;}50%{opacity:0.9;}}
  @keyframes pop{0%{transform:scale(1);}40%{transform:scale(1.04);}100%{transform:scale(1);}}
  @keyframes glow{0%{box-shadow:0 0 0 0 rgba(74,222,128,0.45);}100%{box-shadow:0 0 22px 0 rgba(74,222,128,0);}}
  @keyframes toastIn{from{opacity:0;transform:translateY(-20px) scale(0.95);}to{opacity:1;transform:translateY(0) scale(1);}}
  @keyframes gmIn{from{opacity:0;transform:translateX(20px);}to{opacity:1;transform:translateX(0);}}
  @keyframes barIn{from{width:0;}}
  @keyframes scanline{0%{top:-10%;}100%{top:110%;}}
  @keyframes mcWheelOuterIn{from{opacity:0}to{opacity:1}}
  @keyframes mcBodyHintIn{from{opacity:0}to{opacity:1}}
  .mc-body-hint{animation:mcBodyHintIn 0.3s ease forwards;}
  .mc-wheel-hit:focus{outline:none;}
  .mc-wheel-hit:focus-visible{outline:none;stroke:#00e5ff!important;stroke-width:3px!important;filter:brightness(1.12);}
  @keyframes mc-shimmer{0%{background-position:-120% 0;}100%{background-position:220% 0;}}

  .mc-sticky-head{
    position:sticky;top:0;z-index:45;
    margin:-4px -8px 0;padding:8px 8px 4px;
    border-radius:0 0 16px 16px;
    transition:box-shadow 0.45s var(--mc-ease-out),background 0.45s var(--mc-ease-out),backdrop-filter 0.45s ease,border-color 0.35s ease;
    border-bottom:1px solid transparent;
  }
  .mission-control-root[data-scrolled="1"] .mc-sticky-head{
    box-shadow:0 14px 48px rgba(0,0,0,0.42),0 1px 0 color-mix(in srgb,var(--mc-accent) 18%,transparent) inset;
    background:var(--mc-panel-95);
    backdrop-filter:blur(16px) saturate(1.2);
    -webkit-backdrop-filter:blur(16px) saturate(1.2);
    border-bottom-color:color-mix(in srgb,var(--mc-border) 70%,var(--mc-accent));
  }

  .card.mc-mcard{
    animation:fadeUp 0.34s var(--mc-ease-out) both;
    transition:transform 0.32s var(--mc-ease-out),box-shadow 0.32s var(--mc-ease-out),border-color 0.28s ease,filter 0.28s ease,opacity 0.28s ease,background 0.28s ease;
    will-change:transform;
    box-shadow:none;
  }
  .card.mc-mcard[data-boss="1"]:not(.done):not(.skip){box-shadow:0 0 14px rgba(255,159,0,0.12);}
  .card.mc-mcard:not(.done):not(.skip):hover{
    transform:translateY(-6px) scale(1.015);
    box-shadow:
      0 18px 48px rgba(0,0,0,0.42),
      0 0 0 1px color-mix(in srgb,var(--mc-card-cat) 48%,transparent),
      0 0 36px color-mix(in srgb,var(--mc-card-cat) 24%,transparent);
    filter:brightness(1.07);
  }
  .mc-mission-cards-3 .card.mc-mcard:not(.done):not(.skip):hover{
    transform:translateY(-8px) scale(1.025);
  }
  .card.mc-mcard[data-boss="1"]:not(.done):not(.skip):hover{
    box-shadow:
      0 22px 52px rgba(0,0,0,0.48),
      0 0 0 1px color-mix(in srgb,#ffb020 58%,transparent),
      0 0 42px color-mix(in srgb,#ffb020 32%,transparent),
      0 0 28px rgba(255,159,0,0.22);
  }
  .card.mc-mcard.done:hover,.card.mc-mcard.skip:hover{
    transform:translateY(-3px) scale(1.01);
    filter:brightness(1.1);
    box-shadow:0 12px 30px rgba(0,0,0,0.28),0 0 0 1px color-mix(in srgb,var(--mc-accent) 16%,transparent);
  }
  .card.mc-mcard:not(.done):not(.skip):active{transform:translateY(-1px) scale(0.992);transition-duration:0.08s;}
  .card.mc-mcard.just-done{animation:pop 0.35s ease,glow 0.8s ease;}

  .card.mc-mcard .cbtn:hover:not(:disabled){transform:scale(1.04);}

  .cbtn{transition:filter 0.22s ease,transform 0.18s var(--mc-ease-spring),box-shadow 0.22s ease,background 0.22s ease,border-color 0.22s ease,color 0.18s ease;}
  .cbtn:hover:not(:disabled){filter:brightness(1.22);transform:scale(1.06);box-shadow:0 4px 18px color-mix(in srgb,var(--mc-accent) 15%,transparent);}
  .cbtn:active:not(:disabled){transform:scale(0.94);filter:brightness(0.95);}
  .cbtn:focus-visible{outline:3px solid var(--mc-accent);outline-offset:2px;border-radius:4px;}
  .cbtn:disabled{opacity:0.45;cursor:not-allowed;}

  .hcard{
    animation:fadeUp 0.3s var(--mc-ease-out) both;
    cursor:pointer;
    transition:transform 0.26s var(--mc-ease-out),box-shadow 0.26s ease,border-color 0.24s ease,filter 0.2s ease;
  }
  .hcard:hover{
    transform:translateY(-3px) scale(1.008);
    box-shadow:0 10px 32px rgba(0,0,0,0.35),0 0 0 1px color-mix(in srgb,var(--mc-accent) 20%,transparent);
    filter:brightness(1.04);
  }
  .hcard:active{transform:translateY(0) scale(0.998);}

  .mc-nav-tab{
    transition:transform 0.22s var(--mc-ease-out),background 0.28s ease,color 0.22s ease,box-shadow 0.28s ease,border-bottom-color 0.25s ease,filter 0.2s ease;
  }
  .mc-nav-tab:hover{
    transform:translateY(-2px);
    filter:brightness(1.08);
    box-shadow:0 6px 20px rgba(0,0,0,0.25);
  }
  .mc-nav-tab[aria-current="page"]{box-shadow:0 4px 16px color-mix(in srgb,var(--mc-accent) 18%,transparent);}

  .mc-aside-dock{
    transform:translateY(-50%);
    transition:transform 0.35s var(--mc-ease-out),box-shadow 0.35s ease,border-color 0.3s ease,filter 0.25s ease;
  }
  .mc-aside-dock:hover{
    transform:translateY(-50%) translateX(-3px);
    box-shadow:-8px 0 36px rgba(0,0,0,0.45),0 0 0 1px color-mix(in srgb,var(--mc-accent) 25%,transparent);
    filter:brightness(1.06);
  }
  .mc-aside-btn{
    transition:transform 0.2s var(--mc-ease-spring),background 0.22s ease,color 0.2s ease,border-color 0.22s ease,box-shadow 0.22s ease;
  }
  .mc-aside-btn:hover{transform:scale(1.04);box-shadow:0 0 14px color-mix(in srgb,var(--mc-accent) 20%,transparent);}
  .mc-aside-btn:active{transform:scale(0.96);}
  .mc-aside-btn[aria-pressed="true"]{box-shadow:0 0 16px color-mix(in srgb,var(--mc-accent) 25%,transparent);}

  .mc-layout-tab{
    transition:transform 0.2s var(--mc-ease-spring),background 0.22s ease,color 0.2s ease,border-color 0.22s ease,box-shadow 0.22s ease;
  }
  .mc-layout-tab:hover{transform:translateY(-2px);box-shadow:0 6px 18px rgba(0,0,0,0.22);}
  .mc-layout-tab:active{transform:translateY(0) scale(0.97);}
  .mc-layout-tab[aria-pressed="true"]{box-shadow:0 0 14px color-mix(in srgb,var(--mc-accent) 18%,transparent);}

  .mc-panel-tile{transition:transform 0.28s var(--mc-ease-out),box-shadow 0.28s ease,border-color 0.25s ease,filter 0.22s ease;}
  .mc-panel-tile:hover{
    transform:translateY(-2px);
    box-shadow:0 10px 28px rgba(0,0,0,0.28),0 0 0 1px color-mix(in srgb,var(--mc-accent) 12%,transparent);
    filter:brightness(1.03);
  }
  .mc-mood-panel .cbtn:hover{transform:scale(1.05);}

  .mc-bank-hit:not(:disabled):hover{
    transform:scale(1.04);
    box-shadow:0 8px 26px color-mix(in srgb,var(--mc-accent) 22%,transparent);
  }
  .mc-bank-hit:not(:disabled):active{transform:scale(0.97);}

  .mc-ach-tile{transition:transform 0.24s var(--mc-ease-out),box-shadow 0.24s ease,opacity 0.25s ease,border-color 0.22s ease,filter 0.2s ease;}
  .mc-ach-tile:hover{transform:scale(1.02);box-shadow:0 6px 20px rgba(0,0,0,0.22);filter:brightness(1.05);}

  .mission-control-root input:not([type="password"]):not([type="checkbox"]),
  .mission-control-root textarea,
  .mission-control-root select{
    transition:border-color 0.22s ease,box-shadow 0.22s ease,background 0.22s ease,transform 0.18s ease;
  }
  .mission-control-root input:hover:not(:disabled),
  .mission-control-root textarea:hover:not(:disabled),
  .mission-control-root select:hover:not(:disabled){
    border-color:color-mix(in srgb,var(--mc-accent) 55%,var(--mc-border))!important;
    box-shadow:0 0 0 1px color-mix(in srgb,var(--mc-accent) 15%,transparent);
  }
  .mission-control-root input:focus,
  .mission-control-root textarea:focus,
  .mission-control-root select:focus{transform:scale(1.005);}

  button:focus-visible{outline:3px solid var(--mc-accent);outline-offset:2px;}
  input:focus-visible,select:focus-visible,textarea:focus-visible{outline:2px solid var(--mc-accent);outline-offset:0;}
  input,select,textarea{outline:none;}
  button{cursor:pointer;}

  @media (prefers-reduced-motion: reduce){
    html{scroll-behavior:auto;}
    .card.mc-mcard,.cbtn,.hcard,.mc-nav-tab,.mc-aside-btn,.mc-layout-tab,.mc-panel-tile,.mc-sticky-head,.mc-ach-tile,.mc-bank-hit{transition:none!important;}
    .card.mc-mcard:not(.done):not(.skip):hover,.mc-mission-cards-3 .card.mc-mcard:not(.done):not(.skip):hover,.card.mc-mcard.done:hover,.card.mc-mcard.skip:hover,.hcard:hover,.mc-nav-tab:hover,.mc-aside-dock:hover,.mc-layout-tab:hover,.mc-aside-btn:hover,.mc-panel-tile:hover,.mc-ach-tile:hover,.mc-bank-hit:not(:disabled):hover{transform:none!important;filter:none!important;box-shadow:none!important;}
    .mc-aside-dock:hover{transform:translateY(-50%)!important;}
  }

  .mc-mission-cards-3{display:grid;gap:10px;grid-template-columns:repeat(3,minmax(0,1fr));}
  @media (max-width:600px){.mc-mission-cards-3{grid-template-columns:1fr;}}
  @media (min-width:601px) and (max-width:900px){.mc-mission-cards-3{grid-template-columns:repeat(2,minmax(0,1fr));}}
`;

// ── Starfield ─────────────────────────────────────────────────────────────────

function Starfield({themeId,scrollY=0}){
  const py=Math.min(scrollY*0.042,56);
  const wrap={position:"fixed",inset:0,pointerEvents:"none",zIndex:0,overflow:"hidden",willChange:"transform",transform:`translate3d(0,${py}px,0)`};
  if(themeId==="light"){
    return(
      <div style={wrap} aria-hidden="true">
        <div style={{position:"absolute",width:620,height:620,borderRadius:"50%",background:"radial-gradient(circle,rgba(148,163,184,0.18) 0%,transparent 68%)",top:"-10%",right:"-12%"}}/>
        <div style={{position:"absolute",width:520,height:520,borderRadius:"50%",background:"radial-gradient(circle,rgba(125,211,252,0.14) 0%,transparent 68%)",bottom:"-18%",left:"-18%"}}/>
      </div>
    );
  }
  if(themeId==="terminal"){
    const glyphs=Array.from({length:48},(_,i)=>({x:(i*41+7)%100,y:(i*29+3)%100,size:i%4===0?1.5:1,delay:(i*0.22)%5,dur:1.8+(i%4)*0.4}));
    return(
      <div style={wrap} aria-hidden="true">
        <div style={{position:"absolute",inset:0,backgroundImage:"linear-gradient(var(--mc-terminal-grid) 1px,transparent 1px),linear-gradient(90deg,var(--mc-terminal-grid) 1px,transparent 1px)",backgroundSize:"18px 18px"}}/>
        {glyphs.map((s,i)=><div key={i} style={{position:"absolute",left:`${s.x}%`,top:`${s.y}%`,width:s.size,height:s.size,borderRadius:1,background:"var(--mc-accent)",animation:`twinkle ${s.dur}s ${s.delay}s ease-in-out infinite`,opacity:0.22}}/>)}
        <div style={{position:"absolute",left:0,right:0,height:1,background:"linear-gradient(90deg,transparent,var(--mc-scan),transparent)",animation:"scanline 8s linear infinite"}}/>
      </div>
    );
  }
  const stars=Array.from({length:80},(_,i)=>({x:(i*37+11)%100,y:(i*53+7)%100,size:i%5===0?2:i%3===0?1.5:1,delay:(i*0.3)%4,dur:2+(i%3)}));
  return(
    <div style={wrap} aria-hidden="true">
      <div style={{position:"absolute",width:400,height:400,borderRadius:"50%",background:"radial-gradient(circle,var(--mc-star-a) 0%,transparent 70%)",top:"10%",left:"60%",transform:"translate(-50%,-50%)"}}/>
      <div style={{position:"absolute",width:300,height:300,borderRadius:"50%",background:"radial-gradient(circle,var(--mc-star-b) 0%,transparent 70%)",top:"70%",left:"20%",transform:"translate(-50%,-50%)"}}/>
      {stars.map((s,i)=><div key={i} style={{position:"absolute",left:`${s.x}%`,top:`${s.y}%`,width:s.size,height:s.size,borderRadius:"50%",background:"#fff",animation:`twinkle ${s.dur}s ${s.delay}s ease-in-out infinite`,opacity:0.35}}/>)}
      <div style={{position:"absolute",left:0,right:0,height:1,background:"linear-gradient(90deg,transparent,var(--mc-scan),transparent)",animation:"scanline 8s linear infinite"}}/>
    </div>
  );
}

// ── Toast / GM ────────────────────────────────────────────────────────────────

function Toast({achv}){
  return <div role="alert" aria-live="polite" style={{position:"fixed",top:16,left:"50%",transform:"translateX(-50%)",background:"var(--mc-toast-bg)",border:"2px solid var(--mc-toast-br)",borderRadius:12,padding:"13px 20px",zIndex:999,display:"flex",alignItems:"center",gap:11,boxShadow:"0 4px 28px rgba(0,255,127,0.3)",animation:"toastIn 0.4s cubic-bezier(0.34,1.56,0.64,1)"}}><span style={{fontSize:22}}>{achv.icon}</span><div><div style={{fontFamily:"var(--mc-font-ui)",fontWeight:700,fontSize:12,color:"var(--mc-toast-tx)",letterSpacing:1}}>{achv.title}</div><div style={{fontFamily:"var(--mc-font-mono)",fontSize:9,color:"var(--mc-toast-sub)",marginTop:1}}>ACHIEVEMENT UNLOCKED</div></div></div>;
}

function GmToast({msg}){
  return <div aria-live="polite" style={{position:"fixed",bottom:90,right:16,background:"var(--mc-gm-bg)",border:"1px solid var(--mc-border-accent)",borderRadius:8,padding:"8px 14px",zIndex:998,fontFamily:"var(--mc-font-mono)",fontSize:11,color:"var(--mc-dim)",animation:"gmIn 0.3s ease",backdropFilter:"blur(8px)",maxWidth:220,letterSpacing:0.3}}>{msg}</div>;
}

// ── Appearance (theme + text size) ───────────────────────────────────────────

function AppearanceBar({theme,setTheme,textStep,setTextStep}){
  const tab=(active,onClick,label)=><button type="button" className="mc-aside-btn" onClick={onClick} aria-pressed={active} style={{width:"100%",padding:"8px 6px",borderRadius:6,border:`1px solid ${active?"var(--mc-accent)":"var(--mc-border)"}`,background:active?"var(--mc-nav-on)":"transparent",color:active?"var(--mc-accent)":"var(--mc-muted)",fontFamily:"var(--mc-font-mono)",fontSize:9,fontWeight:700,letterSpacing:0.5,textAlign:"center"}}>{label}</button>;
  return(
    <aside className="mc-aside-dock" aria-label="Theme and text size" style={{
      position:"fixed",
      right:"max(8px, env(safe-area-inset-right, 0px))",
      top:"50%",
      zIndex:60,
      width:84,
      display:"flex",
      flexDirection:"column",
      gap:14,
      padding:"14px 10px",
      background:"var(--mc-panel)",
      border:"1px solid var(--mc-border)",
      borderRight:"none",
      borderRadius:"12px 0 0 12px",
      backdropFilter:"blur(10px)",
      boxShadow:"-4px 0 24px rgba(0,0,0,0.25)",
    }}>
      <div style={{display:"flex",flexDirection:"column",gap:6,alignItems:"stretch"}}>
        <span style={{fontFamily:"var(--mc-font-mono)",fontSize:8,color:"var(--mc-dim)",letterSpacing:1.8,textAlign:"center"}}>THEME</span>
        {tab(theme==="space",()=>{setTheme("space");ss(K.theme,"space");},"Space")}
        {tab(theme==="light",()=>{setTheme("light");ss(K.theme,"light");},"Light")}
        {tab(theme==="terminal",()=>{setTheme("terminal");ss(K.theme,"terminal");},"Terminal")}
      </div>
      <div style={{height:1,background:"var(--mc-border)",opacity:0.85}} aria-hidden="true"/>
      <div style={{display:"flex",flexDirection:"column",gap:6,alignItems:"stretch"}}>
        <span style={{fontFamily:"var(--mc-font-mono)",fontSize:8,color:"var(--mc-dim)",letterSpacing:1.4,textAlign:"center"}}>TEXT SIZE</span>
        {TEXT_STEPS.map((_,i)=>tab(textStep===i,()=>{setTextStep(i);ss(K.uiText,String(i));},["S","M","L","XL"][i]))}
      </div>
    </aside>
  );
}

// ── Header ────────────────────────────────────────────────────────────────────

function Header({bank,gateOpen,done,gateMin,streak}){
  const h=Math.floor(bank/60),m=bank%60;
  return(
    <header style={{maxWidth:680,margin:"0 auto",padding:"18px 16px 0"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",paddingBottom:12,borderBottom:"1px solid var(--mc-border)"}}>
        <div>
          <div style={{fontWeight:800,fontSize:18,letterSpacing:4,color:"var(--mc-accent)",textShadow:"0 0 22px rgba(0,229,255,0.4)"}}><span aria-hidden="true">🚀 </span>MISSION CONTROL</div>
          <div style={{fontFamily:"var(--mc-font-mono)",fontSize:9,color:"var(--mc-muted)",marginTop:3,letterSpacing:1.5}}>JULIAN // SUMMER 2026</div>
          {streak>1&&<div style={{marginTop:6,display:"inline-flex",alignItems:"center",gap:5,background:"var(--mc-streak-bg)",border:"1px solid var(--mc-streak-br)",borderRadius:20,padding:"2px 10px"}}><span style={{fontSize:10}} aria-hidden="true">🔥</span><span style={{fontFamily:"var(--mc-font-mono)",fontSize:9,color:"var(--mc-warn)",letterSpacing:1}}>{streak}-DAY STREAK</span></div>}
        </div>
        <div style={{textAlign:"right"}}>
          <div style={{fontFamily:"var(--mc-font-mono)",fontSize:9,color:"var(--mc-muted)",letterSpacing:1.5,marginBottom:2}}>TIME BANKED</div>
          <div style={{fontFamily:"var(--mc-font-mono)",fontSize:23,color:bank>0?(gateOpen?"var(--mc-success)":"var(--mc-warn)"):"var(--mc-time-empty)",textShadow:bank>0?"0 0 14px var(--mc-msg-sent-br)":"none",transition:"color 0.4s",letterSpacing:1}}>{h}h {String(m).padStart(2,"0")}m</div>
          <div style={{fontFamily:"var(--mc-font-mono)",fontSize:8,color:gateOpen?"var(--mc-success)":"var(--mc-dim)",letterSpacing:1.5,marginTop:2}}>{gateOpen?"✓ UNLOCKED":`${done}/${gateMin} TO UNLOCK`}</div>
          <div style={{fontFamily:"var(--mc-font-mono)",fontSize:7,color:"var(--mc-ghost)",marginTop:1}}>resets midnight</div>
        </div>
      </div>
    </header>
  );
}

// ── Nav ───────────────────────────────────────────────────────────────────────

function Nav({view,setView,unread}){
  return(
    <nav aria-label="Main navigation" style={{display:"flex",maxWidth:680,margin:"0 auto",padding:"0 16px",gap:4,marginTop:12,marginBottom:16}}>
      {[["board","🛸 MISSIONS"],["progress","📡 PROGRESS"],["bank","⏱ TIME"],["ops","⚙ OPS"]].map(([id,label])=>(
        <button key={id} className="mc-nav-tab" onClick={()=>setView(id)} aria-current={view===id?"page":undefined} style={{flex:1,padding:"9px 0",border:"none",borderRadius:7,fontFamily:"var(--mc-font-ui)",fontWeight:700,fontSize:9,letterSpacing:1.4,background:view===id?"var(--mc-nav-on)":"var(--mc-nav)",color:view===id?"var(--mc-accent)":"var(--mc-muted)",borderBottom:view===id?"2px solid var(--mc-accent)":"2px solid transparent",backdropFilter:"blur(4px)",position:"relative"}}>
          {label}
          {id==="ops"&&unread>0&&<span style={{position:"absolute",top:4,right:6,width:7,height:7,borderRadius:"50%",background:"var(--mc-social)",boxShadow:"0 0 6px rgba(244,114,182,0.7)"}} aria-label={`${unread} unread messages`}/>}
        </button>
      ))}
    </nav>
  );
}

// ── Mood / emotions wheel ─────────────────────────────────────────────────────

function MoodCheck({mood,onSaveMood,onClearMood}){
  const fid=useId().replace(/:/g,"");
  const filterBright=`mcWheelBright-${fid}`;
  const [expanded,setExpanded]=useState(false);
  const [coreIx,setCoreIx]=useState(null);
  const [hint,setHint]=useState(null);
  const hintTimer=useRef(null);
  const CX=150,CY=150,IN0=55,IN1=95,OUT0=100,OUT1=140,STROKE="#020408",STW=2;

  useEffect(()=>()=>{if(hintTimer.current)clearTimeout(hintTimer.current);},[]);

  const disp=mood?getMoodDisplay(mood):null;

  const flushTimer=()=>{if(hintTimer.current){clearTimeout(hintTimer.current);hintTimer.current=null;}};

  const collapseAll=()=>{
    flushTimer();
    setHint(null);
    setCoreIx(null);
    setExpanded(false);
  };

  const toggleHeader=()=>{
    if(hint)return;
    if(expanded){collapseAll();}
    else setExpanded(true);
  };

  const onSkip=()=>{
    if(hint)return;
    collapseAll();
  };

  const onPickVariant=(coreId,v)=>{
    if(hint)return;
    setHint(v.hint);
    flushTimer();
    hintTimer.current=setTimeout(()=>{
      onSaveMood(`${coreId}-${v.id}`);
      collapseAll();
    },3000);
  };

  const innerSeg=(i)=>{
    const a0=-90+i*45,a1=a0+45;
    return annulusWedge(CX,CY,IN0,IN1,a0,a1);
  };

  const outerSeg=(coreIndex,j)=>{
    const a0=-90+coreIndex*45+j*11.25,a1=a0+11.25;
    return annulusWedge(CX,CY,OUT0,OUT1,a0,a1);
  };

  const labelPt=(i,r)=>{
    const mid=-90+i*45+22.5;
    return{...polarPt(CX,CY,r,mid),mid};
  };

  const rowBtn={
    minHeight:40,boxSizing:"border-box",
    width:"100%",padding:"9px 14px",border:"1px solid rgba(148,163,184,0.35)",borderRadius:8,background:"var(--mc-compose-bg)",
    display:"flex",alignItems:"center",gap:9,marginBottom:expanded?8:14,backdropFilter:"blur(4px)",cursor:hint?"default":"pointer",
    opacity:hint?0.65:1,
  };

  const undoBtn={
    boxSizing:"border-box",alignSelf:"stretch",
    padding:"0 14px",border:"1px solid var(--mc-border-strong)",borderRadius:8,background:"transparent",
    fontFamily:"var(--mc-font-mono)",fontSize:8,fontWeight:700,color:"var(--mc-muted)",
    display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,
  };

  return(
    <div style={{marginBottom:14}}>
      <div style={{display:"flex",alignItems:"stretch",gap:8}}>
        <button type="button" className="cbtn" onClick={toggleHeader} disabled={!!hint} aria-expanded={expanded} style={{...rowBtn,flex:1,textAlign:"left"}}>
          {!mood&&<span style={{width:8,height:8,borderRadius:"50%",background:"var(--mc-accent)",opacity:0.35,flexShrink:0}} aria-hidden="true"/>}
          {mood&&<span style={{width:8,height:8,borderRadius:"50%",background:disp.color,flexShrink:0}} aria-hidden="true"/>}
          <span style={{flex:1,fontFamily:"var(--mc-font-mono)",fontSize:9,color:mood?"var(--mc-text)":"var(--mc-social-soft)",letterSpacing:1.2}}>
            {mood?disp.label:"HOW'S YOUR SYSTEM RUNNING TODAY?"}
          </span>
          <span style={{fontFamily:"var(--mc-font-mono)",fontSize:8,color:"var(--mc-msg-arrow)"}} aria-hidden="true">{expanded?"▲":"▼"}</span>
        </button>
        {typeof onClearMood==="function"&&mood&&!hint&&(
          <button type="button" className="cbtn" onClick={()=>onClearMood?.()} aria-label="Clear mood log for today" style={undoBtn}>UNDO</button>
        )}
      </div>

      {expanded&&(
        <div style={{background:"rgba(6,14,28,0.85)",border:"1px solid #0d1e36",borderRadius:12,padding:"12px 14px 14px",backdropFilter:"blur(10px)",WebkitBackdropFilter:"blur(10px)"}}>
          <div style={{fontFamily:"var(--mc-font-mono)",fontSize:8,color:"#8ab0d0",letterSpacing:0.6,marginBottom:10,lineHeight:1.5}}>Optional — tap to log, tap again to collapse</div>

          <div style={{display:"flex",flexDirection:"row",flexWrap:"wrap",alignItems:"flex-start",gap:14}}>
            <div style={{flex:"0 1 240px",maxWidth:"min(52%,288px)",minWidth:168}}>
              <svg viewBox="0 0 300 300" role="img" aria-label="Emotion classification wheel" width="100%" height="auto" style={{display:"block",maxWidth:288,pointerEvents:hint?"none":"auto"}} preserveAspectRatio="xMidYMid meet">
            <defs>
              <filter id={filterBright} x="-20%" y="-20%" width="140%" height="140%">
                <feComponentTransfer><feFuncR type="linear" slope="1.3"/><feFuncG type="linear" slope="1.3"/><feFuncB type="linear" slope="1.3"/></feComponentTransfer>
              </filter>
            </defs>
            {EMOTION_CORES.map((c,i)=>{
              const dim=coreIx!==null&&coreIx!==i;
              const sel=coreIx===i;
              return(
                <g key={c.id}>
                  <path
                    className="mc-wheel-hit"
                    d={innerSeg(i)}
                    fill={c.color}
                    stroke={STROKE}
                    strokeWidth={STW}
                    paintOrder="stroke fill"
                    opacity={dim?0.4:1}
                    filter={sel?`url(#${filterBright})`:undefined}
                    style={{cursor:hint?"default":"pointer",transition:"opacity 0.2s ease, transform 0.2s ease"}}
                    transform={sel?`translate(${CX} ${CY}) scale(1.04) translate(${-CX} ${-CY})`:undefined}
                    tabIndex={hint?-1:0}
                    role="button"
                    aria-label={`Core band: ${c.label}`}
                    onClick={()=>{if(!hint)setCoreIx(i);}}
                    onKeyDown={e=>{if(hint)return;if(e.key==="Enter"||e.key===" "){e.preventDefault();setCoreIx(i);}}}
                  />
                  {(()=>{
                    const pt=labelPt(i,75);
                    return(
                      <text
                        x={pt.x}
                        y={pt.y}
                        fill="#e8f0ff"
                        fontSize={10}
                        fontFamily="Oxanium,system-ui,sans-serif"
                        fontWeight={700}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        pointerEvents="none"
                        transform={`rotate(${pt.mid+90},${pt.x},${pt.y})`}
                        opacity={dim?0.45:1}
                      >
                        {c.label}
                      </text>
                    );
                  })()}
                </g>
              );
            })}

            {coreIx!==null&&(
              <g key={coreIx} style={{animation:"mcWheelOuterIn 0.25s ease forwards",opacity:0}} aria-live="polite">
                {(EMOTION_VARIANTS[EMOTION_CORES[coreIx].id]||[]).map((v,j)=>{
                  const cc=EMOTION_CORES[coreIx];
                  return(
                    <path
                      key={v.id}
                      className="mc-wheel-hit"
                      d={outerSeg(coreIx,j)}
                      fill={cc.color}
                      stroke={STROKE}
                      strokeWidth={STW}
                      paintOrder="stroke fill"
                      opacity={0.92}
                      style={{cursor:hint?"default":"pointer"}}
                      tabIndex={-1}
                      role="presentation"
                      aria-hidden="true"
                      onClick={()=>onPickVariant(cc.id,v)}
                    />
                  );
                })}
              </g>
            )}
              </svg>
            </div>

            <div style={{flex:"1 1 160px",minWidth:120,maxWidth:"100%",display:"flex",flexDirection:"column",gap:8,justifyContent:"flex-start",minHeight:192}}>
              {!hint&&coreIx===null&&(
                <div style={{fontFamily:"var(--mc-font-mono)",fontSize:9,color:"#8ab0d0",lineHeight:1.5,paddingTop:4}}>
                  ← Tap a band on the wheel to open calibrations.
                </div>
              )}
              {!hint&&coreIx!==null&&(
                <>
                  <div style={{fontFamily:"var(--mc-font-mono)",fontSize:8,color:"#8ab0d0",letterSpacing:0.5,marginBottom:2}}>
                    {EMOTION_CORES[coreIx].label.toUpperCase()} — pick one
                  </div>
                  <div style={{display:"flex",flexDirection:"column",gap:6}} role="group" aria-label={`${EMOTION_CORES[coreIx].label} calibrations`}>
                    {(EMOTION_VARIANTS[EMOTION_CORES[coreIx].id]||[]).map(v=>{
                      const cc=EMOTION_CORES[coreIx];
                      return(
                        <button
                          key={v.id}
                          type="button"
                          className="cbtn"
                          onClick={()=>onPickVariant(cc.id,v)}
                          aria-label={`${cc.label}: ${v.label}`}
                          style={{
                            width:"100%",minHeight:40,boxSizing:"border-box",padding:"8px 10px",border:`1px solid ${STROKE}`,borderRadius:8,
                            background:`color-mix(in srgb,${cc.color} 42%,#060e1c)`,
                            color:"#e8f0ff",fontFamily:"Oxanium,system-ui,sans-serif",fontSize:9,fontWeight:700,
                            letterSpacing:0.2,lineHeight:1.2,textAlign:"left",wordBreak:"break-word",
                          }}
                        >
                          {v.label}
                        </button>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          </div>

          {hint&&(
            <p className="mc-body-hint" style={{fontFamily:"var(--mc-font-mono)",fontSize:10,color:"#8ab0d0",fontStyle:"italic",textAlign:"center",marginTop:12,lineHeight:1.55,maxWidth:400,marginLeft:"auto",marginRight:"auto"}}>
              {hint}
            </p>
          )}

          {!hint&&(
            <div style={{textAlign:"center",marginTop:12}}>
              <button type="button" className="cbtn" onClick={onSkip} style={{background:"transparent",border:"none",color:"#8ab0d0",fontFamily:"var(--mc-font-mono)",fontSize:9,textDecoration:"underline",cursor:"pointer",padding:4}}>skip</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── Message Compose ───────────────────────────────────────────────────────────

function MessageCompose({onSend}){
  const [open,setOpen]=useState(false);
  const [text,setText]=useState("");
  const [sent,setSent]=useState(false);

  const send=()=>{
    if(!text.trim())return;
    onSend(text.trim());
    setText("");setSent(true);
    setTimeout(()=>{setSent(false);setOpen(false);},1800);
  };

  if(!open)return(
    <button onClick={()=>setOpen(true)} className="cbtn" aria-label="Send message to parents" style={{width:"100%",padding:"9px 14px",border:"1px solid var(--mc-compose-br)",borderRadius:8,background:"var(--mc-compose-bg)",display:"flex",alignItems:"center",gap:9,marginBottom:14,backdropFilter:"blur(4px)"}}>
      <span style={{fontSize:16}} aria-hidden="true">✍️</span>
      <span style={{fontFamily:"var(--mc-font-mono)",fontSize:9,color:"var(--mc-social-soft)",letterSpacing:1.5}}>MESSAGE PARENTS</span>
      <span style={{marginLeft:"auto",fontFamily:"var(--mc-font-mono)",fontSize:8,color:"var(--mc-msg-arrow)"}}>→</span>
    </button>
  );

  if(sent)return(
    <div role="status" style={{width:"100%",padding:"12px 14px",border:"1px solid var(--mc-msg-sent-br)",borderRadius:8,background:"var(--mc-msg-sent-bg)",marginBottom:14,textAlign:"center",fontFamily:"var(--mc-font-mono)",fontSize:10,color:"var(--mc-success)",letterSpacing:1}}>
      ✓ Sent
    </div>
  );

  return(
    <div style={{background:"var(--mc-compose-inner-bg)",border:"1px solid var(--mc-compose-inner-br)",borderRadius:8,padding:"12px 14px",marginBottom:14,animation:"fadeUp 0.2s ease",backdropFilter:"blur(6px)"}}>
      <div style={{fontFamily:"var(--mc-font-mono)",fontSize:9,color:"var(--mc-social-soft)",letterSpacing:1.5,marginBottom:8}}>MESSAGE TO PARENTS</div>
      <textarea
        value={text} onChange={e=>setText(e.target.value)}
        placeholder="Type anything — a question, something you need, how you're feeling..."
        aria-label="Message to parents"
        style={{width:"100%",minHeight:72,padding:"9px 11px",background:"var(--mc-input)",border:"1px solid var(--mc-border)",borderRadius:6,color:"var(--mc-text)",fontFamily:"var(--mc-font-mono)",fontSize:11,resize:"vertical",lineHeight:1.6}}
      />
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginTop:9}}>
        <button onClick={send} disabled={!text.trim()} className="cbtn" style={{padding:"9px 0",border:"1px solid var(--mc-send-br)",borderRadius:7,background:"var(--mc-send-bg)",color:"var(--mc-social)",fontFamily:"var(--mc-font-ui)",fontWeight:700,fontSize:10,letterSpacing:1.5}}>SEND</button>
        <button onClick={()=>setOpen(false)} className="cbtn" style={{padding:"9px 0",border:"1px solid var(--mc-border-strong)",borderRadius:7,background:"transparent",color:"var(--mc-dim)",fontFamily:"var(--mc-font-ui)",fontWeight:700,fontSize:10,letterSpacing:1.5}}>CANCEL</button>
      </div>
    </div>
  );
}

// ── Board ─────────────────────────────────────────────────────────────────────

function Board({missions,myM,done,skipped,flash,mood,onComplete,onUncomplete,onSkip,onUnskip,onSaveMood,onClearMood,onSendMessage,onUpdateMyM}){
  const [showAddMine,setShowAddMine]=useState(false);
  const [newMine,setNewMine]=useState({title:"",icon:"⭐",min:20,desc:""});
  const [missionLayout,setMissionLayout]=useState(()=>{try{return normalizeMissionLayout(localStorage.getItem(K.missionLayout));}catch{}return"comfort";});

  const boss=missions.filter(m=>m.cat==="boss"&&m.active!==false);
  const regular=Object.keys(CATS).filter(c=>c!=="boss"&&c!=="mine").map(cat=>({cat,items:missions.filter(m=>m.cat===cat&&m.active!==false)})).filter(g=>g.items.length>0);
  const allActive=[...missions.filter(m=>m.active!==false),...myM];
  const allDone=allActive.length>0&&allActive.every(m=>done.includes(m.id)||skipped.includes(m.id));

  const addMine=()=>{
    if(!newMine.title.trim())return;
    onUpdateMyM([...myM,{...newMine,id:`mine_${Date.now()}`,cat:"mine",min:Number(newMine.min),active:true}]);
    setNewMine({title:"",icon:"⭐",min:20,desc:""});setShowAddMine(false);
  };

  const gridCards=missionLayout==="cards";
  const stackStyle=missionLayout==="compact"
    ?{display:"flex",flexDirection:"column",gap:5}
    :missionLayout==="comfort"
    ?{display:"grid",gap:6,gridTemplateColumns:"minmax(0,1fr)"}
    :{};

  const pickLayout=(mode)=>{setMissionLayout(mode);ss(K.missionLayout,mode);};
  const layoutTab=(active,mode,label)=><button type="button" className="mc-layout-tab" title={label} onClick={()=>pickLayout(mode)} aria-pressed={active} style={{padding:"6px 8px",borderRadius:6,border:`1px solid ${active?"var(--mc-accent)":"var(--mc-border)"}`,background:active?"var(--mc-nav-on)":"transparent",color:active?"var(--mc-accent)":"var(--mc-muted)",fontFamily:"var(--mc-font-mono)",fontSize:8,fontWeight:700,letterSpacing:0.4,lineHeight:1.25,maxWidth:120,textAlign:"center"}}>{label}</button>;

  const missionGridClass=gridCards?"mc-mission-cards-3":undefined;

  return(
    <div>
      <MoodCheck mood={mood} onSaveMood={onSaveMood} onClearMood={onClearMood}/>
      <MessageCompose onSend={onSendMessage}/>

      <div style={{display:"flex",flexWrap:"wrap",alignItems:"stretch",gap:8,marginBottom:14}}>
        <span style={{fontFamily:"var(--mc-font-mono)",fontSize:8,color:"var(--mc-dim)",letterSpacing:1.5,alignSelf:"center"}}>LAYOUT</span>
        {layoutTab(missionLayout==="compact","compact","Compact list")}
        {layoutTab(missionLayout==="comfort","comfort","Comfort list")}
        {layoutTab(missionLayout==="cards","cards","Cards")}
      </div>

      {boss.length>0&&(
        <section aria-label="Boss Missions" style={{marginBottom:22,animation:"fadeUp 0.2s ease both"}}>
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:9}}>
            <div style={{width:3,height:13,borderRadius:2,background:"var(--mc-boss)",boxShadow:"0 0 8px rgba(255,159,0,0.6)"}} aria-hidden="true"/>
            <span style={{fontWeight:700,fontSize:10,letterSpacing:2.5,color:"var(--mc-boss)"}}>BOSS MISSIONS</span>
            <span style={{fontFamily:"var(--mc-font-mono)",fontSize:8,color:"var(--mc-boss-soft)",letterSpacing:1,background:"rgba(255,159,0,0.1)",border:"1px solid rgba(255,159,0,0.25)",borderRadius:10,padding:"1px 6px"}}>HIGH REWARD</span>
          </div>
          <div className={missionGridClass} style={stackStyle}>
            {boss.map((m,i)=><MCard key={m.id} layout={missionLayout} mission={m} isDone={done.includes(m.id)} isSkipped={skipped.includes(m.id)} isFlash={flash===m.id} onComplete={onComplete} onUncomplete={onUncomplete} onSkip={onSkip} onUnskip={onUnskip} delay={i*0.05} boss/>)}
          </div>
        </section>
      )}

      {regular.map(({cat,items},gi)=>(
        <section key={cat} aria-label={CATS[cat].label} style={{marginBottom:20,animation:`fadeUp 0.3s ${gi*0.05+0.1}s ease both`}}>
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
            <ShipIcon cat={cat} size={18}/>
            <span style={{fontWeight:700,fontSize:10,letterSpacing:2.5,color:CATS[cat].color}}>{CATS[cat].label.toUpperCase()}</span>
          </div>
          <div className={missionGridClass} style={stackStyle}>
            {items.map((m,i)=><MCard key={m.id} layout={missionLayout} mission={m} isDone={done.includes(m.id)} isSkipped={skipped.includes(m.id)} isFlash={flash===m.id} onComplete={onComplete} onUncomplete={onUncomplete} onSkip={onSkip} onUnskip={onUnskip} delay={gi*0.05+i*0.04+0.1}/>)}
          </div>
        </section>
      ))}

      <section aria-label="My Missions" style={{marginTop:4,paddingTop:14,borderTop:"1px solid var(--mc-border)"}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:9}}>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <ShipIcon cat="mine" size={17}/>
            <span style={{fontWeight:700,fontSize:10,letterSpacing:2.5,color:"var(--mc-mine-tx)"}}>MY MISSIONS</span>
          </div>
          <button onClick={()=>setShowAddMine(v=>!v)} aria-expanded={showAddMine} style={{padding:"3px 10px",border:"1px solid rgba(148,163,184,0.35)",borderRadius:5,background:"transparent",color:"var(--mc-mine-tx)",fontFamily:"var(--mc-font-ui)",fontWeight:700,fontSize:9,letterSpacing:1}}>{showAddMine?"CANCEL":"+ ADD"}</button>
        </div>
        {showAddMine&&(
          <div style={{background:"var(--mc-nav)",border:"1px solid var(--mc-border)",borderRadius:9,padding:13,marginBottom:10,animation:"fadeUp 0.2s ease",backdropFilter:"blur(6px)"}}>
            <div style={{display:"grid",gap:7}}>
              <label style={LBL}>MISSION NAME<input placeholder="What will you do?" value={newMine.title} onChange={e=>setNewMine({...newMine,title:e.target.value})} style={{...II,marginTop:3}} aria-required="true"/></label>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:7}}>
                <label style={LBL}>ICON<input placeholder="🎮" value={newMine.icon} onChange={e=>setNewMine({...newMine,icon:e.target.value})} style={{...II,marginTop:3}}/></label>
                <label style={LBL}>MINUTES EARNED<input type="number" value={newMine.min} onChange={e=>setNewMine({...newMine,min:e.target.value})} style={{...II,marginTop:3}}/></label>
              </div>
              <label style={LBL}>WHAT COUNTS?<input placeholder="Optional" value={newMine.desc} onChange={e=>setNewMine({...newMine,desc:e.target.value})} style={{...II,marginTop:3}}/></label>
              <button onClick={addMine} style={OB("#94a3b8")}>ADD MY MISSION</button>
            </div>
          </div>
        )}
        {myM.length===0&&!showAddMine&&<p style={{fontFamily:"var(--mc-font-mono)",fontSize:10,color:"var(--mc-ghost)",padding:"6px 0"}}>Add your own missions — you set the rules.</p>}
        <div className={missionGridClass} style={stackStyle}>
          {myM.map((m,i)=>(
            <MCard key={m.id} layout={missionLayout} mission={m} isDone={done.includes(m.id)} isSkipped={skipped.includes(m.id)} isFlash={flash===m.id} onComplete={onComplete} onUncomplete={onUncomplete} onSkip={onSkip} onUnskip={onUnskip} delay={i*0.04} mine onRemove={()=>onUpdateMyM(myM.filter(x=>x.id!==m.id))}/>
          ))}
        </div>
      </section>

      {allDone&&<div role="status" style={{textAlign:"center",padding:"20px 0 4px",fontFamily:"var(--mc-font-mono)",fontSize:10,letterSpacing:3,color:"var(--mc-success)",textShadow:"0 0 12px rgba(74,222,128,0.5)",animation:"fadeUp 0.4s ease"}}>◆ ALL MISSIONS COMPLETE ◆</div>}
    </div>
  );
}

function MCard({mission,isDone,isSkipped,isFlash,onComplete,onUncomplete,onSkip,onUnskip,delay,boss,mine,onRemove,layout="comfort"}){
  const cat=CATS[mission.cat]||{color:"#94a3b8"};
  const compact=layout==="compact";
  const cards=layout==="cards";

  const shell={
    "--mc-card-cat":cat.color,
    background:isSkipped?"var(--mc-panel-deep)":isDone?"var(--mc-panel-done)":"var(--mc-panel)",
    border:`1px solid ${isSkipped?"var(--mc-card-skip)":isDone?"rgba(20,50,30,0.5)":"var(--mc-border)"}`,
    borderLeft:`3px solid ${isSkipped?"var(--mc-card-skip-br)":isDone?"var(--mc-card-done-br)":cat.color}`,
    animationDelay:`${delay}s`,
    opacity:isSkipped?0.35:isDone?0.55:1,
    backdropFilter:"blur(4px)",
  };

  if(cards){
    const desc=isSkipped?"not today":mission.desc;
    return(
      <article data-boss={boss&&!isDone&&!isSkipped?"1":undefined} className={`card mc-mcard${isDone?" done":""}${isSkipped?" skip":""}${isFlash?" just-done":""}`} style={{...shell,borderRadius:10,padding:"12px 10px",display:"flex",flexDirection:"column",alignItems:"stretch",gap:10,minWidth:0}}>
        <div style={{display:"flex",alignItems:"flex-start",gap:8,minWidth:0}}>
          <div style={{flexShrink:0}}><ShipIcon cat={mission.cat} size={26} done={isDone||isSkipped}/></div>
          <div style={{flex:1,minWidth:0}}>
            <div style={{fontWeight:700,fontSize:12,color:isSkipped?"var(--mc-title-skip)":isDone?"var(--mc-title-done)":"var(--mc-text)",textDecoration:isSkipped||isDone?"line-through":"none",letterSpacing:0.2,lineHeight:1.25}}>{mission.title}</div>
            <div style={{fontSize:9,color:"var(--mc-faint)",marginTop:5,lineHeight:1.35,display:"-webkit-box",WebkitLineClamp:3,WebkitBoxOrient:"vertical",overflow:"hidden"}}>{desc}</div>
          </div>
        </div>
        <div style={{fontFamily:"var(--mc-font-mono)",fontSize:11,color:isSkipped?"var(--mc-min-skip)":isDone?"var(--mc-min-done)":cat.color,fontWeight:500}}>+{mission.min}m</div>
        {isSkipped?(
          <button className="cbtn" onClick={()=>onUnskip(mission)} aria-label={`Undo skip ${mission.title}`} style={{width:"100%",padding:"8px 0",borderRadius:6,border:"1px solid var(--mc-skip-undo)",background:"transparent",color:"var(--mc-muted-btn)",fontFamily:"var(--mc-font-ui)",fontWeight:700,fontSize:8,letterSpacing:1}}>UNDO</button>
        ):isDone?(
          <div style={{display:"flex",flexDirection:"column",gap:6}}>
            <span style={{fontFamily:"var(--mc-font-ui)",fontWeight:700,fontSize:9,letterSpacing:1,color:"var(--mc-done-label)",textAlign:"center"}}>DONE ✓</span>
            <button className="cbtn" onClick={()=>onUncomplete(mission)} aria-label={`Undo ${mission.title}`} style={{width:"100%",padding:"8px 0",borderRadius:6,border:"1px solid var(--mc-undo-br)",background:"var(--mc-undo-bg)",color:"rgba(255,130,110,0.85)",fontFamily:"var(--mc-font-ui)",fontWeight:700,fontSize:8,letterSpacing:1}}>UNDO</button>
          </div>
        ):(
          <div style={{display:"flex",flexDirection:"column",gap:6}}>
            <button className="cbtn" onClick={()=>onComplete(mission)} aria-label={`Complete ${mission.title}`} style={{width:"100%",padding:"8px 0",borderRadius:6,border:`1px solid ${cat.color}55`,background:`${cat.color}12`,color:cat.color,fontFamily:"var(--mc-font-ui)",fontWeight:700,fontSize:8,letterSpacing:1}}>COMPLETE</button>
            <button className="cbtn" onClick={()=>onSkip(mission)} aria-label={`Skip ${mission.title} today`} style={{width:"100%",padding:"6px 0",borderRadius:6,border:"1px solid var(--mc-border-strong)",background:"transparent",color:"var(--mc-ghost)",fontFamily:"var(--mc-font-ui)",fontWeight:700,fontSize:7,letterSpacing:1}}>NOT TODAY</button>
            {mine&&onRemove&&(
              <button type="button" onClick={onRemove} aria-label={`Remove ${mission.title}`} style={{width:"100%",padding:"6px 0",border:"1px solid rgba(255,64,96,0.25)",borderRadius:6,background:"transparent",color:"rgba(255,100,120,0.75)",fontFamily:"var(--mc-font-mono)",fontSize:8}}>REMOVE</button>
            )}
          </div>
        )}
      </article>
    );
  }

  const list=compact;
  const pad=list?"8px 10px":"11px 13px";
  const gap=list?8:11;
  const icon=list?20:26;
  const titleFs=list?12:13;
  const actionsDir=list?"row":"column";
  const actionsGap=list?5:4;
  const btnPad=list?"3px 8px":"4px 10px";
  const btnPadSm=list?"2px 6px":"2px 8px";
  const btnFs=list?7:8;
  const descTitle=list?(isSkipped?"not today":mission.desc):null;
  return(
    <article data-boss={boss&&!isDone&&!isSkipped?"1":undefined} className={`card mc-mcard${isDone?" done":""}${isSkipped?" skip":""}${isFlash?" just-done":""}`}
      title={list&&descTitle?`${mission.title} — ${descTitle}`:undefined}
      style={{...shell,borderRadius:list?7:9,padding:pad,display:"flex",alignItems:"center",gap}}>
      <div style={{flexShrink:0}}><ShipIcon cat={mission.cat} size={icon} done={isDone||isSkipped}/></div>
      <div style={{flex:1,minWidth:0}}>
        <div style={{fontWeight:700,fontSize:titleFs,color:isSkipped?"var(--mc-title-skip)":isDone?"var(--mc-title-done)":"var(--mc-text)",textDecoration:isSkipped||isDone?"line-through":"none",letterSpacing:0.3,...list?{whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}:{}}}>{mission.title}</div>
        {!list&&<div style={{fontSize:10,color:"var(--mc-faint)",marginTop:1}}>{isSkipped?"not today":mission.desc}</div>}
      </div>
      <div style={{flexShrink:0,display:"flex",flexDirection:actionsDir,flexWrap:list?"wrap":"nowrap",gap:actionsGap,alignItems:list?"center":"flex-end",justifyContent:"flex-end"}}>
        <div style={{fontFamily:"var(--mc-font-mono)",fontSize:list?10:11,color:isSkipped?"var(--mc-min-skip)":isDone?"var(--mc-min-done)":cat.color,fontWeight:400,whiteSpace:"nowrap"}}>+{mission.min}m</div>

        {isSkipped?(
          <button className="cbtn" onClick={()=>onUnskip(mission)} aria-label={`Undo skip ${mission.title}`} style={{padding:list?"3px 8px":"3px 9px",borderRadius:4,border:"1px solid var(--mc-skip-undo)",background:"transparent",color:"var(--mc-muted-btn)",fontFamily:"var(--mc-font-ui)",fontWeight:700,fontSize:btnFs,letterSpacing:1.2}}>UNDO</button>
        ):isDone?(
          <div style={{display:"flex",flexDirection:list?"row":"column",alignItems:"center",gap:list?6:4}}>
            <span style={{fontFamily:"var(--mc-font-ui)",fontWeight:700,fontSize:btnFs,letterSpacing:1.5,color:"var(--mc-done-label)",whiteSpace:"nowrap"}}>DONE ✓</span>
            <button className="cbtn" onClick={()=>onUncomplete(mission)} aria-label={`Undo ${mission.title}`} style={{padding:list?"3px 7px":"3px 8px",borderRadius:4,border:"1px solid var(--mc-undo-br)",background:"var(--mc-undo-bg)",color:"rgba(255,130,110,0.85)",fontFamily:"var(--mc-font-ui)",fontWeight:700,fontSize:btnFs,letterSpacing:1.2}}>UNDO</button>
          </div>
        ):(
          <div style={{display:"flex",flexDirection:list?"row":"column",alignItems:list?"center":"flex-end",gap:list?5:4}}>
            <button className="cbtn" onClick={()=>onComplete(mission)} aria-label={`Complete ${mission.title}`} style={{padding:btnPad,borderRadius:5,border:`1px solid ${cat.color}55`,background:`${cat.color}12`,color:cat.color,fontFamily:"var(--mc-font-ui)",fontWeight:700,fontSize:btnFs,letterSpacing:1.5,whiteSpace:"nowrap"}}>COMPLETE</button>
            <button className="cbtn" onClick={()=>onSkip(mission)} aria-label={`Skip ${mission.title} today`} style={{padding:btnPadSm,borderRadius:4,border:"1px solid var(--mc-border-strong)",background:"transparent",color:"var(--mc-ghost)",fontFamily:"var(--mc-font-ui)",fontWeight:700,fontSize:list?6:7,letterSpacing:1.2,whiteSpace:"nowrap"}}>NOT TODAY</button>
            {mine&&onRemove&&list&&(
              <button type="button" onClick={onRemove} aria-label={`Remove ${mission.title}`} style={{padding:"1px 6px",border:"1px solid rgba(255,64,96,0.2)",borderRadius:3,background:"transparent",color:"rgba(255,100,120,0.6)",fontFamily:"monospace",fontSize:btnFs}}>✕</button>
            )}
          </div>
        )}

        {mine&&!isDone&&!isSkipped&&!list&&(
          <button onClick={onRemove} aria-label={`Remove ${mission.title}`} style={{padding:"1px 6px",border:"1px solid rgba(255,64,96,0.2)",borderRadius:3,background:"transparent",color:"rgba(255,100,120,0.6)",fontFamily:"monospace",fontSize:8}}>✕</button>
        )}
      </div>
    </article>
  );
}

// ── Progress ──────────────────────────────────────────────────────────────────

function Progress({history,gateMin,streak,stats,earned,sumStart,milestones}){
  const [histOpen,setHistOpen]=useState(null);
  const calCells=buildCal(sumStart,history,gateMin);
  const pd=s=>{const[y,m,d]=s.split("-").map(Number);return new Date(y,m-1,d);};
  const start=pd(sumStart);
  const today=new Date();today.setHours(0,0,0,0);
  const daysElapsed=Math.max(0,Math.floor((today-start)/86400000));
  const {gateDays}=stats;
  const weeks=[];for(let w=0;w<13;w++)weeks.push(calCells.slice(w*7,(w+1)*7));
  const monthLabels=[];weeks.forEach((wk,wi)=>{const f=wk.find(c=>c.inSum);if(f){const l=f.d.toLocaleDateString("en-US",{month:"short"});if(!monthLabels.length||monthLabels[monthLabels.length-1].label!==l)monthLabels.push({wi,label:l});}});

  return(
    <div style={{animation:"fadeUp 0.3s ease"}}>
      {/* Summer goal */}
      <section aria-label="Summer Challenge" style={{background:"var(--mc-panel)",border:"1px solid var(--mc-border)",borderRadius:14,padding:18,marginBottom:12,backdropFilter:"blur(6px)"}}>
        <div style={{fontFamily:"var(--mc-font-mono)",fontSize:9,letterSpacing:2.5,color:"var(--mc-muted)",marginBottom:14}}>SUMMER CHALLENGE — 90 DAYS</div>
        <div style={{position:"relative",marginBottom:28}}>
          <div style={{background:"var(--mc-bar)",borderRadius:99,height:10,overflow:"visible",position:"relative"}}>
            <div style={{height:"100%",borderRadius:99,width:`${Math.min(100,(gateDays/90)*100)}%`,background:"linear-gradient(90deg,var(--mc-accent),var(--mc-success))",boxShadow:"0 0 8px rgba(74,222,128,0.35)",transition:"width 0.6s ease",animation:"barIn 0.8s ease",minWidth:gateDays>0?8:0}}/>
            {[{pct:33.3,day:30,r:milestones.m30},{pct:66.6,day:60,r:milestones.m60},{pct:100,day:90,r:milestones.m90}].map(({pct,day,r})=>{
              const met=gateDays>=day;
              return <div key={day} style={{position:"absolute",top:-5,left:`${pct}%`,transform:"translateX(-50%)"}} aria-label={`Day ${day} milestone${met?" reached":""}`}><div style={{width:20,height:20,borderRadius:"50%",background:met?"var(--mc-success)":"var(--mc-bar)",border:`2px solid ${met?"var(--mc-success)":"var(--mc-border-accent)"}`,display:"flex",alignItems:"center",justifyContent:"center",boxShadow:met?"0 0 10px rgba(74,222,128,0.5)":"none",transition:"all 0.5s"}}>{met&&<span style={{fontSize:9}}>✓</span>}</div><div style={{textAlign:"center",marginTop:5,fontFamily:"var(--mc-font-mono)",fontSize:8,color:met?"var(--mc-success)":"var(--mc-faint)",whiteSpace:"nowrap",transform:"translateX(-50%)",position:"absolute",left:"50%"}}>D{day}</div></div>;
            })}
          </div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:6,marginTop:4}}>
          {[{day:30,r:milestones.m30},{day:60,r:milestones.m60},{day:90,r:milestones.m90}].map(({day,r})=>{
            const met=gateDays>=day;
            return <div key={day} style={{background:met?"var(--mc-mile-met)":"var(--mc-mile-unmet)",border:`1px solid ${met?"var(--mc-milestone-on)":"var(--mc-border)"}`,borderRadius:8,padding:"9px 7px",textAlign:"center"}}><div style={{fontFamily:"var(--mc-font-mono)",fontSize:9,color:met?"var(--mc-success)":"var(--mc-faint)",marginBottom:3}}>DAY {day} {met?"🏆":""}</div><div style={{fontSize:10,color:met?"var(--mc-milestone-reward)":"var(--mc-ghost)",lineHeight:1.4}}>{r||"(not set)"}</div></div>;
          })}
        </div>
        <p style={{fontFamily:"var(--mc-font-mono)",fontSize:9,color:"var(--mc-faint)",textAlign:"center",marginTop:11}}>{gateDays} gate days · {daysElapsed} elapsed · {Math.max(0,90-gateDays)} to go</p>
      </section>

      {/* Calendar */}
      <section aria-label="Summer Calendar" style={{background:"var(--mc-panel)",border:"1px solid var(--mc-border)",borderRadius:14,padding:16,marginBottom:12,backdropFilter:"blur(6px)",overflowX:"auto"}}>
        <div style={{fontFamily:"var(--mc-font-mono)",fontSize:9,letterSpacing:2.5,color:"var(--mc-muted)",marginBottom:11}}>SUMMER CALENDAR</div>
        <div style={{display:"flex",gap:2,marginLeft:16,marginBottom:3}} aria-hidden="true">{Array.from({length:13},(_,wi)=>{const ml=monthLabels.find(x=>x.wi===wi);return <div key={wi} style={{width:22,flexShrink:0,fontFamily:"var(--mc-font-mono)",fontSize:7,color:"var(--mc-faint)"}}>{ml?ml.label:""}</div>;})}</div>
        <div style={{display:"flex",gap:2}}>
          <div style={{display:"flex",flexDirection:"column",gap:2,marginRight:2}} aria-hidden="true">{["M","","W","","F","","S"].map((d,i)=><div key={i} style={{width:12,height:20,fontSize:7,color:"var(--mc-faint)",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"monospace"}}>{d}</div>)}</div>
          {weeks.map((wk,wi)=>(
            <div key={wi} style={{display:"flex",flexDirection:"column",gap:2}}>
              {wk.map((cell,di)=>{
                if(!cell.inSum)return <div key={di} style={{width:20,height:20,borderRadius:3,background:"transparent"}}/>;
                let bg="var(--mc-cal-empty)";
                if(!cell.isFut){if(cell.metGate)bg=`hsl(145,${55+cell.count*5}%,${30+cell.count*3}%)`;else if(cell.count>0)bg="var(--mc-cal-try)";else bg="var(--mc-cal-none)";}
                const e=history.find(h=>h.date===cell.ds);
                const md=e?.mood?getMoodDisplay(e.mood):null;
                return <div key={di} title={`${cell.ds}${cell.count>0?` · ${cell.count} missions`:""}${md?` · ${md.label}`:""}`} style={{width:20,height:20,borderRadius:3,background:bg,border:cell.isToday?"1.5px solid var(--mc-accent)":"1px solid transparent",boxShadow:cell.metGate?"0 0 4px rgba(74,222,128,0.35)":cell.isToday?"0 0 5px rgba(0,229,255,0.4)":"none",transition:"background 0.3s",flexShrink:0}}/>;
              })}
            </div>
          ))}
        </div>
        <div style={{display:"flex",alignItems:"center",gap:10,marginTop:10,flexWrap:"wrap"}} aria-hidden="true">
          {[["var(--mc-cal-none)","No missions"],["var(--mc-cal-try)","Attempted"],["hsl(145,65%,32%)","Gate met"]].map(([c,l])=>(
            <div key={l} style={{display:"flex",alignItems:"center",gap:4}}><div style={{width:11,height:11,borderRadius:2,background:c}}/><span style={{fontFamily:"var(--mc-font-mono)",fontSize:8,color:"var(--mc-dim)"}}>{l}</span></div>
          ))}
        </div>
      </section>

      {/* Achievements */}
      <section aria-label="Achievements" style={{background:"var(--mc-panel)",border:"1px solid var(--mc-border)",borderRadius:14,padding:16,marginBottom:12,backdropFilter:"blur(6px)"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:13}}>
          <div style={{fontFamily:"var(--mc-font-mono)",fontSize:9,letterSpacing:2.5,color:"var(--mc-muted)"}}>ACHIEVEMENTS</div>
          <div style={{fontFamily:"var(--mc-font-mono)",fontSize:9,color:"var(--mc-faint)"}}>{earned.length}/{ACHV.length}</div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6}}>
          {ACHV.map(a=>{const e=earned.includes(a.id);return(
            <div key={a.id} className="mc-ach-tile" style={{background:e?"var(--mc-ach-on-bg)":"var(--mc-ach-off-bg)",border:`1px solid ${e?"var(--mc-milestone-on)":"var(--mc-border)"}`,borderRadius:8,padding:"9px",display:"flex",alignItems:"center",gap:7,opacity:e?1:0.4,transition:"opacity 0.3s"}}>
              <span style={{fontSize:e?20:16,filter:e?"none":"grayscale(1)"}} aria-hidden="true">{a.icon}</span>
              <div style={{minWidth:0}}><div style={{fontWeight:700,fontSize:11,color:e?"var(--mc-text)":"var(--mc-ghost)",letterSpacing:0.3,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{a.title}</div><div style={{fontSize:9,color:e?"var(--mc-ach-desc-on)":"var(--mc-ghost2)",marginTop:1,lineHeight:1.3}}>{a.desc}</div></div>
            </div>
          );})}
        </div>
      </section>

      {/* History */}
      <section aria-label="History Log" style={{background:"var(--mc-panel)",border:"1px solid var(--mc-border)",borderRadius:14,padding:16,backdropFilter:"blur(6px)"}}>
        <div style={{fontFamily:"var(--mc-font-mono)",fontSize:9,letterSpacing:2.5,color:"var(--mc-muted)",marginBottom:11}}>HISTORY LOG</div>
        {history.length===0&&<p style={{fontFamily:"var(--mc-font-mono)",fontSize:10,color:"var(--mc-ghost)"}}>No entries yet.</p>}
        <div style={{display:"grid",gap:5}}>
          {history.map((entry,i)=>{
            const isOpen=histOpen===entry.date,met=entry.completed.length>=gateMin;
            const eh=Math.floor(entry.totalMin/60),em=entry.totalMin%60;
            const moodData=entry.mood?getMoodDisplay(entry.mood):null;
            return(
              <div key={entry.date} className="hcard" onClick={()=>setHistOpen(isOpen?null:entry.date)}
                role="button" tabIndex={0} aria-expanded={isOpen} onKeyDown={e=>(e.key==="Enter"||e.key===" ")&&setHistOpen(isOpen?null:entry.date)}
                style={{background:"var(--mc-hist-bg)",border:`1px solid ${isOpen?"var(--mc-border-strong)":"var(--mc-bar)"}`,borderLeft:`3px solid ${met?"var(--mc-success)":"var(--mc-border-strong)"}`,borderRadius:8,overflow:"hidden",animationDelay:`${i*0.03}s`,backdropFilter:"blur(4px)"}}>
                <div style={{display:"flex",alignItems:"center",padding:"10px 12px",gap:9}}>
                  <span style={{fontSize:13}} aria-hidden="true">{met?"✅":"⬜"}</span>
                  <div style={{flex:1}}>
                    <div style={{display:"flex",alignItems:"center",gap:6}}><div style={{fontWeight:600,fontSize:12,color:"var(--mc-text)"}}>{fmtDate(entry.date)}</div>{moodData?.emoji&&<span style={{fontSize:12}} title={moodData.label}>{moodData.emoji}</span>}</div>
                    <div style={{fontFamily:"var(--mc-font-mono)",fontSize:9,color:"var(--mc-faint)",marginTop:1}}>{entry.completed.length} missions{!met&&` · needed ${gateMin}`}</div>
                  </div>
                  <div style={{textAlign:"right"}}><div style={{fontFamily:"var(--mc-font-mono)",fontSize:12,color:met?"var(--mc-success)":"var(--mc-faint)"}}>{entry.totalMin>0?`+${eh>0?`${eh}h `:""}${em>0?`${em}m`:""}`:"—"}</div><div style={{fontSize:8,color:"var(--mc-ghost2)",marginTop:1}}>{isOpen?"▲":"▼"}</div></div>
                </div>
                {isOpen&&(
                  <div style={{borderTop:"1px solid var(--mc-border)",padding:"8px 12px 10px"}}>
                    {entry.completed.map(cm=>{const c=CATS[cm.cat]||{color:"var(--mc-dim)"};return(
                      <div key={cm.id} style={{display:"flex",alignItems:"center",gap:7,padding:"4px 0",borderBottom:"1px solid var(--mc-bar)"}}><span style={{fontSize:11}} aria-hidden="true">{cm.icon}</span><span style={{flex:1,fontFamily:"var(--mc-font-mono)",fontSize:9,color:"var(--mc-subtitle-c)"}}>{cm.title}</span><span style={{fontFamily:"var(--mc-font-mono)",fontSize:9,color:c.color}}>+{cm.min}m</span></div>
                    );})}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

// ── Bank ──────────────────────────────────────────────────────────────────────

function Bank({bank,gateOpen,done,gateMin,onUse}){
  const h=Math.floor(bank/60),m=bank%60,prog=Math.min(1,done/gateMin);
  if(!gateOpen)return(
    <div style={{animation:"fadeUp 0.3s ease"}}>
      <div style={{background:"var(--mc-panel)",border:"1px solid var(--mc-border)",borderRadius:16,padding:"32px 22px",textAlign:"center",marginBottom:12,backdropFilter:"blur(6px)"}}>
        <div style={{fontSize:36,marginBottom:12}} aria-hidden="true">🔒</div>
        <div style={{fontFamily:"var(--mc-font-ui)",fontWeight:700,fontSize:14,letterSpacing:3,color:"var(--mc-muted)",marginBottom:6}}>TIME BANK LOCKED</div>
        <p style={{fontFamily:"var(--mc-font-mono)",fontSize:11,color:"var(--mc-muted)",marginBottom:20,lineHeight:1.7}}>Complete {gateMin-done} more {gateMin-done===1?"mission":"missions"} to unlock</p>
        <div style={{background:"var(--mc-bar)",borderRadius:99,height:7,overflow:"hidden",maxWidth:260,margin:"0 auto 8px"}} role="progressbar" aria-valuenow={done} aria-valuemin={0} aria-valuemax={gateMin}>
          <div style={{height:"100%",borderRadius:99,width:`${prog*100}%`,background:"linear-gradient(90deg,var(--mc-accent),var(--mc-success))",transition:"width 0.5s ease",animation:prog>0?"barIn 0.6s ease":"none"}}/>
        </div>
        <div style={{fontFamily:"var(--mc-font-mono)",fontSize:10,color:"var(--mc-muted)",letterSpacing:1}}>{done} / {gateMin}</div>
      </div>
    </div>
  );
  return(
    <div style={{animation:"fadeUp 0.3s ease"}}>
      <div style={{background:"var(--mc-panel)",border:"1px solid var(--mc-bank-unlock-br)",borderRadius:16,padding:"32px 22px",textAlign:"center",marginBottom:16,backdropFilter:"blur(6px)"}}>
        <div style={{display:"flex",justifyContent:"center",marginBottom:14}} aria-hidden="true"><SHIPS.boss size={44} color="var(--mc-success)"/></div>
        <div style={{fontFamily:"var(--mc-font-mono)",fontSize:9,letterSpacing:2.5,color:"var(--mc-bank-sub)",marginBottom:9}}>AVAILABLE TIME</div>
        <div style={{fontFamily:"var(--mc-font-mono)",fontSize:50,fontWeight:300,letterSpacing:2,lineHeight:1,color:bank>0?"var(--mc-success)":"var(--mc-time-empty2)",textShadow:bank>0?"0 0 24px var(--mc-msg-sent-br)":"none",transition:"color 0.4s"}} aria-label={`${h} hours and ${m} minutes available`}>{String(h).padStart(2,"0")}:{String(m).padStart(2,"0")}</div>
        <div style={{fontFamily:"var(--mc-font-mono)",fontSize:8,letterSpacing:2,color:"var(--mc-time-dim)",marginTop:7}}>HRS : MIN</div>
        <p style={{fontFamily:"var(--mc-font-mono)",fontSize:9,color:"var(--mc-ghost)",marginTop:9}}>Unused time resets at midnight.</p>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
        {[30,60,90,120].map(min=>{const ok=bank>=min;return <button key={min} disabled={!ok} onClick={()=>onUse(min)} className="cbtn mc-bank-hit" aria-label={`Use ${min>=60?`${min/60} hour${min>60?"s":""}`:min+" minutes"}`} style={{padding:"16px 0",border:"1px solid",borderColor:ok?"var(--mc-bank-btn-on-br)":"var(--mc-border)",borderRadius:10,background:ok?"var(--mc-bank-btn-on-bg)":"var(--mc-bank-btn-off-bg)",color:ok?"var(--mc-accent)":"var(--mc-time-empty)",fontFamily:"var(--mc-font-ui)",fontWeight:700,fontSize:14,backdropFilter:"blur(4px)"}}>{min>=60?`${min/60}h`:`${min}m`}</button>;})}
      </div>
    </div>
  );
}

// ── Ops ───────────────────────────────────────────────────────────────────────

function Ops({missions,myM,done,bank,gateMin,sumStart,milestones,messages,history,onReset,onUpdateMissions,onUpdateGate,onUpdateStart,onUpdateMilestones,onMarkRead,onMarkAllRead}){
  const [unlocked,setUnlocked]=useState(false);
  const [input,setInput]=useState("");
  const [stored,setStored]=useState("1234");
  const [pinErr,setPinErr]=useState(false);
  const [newPin,setNewPin]=useState(""),  [pinMsg,setPinMsg]=useState("");
  const [showAdd,setShowAdd]=useState(false);
  const [confirmR,setConfirmR]=useState(false);
  const [newM,setNewM]=useState({title:"",cat:"space",min:20,icon:"⭐",desc:""});
  const [mlEdit,setMlEdit]=useState(milestones);
  const [startEdit,setStartEdit]=useState(sumStart);
  const [saved,setSaved]=useState(false);

  useEffect(()=>{sg(K.pin).then(p=>{if(p)setStored(p);});},[]);

  const unlock=()=>{if(input===stored){setUnlocked(true);setPinErr(false);setInput("");}else{setPinErr(true);setInput("");}};
  const changePin=async()=>{if(newPin.length>=4){setStored(newPin);await ss(K.pin,newPin);setNewPin("");setPinMsg("Updated.");setTimeout(()=>setPinMsg(""),2000);}};
  const toggle=id=>onUpdateMissions(missions.map(m=>m.id===id?{...m,active:m.active===false}:m));
  const remove=id=>onUpdateMissions(missions.filter(m=>m.id!==id));
  const add=()=>{if(!newM.title.trim())return;onUpdateMissions([...missions,{...newM,id:`custom_${Date.now()}`,active:true,min:Number(newM.min)}]);setNewM({title:"",cat:"space",min:20,icon:"⭐",desc:""});setShowAdd(false);};
  const saveSettings=()=>{onUpdateStart(startEdit);onUpdateMilestones(mlEdit);setSaved(true);setTimeout(()=>setSaved(false),2000);};

  const unread=messages.filter(m=>!m.read).length;

  if(!unlocked)return(
    <div style={{animation:"fadeUp 0.3s ease",maxWidth:300,margin:"0 auto",paddingTop:8}}>
      <div style={{background:"var(--mc-panel-95)",border:"1px solid var(--mc-border)",borderRadius:16,padding:"26px 22px",backdropFilter:"blur(8px)"}}>
        <div style={{textAlign:"center",marginBottom:14}} aria-hidden="true"><span style={{fontSize:30}}>🛸</span></div>
        <div style={{fontFamily:"var(--mc-font-mono)",fontSize:9,letterSpacing:2,color:"var(--mc-muted)",textAlign:"center",marginBottom:16}}>OPS CENTER — PARENT ACCESS</div>
        <label style={LBL}>PIN
          <input type="password" autoComplete="current-password" value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&unlock()} aria-invalid={pinErr} aria-describedby={pinErr?"pin-err":undefined}
            style={{display:"block",width:"100%",padding:"11px 14px",marginTop:4,marginBottom:8,background:"var(--mc-input)",border:`2px solid ${pinErr?"var(--mc-danger)":"var(--mc-border)"}`,borderRadius:7,color:"var(--mc-text)",fontFamily:"var(--mc-font-mono)",fontSize:18,letterSpacing:6,textAlign:"center",transition:"border-color 0.2s"}}/>
        </label>
        {pinErr&&<p id="pin-err" role="alert" style={{color:"var(--mc-danger-tx)",fontSize:9,textAlign:"center",fontFamily:"monospace",letterSpacing:1.5,marginBottom:8}}>INCORRECT PIN</p>}
        <button onClick={unlock} style={{width:"100%",padding:11,background:"var(--mc-unlock-btn)",border:"2px solid var(--mc-unlock-btn-br)",borderRadius:8,color:"var(--mc-accent)",fontFamily:"var(--mc-font-ui)",fontWeight:700,fontSize:11,letterSpacing:2}}>UNLOCK</button>
        <p style={{fontFamily:"var(--mc-font-mono)",fontSize:8,color:"var(--mc-ghost2)",textAlign:"center",marginTop:12,letterSpacing:1}}>DEFAULT PIN: 1234</p>
      </div>
    </div>
  );

  const todayDone=missions.filter(m=>done.includes(m.id));

  return(
    <div style={{animation:"fadeUp 0.3s ease"}}>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:10}}>
        <StatB label="DONE TODAY" value={`${todayDone.length}/${missions.filter(m=>m.active!==false).length}`} color="var(--mc-success)"/>
        <StatB label="TIME BANKED" value={`${Math.floor(bank/60)}h ${bank%60}m`} color="var(--mc-accent)"/>
      </div>

      {/* Messages */}
      <OS title={`MESSAGES FROM JULIAN${unread>0?` · ${unread} NEW`:""}`}>
        {messages.length===0?(
          <p style={{fontFamily:"var(--mc-font-mono)",fontSize:10,color:"var(--mc-ghost)"}}>No messages yet.</p>
        ):(
          <>
            {unread>0&&<button onClick={onMarkAllRead} style={{...OB("var(--mc-social)"),marginBottom:10}}>MARK ALL READ</button>}
            <div style={{display:"grid",gap:7}}>
              {messages.map(msg=>(
                <div key={msg.id} onClick={()=>onMarkRead(msg.id)} style={{background:msg.read?"var(--mc-msg-read-bg)":"var(--mc-msg-unread-bg)",border:`1px solid ${msg.read?"var(--mc-bar)":"var(--mc-msg-unread-br)"}`,borderLeft:`3px solid ${msg.read?"var(--mc-card-skip-br)":"var(--mc-social)"}`,borderRadius:7,padding:"10px 12px",cursor:msg.read?"default":"pointer",transition:"all 0.2s"}}>
                  <div style={{fontFamily:"var(--mc-font-mono)",fontSize:8,color:msg.read?"var(--mc-ghost)":"var(--mc-social-soft)",letterSpacing:1,marginBottom:5,display:"flex",justifyContent:"space-between"}}>
                    <span>{fmtDate(new Date(msg.timestamp).toDateString())}</span>
                    <span>{fmtTime(msg.timestamp)}</span>
                  </div>
                  <div style={{fontFamily:"var(--mc-font-mono)",fontSize:11,color:msg.read?"var(--mc-faint)":"var(--mc-text)",lineHeight:1.6}}>{msg.text}</div>
                  {!msg.read&&<div style={{fontFamily:"var(--mc-font-mono)",fontSize:7,color:"var(--mc-social-soft)",marginTop:5,letterSpacing:1}}>TAP TO MARK READ</div>}
                </div>
              ))}
            </div>
          </>
        )}
      </OS>

      {/* Mood log (parent view) */}
      <OS title="MOOD LOG (90-DAY)">
        {history.filter(h=>h.mood).length===0?(
          <p style={{fontFamily:"var(--mc-font-mono)",fontSize:10,color:"var(--mc-ghost)"}}>No mood entries yet.</p>
        ):(
          <div style={{display:"grid",gap:5,maxHeight:280,overflowY:"auto"}}>
            {history.filter(h=>h.mood).slice(0,90).map(h=>{
              const md=getMoodDisplay(h.mood);
              return(
                <div key={h.date} style={{display:"flex",alignItems:"center",gap:8,padding:"6px 8px",background:"var(--mc-input)",borderRadius:6,border:"1px solid var(--mc-bar)"}}>
                  <span style={{fontFamily:"var(--mc-font-mono)",fontSize:9,color:"var(--mc-muted)",minWidth:72}}>{fmtDate(h.date)}</span>
                  <span style={{fontSize:14}} aria-hidden="true">{md.emoji}</span>
                  <span style={{fontFamily:"var(--mc-font-mono)",fontSize:9,color:"var(--mc-text)",flex:1}}>{md.label}</span>
                  <span style={{width:7,height:7,borderRadius:"50%",background:md.color,flexShrink:0}} aria-hidden="true"/>
                </div>
              );
            })}
          </div>
        )}
      </OS>

      {/* Gate */}
      <OS title="UNLOCK THRESHOLD">
        <p style={{fontFamily:"var(--mc-font-mono)",fontSize:10,color:"var(--mc-muted)",marginBottom:13,lineHeight:1.7}}>Missions required before Time Bank unlocks.<br/><span style={{color:"var(--mc-faint)"}}>Start at 3 — raise as habits build.</span></p>
        <div style={{display:"flex",alignItems:"center",gap:20,justifyContent:"center"}}>
          <button onClick={()=>onUpdateGate(Math.max(1,gateMin-1))} aria-label="Decrease" style={{width:40,height:40,borderRadius:8,border:"1px solid var(--mc-border-accent)",background:"var(--mc-input)",color:"var(--mc-muted)",fontFamily:"var(--mc-font-ui)",fontWeight:700,fontSize:18}}>−</button>
          <div style={{textAlign:"center"}}><div style={{fontFamily:"var(--mc-font-mono)",fontSize:38,color:"var(--mc-accent)",lineHeight:1}}>{gateMin}</div><div style={{fontFamily:"var(--mc-font-mono)",fontSize:8,color:"var(--mc-faint)",letterSpacing:1.5,marginTop:2}}>MISSIONS</div></div>
          <button onClick={()=>onUpdateGate(Math.min(7,gateMin+1))} aria-label="Increase" style={{width:40,height:40,borderRadius:8,border:"1px solid var(--mc-border-accent)",background:"var(--mc-input)",color:"var(--mc-muted)",fontFamily:"var(--mc-font-ui)",fontWeight:700,fontSize:18}}>+</button>
        </div>
      </OS>

      {/* Summer settings */}
      <OS title="SUMMER SETTINGS">
        <label style={LBL}>START DATE (YYYY-MM-DD)<input value={startEdit} onChange={e=>setStartEdit(e.target.value)} style={{...II,marginTop:3}} placeholder="2026-06-23"/></label>
        <div style={{fontFamily:"var(--mc-font-mono)",fontSize:9,color:"var(--mc-muted)",letterSpacing:1,marginTop:12,marginBottom:4}}>MILESTONE REWARDS</div>
        {[["m30","Day 30 reward"],["m60","Day 60 reward"],["m90","Day 90 champion"]].map(([key,ph])=>(
          <label key={key} style={{...LBL,marginBottom:6}}>{ph.toUpperCase()}<input value={mlEdit[key]} onChange={e=>setMlEdit({...mlEdit,[key]:e.target.value})} style={{...II,marginTop:3}} placeholder={ph}/></label>
        ))}
        <button onClick={saveSettings} style={OB(saved?"var(--mc-success)":"var(--mc-accent)")}>{saved?"SAVED ✓":"SAVE SETTINGS"}</button>
      </OS>

      {/* Today */}
      <OS title="TODAY'S COMPLETIONS">
        {todayDone.length===0?<p style={{color:"var(--mc-faint)",fontFamily:"monospace",fontSize:11}}>Nothing completed yet.</p>:todayDone.map(m=>(
          <div key={m.id} style={{display:"flex",justifyContent:"space-between",padding:"6px 0",borderBottom:"1px solid var(--mc-bar)",fontFamily:"var(--mc-font-mono)",fontSize:10}}>
            <span style={{color:"var(--mc-subtitle-c)"}}><span aria-hidden="true">{m.icon}</span> {m.title}</span>
            <span style={{color:"var(--mc-success)"}}>+{m.min}m</span>
          </div>
        ))}
        <div style={{marginTop:10}}>
          {!confirmR?<button onClick={()=>setConfirmR(true)} style={OB("var(--mc-danger)")}>RESET TODAY'S MISSIONS</button>
          :<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
            <button onClick={()=>{onReset();setConfirmR(false);}} style={OB("var(--mc-danger)")}>CONFIRM</button>
            <button onClick={()=>setConfirmR(false)} style={OB("var(--mc-link)")}>CANCEL</button>
          </div>}
        </div>
      </OS>

      {/* Manage missions */}
      <OS title="MANAGE MISSIONS">
        {missions.map(m=>{const isOff=m.active===false,isC=m.id.startsWith("custom_");return(
          <div key={m.id} style={{display:"flex",alignItems:"center",gap:6,padding:"6px 0",borderBottom:"1px solid var(--mc-bar)"}}>
            <span style={{fontSize:12}} aria-hidden="true">{m.icon}</span>
            <span style={{flex:1,fontFamily:"var(--mc-font-mono)",fontSize:10,color:isOff?"var(--mc-title-skip)":"var(--mc-subtitle-c)",textDecoration:isOff?"line-through":"none"}}>{m.title}</span>
            <span style={{fontFamily:"monospace",fontSize:9,color:"var(--mc-faint)"}}>{m.min}m</span>
            {m.boss&&<span style={{fontFamily:"monospace",fontSize:7,color:"var(--mc-boss-soft)",letterSpacing:1}}>BOSS</span>}
            <button onClick={()=>toggle(m.id)} aria-label={`${isOff?"Enable":"Disable"} ${m.title}`} style={{padding:"2px 6px",border:`1px solid ${isOff?"var(--mc-border-accent)":"var(--mc-streak-br)"}`,borderRadius:4,background:"transparent",color:isOff?"var(--mc-ghost2)":"var(--mc-warn)",fontFamily:"monospace",fontSize:8,letterSpacing:1}}>{isOff?"OFF":"ON"}</button>
            {isC&&<button onClick={()=>remove(m.id)} aria-label={`Remove ${m.title}`} style={{padding:"2px 6px",border:"1px solid rgba(255,96,128,0.25)",borderRadius:4,background:"transparent",color:"rgba(255,96,128,0.8)",fontFamily:"monospace",fontSize:8}}>✕</button>}
          </div>
        );})}
        {myM.length>0&&<div style={{fontFamily:"var(--mc-font-mono)",fontSize:8,color:"var(--mc-faint)",letterSpacing:1.5,marginTop:9,marginBottom:5}}>JULIAN'S MISSIONS</div>}
        {myM.map(m=><div key={m.id} style={{display:"flex",alignItems:"center",gap:6,padding:"5px 0",borderBottom:"1px solid var(--mc-bar)"}}><span style={{fontSize:11}} aria-hidden="true">{m.icon}</span><span style={{flex:1,fontFamily:"var(--mc-font-mono)",fontSize:9,color:"var(--mc-ops-muted)"}}>{m.title}</span><span style={{fontFamily:"monospace",fontSize:8,color:"var(--mc-ghost)"}}>{m.min}m</span><span style={{fontFamily:"monospace",fontSize:7,color:"var(--mc-his-label)",letterSpacing:1}}>HIS</span></div>)}
        {showAdd?(
          <div style={{background:"var(--mc-input)",borderRadius:8,padding:12,marginTop:10,border:"1px solid var(--mc-border)"}}>
            <div style={{display:"grid",gap:7}}>
              <label style={LBL}>TITLE<input placeholder="Mission title" value={newM.title} onChange={e=>setNewM({...newM,title:e.target.value})} style={{...II,marginTop:3}}/></label>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:7}}>
                <label style={LBL}>ICON<input placeholder="🎮" value={newM.icon} onChange={e=>setNewM({...newM,icon:e.target.value})} style={{...II,marginTop:3}}/></label>
                <label style={LBL}>MINUTES<input type="number" value={newM.min} onChange={e=>setNewM({...newM,min:e.target.value})} style={{...II,marginTop:3}}/></label>
              </div>
              <label style={LBL}>CATEGORY<select value={newM.cat} onChange={e=>setNewM({...newM,cat:e.target.value})} style={{...II,marginTop:3,appearance:"none"}}>{Object.entries(CATS).filter(([k])=>k!=="mine").map(([k,v])=><option key={k} value={k}>{v.label}</option>)}</select></label>
              <label style={LBL}>DESCRIPTION<input placeholder="Optional" value={newM.desc} onChange={e=>setNewM({...newM,desc:e.target.value})} style={{...II,marginTop:3}}/></label>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:7}}>
                <button onClick={add} style={OB("var(--mc-success)")}>ADD</button>
                <button onClick={()=>setShowAdd(false)} style={OB("var(--mc-link)")}>CANCEL</button>
              </div>
            </div>
          </div>
        ):<button onClick={()=>setShowAdd(true)} style={{...OB("#a78bfa"),marginTop:10}}>+ ADD PARENT MISSION</button>}
      </OS>

      {/* PIN */}
      <OS title="CHANGE PIN">
        <label style={LBL}>NEW PIN (min 4 digits)
          <div style={{display:"flex",gap:8,marginTop:3}}>
            <input type="password" autoComplete="new-password" value={newPin} onChange={e=>setNewPin(e.target.value)} onKeyDown={e=>e.key==="Enter"&&changePin()} style={{...II,flex:1}}/>
            <button onClick={changePin} style={{padding:"0 13px",border:"2px solid var(--mc-bank-btn-on-br)",borderRadius:7,background:"var(--mc-bank-btn-on-bg)",color:"var(--mc-accent)",fontFamily:"var(--mc-font-ui)",fontWeight:700,fontSize:10,letterSpacing:1}}>SET</button>
          </div>
        </label>
        {pinMsg&&<p role="status" style={{color:"var(--mc-success)",fontFamily:"monospace",fontSize:10,marginTop:6}}>{pinMsg}</p>}
      </OS>
    </div>
  );
}

// ── Shared ────────────────────────────────────────────────────────────────────

function StatB({label,value,color}){return <div className="mc-panel-tile mc-stat-tile" style={{background:"var(--mc-panel)",border:"1px solid var(--mc-border)",borderRadius:8,padding:"12px 8px",textAlign:"center",backdropFilter:"blur(4px)"}}><div style={{fontFamily:"var(--mc-font-mono)",fontSize:7,letterSpacing:2,color:"var(--mc-muted)",marginBottom:5}}>{label}</div><div style={{fontFamily:"var(--mc-font-mono)",fontSize:15,color}}>{value}</div></div>;}
function OS({title,children}){return <div className="mc-panel-tile mc-ops-section" style={{background:"var(--mc-panel)",border:"1px solid var(--mc-border)",borderRadius:11,padding:16,marginBottom:10,backdropFilter:"blur(6px)"}}><div style={{fontFamily:"var(--mc-font-mono)",fontSize:8,letterSpacing:2.5,color:"var(--mc-muted)",marginBottom:12}}>{title}</div>{children}</div>;}
const OB=c=>({width:"100%",padding:"9px 0",background:`${c}12`,border:`2px solid ${c}45`,borderRadius:8,color:c,fontFamily:"var(--mc-font-ui)",fontWeight:700,fontSize:9,letterSpacing:2});
const II={width:"100%",padding:"8px 10px",background:"var(--mc-input)",border:"1px solid var(--mc-border)",borderRadius:6,color:"var(--mc-text)",fontFamily:"var(--mc-font-mono)",fontSize:11};
const LBL={fontFamily:"var(--mc-font-mono)",fontSize:9,color:"var(--mc-muted)",letterSpacing:1,display:"block",marginBottom:2};
