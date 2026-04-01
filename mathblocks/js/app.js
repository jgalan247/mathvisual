// ═══════════════════════════════════════════════
// MathBlocks — app.js
// ═══════════════════════════════════════════════

const BLOCK_DEFS = {
  number:{label:"Number",category:"values",color:"#e8a735",inputs:[],hasField:"number"},
  variable_x:{label:"x",category:"values",color:"#e8a735",inputs:[]},
  pi:{label:"π",category:"values",color:"#e8a735",inputs:[]},
  euler:{label:"e",category:"values",color:"#e8a735",inputs:[]},
  add:{label:"+",category:"arithmetic",color:"#2ea4c7",inputs:["A","B"]},
  subtract:{label:"−",category:"arithmetic",color:"#2ea4c7",inputs:["A","B"]},
  multiply:{label:"×",category:"arithmetic",color:"#2ea4c7",inputs:["A","B"]},
  divide:{label:"÷",category:"arithmetic",color:"#2ea4c7",inputs:["A","B"]},
  fraction:{label:"Fraction",category:"arithmetic",color:"#2ea4c7",inputs:["NUM","DEN"]},
  negate:{label:"Negate(−)",category:"arithmetic",color:"#2ea4c7",inputs:["X"]},
  power:{label:"Power ^",category:"powers",color:"#3b82f6",inputs:["BASE","EXP"]},
  sqrt:{label:"√ Sqrt",category:"powers",color:"#3b82f6",inputs:["X"]},
  nthroot:{label:"ⁿ√ Root",category:"powers",color:"#3b82f6",inputs:["N","X"]},
  abs:{label:"|x| Abs",category:"functions",color:"#8b5cf6",inputs:["X"]},
  log:{label:"log",category:"functions",color:"#8b5cf6",inputs:["X","BASE"]},
  ln:{label:"ln",category:"functions",color:"#8b5cf6",inputs:["X"]},
  factorial:{label:"n!",category:"functions",color:"#8b5cf6",inputs:["X"]},
  sin:{label:"sin",category:"trig",color:"#ec4899",inputs:["X"]},
  cos:{label:"cos",category:"trig",color:"#ec4899",inputs:["X"]},
  tan:{label:"tan",category:"trig",color:"#ec4899",inputs:["X"]},
  asin:{label:"arcsin",category:"trig",color:"#ec4899",inputs:["X"]},
  acos:{label:"arccos",category:"trig",color:"#ec4899",inputs:["X"]},
  atan:{label:"arctan",category:"trig",color:"#ec4899",inputs:["X"]},
};

const CATS=[
  {id:"values",label:"Values",color:"#e8a735",mode:"builder"},
  {id:"arithmetic",label:"Arithmetic",color:"#2ea4c7",mode:"builder"},
  {id:"powers",label:"Powers & Roots",color:"#3b82f6",mode:"builder"},
  {id:"functions",label:"Functions",color:"#8b5cf6",mode:"builder"},
  {id:"trig",label:"Trigonometry",color:"#ec4899",mode:"trig"},
  {id:"_sep"},
  {id:"fractions",label:"½ Fractions",color:"#f472b6",mode:"fractions"},
  {id:"equations",label:"⚖ Linear Equations",color:"#f97316",mode:"equation"},
  {id:"quadratic",label:"📐 Quadratics",color:"#06b6d4",mode:"quadratic"},
  {id:"sohcahtoa",label:"△ SOHCAHTOA",color:"#f43f5e",mode:"sohcahtoa"},
];

const INLABELS={A:"A",B:"B",X:"value",NUM:"num",DEN:"den",BASE:"base",EXP:"exp",N:"n"};

let idC=1,rootBlock=null,activeCat="values",xValue=1,currentResult=null,currentLatex=null,currentMode="builder";

function newId(){return"b_"+(idC++)}
function createBlock(t,fv){var d=BLOCK_DEFS[t],ch={};d.inputs.forEach(function(i){ch[i]=null});return{id:newId(),type:t,children:ch,fieldValue:fv!==undefined?fv:(d.hasField==="number"?0:null)}}

