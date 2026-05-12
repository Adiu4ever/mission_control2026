import { useState, useEffect } from "react";

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
const ShipIcon=({cat,size,done})=>{const C=SHIPS[cat]||SHIPS.mine;const color=done?"#2a3a50":(CATS[cat]||{color:"#94a3b8"}).color;return <C size={size||26} color={color}/>;};

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

const MOODS=[
  {val:"low",    emoji:"🔋",label:"Low"},
  {val:"okay",   emoji:"😐",label:"Okay"},
  {val:"high",   emoji:"⚡",label:"High"},
];

const K={
  pin:"jg_pin",missions:"jg_missions",done:"jg_done",bank:"jg_bank",
  history:"jg_history",gate:"jg_gate",myM:"jg_my_missions",
  start:"jg_summer_start",milestones:"jg_milestones",
  skipped:"jg_skipped",mood:"jg_mood",messages:"jg_messages",
};
const DEFAULT_START="2026-06-23";

// ── Storage ───────────────────────────────────────────────────────────────────

const sg=async k=>{try{const r=await window.storage.get(k);return r?r.value:null;}catch{return null;}};
const ss=async(k,v)=>{try{await window.storage.set(k,String(v));}catch{}};

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
    const entry={date:today,completed,totalMin:completed.reduce((s,m)=>s+m.min,0),mood:moodVal||mood};
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

  const saveMood=async(val)=>{
    const today=new Date().toDateString();
    setMood(val);
    await ss(K.mood,JSON.stringify({date:today,value:val}));
    await pushHistory(done,[...missions,...myM],val);
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

  if(!ready)return <div style={{background:"#020408",height:"100vh",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"monospace",color:"#00e5ff",fontSize:13,letterSpacing:3}}><div style={{textAlign:"center"}}><div style={{fontSize:32,marginBottom:16}}>🚀</div><div>INITIALIZING...</div></div></div>;

  return(
    <div style={{fontFamily:"'Oxanium',sans-serif",background:"#020408",minHeight:"100vh",color:"#e8f0ff",paddingBottom:80,position:"relative",overflow:"hidden"}}>
      <style>{CSS}</style>
      <Starfield/>
      {toast&&<Toast achv={toast}/>}
      {gmMsg&&<GmToast msg={gmMsg}/>}
      <div style={{position:"relative",zIndex:1}}>
        <Header bank={bank} gateOpen={gateOpen} done={done.length} gateMin={gateMin} streak={streak}/>
        <Nav view={view} setView={setView} unread={unreadCount}/>
        <main style={{padding:"0 16px",maxWidth:680,margin:"0 auto"}}>
          {view==="board"    &&<Board missions={missions} myM={myM} done={done} skipped={skipped} flash={flash} mood={mood} onComplete={complete} onUncomplete={uncomplete} onSkip={skip} onUnskip={unskip} onSaveMood={saveMood} onSendMessage={sendMessage} onUpdateMyM={updateMyM}/>}
          {view==="progress" &&<Progress history={history} gateMin={gateMin} streak={streak} stats={stats} earned={earned} sumStart={sumStart} milestones={milestones}/>}
          {view==="bank"     &&<Bank bank={bank} gateOpen={gateOpen} done={done.length} gateMin={gateMin} onUse={useTime}/>}
          {view==="ops"      &&<Ops missions={missions} myM={myM} done={done} bank={bank} gateMin={gateMin} sumStart={sumStart} milestones={milestones} messages={messages} onReset={resetDay} onUpdateMissions={updateMissions} onUpdateGate={updateGate} onUpdateStart={updateStart} onUpdateMilestones={updateMilestones} onMarkRead={markRead} onMarkAllRead={markAllRead}/>}
        </main>
      </div>
    </div>
  );
}

// ── CSS ───────────────────────────────────────────────────────────────────────

const CSS=`
  @import url('https://fonts.googleapis.com/css2?family=Oxanium:wght@300;400;600;700;800&family=JetBrains+Mono:wght@300;400;500&display=swap');
  *{box-sizing:border-box;margin:0;padding:0;}
  ::-webkit-scrollbar{width:3px;} ::-webkit-scrollbar-track{background:#020408;} ::-webkit-scrollbar-thumb{background:#1a2a50;border-radius:2px;}
  @keyframes fadeUp{from{opacity:0;transform:translateY(10px);}to{opacity:1;transform:translateY(0);}}
  @keyframes twinkle{0%,100%{opacity:0.2;}50%{opacity:0.9;}}
  @keyframes pop{0%{transform:scale(1);}40%{transform:scale(1.04);}100%{transform:scale(1);}}
  @keyframes glow{0%{box-shadow:0 0 0 0 rgba(74,222,128,0.45);}100%{box-shadow:0 0 22px 0 rgba(74,222,128,0);}}
  @keyframes toastIn{from{opacity:0;transform:translateY(-20px) scale(0.95);}to{opacity:1;transform:translateY(0) scale(1);}}
  @keyframes gmIn{from{opacity:0;transform:translateX(20px);}to{opacity:1;transform:translateX(0);}}
  @keyframes barIn{from{width:0;}}
  @keyframes scanline{0%{top:-10%;}100%{top:110%;}}
  .card{animation:fadeUp 0.3s ease both;transition:transform 0.15s,opacity 0.3s;}
  .card:not(.done):not(.skip):hover{transform:translateY(-2px);}
  .card.just-done{animation:pop 0.35s ease,glow 0.8s ease;}
  .cbtn{transition:filter 0.2s,transform 0.12s;}
  .cbtn:hover:not(:disabled){filter:brightness(1.3);transform:scale(1.07);}
  .cbtn:active:not(:disabled){transform:scale(0.95);}
  .cbtn:focus-visible{outline:3px solid #00e5ff;outline-offset:2px;border-radius:4px;}
  .hcard{animation:fadeUp 0.3s ease both;cursor:pointer;}
  .hcard:hover{box-shadow:0 2px 14px rgba(0,229,255,0.1);}
  button:focus-visible{outline:3px solid #00e5ff;outline-offset:2px;}
  input:focus-visible,select:focus-visible,textarea:focus-visible{outline:2px solid #00e5ff;outline-offset:0;}
  input,select,textarea{outline:none;} button{cursor:pointer;}
`;

// ── Starfield ─────────────────────────────────────────────────────────────────

