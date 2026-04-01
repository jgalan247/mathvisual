// ═══════════════════════════════════════════════
// Equation Balance
// Single variable: ax + b = cx + d
// Simultaneous: a1x + b1y = c1  AND  a2x + b2y = c2
// ═══════════════════════════════════════════════

var eq = {
  mode: "single", // "single" | "simul"
  // Single: eq1 is ax+b = cx+d  (stored as a,b,c,d)
  // Simul: eq1 is a1x+b1y=c1, eq2 is a2x+b2y=c2
  e1: {a:2,b:3,c:0,d:7},   // current working eq1
  e2: {a:0,b:0,c:0,d:0},   // current working eq2 (simul only)
  o1: {a:2,b:3,c:0,d:7},   // original eq1
  o2: {a:0,b:0,c:0,d:0},   // original eq2
  // For simul: eq is ax+by=c → stored as {a,b,c} but we reuse a,b,c,d fields:
  // single: left=ax+b, right=cx+d
  // simul: eq1: a*x+b*y=c (a=x-coeff, b=y-coeff, c=constant, d unused)
  history: [],
  exercises: [], exIndex: 0, solving: false
};

// ── Exercises ──
var EXERCISES_SINGLE = {
  easy:[
    {a:1,b:3,c:0,d:7,label:"x + 3 = 7"},
    {a:2,b:0,c:0,d:8,label:"2x = 8"},
    {a:1,b:5,c:0,d:12,label:"x + 5 = 12"},
    {a:3,b:1,c:0,d:10,label:"3x + 1 = 10"},
    {a:1,b:-2,c:0,d:6,label:"x − 2 = 6"},
    {a:5,b:0,c:0,d:20,label:"5x = 20"},
    {a:1,b:7,c:0,d:15,label:"x + 7 = 15"},
    {a:2,b:4,c:0,d:14,label:"2x + 4 = 14"},
  ],
  medium:[
    {a:2,b:3,c:0,d:11,label:"2x + 3 = 11"},
    {a:3,b:-4,c:0,d:8,label:"3x − 4 = 8"},
    {a:2,b:7,c:1,d:12,label:"2x + 7 = x + 12"},
    {a:3,b:2,c:1,d:10,label:"3x + 2 = x + 10"},
    {a:5,b:-3,c:2,d:9,label:"5x − 3 = 2x + 9"},
    {a:4,b:1,c:2,d:7,label:"4x + 1 = 2x + 7"},
    {a:6,b:-2,c:3,d:7,label:"6x − 2 = 3x + 7"},
    {a:7,b:5,c:3,d:17,label:"7x + 5 = 3x + 17"},
  ],
  hard:[
    {a:7,b:3,c:2,d:28,label:"7x + 3 = 2x + 28"},
    {a:5,b:-8,c:-1,d:10,label:"5x − 8 = −x + 10"},
    {a:3,b:14,c:5,d:6,label:"3x + 14 = 5x + 6"},
    {a:8,b:-3,c:3,d:12,label:"8x − 3 = 3x + 12"},
    {a:-2,b:15,c:1,d:0,label:"−2x + 15 = x"},
    {a:4,b:9,c:7,d:-6,label:"4x + 9 = 7x − 6"},
    {a:6,b:-5,c:-3,d:22,label:"6x − 5 = −3x + 22"},
    {a:10,b:4,c:4,d:22,label:"10x + 4 = 4x + 22"},
  ]
};

var EXERCISES_SIMUL = {
  easy:[
    {e1:{a:1,b:1,c:10},e2:{a:1,b:-1,c:2},label:"x+y=10, x−y=2"},
    {e1:{a:2,b:1,c:7},e2:{a:1,b:1,c:5},label:"2x+y=7, x+y=5"},
    {e1:{a:1,b:2,c:8},e2:{a:1,b:0,c:2},label:"x+2y=8, x=2"},
    {e1:{a:3,b:0,c:9},e2:{a:0,b:2,c:6},label:"3x=9, 2y=6"},
  ],
  medium:[
    {e1:{a:2,b:3,c:13},e2:{a:1,b:-1,c:1},label:"2x+3y=13, x−y=1"},
    {e1:{a:3,b:2,c:12},e2:{a:1,b:1,c:5},label:"3x+2y=12, x+y=5"},
    {e1:{a:4,b:1,c:9},e2:{a:2,b:3,c:13},label:"4x+y=9, 2x+3y=13"},
    {e1:{a:1,b:3,c:11},e2:{a:2,b:1,c:7},label:"x+3y=11, 2x+y=7"},
  ],
  hard:[
    {e1:{a:3,b:4,c:25},e2:{a:5,b:-2,c:7},label:"3x+4y=25, 5x−2y=7"},
    {e1:{a:2,b:-5,c:-1},e2:{a:3,b:2,c:12},label:"2x−5y=−1, 3x+2y=12"},
    {e1:{a:7,b:3,c:29},e2:{a:4,b:-1,c:10},label:"7x+3y=29, 4x−y=10"},
    {e1:{a:5,b:2,c:16},e2:{a:3,b:-4,c:-2},label:"5x+2y=16, 3x−4y=−2"},
  ]
};