// ── Generators ──
function toLatex(b){if(!b)return"?";var c=function(n){return b.children[n]?toLatex(b.children[n]):"\\square"};switch(b.type){case"number":return String(b.fieldValue??0);case"variable_x":return"x";case"pi":return"\\pi";case"euler":return"e";case"add":return c("A")+" + "+c("B");case"subtract":return c("A")+" - "+c("B");case"multiply":return c("A")+" \\times "+c("B");case"divide":return c("A")+" \\div "+c("B");case"fraction":return"\\frac{"+c("NUM")+"}{"+c("DEN")+"}";case"negate":return"-"+c("X");case"power":return"{"+c("BASE")+"}^{"+c("EXP")+"}";case"sqrt":return"\\sqrt{"+c("X")+"}";case"nthroot":return"\\sqrt["+c("N")+"]{"+c("X")+"}";case"abs":return"\\left|"+c("X")+"\\right|";case"log":return"\\log_{"+c("BASE")+"}\\left("+c("X")+"\\right)";case"ln":return"\\ln\\left("+c("X")+"\\right)";case"factorial":return c("X")+"!";case"sin":return"\\sin\\left("+c("X")+"\\right)";case"cos":return"\\cos\\left("+c("X")+"\\right)";case"tan":return"\\tan\\left("+c("X")+"\\right)";case"asin":return"\\arcsin\\left("+c("X")+"\\right)";case"acos":return"\\arccos\\left("+c("X")+"\\right)";case"atan":return"\\arctan\\left("+c("X")+"\\right)";default:return"?"}}

function toJS(b){if(!b)return"0";var c=function(n){return b.children[n]?toJS(b.children[n]):"0"};switch(b.type){case"number":return String(b.fieldValue??0);case"variable_x":return"XV";case"pi":return"Math.PI";case"euler":return"Math.E";case"add":return"("+c("A")+"+"+c("B")+")";case"subtract":return"("+c("A")+"-"+c("B")+")";case"multiply":return"("+c("A")+"*"+c("B")+")";case"divide":return"("+c("A")+"/"+c("B")+")";case"fraction":return"("+c("NUM")+"/"+c("DEN")+")";case"negate":return"(-("+c("X")+"))";case"power":return"Math.pow("+c("BASE")+","+c("EXP")+")";case"sqrt":return"Math.sqrt("+c("X")+")";case"nthroot":return"Math.pow("+c("X")+",1/("+c("N")+"))";case"abs":return"Math.abs("+c("X")+")";case"log":return"(Math.log("+c("X")+")/Math.log("+c("BASE")+"||10))";case"ln":return"Math.log("+c("X")+")";case"factorial":return"__f("+c("X")+")";case"sin":return"Math.sin("+c("X")+")";case"cos":return"Math.cos("+c("X")+")";case"tan":return"Math.tan("+c("X")+")";case"asin":return"Math.asin("+c("X")+")";case"acos":return"Math.acos("+c("X")+")";case"atan":return"Math.atan("+c("X")+")";default:return"0"}}

function __f(n){n=Math.round(n);if(n<0)return NaN;if(n<=1)return 1;var r=1;for(var i=2;i<=n;i++)r*=i;return r}
function evalExpr(b,x){if(!b)return null;try{return new Function("XV","__f","return "+toJS(b))(x,__f)}catch(e){return null}}
function fmtResult(r){if(r==null||isNaN(r))return"undefined";if(!isFinite(r))return r>0?"∞":"−∞";if(Number.isInteger(r))return r.toString();if(Math.abs(r)>1e10||(Math.abs(r)<1e-6&&r!==0))return r.toExponential(6);return parseFloat(r.toPrecision(10)).toString()}

