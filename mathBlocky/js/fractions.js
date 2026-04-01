// ═══════════════════════════════════════════════
// Fractions Explorer — All 4 operations, chain, exercises
// ═══════════════════════════════════════════════

var frc = {
  fracs: [{n:1,d:3,op:null},{n:1,d:4,op:"add"}],
  hintLevel: 0, exercises: []
};

var FRAC_EX = {
  easy: [
    {fracs:[{n:1,d:4,op:null},{n:1,d:4,op:"add"}],label:"¼ + ¼"},
    {fracs:[{n:2,d:5,op:null},{n:1,d:5,op:"add"}],label:"²⁄₅ + ¹⁄₅"},
    {fracs:[{n:3,d:4,op:null},{n:1,d:4,op:"sub"}],label:"¾ − ¼"},
    {fracs:[{n:1,d:2,op:null},{n:1,d:2,op:"add"}],label:"½ + ½"},
    {fracs:[{n:5,d:6,op:null},{n:1,d:6,op:"sub"}],label:"⁵⁄₆ − ¹⁄₆"},
    {fracs:[{n:1,d:3,op:null},{n:2,d:3,op:"add"}],label:"¹⁄₃ + ²⁄₃"},
    {fracs:[{n:1,d:2,op:null},{n:1,d:4,op:"mul"}],label:"½ × ¼"},
    {fracs:[{n:3,d:8,op:null},{n:1,d:8,op:"add"}],label:"³⁄₈ + ¹⁄₈"},
  ],
  medium: [
    {fracs:[{n:1,d:3,op:null},{n:1,d:4,op:"add"}],label:"¹⁄₃ + ¼"},
    {fracs:[{n:2,d:3,op:null},{n:1,d:2,op:"sub"}],label:"²⁄₃ − ½"},
    {fracs:[{n:3,d:4,op:null},{n:2,d:5,op:"add"}],label:"¾ + ²⁄₅"},
    {fracs:[{n:2,d:3,op:null},{n:3,d:4,op:"mul"}],label:"²⁄₃ × ¾"},
    {fracs:[{n:1,d:2,op:null},{n:1,d:4,op:"div"}],label:"½ ÷ ¼"},
    {fracs:[{n:5,d:6,op:null},{n:1,d:3,op:"sub"}],label:"⁵⁄₆ − ¹⁄₃"},
    {fracs:[{n:3,d:5,op:null},{n:2,d:3,op:"mul"}],label:"³⁄₅ × ²⁄₃"},
    {fracs:[{n:4,d:5,op:null},{n:2,d:3,op:"div"}],label:"⁴⁄₅ ÷ ²⁄₃"},
  ],
  hard: [
    {fracs:[{n:1,d:3,op:null},{n:1,d:4,op:"add"},{n:1,d:6,op:"add"}],label:"¹⁄₃ + ¼ + ¹⁄₆"},
    {fracs:[{n:3,d:4,op:null},{n:1,d:3,op:"sub"},{n:1,d:6,op:"add"}],label:"¾ − ¹⁄₃ + ¹⁄₆"},
    {fracs:[{n:2,d:3,op:null},{n:5,d:6,op:"mul"}],label:"²⁄₃ × ⁵⁄₆"},
    {fracs:[{n:7,d:8,op:null},{n:3,d:4,op:"div"}],label:"⁷⁄₈ ÷ ¾"},
    {fracs:[{n:5,d:12,op:null},{n:3,d:8,op:"add"}],label:"⁵⁄₁₂ + ³⁄₈"},
    {fracs:[{n:2,d:3,op:null},{n:1,d:4,op:"add"},{n:1,d:2,op:"sub"}],label:"²⁄₃ + ¼ − ½"},
    {fracs:[{n:4,d:9,op:null},{n:2,d:3,op:"div"}],label:"⁴⁄₉ ÷ ²⁄₃"},
    {fracs:[{n:3,d:4,op:null},{n:2,d:5,op:"mul"},{n:1,d:3,op:"add"}],label:"¾ × ²⁄₅ + ¹⁄₃"},
  ]
};