function Starfield(){
  const stars=Array.from({length:80},(_,i)=>({x:(i*37+11)%100,y:(i*53+7)%100,size:i%5===0?2:i%3===0?1.5:1,delay:(i*0.3)%4,dur:2+(i%3)}));
  return(
    <div style={{position:"fixed",inset:0,pointerEvents:"none",zIndex:0,overflow:"hidden"}} aria-hidden="true">
      <div style={{position:"absolute",width:400,height:400,borderRadius:"50%",background:"radial-gradient(circle,rgba(100,50,200,0.07) 0%,transparent 70%)",top:"10%",left:"60%",transform:"translate(-50%,-50%)"}}/>
      <div style={{position:"absolute",width:300,height:300,borderRadius:"50%",background:"radial-gradient(circle,rgba(0,100,200,0.06) 0%,transparent 70%)",top:"70%",left:"20%",transform:"translate(-50%,-50%)"}}/>
      {stars.map((s,i)=><div key={i} style={{position:"absolute",left:`${s.x}%`,top:`${s.y}%`,width:s.size,height:s.size,borderRadius:"50%",background:"#fff",animation:`twinkle ${s.dur}s ${s.delay}s ease-in-out infinite`,opacity:0.35}}/>)}
      <div style={{position:"absolute",left:0,right:0,height:1,background:"linear-gradient(90deg,transparent,rgba(0,229,255,0.04),transparent)",animation:"scanline 8s linear infinite"}}/>
    </div>
  );
}

// ── Toast / GM ────────────────────────────────────────────────────────────────

function Toast({achv}){
  return <div role="alert" aria-live="polite" style={{position:"fixed",top:16,left:"50%",transform:"translateX(-50%)",background:"#0a1828",border:"2px solid #00ff7f",borderRadius:12,padding:"13px 20px",zIndex:999,display:"flex",alignItems:"center",gap:11,boxShadow:"0 4px 28px rgba(0,255,127,0.3)",animation:"toastIn 0.4s cubic-bezier(0.34,1.56,0.64,1)"}}><span style={{fontSize:22}}>{achv.icon}</span><div><div style={{fontFamily:"'Oxanium',sans-serif",fontWeight:700,fontSize:12,color:"#00ff7f",letterSpacing:1}}>{achv.title}</div><div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:"#80c8a0",marginTop:1}}>ACHIEVEMENT UNLOCKED</div></div></div>;
}

function GmToast({msg}){
  return <div aria-live="polite" style={{position:"fixed",bottom:90,right:16,background:"rgba(6,14,28,0.92)",border:"1px solid #1a3050",borderRadius:8,padding:"8px 14px",zIndex:998,fontFamily:"'JetBrains Mono',monospace",fontSize:11,color:"#6a9898",animation:"gmIn 0.3s ease",backdropFilter:"blur(8px)",maxWidth:220,letterSpacing:0.3}}>{msg}</div>;
}

// ── Header ────────────────────────────────────────────────────────────────────

function Header({bank,gateOpen,done,gateMin,streak}){
  const h=Math.floor(bank/60),m=bank%60;
  return(
    <header style={{maxWidth:680,margin:"0 auto",padding:"18px 16px 0"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",paddingBottom:12,borderBottom:"1px solid #0d1e36"}}>
        <div>
          <div style={{fontWeight:800,fontSize:18,letterSpacing:4,color:"#00e5ff",textShadow:"0 0 22px rgba(0,229,255,0.4)"}}><span aria-hidden="true">🚀 </span>MISSION CONTROL</div>
          <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:"#8ab0d0",marginTop:3,letterSpacing:1.5}}>JULIAN // SUMMER 2026</div>
          {streak>1&&<div style={{marginTop:6,display:"inline-flex",alignItems:"center",gap:5,background:"rgba(251,191,36,0.12)",border:"1px solid rgba(251,191,36,0.35)",borderRadius:20,padding:"2px 10px"}}><span style={{fontSize:10}} aria-hidden="true">🔥</span><span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:"#fbbf24",letterSpacing:1}}>{streak}-DAY STREAK</span></div>}
        </div>
        <div style={{textAlign:"right"}}>
          <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:"#8ab0d0",letterSpacing:1.5,marginBottom:2}}>TIME BANKED</div>
          <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:23,color:bank>0?(gateOpen?"#4ade80":"#fbbf24"):"#1a3040",textShadow:bank>0?"0 0 14px rgba(74,222,128,0.3)":"none",transition:"color 0.4s",letterSpacing:1}}>{h}h {String(m).padStart(2,"0")}m</div>
          <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:8,color:gateOpen?"#4ade80":"#6a8898",letterSpacing:1.5,marginTop:2}}>{gateOpen?"✓ UNLOCKED":`${done}/${gateMin} TO UNLOCK`}</div>
          <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:7,color:"#3a5060",marginTop:1}}>resets midnight</div>
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
        <button key={id} onClick={()=>setView(id)} aria-current={view===id?"page":undefined} style={{flex:1,padding:"9px 0",border:"none",borderRadius:7,fontFamily:"'Oxanium',sans-serif",fontWeight:700,fontSize:9,letterSpacing:1.4,background:view===id?"rgba(0,229,255,0.12)":"rgba(10,20,40,0.8)",color:view===id?"#00e5ff":"#8ab0d0",borderBottom:view===id?"2px solid #00e5ff":"2px solid transparent",transition:"all 0.2s",backdropFilter:"blur(4px)",position:"relative"}}>
          {label}
          {id==="ops"&&unread>0&&<span style={{position:"absolute",top:4,right:6,width:7,height:7,borderRadius:"50%",background:"#f472b6",boxShadow:"0 0 6px rgba(244,114,182,0.7)"}} aria-label={`${unread} unread messages`}/>}
        </button>
      ))}
    </nav>
  );
}

// ── Mood Check ────────────────────────────────────────────────────────────────

