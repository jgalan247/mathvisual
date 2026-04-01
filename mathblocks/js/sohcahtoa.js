// ═══════════════════════════════════════════════
// SOHCAHTOA Explorer
// Interactive right-angled triangle solver
// ═══════════════════════════════════════════════

var soh={
  angle:35, knownSide:"hyp", knownVal:10, findSide:"opp",
  findType:"findSide", // "findSide" or "findAngle"
  solving:false, hintLevel:0,
  // For findAngle mode
  side1:"opp", side1Val:5, side2:"hyp", side2Val:10,
  exercises:[], exIndex:0
};

var SOH_EX={
  easy:[
    {angle:30,known:"hyp",val:10,find:"opp",label:"θ=30°, hyp=10, find opp"},
    {angle:45,known:"hyp",val:8,find:"adj",label:"θ=45°, hyp=8, find adj"},
    {angle:60,known:"adj",val:5,find:"opp",label:"θ=60°, adj=5, find opp"},
    {angle:40,known:"hyp",val:12,find:"opp",label:"θ=40°, hyp=12, find opp"},
    {angle:50,known:"adj",val:7,find:"hyp",label:"θ=50°, adj=7, find hyp"},
    {angle:35,known:"opp",val:6,find:"hyp",label:"θ=35°, opp=6, find hyp"},
  ],
  medium:[
    {angle:28,known:"hyp",val:15,find:"adj",label:"θ=28°, hyp=15, find adj"},
    {angle:55,known:"opp",val:9,find:"adj",label:"θ=55°, opp=9, find adj"},
    {angle:0,known:"opp",val:8,known2:"hyp",val2:15,find:"angle",label:"opp=8, hyp=15, find θ"},
    {angle:0,known:"adj",val:12,known2:"hyp",val2:20,find:"angle",label:"adj=12, hyp=20, find θ"},
    {angle:42,known:"adj",val:11,find:"opp",label:"θ=42°, adj=11, find opp"},
    {angle:67,known:"opp",val:14,find:"hyp",label:"θ=67°, opp=14, find hyp"},
  ],
  hard:[
    {angle:0,known:"opp",val:7,known2:"adj",val2:10,find:"angle",label:"opp=7, adj=10, find θ"},
    {angle:23,known:"hyp",val:25,find:"opp",label:"θ=23°, hyp=25, find opp"},
    {angle:0,known:"opp",val:12,known2:"hyp",val2:13,find:"angle",label:"opp=12, hyp=13, find θ"},
    {angle:71,known:"adj",val:3.5,find:"hyp",label:"θ=71°, adj=3.5, find hyp"},
    {angle:0,known:"adj",val:8,known2:"opp",val2:6,find:"angle",label:"adj=8, opp=6, find θ"},
    {angle:38,known:"opp",val:7.2,find:"adj",label:"θ=38°, opp=7.2, find adj"},
  ]
};

