(function(){
  'use strict';

  var GOLD='#D4AF37',GOLD2='#B8960C',INK='#1A1208',INK2='#2C1F0E',CREAM='#F5F1E8',MUTED='#7A6A4F',WHITE='#FFFFFF';

  // ── Gold Calculator state ─────────────────────────────────────────────────
  var calcStep=null; // null | 'type' | 'grams'
  var calcType=null; // '999'|'750'|'585'|'333'

  // Reference gold value per gram — the "real" market baseline our -15% buy-back offer is calculated from
  var GOLD_PER_G={'999':72,'750':52,'585':40,'333':23};

  function fmtEUR(n){
    try{return Math.round(n).toLocaleString('de-DE');}catch(e){return String(Math.round(n));}
  }

  // ── Knowledge Base ────────────────────────────────────────────────────────
  var KB=[
    {keys:['goldankauf','altgold','ankauf','gold verkauf','gold verkaufen','altschmuck','gold einschmelzen'],
     text:'Gerne kaufen wir Ihr Gold zu fairen Tagespreisen!\n\nWir kaufen:\n• Goldschmuck (333er – 999er)\n• Goldmünzen & Barren\n• Zahngold & Zahnkronen\n\n✓ Kostenlose Bewertung\n✓ Sofortauszahlung in Bar\n✓ Faire, transparente Preise\n\nKein Termin nötig — einfach vorbeikommen!'},
    {keys:['trauring','ehering','hochzeitsring','heiraten','hochzeit','ehe'],
     text:'Handgefertigte Eheringe & Trauringe in Gold, Weißgold oder Rosegold — mit echten Diamanten, Labdiamanten oder Zirkonia-Steinen:\n\n• Wählen Sie aus hunderten Designs\n• Oder lassen Sie Ihren Traumring individuell anfertigen\n\nPersönliche Beratung in Hagen seit 25 Jahren!'},
    {keys:['verlobung','verlobungsring','antrag','diamant','solitär','heiratsantrag'],
     text:'Der perfekte Verlobungsring für den schönsten Moment:\n\n• Ringe mit echten Diamanten\n• Lab-Diamanten (faire Alternative)\n• Zirkonia-Besatz\n• Individuelle Anfertigung\n\nGerne beraten wir Sie diskret und ohne Zeitdruck.'},
    {keys:['öffnungszeit','geöffnet','öffnen','uhrzeit','wann haben','stunden','zeiten','heute offen','offen'],
     text:'Unsere Öffnungszeiten:\n\nMontag – Samstag: 10:00 – 19:00 Uhr\nSonntag: Geschlossen\n\nKein Termin nötig — kommen Sie einfach vorbei!'},
    {keys:['adresse','standort','wo sind','hagen','elberfelder','finden sie','anfahrt','lage','ort'],
     text:'Sie finden uns hier:\n\nElberfelder Str. 22\n58095 Hagen, NRW\n\nGut erreichbar mit Bus & Bahn.\nParkplätze in der Nähe vorhanden.'},
    {keys:['telefon','anrufen','tel','telefonnummer','telefonisch','rufen'],
     text:'Rufen Sie uns gerne an:\n\n☎️ 02331 / 5936841\n\nErreichbar:\nMontag – Samstag: 10:00 – 19:00 Uhr'},
    {keys:['whatsapp','nachricht schreiben','chat','messenger','sms'],
     text:'Schreiben Sie uns auf WhatsApp:\n\n📲 0174 / 9155488\n\nWir antworten schnell während der Öffnungszeiten — gerne auch mit Fotos Ihres Schmucks!'},
    {keys:['preis','kosten','wieviel','wie viel','budget','günstig','teuer','wert','bezahlen'],
     text:'Unsere Preise sind transparent und fair:\n\n• Trauringe in verschiedenen Preisklassen\n• Goldankauf nach aktuellem Tagespreis\n• Kostenlose, unverbindliche Bewertung\n\nKommen Sie vorbei — wir beraten Sie ehrlich und ohne Druck.'},
    {keys:['schmuck','kette','halskette','armband','ohrring','anhänger','accessoire'],
     text:'Unser Schmucksortiment:\n\n• Goldketten & Halsketten\n• Armbänder & Armreifen\n• Ohrringe & Ohrstecker\n• Anhänger & Charms\n\nAlles in hochwertiger Goldqualität — schauen Sie gerne bei uns rein!'},
    {keys:['erfahrung','jahre','geschichte','familie','tradition','über euch','über sie'],
     text:'Elit Juwelier steht seit 2001 für Qualität und Vertrauen in Hagen — 25 Jahre Erfahrung in Gold & Schmuck.\n\nUnsere Stärken:\n• Langjährige Kundenbeziehungen\n• Persönliche, familiäre Atmosphäre\n• Ehrliche und faire Beratung'}
  ];

  var GREET='Herzlich willkommen bei Elit Juwelier!\n\nIch beantworte gerne Ihre Fragen zu unserem Gold-Ankauf, Trauringen & Verlobungsringen sowie unserem Schmucksortiment. Wie kann ich Ihnen helfen?';
  var FALLBACK='Das beantworte ich Ihnen gerne persönlich!\n\n📍 Elberfelder Str. 22, 58095 Hagen\n☎️ 02331 / 5936841\n\nÖffnungszeiten:\nMo–Sa 10:00–19:00 Uhr\nKein Termin nötig!';

  // ── Chip sets ─────────────────────────────────────────────────────────────
  var CHIPS_DEFAULT=[
    {l:'Gold Rechner',m:'__CALC__'},
    {l:'Goldankauf',m:'Was kaufen Sie für Gold an?'},
    {l:'Trauringe',m:'Welche Trauringe haben Sie?'},
    {l:'Öffnungszeiten',m:'Wann haben Sie geöffnet?'},
    {l:'Adresse & Lage',m:'Wo finden Sie sich?'}
  ];

  var CHIPS_TYPE=[
    {l:'999er · 24 Karat',m:'__TYPE_999__'},
    {l:'750er · 18 Karat',m:'__TYPE_750__'},
    {l:'585er · 14 Karat',m:'__TYPE_585__'},
    {l:'333er · 8 Karat',m:'__TYPE_333__'},
    {l:'Abbrechen',m:'__CANCEL__'}
  ];

  var CHIPS_CANCEL=[
    {l:'Abbrechen',m:'__CANCEL__'}
  ];

  // ── Response logic ────────────────────────────────────────────────────────
  function respond(msg){
    // Gold Calculator flow
    if(msg==='__CALC__'){
      calcStep='type';
      later(function(){renderChips(CHIPS_TYPE);});
      return 'Ich helfe Ihnen beim Schätzen des Goldwertes!\n\nWelche Legierung hat Ihr Gold? Bitte wählen Sie:';
    }
    if(msg==='__CANCEL__'){
      calcStep=null;calcType=null;
      later(function(){renderChips(CHIPS_DEFAULT);});
      return 'Kein Problem! Wie kann ich Ihnen sonst helfen?';
    }
    if(/^__TYPE_(999|750|585|333)__$/.test(msg)){
      var t=msg.replace('__TYPE_','').replace('__','');
      calcType=t;calcStep='grams';
      later(function(){renderChips(CHIPS_CANCEL);});
      var names={'999':'999er Feingold (24 Karat)','750':'750er Gold (18 Karat)','585':'585er Gold (14 Karat)','333':'333er Gold (8 Karat)'};
      return 'Gewählt: '+names[t]+'.\n\nWie viele Gramm haben Sie?\nBitte Gewicht eingeben (z.B.: 12.5 oder 8):';
    }

    // Grams input during calculator
    if(calcStep==='grams'){
      var raw=(msg.replace(',','.')).match(/\d+(\.\d+)?/);
      if(!raw){return 'Bitte geben Sie ein gültiges Gewicht ein, z.B.: 12.5';}
      var g=parseFloat(raw[0]);
      if(g<=0||g>9999){return 'Bitte ein realistisches Gewicht eingeben (z.B.: 15).';}
      var pricePg=GOLD_PER_G[calcType]||50;
      var realPrice=g*pricePg;
      var offerPrice=Math.round(realPrice*0.85);
      var display=g.toString().replace('.',',');
      var label={'999':'999er Gold','750':'750er Gold','585':'585er Gold','333':'333er Gold'}[calcType];
      calcStep=null;calcType=null;
      later(function(){renderChips(CHIPS_DEFAULT);});
      return 'Schätzwert für '+display+' g '+label+':\n\n💰 Unser Ankaufspreis: ca. '+fmtEUR(offerPrice)+' €\n\nHinweis: Dies ist ein Richtwert. Den verbindlichen Ankaufspreis bestimmen wir kostenlos und transparent in unserem Geschäft.\n\nWenn dich unser Ankaufspreis interessiert, besuche uns in unserem Geschäft in Hagen - ohne Termin!';
    }

    // Normal Q&A knowledge base
    var lc=msg.toLowerCase();
    for(var i=0;i<KB.length;i++){
      var entry=KB[i];
      for(var j=0;j<entry.keys.length;j++){
        if(lc.indexOf(entry.keys[j])!==-1)return entry.text;
      }
    }
    return FALLBACK;
  }

  function later(fn){setTimeout(fn,0);}

  function fmt(text){
    return text.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/\n/g,'<br>');
  }

  // ── CSS ───────────────────────────────────────────────────────────────────
  var css=[
    '#ej-fab{position:fixed;bottom:28px;right:28px;z-index:9000;width:60px;height:60px;border-radius:50%;background:#FEFCF8;border:2.5px solid '+GOLD+';display:flex;align-items:center;justify-content:center;cursor:pointer;box-shadow:0 4px 24px rgba(212,175,55,0.40),0 2px 8px rgba(26,18,8,0.18);transition:transform 0.2s,box-shadow 0.2s;padding:6px;}',
    '#ej-fab:hover{transform:scale(1.08);box-shadow:0 8px 32px rgba(212,175,55,0.60),0 4px 12px rgba(26,18,8,0.20);}',
    '#ej-fab img{width:100%;height:100%;object-fit:contain;display:block;}',
    '#ej-panel{position:fixed;bottom:100px;right:28px;z-index:9000;width:360px;display:flex;flex-direction:column;border-radius:8px;box-shadow:0 16px 64px rgba(26,18,8,0.28);overflow:hidden;height:0;opacity:0;pointer-events:none;transition:height 0.35s cubic-bezier(0.34,1.56,0.64,1),opacity 0.22s;}',
    '#ej-panel.ej-open{height:560px;opacity:1;pointer-events:all;}',
    '#ej-head{background:'+INK+';padding:18px 20px 14px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid rgba(212,175,55,0.18);flex-shrink:0;}',
    '#ej-head-left{display:flex;align-items:center;gap:12px;}',
    '.ej-avatar{width:36px;height:36px;border-radius:50%;background:#FEFCF8;border:1.5px solid rgba(212,175,55,0.6);display:flex;align-items:center;justify-content:center;flex-shrink:0;padding:4px;overflow:hidden;}',
    '.ej-head-name{font-family:"Playfair Display",Georgia,serif;font-size:15px;font-weight:700;color:#fff;line-height:1.2;}',
    '.ej-head-sub{font-size:10px;color:rgba(255,255,255,0.55);margin-top:2px;letter-spacing:0.06em;}',
    '#ej-close{background:none;border:none;cursor:pointer;color:rgba(255,255,255,0.50);font-size:18px;line-height:1;padding:4px;transition:color 0.2s;font-family:sans-serif;}',
    '#ej-close:hover{color:#fff;}',
    '#ej-msgs{flex:1;overflow-y:auto;padding:18px 16px;background:'+CREAM+';display:flex;flex-direction:column;gap:12px;}',
    '#ej-msgs::-webkit-scrollbar{width:3px;}',
    '#ej-msgs::-webkit-scrollbar-thumb{background:rgba(212,175,55,0.35);border-radius:2px;}',
    '.ej-msg{max-width:84%;line-height:1.58;font-size:13.5px;font-family:"Inter","Helvetica Neue",sans-serif;animation:ej-up 0.22s ease;}',
    '.ej-bot{align-self:flex-start;background:'+WHITE+';border:1px solid rgba(212,175,55,0.22);border-radius:2px 12px 12px 2px;padding:11px 14px;color:'+INK2+';box-shadow:0 2px 8px rgba(26,18,8,0.06);}',
    '.ej-user{align-self:flex-end;background:'+INK+';color:#fff;border-radius:12px 2px 2px 12px;padding:11px 14px;}',
    '#ej-chips{padding:10px 12px;background:'+CREAM+';border-top:1px solid rgba(212,175,55,0.18);display:flex;gap:6px;flex-wrap:wrap;flex-shrink:0;min-height:44px;}',
    '.ej-chip{background:'+WHITE+';border:1.5px solid rgba(212,175,55,0.38);color:'+MUTED+';font-family:"Inter","Helvetica Neue",sans-serif;font-size:11px;font-weight:700;letter-spacing:0.05em;padding:5px 11px;border-radius:20px;cursor:pointer;white-space:nowrap;transition:background 0.18s,border-color 0.18s,color 0.18s;}',
    '.ej-chip:hover{background:'+GOLD+';border-color:'+GOLD+';color:'+INK+';}',
    '.ej-chip-gold{background:linear-gradient(135deg,#F5D960,'+GOLD+');border-color:'+GOLD2+' !important;color:'+INK+' !important;}',
    '.ej-chip-gold:hover{background:linear-gradient(135deg,'+GOLD+','+GOLD2+') !important;}',
    '.ej-chip-cancel{border-color:rgba(160,40,40,0.3) !important;color:#a03030 !important;}',
    '.ej-chip-cancel:hover{background:#fdf0f0 !important;border-color:rgba(160,40,40,0.55) !important;color:#7a1515 !important;}',
    '#ej-foot{display:flex;gap:8px;padding:10px 12px;background:'+CREAM+';border-top:1px solid rgba(212,175,55,0.18);flex-shrink:0;}',
    '#ej-input{flex:1;background:'+WHITE+';border:1.5px solid rgba(212,175,55,0.32);border-radius:3px;padding:9px 13px;font-family:"Inter","Helvetica Neue",sans-serif;font-size:13px;color:'+INK+';outline:none;transition:border-color 0.2s;}',
    '#ej-input:focus{border-color:'+GOLD+';}',
    '#ej-send{background:'+GOLD+';border:none;color:'+INK+';padding:9px 16px;border-radius:3px;cursor:pointer;font-family:"Inter","Helvetica Neue",sans-serif;font-size:12px;font-weight:700;letter-spacing:0.08em;transition:background 0.18s;}',
    '#ej-send:hover{background:'+GOLD2+';}',
    '@keyframes ej-up{from{transform:translateY(7px);opacity:0;}to{transform:translateY(0);opacity:1;}}',
    '@media(max-width:480px){#ej-panel{width:calc(100vw - 20px);right:10px;bottom:90px;}#ej-panel.ej-open{height:520px;}}',
    '#ej-notify{position:fixed;bottom:100px;right:20px;z-index:8999;max-width:248px;background:'+WHITE+';border:1.5px solid rgba(212,175,55,0.40);border-radius:14px 14px 2px 14px;box-shadow:0 12px 40px rgba(26,18,8,0.22),0 2px 8px rgba(212,175,55,0.15);padding:14px 30px 14px 14px;cursor:pointer;opacity:0;transform:translateY(12px) scale(0.94);pointer-events:none;transition:transform 0.32s cubic-bezier(0.34,1.56,0.64,1),opacity 0.25s;}',
    '#ej-notify.ej-notify-visible{opacity:1;transform:translateY(0) scale(1);pointer-events:all;}',
    '#ej-notify::after{content:"";position:absolute;bottom:-7px;right:26px;width:13px;height:13px;background:'+WHITE+';border-right:1.5px solid rgba(212,175,55,0.40);border-bottom:1.5px solid rgba(212,175,55,0.40);transform:rotate(45deg);}',
    '#ej-notify-close{position:absolute;top:6px;right:6px;width:20px;height:20px;border-radius:50%;background:none;border:none;color:'+MUTED+';font-size:11px;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:background 0.18s,color 0.18s;font-family:sans-serif;}',
    '#ej-notify-close:hover{background:rgba(212,175,55,0.15);color:'+INK+';}',
    '#ej-notify-body{display:flex;align-items:flex-start;gap:10px;}',
    '#ej-notify-icon{flex-shrink:0;margin-top:1px;display:block;filter:drop-shadow(0 1px 1.5px rgba(26,18,8,0.30));}',
    '#ej-notify-text{font-family:"Inter","Helvetica Neue",sans-serif;font-size:12.5px;line-height:1.5;color:'+INK2+';font-weight:600;}',
    '@media(max-width:480px){#ej-notify{right:10px;bottom:96px;max-width:calc(100vw - 90px);}}'
  ].join('');

  var st=document.createElement('style');
  st.textContent=css;
  document.head.appendChild(st);

  // ── Logo path resolution ──────────────────────────────────────────────────
  var logoPath=(function(){
    var s=document.currentScript;
    return s?s.src.replace(/chatbot\.js.*/,'')+'../public/images/elit-diamond.png':'public/images/elit-diamond.png';
  })();
  var fabImg='<img src="'+logoPath+'" alt="Elit Juwelier" style="width:100%;height:100%;object-fit:contain;display:block;">';
  var avatarImg='<img src="'+logoPath+'" alt="Elit Juwelier" style="width:26px;height:26px;object-fit:contain;display:block;">';

  // ── DOM ───────────────────────────────────────────────────────────────────
  var wrap=document.createElement('div');
  wrap.innerHTML=
    '<div id="ej-notify" role="button" tabindex="0" aria-label="Gold-Rechner öffnen">'+
      '<button id="ej-notify-close" aria-label="Hinweis schließen">&#x2715;</button>'+
      '<div id="ej-notify-body">'+
        '<svg id="ej-notify-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="18" height="18" aria-hidden="true" focusable="false">'+
          '<defs>'+
            '<linearGradient id="ejGemGrad" x1="4" y1="4" x2="28" y2="28" gradientUnits="userSpaceOnUse">'+
              '<stop offset="0%" stop-color="#FCEBA8"/><stop offset="45%" stop-color="'+GOLD+'"/><stop offset="100%" stop-color="#8A6D1F"/>'+
            '</linearGradient>'+
            '<linearGradient id="ejGemFacet" x1="16" y1="4" x2="16" y2="28" gradientUnits="userSpaceOnUse">'+
              '<stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.6"/><stop offset="100%" stop-color="#FFFFFF" stop-opacity="0"/>'+
            '</linearGradient>'+
          '</defs>'+
          '<path d="M8 4h16l5.5 8L16 29 2.5 12z" fill="url(#ejGemGrad)" stroke="#6B5416" stroke-width="1.1" stroke-linejoin="round"/>'+
          '<path d="M16 12l-4-8h8z" fill="rgba(255,255,255,0.24)"/>'+
          '<path d="M2.5 12h27M12 4l4 8 4-8" fill="none" stroke="url(#ejGemFacet)" stroke-width="1" stroke-linejoin="round" stroke-linecap="round"/>'+
          '<path d="M9 6.4l1.1 2.2 2.2.4-1.6 1.6.4 2.3-2.1-1.1-2.1 1.1.4-2.3-1.6-1.6 2.2-.4z" fill="#FFFFFF"/>'+
        '</svg>'+
        '<span id="ej-notify-text">Wenn du dein Gold berechnen möchtest, kannst du es hier tun.</span>'+
      '</div>'+
    '</div>'+
    '<div id="ej-fab" role="button" aria-label="Chat öffnen" title="Chat mit Elit Juwelier">'+fabImg+'</div>'+
    '<div id="ej-panel" role="dialog" aria-modal="true" aria-label="Elit Juwelier Chat">'+
      '<div id="ej-head">'+
        '<div id="ej-head-left">'+
          '<div class="ej-avatar">'+avatarImg+'</div>'+
          '<div>'+
            '<div class="ej-head-name">Elit Juwelier</div>'+
            '<div class="ej-head-sub">Virtueller Assistent · Hagen</div>'+
          '</div>'+
        '</div>'+
        '<button id="ej-close" aria-label="Chat schließen">&#x2715;</button>'+
      '</div>'+
      '<div id="ej-msgs" role="log" aria-live="polite"></div>'+
      '<div id="ej-chips"></div>'+
      '<div id="ej-foot">'+
        '<input id="ej-input" type="text" placeholder="Ihre Frage..." maxlength="300" autocomplete="off" aria-label="Nachricht eingeben">'+
        '<button id="ej-send">Senden</button>'+
      '</div>'+
    '</div>';
  document.body.appendChild(wrap);

  var fab=document.getElementById('ej-fab');
  var panel=document.getElementById('ej-panel');
  var msgs=document.getElementById('ej-msgs');
  var input=document.getElementById('ej-input');
  var sendBtn=document.getElementById('ej-send');
  var closeBtn=document.getElementById('ej-close');
  var notify=document.getElementById('ej-notify');
  var notifyClose=document.getElementById('ej-notify-close');
  var isOpen=false;
  var greeted=false;

  // ── Proactive Gold-Rechner notification bubble ──────────────────────────
  // Appears once per page load and stays put — no pulsing, no auto-hide.
  // Dismissed only by the visitor (close button, clicking it, or opening chat);
  // a fresh page load always shows it again.
  var notifyDismissed=false;
  function notifyDismiss(){
    notifyDismissed=true;
    notify.classList.remove('ej-notify-visible');
  }
  notify.addEventListener('click',function(){
    notifyDismiss();
    if(!isOpen)open();
    setTimeout(function(){send('__CALC__','Gold Rechner');},isOpen?0:380);
  });
  notify.addEventListener('keydown',function(e){
    if(e.key==='Enter'||e.key===' '){e.preventDefault();notify.click();}
  });
  notifyClose.addEventListener('click',function(e){
    e.stopPropagation();
    notifyDismiss();
  });
  setTimeout(function(){
    if(!isOpen&&!notifyDismissed)notify.classList.add('ej-notify-visible');
  },1800);

  // ── Chips renderer ────────────────────────────────────────────────────────
  function renderChips(arr){
    var el=document.getElementById('ej-chips');
    if(!el)return;
    el.innerHTML=arr.map(function(c){
      var cls='ej-chip';
      if(c.m==='__CALC__')cls+=' ej-chip-gold';
      if(c.m==='__CANCEL__')cls+=' ej-chip-cancel';
      return '<button class="'+cls+'">'+c.l+'</button>';
    }).join('');
    el.querySelectorAll('.ej-chip').forEach(function(btn,i){
      btn.addEventListener('click',function(){
        if(!isOpen)open();
        setTimeout(function(){send(arr[i].m,arr[i].l);},isOpen?0:380);
      });
    });
  }

  // ── Message helpers ───────────────────────────────────────────────────────
  function addMsg(text,who){
    var d=document.createElement('div');
    d.className='ej-msg ej-'+who;
    d.innerHTML=fmt(text);
    msgs.appendChild(d);
    msgs.scrollTop=msgs.scrollHeight;
  }

  function send(text,displayLabel){
    text=(text||'').trim();
    if(!text)return;
    // Show friendly label for chip commands, otherwise show raw input
    var shown=displayLabel||text;
    if(shown.indexOf('__')===0)shown=text;
    addMsg(shown,'user');
    input.value='';
    setTimeout(function(){addMsg(respond(text),'bot');},420);
  }

  // ── Open / Close ──────────────────────────────────────────────────────────
  function open(){
    panel.classList.add('ej-open');
    fab.setAttribute('aria-label','Chat schließen');
    isOpen=true;
    if(!greeted){addMsg(GREET,'bot');greeted=true;}
    setTimeout(function(){input.focus();},360);
  }

  function close(){
    panel.classList.remove('ej-open');
    fab.setAttribute('aria-label','Chat öffnen');
    isOpen=false;
  }

  // ── Event listeners ───────────────────────────────────────────────────────
  fab.addEventListener('click',function(){notifyDismiss();isOpen?close():open();});
  closeBtn.addEventListener('click',close);
  sendBtn.addEventListener('click',function(){send(input.value);});
  input.addEventListener('keydown',function(e){if(e.key==='Enter')send(input.value);});

  // Init default chips
  renderChips(CHIPS_DEFAULT);

})();