function initFractions() {
  document.getElementById("fracCheckBtn").onclick = checkFracAnswer;
  document.getElementById("fracHintBtn").onclick = showFracHint;
  document.getElementById("fracRevealBtn").onclick = revealFracSolution;
  document.getElementById("fracAddBtn").onclick = addFraction;
  document.getElementById("fracRemoveBtn").onclick = removeFraction;

  document.querySelectorAll(".frac-source-bar .eq-src-btn").forEach(function(btn) {
    btn.onclick = function() {
      document.querySelectorAll(".frac-source-bar .eq-src-btn").forEach(function(b){b.classList.remove("active")});
      this.classList.add("active");
      var s = this.dataset.fsrc;
      document.getElementById("fPanelExercises").style.display = s==="exercises" ? "flex" : "none";
      document.getElementById("fPanelCsv").style.display = s==="csv" ? "flex" : "none";
      document.getElementById("fExStrip").style.display = s==="exercises" ? "block" : "none";
      if(s==="exercises") renderFExList("easy");
    };
  });

  document.querySelectorAll(".frac-diff").forEach(function(btn) {
    btn.onclick = function() {
      document.querySelectorAll(".frac-diff").forEach(function(b){b.classList.remove("active")});
      this.classList.add("active"); renderFExList(this.dataset.fdiff);
    };
  });

  document.getElementById("fCsvFile").onchange = function(e) {
    var f = e.target.files[0]; if(!f) return;
    var r = new FileReader(); r.onload = function(ev) {
      var lines = ev.target.result.split("\n").filter(function(l){return l.trim()});
      frc.exercises = [];
      lines.forEach(function(line) {
        var p = line.split(",").map(function(s){return s.trim()});
        var fracs = [];
        for(var i=0;i<p.length;i+=3){var n=parseInt(p[i]),d=parseInt(p[i+1]);var op=i===0?null:p[i-1];if(!isNaN(n)&&!isNaN(d))fracs.push({n:n,d:d,op:op||"add"});}
        if(fracs.length>=2){fracs[0].op=null;frc.exercises.push({fracs:fracs,label:fracsLabel(fracs)});}
      }); renderFCsvList();
    }; r.readAsText(f);
  };

  renderFExList("easy"); buildChainUI(); updateFractions();
}

function fracsLabel(fracs){var opS={add:"+",sub:"−",mul:"×",div:"÷"};return fracs.map(function(f,i){return(i>0?" "+opS[f.op]+" ":"")+f.n+"/"+f.d}).join("")}

// ── Chain UI ──
function buildChainUI() {
  var chain = document.getElementById("fracChain"); chain.innerHTML = "";
  frc.fracs.forEach(function(f, i) {
    var item = document.createElement("div"); item.className = "frac-chain-item";
    if(i > 0) {
      var sel = document.createElement("select"); sel.className = "frac-op-sel";
      sel.innerHTML = '<option value="add"'+(f.op==="add"?" selected":"")+'>+</option><option value="sub"'+(f.op==="sub"?" selected":"")+'>−</option><option value="mul"'+(f.op==="mul"?" selected":"")+'>×</option><option value="div"'+(f.op==="div"?" selected":"")+'>÷</option>';
      sel.dataset.idx=i; sel.onchange=function(){frc.fracs[parseInt(this.dataset.idx)].op=this.value;frc.hintLevel=0;hideFracSol();updateFractions()};
      item.appendChild(sel);
    }
    var box = document.createElement("div"); box.className = "frac-box";
    var nI = document.createElement("input"); nI.type="number"; nI.className="frac-inp"; nI.value=f.n; nI.step="1"; nI.dataset.idx=i; nI.dataset.part="n"; nI.oninput=fracInpCh;
    var ln = document.createElement("div"); ln.className = "frac-line";
    var dI = document.createElement("input"); dI.type="number"; dI.className="frac-inp"; dI.value=f.d; dI.step="1"; dI.min="1"; dI.dataset.idx=i; dI.dataset.part="d"; dI.oninput=fracInpCh;
    box.appendChild(nI); box.appendChild(ln); box.appendChild(dI); item.appendChild(box); chain.appendChild(item);
  });
  document.getElementById("fracRemoveBtn").style.display = frc.fracs.length > 2 ? "inline-block" : "none";
}