function initSOH(){
  // Source tabs
  document.querySelectorAll(".soh-source-bar .eq-src-btn").forEach(function(btn){
    btn.onclick=function(){
      document.querySelectorAll(".soh-source-bar .eq-src-btn").forEach(function(b){b.classList.remove("active")});
      this.classList.add("active");
      var s=this.dataset.ssrc;
      document.getElementById("sohManualPanel").style.display=s==="manual"?"block":"none";
      document.getElementById("sExStrip").style.display=s==="exercises"?"block":"none";
      document.getElementById("sCsvStrip").style.display=s==="csv"?"block":"none";
      document.getElementById("sPanelCsv").style.display=s==="csv"?"block":"none";
      if(s==="exercises")renderSExList("easy");
    }
  });

  // Type toggle
  document.querySelectorAll(".soh-type-btn").forEach(function(btn){
    btn.onclick=function(){
      document.querySelectorAll(".soh-type-btn").forEach(function(b){b.classList.remove("active")});
      this.classList.add("active");
      soh.findType=this.dataset.stype;
      updateManualUI();
    }
  });

  // Difficulty
  var diffBtns=document.querySelectorAll(".soh-source-bar").length; // reuse ex-diff if present
  document.addEventListener("click",function(e){
    if(e.target.classList.contains("soh-diff")){
      document.querySelectorAll(".soh-diff").forEach(function(b){b.classList.remove("active")});
      e.target.classList.add("active");
      renderSExList(e.target.dataset.sdiff);
    }
  });

  // Go button
  document.getElementById("sohGoBtn").onclick=startSOH;

  // Check buttons
  document.getElementById("sohCheckLabels").onclick=checkLabels;
  document.getElementById("sohCheckAnswer").onclick=checkAnswer;
  document.getElementById("sohHintBtn").onclick=showSOHHint;
  document.getElementById("sohRevealBtn").onclick=revealSOHSolution;

  // Ratio buttons
  ["sohPickSin","sohPickCos","sohPickTan"].forEach(function(id){
    document.getElementById(id).onclick=function(){pickRatio(this.dataset.ratio)}
  });

  // CSV
  document.getElementById("sCsvFile").onchange=function(e){
    var f=e.target.files[0];if(!f)return;
    var r=new FileReader();r.onload=function(ev){
      var lines=ev.target.result.split("\n").filter(function(l){return l.trim()});
      soh.exercises=[];
      lines.forEach(function(line){
        var p=line.split(",").map(function(s){return s.trim()});
        if(p.length>=4){
          soh.exercises.push({angle:parseFloat(p[0]),known:p[1],val:parseFloat(p[2]),find:p[3],label:"θ="+p[0]+"°,"+p[1]+"="+p[2]+",find "+p[3]});
        }
      });
      renderSCsvList();
    };r.readAsText(f)};

  // Render explanation equations
  try{
    katex.render("\\sin(\\theta) = \\frac{\\text{Opposite}}{\\text{Hypotenuse}}", document.getElementById("sohEqSinKatex"), {displayMode:true,throwOnError:false});
    katex.render("\\cos(\\theta) = \\frac{\\text{Adjacent}}{\\text{Hypotenuse}}", document.getElementById("sohEqCosKatex"), {displayMode:true,throwOnError:false});
    katex.render("\\tan(\\theta) = \\frac{\\text{Opposite}}{\\text{Adjacent}}", document.getElementById("sohEqTanKatex"), {displayMode:true,throwOnError:false});
  }catch(e){}

  renderSExList("easy");
  updateSOH();
}

function updateManualUI(){
  var fl=document.getElementById("sohFindLabel");
  var fs=document.getElementById("sohFindSide");
  if(soh.findType==="findAngle"){
    fl.textContent="Known side 2";
    fs.innerHTML='<option value="opp">Opposite</option><option value="adj">Adjacent</option><option value="hyp">Hypotenuse</option>';
  } else {
    fl.textContent="Find";
    fs.innerHTML='<option value="opp">Opposite</option><option value="adj">Adjacent</option><option value="hyp">Hypotenuse</option>';
  }
}

function startSOH(){
  var angle=parseFloat(document.getElementById("sohAngle").value)||35;
  var knownSide=document.getElementById("sohKnownSide").value;
  var knownVal=parseFloat(document.getElementById("sohKnownVal").value)||10;
  var findSide=document.getElementById("sohFindSide").value;

  if(soh.findType==="findAngle"){
    soh.angle=0;soh.side1=knownSide;soh.side1Val=knownVal;soh.side2=findSide;soh.side2Val=parseFloat(document.getElementById("sohKnownVal").value)||10;
    // For find angle, we need two sides — use knownSide+knownVal as side1, findSide as side2
    // Prompt user for side2 value via the knownVal field as primary and the answer as the angle
  } else {
    soh.angle=angle;soh.knownSide=knownSide;soh.knownVal=knownVal;soh.findSide=findSide;
  }

  soh.solving=true;soh.hintLevel=0;
  document.getElementById("sohSolveArea").style.display="block";
  document.getElementById("sohHintBox").style.display="none";
  document.getElementById("sohSolutionArea").style.display="none";
  clearSOHFeedback();

  // Reset ratio selection
  document.querySelectorAll(".soh-ratio-btn").forEach(function(b){b.className="soh-ratio-btn"});

  // Update answer label
  if(soh.findType==="findAngle"){
    document.getElementById("sohAnswerLabel").textContent="θ =";
    document.getElementById("sohSolvePrompt").textContent="Calculate the angle (in degrees):";
  } else {
    document.getElementById("sohAnswerLabel").textContent=soh.findSide+" =";
    document.getElementById("sohSolvePrompt").textContent="Calculate the missing side:";
  }

  highlightActiveRatio();
  updateSOH();
}

