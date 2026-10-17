const $=s=>document.querySelector(s),I={c:'<rect x="4" y="5" width="16" height="15" rx="1.5"/><path d="M8 3v4M16 3v4M4 10h16"/>',t:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',p:'<path d="M12 21s7-6.2 7-11a7 7 0 10-14 0c0 4.8 7 11 7 11z"/><circle cx="12" cy="10" r="2.5"/>'},ic=k=>`<svg viewBox="0 0 24 24" aria-hidden="true">${I[k]}</svg>`;
if(C.showVerse)$("#vs").hidden=false;
$("#tl").innerHTML=C.events.map(e=>`<article class="ev3 rv"><div class="ei">${e.g}</div><h3>${e.t}</h3><p class="ed">${e.date}</p><p class="et">${e.time}</p><p class="ev_">${e.v}${e.s?"<br><small>"+e.s+"</small>":""}</p><a class="el" href="${e.u}" target="_blank" rel="noopener">View directions&nbsp;&rarr;</a></article>`).join("");
$("#lk").innerHTML=C.events.map((e,i)=>`<a class="btn o" style="margin:0" href="${e.u}" target="_blank" rel="noopener">${i+1}. ${e.t} — Directions</a>`).join("");
$("#ec").innerHTML=C.events.map(e=>`<label><input type="checkbox" value="${e.t}" checked> ${e.t}</label>`).join("");
// map (OpenStreetMap via Leaflet)
(function(){const m=L.map("map",{scrollWheelZoom:false}),pts=[];
L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png",{maxZoom:19,attribution:"&copy; OpenStreetMap contributors"}).addTo(m);
C.events.forEach((e,i)=>{pts.push([e.lat,e.lng]);L.marker([e.lat,e.lng],{icon:L.divIcon({className:"pin",html:`<span><b>${i+1}</b></span>`,iconSize:[34,34],iconAnchor:[17,34],popupAnchor:[0,-34]})}).addTo(m).bindPopup(`<b>${e.t}</b><br>${e.v}<br><a href="${e.u}" target="_blank" rel="noopener">Get directions</a>`)});
m.fitBounds(pts,{padding:[50,50]});setTimeout(()=>m.invalidateSize(),400)})();
// countdown
const T=new Date(C.target);function tick(){const x=T-Date.now();if(x<=0){$("#cds").innerHTML='<h2>Thank you for celebrating with us</h2><span class="cap">Alhamdulillah</span>';$("#rs").hidden=true;if($("#sd"))$("#sd").hidden=true;clearInterval(iv);return}
const v=[Math.floor(x/864e5),Math.floor(x/36e5)%24,Math.floor(x/6e4)%60,Math.floor(x/1e3)%60];$("#cd").innerHTML=["Days","Hours","Minutes","Seconds"].map((l,i)=>`<div><b>${v[i]}</b><span>${l}</span></div>`).join("")}
const iv=setInterval(tick,1000);tick();
// save the date
const z=d=>new Date(d).toISOString().replace(/[-:]|\.\d{3}/g,"");
if($("#sd"))$("#sd").onclick=async()=>{const ics=["BEGIN:VCALENDAR","VERSION:2.0","PRODID:-//Ayshath & Abbas//EN",...C.events.flatMap(e=>["BEGIN:VEVENT","UID:"+z(e.d)+"@ayshath-abbas","DTSTAMP:"+z(Date.now()),"DTSTART:"+z(e.d),"DTEND:"+z(+new Date(e.d)+108e5),"SUMMARY:"+e.t+" – Ayshath & Abbas","LOCATION:"+e.v,"URL:"+e.u,"END:VEVENT"]),"END:VCALENDAR"].join("\r\n");
 try{const d=window.claude&&await claude.use("downloads");if(d){await d.save({filename:"Ayshath-Abbas-Wedding.ics",data:ics});return}}catch(e){}
 const n=C.events[1];open(`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent("Nikah – Ayshath & Abbas")}&dates=${z(n.d)}/${z(+new Date(n.d)+108e5)}&location=${encodeURIComponent(n.v)}`,"_blank")};
// calendar + reminders
(function(){const cal=$("#cal");if(!cal)return;
const key=d=>new Date(d).toLocaleDateString("en-CA",{timeZone:"Asia/Kolkata"});
const by={};C.events.forEach(e=>(by[key(e.d)]=by[key(e.d)]||[]).push(e));
const f=key(C.events[0].d).split("-");let Y=+f[0],M=+f[1]-1,sel=key(C.events[0].d);
const mk=list=>["BEGIN:VCALENDAR","VERSION:2.0","PRODID:-//Ayshath & Abbas//EN","CALSCALE:GREGORIAN",...list.flatMap(e=>["BEGIN:VEVENT","UID:"+z(e.d)+"@ayshath-abbas","DTSTAMP:"+z(Date.now()),"DTSTART:"+z(e.d),"DTEND:"+z(+new Date(e.d)+108e5),"SUMMARY:"+e.t+" – Ayshath & Abbas","LOCATION:"+e.v,"URL:"+e.u,"BEGIN:VALARM","TRIGGER:-P1D","ACTION:DISPLAY","DESCRIPTION:Tomorrow: "+e.t,"END:VALARM","BEGIN:VALARM","TRIGGER:-PT2H","ACTION:DISPLAY","DESCRIPTION:"+e.t+" starts in 2 hours","END:VALARM","END:VEVENT"]),"END:VCALENDAR"].join("\r\n");
const dl=(list,name)=>{const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([mk(list)],{type:"text/calendar"}));a.download=name;document.body.appendChild(a);a.click();a.remove()};
const gc=e=>`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(e.t+" – Ayshath & Abbas")}&dates=${z(e.d)}/${z(+new Date(e.d)+108e5)}&location=${encodeURIComponent(e.v)}`;
function draw(){const first=new Date(Y,M,1),days=new Date(Y,M+1,0).getDate(),pad=first.getDay();
let h=`<div class="ch"><button type="button" id="cp" aria-label="Previous month">&lsaquo;</button><b>${first.toLocaleDateString("en-GB",{month:"long",year:"numeric"})}</b><button type="button" id="cn" aria-label="Next month">&rsaquo;</button></div><div class="cg">`+["S","M","T","W","T","F","S"].map(d=>`<i>${d}</i>`).join("");
for(let i=0;i<pad;i++)h+="<span></span>";
for(let d=1;d<=days;d++){const k=`${Y}-${String(M+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`,has=by[k];h+=has?`<button type="button" class="ev-d${k==sel?" on":""}" data-k="${k}">${d}</button>`:`<span>${d}</span>`}
h+="</div>";const L=by[sel]||[];
h+=`<div class="cl">`+(L.length?L.map((e,i)=>`<div class="ci"><b>${e.g} ${e.t}</b><small>${e.date} &middot; ${e.time}<br>${e.v}</small><div class="cb"><button type="button" class="btn o" data-r="${C.events.indexOf(e)}">Remind me</button><a class="btn o" href="${gc(e)}" target="_blank" rel="noopener">Google Calendar</a></div></div>`).join(""):`<small>Tap a highlighted date to see the event.</small>`)+`</div><button type="button" class="btn" id="ca">Add all events</button><small class="cn">Reminders: 1 day before and 2 hours before.</small>`;
cal.innerHTML=h;
cal.querySelectorAll(".ev-d").forEach(b=>b.onclick=()=>{sel=b.dataset.k;draw()});
cal.querySelectorAll("[data-r]").forEach(b=>b.onclick=()=>{const e=C.events[+b.dataset.r];dl([e],e.t.replace(/\W+/g,"-")+".ics")});
$("#ca").onclick=()=>dl(C.events,"Ayshath-Abbas-Wedding.ics");
$("#cp").onclick=()=>{M--;if(M<0){M=11;Y--}draw()};$("#cn").onclick=()=>{M++;if(M>11){M=0;Y++}draw()}}
draw()})();
// music
let au=null;const mt=$("#mt");const MS=(C.music&&C.music.src)||"assets/audio/wedding-instrumental.mp3",MV=(C.music&&C.music.volume)||.3;
if(mt){au=new Audio();au.src=MS;au.loop=true;au.onerror=()=>{mt.style.display="none";au=null};au.preload="none";au.volume=0;mt.style.display="block"}
function fade(to){if(!au)return;clearInterval(au._f);au._f=setInterval(()=>{const d=to-au.volume;if(Math.abs(d)<.02){au.volume=to;clearInterval(au._f);if(!to)au.pause()}else au.volume=Math.max(0,Math.min(1,au.volume+Math.sign(d)*.02))},60)}
function play(){if(!au)return;au.play().then(()=>{fade(MV);mt.textContent="PAUSE";mt.dataset.p=1}).catch(()=>{mt.textContent="PLAY"})}
if(mt)mt.onclick=()=>{if(mt.dataset.p){fade(0);mt.textContent="PLAY";delete mt.dataset.p}else play()};
document.addEventListener("visibilitychange",()=>{if(au&&document.hidden&&mt.dataset.p){au.pause()}else if(au&&mt.dataset.p)au.play()});
// envelope
const ov=$("#ov");const open_=()=>{if(ov.classList.contains("go"))return;ov.classList.add("go");if(au)play();
document.body.classList.add("ready");
document.querySelectorAll(".hero>*:not(.leaves)").forEach((e,i)=>e.style.animationDelay=(2.4+i*.18)+"s");
if(!matchMedia("(prefers-reduced-motion:reduce)").matches){const w=document.createElement("div");w.className="leaves";
for(let i=0;i<14;i++){const l=document.createElement("span");l.style.cssText=`left:${Math.random()*100}%;animation-duration:${10+Math.random()*9}s;animation-delay:${1.5+Math.random()*8}s;width:${9+Math.random()*8}px;height:${14+Math.random()*10}px;background:${["#6B7A3F","#8A9660","#B5BE8C","#556B2F"][i%4]}`;w.appendChild(l)}
$(".hero").appendChild(w)}
setTimeout(()=>ov.remove(),3400)};
ov.onclick=open_;ov.onkeydown=e=>{if(e.key=="Enter"||e.key==" ")open_()};
// scroll reveal
document.querySelectorAll("section:not(.hero) h2,section:not(.hero) .cap,.cd,#map,.links,form,.verse,.dua").forEach(e=>e.classList.add("rv"));
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add("in");io.unobserve(e.target)}}),{threshold:.15});
document.querySelectorAll(".rv,.tl").forEach(e=>io.observe(e));
// rsvp
const att=$("#a");att.onchange=()=>{const y=att.value.startsWith("Yes")||att.value=="Maybe";$("#gw").hidden=!y;$("#ew").hidden=!y};
let last=0;$("#f").onsubmit=async e=>{e.preventDefault();const f=e.target;if(f.website.value||Date.now()-last<4e3)return;
 const n=$("#n").value.trim(),er=$("#er"),bt=f.querySelector("button");
 if(n.split(/\s+/).length<2||!att.value){er.textContent="Please enter your first and last name and choose an option.";return}er.textContent="";last=Date.now();
 const y=!$("#gw").hidden,ev=[...document.querySelectorAll("#ec input:checked")].map(x=>x.value).join(", "),m=$("#m").value.trim();
 const d={name:n,attending:att.value,guests:y?$("#g").value:"0",events:y?ev:"",message:m};
 const msg=`Assalamu alaikum. RSVP for Ayshath & Abbas's wedding\nName: ${n}\nAttending: ${att.value}`+(y?`\nGuests: ${d.guests}\nEvents: ${ev||"-"}`:"")+(m?`\nMessage: ${m}`:"");
 const done=h=>{f.hidden=true;$("#ok").style.display="block";$("#okt").innerHTML=h};
 if(C.rsvpEndpoint){bt.disabled=true;bt.textContent="Sending...";
  try{await fetch(C.rsvpEndpoint,{method:"POST",mode:"no-cors",headers:{"Content-Type":"text/plain;charset=utf-8"},body:JSON.stringify(d)});done("Your reply has been received. We look forward to celebrating with you.")}
  catch(_){bt.disabled=false;bt.textContent="Submit";er.textContent="Could not send. Please check your connection and try again."}return}
 if(C.rsvpWhatsApp)done(`Tap below to send your reply on WhatsApp.<br><a class="btn" href="https://wa.me/${C.rsvpWhatsApp}?text=${encodeURIComponent(msg)}" target="_blank" rel="noopener">Send on WhatsApp</a>`);
 else{try{navigator.clipboard.writeText(msg)}catch(_){}done("Your reply is copied. Please send it to the family on WhatsApp.<br><small style='white-space:pre-line;opacity:.8'></small>");$("#okt small").textContent=msg}};