function MoodCheck({mood,onSaveMood}){
  if(mood)return(
    <div style={{display:"flex",alignItems:"center",gap:8,background:"rgba(6,14,28,0.7)",border:"1px solid #0d1e36",borderRadius:8,padding:"8px 14px",marginBottom:14,backdropFilter:"blur(4px)"}}>
      <span style={{fontSize:16}} aria-hidden="true">{MOODS.find(m=>m.val===mood)?.emoji}</span>
      <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:"#6a8898",letterSpacing:1}}>TODAY: {MOODS.find(m=>m.val===mood)?.label.toUpperCase()}</span>
    </div>
  );
  return(
    <div style={{background:"rgba(6,14,28,0.7)",border:"1px solid #0d1e36",borderRadius:8,padding:"10px 14px",marginBottom:14,backdropFilter:"blur(4px)"}}>
      <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:"#8ab0d0",letterSpacing:1.5,marginBottom:9}}>HOW'S YOUR ENERGY TODAY?</div>
      <div style={{display:"flex",gap:8}}>
        {MOODS.map(m=>(
          <button key={m.val} onClick={()=>onSaveMood(m.val)} className="cbtn" aria-label={`Energy: ${m.label}`} style={{flex:1,padding:"9px 0",border:"1px solid #1a2a40",borderRadius:7,background:"rgba(10,20,40,0.6)",fontSize:20,display:"flex",flexDirection:"column",alignItems:"center",gap:3}}>
            <span aria-hidden="true">{m.emoji}</span>
            <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:7,color:"#6a8898",letterSpacing:1}}>{m.label.toUpperCase()}</span>
          </button>
        ))}
      </div>
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
    <button onClick={()=>setOpen(true)} className="cbtn" aria-label="Send message to parents" style={{width:"100%",padding:"9px 14px",border:"1px solid rgba(244,114,182,0.3)",borderRadius:8,background:"rgba(244,114,182,0.06)",display:"flex",alignItems:"center",gap:9,marginBottom:14,backdropFilter:"blur(4px)"}}>
      <span style={{fontSize:16}} aria-hidden="true">✍️</span>
      <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:"#c47898",letterSpacing:1.5}}>MESSAGE PARENTS</span>
      <span style={{marginLeft:"auto",fontFamily:"'JetBrains Mono',monospace",fontSize:8,color:"#4a3050"}}>→</span>
    </button>
  );

  if(sent)return(
    <div role="status" style={{width:"100%",padding:"12px 14px",border:"1px solid rgba(74,222,128,0.3)",borderRadius:8,background:"rgba(74,222,128,0.06)",marginBottom:14,textAlign:"center",fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:"#4ade80",letterSpacing:1}}>
      ✓ Sent
    </div>
  );

  return(
    <div style={{background:"rgba(6,14,28,0.85)",border:"1px solid rgba(244,114,182,0.25)",borderRadius:8,padding:"12px 14px",marginBottom:14,animation:"fadeUp 0.2s ease",backdropFilter:"blur(6px)"}}>
      <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:"#c47898",letterSpacing:1.5,marginBottom:8}}>MESSAGE TO PARENTS</div>
      <textarea
        value={text} onChange={e=>setText(e.target.value)}
        placeholder="Type anything — a question, something you need, how you're feeling..."
        aria-label="Message to parents"
        style={{width:"100%",minHeight:72,padding:"9px 11px",background:"#020408",border:"1px solid #0d1e36",borderRadius:6,color:"#e8f0ff",fontFamily:"'JetBrains Mono',monospace",fontSize:11,resize:"vertical",lineHeight:1.6}}
      />
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginTop:9}}>
        <button onClick={send} disabled={!text.trim()} className="cbtn" style={{padding:"9px 0",border:"1px solid rgba(244,114,182,0.4)",borderRadius:7,background:"rgba(244,114,182,0.1)",color:"#f472b6",fontFamily:"'Oxanium',sans-serif",fontWeight:700,fontSize:10,letterSpacing:1.5}}>SEND</button>
        <button onClick={()=>setOpen(false)} className="cbtn" style={{padding:"9px 0",border:"1px solid #1a2a40",borderRadius:7,background:"transparent",color:"#6a8898",fontFamily:"'Oxanium',sans-serif",fontWeight:700,fontSize:10,letterSpacing:1.5}}>CANCEL</button>
      </div>
    </div>
  );
}

// ── Board ─────────────────────────────────────────────────────────────────────

function Board({missions,myM,done,skipped,flash,mood,onComplete,onUncomplete,onSkip,onUnskip,onSaveMood,onSendMessage,onUpdateMyM}){
  const [showAddMine,setShowAddMine]=useState(false);
  const [newMine,setNewMine]=useState({title:"",icon:"⭐",min:20,desc:""});

  const boss=missions.filter(m=>m.cat==="boss"&&m.active!==false);
  const regular=Object.keys(CATS).filter(c=>c!=="boss"&&c!=="mine").map(cat=>({cat,items:missions.filter(m=>m.cat===cat&&m.active!==false)})).filter(g=>g.items.length>0);
  const allActive=[...missions.filter(m=>m.active!==false),...myM];
  const allDone=allActive.length>0&&allActive.every(m=>done.includes(m.id)||skipped.includes(m.id));

  const addMine=()=>{
    if(!newMine.title.trim())return;
    onUpdateMyM([...myM,{...newMine,id:`mine_${Date.now()}`,cat:"mine",min:Number(newMine.min),active:true}]);
    setNewMine({title:"",icon:"⭐",min:20,desc:""});setShowAddMine(false);
  };

  return(
    <div>
      <MoodCheck mood={mood} onSaveMood={onSaveMood}/>
      <MessageCompose onSend={onSendMessage}/>

      {boss.length>0&&(
        <section aria-label="Boss Missions" style={{marginBottom:22,animation:"fadeUp 0.2s ease both"}}>
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:9}}>
            <div style={{width:3,height:13,borderRadius:2,background:"#ff9f00",boxShadow:"0 0 8px rgba(255,159,0,0.6)"}} aria-hidden="true"/>
            <span style={{fontWeight:700,fontSize:10,letterSpacing:2.5,color:"#ff9f00"}}>BOSS MISSIONS</span>
            <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:8,color:"#c07000",letterSpacing:1,background:"rgba(255,159,0,0.1)",border:"1px solid rgba(255,159,0,0.25)",borderRadius:10,padding:"1px 6px"}}>HIGH REWARD</span>
          </div>
          <div style={{display:"grid",gap:6}}>
            {boss.map((m,i)=><MCard key={m.id} mission={m} isDone={done.includes(m.id)} isSkipped={skipped.includes(m.id)} isFlash={flash===m.id} onComplete={onComplete} onUncomplete={onUncomplete} onSkip={onSkip} onUnskip={onUnskip} delay={i*0.05} boss/>)}
          </div>
        </section>
      )}

      {regular.map(({cat,items},gi)=>(
        <section key={cat} aria-label={CATS[cat].label} style={{marginBottom:20,animation:`fadeUp 0.3s ${gi*0.05+0.1}s ease both`}}>
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
            <ShipIcon cat={cat} size={18}/>
            <span style={{fontWeight:700,fontSize:10,letterSpacing:2.5,color:CATS[cat].color}}>{CATS[cat].label.toUpperCase()}</span>
          </div>
          <div style={{display:"grid",gap:6}}>
            {items.map((m,i)=><MCard key={m.id} mission={m} isDone={done.includes(m.id)} isSkipped={skipped.includes(m.id)} isFlash={flash===m.id} onComplete={onComplete} onUncomplete={onUncomplete} onSkip={onSkip} onUnskip={onUnskip} delay={gi*0.05+i*0.04+0.1}/>)}
          </div>
        </section>
      ))}

      <section aria-label="My Missions" style={{marginTop:4,paddingTop:14,borderTop:"1px solid #0d1e36"}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:9}}>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <ShipIcon cat="mine" size={17}/>
            <span style={{fontWeight:700,fontSize:10,letterSpacing:2.5,color:"#b0c8e0"}}>MY MISSIONS</span>
          </div>
          <button onClick={()=>setShowAddMine(v=>!v)} aria-expanded={showAddMine} style={{padding:"3px 10px",border:"1px solid rgba(148,163,184,0.35)",borderRadius:5,background:"transparent",color:"#b0c8e0",fontFamily:"'Oxanium',sans-serif",fontWeight:700,fontSize:9,letterSpacing:1}}>{showAddMine?"CANCEL":"+ ADD"}</button>
        </div>
        {showAddMine&&(
          <div style={{background:"rgba(10,20,40,0.8)",border:"1px solid #0d1e36",borderRadius:9,padding:13,marginBottom:10,animation:"fadeUp 0.2s ease",backdropFilter:"blur(6px)"}}>
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
        {myM.length===0&&!showAddMine&&<p style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:"#3a5060",padding:"6px 0"}}>Add your own missions — you set the rules.</p>}
        {myM.map((m,i)=>(
          <MCard key={m.id} mission={m} isDone={done.includes(m.id)} isSkipped={skipped.includes(m.id)} isFlash={flash===m.id} onComplete={onComplete} onUncomplete={onUncomplete} onSkip={onSkip} onUnskip={onUnskip} delay={i*0.04} mine onRemove={()=>onUpdateMyM(myM.filter(x=>x.id!==m.id))}/>
        ))}
      </section>

      {allDone&&<div role="status" style={{textAlign:"center",padding:"20px 0 4px",fontFamily:"'JetBrains Mono',monospace",fontSize:10,letterSpacing:3,color:"#4ade80",textShadow:"0 0 12px rgba(74,222,128,0.5)",animation:"fadeUp 0.4s ease"}}>◆ ALL MISSIONS COMPLETE ◆</div>}
    </div>
  );
}

