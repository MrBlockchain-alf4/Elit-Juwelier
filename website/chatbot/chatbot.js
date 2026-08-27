(function(){
  'use strict';

  var GOLD='#D4AF37',GOLD2='#B8960C',INK='#1A1208',INK2='#2C1F0E',CREAM='#F5F1E8',MUTED='#7A6A4F',WHITE='#FFFFFF';

  var KB=[
    {keys:['goldankauf','altgold','ankauf','gold verkauf','gold verkaufen','altschmuck','gold kaufen'],
     text:'Gerne kaufen wir Ihr Gold zu fairen Tagespreisen!\n\nWir kaufen:\n• Goldschmuck (333er – 999er)\n• Goldmünzen & Barren\n• Zahngold & Zahnkronen\n\n✓ Kostenlose Bewertung\n✓ Sofortauszahlung in Bar\n✓ Faire, transparente Preise\n\nKein Termin nötig — einfach vorbeikommen!'},
    {keys:['trauring','ehering','hochzeitsring','heiraten','hochzeit','ehe'],
     text:'Unsere Trauringe & Eheringe in Gelbgold, Weißgold, Rosegold oder Platin:\n\n• Hunderte Designs zur Auswahl\n• Individuelle Anfertigung nach Maß\n• Gravur & Personalisierung\n• Für jedes Budget\n\nWir begleiten Sie gerne auf dem Weg zum perfekten Ring!'},
    {keys:['verlobung','verlobungsring','antrag','diamant','solitär','heiratsantrag'],
     text:'Der perfekte Verlobungsring für den schönsten Moment:\n\n• Ringe mit echten Diamanten\n• Lab-Diamanten (faire Alternative)\n• Zirkonia-Besatz\n• Individuelle Anfertigung\n\nGerne beraten wir Sie diskret und ohne Zeitdruck.'},
    {keys:['öffnungszeit','geöffnet','öffnen','uhrzeit','wann','stunden','zeiten','heute offen'],
     text:'Unsere Öffnungszeiten:\n\nMontag – Freitag:  10:00 – 18:30 Uhr\nSamstag:  10:00 – 14:00 Uhr\nSonntag:  Geschlossen\n\nKein Termin nötig — einfach vorbeikommen!'},
    {keys:['adresse','standort','wo','hagen','elberfelder','finden','anfahrt','lage','ort'],
     text:'Sie finden uns hier:\n\nElberfelder Straße 1\n58095 Hagen, NRW\n\nGut erreichbar mit Bus & Bahn.\nParkplätze sind in der Nähe vorhanden.'},
    {keys:['telefon','anrufen','tel','nummer','telefonisch','rufen'],
     text:'Rufen Sie uns gerne an:\n\n+49 (0)2331 987 654\n\nErreichbar:\nMontag – Freitag: 10:00 – 18:30 Uhr\nSamstag: 10:00 – 14:00 Uhr'},
    {keys:['whatsapp','nachricht schreiben','chat','sms','messenger'],
     text:'Schreiben Sie uns auf WhatsApp:\n\n+49 (0)151 234 567 89\n\nWir antworten schnell während der Öffnungszeiten — gerne auch mit Fotos Ihres Schmucks!'},
    {keys:['preis','kosten','wieviel','wie viel','budget','günstig','teuer','wert','bezahlen'],
     text:'Unsere Preise sind transparent und fair:\n\n• Trauringe je nach Material & Design\n• Goldankauf nach aktuellem Tagespreis\n• Kostenlose, unverbindliche Bewertung\n\nKommen Sie vorbei — wir beraten Sie ehrlich und ohne Druck.'},
    {keys:['erfahrung','seit','jahre','1999','geschichte','famili','gründung','tradition'],
     text:'Elit Juwelier steht seit 1999 für Qualität und Vertrauen in Hagen.\n\n25 Jahre Erfahrung bedeuten:\n• Tiefes Fachwissen in Gold & Schmuck\n• Langjährige Kundenbeziehungen\n• Persönliche, familiäre Atmosphäre\n\nVom kleinen Familienbetrieb zum etablierten Fachgeschäft — immer mit Herzblut.'},
    {keys:['schmuck','kette','halskette','armband','ohrring','accessoir','anhänger'],
     text:'Unser Schmucksortiment:\n\n• Goldketten & Halsketten\n• Armbänder & Armreifen\n• Ohrringe & Ohrstecker\n• Anhänger & Charms\n\nAlles in hochwertiger Goldqualität — schauen Sie gerne bei uns rein!'},
    {keys:['reparatur','reparieren','umarbeit','gravur','größe ändern','resize'],
     text:'Wir reparieren und bearbeiten auch Ihren Schmuck:\n\n• Ringgröße anpassen\n• Schmuckreparaturen aller Art\n• Gravuren & Personalisierung\n• Umarbeitung von altem Schmuck\n\nBringen Sie Ihr Stück einfach vorbei!'}
  ];

  var GREET='Herzlich willkommen bei Elit Juwelier! 💛\n\nIch helfe Ihnen gerne weiter. Was suchen Sie?';
  var FALLBACK='Das beantworte ich Ihnen gerne persönlich!\n\n📍 Elberfelder Straße 1, 58095 Hagen\n📞 +49 (0)2331 987 654\n\nÖffnungszeiten:\nMo–Fr 10–18:30 Uhr | Sa 10–14 Uhr';

  var CHIPS=[
    {l:'Goldankauf',m:'Was kaufen Sie für Gold an?'},
    {l:'Trauringe',m:'Welche Trauringe haben Sie?'},
    {l:'Verlobungsring',m:'Ich suche einen Verlobungsring'},
    {l:'Öffnungszeiten',m:'Wann haben Sie geöffnet?'},
    {l:'Adresse & Lage',m:'Wo finden Sie sich?'}
  ];

  function respond(msg){
    var lc=msg.toLowerCase();
    for(var i=0;i<KB.length;i++){
      var entry=KB[i];
      for(var j=0;j<entry.keys.length;j++){
        if(lc.indexOf(entry.keys[j])!==-1) return entry.text;
      }
    }
    return FALLBACK;
  }

  function fmt(text){
    return text.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/\n/g,'<br>');
  }

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
    '#ej-chips{padding:10px 12px;background:'+CREAM+';border-top:1px solid rgba(212,175,55,0.18);display:flex;gap:6px;flex-wrap:wrap;flex-shrink:0;}',
    '.ej-chip{background:'+WHITE+';border:1.5px solid rgba(212,175,55,0.38);color:'+MUTED+';font-family:"Inter","Helvetica Neue",sans-serif;font-size:11px;font-weight:700;letter-spacing:0.05em;padding:5px 11px;border-radius:20px;cursor:pointer;white-space:nowrap;transition:background 0.18s,border-color 0.18s,color 0.18s;}',
    '.ej-chip:hover{background:'+GOLD+';border-color:'+GOLD+';color:'+INK+';}',
    '#ej-foot{display:flex;gap:8px;padding:10px 12px;background:'+CREAM+';border-top:1px solid rgba(212,175,55,0.18);flex-shrink:0;}',
    '#ej-input{flex:1;background:'+WHITE+';border:1.5px solid rgba(212,175,55,0.32);border-radius:3px;padding:9px 13px;font-family:"Inter","Helvetica Neue",sans-serif;font-size:13px;color:'+INK+';outline:none;transition:border-color 0.2s;}',
    '#ej-input:focus{border-color:'+GOLD+';}',
    '#ej-send{background:'+GOLD+';border:none;color:'+INK+';padding:9px 16px;border-radius:3px;cursor:pointer;font-family:"Inter","Helvetica Neue",sans-serif;font-size:12px;font-weight:700;letter-spacing:0.08em;transition:background 0.18s;}',
    '#ej-send:hover{background:'+GOLD2+';}',
    '@keyframes ej-up{from{transform:translateY(7px);opacity:0;}to{transform:translateY(0);opacity:1;}}',
    '@media(max-width:480px){#ej-panel{width:calc(100vw - 20px);right:10px;bottom:90px;}#ej-panel.ej-open{height:520px;}}'
  ].join('');

  var st=document.createElement('style');
  st.textContent=css;
  document.head.appendChild(st);

  var logoPath=(function(){var s=document.currentScript;return s?s.src.replace(/chatbot\.js.*/,'')+'../public/images/elit-diamond.png':'public/images/elit-diamond.png';})();
  var diamondSvg='<img src="'+logoPath+'" alt="Elit Juwelier" style="width:100%;height:100%;object-fit:contain;display:block;">';
  var chatSvg='<img src="'+logoPath+'" alt="Elit Juwelier" style="width:26px;height:26px;object-fit:contain;display:block;">';

  var chips=CHIPS.map(function(c){return '<button class="ej-chip">'+c.l+'</button>';}).join('');

  var wrap=document.createElement('div');
  wrap.innerHTML=
    '<div id="ej-fab" role="button" aria-label="Chat öffnen" title="Chat mit Elit Juwelier">'+diamondSvg+'</div>'+
    '<div id="ej-panel" role="dialog" aria-label="Elit Juwelier Chat">'+
      '<div id="ej-head">'+
        '<div id="ej-head-left">'+
          '<div class="ej-avatar">'+chatSvg+'</div>'+
          '<div>'+
            '<div class="ej-head-name">Elit Juwelier</div>'+
            '<div class="ej-head-sub">Virtueller Assistent · Hagen</div>'+
          '</div>'+
        '</div>'+
        '<button id="ej-close" aria-label="Schließen">&#x2715;</button>'+
      '</div>'+
      '<div id="ej-msgs"></div>'+
      '<div id="ej-chips">'+chips+'</div>'+
      '<div id="ej-foot">'+
        '<input id="ej-input" type="text" placeholder="Ihre Frage..." maxlength="200" autocomplete="off">'+
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
  var chipBtns=document.querySelectorAll('.ej-chip');
  var isOpen=false;
  var greeted=false;

  function addMsg(text,who){
    var d=document.createElement('div');
    d.className='ej-msg ej-'+who;
    d.innerHTML=fmt(text);
    msgs.appendChild(d);
    msgs.scrollTop=msgs.scrollHeight;
  }

  function send(text){
    text=(text||'').trim();
    if(!text) return;
    addMsg(text,'user');
    input.value='';
    setTimeout(function(){addMsg(respond(text),'bot');},400);
  }

  function open(){
    panel.classList.add('ej-open');
    fab.setAttribute('aria-label','Chat schließen');
    isOpen=true;
    if(!greeted){addMsg(GREET,'bot');greeted=true;}
    setTimeout(function(){input.focus();},350);
  }

  function close(){
    panel.classList.remove('ej-open');
    fab.setAttribute('aria-label','Chat öffnen');
    isOpen=false;
  }

  fab.addEventListener('click',function(){isOpen?close():open();});
  closeBtn.addEventListener('click',close);
  sendBtn.addEventListener('click',function(){send(input.value);});
  input.addEventListener('keydown',function(e){if(e.key==='Enter')send(input.value);});

  chipBtns.forEach(function(btn,i){
    btn.addEventListener('click',function(){
      if(!isOpen)open();
      setTimeout(function(){send(CHIPS[i].m);},isOpen?0:380);
    });
  });

})();