function highlightActiveRatio(){
  var r=getCorrectRatio();
  var ids={sin:"sohEqSOH",cos:"sohEqCAH",tan:"sohEqTOA"};
  for(var k in ids){
    var el=document.getElementById(ids[k]);
    if(k===r){
      el.style.outline="2px solid "+(k==="sin"?"#ef4444":k==="cos"?"#3b82f6":"#f59e0b");
      el.style.outlineOffset="2px";
    } else {
      el.style.outline="none";
      el.style.outlineOffset="0";
    }
  }
}

function loadSOHExercise(ex){
  if(ex.find==="angle"){
    soh.findType="findAngle";
    document.querySelectorAll(".soh-type-btn").forEach(function(b){b.classList.remove("active")});
    document.getElementById("sTypeAngle").classList.add("active");
    document.getElementById("sohAngle").value=0;
    document.getElementById("sohKnownSide").value=ex.known;
    document.getElementById("sohKnownVal").value=ex.val;
    document.getElementById("sohFindSide").value=ex.known2||"hyp";
  } else {
    soh.findType="findSide";
    document.querySelectorAll(".soh-type-btn").forEach(function(b){b.classList.remove("active")});
    document.getElementById("sTypeSide").classList.add("active");
    document.getElementById("sohAngle").value=ex.angle;
    document.getElementById("sohKnownSide").value=ex.known;
    document.getElementById("sohKnownVal").value=ex.val;
    document.getElementById("sohFindSide").value=ex.find;
  }
  startSOH();
}

function clearSOHFeedback(){
  ["sohLabelFeedback","sohRatioFeedback","sohAnswerFeedback"].forEach(function(id){
    var el=document.getElementById(id);el.textContent="";el.className="qw-feedback"});
  document.getElementById("sohAnswer").value="";
  ["sohLabelOpp","sohLabelAdj","sohLabelHyp"].forEach(function(id){document.getElementById(id).value=""});
}

// ── Draw triangle ──
function updateSOH(){drawTriangle()}