function fracInpCh(e){var i=parseInt(e.target.dataset.idx),p=e.target.dataset.part;frc.fracs[i][p]=parseInt(e.target.value)||(p==="d"?1:0);frc.hintLevel=0;hideFracSol();updateFractions()}
function addFraction(){frc.fracs.push({n:1,d:2,op:"add"});buildChainUI();updateFractions()}
function removeFraction(){if(frc.fracs.length>2){frc.fracs.pop();buildChainUI();updateFractions()}}

function loadFracEx(ex){frc.fracs=ex.fracs.map(function(f){return{n:f.n,d:f.d,op:f.op}});frc.hintLevel=0;document.getElementById("fracAnsN").value="";document.getElementById("fracAnsD").value="";hideFracSol();buildChainUI();updateFractions()}
function hideFracSol(){document.getElementById("fracSolution").style.display="none";document.getElementById("fracHintBox").style.display="none";document.getElementById("fracRevealBtn").textContent="👁 Solution";document.getElementById("fracFeedback").textContent="";document.getElementById("fracFeedback").className="qw-feedback"}

function renderFExList(diff){var list=FRAC_EX[diff]||[];frc.exercises=list;var el=document.getElementById("fExList");el.innerHTML="";list.forEach(function(ex){var it=document.createElement("div");it.className="ex-item";it.innerHTML='<span class="ex-eq">'+ex.label+'</span><span class="ex-badge '+diff+'">'+diff+'</span>';it.onclick=function(){loadFracEx(ex)};el.appendChild(it)})}
function renderFCsvList(){var el=document.getElementById("fExList");el.innerHTML="";frc.exercises.forEach(function(ex,i){var it=document.createElement("div");it.className="ex-item";it.innerHTML='<span class="ex-eq">'+ex.label+'</span><span class="ex-badge">#'+(i+1)+'</span>';it.onclick=function(){loadFracEx(ex)};el.appendChild(it)})}

// ── Update ──
function updateFractions(){renderFracKatex();drawFracBars()}
function renderFracKatex(){var opM={add:"+",sub:"-",mul:"\\times",div:"\\div"};var lx=frc.fracs.map(function(f,i){return(i>0?" "+opM[f.op]+" ":"")+"\\frac{"+f.n+"}{"+f.d+"}"}).join("");var el=document.getElementById("fracKatex");try{katex.render(lx,el,{displayMode:true,throwOnError:false})}catch(e){el.textContent=lx}}

// ── Compute ──
function computeChain(){var rn=frc.fracs[0].n,rd=frc.fracs[0].d;for(var i=1;i<frc.fracs.length;i++){var r=fracOp(rn,rd,frc.fracs[i].op,frc.fracs[i].n,frc.fracs[i].d);rn=r.n;rd=r.d}return{n:rn,d:rd}}
function fracOp(n1,d1,op,n2,d2){var rn,rd;if(op==="add"){rn=n1*d2+n2*d1;rd=d1*d2}else if(op==="sub"){rn=n1*d2-n2*d1;rd=d1*d2}else if(op==="mul"){rn=n1*n2;rd=d1*d2}else{rn=n1*d2;rd=d1*n2}if(rd<0){rn=-rn;rd=-rd}var g=gcd2(Math.abs(rn),Math.abs(rd));return{n:rn/g,d:rd/g}}
function gcd2(a,b){a=Math.abs(a);b=Math.abs(b);while(b){var t=b;b=a%b;a=t}return a||1}
function lcm2(a,b){return Math.abs(a*b)/gcd2(a,b)}