function initEquationBalance() {
  // Mode toggle
  document.getElementById("modeSingle").onclick = function(){setMode("single")};
  document.getElementById("modeSimultaneous").onclick = function(){setMode("simul")};

  // Source tabs
  document.querySelectorAll(".eq-src-btn").forEach(function(b){
    b.onclick=function(){
      document.querySelectorAll(".eq-src-btn").forEach(function(x){x.classList.remove("active")});
      this.classList.add("active");
      var src=this.dataset.src;
      document.getElementById("eqSrcManual").style.display=src==="manual"?"block":"none";
      document.getElementById("eqSrcExercises").style.display=src==="exercises"?"block":"none";
      document.getElementById("eqSrcCsv").style.display=src==="csv"?"block":"none";
      if(src==="exercises") renderExList("easy");
    }});

  document.getElementById("eqGoBtn").onclick = startFromManual;

  document.querySelectorAll(".ex-diff-btn").forEach(function(b){
    b.onclick=function(){
      document.querySelectorAll(".ex-diff-btn").forEach(function(x){x.classList.remove("active")});
      this.classList.add("active"); renderExList(this.dataset.diff)}});

  document.getElementById("csvFile").onchange = handleCsv;
  document.getElementById("eqApplyBtn").onclick = applyOp;
  document.getElementById("eqHintBtn").onclick = showHint;
  document.getElementById("eqUndoBtn").onclick = undoOp;
  document.getElementById("eqResetBtn").onclick = resetSolve;

  // Combine equations (elimination)
  document.getElementById("eqAddEqsBtn").onclick = function(){ combineEqs(1, 2, 1, "add"); };
  document.getElementById("eqSubEqsBtn").onclick = function(){ combineEqs(1, 2, 1, "sub"); };
  document.getElementById("eqAddEqs2Btn").onclick = function(){ combineEqs(2, 1, 2, "add"); };
  document.getElementById("eqSubEqs2Btn").onclick = function(){ combineEqs(2, 1, 2, "sub"); };

  // Substitute buttons
  document.getElementById("eqSubInto2Btn").onclick = function(){ substituteEq(1, 2); };
  document.getElementById("eqSubInto1Btn").onclick = function(){ substituteEq(2, 1); };

  renderExList("easy");
  drawBalSingle(true, 0, {a:0,b:0,c:0,d:0}, "eqCanvas1");
}

function setMode(m) {
  eq.mode = m;
  eq.solving = false;
  document.getElementById("modeSingle").classList.toggle("active", m==="single");
  document.getElementById("modeSimultaneous").classList.toggle("active", m==="simul");
  document.getElementById("eqManualSingle").style.display = m==="single"?"block":"none";
  document.getElementById("eqManualSimul").style.display = m==="simul"?"block":"none";
  document.getElementById("eqCanvas2").style.display = m==="simul"?"block":"none";
  document.getElementById("eqKatex2").style.display = m==="simul"?"flex":"none";
  document.getElementById("eqSimulOps").style.display = m==="simul"?"block":"none";
  document.getElementById("eqSolveArea") // doesn't exist anymore, but op area
  document.getElementById("eqOpArea").style.display = "none";
  document.getElementById("eqCtrlArea").style.display = "none";
  document.getElementById("eqSolved").style.display = "none";
  document.getElementById("eqStepLog").innerHTML = '<div class="eq-step-placeholder">Steps will appear here as you solve…</div>';
  // Add y option to op selector for simul
  var whatSel = document.getElementById("eqOpWhat");
  if(m==="simul" && !document.getElementById("eqOpWhatY")) {
    var opt = document.createElement("option"); opt.value="y"; opt.textContent="× y"; opt.id="eqOpWhatY";
    whatSel.appendChild(opt);
  } else if(m==="single") {
    var yOpt = document.getElementById("eqOpWhatY"); if(yOpt) yOpt.remove();
  }
  document.getElementById("csvFormatHint").textContent = m==="single"?"(a,b,c,d per row for ax+b = cx+d)":"(a1,b1,c1,a2,b2,c2 per row for a1x+b1y=c1, a2x+b2y=c2)";
  renderExList("easy");
}

function startFromManual() {
  if(eq.mode==="single") {
    var a=pf("eqA1"),b=pf("eqB1"),c=pf("eqC1"),d=pf("eqD1");
    startSingle(a,b,c,d);
  } else {
    var e1={a:pf("eqSA1"),b:pf("eqSB1"),c:pf("eqSC1")};
    var e2={a:pf("eqSA2"),b:pf("eqSB2"),c:pf("eqSC2")};
    startSimul(e1,e2);
  }
}

function pf(id){return parseFloat(document.getElementById(id).value)||0}
function rn(n){return Math.round(n*10000)/10000}

// ═══ SINGLE VARIABLE ═══

function startSingle(a,b,c,d) {
  eq.e1={a:a,b:b,c:c,d:d}; eq.o1={a:a,b:b,c:c,d:d};
  eq.history=[{e1:{a:a,b:b,c:c,d:d}}];
  eq.solving=true; eq.mode="single";
  showSolveUI();
  updateDisplaySingle();
}