// ── Tree ops ──
function updateInTree(t,id,fn){if(!t)return null;if(t.id===id)return fn(t);var ch=false,nc={};for(var k in t.children){if(t.children[k]){var u=updateInTree(t.children[k],id,fn);if(u!==t.children[k]){nc[k]=u;ch=true}else nc[k]=t.children[k]}else nc[k]=null}return ch?Object.assign({},t,{children:nc}):t}
function setChild(t,pid,inp,child){return updateInTree(t,pid,function(p){var c=Object.assign({},p.children);c[inp]=child;return Object.assign({},p,{children:c})})}
function updField(t,bid,v){return updateInTree(t,bid,function(b){return Object.assign({},b,{fieldValue:v})})}
function rmChild(tree,cid){if(!tree)return false;for(var k in tree.children){if(tree.children[k]&&tree.children[k].id===cid){rootBlock=setChild(rootBlock,tree.id,k,null);return true}if(tree.children[k]&&rmChild(tree.children[k],cid))return true}return false}

// ── Mode switching ──
function switchMode(mode){
  currentMode=mode;
  document.getElementById("builderMode").style.display=mode==="builder"?"flex":"none";
  document.getElementById("trigMode").style.display=mode==="trig"?"flex":"none";
  document.getElementById("equationMode").style.display=mode==="equation"?"flex":"none";
  document.getElementById("quadraticMode").style.display=mode==="quadratic"?"flex":"none";
  document.getElementById("sohcahtoaMode").style.display=mode==="sohcahtoa"?"flex":"none";
  document.getElementById("fractionsMode").style.display=mode==="fractions"?"flex":"none";
  document.getElementById("outputPanel").classList.toggle("hidden",mode!=="builder");

  if(mode==="trig")setTimeout(function(){updateTrigExplorer(parseInt(document.getElementById("trigAngleSlider").value))},60);
  if(mode==="equation")setTimeout(function(){updateEquationBalance()},60);
  if(mode==="quadratic")setTimeout(function(){updateQuadratic()},60);
  if(mode==="sohcahtoa")setTimeout(function(){updateSOH()},60);
  if(mode==="fractions")setTimeout(function(){updateFractions()},60);
}

// ── Render ──
function renderBlock(b,depth){
  if(!b)return null;var def=BLOCK_DEFS[b.type],col=def.color;
  var el=document.createElement("div");el.className="block";el.style.background=col;el.style.boxShadow="0 2px 8px "+col+"44,inset 0 1px 0 rgba(255,255,255,.15)";el.style.border="1px solid "+col;
  var rb=document.createElement("button");rb.className="block-remove";rb.textContent="✕";
  if(depth===0){rb.onclick=function(e){e.stopPropagation();rootBlock=null;currentResult=null;renderAll()};el.appendChild(rb)}
  var hd=document.createElement("div");hd.className="block-header";hd.innerHTML='<span class="diamond">◆</span> '+def.label;
  if(def.hasField==="number"){var inp=document.createElement("input");inp.type="number";inp.className="block-field-input";inp.value=b.fieldValue??0;inp.oninput=function(e){rootBlock=updField(rootBlock,b.id,parseFloat(e.target.value)||0);updateOutputs()};inp.onclick=function(e){e.stopPropagation()};hd.appendChild(inp)}
  el.appendChild(hd);
  def.inputs.forEach(function(i){
    var row=document.createElement("div");row.className="block-input-row";
    var lbl=document.createElement("span");lbl.className="input-label";lbl.textContent=INLABELS[i]||i;row.appendChild(lbl);
    if(b.children[i]){row.appendChild(renderBlock(b.children[i],depth+1))}
    else{var sl=document.createElement("div");sl.className="input-slot";sl.textContent="drop";sl.ondragover=function(e){e.preventDefault();e.stopPropagation();sl.classList.add("drag-over")};sl.ondragleave=function(){sl.classList.remove("drag-over")};sl.ondrop=function(e){e.preventDefault();e.stopPropagation();sl.classList.remove("drag-over");try{var p=JSON.parse(e.dataTransfer.getData("text/plain"));rootBlock=setChild(rootBlock,b.id,i,createBlock(p.type,p.fieldValue));renderAll()}catch(er){}};row.appendChild(sl)}
    el.appendChild(row)});
  if(depth>0){var rb2=document.createElement("button");rb2.className="block-remove";rb2.textContent="✕";rb2.onclick=function(e){e.stopPropagation();rmChild(rootBlock,b.id);renderAll()};el.appendChild(rb2)}
  return el}

