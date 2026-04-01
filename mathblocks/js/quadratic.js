// ═══════════════════════════════════════════════
// Quadratic Equations — Student-driven solving
// ═══════════════════════════════════════════════

var qd={exercises:[],exIndex:0,hintLevel:0};

var Q_EX={
  easy:[
    {a:1,b:-3,c:2,label:"x²−3x+2=0"},{a:1,b:-5,c:6,label:"x²−5x+6=0"},
    {a:1,b:2,c:-3,label:"x²+2x−3=0"},{a:1,b:-4,c:4,label:"x²−4x+4=0"},
    {a:1,b:0,c:-9,label:"x²−9=0"},{a:1,b:-6,c:5,label:"x²−6x+5=0"},
    {a:1,b:1,c:-6,label:"x²+x−6=0"},{a:1,b:-2,c:0,label:"x²−2x=0"},
  ],
  medium:[
    {a:2,b:-7,c:3,label:"2x²−7x+3=0"},{a:3,b:1,c:-2,label:"3x²+x−2=0"},
    {a:2,b:-4,c:-6,label:"2x²−4x−6=0"},{a:1,b:-1,c:-12,label:"x²−x−12=0"},
    {a:4,b:-12,c:9,label:"4x²−12x+9=0"},{a:2,b:5,c:-3,label:"2x²+5x−3=0"},
    {a:3,b:-6,c:0,label:"3x²−6x=0"},{a:1,b:4,c:4,label:"x²+4x+4=0"},
  ],
  hard:[
    {a:3,b:-3,c:2,label:"3x²−3x+2=0"},{a:5,b:2,c:-3,label:"5x²+2x−3=0"},
    {a:2,b:-10,c:12,label:"2x²−10x+12=0"},{a:6,b:1,c:-2,label:"6x²+x−2=0"},
    {a:1,b:0,c:4,label:"x²+4=0"},{a:4,b:-8,c:3,label:"4x²−8x+3=0"},
    {a:3,b:7,c:-6,label:"3x²+7x−6=0"},{a:2,b:3,c:5,label:"2x²+3x+5=0"},
  ]
};

function initQuadratic(){
  ["quadA","quadB","quadC"].forEach(function(id){document.getElementById(id).addEventListener("input",function(){qd.hintLevel=0;hideQSolution();updateQuadratic()})});

  document.querySelectorAll(".quad-source-bar .eq-src-btn").forEach(function(btn){
    btn.onclick=function(){
      document.querySelectorAll(".quad-source-bar .eq-src-btn").forEach(function(b){b.classList.remove("active")});
      this.classList.add("active");
      var s=this.dataset.qsrc;
      document.getElementById("qPanelManual").style.display=s==="manual"?"inline-flex":"none";
      document.getElementById("qPanelExercises").style.display=s==="exercises"?"flex":"none";
      document.getElementById("qPanelCsv").style.display=s==="csv"?"flex":"none";
      document.getElementById("qExStrip").style.display=s==="exercises"?"block":"none";
      document.getElementById("qCsvStrip").style.display=s==="csv"?"block":"none";
      if(s==="exercises")renderQExList("easy");
    }
  });

  document.querySelectorAll(".qd-diff").forEach(function(btn){
    btn.onclick=function(){document.querySelectorAll(".qd-diff").forEach(function(b){b.classList.remove("active")});this.classList.add("active");renderQExList(this.dataset.qdiff)}
  });

  document.getElementById("qCsvFile").onchange=function(e){
    var f=e.target.files[0];if(!f)return;
    var r=new FileReader();r.onload=function(ev){
      var lines=ev.target.result.split("\n").filter(function(l){return l.trim()});
      qd.exercises=[];
      lines.forEach(function(line){var p=line.split(",").map(function(s){return parseFloat(s.trim())});if(p.length>=3&&!isNaN(p[0]))qd.exercises.push({a:p[0],b:p[1],c:p[2],label:qTermS(p[0],p[1],p[2])+"=0"})});
      renderQCsvList()};r.readAsText(f)};

  // Check buttons
  document.getElementById("qCheckDiscBtn").onclick=checkDiscriminant;
  document.getElementById("qCheckSolBtn").onclick=checkSolutions;
  document.getElementById("qHintBtn").onclick=showQHint;
  document.getElementById("qRevealBtn").onclick=revealSolution;

  renderQExList("easy");
  updateQuadratic();
}