function updateDisplaySingle() {
  var e=eq.e1;
  var lhs=sTermL(e.a,"x",e.b), rhs=sTermL(e.c,"x",e.d);
  var ke=document.getElementById("eqKatex1");
  try{katex.render(lhs+" = "+rhs,ke,{displayMode:true,throwOnError:false})}catch(er){ke.textContent=lhs+" = "+rhs}

  // Check equivalence: (a-c)x + (b-d) = 0 should be proportional to original
  var oDx=eq.o1.a-eq.o1.c, oDc=eq.o1.b-eq.o1.d;
  var cDx=e.a-e.c, cDc=e.b-e.d;
  var bal=false, k=null;
  if(Math.abs(oDx)>0.0001) k=cDx/oDx;
  else if(Math.abs(oDc)>0.0001) k=cDc/oDc;
  if(k!==null&&Math.abs(k)>0.00001) bal=Math.abs(cDx-k*oDx)<0.01&&Math.abs(cDc-k*oDc)<0.01;
  else if(k===null) bal=Math.abs(cDx)<0.01&&Math.abs(cDc)<0.01;

  var vDiff=bal?0:(cDx-oDx)+(cDc-oDc);
  drawBalSingle(bal, vDiff, e, "eqCanvas1");
}

function drawBalSingle(bal, vDiff, e, canvasId) {
  // Use the unified label-based drawing for single variable too
  var leftLabel = sTermS(e.a, "x", e.b);
  var rightLabel = sTermS(e.c, "x", e.d);
  drawBalWithLabels(bal, vDiff, leftLabel, rightLabel, "Eq 1", canvasId);
}

// ═══ SIMULTANEOUS ═══

function startSimul(e1,e2) {
  eq.e1={a:e1.a,b:e1.b,c:e1.c,d:0}; eq.e2={a:e2.a,b:e2.b,c:e2.c,d:0};
  eq.o1={a:e1.a,b:e1.b,c:e1.c,d:0}; eq.o2={a:e2.a,b:e2.b,c:e2.c,d:0};
  eq.history=[{e1:Object.assign({},eq.e1),e2:Object.assign({},eq.e2)}];
  eq.solving=true; eq.mode="simul";
  // Ensure both canvases and katex displays are visible
  document.getElementById("eqCanvas2").style.display="block";
  document.getElementById("eqKatex2").style.display="flex";
  document.getElementById("eqSimulOps").style.display="block";
  showSolveUI();
  updateDisplaySimul();
}

function updateDisplaySimul() {
  // Eq1: a*x + b*y = c
  var ke1=document.getElementById("eqKatex1");
  var lx1=simTermL(eq.e1.a,"x",eq.e1.b,"y")+" = "+fn(eq.e1.c);
  try{katex.render(lx1,ke1,{displayMode:true,throwOnError:false})}catch(er){ke1.textContent=lx1}

  var ke2=document.getElementById("eqKatex2");
  var lx2=simTermL(eq.e2.a,"x",eq.e2.b,"y")+" = "+fn(eq.e2.c);
  try{katex.render(lx2,ke2,{displayMode:true,throwOnError:false})}catch(er){ke2.textContent=lx2}

  // Check eq1 equivalence
  var bal1=checkSimulEquiv(eq.o1, eq.e1);
  var bal2=checkSimulEquiv(eq.o2, eq.e2);
  // Also allow if eq.e1 is equivalent to o2 and eq.e2 to o1 (swapped)
  if(!bal1||!bal2){
    var swp1=checkSimulEquiv(eq.o2,eq.e1);
    var swp2=checkSimulEquiv(eq.o1,eq.e2);
    if(swp1&&swp2){bal1=true;bal2=true}
  }
  // Also: if one equation has been reduced to x=N or y=N via substitution, check system consistency
  // For now, mark balanced if the equation is derivable from the original system
  // Simplified: use Cramer's to get solution of original, evaluate current at that point
  var sol=solveSimulSystem(eq.o1,eq.o2);
  if(sol){
    var l1=eq.e1.a*sol.x+eq.e1.b*sol.y;bal1=Math.abs(l1-eq.e1.c)<0.01;
    var l2=eq.e2.a*sol.x+eq.e2.b*sol.y;bal2=Math.abs(l2-eq.e2.c)<0.01;
  }

  drawBalWithLabels(bal1, bal1?0:1, simTermS(eq.e1.a,"x",eq.e1.b,"y"), fn(eq.e1.c), "Eq 1", "eqCanvas1");
  drawBalWithLabels(bal2, bal2?0:1, simTermS(eq.e2.a,"x",eq.e2.b,"y"), fn(eq.e2.c), "Eq 2", "eqCanvas2");

  // Update substitute buttons based on current state
  updateSubButtons();
}

function checkSimulEquiv(orig, cur) {
  // ax+by=c → check if cur is k*(orig)
  var k=null;
  if(Math.abs(orig.a)>0.001)k=cur.a/orig.a;
  else if(Math.abs(orig.b)>0.001)k=cur.b/orig.b;
  else if(Math.abs(orig.c)>0.001)k=cur.c/orig.c;
  if(k===null)return Math.abs(cur.a)<0.01&&Math.abs(cur.b)<0.01&&Math.abs(cur.c)<0.01;
  return Math.abs(cur.a-k*orig.a)<0.01&&Math.abs(cur.b-k*orig.b)<0.01&&Math.abs(cur.c-k*orig.c)<0.01;
}

function solveSimulSystem(e1,e2){
  var det=e1.a*e2.b-e1.b*e2.a;
  if(Math.abs(det)<0.0001)return null;
  return{x:(e1.c*e2.b-e1.b*e2.c)/det, y:(e1.a*e2.c-e1.c*e2.a)/det};
}