// ── Check ──
function checkFracAnswer(){
  var an=parseInt(document.getElementById("fracAnsN").value),ad=parseInt(document.getElementById("fracAnsD").value);
  var fb=document.getElementById("fracFeedback");
  if(isNaN(an)||isNaN(ad)){fb.textContent="Enter both numerator and denominator";fb.className="qw-feedback partial";return}
  if(ad===0){fb.textContent="Denominator can't be zero!";fb.className="qw-feedback incorrect";return}
  var c=computeChain();
  if(an*c.d===c.n*ad){var g=gcd2(Math.abs(an),Math.abs(ad));if(g===1||(an===c.n&&ad===c.d)){fb.innerHTML='🎉 <strong>Correct!</strong> '+c.n+'/'+c.d;fb.className="qw-feedback correct"}else{fb.innerHTML='✓ Correct but simplify: '+an+'/'+ad+' = <strong>'+c.n+'/'+c.d+'</strong>';fb.className="qw-feedback partial"}}
  else{fb.innerHTML='✗ Not correct — try again';fb.className="qw-feedback incorrect"}
}

// ══════════════════════════════════
// HINTS (progressive, operation-aware)
// ══════════════════════════════════
function showFracHint(){
  var box=document.getElementById("fracHintBox");box.style.display="block";
  frc.hintLevel++;
  var f1=frc.fracs[0],f2=frc.fracs[1],op=f2.op;

  if(op==="add"||op==="sub"){
    var w=op==="add"?"add":"subtract";
    if(frc.hintLevel===1){
      if(f1.d===f2.d)box.innerHTML='<strong>Hint 1 — Same denominators!</strong><br>Both denominators are <strong>'+f1.d+'</strong>. Just '+w+' the numerators and keep the denominator.';
      else box.innerHTML='<strong>Hint 1 — Different denominators</strong><br>Denominators are '+f1.d+' and '+f2.d+'. You need a <strong>common denominator</strong> (LCM) before you can '+w+'.';
    }else if(frc.hintLevel===2){
      if(f1.d===f2.d){var r=op==="add"?f1.n+f2.n:f1.n-f2.n;box.innerHTML='<strong>Hint 2:</strong> '+f1.n+(op==="add"?" + ":" − ")+f2.n+' = <strong>'+r+'</strong> → answer is <strong>'+r+'/'+f1.d+'</strong>'}
      else{var lcd=lcm2(f1.d,f2.d);box.innerHTML='<strong>Hint 2:</strong> LCM of '+f1.d+' and '+f2.d+' = <strong>'+lcd+'</strong><br>• '+f1.n+'/'+f1.d+' → ×'+(lcd/f1.d)+' → <strong>'+(f1.n*(lcd/f1.d))+'/'+lcd+'</strong><br>• '+f2.n+'/'+f2.d+' → ×'+(lcd/f2.d)+' → <strong>'+(f2.n*(lcd/f2.d))+'/'+lcd+'</strong>'}
    }else if(frc.hintLevel===3&&f1.d!==f2.d){var lcd2=lcm2(f1.d,f2.d);var a=f1.n*(lcd2/f1.d),b=f2.n*(lcd2/f2.d);var r2=op==="add"?a+b:a-b;box.innerHTML='<strong>Hint 3:</strong> '+a+(op==="add"?" + ":" − ")+b+' = <strong>'+r2+'</strong> → <strong>'+r2+'/'+lcd2+'</strong>';var g=gcd2(Math.abs(r2),lcd2);if(g>1)box.innerHTML+='<br>Simplify ÷'+g+' → <strong>'+r2/g+'/'+lcd2/g+'</strong>'}
    else{var fin=computeChain();box.innerHTML='<strong>Answer:</strong> <strong>'+fin.n+'/'+fin.d+'</strong>';frc.hintLevel=4}
  }else if(op==="mul"){
    if(frc.hintLevel===1)box.innerHTML='<strong>Hint 1 — Multiplying fractions</strong><br>Multiply <strong>top × top</strong> and <strong>bottom × bottom</strong>:<br>'+f1.n+' × '+f2.n+' = ? (numerator)<br>'+f1.d+' × '+f2.d+' = ? (denominator)';
    else if(frc.hintLevel===2){box.innerHTML='<strong>Hint 2:</strong> '+f1.n+'×'+f2.n+' = <strong>'+(f1.n*f2.n)+'</strong>, '+f1.d+'×'+f2.d+' = <strong>'+(f1.d*f2.d)+'</strong> → <strong>'+(f1.n*f2.n)+'/'+(f1.d*f2.d)+'</strong>';var g=gcd2(Math.abs(f1.n*f2.n),f1.d*f2.d);if(g>1)box.innerHTML+='<br>Simplify ÷'+g+' → <strong>'+(f1.n*f2.n)/g+'/'+(f1.d*f2.d)/g+'</strong>'}
    else{var fin2=computeChain();box.innerHTML='<strong>Answer:</strong> <strong>'+fin2.n+'/'+fin2.d+'</strong>';frc.hintLevel=3}
  }else{
    if(frc.hintLevel===1)box.innerHTML='<strong>Hint 1 — Dividing fractions: "Keep, Flip, Change"</strong><br>1. <strong>Keep</strong> the first fraction: '+f1.n+'/'+f1.d+'<br>2. <strong>Flip</strong> the second: '+f2.n+'/'+f2.d+' → '+f2.d+'/'+f2.n+'<br>3. <strong>Change</strong> ÷ to ×';
    else if(frc.hintLevel===2){box.innerHTML='<strong>Hint 2 — Now multiply:</strong><br>'+f1.n+'/'+f1.d+' × '+f2.d+'/'+f2.n+'<br>Top: '+f1.n+'×'+f2.d+' = <strong>'+(f1.n*f2.d)+'</strong><br>Bottom: '+f1.d+'×'+f2.n+' = <strong>'+(f1.d*f2.n)+'</strong>';var g2=gcd2(Math.abs(f1.n*f2.d),Math.abs(f1.d*f2.n));if(g2>1)box.innerHTML+='<br>Simplify ÷'+g2+' → <strong>'+(f1.n*f2.d)/g2+'/'+(f1.d*f2.n)/g2+'</strong>'}
    else{var fin3=computeChain();box.innerHTML='<strong>Answer:</strong> <strong>'+fin3.n+'/'+fin3.d+'</strong>';frc.hintLevel=3}
  }
}

