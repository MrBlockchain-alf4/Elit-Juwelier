/* Elit Juwelier chatbot — gold/black luxury theme */
(function(){
  const mobileStyle = document.createElement('style');
  mobileStyle.textContent = `
    @media(max-width:600px){
      #ej-cb-root{bottom:16px !important;right:16px !important;}
      #ej-cb-panel{
        position:fixed !important;width:100vw !important;max-width:100vw !important;
        left:0 !important;right:0 !important;bottom:0 !important;
        height:85vh !important;height:85dvh !important;
        border-radius:16px 16px 0 0 !important;overflow:hidden !important;
      }
      #ej-cb-input-row{
        padding:10px 12px !important;
        padding-bottom:max(10px,env(safe-area-inset-bottom,0px)) !important;
        flex-shrink:0 !important;
      }
      #ej-cb-send{width:44px !important;height:44px !important;}
      #ej-cb-inp{font-size:16px !important;padding:12px 14px !important;}
    }
  `;
  document.head.appendChild(mobileStyle);

  const C = {
    gold:'#D4AF37', goldDk:'#B8960C', goldDim:'rgba(212,175,55,0.12)',
    black:'#0A0A0A', card:'#141414', soft:'#1E1E1E',
    border:'rgba(212,175,55,0.2)', text:'#fff', muted:'rgba(255,255,255,0.6)',
  };

  const root = document.createElement('div');
  root.id = 'ej-cb-root';
  Object.assign(root.style,{position:'fixed',bottom:'24px',right:'24px',zIndex:'9999',fontFamily:"'Jost','Segoe UI',sans-serif"});
  document.body.appendChild(root);

  /* Launcher */
  const btn = document.createElement('button');
  btn.setAttribute('aria-label','Termin anfragen');
  Object.assign(btn.style,{
    width:'56px',height:'56px',borderRadius:'50%',
    background:C.gold,border:'none',cursor:'pointer',
    display:'flex',alignItems:'center',justifyContent:'center',
    boxShadow:'0 4px 20px rgba(212,175,55,0.40)',
    transition:'transform 180ms,box-shadow 180ms',
  });
  btn.innerHTML=`<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="${C.black}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`;
  btn.addEventListener('mouseenter',()=>{btn.style.transform='scale(1.08)';btn.style.boxShadow='0 8px 28px rgba(212,175,55,0.55)';});
  btn.addEventListener('mouseleave',()=>{btn.style.transform='scale(1)';btn.style.boxShadow='0 4px 20px rgba(212,175,55,0.40)';});
  root.appendChild(btn);

  /* Panel */
  const panel = document.createElement('div');
  panel.id = 'ej-cb-panel';
  Object.assign(panel.style,{
    display:'none',flexDirection:'column',
    position:'absolute',bottom:'72px',right:'0',
    width:'400px',height:'560px',
    background:C.card,borderRadius:'6px',
    boxShadow:'0 16px 56px rgba(0,0,0,0.6)',
    border:`1px solid ${C.border}`,overflow:'hidden',
  });
  root.appendChild(panel);

  /* Header */
  const header = document.createElement('div');
  Object.assign(header.style,{
    background:C.black,padding:'16px 18px',borderBottom:`1px solid ${C.border}`,
    display:'flex',alignItems:'center',justifyContent:'space-between',flexShrink:'0',
  });
  header.innerHTML=`
    <div style="display:flex;align-items:center;gap:11px;">
      <div style="width:36px;height:36px;border-radius:50%;background:${C.goldDim};border:1px solid ${C.border};display:flex;align-items:center;justify-content:center;flex-shrink:0;">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="${C.gold}" stroke-width="1.5" stroke-linecap="round"><path d="M12 2l2 7h7l-6 4 2 7-5-4-5 4 2-7-6-4h7z"/></svg>
      </div>
      <div>
        <div style="font-size:13px;font-weight:600;color:${C.gold};letter-spacing:0.05em;">Elit Juwelier</div>
        <div style="font-size:11px;color:${C.muted};margin-top:1px;">● Online</div>
      </div>
    </div>
    <button id="ej-cb-close" aria-label="Schließen" style="background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.08);cursor:pointer;width:30px;height:30px;border-radius:50%;display:flex;align-items:center;justify-content:center;color:${C.muted};font-size:16px;line-height:1;transition:background 160ms;">✕</button>
  `;
  panel.appendChild(header);

  /* Messages */
  const msgs = document.createElement('div');
  Object.assign(msgs.style,{flex:'1',overflowY:'auto',padding:'14px 12px',display:'flex',flexDirection:'column',gap:'10px',background:C.soft});
  panel.appendChild(msgs);

  /* Input row */
  const inputRow = document.createElement('div');
  inputRow.id = 'ej-cb-input-row';
  Object.assign(inputRow.style,{display:'flex',gap:'8px',padding:'12px 12px',borderTop:`1px solid ${C.border}`,background:C.black,flexShrink:'0'});
  const inp = document.createElement('input');
  inp.id = 'ej-cb-inp'; inp.type = 'text'; inp.placeholder = 'Ihre Nachricht …';
  Object.assign(inp.style,{flex:'1',padding:'10px 14px',borderRadius:'4px',border:`1px solid ${C.border}`,outline:'none',fontSize:'14px',color:C.text,background:C.card,fontFamily:'inherit',transition:'border-color 180ms'});
  inp.addEventListener('focus',()=>{inp.style.borderColor=C.gold;});
  inp.addEventListener('blur',()=>{inp.style.borderColor=C.border;});
  const sendBtn = document.createElement('button');
  sendBtn.id = 'ej-cb-send'; sendBtn.setAttribute('aria-label','Senden');
  Object.assign(sendBtn.style,{width:'40px',height:'40px',borderRadius:'4px',background:C.gold,border:'none',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:'0',transition:'background 160ms,transform 140ms'});
  sendBtn.innerHTML=`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="${C.black}" stroke-width="2.5" stroke-linecap="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>`;
  sendBtn.addEventListener('mouseenter',()=>{sendBtn.style.background=C.goldDk;sendBtn.style.transform='scale(1.05)';});
  sendBtn.addEventListener('mouseleave',()=>{sendBtn.style.background=C.gold;sendBtn.style.transform='scale(1)';});
  inputRow.appendChild(inp); inputRow.appendChild(sendBtn);
  panel.appendChild(inputRow);

  /* Helpers */
  function bubble(text,who){
    const isBot=who==='bot';
    const wrap=document.createElement('div');
    wrap.style.cssText=`display:flex;justify-content:${isBot?'flex-start':'flex-end'};`;
    const b=document.createElement('div');
    Object.assign(b.style,{
      maxWidth:'82%',padding:'10px 14px',
      borderRadius:isBot?'3px 12px 12px 12px':'12px 3px 12px 12px',
      background:isBot?C.card:'linear-gradient(135deg,'+C.gold+','+C.goldDk+')',
      color:isBot?C.text:C.black,fontSize:'13.5px',lineHeight:'1.6',
      border:isBot?`1px solid ${C.border}`:'none',
    });
    b.textContent=text; wrap.appendChild(b); msgs.appendChild(wrap);
    msgs.scrollTop=msgs.scrollHeight; return b;
  }

  function chips(options,onSelect){
    const row=document.createElement('div');
    row.style.cssText='display:flex;flex-wrap:wrap;gap:7px;margin-top:2px;';
    options.forEach(opt=>{
      const c=document.createElement('button');
      Object.assign(c.style,{padding:'7px 14px',borderRadius:'20px',cursor:'pointer',fontSize:'12px',fontWeight:'500',border:`1px solid ${C.border}`,background:C.goldDim,color:C.gold,fontFamily:'inherit',transition:'background 160ms,color 160ms'});
      c.textContent=opt;
      c.addEventListener('click',()=>{row.querySelectorAll('button').forEach(x=>{x.disabled=true;x.style.opacity='0.4';x.style.cursor='default';});c.style.background=C.gold;c.style.color=C.black;c.style.opacity='1';onSelect(opt);});
      c.addEventListener('mouseenter',()=>{if(!c.disabled){c.style.background=C.gold;c.style.color=C.black;}});
      c.addEventListener('mouseleave',()=>{if(!c.disabled&&c.style.color!==C.black){c.style.background=C.goldDim;c.style.color=C.gold;}});
      row.appendChild(c);
    });
    const wrap=document.createElement('div');wrap.style.cssText='display:flex;justify-content:flex-start;';
    wrap.appendChild(row);msgs.appendChild(wrap);msgs.scrollTop=msgs.scrollHeight;
  }

  function typing(){
    const wrap=document.createElement('div');wrap.style.cssText='display:flex;justify-content:flex-start;';
    const b=document.createElement('div');
    Object.assign(b.style,{padding:'10px 14px',borderRadius:'3px 12px 12px 12px',background:C.card,border:`1px solid ${C.border}`,display:'flex',gap:'4px',alignItems:'center'});
    const st=document.createElement('style');
    st.textContent='@keyframes ejDot{0%,80%,100%{transform:scale(0.6);opacity:0.3;}40%{transform:scale(1);opacity:1;}}';
    document.head.appendChild(st);
    for(let i=0;i<3;i++){const d=document.createElement('div');Object.assign(d.style,{width:'7px',height:'7px',borderRadius:'50%',background:C.gold,opacity:'0.3',animation:`ejDot 1.2s ${i*0.2}s infinite ease-in-out`});b.appendChild(d);}
    wrap.appendChild(b);msgs.appendChild(wrap);msgs.scrollTop=msgs.scrollHeight;
    return{remove:()=>wrap.remove()};
  }

  function delay(ms){return new Promise(r=>setTimeout(r,ms));}
  async function bot(text,ms=600){const t=typing();await delay(ms);t.remove();bubble(text,'bot');}

  /* State */
  let step=null,data={};

  const KARAT_MAP={'333er (8K)':8,'585er (14K)':14,'750er (18K)':18,'900er (21K+)':21.6,'Ich weiß es nicht':14};
  const GOLD_BASE=68; // €/g for 24K

  const STEPS={
    start:async()=>{
      await bot('Hallo! ✨ Willkommen bei Elit Juwelier. Womit kann ich Ihnen helfen?',700);
      chips(['Schmuckberatung','Goldankauf','Uhrenreparatur','Ohrenlöcher Stechen','Allgemeine Frage'],async sel=>{
        bubble(sel,'user');
        data.service=sel;
        if(sel==='Allgemeine Frage'){step='faq_name';await bot('Gerne! Wie heißen Sie?',500);}
        else if(sel==='Goldankauf'){step='gold_intro';await STEPS.gold_intro();}
        else{step='name';await STEPS.name();}
      });
    },
    gold_intro:async()=>{
      await bot('Möchten Sie Gold verkaufen? Ich kann Ihnen einen ungefähren Preis berechnen! 💛',650);
      chips(['Ja, Gold-Rechner','Nein, Termin anfragen'],async sel=>{
        bubble(sel,'user');
        if(sel==='Ja, Gold-Rechner'){step='gold_karat';await STEPS.gold_karat();}
        else{step='name';await STEPS.name();}
      });
    },
    gold_karat:async()=>{
      await bot('Welche Goldsorte haben Sie? (Goldlegierung / Karat)',550);
      chips(['333er (8K)','585er (14K)','750er (18K)','900er (21K+)','Ich weiß es nicht'],async sel=>{
        bubble(sel,'user');
        data.karat=sel;
        step='gold_weight';
        await bot(sel==='Ich weiß es nicht'
          ?'Kein Problem! Wir schätzen dann mit 14 Karat. Wie viele Gramm Gold möchten Sie verkaufen?'
          :'Super! Und wie viele Gramm Gold möchten Sie verkaufen?',550);
      });
    },
    gold_result:async()=>{
      const karatVal=KARAT_MAP[data.karat]||14;
      const pricePerGram=GOLD_BASE*(karatVal/24);
      const total=Math.round(pricePerGram*data.grams);
      const totalStr=total.toLocaleString('de-DE');
      const t=typing();await new Promise(r=>setTimeout(r,800));t.remove();

      // Rich result bubble
      const wrap=document.createElement('div');wrap.style.cssText='display:flex;justify-content:flex-start;';
      const b=document.createElement('div');
      Object.assign(b.style,{
        maxWidth:'88%',padding:'14px 16px',
        borderRadius:'3px 12px 12px 12px',
        background:'linear-gradient(135deg,rgba(212,175,55,0.15),rgba(212,175,55,0.05))',
        border:`1px solid ${C.gold}`,color:C.text,fontSize:'13.5px',lineHeight:'1.7',
      });
      b.innerHTML=`<div style="font-weight:700;color:${C.gold};margin-bottom:8px;letter-spacing:0.04em;">💛 Ungefähre Wertberechnung</div>`
        +`<div style="margin-bottom:3px;">• Goldsorte: <b>${data.karat}</b></div>`
        +`<div style="margin-bottom:3px;">• Menge: <b>${data.grams} Gramm</b></div>`
        +`<div style="margin-top:8px;padding-top:8px;border-top:1px solid rgba(212,175,55,0.3);font-size:15px;font-weight:700;color:${C.gold};">ca. €${totalStr}</div>`
        +`<div style="font-size:11.5px;color:${C.muted};margin-top:6px;">Richtwert · endgültiger Preis bei Besichtigung</div>`;
      wrap.appendChild(b);msgs.appendChild(wrap);msgs.scrollTop=msgs.scrollHeight;

      await new Promise(r=>setTimeout(r,500));
      await bot('Möchten Sie vorbeikommen? Wir beraten Sie gerne persönlich und unverbindlich.',600);
      step=null;
      chips(['Termin anfragen','Anrufen','Neue Anfrage'],async sel=>{
        bubble(sel,'user');
        if(sel==='Termin anfragen'){data={service:'Goldankauf'};step='name';await STEPS.name();}
        else if(sel==='Anrufen'){await bot('Sie erreichen uns unter ☎ +49 2331 5936841 — Mo–Sa 10–19 Uhr.',500);}
        else{data={};step='start';msgs.innerHTML='';await STEPS.start();}
      });
    },
    name:async()=>{await bot(`Sehr gut! Wie heißen Sie?`,550);},
    phone:async()=>{await bot(`Danke, ${data.name}! Unter welcher Nummer können wir Sie erreichen?`,500);},
    email:async()=>{await bot('Und Ihre E-Mail-Adresse?',450);},
    details:async()=>{await bot('Bitte beschreiben Sie kurz, womit wir Ihnen helfen können:',500);},
    done:async()=>{
      await bot(`Vielen Dank, ${data.name}! ✨\n\nWir melden uns bald unter ${data.phone}. Unser Team freut sich auf Sie!`,700);
      step=null;
      chips(['Neue Anfrage'],async()=>{data={};step='start';msgs.innerHTML='';await STEPS.start();});
    },
  };

  async function freeText(text){
    if(!text.trim())return;
    bubble(text,'user'); inp.value='';
    if(step==='gold_weight'){
      const g=parseFloat(text.replace(',','.'));
      if(isNaN(g)||g<=0){await bot('Bitte geben Sie eine gültige Gramm-Anzahl ein (z.B. 15 oder 3.5).',400);return;}
      data.grams=g;
      await STEPS.gold_result();
    }
    else if(step==='name'||step===null){data.name=text;step='phone';await STEPS.phone();}
    else if(step==='phone'){data.phone=text;step='email';await STEPS.email();}
    else if(step==='email'){data.email=text;step='details';await STEPS.details();}
    else if(step==='details'){data.details=text;step='done';await STEPS.done();}
    else if(step==='faq_name'){data.name=text;step='faq_q';await bot(`Danke ${data.name}! Bitte stellen Sie Ihre Frage:`,500);}
    else if(step==='faq_q'){data.question=text;await bot('Danke! Wir melden uns so schnell wie möglich. Sie erreichen uns auch unter ☎ +49 2331 5936841',700);step=null;chips(['Termin anfragen','Zum Start'],async sel=>{bubble(sel,'user');if(sel==='Termin anfragen'){data={};step='start';msgs.innerHTML='';await STEPS.start();}else{data={};step='start';msgs.innerHTML='';await STEPS.start();}});}
    else{await bot('Bitte nutzen Sie die Auswahloptionen.',400);}
  }

  sendBtn.addEventListener('click',()=>freeText(inp.value));
  inp.addEventListener('keydown',e=>{if(e.key==='Enter')freeText(inp.value);});

  /* Toggle */
  let open=false;
  function toggle(){
    open=!open;
    panel.style.display=open?'flex':'none';
    btn.style.display=(open&&window.innerWidth<=600)?'none':'flex';
    btn.innerHTML=open
      ?`<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="${C.black}" stroke-width="2.5" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`
      :`<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="${C.black}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`;
    if(open&&msgs.children.length===0){step='start';STEPS.start();}
  }

  btn.addEventListener('click',toggle);
  document.getElementById('ej-cb-close').addEventListener('click',()=>{if(open)toggle();if(window.innerWidth<=600){btn.style.display='flex';}});
  window.ejCbOpen=()=>{if(!open)toggle();};
})();