function drawBalWithLabels(bal, vDiff, leftLabel, rightLabel, eqName, canvasId) {
  var cv=document.getElementById(canvasId),ctx=cv.getContext("2d"),dpr=window.devicePixelRatio||1,rect=cv.getBoundingClientRect();
  cv.width=rect.width*dpr;cv.height=rect.height*dpr;ctx.scale(dpr,dpr);
  var W=rect.width,H=rect.height;ctx.clearRect(0,0,W,H);

  var pX=W/2,pY=H*.72,bL=W*.42;
  var tilt=bal?0:Math.max(-.2,Math.min(.2,vDiff*.06));
  var col=bal?"#34d399":"#ef4444",glow=bal?"rgba(52,211,153,.15)":"rgba(239,68,68,.1)";

  ctx.fillStyle=glow;ctx.beginPath();ctx.arc(pX,pY,70,0,Math.PI*2);ctx.fill();
  var tH=34,tW=28;ctx.fillStyle=bal?"#1a5740":"#4a5a78";
  ctx.beginPath();ctx.moveTo(pX,pY);ctx.lineTo(pX-tW,pY+tH);ctx.lineTo(pX+tW,pY+tH);ctx.closePath();ctx.fill();
  ctx.fillStyle="#2a3650";bR(ctx,pX-60,pY+tH,120,8,4);

  ctx.save();ctx.translate(pX,pY);ctx.rotate(tilt);
  ctx.fillStyle=col;bR(ctx,-bL,-5,bL*2,10,5);

  var panW=100,panH=14,panY=20;
  // Left pan
  var lpX=-bL+14;
  ctx.strokeStyle="#4a5a78";ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(lpX+panW/2,0);ctx.lineTo(lpX+panW/2,panY);ctx.stroke();
  ctx.fillStyle=bal?"#143d2e":"#1e3a5f";ctx.strokeStyle=bal?"#34d399":"#3b82f6";ctx.lineWidth=2;
  bR(ctx,lpX,panY,panW,panH,6);ctx.strokeRect(lpX,panY,panW,panH);
  ctx.fillStyle="#fff";ctx.font="bold 13px 'JetBrains Mono',monospace";ctx.textAlign="center";ctx.textBaseline="bottom";
  ctx.fillText(leftLabel,lpX+panW/2,panY-3);

  // Right pan
  var rpX=bL-panW-14;
  ctx.strokeStyle="#4a5a78";ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(rpX+panW/2,0);ctx.lineTo(rpX+panW/2,panY);ctx.stroke();
  ctx.fillStyle=bal?"#143d2e":"#3a2e1a";ctx.strokeStyle=bal?"#34d399":"#f59e0b";ctx.lineWidth=2;
  bR(ctx,rpX,panY,panW,panH,6);ctx.strokeRect(rpX,panY,panW,panH);
  ctx.fillStyle="#fff";ctx.textAlign="center";
  ctx.fillText(rightLabel,rpX+panW/2,panY-3);
  ctx.restore();

  ctx.textAlign="center";ctx.textBaseline="middle";ctx.font="bold 14px 'Outfit',sans-serif";
  if(bal){ctx.fillStyle="#34d399";ctx.fillText("✓ "+eqName+" Balanced",pX,20)}
  else{ctx.fillStyle="#ef4444";ctx.fillText(eqName+" Unbalanced",pX,20)}
}

// ═══ OPERATIONS ═══

function applyOp() {
  if(!eq.solving)return;
  var type=document.getElementById("eqOpType").value;
  var val=parseFloat(document.getElementById("eqOpValue").value)||0;
  var what=document.getElementById("eqOpWhat").value;
  if(val===0)return;

  eq.history.push({e1:Object.assign({},eq.e1),e2:Object.assign({},eq.e2)});

  var target = eq.mode==="simul" ? parseInt(document.getElementById("eqTargetEq").value) : 1;
  var e = target===1 ? eq.e1 : eq.e2;
  var desc="";

  if(eq.mode==="single"){
    // ax+b = cx+d
    if(what==="x"){
      if(type==="add"){e.a+=val;e.c+=val;desc="Add "+fn(val)+"x to both sides"}
      else if(type==="subtract"){e.a-=val;e.c-=val;desc="Subtract "+fn(val)+"x from both sides"}
    } else {
      if(type==="add"){e.b+=val;e.d+=val;desc="Add "+fn(val)+" to both sides"}
      else if(type==="subtract"){e.b-=val;e.d-=val;desc="Subtract "+fn(val)+" from both sides"}
      else if(type==="multiply"){e.a*=val;e.b*=val;e.c*=val;e.d*=val;desc="Multiply both sides by "+fn(val)}
      else if(type==="divide"){e.a/=val;e.b/=val;e.c/=val;e.d/=val;desc="Divide both sides by "+fn(val)}
    }
  } else {
    // Simultaneous: ax+by = c
    if(what==="x"){
      if(type==="add"){e.a+=val;desc="Add "+fn(val)+"x to both sides of Eq"+target}
      else if(type==="subtract"){e.a-=val;desc="Subtract "+fn(val)+"x from both sides of Eq"+target}
    } else if(what==="y"){
      if(type==="add"){e.b+=val;desc="Add "+fn(val)+"y to both sides of Eq"+target}
      else if(type==="subtract"){e.b-=val;desc="Subtract "+fn(val)+"y from both sides of Eq"+target}
    } else {
      if(type==="add"){e.c+=val;desc="Add "+fn(val)+" to both sides of Eq"+target}
      else if(type==="subtract"){e.c-=val;desc="Subtract "+fn(val)+" from both sides of Eq"+target}
      else if(type==="multiply"){e.a*=val;e.b*=val;e.c*=val;desc="Multiply Eq"+target+" by "+fn(val)}
      else if(type==="divide"){e.a/=val;e.b/=val;e.c/=val;desc="Divide Eq"+target+" by "+fn(val)}
    }
  }

  // Round
  e.a=rn(e.a);e.b=rn(e.b);e.c=rn(e.c);e.d=rn(e.d);

  addStep(desc);
  if(eq.mode==="single") updateDisplaySingle(); else updateDisplaySimul();
  checkSolved();
}