function renderAll(){renderCanvas();renderTabs();renderPalette();updateOutputs()}

function renderCanvas(){var cv=document.getElementById("canvas");cv.innerHTML="";if(rootBlock){cv.classList.remove("empty");cv.appendChild(renderBlock(rootBlock,0))}else{cv.classList.add("empty");var p=document.createElement("div");p.className="canvas-placeholder";p.textContent="Drag a block here to start building";cv.appendChild(p)}}

function renderTabs(){
  var c=document.getElementById("categoryTabs");c.innerHTML="";
  CATS.forEach(function(cat){
    if(cat.id==="_sep"){var s=document.createElement("div");s.className="cat-sep";c.appendChild(s);return}
    var b=document.createElement("button");b.className="cat-tab"+(activeCat===cat.id?" active":"");b.textContent=cat.label;
    if(activeCat===cat.id)b.style.background=cat.color;
    b.onclick=function(){activeCat=cat.id;switchMode(cat.mode);renderTabs();renderPalette()};
    c.appendChild(b)})
}

function renderPalette(){
  var pal=document.getElementById("blockPalette");pal.innerHTML="";
  if(currentMode!=="builder")return;
  // For trig builder mode, show trig blocks
  var showCat=activeCat;
  Object.keys(BLOCK_DEFS).forEach(function(t){var d=BLOCK_DEFS[t];if(d.category!==showCat)return;
    var el=document.createElement("div");el.className="palette-block";el.textContent=d.label;el.style.background=d.color;el.style.border="1px solid "+d.color;el.draggable=true;
    el.ondragstart=function(e){e.dataTransfer.setData("text/plain",JSON.stringify({type:t}));e.dataTransfer.effectAllowed="copy"};pal.appendChild(el)})}

function updateOutputs(){
  var ke=document.getElementById("katexOutput");
  if(rootBlock){var lx=toLatex(rootBlock);currentLatex=lx;try{katex.render(lx,ke,{displayMode:true,throwOnError:false})}catch(e){ke.innerHTML='<span class="ph">Invalid</span>'}}
  else{currentLatex=null;ke.innerHTML='<span class="ph">Build an equation with blocks…</span>'}}

function updateResult(){var el=document.getElementById("resultOutput");if(currentResult!==null){el.textContent=fmtResult(currentResult);el.className="result-display has-value"}else{el.innerHTML='<span class="ph">Click evaluate</span>';el.className="result-display"}}

function copyToClipboard(t,btn){navigator.clipboard.writeText(t).then(function(){btn.classList.add("copied");btn.querySelector(".copy-label").textContent="Copied!";setTimeout(function(){btn.classList.remove("copied");btn.querySelector(".copy-label").textContent="Copy LaTeX"},1500)}).catch(function(){var ta=document.createElement("textarea");ta.value=t;ta.style.cssText="position:fixed;opacity:0";document.body.appendChild(ta);ta.select();document.execCommand("copy");document.body.removeChild(ta);btn.classList.add("copied");btn.querySelector(".copy-label").textContent="Copied!";setTimeout(function(){btn.classList.remove("copied");btn.querySelector(".copy-label").textContent="Copy LaTeX"},1500)})}