function MCard({mission,isDone,isSkipped,isFlash,onComplete,onUncomplete,onSkip,onUnskip,delay,boss,mine,onRemove}){
  const cat=CATS[mission.cat]||{color:"#94a3b8"};
  return(
    <article className={`card${isDone?" done":""}${isSkipped?" skip":""}${isFlash?" just-done":""}`}
      style={{background:isSkipped?"rgba(6,10,18,0.7)":isDone?"rgba(5,12,8,0.8)":"rgba(6,14,28,0.85)",border:`1px solid ${isSkipped?"#0d1428":isDone?"rgba(20,50,30,0.5)":"#0d1e36"}`,borderLeft:`3px solid ${isSkipped?"#1a2030":isDone?"#1a3a20":cat.color}`,borderRadius:9,padding:"11px 13px",display:"flex",alignItems:"center",gap:11,animationDelay:`${delay}s`,opacity:isSkipped?0.35:isDone?0.55:1,backdropFilter:"blur(4px)",boxShadow:!isDone&&!isSkipped&&boss?"0 0 14px rgba(255,159,0,0.1)":"none"}}>
      <div style={{flexShrink:0}}><ShipIcon cat={mission.cat} size={26} done={isDone||isSkipped}/></div>
      <div style={{flex:1,minWidth:0}}>
        <div style={{fontWeight:700,fontSize:13,color:isSkipped?"#2a3a50":isDone?"#3a6050":"#e8f0ff",textDecoration:isSkipped||isDone?"line-through":"none",letterSpacing:0.3}}>{mission.title}</div>
        <div style={{fontSize:10,color:"#5a7888",marginTop:1}}>{isSkipped?"not today":mission.desc}</div>
      </div>
      <div style={{flexShrink:0,textAlign:"right",display:"flex",flexDirection:"column",gap:4,alignItems:"flex-end"}}>
        <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:11,color:isSkipped?"#1a2a30":isDone?"#2a4030":cat.color,fontWeight:400}}>+{mission.min}m</div>

        {isSkipped?(
          <button className="cbtn" onClick={()=>onUnskip(mission)} aria-label={`Undo skip ${mission.title}`} style={{padding:"3px 9px",borderRadius:4,border:"1px solid rgba(100,150,180,0.3)",background:"transparent",color:"#5a8090",fontFamily:"'Oxanium',sans-serif",fontWeight:700,fontSize:8,letterSpacing:1.2}}>UNDO</button>
        ):isDone?(
          <>
            <span style={{fontFamily:"'Oxanium',sans-serif",fontWeight:700,fontSize:8,letterSpacing:1.5,color:"#2a5a34"}}>DONE ✓</span>
            <button className="cbtn" onClick={()=>onUncomplete(mission)} aria-label={`Undo ${mission.title}`} style={{padding:"3px 8px",borderRadius:4,border:"1px solid rgba(255,100,80,0.3)",background:"rgba(255,80,60,0.06)",color:"rgba(255,130,110,0.85)",fontFamily:"'Oxanium',sans-serif",fontWeight:700,fontSize:8,letterSpacing:1.2}}>UNDO</button>
          </>
        ):(
          <>
            <button className="cbtn" onClick={()=>onComplete(mission)} aria-label={`Complete ${mission.title}`} style={{padding:"4px 10px",borderRadius:5,border:`1px solid ${cat.color}55`,background:`${cat.color}12`,color:cat.color,fontFamily:"'Oxanium',sans-serif",fontWeight:700,fontSize:8,letterSpacing:1.5}}>COMPLETE</button>
            <button className="cbtn" onClick={()=>onSkip(mission)} aria-label={`Skip ${mission.title} today`} style={{padding:"2px 8px",borderRadius:4,border:"1px solid #1a2a40",background:"transparent",color:"#3a5060",fontFamily:"'Oxanium',sans-serif",fontWeight:700,fontSize:7,letterSpacing:1.2}}>NOT TODAY</button>
          </>
        )}

        {mine&&!isDone&&!isSkipped&&(
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
      <section aria-label="Summer Challenge" style={{background:"rgba(6,14,28,0.85)",border:"1px solid #0d1e36",borderRadius:14,padding:18,marginBottom:12,backdropFilter:"blur(6px)"}}>
        <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,letterSpacing:2.5,color:"#8ab0d0",marginBottom:14}}>SUMMER CHALLENGE — 90 DAYS</div>
        <div style={{position:"relative",marginBottom:28}}>
          <div style={{background:"#0a1428",borderRadius:99,height:10,overflow:"visible",position:"relative"}}>
            <div style={{height:"100%",borderRadius:99,width:`${Math.min(100,(gateDays/90)*100)}%`,background:"linear-gradient(90deg,#00e5ff,#4ade80)",boxShadow:"0 0 8px rgba(74,222,128,0.35)",transition:"width 0.6s ease",animation:"barIn 0.8s ease",minWidth:gateDays>0?8:0}}/>
            {[{pct:33.3,day:30,r:milestones.m30},{pct:66.6,day:60,r:milestones.m60},{pct:100,day:90,r:milestones.m90}].map(({pct,day,r})=>{
              const met=gateDays>=day;
              return <div key={day} style={{position:"absolute",top:-5,left:`${pct}%`,transform:"translateX(-50%)"}} aria-label={`Day ${day} milestone${met?" reached":""}`}><div style={{width:20,height:20,borderRadius:"50%",background:met?"#4ade80":"#0a1428",border:`2px solid ${met?"#4ade80":"#1a3050"}`,display:"flex",alignItems:"center",justifyContent:"center",boxShadow:met?"0 0 10px rgba(74,222,128,0.5)":"none",transition:"all 0.5s"}}>{met&&<span style={{fontSize:9}}>✓</span>}</div><div style={{textAlign:"center",marginTop:5,fontFamily:"'JetBrains Mono',monospace",fontSize:8,color:met?"#4ade80":"#5a7888",whiteSpace:"nowrap",transform:"translateX(-50%)",position:"absolute",left:"50%"}}>D{day}</div></div>;
            })}
          </div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:6,marginTop:4}}>
          {[{day:30,r:milestones.m30},{day:60,r:milestones.m60},{day:90,r:milestones.m90}].map(({day,r})=>{
            const met=gateDays>=day;
            return <div key={day} style={{background:met?"rgba(10,40,20,0.8)":"rgba(5,10,20,0.8)",border:`1px solid ${met?"#1a5a30":"#0d1e36"}`,borderRadius:8,padding:"9px 7px",textAlign:"center"}}><div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:met?"#4ade80":"#5a7888",marginBottom:3}}>DAY {day} {met?"🏆":""}</div><div style={{fontSize:10,color:met?"#90d0a8":"#3a5060",lineHeight:1.4}}>{r||"(not set)"}</div></div>;
          })}
        </div>
        <p style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:"#5a7888",textAlign:"center",marginTop:11}}>{gateDays} gate days · {daysElapsed} elapsed · {Math.max(0,90-gateDays)} to go</p>
      </section>

      {/* Calendar */}
      <section aria-label="Summer Calendar" style={{background:"rgba(6,14,28,0.85)",border:"1px solid #0d1e36",borderRadius:14,padding:16,marginBottom:12,backdropFilter:"blur(6px)",overflowX:"auto"}}>
        <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,letterSpacing:2.5,color:"#8ab0d0",marginBottom:11}}>SUMMER CALENDAR</div>
        <div style={{display:"flex",gap:2,marginLeft:16,marginBottom:3}} aria-hidden="true">{Array.from({length:13},(_,wi)=>{const ml=monthLabels.find(x=>x.wi===wi);return <div key={wi} style={{width:22,flexShrink:0,fontFamily:"'JetBrains Mono',monospace",fontSize:7,color:"#5a7888"}}>{ml?ml.label:""}</div>;})}</div>
        <div style={{display:"flex",gap:2}}>
          <div style={{display:"flex",flexDirection:"column",gap:2,marginRight:2}} aria-hidden="true">{["M","","W","","F","","S"].map((d,i)=><div key={i} style={{width:12,height:20,fontSize:7,color:"#5a7888",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"monospace"}}>{d}</div>)}</div>
          {weeks.map((wk,wi)=>(
            <div key={wi} style={{display:"flex",flexDirection:"column",gap:2}}>
              {wk.map((cell,di)=>{
                if(!cell.inSum)return <div key={di} style={{width:20,height:20,borderRadius:3,background:"transparent"}}/>;
                let bg="#0a1428";
                if(!cell.isFut){if(cell.metGate)bg=`hsl(145,${55+cell.count*5}%,${30+cell.count*3}%)`;else if(cell.count>0)bg="#152a1a";else bg="#0d1828";}
                const e=history.find(h=>h.date===cell.ds);
                const moodEmoji=e?.mood?MOODS.find(m=>m.val===e.mood)?.emoji:"";
                return <div key={di} title={`${cell.ds}${cell.count>0?` · ${cell.count} missions`:""}${moodEmoji?` · ${moodEmoji}`:""}`} style={{width:20,height:20,borderRadius:3,background:bg,border:cell.isToday?"1.5px solid #00e5ff":"1px solid transparent",boxShadow:cell.metGate?"0 0 4px rgba(74,222,128,0.35)":cell.isToday?"0 0 5px rgba(0,229,255,0.4)":"none",transition:"background 0.3s",flexShrink:0}}/>;
              })}
            </div>
          ))}
        </div>
        <div style={{display:"flex",alignItems:"center",gap:10,marginTop:10,flexWrap:"wrap"}} aria-hidden="true">
          {[["#0d1828","No missions"],["#152a1a","Attempted"],["hsl(145,65%,32%)","Gate met"]].map(([c,l])=>(
            <div key={l} style={{display:"flex",alignItems:"center",gap:4}}><div style={{width:11,height:11,borderRadius:2,background:c}}/><span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:8,color:"#6a8898"}}>{l}</span></div>
          ))}
        </div>
      </section>

      {/* Achievements */}
      <section aria-label="Achievements" style={{background:"rgba(6,14,28,0.85)",border:"1px solid #0d1e36",borderRadius:14,padding:16,marginBottom:12,backdropFilter:"blur(6px)"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:13}}>
          <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,letterSpacing:2.5,color:"#8ab0d0"}}>ACHIEVEMENTS</div>
          <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:"#5a7888"}}>{earned.length}/{ACHV.length}</div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6}}>
          {ACHV.map(a=>{const e=earned.includes(a.id);return(
            <div key={a.id} style={{background:e?"rgba(10,30,18,0.9)":"rgba(5,10,18,0.8)",border:`1px solid ${e?"#1a5a30":"#0d1e36"}`,borderRadius:8,padding:"9px",display:"flex",alignItems:"center",gap:7,opacity:e?1:0.4,transition:"opacity 0.3s"}}>
              <span style={{fontSize:e?20:16,filter:e?"none":"grayscale(1)"}} aria-hidden="true">{a.icon}</span>
              <div style={{minWidth:0}}><div style={{fontWeight:700,fontSize:11,color:e?"#e8f0ff":"#3a5060",letterSpacing:0.3,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{a.title}</div><div style={{fontSize:9,color:e?"#70a888":"#2a4050",marginTop:1,lineHeight:1.3}}>{a.desc}</div></div>
            </div>
          );})}
        </div>
      </section>

      {/* History */}
      <section aria-label="History Log" style={{background:"rgba(6,14,28,0.85)",border:"1px solid #0d1e36",borderRadius:14,padding:16,backdropFilter:"blur(6px)"}}>
        <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,letterSpacing:2.5,color:"#8ab0d0",marginBottom:11}}>HISTORY LOG</div>
        {history.length===0&&<p style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:"#3a5060"}}>No entries yet.</p>}
        <div style={{display:"grid",gap:5}}>
          {history.map((entry,i)=>{
            const isOpen=histOpen===entry.date,met=entry.completed.length>=gateMin;
            const eh=Math.floor(entry.totalMin/60),em=entry.totalMin%60;
            const moodData=entry.mood?MOODS.find(m=>m.val===entry.mood):null;
            return(
              <div key={entry.date} className="hcard" onClick={()=>setHistOpen(isOpen?null:entry.date)}
                role="button" tabIndex={0} aria-expanded={isOpen} onKeyDown={e=>(e.key==="Enter"||e.key===" ")&&setHistOpen(isOpen?null:entry.date)}
                style={{background:"rgba(5,10,18,0.8)",border:`1px solid ${isOpen?"#1a2a40":"#0a1428"}`,borderLeft:`3px solid ${met?"#4ade80":"#1a2a40"}`,borderRadius:8,overflow:"hidden",animationDelay:`${i*0.03}s`,backdropFilter:"blur(4px)"}}>
                <div style={{display:"flex",alignItems:"center",padding:"10px 12px",gap:9}}>
                  <span style={{fontSize:13}} aria-hidden="true">{met?"✅":"⬜"}</span>
                  <div style={{flex:1}}>
                    <div style={{display:"flex",alignItems:"center",gap:6}}><div style={{fontWeight:600,fontSize:12,color:"#e8f0ff"}}>{fmtDate(entry.date)}</div>{moodData&&<span style={{fontSize:12}} title={`Energy: ${moodData.label}`}>{moodData.emoji}</span>}</div>
                    <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:"#5a7888",marginTop:1}}>{entry.completed.length} missions{!met&&` · needed ${gateMin}`}</div>
                  </div>
                  <div style={{textAlign:"right"}}><div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:12,color:met?"#4ade80":"#5a7888"}}>{entry.totalMin>0?`+${eh>0?`${eh}h `:""}${em>0?`${em}m`:""}`:"—"}</div><div style={{fontSize:8,color:"#2a4050",marginTop:1}}>{isOpen?"▲":"▼"}</div></div>
                </div>
                {isOpen&&(
                  <div style={{borderTop:"1px solid #0d1e36",padding:"8px 12px 10px"}}>
                    {entry.completed.map(cm=>{const c=CATS[cm.cat]||{color:"#6a8898"};return(
                      <div key={cm.id} style={{display:"flex",alignItems:"center",gap:7,padding:"4px 0",borderBottom:"1px solid #0a1428"}}><span style={{fontSize:11}} aria-hidden="true">{cm.icon}</span><span style={{flex:1,fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:"#8ab0c0"}}>{cm.title}</span><span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:c.color}}>+{cm.min}m</span></div>
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
      <div style={{background:"rgba(6,14,28,0.85)",border:"1px solid #0d1e36",borderRadius:16,padding:"32px 22px",textAlign:"center",marginBottom:12,backdropFilter:"blur(6px)"}}>
        <div style={{fontSize:36,marginBottom:12}} aria-hidden="true">🔒</div>
        <div style={{fontFamily:"'Oxanium',sans-serif",fontWeight:700,fontSize:14,letterSpacing:3,color:"#8ab0d0",marginBottom:6}}>TIME BANK LOCKED</div>
        <p style={{fontFamily:"'JetBrains Mono',monospace",fontSize:11,color:"#8ab0d0",marginBottom:20,lineHeight:1.7}}>Complete {gateMin-done} more {gateMin-done===1?"mission":"missions"} to unlock</p>
        <div style={{background:"#0a1428",borderRadius:99,height:7,overflow:"hidden",maxWidth:260,margin:"0 auto 8px"}} role="progressbar" aria-valuenow={done} aria-valuemin={0} aria-valuemax={gateMin}>
          <div style={{height:"100%",borderRadius:99,width:`${prog*100}%`,background:"linear-gradient(90deg,#00e5ff,#4ade80)",transition:"width 0.5s ease",animation:prog>0?"barIn 0.6s ease":"none"}}/>
        </div>
        <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:"#8ab0d0",letterSpacing:1}}>{done} / {gateMin}</div>
      </div>
    </div>
  );
  return(
    <div style={{animation:"fadeUp 0.3s ease"}}>
      <div style={{background:"rgba(6,14,28,0.85)",border:"1px solid rgba(74,222,128,0.18)",borderRadius:16,padding:"32px 22px",textAlign:"center",marginBottom:16,backdropFilter:"blur(6px)"}}>
        <div style={{display:"flex",justifyContent:"center",marginBottom:14}} aria-hidden="true"><SHIPS.boss size={44} color="#4ade80"/></div>
        <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,letterSpacing:2.5,color:"#80b898",marginBottom:9}}>AVAILABLE TIME</div>
        <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:50,fontWeight:300,letterSpacing:2,lineHeight:1,color:bank>0?"#4ade80":"#1a3020",textShadow:bank>0?"0 0 24px rgba(74,222,128,0.3)":"none",transition:"color 0.4s"}} aria-label={`${h} hours and ${m} minutes available`}>{String(h).padStart(2,"0")}:{String(m).padStart(2,"0")}</div>
        <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:8,letterSpacing:2,color:"#1a3030",marginTop:7}}>HRS : MIN</div>
        <p style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:"#3a5060",marginTop:9}}>Unused time resets at midnight.</p>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
        {[30,60,90,120].map(min=>{const ok=bank>=min;return <button key={min} disabled={!ok} onClick={()=>onUse(min)} className="cbtn" aria-label={`Use ${min>=60?`${min/60} hour${min>60?"s":""}`:min+" minutes"}`} style={{padding:"16px 0",border:"1px solid",borderColor:ok?"rgba(0,229,255,0.3)":"#0d1e36",borderRadius:10,background:ok?"rgba(0,229,255,0.07)":"rgba(6,14,28,0.6)",color:ok?"#00e5ff":"#1a3040",fontFamily:"'Oxanium',sans-serif",fontWeight:700,fontSize:14,transition:"all 0.2s",backdropFilter:"blur(4px)"}}>{min>=60?`${min/60}h`:`${min}m`}</button>;})}
      </div>
    </div>
  );
}