function drawTriangle(){
  var cv=document.getElementById("sohCanvas");
  if(!cv)return;
  var rect=cv.getBoundingClientRect();
  if(rect.width<10||rect.height<10)return; // not visible yet
  var ctx=cv.getContext("2d");
  var dpr=window.devicePixelRatio||1;
  cv.width=rect.width*dpr;cv.height=rect.height*dpr;ctx.scale(dpr,dpr);
  var W=rect.width,H=rect.height;ctx.clearRect(0,0,W,H);

  var angle=soh.angle||35;
  var rad=angle*Math.PI/180;
  if(angle<=0||angle>=90)rad=35*Math.PI/180;

  // Triangle with more margin on left for labels
  var mL=100,mR=60,mT=50,mB=70;
  var baseLen=W-mL-mR;
  var maxH=H-mT-mB;
  var triH=Math.min(baseLen*Math.tan(rad),maxH);
  var triW=triH/Math.tan(rad);
  if(triW>baseLen){triW=baseLen;triH=triW*Math.tan(rad)}

  // Right angle at bottom-left, θ at bottom-right
  var ax=mL, ay=H-mB;          // bottom-left (90°)
  var bx=mL+triW, by=H-mB;     // bottom-right (θ)
  var cx=mL, cy=H-mB-triH;     // top-left

  // Fill
  ctx.fillStyle="rgba(244,63,94,.04)";
  ctx.beginPath();ctx.moveTo(ax,ay);ctx.lineTo(bx,by);ctx.lineTo(cx,cy);ctx.closePath();ctx.fill();

  // Right angle marker
  var sq=14;
  ctx.strokeStyle="#4a5a78";ctx.lineWidth=1.5;
  ctx.beginPath();ctx.moveTo(ax+sq,ay);ctx.lineTo(ax+sq,ay-sq);ctx.lineTo(ax,ay-sq);ctx.stroke();

  // Adjacent (bottom) — blue
  ctx.strokeStyle="#3b82f6";ctx.lineWidth=3;
  ctx.beginPath();ctx.moveTo(ax,ay);ctx.lineTo(bx,by);ctx.stroke();

  // Opposite (left) — red
  ctx.strokeStyle="#ef4444";ctx.lineWidth=3;
  ctx.beginPath();ctx.moveTo(ax,ay);ctx.lineTo(cx,cy);ctx.stroke();

  // Hypotenuse (diagonal) — green
  ctx.strokeStyle="#10b981";ctx.lineWidth=3;
  ctx.beginPath();ctx.moveTo(bx,by);ctx.lineTo(cx,cy);ctx.stroke();

  // Angle arc at bottom-right (θ)
  ctx.strokeStyle="#f43f5e";ctx.lineWidth=2;
  var arcR=Math.min(35, triW*0.15);
  // Arc from π (pointing left along base) going counter-clockwise by the angle
  ctx.beginPath();ctx.arc(bx,by,arcR,Math.PI,Math.PI+rad,true);ctx.stroke();

  // θ label — position inside the arc
  var midArc=Math.PI+rad/2;
  var labelR=arcR+16;
  ctx.fillStyle="#f43f5e";ctx.font="bold 15px 'Outfit',sans-serif";ctx.textAlign="center";ctx.textBaseline="middle";
  ctx.fillText("θ",bx+labelR*Math.cos(midArc),by+labelR*Math.sin(midArc));
  if(soh.angle>0){
    ctx.font="bold 12px 'JetBrains Mono',monospace";
    ctx.fillText(soh.angle+"°",bx+(labelR+16)*Math.cos(midArc),by+(labelR+16)*Math.sin(midArc));
  }

  // ── Side labels ──
  ctx.font="bold 13px 'Outfit',sans-serif";

  // Adjacent (bottom) — blue, centered below base
  ctx.fillStyle="#3b82f6";ctx.textAlign="center";ctx.textBaseline="top";
  var adjLabel="Adjacent (a)";
  if(soh.solving&&soh.knownSide==="adj")adjLabel="a = "+fn2(soh.knownVal);
  else if(soh.solving&&soh.findSide==="adj")adjLabel="a = ?";
  ctx.fillText(adjLabel,(ax+bx)/2,ay+12);

  // Opposite (left) — red, to the left of the vertical side, rotated vertically
  ctx.fillStyle="#ef4444";
  var oppLabel="Opposite (b)";
  if(soh.solving&&soh.knownSide==="opp")oppLabel="b = "+fn2(soh.knownVal);
  else if(soh.solving&&soh.findSide==="opp")oppLabel="b = ?";
  var oppMidY=(ay+cy)/2;
  ctx.save();
  ctx.translate(ax-16, oppMidY);
  ctx.rotate(-Math.PI/2);
  ctx.textAlign="center";ctx.textBaseline="bottom";
  ctx.fillText(oppLabel, 0, 0);
  ctx.restore();

  // Hypotenuse (diagonal) — green, along the hypotenuse but readable
  ctx.fillStyle="#10b981";
  var hypLabel="Hypotenuse (c)";
  if(soh.solving&&soh.knownSide==="hyp")hypLabel="c = "+fn2(soh.knownVal);
  else if(soh.solving&&soh.findSide==="hyp")hypLabel="c = ?";
  var midHx=(bx+cx)/2, midHy=(by+cy)/2;
  // Angle of hypotenuse line from B to C
  var dx=cx-bx, dy=cy-by;
  var hypAng=Math.atan2(dy,dx);
  // Ensure text is not upside down: if angle makes text flip, add π
  if(hypAng<-Math.PI/2||hypAng>Math.PI/2)hypAng+=Math.PI;
  ctx.save();
  ctx.translate(midHx, midHy);
  ctx.rotate(hypAng);
  ctx.textAlign="center";ctx.textBaseline="bottom";
  ctx.fillText(hypLabel, 0, -8);
  ctx.restore();

  // 90° label
  ctx.fillStyle="#4a5a78";ctx.font="11px 'JetBrains Mono',monospace";ctx.textAlign="left";ctx.textBaseline="top";
  ctx.fillText("90°",ax+sq+4,ay-sq-14);
}