// ── Init ──
document.addEventListener("DOMContentLoaded",function(){
  var cv=document.getElementById("canvas");
  cv.ondragover=function(e){e.preventDefault()};
  cv.ondrop=function(e){e.preventDefault();if(rootBlock)return;try{var p=JSON.parse(e.dataTransfer.getData("text/plain"));rootBlock=createBlock(p.type,p.fieldValue);renderAll()}catch(er){}};

  document.getElementById("evalBtn").onclick=function(){currentResult=rootBlock?evalExpr(rootBlock,xValue):null;updateResult()};
  document.getElementById("xSlider").oninput=function(e){xValue=parseFloat(e.target.value);document.getElementById("xValueDisplay").textContent=xValue;if(currentResult!==null&&rootBlock){currentResult=evalExpr(rootBlock,xValue);updateResult()}};

  // Make builder mode flex
  document.getElementById("builderMode").style.display="flex";
  document.getElementById("builderMode").style.flexDirection="column";
  document.getElementById("builderMode").style.flex="1";

  initTrigExplorer();initEquationBalance();initQuadratic();initSOH();initFractions();
  renderAll();updateResult()});

// ═══ Trig Explorer ═══
function initTrigExplorer(){document.getElementById("trigAngleSlider").oninput=function(){updateTrigExplorer(parseInt(this.value))};updateTrigExplorer(45)}

function updateTrigExplorer(d){
  var r=d*Math.PI/180;document.getElementById("trigAngleDisplay").textContent=d+"°";
  document.getElementById("trigRadiansDisplay").textContent="= "+fmtRad(d);
  var s=Math.sin(r),co=Math.cos(r),t=Math.tan(r);
  document.getElementById("trigSinVal").textContent=fmtT(s);document.getElementById("trigCosVal").textContent=fmtT(co);
  document.getElementById("trigTanVal").textContent=Math.abs(t)>1e6?"undef":fmtT(t);
  updQuad(d);updTrigExp(d);drawCircle(d,r,s,co,t)}

function fmtT(v){if(Math.abs(v)<1e-10)return"0";if(Math.abs(v-1)<1e-10)return"1";if(Math.abs(v+1)<1e-10)return"−1";return v.toFixed(4)}
function fmtRad(d){var m={0:"0",30:"π/6",45:"π/4",60:"π/3",90:"π/2",120:"2π/3",135:"3π/4",150:"5π/6",180:"π",210:"7π/6",225:"5π/4",240:"4π/3",270:"3π/2",300:"5π/3",315:"7π/4",330:"11π/6",360:"2π"};return(m[d]||(d*Math.PI/180).toFixed(3))+" rad"}
function updQuad(d){var el=document.getElementById("trigQuadrant"),n=((d%360)+360)%360,q,s;if(n===0||n===360){q="Positive x-axis";s="sin=0, cos=1"}else if(n===90){q="Positive y-axis";s="sin=1, cos=0, tan=undef"}else if(n===180){q="Negative x-axis";s="sin=0, cos=−1"}else if(n===270){q="Negative y-axis";s="sin=−1, cos=0, tan=undef"}else if(n<90){q="Quadrant I";s="sin+, cos+, tan+"}else if(n<180){q="Quadrant II";s="sin+, cos−, tan−"}else if(n<270){q="Quadrant III";s="sin−, cos−, tan+"}else{q="Quadrant IV";s="sin−, cos+, tan−"}el.textContent=q+" — "+s}
function updTrigExp(d){var el=document.getElementById("trigExplanation"),n=((d%360)+360)%360;var sp={0:"At 0° the point is (1,0).",30:"30°: sin=0.5 from the 30-60-90 triangle.",45:"45°: sin and cos are equal (√2/2 ≈ 0.707). tan=1.",60:"60°: sin=√3/2 ≈ 0.866, cos=0.5.",90:"At 90°: sin=1, cos=0, tan is undefined.",180:"At 180°: sin=0, cos=−1.",270:"At 270°: sin=−1, cos=0, tan undefined.",360:"360° = full circle, back to (1,0)."};el.innerHTML=sp[n]||'<strong style="color:#ef4444">sin</strong> = y-coord, <strong style="color:#3b82f6">cos</strong> = x-coord, <strong style="color:#f59e0b">tan</strong> extends to x=1 line.'}