// ── Ops ───────────────────────────────────────────────────────────────────────

function Ops({missions,myM,done,bank,gateMin,sumStart,milestones,messages,onReset,onUpdateMissions,onUpdateGate,onUpdateStart,onUpdateMilestones,onMarkRead,onMarkAllRead}){
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
      <div style={{background:"rgba(6,14,28,0.9)",border:"1px solid #0d1e36",borderRadius:16,padding:"26px 22px",backdropFilter:"blur(8px)"}}>
        <div style={{textAlign:"center",marginBottom:14}} aria-hidden="true"><span style={{fontSize:30}}>🛸</span></div>
        <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,letterSpacing:2,color:"#8ab0d0",textAlign:"center",marginBottom:16}}>OPS CENTER — PARENT ACCESS</div>
        <label style={LBL}>PIN
          <input type="password" autoComplete="current-password" value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&unlock()} aria-invalid={pinErr} aria-describedby={pinErr?"pin-err":undefined}
            style={{display:"block",width:"100%",padding:"11px 14px",marginTop:4,marginBottom:8,background:"#020408",border:`2px solid ${pinErr?"#ff6080":"#0d1e36"}`,borderRadius:7,color:"#e8f0ff",fontFamily:"'JetBrains Mono',monospace",fontSize:18,letterSpacing:6,textAlign:"center",transition:"border-color 0.2s"}}/>
        </label>
        {pinErr&&<p id="pin-err" role="alert" style={{color:"#ff8090",fontSize:9,textAlign:"center",fontFamily:"monospace",letterSpacing:1.5,marginBottom:8}}>INCORRECT PIN</p>}
        <button onClick={unlock} style={{width:"100%",padding:11,background:"rgba(0,229,255,0.08)",border:"2px solid rgba(0,229,255,0.35)",borderRadius:8,color:"#00e5ff",fontFamily:"'Oxanium',sans-serif",fontWeight:700,fontSize:11,letterSpacing:2}}>UNLOCK</button>
        <p style={{fontFamily:"'JetBrains Mono',monospace",fontSize:8,color:"#2a4050",textAlign:"center",marginTop:12,letterSpacing:1}}>DEFAULT PIN: 1234</p>
      </div>
    </div>
  );

  const todayDone=missions.filter(m=>done.includes(m.id));

  return(
    <div style={{animation:"fadeUp 0.3s ease"}}>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:10}}>
        <StatB label="DONE TODAY" value={`${todayDone.length}/${missions.filter(m=>m.active!==false).length}`} color="#4ade80"/>
        <StatB label="TIME BANKED" value={`${Math.floor(bank/60)}h ${bank%60}m`} color="#00e5ff"/>
      </div>

      {/* Messages */}
      <OS title={`MESSAGES FROM JULIAN${unread>0?` · ${unread} NEW`:""}`}>
        {messages.length===0?(
          <p style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:"#3a5060"}}>No messages yet.</p>
        ):(
          <>
            {unread>0&&<button onClick={onMarkAllRead} style={{...OB("#f472b6"),marginBottom:10}}>MARK ALL READ</button>}
            <div style={{display:"grid",gap:7}}>
              {messages.map(msg=>(
                <div key={msg.id} onClick={()=>onMarkRead(msg.id)} style={{background:msg.read?"rgba(5,10,18,0.6)":"rgba(20,10,25,0.8)",border:`1px solid ${msg.read?"#0a1428":"rgba(244,114,182,0.25)"}`,borderLeft:`3px solid ${msg.read?"#1a2030":"#f472b6"}`,borderRadius:7,padding:"10px 12px",cursor:msg.read?"default":"pointer",transition:"all 0.2s"}}>
                  <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:8,color:msg.read?"#3a5060":"#c47898",letterSpacing:1,marginBottom:5,display:"flex",justifyContent:"space-between"}}>
                    <span>{fmtDate(new Date(msg.timestamp).toDateString())}</span>
                    <span>{fmtTime(msg.timestamp)}</span>
                  </div>
                  <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:11,color:msg.read?"#5a7888":"#e8f0ff",lineHeight:1.6}}>{msg.text}</div>
                  {!msg.read&&<div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:7,color:"#c47898",marginTop:5,letterSpacing:1}}>TAP TO MARK READ</div>}
                </div>
              ))}
            </div>
          </>
        )}
      </OS>

      {/* Gate */}
      <OS title="UNLOCK THRESHOLD">
        <p style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:"#8ab0d0",marginBottom:13,lineHeight:1.7}}>Missions required before Time Bank unlocks.<br/><span style={{color:"#5a7888"}}>Start at 3 — raise as habits build.</span></p>
        <div style={{display:"flex",alignItems:"center",gap:20,justifyContent:"center"}}>
          <button onClick={()=>onUpdateGate(Math.max(1,gateMin-1))} aria-label="Decrease" style={{width:40,height:40,borderRadius:8,border:"1px solid #1a3050",background:"#020408",color:"#8ab0d0",fontFamily:"'Oxanium',sans-serif",fontWeight:700,fontSize:18}}>−</button>
          <div style={{textAlign:"center"}}><div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:38,color:"#00e5ff",lineHeight:1}}>{gateMin}</div><div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:8,color:"#5a7888",letterSpacing:1.5,marginTop:2}}>MISSIONS</div></div>
          <button onClick={()=>onUpdateGate(Math.min(7,gateMin+1))} aria-label="Increase" style={{width:40,height:40,borderRadius:8,border:"1px solid #1a3050",background:"#020408",color:"#8ab0d0",fontFamily:"'Oxanium',sans-serif",fontWeight:700,fontSize:18}}>+</button>
        </div>
      </OS>

      {/* Summer settings */}
      <OS title="SUMMER SETTINGS">
        <label style={LBL}>START DATE (YYYY-MM-DD)<input value={startEdit} onChange={e=>setStartEdit(e.target.value)} style={{...II,marginTop:3}} placeholder="2026-06-23"/></label>
        <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:"#8ab0d0",letterSpacing:1,marginTop:12,marginBottom:4}}>MILESTONE REWARDS</div>
        {[["m30","Day 30 reward"],["m60","Day 60 reward"],["m90","Day 90 champion"]].map(([key,ph])=>(
          <label key={key} style={{...LBL,marginBottom:6}}>{ph.toUpperCase()}<input value={mlEdit[key]} onChange={e=>setMlEdit({...mlEdit,[key]:e.target.value})} style={{...II,marginTop:3}} placeholder={ph}/></label>
        ))}
        <button onClick={saveSettings} style={OB(saved?"#4ade80":"#00e5ff")}>{saved?"SAVED ✓":"SAVE SETTINGS"}</button>
      </OS>

      {/* Today */}
      <OS title="TODAY'S COMPLETIONS">
        {todayDone.length===0?<p style={{color:"#5a7888",fontFamily:"monospace",fontSize:11}}>Nothing completed yet.</p>:todayDone.map(m=>(
          <div key={m.id} style={{display:"flex",justifyContent:"space-between",padding:"6px 0",borderBottom:"1px solid #0a1428",fontFamily:"'JetBrains Mono',monospace",fontSize:10}}>
            <span style={{color:"#8ab0c0"}}><span aria-hidden="true">{m.icon}</span> {m.title}</span>
            <span style={{color:"#4ade80"}}>+{m.min}m</span>
          </div>
        ))}
        <div style={{marginTop:10}}>
          {!confirmR?<button onClick={()=>setConfirmR(true)} style={OB("#ff6080")}>RESET TODAY'S MISSIONS</button>
          :<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
            <button onClick={()=>{onReset();setConfirmR(false);}} style={OB("#ff6080")}>CONFIRM</button>
            <button onClick={()=>setConfirmR(false)} style={OB("#5080b0")}>CANCEL</button>
          </div>}
        </div>
      </OS>

      {/* Manage missions */}
      <OS title="MANAGE MISSIONS">
        {missions.map(m=>{const isOff=m.active===false,isC=m.id.startsWith("custom_");return(
          <div key={m.id} style={{display:"flex",alignItems:"center",gap:6,padding:"6px 0",borderBottom:"1px solid #0a1428"}}>
            <span style={{fontSize:12}} aria-hidden="true">{m.icon}</span>
            <span style={{flex:1,fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:isOff?"#2a3a50":"#8ab0c0",textDecoration:isOff?"line-through":"none"}}>{m.title}</span>
            <span style={{fontFamily:"monospace",fontSize:9,color:"#5a7888"}}>{m.min}m</span>
            {m.boss&&<span style={{fontFamily:"monospace",fontSize:7,color:"#c07000",letterSpacing:1}}>BOSS</span>}
            <button onClick={()=>toggle(m.id)} aria-label={`${isOff?"Enable":"Disable"} ${m.title}`} style={{padding:"2px 6px",border:`1px solid ${isOff?"#1a3050":"rgba(251,191,36,0.35)"}`,borderRadius:4,background:"transparent",color:isOff?"#2a4050":"#fbbf24",fontFamily:"monospace",fontSize:8,letterSpacing:1}}>{isOff?"OFF":"ON"}</button>
            {isC&&<button onClick={()=>remove(m.id)} aria-label={`Remove ${m.title}`} style={{padding:"2px 6px",border:"1px solid rgba(255,96,128,0.25)",borderRadius:4,background:"transparent",color:"rgba(255,96,128,0.8)",fontFamily:"monospace",fontSize:8}}>✕</button>}
          </div>
        );})}
        {myM.length>0&&<div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:8,color:"#5a7888",letterSpacing:1.5,marginTop:9,marginBottom:5}}>JULIAN'S MISSIONS</div>}
        {myM.map(m=><div key={m.id} style={{display:"flex",alignItems:"center",gap:6,padding:"5px 0",borderBottom:"1px solid #0a1428"}}><span style={{fontSize:11}} aria-hidden="true">{m.icon}</span><span style={{flex:1,fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:"#5a7080"}}>{m.title}</span><span style={{fontFamily:"monospace",fontSize:8,color:"#3a5060"}}>{m.min}m</span><span style={{fontFamily:"monospace",fontSize:7,color:"#3a6080",letterSpacing:1}}>HIS</span></div>)}
        {showAdd?(
          <div style={{background:"#020408",borderRadius:8,padding:12,marginTop:10,border:"1px solid #0d1e36"}}>
            <div style={{display:"grid",gap:7}}>
              <label style={LBL}>TITLE<input placeholder="Mission title" value={newM.title} onChange={e=>setNewM({...newM,title:e.target.value})} style={{...II,marginTop:3}}/></label>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:7}}>
                <label style={LBL}>ICON<input placeholder="🎮" value={newM.icon} onChange={e=>setNewM({...newM,icon:e.target.value})} style={{...II,marginTop:3}}/></label>
                <label style={LBL}>MINUTES<input type="number" value={newM.min} onChange={e=>setNewM({...newM,min:e.target.value})} style={{...II,marginTop:3}}/></label>
              </div>
              <label style={LBL}>CATEGORY<select value={newM.cat} onChange={e=>setNewM({...newM,cat:e.target.value})} style={{...II,marginTop:3,appearance:"none"}}>{Object.entries(CATS).filter(([k])=>k!=="mine").map(([k,v])=><option key={k} value={k}>{v.label}</option>)}</select></label>
              <label style={LBL}>DESCRIPTION<input placeholder="Optional" value={newM.desc} onChange={e=>setNewM({...newM,desc:e.target.value})} style={{...II,marginTop:3}}/></label>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:7}}>
                <button onClick={add} style={OB("#4ade80")}>ADD</button>
                <button onClick={()=>setShowAdd(false)} style={OB("#5080b0")}>CANCEL</button>
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
            <button onClick={changePin} style={{padding:"0 13px",border:"2px solid rgba(0,229,255,0.3)",borderRadius:7,background:"rgba(0,229,255,0.07)",color:"#00e5ff",fontFamily:"'Oxanium',sans-serif",fontWeight:700,fontSize:10,letterSpacing:1}}>SET</button>
          </div>
        </label>
        {pinMsg&&<p role="status" style={{color:"#4ade80",fontFamily:"monospace",fontSize:10,marginTop:6}}>{pinMsg}</p>}
      </OS>
    </div>
  );
}