function loadQuadEq(a,b,c){
  document.getElementById("quadA").value=a;document.getElementById("quadB").value=b;document.getElementById("quadC").value=c;
  // Clear student inputs
  ["qStudA","qStudB","qStudC","qStudDisc","qStudX1","qStudX2"].forEach(function(id){document.getElementById(id).value=""});
  document.getElementById("qDiscFeedback").textContent="";document.getElementById("qDiscFeedback").className="qw-feedback";
  document.getElementById("qSolFeedback").textContent="";document.getElementById("qSolFeedback").className="qw-feedback";
  qd.hintLevel=0;
  hideQSolution();
  updateQuadratic();
}

function hideQSolution(){
  document.getElementById("qSolutionArea").style.display="none";
  document.getElementById("qHintBox").style.display="none";
  document.getElementById("qRevealBtn").textContent="👁 Show Full Solution";
}

function renderQExList(diff){
  var list=Q_EX[diff]||[];qd.exercises=list;
  var el=document.getElementById("qExList");el.innerHTML="";
  list.forEach(function(ex){
    var it=document.createElement("div");it.className="ex-item";
    it.innerHTML='<span class="ex-eq">'+ex.label+'</span><span class="ex-badge '+diff+'">'+diff+'</span>';
    it.onclick=function(){loadQuadEq(ex.a,ex.b,ex.c)};el.appendChild(it)});
}
function renderQCsvList(){
  var el=document.getElementById("qCsvList");el.innerHTML="";
  qd.exercises.forEach(function(ex,i){
    var it=document.createElement("div");it.className="ex-item";
    it.innerHTML='<span class="ex-eq">'+ex.label+'</span><span class="ex-badge">#'+(i+1)+'</span>';
    it.onclick=function(){loadQuadEq(ex.a,ex.b,ex.c)};el.appendChild(it)});
}
function qTermS(a,b,c){
  var p=[];if(a!==0){if(a===1)p.push("x²");else if(a===-1)p.push("-x²");else p.push(qn(a)+"x²")}
  if(b!==0){if(p.length>0&&b>0)p.push("+");if(b===1)p.push("x");else if(b===-1)p.push("-x");else p.push(qn(b)+"x")}
  if(c!==0){if(p.length>0&&c>0)p.push("+");p.push(qn(c))}return p.length===0?"0":p.join("")}

// ── Check student answers ──
function checkDiscriminant(){
  var a=pqf("quadA"),b=pqf("quadB"),c=pqf("quadC");
  var sa=parseFloat(document.getElementById("qStudA").value);
  var sb=parseFloat(document.getElementById("qStudB").value);
  var sc=parseFloat(document.getElementById("qStudC").value);
  var sd=parseFloat(document.getElementById("qStudDisc").value);
  var disc=b*b-4*a*c;
  var fb=document.getElementById("qDiscFeedback");

  var html=[];

  // Check a, b, c
  var aOk=!isNaN(sa)&&Math.abs(sa-a)<0.01;
  var bOk=!isNaN(sb)&&Math.abs(sb-b)<0.01;
  var cOk=!isNaN(sc)&&Math.abs(sc-c)<0.01;

  if(isNaN(sa)&&isNaN(sb)&&isNaN(sc)){
    fb.innerHTML="Enter your values for a, b, c first";fb.className="qw-feedback partial";return;
  }

  if(aOk&&bOk&&cOk){
    html.push('<span style="color:#34d399">✓ a, b, c all correct!</span>');
  } else {
    if(!isNaN(sa)){html.push(aOk?'<span style="color:#34d399">✓ a correct</span>':'<span style="color:#ef4444">✗ a incorrect</span>')}
    if(!isNaN(sb)){html.push(bOk?'<span style="color:#34d399">✓ b correct</span>':'<span style="color:#ef4444">✗ b incorrect — remember the sign!</span>')}
    if(!isNaN(sc)){html.push(cOk?'<span style="color:#34d399">✓ c correct</span>':'<span style="color:#ef4444">✗ c incorrect</span>')}
  }

  // Show student's discriminant working if they entered a,b,c
  if(!isNaN(sa)&&!isNaN(sb)&&!isNaN(sc)){
    var studDisc=sb*sb-4*sa*sc;
    html.push('<br><span style="color:#6b7fa3;font-size:11px">With your a,b,c: b²−4ac = ('+qn(sb)+')²−4('+qn(sa)+')('+qn(sc)+') = '+qn(sb*sb)+'−'+qn(4*sa*sc)+' = <strong>'+qn(studDisc)+'</strong></span>');

    // If discriminant entered, check it
    if(!isNaN(sd)){
      if(aOk&&bOk&&cOk){
        // Correct a,b,c — check against real discriminant
        if(Math.abs(sd-disc)<0.01){
          html.push('<br><span style="color:#34d399;font-weight:700">✓ Discriminant correct! ('+qn(disc)+')</span>');
          // Auto-fill it
          document.getElementById("qStudDisc").value=qn(disc);
        } else {
          html.push('<br><span style="color:#ef4444">✗ Discriminant incorrect — should be '+qn(disc)+'</span>');
        }
      } else {
        // Wrong a,b,c — check if their disc matches their own a,b,c
        if(Math.abs(sd-studDisc)<0.01){
          html.push('<br><span style="color:#f59e0b">Your discriminant matches your a,b,c — but fix a,b,c first!</span>');
        } else {
          html.push('<br><span style="color:#ef4444">✗ Discriminant doesn\'t match even your entered a,b,c</span>');
        }
      }
    } else {
      html.push('<br><span style="color:#6b7fa3;font-size:11px">Now enter the discriminant value above and check again</span>');
    }
  }

  fb.innerHTML=html.join("  ");
  fb.className="qw-feedback "+(aOk&&bOk&&cOk&&!isNaN(sd)&&Math.abs(sd-disc)<0.01?"correct":"partial");
}