// Combine two equations with visual elimination display
function combineEqs(eqANum, eqBNum, targetNum, op) {
  if(!eq.solving || eq.mode!=="simul") return;

  eq.history.push({e1:Object.assign({},eq.e1),e2:Object.assign({},eq.e2)});

  var eA = eqANum===1 ? Object.assign({},eq.e1) : Object.assign({},eq.e2);
  var eB = eqBNum===1 ? Object.assign({},eq.e1) : Object.assign({},eq.e2);
  var target = targetNum===1 ? eq.e1 : eq.e2;

  // Calculate result
  var rA, rB, rC;
  if(op==="add") {
    rA = rn(eA.a + eB.a); rB = rn(eA.b + eB.b); rC = rn(eA.c + eB.c);
  } else {
    rA = rn(eA.a - eB.a); rB = rn(eA.b - eB.b); rC = rn(eA.c - eB.c);
  }

  // Show visual elimination
  showElimination(eA, eB, rA, rB, rC, op, eqANum, eqBNum, targetNum);

  // Apply
  target.a = rA; target.b = rB; target.c = rC;

  var desc = "Eq" + eqANum + (op==="add"?" + ":" − ") + "Eq" + eqBNum + " → Eq" + targetNum;
  addStep(desc);
  updateDisplaySimul();
  checkSolved();
}

function showElimination(eA, eB, rA, rB, rC, op, eqANum, eqBNum, targetNum) {
  var panel = document.getElementById("elimPanel");
  panel.style.display = "block";

  // Op sign
  document.getElementById("elimOpSign").textContent = op==="add" ? "+" : "−";

  // Top row (eqA)
  setElimTerm("elimT1x", eA.a, "x");
  setElimTerm("elimT1y", eA.b, "y");
  setElimTerm("elimT1c", eA.c, "");

  // Bottom row (eqB) — show original signs for add, negated conceptually for subtract
  setElimTerm("elimT2x", eB.a, "x");
  setElimTerm("elimT2y", eB.b, "y");
  setElimTerm("elimT2c", eB.c, "");

  // Result row
  setElimTermResult("elimRx", rA, "x", eA.a, eB.a, op);
  setElimTermResult("elimRy", rB, "y", eA.b, eB.b, op);
  setElimTermResult("elimRc", rC, "", eA.c, eB.c, op);

  // Annotation
  var annot = document.getElementById("elimAnnotation");
  var eliminated = [];
  if(Math.abs(rA) < 0.001 && (Math.abs(eA.a) > 0.001 || Math.abs(eB.a) > 0.001)) eliminated.push("x");
  if(Math.abs(rB) < 0.001 && (Math.abs(eA.b) > 0.001 || Math.abs(eB.b) > 0.001)) eliminated.push("y");

  if(eliminated.length > 0) {
    annot.innerHTML = '🎯 <span class="elim-highlight">' + eliminated.join(" and ") + ' eliminated!</span> — the terms cancel to zero.';
  } else {
    annot.innerHTML = 'Eq' + eqANum + (op==="add"?" + ":" − ") + 'Eq' + eqBNum + ' → Eq' + targetNum;
  }

  // Close handler
  document.getElementById("elimClose").onclick = function() {
    panel.style.display = "none";
  };

  // Auto-close after 8 seconds
  clearTimeout(window._elimTimer);
  window._elimTimer = setTimeout(function(){ panel.style.display = "none"; }, 8000);
}

function setElimTerm(id, coeff, varName) {
  var el = document.getElementById(id);
  if(Math.abs(coeff) < 0.001 && varName) {
    el.textContent = ""; el.className = "elim-term";
  } else {
    var txt = "";
    if(varName) {
      if(coeff === 1) txt = varName;
      else if(coeff === -1) txt = "−" + varName;
      else txt = fn(coeff) + varName;
    } else {
      txt = fn(coeff);
    }
    el.textContent = txt;
    el.className = "elim-term";
  }
}

function setElimTermResult(id, resultCoeff, varName, coeffA, coeffB, op) {
  var el = document.getElementById(id);
  var wasThere = (Math.abs(coeffA) > 0.001 || Math.abs(coeffB) > 0.001);

  if(Math.abs(resultCoeff) < 0.001) {
    if(wasThere) {
      // This term got cancelled!
      el.textContent = "0";
      el.className = "elim-term cancelled";
    } else {
      el.textContent = "";
      el.className = "elim-term";
    }
  } else {
    var txt = "";
    if(varName) {
      if(resultCoeff === 1) txt = varName;
      else if(resultCoeff === -1) txt = "−" + varName;
      else txt = fn(resultCoeff) + varName;
    } else {
      txt = fn(resultCoeff);
    }
    el.textContent = txt;
    el.className = "elim-term survives";
  }

  // Also mark the source terms that cancelled
  if(Math.abs(resultCoeff) < 0.001 && wasThere) {
    // Find the corresponding source term elements and mark them
    var topId = id.replace("elimR", "elimT1");
    var botId = id.replace("elimR", "elimT2");
    var topEl = document.getElementById(topId);
    var botEl = document.getElementById(botId);
    if(topEl && topEl.textContent) topEl.className = "elim-term cancelled";
    if(botEl && botEl.textContent) botEl.className = "elim-term cancelled";
  }
}