// ── Shared ────────────────────────────────────────────────────────────────────

function StatB({label,value,color}){return <div style={{background:"rgba(6,14,28,0.85)",border:"1px solid #0d1e36",borderRadius:8,padding:"12px 8px",textAlign:"center",backdropFilter:"blur(4px)"}}><div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:7,letterSpacing:2,color:"#8ab0d0",marginBottom:5}}>{label}</div><div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:15,color}}>{value}</div></div>;}
function OS({title,children}){return <div style={{background:"rgba(6,14,28,0.85)",border:"1px solid #0d1e36",borderRadius:11,padding:16,marginBottom:10,backdropFilter:"blur(6px)"}}><div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:8,letterSpacing:2.5,color:"#8ab0d0",marginBottom:12}}>{title}</div>{children}</div>;}
const OB=c=>({width:"100%",padding:"9px 0",background:`${c}12`,border:`2px solid ${c}45`,borderRadius:8,color:c,fontFamily:"'Oxanium',sans-serif",fontWeight:700,fontSize:9,letterSpacing:2});
const II={width:"100%",padding:"8px 10px",background:"#020408",border:"1px solid #0d1e36",borderRadius:6,color:"#e8f0ff",fontFamily:"'JetBrains Mono',monospace",fontSize:11};
const LBL={fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:"#8ab0d0",letterSpacing:1,display:"block",marginBottom:2};