function drawCircle(deg,rad,sinV,cosV,tanV){
  var cv=document.getElementById("trigCanvas"),ctx=cv.getContext("2d"),dpr=window.devicePixelRatio||1,rect=cv.getBoundingClientRect();
  cv.width=rect.width*dpr;cv.height=rect.height*dpr;ctx.scale(dpr,dpr);
  var W=rect.width,H=rect.height,cx=W/2,cy=H/2,R=Math.min(W,H)*0.4;
  ctx.clearRect(0,0,W,H);
  ctx.strokeStyle="#1e2d4a";ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(10,cy);ctx.lineTo(W-10,cy);ctx.moveTo(cx,10);ctx.lineTo(cx,H-10);ctx.stroke();
  ctx.fillStyle="#3d506e";ctx.font="11px 'JetBrains Mono',monospace";ctx.textAlign="center";ctx.fillText("1",cx+R,cy+16);ctx.fillText("−1",cx-R,cy+16);ctx.textAlign="right";ctx.fillText("1",cx-8,cy-R+5);ctx.fillText("−1",cx-8,cy+R+5);
  ctx.strokeStyle="#4a5a78";ctx.lineWidth=1.5;ctx.beginPath();ctx.arc(cx,cy,R,0,Math.PI*2);ctx.stroke();
  var px=cx+R*cosV,py=cy-R*sinV;
  ctx.strokeStyle="rgba(236,72,153,.5)";ctx.lineWidth=2;ctx.beginPath();ctx.arc(cx,cy,R*.22,0,-rad,true);ctx.stroke();
  var la=-rad/2,lr=R*.22+14;ctx.fillStyle="#ec4899";ctx.font="bold 12px 'Outfit',sans-serif";ctx.textAlign="center";ctx.textBaseline="middle";ctx.fillText(deg+"°",cx+lr*Math.cos(la),cy+lr*Math.sin(la));
  ctx.strokeStyle="#8896b0";ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(px,py);ctx.stroke();
  ctx.strokeStyle="#3b82f6";ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(px,cy);ctx.stroke();
  ctx.fillStyle="#3b82f6";ctx.font="bold 11px 'JetBrains Mono',monospace";ctx.textAlign="center";ctx.textBaseline="top";ctx.fillText("cos",(cx+px)/2,cy+(sinV>=0?8:-16));
  ctx.strokeStyle="#ef4444";ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(px,cy);ctx.lineTo(px,py);ctx.stroke();
  ctx.fillStyle="#ef4444";ctx.textAlign="left";ctx.textBaseline="middle";ctx.fillText("sin",px+(cosV>=0?8:-28),(cy+py)/2);
  if(Math.abs(cosV)>.01){var tY=cy-R*(sinV/cosV);tY=Math.max(10,Math.min(H-10,tY));ctx.strokeStyle="#f59e0b";ctx.lineWidth=2;ctx.setLineDash([5,3]);ctx.beginPath();ctx.moveTo(cx+R,cy);ctx.lineTo(cx+R,tY);ctx.stroke();ctx.setLineDash([]);ctx.strokeStyle="rgba(245,158,11,.4)";ctx.lineWidth=1;ctx.setLineDash([3,3]);ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(cx+R,tY);ctx.stroke();ctx.setLineDash([]);ctx.fillStyle="#f59e0b";ctx.font="bold 11px 'JetBrains Mono',monospace";ctx.textAlign="left";ctx.fillText("tan",cx+R+6,Math.max(20,Math.min(H-10,(cy+tY)/2)))}
  ctx.fillStyle="#fff";ctx.beginPath();ctx.arc(px,py,6,0,Math.PI*2);ctx.fill();ctx.strokeStyle="#ec4899";ctx.lineWidth=2;ctx.stroke();
  ctx.fillStyle="#e2e8f0";ctx.font="12px 'JetBrains Mono',monospace";ctx.textAlign=cosV>=0?"left":"right";ctx.textBaseline=sinV>=0?"bottom":"top";ctx.fillText("("+cosV.toFixed(2)+", "+sinV.toFixed(2)+")",px+(cosV>=0?10:-10),py+(sinV>=0?-10:10))}