// ── Substitution: plug solved variable from one eq into the other ──
function getSolvedVar(e) {
  // Check if equation is in form: var = number
  // x = c: a=1, b=0  → returns {var:"x", val:e.c}
  // y = c: a=0, b=1  → returns {var:"y", val:e.c}
  if(Math.abs(e.a - 1) < 0.001 && Math.abs(e.b) < 0.001) return {v:"x", val:e.c};
  if(Math.abs(e.b - 1) < 0.001 && Math.abs(e.a) < 0.001) return {v:"y", val:e.c};
  // Also: -1 cases
  if(Math.abs(e.a + 1) < 0.001 && Math.abs(e.b) < 0.001) return {v:"x", val:-e.c};
  if(Math.abs(e.b + 1) < 0.001 && Math.abs(e.a) < 0.001) return {v:"y", val:-e.c};
  return null;
}

function substituteEq(fromNum, intoNum) {
  var fromE = fromNum === 1 ? eq.e1 : eq.e2;
  var intoE = intoNum === 1 ? eq.e1 : eq.e2;
  var solved = getSolvedVar(fromE);
  if(!solved) return;

  eq.history.push({e1:Object.assign({},eq.e1),e2:Object.assign({},eq.e2)});

  var desc = "";
  if(solved.v === "x") {
    // Replace x in intoE: a*x + b*y = c → a*val + b*y = c → b*y = c - a*val
    var newC = rn(intoE.c - intoE.a * solved.val);
    intoE.a = 0;
    intoE.c = newC;
    desc = "Substitute x = " + fn(solved.val) + " into Eq" + intoNum;
  } else {
    // Replace y in intoE: a*x + b*y = c → a*x + b*val = c → a*x = c - b*val
    var newC2 = rn(intoE.c - intoE.b * solved.val);
    intoE.b = 0;
    intoE.c = newC2;
    desc = "Substitute y = " + fn(solved.val) + " into Eq" + intoNum;
  }

  addStep(desc);
  updateDisplaySimul();
  checkSolved();
}

function updateSubButtons() {
  var btn1to2 = document.getElementById("eqSubInto2Btn");
  var btn2to1 = document.getElementById("eqSubInto1Btn");
  var info = document.getElementById("eqSubInfo");

  var solved1 = getSolvedVar(eq.e1);
  var solved2 = getSolvedVar(eq.e2);

  if(solved1) {
    btn1to2.disabled = false;
    btn1to2.textContent = "Sub " + solved1.v + "=" + fn(solved1.val) + " → Eq2";
  } else {
    btn1to2.disabled = true;
    btn1to2.textContent = "Substitute Eq1 → Eq2";
  }

  if(solved2) {
    btn2to1.disabled = false;
    btn2to1.textContent = "Sub " + solved2.v + "=" + fn(solved2.val) + " → Eq1";
  } else {
    btn2to1.disabled = true;
    btn2to1.textContent = "Substitute Eq2 → Eq1";
  }

  if(solved1 || solved2) {
    info.textContent = "A variable is solved — substitute it into the other equation!";
    info.style.color = "#34d399";
    info.style.fontStyle = "normal";
    info.style.fontWeight = "600";
  } else {
    info.textContent = "Solve one equation for x or y first, then substitute.";
    info.style.color = "";
    info.style.fontStyle = "italic";
    info.style.fontWeight = "";
  }
}

function undoOp(){
  if(eq.history.length<=1)return;
  eq.history.pop();
  var p=eq.history[eq.history.length-1];
  eq.e1=Object.assign({},p.e1); if(p.e2) eq.e2=Object.assign({},p.e2);
  var log=document.getElementById("eqStepLog");
  if(log.lastChild)log.removeChild(log.lastChild);
  document.getElementById("eqSolved").style.display="none";
  if(eq.mode==="single") updateDisplaySingle(); else updateDisplaySimul();
}

function resetSolve(){
  eq.e1=Object.assign({},eq.o1); eq.e2=Object.assign({},eq.o2);
  eq.history=[{e1:Object.assign({},eq.e1),e2:Object.assign({},eq.e2)}];
  document.getElementById("eqStepLog").innerHTML='<div class="eq-step-placeholder">Reset — try again!</div>';
  document.getElementById("eqSolved").style.display="none";
  document.getElementById("eqHintBox").style.display="none";
  if(eq.mode==="single") updateDisplaySingle(); else updateDisplaySimul();
}