function checkSolutions(){
  var a=pqf("quadA"),b=pqf("quadB"),c=pqf("quadC");
  var disc=b*b-4*a*c;
  var fb=document.getElementById("qSolFeedback");
  var sx1=parseFloat(document.getElementById("qStudX1").value);
  var sx2=parseFloat(document.getElementById("qStudX2").value);

  if(a===0){fb.textContent="This is linear, not quadratic";fb.className="qw-feedback partial";return}
  if(disc<-0.001){
    fb.textContent=(document.getElementById("qStudX1").value===""&&document.getElementById("qStudX2").value==="")?"Correct — no real solutions exist! ✓":"No real solutions exist (discriminant is negative)";
    fb.className="qw-feedback "+(document.getElementById("qStudX1").value===""?"correct":"incorrect");return}

  var roots=[];
  if(disc>0.001){var sq=Math.sqrt(disc);roots=[(-b+sq)/(2*a),(-b-sq)/(2*a)]}
  else{roots=[-b/(2*a)]}

  if(isNaN(sx1)&&isNaN(sx2)){fb.textContent="Enter your solutions";fb.className="qw-feedback partial";return}

  var correct=0;
  roots.forEach(function(r){
    if((!isNaN(sx1)&&Math.abs(sx1-r)<0.01)||(!isNaN(sx2)&&Math.abs(sx2-r)<0.01))correct++;
  });

  if(correct===roots.length){
    fb.textContent="🎉 All solutions correct!";fb.className="qw-feedback correct";
  }else if(correct>0){
    fb.textContent="Partially correct — "+correct+"/"+roots.length+" solutions found";fb.className="qw-feedback partial";
  }else{
    fb.textContent="✗ Not correct — try again";fb.className="qw-feedback incorrect";
  }
}

function pqf(id){return parseFloat(document.getElementById(id).value)||0}

