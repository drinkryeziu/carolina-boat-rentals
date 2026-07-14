/* ============================================================
   Carolina Boat Rentals — shared prototype data layer
   Uses localStorage so the owner dashboard and the public
   site read/write the same fleet + bookings. Prototype only:
   no real backend, and the login is a demo gate, not security.
   ============================================================ */
(function(){
  const BOATS_KEY = "cbr_boats_v2";
  const BOOK_KEY  = "cbr_bookings_v2";

  const DEFAULT_BOATS = [
    {
      id:"tritoon", name:"Luxury Tritoon",
      sub:"Up to 12 · waterslide · Bluetooth",
      desc:"Our flagship party boat — plush seating, a swim ladder, and a built-in slide. Perfect for bachelorettes and big groups.",
      capacity:12, half:499, full:799,
      tags:["👥 Up to 12","⚡ 250 HP","🔊 Bluetooth audio","🪜 Waterslide"],
      image:"linear-gradient(135deg,#2e9fe0,#0f3a5f)",
      status:"limited", statusText:"3 left this week"
    },
    {
      id:"pontoon", name:"Classic Pontoon",
      sub:"Up to 10 · shade top · cooler",
      desc:"Comfortable, easy to drive, and roomy — the go-to for families and relaxed lake days.",
      capacity:10, half:349, full:579,
      tags:["👥 Up to 10","☀️ Shade top","🧊 Cooler included","🔊 Speakers"],
      image:"linear-gradient(135deg,#38c1c9,#123a5c)",
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
    {code:"CBR-8K2QP", name:"Megan Kessler",  phone:"(704) 555-0132", email:"megan.k@email.com",  boatId:"tritoon",   boatName:"Luxury Tritoon",    date:"2026-07-05", dateLabel:"Sat, Jul 5",  slot:"Full day · 9:00–6:00",   subtotal:838, deposit:251, status:"completed", createdAt:"2026-06-28"},
    {code:"CBR-4M9RT", name:"David Rowe",      phone:"(980) 555-0148", email:"drowe@email.com",     boatId:"pontoon",   boatName:"Classic Pontoon",   date:"2026-07-11", dateLabel:"Sat, Jul 11", slot:"Afternoon · 2:00–6:00",  subtotal:483, deposit:145, status:"completed", createdAt:"2026-07-02"},
    {code:"CBR-1XZ7C", name:"Ashley Lin",      phone:"(704) 555-0175", email:"ashley.lin@email.com",boatId:"tour",      boatName:"Guided Sunset Tour",date:"2026-07-12", dateLabel:"Sun, Jul 12", slot:"Sunset · 5:00–7:30",     subtotal:389, deposit:117, status:"completed", createdAt:"2026-07-04"},
    {code:"CBR-6P3WD", name:"Carlos Mendez",   phone:"(704) 555-0190", email:"cmendez@email.com",   boatId:"waverunner",boatName:"Waverunners",       date:"2026-07-18", dateLabel:"Sat, Jul 18", slot:"Morning · 9:00–1:00",    subtotal:338, deposit:101, status:"confirmed", createdAt:"2026-07-10"},
    {code:"CBR-9T5HG", name:"Priya Nair",      phone:"(980) 555-0166", email:"priya.n@email.com",   boatId:"tritoon",   boatName:"Luxury Tritoon",    date:"2026-07-19", dateLabel:"Sun, Jul 19", slot:"Full day · 9:00–6:00",   subtotal:837, deposit:251, status:"confirmed", createdAt:"2026-07-11"},
    {code:"CBR-2B8KL", name:"Jordan Blake",    phone:"(704) 555-0123", email:"jblake@email.com",    boatId:"pontoon",   boatName:"Classic Pontoon",   date:"2026-07-25", dateLabel:"Sat, Jul 25", slot:"Full day · 9:00–6:00",   subtotal:614, deposit:184, status:"confirmed", createdAt:"2026-07-13"}
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
    resetAll(){ localStorage.removeItem(BOATS_KEY); localStorage.removeItem(BOOK_KEY); },

    /* ---- helpers ---- */
    money(n){ return "$"+Math.round(n).toLocaleString(); },
    isImage(v){ return typeof v==="string" && (v.startsWith("data:")||v.startsWith("http")||v.startsWith("/")); },
    bg(v){ return this.isImage(v) ? `center/cover no-repeat url("${v}")` : v; },
    slug(s){ return (s||"boat").toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"")+"-"+Math.random().toString(36).slice(2,5); }
  };
})();