function checkSolved(){
  var solved=false;
  if(eq.mode==="single"){
    // x = number: a=1,b=0,c=0
    solved=(Math.abs(eq.e1.a-1)<.0001&&Math.abs(eq.e1.b)<.0001&&Math.abs(eq.e1.c)<.0001);
    // Also handle c=1,d=0,a=0 → number = x
    if(!solved) solved=(Math.abs(eq.e1.c-1)<.0001&&Math.abs(eq.e1.d)<.0001&&Math.abs(eq.e1.a)<.0001);
  } else {
    // Both equations reduced: x=N, y=M
    var s1x=(Math.abs(eq.e1.a-1)<.001&&Math.abs(eq.e1.b)<.001); // x=c1
    var s1y=(Math.abs(eq.e1.b-1)<.001&&Math.abs(eq.e1.a)<.001); // y=c1
    var s2x=(Math.abs(eq.e2.a-1)<.001&&Math.abs(eq.e2.b)<.001);
    var s2y=(Math.abs(eq.e2.b-1)<.001&&Math.abs(eq.e2.a)<.001);
    solved=(s1x&&s2y)||(s1y&&s2x)||(s1x&&s2x&&Math.abs(eq.e1.c-eq.e2.c)<.001); // both give x=same
  }
  if(solved){
    document.getElementById("eqSolved").style.display="block";
    if(eq.exercises.length>0&&eq.exercises[eq.exIndex]){
      eq.exercises[eq.exIndex].done=true;
      var nb=document.getElementById("eqNextBtn");nb.style.display="block";
      nb.onclick=function(){eq.exIndex++;if(eq.exIndex<eq.exercises.length){var ex=eq.exercises[eq.exIndex];
        if(eq.mode==="single")startSingle(ex.a,ex.b,ex.c,ex.d);else startSimul(ex.e1,ex.e2)}}
    }
  }
}

function showHint(){
  var box=document.getElementById("eqHintBox");box.style.display="block";
  if(eq.mode==="single"){
    var e=eq.e1,h="";
    if(Math.abs(e.c)>.001){h=e.c>0?"Subtract <strong>"+fn(e.c)+"x</strong> from both sides":"Add <strong>"+fn(-e.c)+"x</strong> to both sides"}
    else if(Math.abs(e.b)>.001){h=e.b>0?"Subtract <strong>"+fn(e.b)+"</strong> from both sides":"Add <strong>"+fn(-e.b)+"</strong> to both sides"}
    else if(Math.abs(e.a-1)>.001&&Math.abs(e.a)>.001){h="Divide both sides by <strong>"+fn(e.a)+"</strong>"}
    else{h="Check if x is isolated!"}
    box.innerHTML=h;
  } else {
    // Simultaneous hints
    var h="";
    // Check if coefficients match for elimination
    if(Math.abs(eq.e1.a)===Math.abs(eq.e2.a)&&Math.abs(eq.e1.a)>0.001){
      if(eq.e1.a===eq.e2.a) h="The x coefficients are the same ("+fn(eq.e1.a)+"). Try <strong>Eq1 − Eq2</strong> to eliminate x.";
      else h="The x coefficients are "+fn(eq.e1.a)+" and "+fn(eq.e2.a)+". Try <strong>Eq1 + Eq2</strong> to eliminate x.";
    } else if(Math.abs(eq.e1.b)===Math.abs(eq.e2.b)&&Math.abs(eq.e1.b)>0.001){
      if(eq.e1.b===eq.e2.b) h="The y coefficients are the same ("+fn(eq.e1.b)+"). Try <strong>Eq1 − Eq2</strong> to eliminate y.";
      else h="The y coefficients are "+fn(eq.e1.b)+" and "+fn(eq.e2.b)+". Try <strong>Eq1 + Eq2</strong> to eliminate y.";
    } else if(Math.abs(eq.e1.a)<0.001||Math.abs(eq.e1.b)<0.001){
      h="One variable is already eliminated in Eq1. Solve it, then substitute back.";
    } else if(Math.abs(eq.e2.a)<0.001||Math.abs(eq.e2.b)<0.001){
      h="One variable is already eliminated in Eq2. Solve it, then substitute back.";
    } else {
      h="Try to make the coefficient of x (or y) the same in both equations by multiplying one equation. Then add or subtract to eliminate that variable.";
    }
    box.innerHTML=h;
  }
}

// ═══ UI HELPERS ═══

function showSolveUI(){
  document.getElementById("eqOpArea").style.display="block";
  document.getElementById("eqCtrlArea").style.display="flex";
  document.getElementById("eqSolved").style.display="none";
  document.getElementById("eqHintBox").style.display="none";
  document.getElementById("eqStepLog").innerHTML='<div class="eq-step-placeholder">Apply operations to solve — keep the balance level!</div>';
  document.getElementById("eqOpWhichEq").textContent = eq.mode==="simul"?"":"";
}

function addStep(desc){
  var log=document.getElementById("eqStepLog");
  var ph=log.querySelector(".eq-step-placeholder");if(ph)ph.remove();
  var n=log.children.length+1;
  var el=document.createElement("div");el.className="eq-step-entry";
  var result = eq.mode==="single" ? sTermS(eq.e1.a,"x",eq.e1.b)+" = "+sTermS(eq.e1.c,"x",eq.e1.d) : simTermS(eq.e1.a,"x",eq.e1.b,"y")+"="+fn(eq.e1.c);
  el.innerHTML='<span class="sn">'+n+'</span><span class="sd">'+desc+'</span><span class="sr">'+result+'</span>';
  log.appendChild(el);log.scrollTop=log.scrollHeight;
}