// ── Hints (progressive) ──
function showQHint(){
  var a=pqf("quadA"),b=pqf("quadB"),c=pqf("quadC");
  var disc=b*b-4*a*c;
  var box=document.getElementById("qHintBox");box.style.display="block";
  qd.hintLevel++;

  if(qd.hintLevel===1){
    box.innerHTML='<strong>Hint 1:</strong> Look at the equation. The coefficient of x² is <strong>a</strong>, the coefficient of x is <strong>b</strong>, and the constant is <strong>c</strong>. Be careful with signs!';
  }else if(qd.hintLevel===2){
    box.innerHTML='<strong>Hint 2:</strong> For this equation: <strong>a = '+qn(a)+'</strong>, <strong>b = '+qn(b)+'</strong>, <strong>c = '+qn(c)+'</strong>';
  }else if(qd.hintLevel===3){
    box.innerHTML='<strong>Hint 3:</strong> The discriminant formula is <strong>b² − 4ac</strong>. Substitute your values: ('+qn(b)+')² − 4('+qn(a)+')('+qn(c)+') = '+qn(b*b)+' − '+qn(4*a*c)+' = <strong>'+qn(disc)+'</strong>';
  }else if(qd.hintLevel===4){
    if(disc>0.001)box.innerHTML='<strong>Hint 4:</strong> The discriminant is positive ('+qn(disc)+'), so there are <strong>two real roots</strong>. Use x = (−b ± √disc) / 2a';
    else if(Math.abs(disc)<=0.001)box.innerHTML='<strong>Hint 4:</strong> The discriminant is zero, so there is <strong>one repeated root</strong>. x = −b / 2a = '+qn(-b/(2*a));
    else box.innerHTML='<strong>Hint 4:</strong> The discriminant is negative ('+qn(disc)+'), so there are <strong>no real roots</strong>. Leave the solution boxes empty.';
  }else if(qd.hintLevel>=5){
    if(disc>0.001){var sq=Math.sqrt(disc);box.innerHTML='<strong>Hint 5:</strong> √'+qn(disc)+' = '+qn(sq)+'<br>x₁ = ('+qn(-b)+' + '+qn(sq)+') / '+qn(2*a)+' = <strong>'+qn((-b+sq)/(2*a))+'</strong><br>x₂ = ('+qn(-b)+' − '+qn(sq)+') / '+qn(2*a)+' = <strong>'+qn((-b-sq)/(2*a))+'</strong>'}
    else{box.innerHTML='<strong>Final hint:</strong> All hints given — try pressing "Show Full Solution" to see the complete working.'}
    qd.hintLevel=5;
  }
}

// ── Reveal full solution ──
function revealSolution(){
  var area=document.getElementById("qSolutionArea");
  if(area.style.display==="none"){
    area.style.display="block";
    document.getElementById("qRevealBtn").textContent="🙈 Hide Solution";
    var a=pqf("quadA"),b=pqf("quadB"),c=pqf("quadC");
    var disc=b*b-4*a*c;
    var roots=[];
    if(a!==0){
      if(disc>0.001){var sq=Math.sqrt(disc);roots=[{val:(-b+sq)/(2*a),label:qn((-b+sq)/(2*a))},{val:(-b-sq)/(2*a),label:qn((-b-sq)/(2*a))}]}
      else if(Math.abs(disc)<=0.001){roots=[{val:-b/(2*a),label:qn(-b/(2*a))}]}
    }
    showFormulaSteps(a,b,c,disc,roots);
    showDiscriminant(a,b,c,disc);
    showSolutions(a,b,c,disc,roots);
    showPlusMinusExplanation(a,b,c,disc,roots);
  }else{
    area.style.display="none";
    document.getElementById("qRevealBtn").textContent="👁 Show Full Solution";
  }
}

// ── Update (graph + katex only, no solution) ──
function updateQuadratic(){
  var a=pqf("quadA"),b=pqf("quadB"),c=pqf("quadC");
  renderQuadKatex(a,b,c);
  var disc=b*b-4*a*c;var roots=[];
  if(a!==0){
    if(disc>0.001){var sq=Math.sqrt(disc);roots=[{val:(-b+sq)/(2*a)},{val:(-b-sq)/(2*a)}]}
    else if(Math.abs(disc)<=0.001){roots=[{val:-b/(2*a)}]}
  }
  drawParabola(a,b,c,disc,roots);
}

function qn(n){if(n==null||isNaN(n))return"?";n=Math.round(n*10000)/10000;return n%1===0?String(n):parseFloat(n.toFixed(4)).toString()}

function renderQuadKatex(a,b,c){
  var p=[];
  if(a!==0){if(a===1)p.push("x^2");else if(a===-1)p.push("-x^2");else p.push(qn(a)+"x^2")}
  if(b!==0){if(p.length>0&&b>0)p.push("+");if(b===1)p.push("x");else if(b===-1)p.push("-x");else p.push(qn(b)+"x")}
  if(c!==0){if(p.length>0&&c>0)p.push("+");p.push(qn(c))}
  if(p.length===0)p.push("0");
  var el=document.getElementById("quadKatex");
  try{katex.render(p.join(" ")+" = 0",el,{displayMode:true,throwOnError:false})}catch(e){el.textContent=p.join(" ")+" = 0"}
}