// ══════════════════════════════════
// FULL SOLUTION (detailed step-by-step)
// ══════════════════════════════════
function revealFracSolution(){
  var area=document.getElementById("fracSolution");
  if(area.style.display!=="none"){area.style.display="none";document.getElementById("fracRevealBtn").textContent="👁 Solution";return}
  area.style.display="block";document.getElementById("fracRevealBtn").textContent="🙈 Hide";
  var steps=document.getElementById("fracSteps");steps.innerHTML="";
  var rn=frc.fracs[0].n,rd=frc.fracs[0].d,sn=1;

  for(var i=1;i<frc.fracs.length;i++){
    var f=frc.fracs[i],op=f.op;
    if(frc.fracs.length>2)addFS(steps,sn++,'<strong style="color:#f472b6">Pair: '+rn+'/'+rd+' and '+f.n+'/'+f.d+'</strong>');

    if(op==="add"||op==="sub"){
      var sym=op==="add"?"+":"-",w2=op==="add"?"add":"subtract";
      if(rd===f.d){
        addFS(steps,sn++,'<strong>'+w2.charAt(0).toUpperCase()+w2.slice(1)+' (same denominator: '+rd+')</strong><br>When denominators match, just '+w2+' the numerators:');
        var rN=op==="add"?rn+f.n:rn-f.n;
        addFSK(steps,sn++,'\\frac{'+rn+'}{'+rd+'} '+sym+' \\frac{'+f.n+'}{'+f.d+'} = \\frac{'+rn+(op==="add"?"+":"-")+f.n+'}{'+rd+'} = \\frac{'+rN+'}{'+rd+'}');
        var g=gcd2(Math.abs(rN),rd);
        if(g>1){addFS(steps,sn++,'<strong>Simplify:</strong> '+Math.abs(rN)+' and '+rd+' both divide by '+g);addFSK(steps,sn++,'\\frac{'+rN+'}{'+rd+'} = \\frac{'+rN/g+'}{'+rd/g+'}')}
        rn=rN/g;rd=rd/g;
      }else{
        var lcd=lcm2(rd,f.d),m1=lcd/rd,m2=lcd/f.d;
        addFS(steps,sn++,'<strong>'+w2.charAt(0).toUpperCase()+w2.slice(1)+' (different denominators: '+rd+' and '+f.d+')</strong><br>We need a <strong>common denominator</strong> before we can '+w2+'.');
        addFS(steps,sn++,'<strong>Find the LCM:</strong> The lowest common multiple of '+rd+' and '+f.d+' is <strong>'+lcd+'</strong>.');
        addFS(steps,sn++,'<strong>Convert both fractions</strong> to have denominator '+lcd+':');
        addFSK(steps,sn++,'\\frac{'+rn+'}{'+rd+'} = \\frac{'+rn+' \\times '+m1+'}{'+rd+' \\times '+m1+'} = \\frac{'+(rn*m1)+'}{'+lcd+'}');
        addFSK(steps,sn++,'\\frac{'+f.n+'}{'+f.d+'} = \\frac{'+f.n+' \\times '+m2+'}{'+f.d+' \\times '+m2+'} = \\frac{'+(f.n*m2)+'}{'+lcd+'}');
        addFS(steps,sn++,'<strong>Now '+w2+' the numerators</strong> (denominators are the same):');
        var rN2=op==="add"?rn*m1+f.n*m2:rn*m1-f.n*m2;
        addFSK(steps,sn++,'\\frac{'+(rn*m1)+'}{'+lcd+'} '+sym+' \\frac{'+(f.n*m2)+'}{'+lcd+'} = \\frac{'+(rn*m1)+(op==="add"?"+":"-")+(f.n*m2)+'}{'+lcd+'} = \\frac{'+rN2+'}{'+lcd+'}');
        var g2=gcd2(Math.abs(rN2),lcd);
        if(g2>1){addFS(steps,sn++,'<strong>Simplify:</strong> both divide by '+g2);addFSK(steps,sn++,'\\frac{'+rN2+'}{'+lcd+'} = \\frac{'+rN2/g2+'}{'+lcd/g2+'}')}
        rn=rN2/g2;rd=lcd/g2;
      }
    }else if(op==="mul"){
      addFS(steps,sn++,'<strong>Multiply fractions</strong><br>Rule: multiply numerators together, multiply denominators together.');
      addFS(steps,sn++,'<strong>Numerators:</strong> '+rn+' × '+f.n+' = <strong>'+(rn*f.n)+'</strong>');
      addFS(steps,sn++,'<strong>Denominators:</strong> '+rd+' × '+f.d+' = <strong>'+(rd*f.d)+'</strong>');
      addFSK(steps,sn++,'\\frac{'+rn+'}{'+rd+'} \\times \\frac{'+f.n+'}{'+f.d+'} = \\frac{'+rn+' \\times '+f.n+'}{'+rd+' \\times '+f.d+'} = \\frac{'+(rn*f.n)+'}{'+(rd*f.d)+'}');
      var nn=rn*f.n,nd=rd*f.d,g3=gcd2(Math.abs(nn),Math.abs(nd));
      if(g3>1){addFS(steps,sn++,'<strong>Simplify:</strong> '+Math.abs(nn)+' and '+nd+' both divide by '+g3);addFSK(steps,sn++,'\\frac{'+nn+'}{'+nd+'} = \\frac{'+nn/g3+'}{'+nd/g3+'}')}
      else addFS(steps,sn++,'Already in simplest form.');
      rn=nn/g3;rd=nd/g3;
    }else{
      addFS(steps,sn++,'<strong>Divide fractions — "Keep, Flip, Change"</strong><br>1. <strong>Keep</strong> the first fraction: '+rn+'/'+rd+'<br>2. <strong>Flip</strong> the second fraction: '+f.n+'/'+f.d+' becomes <strong>'+f.d+'/'+f.n+'</strong><br>3. <strong>Change</strong> the operation from ÷ to ×');
      addFSK(steps,sn++,'\\frac{'+rn+'}{'+rd+'} \\div \\frac{'+f.n+'}{'+f.d+'} = \\frac{'+rn+'}{'+rd+'} \\times \\frac{'+f.d+'}{'+f.n+'}');
      addFS(steps,sn++,'<strong>Now multiply:</strong><br>Numerators: '+rn+' × '+f.d+' = <strong>'+(rn*f.d)+'</strong><br>Denominators: '+rd+' × '+f.n+' = <strong>'+(rd*f.n)+'</strong>');
      var nn2=rn*f.d,nd2=rd*f.n;if(nd2<0){nn2=-nn2;nd2=-nd2}
      addFSK(steps,sn++,'= \\frac{'+(rn*f.d)+'}{'+(rd*f.n)+'}');
      var g4=gcd2(Math.abs(nn2),Math.abs(nd2));
      if(g4>1){addFS(steps,sn++,'<strong>Simplify:</strong> both divide by '+g4);addFSK(steps,sn++,'\\frac{'+nn2+'}{'+nd2+'} = \\frac{'+nn2/g4+'}{'+nd2/g4+'}')}
      else addFS(steps,sn++,'Already in simplest form.');
      rn=nn2/g4;rd=nd2/g4;
    }
  }
  addFS(steps,sn,'🎯 <strong style="color:#34d399;font-size:16px">Answer: '+rn+'/'+rd+'</strong>');
}

