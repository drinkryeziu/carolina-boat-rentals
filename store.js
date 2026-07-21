/* ============================================================
   Carolina Boat Rentals — shared prototype data layer
   Uses localStorage so the owner dashboard and the public
   site read/write the same fleet + bookings. Prototype only:
   no real backend, and the login is a demo gate, not security.
   ============================================================ */
(function(){
  const BOATS_KEY = "cbr_boats_v3";
  const BOOK_KEY  = "cbr_bookings_v4";

  const DEFAULT_BOATS = [
    {
      id:"tritoon", name:"Luxury Tritoon",
      sub:"Up to 12 · waterslide · Bluetooth",
      desc:"Our flagship party boat — plush seating, a swim ladder, and a built-in slide. Perfect for bachelorettes and big groups.",
      capacity:12, half:499, full:799,
      tags:["👥 Up to 12","⚡ 250 HP","🔊 Bluetooth audio","🪜 Waterslide"],
      image:"images/luxury-tritoon.jpg",
      status:"limited", statusText:"3 left this week"
    },
    {
      id:"pontoon", name:"Classic Pontoon",
      sub:"Up to 10 · shade top · cooler",
      desc:"Comfortable, easy to drive, and roomy — the go-to for families and relaxed lake days.",
      capacity:10, half:349, full:579,
      tags:["👥 Up to 10","☀️ Shade top","🧊 Cooler included","🔊 Speakers"],
      image:"images/classic-pontoon.webp",
      status:"available", statusText:"Available"
    },
    {
      id:"waverunner", name:"Waverunners",
      sub:"Up to 3 each · Sea-Doo",
      desc:"Fast, easy, and a blast. Rent by the half day or add a pair to your pontoon day for the thrill-seekers.",
      capacity:3, half:299, full:549,
      tags:["👥 Up to 3","🏁 Sea-Doo","🦺 Vests incl.","⚡ 3-seater"],
      image:"linear-gradient(135deg,#ffb020,#f59300)",
      status:"available", statusText:"5 available"
    },
    {
      id:"tour", name:"Guided Sunset Tour",
      sub:"Captained · 2.5 hrs · up to 8",
      desc:"Sit back while our captain shows you the best coves on Lake Norman at golden hour. Great value, zero stress.",
      capacity:8, half:389, full:389,
      tags:["🧭 Captained","🌅 2.5 hours","👥 Up to 8","📸 Photo stops"],
      image:"linear-gradient(135deg,#ff9a5a,#c0431f)",
      status:"available", statusText:"Available"
    }
  ];

  // Seed sample rentals so the dashboard looks alive for the pitch.
  const DEFAULT_BOOKINGS = [
    {code:"CBR-8K2QP", name:"Megan Kessler",  phone:"(704) 555-0132", email:"megan.k@email.com",  boatId:"tritoon",   boatName:"Luxury Tritoon",    date:"2026-07-05", dateLabel:"Sat, Jul 5",  slot:"Full day · 9:00–6:00",   subtotal:838, deposit:251, status:"completed", createdAt:"2026-06-28", balancePaid:true,  payMethod:"card", cashOnly:false, insurance:false},
    {code:"CBR-4M9RT", name:"David Rowe",      phone:"(980) 555-0148", email:"drowe@email.com",     boatId:"pontoon",   boatName:"Classic Pontoon",   date:"2026-07-11", dateLabel:"Sat, Jul 11", slot:"Afternoon · 2:00–6:00",  subtotal:483, deposit:145, status:"completed", createdAt:"2026-07-02", balancePaid:true,  payMethod:"cash", cashOnly:true,  insurance:false},
    {code:"CBR-1XZ7C", name:"Ashley Lin",      phone:"(704) 555-0175", email:"ashley.lin@email.com",boatId:"tour",      boatName:"Guided Sunset Tour",date:"2026-07-12", dateLabel:"Sun, Jul 12", slot:"Sunset · 5:00–7:30",     subtotal:389, deposit:117, status:"completed", createdAt:"2026-07-04", balancePaid:true,  payMethod:"card", cashOnly:false, insurance:false},
    {code:"CBR-3NR7X", name:"Nathan Cole",     phone:"(704) 555-0158", email:"ncole@email.com",     boatId:"waverunner",boatName:"Waverunners",       date:"2026-07-15", dateLabel:"Wed, Jul 15", slot:"Afternoon · 2:00–6:00",  subtotal:338, deposit:101, status:"confirmed", createdAt:"2026-07-13", balancePaid:false, payMethod:null,   cashOnly:false, insurance:false},
    {code:"CBR-6P3WD", name:"Carlos Mendez",   phone:"(704) 555-0190", email:"cmendez@email.com",   boatId:"waverunner",boatName:"Waverunners",       date:"2026-07-18", dateLabel:"Sat, Jul 18", slot:"Morning · 9:00–1:00",    subtotal:338, deposit:101, status:"confirmed", createdAt:"2026-07-10", balancePaid:false, payMethod:null,   cashOnly:false, insurance:false},
    {code:"CBR-9T5HG", name:"Priya Nair",      phone:"(980) 555-0166", email:"priya.n@email.com",   boatId:"tritoon",   boatName:"Luxury Tritoon",    date:"2026-07-19", dateLabel:"Sun, Jul 19", slot:"Full day · 9:00–6:00",   subtotal:837, deposit:251, status:"confirmed", createdAt:"2026-07-11", balancePaid:false, payMethod:null,   cashOnly:false, insurance:true},
    {code:"CBR-2B8KL", name:"Jordan Blake",    phone:"(704) 555-0123", email:"jblake@email.com",    boatId:"pontoon",   boatName:"Classic Pontoon",   date:"2026-07-25", dateLabel:"Sat, Jul 25", slot:"Full day · 9:00–6:00",   subtotal:614, deposit:184, status:"confirmed", createdAt:"2026-07-13", balancePaid:false, payMethod:null,   cashOnly:true,  insurance:false}
  ];

  function read(key, fallback){
    try{const v=JSON.parse(localStorage.getItem(key)); return (v&&v.length!==undefined)?v:fallback;}
    catch(e){return fallback;}
  }
  function write(key,val){ localStorage.setItem(key, JSON.stringify(val)); }

  window.CBR = {
    /* ---- boats ---- */
    getBoats(){
      let b = read(BOATS_KEY, null);
      if(!b){ b = DEFAULT_BOATS.slice(); write(BOATS_KEY,b); }
      return b;
    },
    saveBoats(arr){ write(BOATS_KEY, arr); },
    addBoat(boat){ const b=this.getBoats(); b.push(boat); this.saveBoats(b); return b; },
    removeBoat(id){ const b=this.getBoats().filter(x=>x.id!==id); this.saveBoats(b); return b; },
    updateBoat(boat){ const b=this.getBoats().map(x=>x.id===boat.id?boat:x); this.saveBoats(b); return b; },

    /* ---- bookings ---- */
    getBookings(){
      let b = read(BOOK_KEY, null);
      if(!b){ b = DEFAULT_BOOKINGS.slice(); write(BOOK_KEY,b); }
      return b;
    },
    addBooking(bk){ const b=this.getBookings(); b.unshift(bk); write(BOOK_KEY,b); return b; },
    updateBooking(code, patch){ const b=this.getBookings().map(x=>x.code===code?Object.assign({},x,patch):x); write(BOOK_KEY,b); return b; },
    getBooking(code){ return this.getBookings().find(x=>x.code===code); },
    resetAll(){ localStorage.removeItem(BOATS_KEY); localStorage.removeItem(BOOK_KEY); },

    /* ---- cancellation / refund policy (shared by dashboard + public site) ---- */
    NOW: "2026-07-14T10:00:00",           // fixed "now" for the demo
    tripStartMs(b){
      const s=(b.slot||"").toLowerCase();
      let hm = s.indexOf("afternoon")>-1 ? "14:00" : (s.indexOf("sunset")>-1 ? "17:00" : "09:00");
      return new Date((b.date||"1970-01-01")+"T"+hm+":00").getTime();
    },
    refundInfo(b){
      const hours=(this.tripStartMs(b)-new Date(this.NOW).getTime())/3600000;
      const deposit = b.source==="walk-up" ? (b.subtotal||0) : (b.deposit||0);
      const eligible = hours>=48 || !!b.insurance;
      const reason = hours>=48 ? "More than 48 hours before the trip"
                   : (b.insurance ? "Covered by Damage & Weather Protection" : "Within 48 hours of the trip");
      return { hours:Math.round(hours), eligible, deposit, reason };
    },
    cancelBooking(code, refunded){
      const b=this.getBooking(code); const info=this.refundInfo(b||{});
      return this.updateBooking(code, { status:"cancelled", refunded:!!refunded,
        refundAmount: refunded?info.deposit:0, cancelledAt:this.NOW.slice(0,10), cashOnly:false });
    },
    rescheduleBooking(code, date, dateLabel){ return this.updateBooking(code, { date, dateLabel }); },

    /* ---- availability (shared demo model) ---- */
    TIME_SLOTS: [
      {id:"am",    label:"Morning · 9:00–1:00"},
      {id:"pm",    label:"Afternoon · 2:00–6:00"},
      {id:"full",  label:"Full day · 9:00–6:00"},
      {id:"sunset",label:"Sunset · 5:00–7:30"}
    ],
    isBlocked(boat, iso){ return !!(boat && boat.blockedDates && boat.blockedDates.indexOf(iso)>-1); },
    dayStatus(iso, boat){                    // 'past' | 'booked' | 'limited' | 'open'
      if(iso < this.NOW.slice(0,10)) return "past";
      if(this.isBlocked(boat, iso)) return "booked";        // owner marked this boat booked on this date
      const d=parseInt(iso.slice(-2),10);
      if(d%13===0) return "booked";
      if([5,6,12,19,20,26].indexOf(d)>-1) return "limited";
      return "open";
    },

    /* ---- reusable reschedule picker (calendar + boats + slots) ---- */
    _reschedCSS(){
      if(document.getElementById("cbrx-css")) return;
      const s=document.createElement("style"); s.id="cbrx-css";
      s.textContent=`
      .cbrx-ov{position:fixed;inset:0;background:rgba(8,22,36,.6);backdrop-filter:blur(4px);z-index:300;display:flex;align-items:flex-start;justify-content:center;padding:26px 14px;overflow-y:auto;font-family:inherit}
      .cbrx-m{background:#fff;width:100%;max-width:660px;border-radius:18px;box-shadow:0 24px 60px rgba(11,41,66,.3);overflow:hidden;color:#0c1b28;animation:cbrx-pop .22s ease}
      @keyframes cbrx-pop{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}
      .cbrx-h{padding:17px 22px;border-bottom:1px solid #e4e9ef;display:flex;justify-content:space-between;align-items:center}
      .cbrx-h h3{margin:0;font-size:18px;color:#0b2942;font-weight:800}
      .cbrx-x{width:36px;height:36px;border:none;background:#f1f4f8;border-radius:10px;font-size:19px;color:#5d7186;cursor:pointer}
      .cbrx-b{padding:20px 22px;max-height:66vh;overflow-y:auto}
      .cbrx-lab{font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;color:#5d7186;margin:0 0 8px}
      .cbrx-boats{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:18px}
      .cbrx-boat{border:1.5px solid #e4e9ef;border-radius:11px;padding:9px 13px;cursor:pointer;font-size:13.5px;font-weight:700;color:#0b2942;background:#fff;text-align:left;line-height:1.25}
      .cbrx-boat.sel{border-color:#1266b8;background:#f3f9ff;box-shadow:0 0 0 3px rgba(18,102,184,.12)}
      .cbrx-boat small{display:block;font-weight:600;color:#5d7186;font-size:11px}
      .cbrx-cols{display:grid;gap:16px}
      @media(min-width:600px){.cbrx-cols{grid-template-columns:1fr 1fr;align-items:start}}
      .cbrx-cal{border:1px solid #e4e9ef;border-radius:13px;padding:14px}
      .cbrx-cal-h{display:flex;justify-content:space-between;align-items:center;margin-bottom:10px}
      .cbrx-cal-h b{font-size:14px;color:#0b2942}
      .cbrx-nav{width:32px;height:32px;border:none;background:#f1f4f8;border-radius:8px;font-size:15px;color:#0b2942;cursor:pointer}
      .cbrx-grid{display:grid;grid-template-columns:repeat(7,1fr);gap:4px}
      .cbrx-dow{text-align:center;font-size:10px;font-weight:700;color:#5d7186;text-transform:uppercase;padding:2px 0}
      .cbrx-day{aspect-ratio:1;border-radius:9px;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:600;background:#f7f9fb;color:#0c1b28;cursor:pointer;border:1.5px solid transparent;position:relative}
      .cbrx-day:hover:not(.dis){border-color:#2e9fe0}
      .cbrx-day.dis{color:#c4ced8;background:#fafbfc;cursor:not-allowed}
      .cbrx-day.sel{background:#1266b8;color:#fff}
      .cbrx-day.lim::after{content:"";position:absolute;bottom:5px;width:4px;height:4px;border-radius:50%;background:#f59300}
      .cbrx-day.sel.lim::after{background:#fff}
      .cbrx-legend{font-size:11px;color:#5d7186;margin-top:10px;display:flex;gap:14px}
      .cbrx-legend i{display:inline-block;width:6px;height:6px;border-radius:50%;background:#f59300;margin-right:4px;font-style:normal}
      .cbrx-slots{display:grid;grid-template-columns:1fr 1fr;gap:8px}
      @media(min-width:600px){.cbrx-slots{grid-template-columns:1fr}}
      .cbrx-slot{border:1.5px solid #e4e9ef;border-radius:10px;padding:11px 12px;text-align:left;background:#fff;cursor:pointer;font-size:13px;font-weight:700;color:#0b2942}
      .cbrx-slot.sel{border-color:#1266b8;background:#f3f9ff}
      .cbrx-slots-empty{font-size:12.5px;color:#5d7186;padding:6px 2px}
      .cbrx-f{padding:15px 22px;border-top:1px solid #e4e9ef;display:flex;justify-content:space-between;gap:10px;align-items:center;flex-wrap:wrap}
      .cbrx-sum{font-size:12.5px;color:#5d7186;font-weight:600}
      .cbrx-btn{font-size:14px;font-weight:700;padding:11px 18px;border-radius:10px;border:none;cursor:pointer}
      .cbrx-btn.line{background:#fff;border:1.5px solid #e4e9ef;color:#0b2942}
      .cbrx-btn.go{background:linear-gradient(180deg,#ffb020,#f59300);color:#3a2500}
      .cbrx-btn:disabled{opacity:.5;cursor:not-allowed}`;
      document.head.appendChild(s);
    },
    reschedulePicker(code, opts){
      opts=opts||{}; this._reschedCSS();
      const self=this, bk=this.getBooking(code)||{};
      const boats=this.getBoats().filter(b=>b.status!=="soldout");
      let selBoat = (bk.boatId && boats.some(b=>b.id===bk.boatId)) ? bk.boatId : (boats[0]&&boats[0].id);
      let selDate=null, selSlot=null, month=new Date(this.NOW.slice(0,7)+"-01T12:00:00");
      const ov=document.createElement("div"); ov.className="cbrx-ov";
      ov.innerHTML=`<div class="cbrx-m">
        <div class="cbrx-h"><h3>Reschedule ${code}</h3><button class="cbrx-x" data-x>×</button></div>
        <div class="cbrx-b">
          <p class="cbrx-lab">Boat</p><div class="cbrx-boats" data-boats></div>
          <div class="cbrx-cols">
            <div>
              <p class="cbrx-lab">New date</p>
              <div class="cbrx-cal">
                <div class="cbrx-cal-h"><button class="cbrx-nav" data-prev>‹</button><b data-ml></b><button class="cbrx-nav" data-next>›</button></div>
                <div class="cbrx-grid" data-grid></div>
                <div class="cbrx-legend"><span><i></i>Limited</span><span>Grey = unavailable</span></div>
              </div>
            </div>
            <div><p class="cbrx-lab">Time slot</p><div class="cbrx-slots" data-slots></div></div>
          </div>
        </div>
        <div class="cbrx-f"><span class="cbrx-sum" data-sum>Select a date &amp; time</span>
          <div style="display:flex;gap:10px"><button class="cbrx-btn line" data-x>Cancel</button><button class="cbrx-btn go" data-go disabled>Confirm reschedule</button></div>
        </div></div>`;
      function curBoat(){ return boats.find(b=>b.id===selBoat); }
      function boatsR(){
        ov.querySelector("[data-boats]").innerHTML=boats.map(b=>`<button class="cbrx-boat ${b.id===selBoat?'sel':''}" data-boat="${b.id}">${b.name}<small>${self.money(b.half)}–${self.money(b.full)}</small></button>`).join("");
        ov.querySelectorAll("[data-boat]").forEach(el=>el.onclick=()=>{
          selBoat=el.dataset.boat;
          if(selDate && self.dayStatus(selDate, curBoat())!=="open" && self.dayStatus(selDate, curBoat())!=="limited"){ selDate=null; selSlot=null; }
          boatsR(); calR(); slotsR(); go();     // availability is per-boat, so recompute the calendar
        });
      }
      function calR(){
        const y=month.getFullYear(), m=month.getMonth(), boat=curBoat();
        ov.querySelector("[data-ml]").textContent=month.toLocaleString("en-US",{month:"long",year:"numeric"});
        const first=new Date(y,m,1).getDay(), days=new Date(y,m+1,0).getDate();
        let h=["Su","Mo","Tu","We","Th","Fr","Sa"].map(d=>`<div class="cbrx-dow">${d}</div>`).join("");
        for(let i=0;i<first;i++) h+="<div></div>";
        for(let d=1;d<=days;d++){
          const iso=`${y}-${String(m+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`, st=self.dayStatus(iso, boat);
          const dis=st==="past"||st==="booked", sel=selDate===iso;
          h+=`<div class="cbrx-day ${dis?'dis':''} ${st==='limited'?'lim':''} ${sel?'sel':''}" ${dis?'':`data-day="${iso}"`}>${d}</div>`;
        }
        ov.querySelector("[data-grid]").innerHTML=h;
        ov.querySelectorAll("[data-day]").forEach(el=>el.onclick=()=>{selDate=el.dataset.day;selSlot=null;calR();slotsR();go();});
      }
      function slotsR(){
        const box=ov.querySelector("[data-slots]");
        box.innerHTML = selDate ? self.TIME_SLOTS.map(s=>`<button class="cbrx-slot ${selSlot===s.id?'sel':''}" data-slot="${s.id}">${s.label}</button>`).join("")
                                : `<div class="cbrx-slots-empty">← pick a date first</div>`;
        box.querySelectorAll("[data-slot]").forEach(el=>el.onclick=()=>{selSlot=el.dataset.slot;slotsR();go();});
      }
      function go(){
        const ok=selBoat&&selDate&&selSlot; ov.querySelector("[data-go]").disabled=!ok;
        ov.querySelector("[data-sum]").textContent = ok
          ? `${boats.find(b=>b.id===selBoat).name} · ${new Date(selDate+"T12:00:00").toLocaleDateString("en-US",{weekday:"short",month:"short",day:"numeric"})} · ${self.TIME_SLOTS.find(s=>s.id===selSlot).label.split(" · ")[0]}`
          : "Select a date & time";
      }
      const close=()=>ov.remove();
      ov.addEventListener("click",e=>{if(e.target===ov)close();});
      ov.querySelectorAll("[data-x]").forEach(el=>el.onclick=close);
      ov.querySelector("[data-prev]").onclick=()=>{month=new Date(month.getFullYear(),month.getMonth()-1,1);calR();};
      ov.querySelector("[data-next]").onclick=()=>{month=new Date(month.getFullYear(),month.getMonth()+1,1);calR();};
      ov.querySelector("[data-go]").onclick=()=>{
        const label=new Date(selDate+"T12:00:00").toLocaleDateString("en-US",{weekday:"short",month:"short",day:"numeric"});
        const slot=self.TIME_SLOTS.find(s=>s.id===selSlot), boat=boats.find(b=>b.id===selBoat);
        self.updateBooking(code,{boatId:boat.id,boatName:boat.name,date:selDate,dateLabel:label,slot:slot.label});
        close(); if(opts.onConfirm) opts.onConfirm({boatName:boat.name,dateLabel:label});
      };
      boatsR(); calR(); slotsR(); go();
      return ov;
    },

    /* ---- helpers ---- */
    money(n){ return "$"+Math.round(n).toLocaleString(); },
    isImage(v){ return typeof v==="string" && (v.startsWith("data:")||v.startsWith("http")||v.startsWith("/")||/\.(jpe?g|png|webp|gif|avif)$/i.test(v)); },
    bg(v){ return this.isImage(v) ? `center/cover no-repeat url('${v}')` : v; },
    slug(s){ return (s||"boat").toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"")+"-"+Math.random().toString(36).slice(2,5); }
  };
})();