// ── Draw Parabola (roots shown but NO labels with values) ──
function drawParabola(a,b,c,disc,roots){
  var cv=document.getElementById("quadCanvas");
  if(!cv)return;
  var rect=cv.getBoundingClientRect();
  if(rect.width<10||rect.height<10)return;
  var ctx=cv.getContext("2d");
  var dpr=window.devicePixelRatio||1;
  cv.width=rect.width*dpr;cv.height=rect.height*dpr;ctx.scale(dpr,dpr);
  var W=rect.width,H=rect.height;ctx.clearRect(0,0,W,H);

  if(a===0){ctx.fillStyle="#6b7fa3";ctx.font="14px 'Outfit',sans-serif";ctx.textAlign="center";ctx.fillText("Linear — not a parabola",W/2,H/2);return}

  var vx=-b/(2*a),vy=a*vx*vx+b*vx+c;
  var range=6;
  if(roots.length>0){var rV=roots.map(function(r){return r.val});var sp=Math.max.apply(null,rV)-Math.min.apply(null,rV);range=Math.max(range,sp+4,Math.abs(rV[0]-vx)+4)}
  var xMin=vx-range,xMax=vx+range;

  var yS=[];for(var sx=xMin;sx<=xMax;sx+=0.2)yS.push(a*sx*sx+b*sx+c);
  yS.push(0);yS.push(vy);
  var yDMin=Math.min.apply(null,yS),yDMax=Math.max.apply(null,yS);
  var yPad=Math.max(2,(yDMax-yDMin)*.15);
  var yMin=yDMin-yPad,yMax=yDMax+yPad;
  if(yMin>-1)yMin=-1;if(yMax<1)yMax=1;

  var pad=50;
  function tx(x){return pad+(x-xMin)/(xMax-xMin)*(W-2*pad)}
  function ty(y){return H-pad-(y-yMin)/(yMax-yMin)*(H-2*pad)}

  var xSt=calcStep(xMax-xMin),ySt=calcStep(yMax-yMin);

  // Grid
  ctx.strokeStyle="#151d2e";ctx.lineWidth=1;
  for(var gx=Math.ceil(xMin/xSt)*xSt;gx<=xMax;gx+=xSt){var px=tx(gx);ctx.beginPath();ctx.moveTo(px,pad);ctx.lineTo(px,H-pad);ctx.stroke()}
  for(var gy=Math.ceil(yMin/ySt)*ySt;gy<=yMax;gy+=ySt){var py=ty(gy);ctx.beginPath();ctx.moveTo(pad,py);ctx.lineTo(W-pad,py);ctx.stroke()}

  // Axes
  ctx.strokeStyle="#4a5a78";ctx.lineWidth=2;
  if(yMin<=0&&yMax>=0){var axY=ty(0);ctx.beginPath();ctx.moveTo(pad,axY);ctx.lineTo(W-pad,axY);ctx.stroke()}
  if(xMin<=0&&xMax>=0){var axX=tx(0);ctx.beginPath();ctx.moveTo(axX,pad);ctx.lineTo(axX,H-pad);ctx.stroke()}

  // Labels
  ctx.fillStyle="#4a5a78";ctx.font="11px 'JetBrains Mono',monospace";
  var aYP=(yMin<=0&&yMax>=0)?ty(0)+16:H-pad+16;
  ctx.textAlign="center";ctx.textBaseline="top";
  for(var lx=Math.ceil(xMin/xSt)*xSt;lx<=xMax;lx+=xSt){if(Math.abs(lx)<0.001)continue;ctx.fillText(sN(lx),tx(lx),aYP)}
  var aXP=(xMin<=0&&xMax>=0)?tx(0)-8:pad-8;
  ctx.textAlign="right";ctx.textBaseline="middle";
  for(var ly=Math.ceil(yMin/ySt)*ySt;ly<=yMax;ly+=ySt){if(Math.abs(ly)<0.001)continue;ctx.fillText(sN(ly),aXP,ty(ly))}

  ctx.fillStyle="#6b7fa3";ctx.font="bold 12px 'Outfit',sans-serif";
  if(xMin<=0&&xMax>=0){ctx.textAlign="left";ctx.textBaseline="bottom";ctx.fillText("y",tx(0)+6,pad-4)}
  ctx.textAlign="right";ctx.textBaseline="top";ctx.fillText("x",W-pad+4,(yMin<=0&&yMax>=0)?ty(0)-14:H-pad-14);

  // Curve
  ctx.strokeStyle="#06b6d4";ctx.lineWidth=3;ctx.beginPath();var st=false;
  for(var cx2=xMin;cx2<=xMax;cx2+=0.03){var cy2=a*cx2*cx2+b*cx2+c;var sx2=tx(cx2),sy2=ty(cy2);if(sy2<pad-20||sy2>H-pad+20){st=false;continue}if(!st){ctx.moveTo(sx2,sy2);st=true}else ctx.lineTo(sx2,sy2)}ctx.stroke();

  // Glow
  ctx.strokeStyle="rgba(6,182,212,.15)";ctx.lineWidth=10;ctx.beginPath();st=false;
  for(var cx3=xMin;cx3<=xMax;cx3+=0.05){var cy3=a*cx3*cx3+b*cx3+c;var sx3=tx(cx3),sy3=ty(cy3);if(sy3<pad-20||sy3>H-pad+20){st=false;continue}if(!st){ctx.moveTo(sx3,sy3);st=true}else ctx.lineTo(sx3,sy3)}ctx.stroke();

  // Root dots (NO value labels — student must work them out)
  roots.forEach(function(root){
    var rx=tx(root.val),ry=ty(0);
    ctx.fillStyle="#34d399";ctx.beginPath();ctx.arc(rx,ry,6,0,Math.PI*2);ctx.fill();
    ctx.strokeStyle="#fff";ctx.lineWidth=2;ctx.stroke();
  });

  // Vertex dot
  var vxp=tx(vx),vyp=ty(vy);
  ctx.fillStyle="#f59e0b";ctx.beginPath();ctx.arc(vxp,vyp,4,0,Math.PI*2);ctx.fill();

  // No real roots
  if(disc<-0.001){ctx.fillStyle="rgba(239,68,68,.6)";ctx.font="bold 13px 'Outfit',sans-serif";ctx.textAlign="center";ctx.textBaseline="top";ctx.fillText("No real roots",W/2,pad+6)}
}