function addFS(p,n,h){var el=document.createElement("div");el.className="frac-step";el.innerHTML='<span class="fs-num">'+n+'</span>'+h;p.appendChild(el)}
function addFSK(p,n,lx){var uid="fk"+n+"_"+Math.random().toString(36).substr(2,5);var el=document.createElement("div");el.className="frac-step";el.innerHTML='<span class="fs-num">'+n+'</span><div class="fs-katex" id="'+uid+'"></div>';p.appendChild(el);try{katex.render(lx,document.getElementById(uid),{displayMode:true,throwOnError:false})}catch(e){}}

// ── Draw bars ──
function drawFracBars(){
  var cv=document.getElementById("fracCanvas");if(!cv)return;
  var rect=cv.getBoundingClientRect();if(rect.width<10||rect.height<10)return;
  var ctx=cv.getContext("2d"),dpr=window.devicePixelRatio||1;
  cv.width=rect.width*dpr;cv.height=rect.height*dpr;ctx.scale(dpr,dpr);
  var W=rect.width,H=rect.height;ctx.clearRect(0,0,W,H);

  var barW=W-60,barH=34,gap=12,sx=30,cols=["#f472b6","#a78bfa","#06b6d4","#f59e0b","#10b981","#ef4444"];
  var y=30;
  var opS={add:"+",sub:"−",mul:"×",div:"÷"};

  frc.fracs.forEach(function(f,i){
    var c=cols[i%cols.length];
    ctx.fillStyle="#e2e8f0";ctx.font="bold 12px 'Outfit',sans-serif";ctx.textAlign="left";
    ctx.fillText((i>0?opS[f.op]+" ":"")+f.n+"/"+f.d,sx,y-4);
    drawFBar(ctx,sx,y,barW,barH,Math.abs(f.d),Math.abs(f.n),c);y+=barH+gap;
  });

  // Common denom bars for add/sub with 2 fractions
  if(frc.fracs.length===2&&(frc.fracs[1].op==="add"||frc.fracs[1].op==="sub")){
    var f1=frc.fracs[0],f2=frc.fracs[1];
    if(f1.d!==f2.d){
      var lcd=lcm2(f1.d,f2.d);y+=8;
      ctx.fillStyle="#f59e0b";ctx.font="bold 12px 'Outfit',sans-serif";ctx.textAlign="left";
      ctx.fillText("Common denominator: "+lcd,sx,y-4);
      drawFBar(ctx,sx,y,barW,barH,lcd,Math.abs(f1.n*(lcd/f1.d)),"#f472b6");
      ctx.fillStyle="#f472b6";ctx.font="11px 'JetBrains Mono',monospace";ctx.textAlign="right";
      ctx.fillText(f1.n*(lcd/f1.d)+"/"+lcd,sx+barW+4,y+barH/2+4);y+=barH+3;
      drawFBar(ctx,sx,y,barW,barH,lcd,Math.abs(f2.n*(lcd/f2.d)),"#a78bfa");
      ctx.fillStyle="#a78bfa";ctx.font="11px 'JetBrains Mono',monospace";ctx.textAlign="right";
      ctx.fillText(f2.n*(lcd/f2.d)+"/"+lcd,sx+barW+4,y+barH/2+4);y+=barH+gap+8;
    }
  }

  // Result
  var res=computeChain();y+=4;
  ctx.fillStyle="#34d399";ctx.font="bold 12px 'Outfit',sans-serif";ctx.textAlign="left";
  ctx.fillText("= "+res.n+"/"+res.d,sx,y-4);
  drawFBar(ctx,sx,y,barW,barH,Math.abs(res.d),Math.abs(res.n),"#34d399");
}