function fn2(n){return n%1===0?String(n):parseFloat(n.toFixed(2)).toString()}

// ── Check labels ──
function checkLabels(){
  var fb=document.getElementById("sohLabelFeedback");
  var o=document.getElementById("sohLabelOpp").value;
  var a=document.getElementById("sohLabelAdj").value;
  var h=document.getElementById("sohLabelHyp").value;

  // Correct: opp=b (left vertical), adj=a (bottom), hyp=c (diagonal)
  var msgs=[];
  if(o==="b")msgs.push('<span style="color:#34d399">✓ Opposite correct</span>');
  else if(o)msgs.push('<span style="color:#ef4444">✗ Opposite incorrect</span>');

  if(a==="a")msgs.push('<span style="color:#34d399">✓ Adjacent correct</span>');
  else if(a)msgs.push('<span style="color:#ef4444">✗ Adjacent incorrect — it\'s next to θ</span>');

  if(h==="c")msgs.push('<span style="color:#34d399">✓ Hypotenuse correct</span>');
  else if(h)msgs.push('<span style="color:#ef4444">✗ Hypotenuse incorrect — longest side, opposite 90°</span>');

  fb.innerHTML=msgs.join(" &nbsp; ");
  fb.className="qw-feedback "+(o==="b"&&a==="a"&&h==="c"?"correct":"partial");
}

// ── Pick ratio ──
function pickRatio(ratio){
  document.querySelectorAll(".soh-ratio-btn").forEach(function(b){b.className="soh-ratio-btn"});
  var btn=document.getElementById("sohPick"+ratio.charAt(0).toUpperCase()+ratio.slice(1));

  // Determine correct ratio
  var correct=getCorrectRatio();
  var fb=document.getElementById("sohRatioFeedback");

  if(ratio===correct){
    btn.classList.add("selected","correct");
    fb.innerHTML='<span style="color:#34d399">✓ Correct! Use '+ratio.toUpperCase()+'</span>';
    fb.className="qw-feedback correct";
    highlightActiveRatio();
    showFormula(ratio);
  } else {
    btn.classList.add("selected","incorrect");
    fb.innerHTML='<span style="color:#ef4444">✗ Not this one — think about which sides you have and need</span>';
    fb.className="qw-feedback incorrect";
  }
}

function getCorrectRatio(){
  var sides=[soh.knownSide,soh.findSide];
  var hasO=sides.indexOf("opp")>=0;
  var hasA=sides.indexOf("adj")>=0;
  var hasH=sides.indexOf("hyp")>=0;

  if(soh.findType==="findAngle"){
    sides=[soh.side1,soh.side2];
    hasO=sides.indexOf("opp")>=0;hasA=sides.indexOf("adj")>=0;hasH=sides.indexOf("hyp")>=0;
  }

  if(hasO&&hasH)return"sin";
  if(hasA&&hasH)return"cos";
  if(hasO&&hasA)return"tan";
  return"sin"; // fallback
}