function calcStep(r){var raw=r/8;var mag=Math.pow(10,Math.floor(Math.log10(raw)));var n=raw/mag;if(n<1.5)return mag;if(n<3.5)return 2*mag;if(n<7.5)return 5*mag;return 10*mag}
function sN(n){n=Math.round(n*100)/100;return n%1===0?String(n):n.toFixed(1)}

// ── Full solution steps (shown on reveal) ──
function showFormulaSteps(a,b,c,disc,roots){
  var el=document.getElementById("quadSteps");el.innerHTML="";
  if(a===0){addQS(el,1,"Linear (a=0): "+qn(b)+"x+"+qn(c)+"=0");if(b!==0)addQS(el,2,"<strong>x="+qn(-c/b)+"</strong>");return}
  addQS(el,1,"Identify: <strong>a="+qn(a)+"</strong>, <strong>b="+qn(b)+"</strong>, <strong>c="+qn(c)+"</strong>");
  var s2=document.createElement("div");s2.className="quad-step";s2.innerHTML='<span class="qs-num">2</span>Formula:<div class="qs-katex" id="qsF2"></div>';el.appendChild(s2);
  try{katex.render("x = \\frac{-b \\pm \\sqrt{b^2-4ac}}{2a}",document.getElementById("qsF2"),{displayMode:true,throwOnError:false})}catch(e){}
  var s3=document.createElement("div");s3.className="quad-step";s3.innerHTML='<span class="qs-num">3</span>Substitute:<div class="qs-katex" id="qsF3"></div>';el.appendChild(s3);
  try{katex.render("x=\\frac{-("+qn(b)+")\\pm\\sqrt{("+qn(b)+")^2-4("+qn(a)+")("+qn(c)+")}}{2("+qn(a)+")}",document.getElementById("qsF3"),{displayMode:true,throwOnError:false})}catch(e){}
  addQS(el,4,"Discriminant: <strong>"+qn(b*b)+"−"+qn(4*a*c)+" = "+qn(disc)+"</strong>");
  if(disc>0.001){
    addQS(el,5,"√"+qn(disc)+" = <strong>"+qn(Math.sqrt(disc))+"</strong>");
    var s6=document.createElement("div");s6.className="quad-step";s6.innerHTML='<span class="qs-num">6</span>Two solutions:<div class="qs-katex" id="qsS1"></div><div class="qs-katex" id="qsS2"></div>';el.appendChild(s6);
    try{katex.render("x_1=\\frac{"+qn(-b)+"+"+qn(Math.sqrt(disc))+"}{"+qn(2*a)+"}="+roots[0].label,document.getElementById("qsS1"),{throwOnError:false});
    katex.render("x_2=\\frac{"+qn(-b)+"-"+qn(Math.sqrt(disc))+"}{"+qn(2*a)+"}="+roots[1].label,document.getElementById("qsS2"),{throwOnError:false})}catch(e){}
  }else if(Math.abs(disc)<=0.001){
    addQS(el,5,"Disc=0 → <strong>one repeated root</strong>");
    var s5=document.createElement("div");s5.className="quad-step";s5.innerHTML='<span class="qs-num">6</span><div class="qs-katex" id="qsSR"></div>';el.appendChild(s5);
    try{katex.render("x=\\frac{"+qn(-b)+"}{"+qn(2*a)+"}="+roots[0].label,document.getElementById("qsSR"),{throwOnError:false})}catch(e){}
  }else{addQS(el,5,"Disc negative ("+qn(disc)+") → <strong>no real solutions</strong>")}
}
function addQS(p,n,h){var el=document.createElement("div");el.className="quad-step";el.innerHTML='<span class="qs-num">'+n+'</span>'+h;p.appendChild(el)}