function renderExList(diff){
  var list=eq.mode==="single"?(EXERCISES_SINGLE[diff]||[]):(EXERCISES_SIMUL[diff]||[]);
  eq.exercises=list.map(function(e){return Object.assign({},e,{done:false})});eq.exIndex=0;
  var el=document.getElementById("exList");el.innerHTML="";
  list.forEach(function(ex,i){
    var it=document.createElement("div");it.className="ex-item";
    it.innerHTML='<span class="ex-eq">'+ex.label+'</span><span class="ex-badge '+diff+'">'+diff+'</span>';
    it.onclick=function(){
      eq.exIndex=i;
      if(eq.mode==="single")startSingle(ex.a,ex.b,ex.c,ex.d);
      else startSimul(ex.e1,ex.e2)};
    el.appendChild(it)});
}

function handleCsv(e){
  var f=e.target.files[0];if(!f)return;
  var r=new FileReader();r.onload=function(ev){
    var lines=ev.target.result.split("\n").filter(function(l){return l.trim()});
    eq.exercises=[];
    lines.forEach(function(line){
      var p=line.split(",").map(function(s){return parseFloat(s.trim())});
      if(eq.mode==="single"&&p.length>=4&&!isNaN(p[0])){
        eq.exercises.push({a:p[0],b:p[1],c:p[2],d:p[3],label:sTermS(p[0],"x",p[1])+"="+sTermS(p[2],"x",p[3]),done:false});
      } else if(eq.mode==="simul"&&p.length>=6&&!isNaN(p[0])){
        eq.exercises.push({e1:{a:p[0],b:p[1],c:p[2]},e2:{a:p[3],b:p[4],c:p[5]},
          label:simTermS(p[0],"x",p[1],"y")+"="+fn(p[2])+", "+simTermS(p[3],"x",p[4],"y")+"="+fn(p[5]),done:false});
      }
    });
    renderCsvList()};
  r.readAsText(f)}

function renderCsvList(){
  var el=document.getElementById("csvList");el.innerHTML="";
  eq.exercises.forEach(function(ex,i){
    var it=document.createElement("div");it.className="ex-item"+(ex.done?" done":"");
    it.innerHTML='<span class="ex-eq">'+ex.label+'</span><span class="ex-badge">#'+(i+1)+'</span>';
    it.onclick=function(){eq.exIndex=i;if(eq.mode==="single")startSingle(ex.a,ex.b,ex.c,ex.d);else startSimul(ex.e1,ex.e2)};
    el.appendChild(it)})}

function updateEquationBalance(){if(eq.solving){if(eq.mode==="single")updateDisplaySingle();else updateDisplaySimul()}}

// ═══ FORMATTING ═══
function sTermL(cx,v,cn){var p=[];if(cx!==0){if(cx===1)p.push(v);else if(cx===-1)p.push("-"+v);else p.push(fn(cx)+v)}if(cn!==0){if(p.length>0&&cn>0)p.push("+ "+fn(cn));else p.push(fn(cn))}return p.length===0?"0":p.join(" ")}
function sTermS(cx,v,cn){var p=[];if(cx!==0){if(cx===1)p.push(v);else if(cx===-1)p.push("-"+v);else p.push(fn(cx)+v)}if(cn!==0){if(p.length>0&&cn>0)p.push("+"+fn(cn));else p.push(fn(cn))}return p.length===0?"0":p.join("")}
function simTermL(cx,vx,cy,vy){
  var p=[];
  if(cx!==0){if(cx===1)p.push(vx);else if(cx===-1)p.push("-"+vx);else p.push(fn(cx)+vx)}
  if(cy!==0){
    if(p.length>0){
      if(cy===1)p.push("+ "+vy);
      else if(cy===-1)p.push("- "+vy);
      else if(cy>0)p.push("+ "+fn(cy)+vy);
      else p.push("- "+fn(Math.abs(cy))+vy);
    } else {
      if(cy===1)p.push(vy);else if(cy===-1)p.push("-"+vy);else p.push(fn(cy)+vy);
    }
  }
  return p.length===0?"0":p.join(" ");
}
function simTermS(cx,vx,cy,vy){
  var p=[];
  if(cx!==0){if(cx===1)p.push(vx);else if(cx===-1)p.push("-"+vx);else p.push(fn(cx)+vx)}
  if(cy!==0){
    if(p.length>0){
      if(cy===1)p.push("+"+vy);
      else if(cy===-1)p.push("-"+vy);
      else if(cy>0)p.push("+"+fn(cy)+vy);
      else p.push(fn(cy)+vy);
    } else {
      if(cy===1)p.push(vy);else if(cy===-1)p.push("-"+vy);else p.push(fn(cy)+vy);
    }
  }
  return p.length===0?"0":p.join("");
}
function fn(n){if(n==null)return"0";n=rn(n);return n%1===0?String(n):parseFloat(n.toFixed(4)).toString()}
function bR(ctx,x,y,w,h,r){ctx.beginPath();ctx.moveTo(x+r,y);ctx.lineTo(x+w-r,y);ctx.quadraticCurveTo(x+w,y,x+w,y+r);ctx.lineTo(x+w,y+h-r);ctx.quadraticCurveTo(x+w,y+h,x+w-r,y+h);ctx.lineTo(x+r,y+h);ctx.quadraticCurveTo(x,y+h,x,y+h-r);ctx.lineTo(x,y+r);ctx.quadraticCurveTo(x,y,x+r,y);ctx.closePath();ctx.fill()}