function showFormula(ratio){
  var el=document.getElementById("sohFormulaDisplay");
  var angle=soh.angle;
  var known=soh.knownVal;
  var kSide=soh.knownSide;
  var fSide=soh.findSide;

  var latex="";
  if(soh.findType==="findSide"){
    if(ratio==="sin"){
      if(fSide==="opp")latex="\\sin("+angle+"°) = \\frac{\\text{opp}}{"+fn2(known)+"} \\quad\\Rightarrow\\quad \\text{opp} = "+fn2(known)+" \\times \\sin("+angle+"°)";
      else latex="\\sin("+angle+"°) = \\frac{"+fn2(known)+"}{\\text{hyp}} \\quad\\Rightarrow\\quad \\text{hyp} = \\frac{"+fn2(known)+"}{\\sin("+angle+"°)}";
    } else if(ratio==="cos"){
      if(fSide==="adj")latex="\\cos("+angle+"°) = \\frac{\\text{adj}}{"+fn2(known)+"} \\quad\\Rightarrow\\quad \\text{adj} = "+fn2(known)+" \\times \\cos("+angle+"°)";
      else latex="\\cos("+angle+"°) = \\frac{"+fn2(known)+"}{\\text{hyp}} \\quad\\Rightarrow\\quad \\text{hyp} = \\frac{"+fn2(known)+"}{\\cos("+angle+"°)}";
    } else {
      if(fSide==="opp")latex="\\tan("+angle+"°) = \\frac{\\text{opp}}{"+fn2(known)+"} \\quad\\Rightarrow\\quad \\text{opp} = "+fn2(known)+" \\times \\tan("+angle+"°)";
      else latex="\\tan("+angle+"°) = \\frac{"+fn2(known)+"}{\\text{adj}} \\quad\\Rightarrow\\quad \\text{adj} = \\frac{"+fn2(known)+"}{\\tan("+angle+"°)}";
    }
  } else {
    latex="\\theta = "+ratio+"^{-1}\\left(\\frac{\\text{"+soh.side1+"}}{\\text{"+soh.side2+"}}\\right)";
  }

  try{katex.render(latex,el,{displayMode:true,throwOnError:false})}catch(e){el.textContent=latex}
}

// ── Check answer ──
function checkAnswer(){
  var ans=parseFloat(document.getElementById("sohAnswer").value);
  var fb=document.getElementById("sohAnswerFeedback");
  if(isNaN(ans)){fb.textContent="Enter a number";fb.className="qw-feedback partial";return}

  var correct=calcCorrectAnswer();
  if(correct===null){fb.textContent="Check your setup";fb.className="qw-feedback partial";return}

  if(Math.abs(ans-correct)<0.1){
    fb.innerHTML='🎉 <strong>Correct!</strong> The answer is '+fn2(correct);
    fb.className="qw-feedback correct";
  } else if(Math.abs(ans-correct)<1){
    fb.innerHTML='Close! Check your rounding — answer is approximately '+fn2(correct);
    fb.className="qw-feedback partial";
  } else {
    fb.innerHTML='✗ Not quite — try again';
    fb.className="qw-feedback incorrect";
  }
}

function calcCorrectAnswer(){
  var a=soh.angle,rad=a*Math.PI/180;
  var k=soh.knownVal,ks=soh.knownSide,fs=soh.findSide;

  if(soh.findType==="findSide"){
    if(ks==="hyp"){
      if(fs==="opp")return k*Math.sin(rad);
      if(fs==="adj")return k*Math.cos(rad);
    }
    if(ks==="opp"){
      if(fs==="hyp")return k/Math.sin(rad);
      if(fs==="adj")return k/Math.tan(rad);
    }
    if(ks==="adj"){
      if(fs==="hyp")return k/Math.cos(rad);
      if(fs==="opp")return k*Math.tan(rad);
    }
  }
  return null;
}