function drawFBar(ctx,x,y,w,h,parts,fill,col){
  parts=Math.max(1,Math.min(parts,50));fill=Math.min(Math.abs(fill),parts);
  ctx.fillStyle=col.replace(")",",0.1)").replace("rgb","rgba")||"rgba(255,255,255,.05)";
  rr(ctx,x,y,w,h,5);ctx.fill();ctx.strokeStyle="#2a3650";ctx.lineWidth=1;rr(ctx,x,y,w,h,5);ctx.stroke();
  if(fill>0){var sw=w/parts;ctx.fillStyle=col;rr(ctx,x,y,sw*fill,h,5);ctx.fill()}
  var sw2=w/parts;ctx.strokeStyle="rgba(255,255,255,.12)";ctx.lineWidth=1;
  for(var i=1;i<parts;i++){ctx.beginPath();ctx.moveTo(x+i*sw2,y);ctx.lineTo(x+i*sw2,y+h);ctx.stroke()}
  if(fill>0&&sw2*fill>28){ctx.fillStyle="#fff";ctx.font="bold 11px 'JetBrains Mono',monospace";ctx.textAlign="center";ctx.textBaseline="middle";ctx.fillText(fill+"/"+parts,x+sw2*fill/2,y+h/2)}
}

function rr(c,x,y,w,h,r){c.beginPath();c.moveTo(x+r,y);c.lineTo(x+w-r,y);c.quadraticCurveTo(x+w,y,x+w,y+r);c.lineTo(x+w,y+h-r);c.quadraticCurveTo(x+w,y+h,x+w-r,y+h);c.lineTo(x+r,y+h);c.quadraticCurveTo(x,y+h,x,y+h-r);c.lineTo(x,y+r);c.quadraticCurveTo(x,y,x+r,y);c.closePath()}