function showDiscriminant(a,b,c,disc){
  var el=document.getElementById("quadDiscriminant");
  var cls=disc>0.001?"disc-positive":Math.abs(disc)<=0.001?"disc-zero":"disc-negative";
  var lbl=disc>0.001?"Positive → two roots":Math.abs(disc)<=0.001?"Zero → one root":"Negative → no real roots";
  el.innerHTML='<span style="font-size:12px;color:var(--dim)">b²−4ac =</span><span class="disc-val '+cls+'">'+qn(disc)+'</span><span style="font-size:11px;display:block;margin-top:4px;color:var(--dim)">'+lbl+'</span>'}

function showSolutions(a,b,c,disc,roots){
  var el=document.getElementById("quadSolutions");
  if(roots.length===2)el.innerHTML='<div class="sol-values">x₁ = '+roots[0].label+'&nbsp;&nbsp;&nbsp;x₂ = '+roots[1].label+'</div>';
  else if(roots.length===1)el.innerHTML='<div class="sol-values">x = '+roots[0].label+(a===0?" (linear)":" (repeated)")+'</div>';
  else el.innerHTML='<div class="sol-none">No real solutions</div>'}

function showPlusMinusExplanation(a,b,c,disc,roots){
  var el=document.getElementById("quadExplanation");
  if(a===0){el.innerHTML="Linear — only one solution.";return}
  var h='<strong>Why ± ?</strong><br><br>The formula uses a <span class="qe-highlight">square root</span>. Squaring hides the sign: (+3)²=9 and (−3)²=9. When reversing, both signs are possible.<br><br>';
  if(disc>0.001){h+='Disc = <span class="qe-highlight">'+qn(disc)+'</span> (positive). √'+qn(disc)+'='+qn(Math.sqrt(disc))+'.<br>+ gives x₁ = <strong>'+roots[0].label+'</strong>, − gives x₂ = <strong>'+roots[1].label+'</strong>.<br><br><strong>Graph:</strong> the parabola crosses the x-axis at <span class="qe-highlight">two points</span>.'}
  else if(Math.abs(disc)<=0.001){h+='Disc = <span class="qe-highlight">0</span>. √0=0, so ±0 gives the same answer: x = <strong>'+roots[0].label+'</strong>.<br><br><strong>Graph:</strong> the parabola <span class="qe-highlight">touches</span> the x-axis at exactly one point.'}
  else{h+='Disc = <span class="qe-highlight">'+qn(disc)+'</span> (negative). Can\'t √ a negative in ℝ.<br><br><strong>Graph:</strong> the parabola <span class="qe-highlight">never crosses</span> the x-axis.'}
  el.innerHTML=h}