// ── Hints ──
function showSOHHint(){
  var box=document.getElementById("sohHintBox");box.style.display="block";
  soh.hintLevel++;
  var ks=soh.knownSide,fs=soh.findSide;

  if(soh.hintLevel===1){
    box.innerHTML='<strong>Hint 1:</strong> First, identify the sides relative to angle θ. The <span style="color:#ef4444">opposite</span> is across from θ, the <span style="color:#3b82f6">adjacent</span> is next to θ, and the <span style="color:#10b981">hypotenuse</span> is the longest side (opposite the right angle).';
  } else if(soh.hintLevel===2){
    box.innerHTML='<strong>Hint 2:</strong> You know the <strong>'+ks+'</strong> and need the <strong>'+fs+'</strong>. Which ratio connects these two sides?<br><strong>SOH</strong>: sin = O/H &nbsp; <strong>CAH</strong>: cos = A/H &nbsp; <strong>TOA</strong>: tan = O/A';
  } else if(soh.hintLevel===3){
    var r=getCorrectRatio();
    box.innerHTML='<strong>Hint 3:</strong> The correct ratio is <strong>'+r.toUpperCase()+'</strong> because you have '+ks+' and need '+fs+'.';
  } else if(soh.hintLevel===4){
    var ans=calcCorrectAnswer();
    box.innerHTML='<strong>Hint 4:</strong> The answer is approximately <strong>'+fn2(ans)+'</strong>';
    soh.hintLevel=4;
  }
}

function revealSOHSolution(){
  var area=document.getElementById("sohSolutionArea");
  if(area.style.display==="none"){
    area.style.display="block";
    document.getElementById("sohRevealBtn").textContent="🙈 Hide";
    var r=getCorrectRatio();var ans=calcCorrectAnswer();
    area.innerHTML='<div class="qw-title" style="color:#f43f5e">Full Solution</div>'+
      '<div class="quad-step"><span class="qs-num" style="background:#f43f5e">1</span>Identify: known = <strong>'+soh.knownSide+' = '+fn2(soh.knownVal)+'</strong>, find = <strong>'+soh.findSide+'</strong></div>'+
      '<div class="quad-step"><span class="qs-num" style="background:#f43f5e">2</span>Ratio: <strong>'+r.toUpperCase()+'</strong> ('+r+' = '+(r==="sin"?"O/H":r==="cos"?"A/H":"O/A")+')</div>'+
      '<div class="quad-step"><span class="qs-num" style="background:#f43f5e">3</span>Answer: <strong>'+fn2(ans)+'</strong></div>';
  } else {
    area.style.display="none";
    document.getElementById("sohRevealBtn").textContent="👁 Show Solution";
  }
}

// ── Exercise lists ──
function renderSExList(diff){
  var list=SOH_EX[diff]||[];soh.exercises=list;
  var el=document.getElementById("sExList");el.innerHTML="";
  // Add diff buttons if not there
  if(!el.previousElementSibling||!el.previousElementSibling.classList.contains("ex-diff-row")){
    var dr=document.createElement("div");dr.className="ex-diff-row";dr.style.marginBottom="4px";
    dr.innerHTML='<button class="ex-diff-btn soh-diff active" data-sdiff="easy">Easy</button><button class="ex-diff-btn soh-diff" data-sdiff="medium">Medium</button><button class="ex-diff-btn soh-diff" data-sdiff="hard">Hard</button>';
    el.parentNode.insertBefore(dr,el);
  }
  list.forEach(function(ex){
    var it=document.createElement("div");it.className="ex-item";
    it.innerHTML='<span class="ex-eq">'+ex.label+'</span><span class="ex-badge '+diff+'">'+diff+'</span>';
    it.onclick=function(){loadSOHExercise(ex)};el.appendChild(it)});
}

function renderSCsvList(){
  var el=document.getElementById("sCsvList");el.innerHTML="";
  soh.exercises.forEach(function(ex,i){
    var it=document.createElement("div");it.className="ex-item";
    it.innerHTML='<span class="ex-eq">'+ex.label+'</span><span class="ex-badge">#'+(i+1)+'</span>';
    it.onclick=function(){loadSOHExercise(ex)};el.appendChild(it)});
}
