function initRatioExplorer(){
  document.getElementById("ratioA").oninput=updateRatioExplorer;
  document.getElementById("ratioB").oninput=updateRatioExplorer;
  document.getElementById("ratioTotal").oninput=updateRatioExplorer;
  document.getElementById("ratioHintBtn").onclick=showRatioHint;
  updateRatioExplorer()}

function updateRatioExplorer(){
  var a=parseInt(document.getElementById("ratioA").value)||1,b=parseInt(document.getElementById("ratioB").value)||1;
  var total=parseFloat(document.getElementById("ratioTotal").value)||0;
  document.getElementById("ratioADisplay").textContent=a;document.getElementById("ratioBDisplay").textContent=b;
  var parts=a+b,sA=total>0?(a/parts)*total:0,sB=total>0?(b/parts)*total:0,pV=total>0?total/parts:0;
  document.getElementById("ratioText").textContent=a+" : "+b;document.getElementById("ratioSimplified").textContent=simpR(a,b);
  document.getElementById("ratioShareA").textContent=fN(sA);document.getElementById("ratioShareB").textContent=fN(sB);
  document.getElementById("ratioPartVal").textContent=fN(pV);document.getElementById("ratioParts").textContent=parts;
  drawRatioBar(a,b,total,sA,sB);document.getElementById("ratioHintText").style.display="none"}

function simpR(a,b){var g=gcd(a,b),sa=a/g,sb=b/g;return(sa===a&&sb===b)?"":"= "+sa+" : "+sb}
function gcd(x,y){x=Math.abs(x);y=Math.abs(y);while(y){var t=y;y=x%y;x=t}return x}
function fN(n){return n%1===0?n.toString():n.toFixed(2)}

function drawRatioBar(a,b,total,sA,sB){
  var cv=document.getElementById("ratioCanvas"),ctx=cv.getContext("2d"),dpr=window.devicePixelRatio||1,rect=cv.getBoundingClientRect();
  cv.width=rect.width*dpr;cv.height=rect.height*dpr;ctx.scale(dpr,dpr);
  var W=rect.width,H=rect.height,parts=a+b;ctx.clearRect(0,0,W,H);

  // Big bar
  var barY=H*0.2,barH=H*0.32,barL=30,barR=W-30,barW=barR-barL;

  ctx.fillStyle="#1a2236";ctx.strokeStyle="#2a3650";ctx.lineWidth=1;
  rr(ctx,barL,barY,barW,barH,10,true,true);

  var wA=(a/parts)*barW;
  ctx.fillStyle="#3b82f6";rrC(ctx,barL,barY,wA,barH,10,"left");
  ctx.fillStyle="#f59e0b";rrC(ctx,barL+wA,barY,barW-wA,barH,10,"right");

  ctx.strokeStyle="#080c16";ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(barL+wA,barY);ctx.lineTo(barL+wA,barY+barH);ctx.stroke();

  // Part ticks
  ctx.strokeStyle="rgba(255,255,255,.15)";ctx.lineWidth=1;var pW=barW/parts;
  for(var i=1;i<parts;i++){ctx.beginPath();ctx.moveTo(barL+i*pW,barY+barH-10);ctx.lineTo(barL+i*pW,barY+barH);ctx.stroke()}

  // Labels on bars
  ctx.fillStyle="#fff";ctx.font="bold "+Math.min(18,barH*.35)+"px 'Outfit',sans-serif";ctx.textAlign="center";ctx.textBaseline="middle";
  if(wA>60)ctx.fillText("A = "+a+" part"+(a>1?"s":""),barL+wA/2,barY+barH/2);
  if(barW-wA>60)ctx.fillText("B = "+b+" part"+(b>1?"s":""),barL+wA+(barW-wA)/2,barY+barH/2);

  // Share values below
  var ly=barY+barH+30;
  ctx.font="bold 16px 'JetBrains Mono',monospace";
  if(total>0){
    ctx.fillStyle="#3b82f6";ctx.textAlign="center";ctx.fillText(fN(sA),barL+wA/2,ly);
    ctx.fillStyle="#f59e0b";ctx.fillText(fN(sB),barL+wA+(barW-wA)/2,ly);
    ctx.fillStyle="#8896b0";ctx.font="13px 'Outfit',sans-serif";ctx.fillText("Total = "+fN(total),W/2,ly+26)
  }else{ctx.fillStyle="#3d506e";ctx.font="13px 'Outfit',sans-serif";ctx.textAlign="center";ctx.fillText("Enter a total to see share values",W/2,ly+10)}

  // Title
  ctx.fillStyle="#e2e8f0";ctx.font="bold 14px 'Outfit',sans-serif";ctx.textAlign="left";ctx.fillText("Ratio "+a+" : "+b,barL,barY-14);
  var sr=simpR(a,b);if(sr){ctx.fillStyle="#6b7fa3";ctx.font="12px 'Outfit',sans-serif";ctx.fillText(sr,barL+ctx.measureText("Ratio "+a+" : "+b+"  ").width+14,barY-14)}}

function rr(ctx,x,y,w,h,r,f,s){ctx.beginPath();ctx.moveTo(x+r,y);ctx.lineTo(x+w-r,y);ctx.quadraticCurveTo(x+w,y,x+w,y+r);ctx.lineTo(x+w,y+h-r);ctx.quadraticCurveTo(x+w,y+h,x+w-r,y+h);ctx.lineTo(x+r,y+h);ctx.quadraticCurveTo(x,y+h,x,y+h-r);ctx.lineTo(x,y+r);ctx.quadraticCurveTo(x,y,x+r,y);ctx.closePath();if(f)ctx.fill();if(s)ctx.stroke()}
function rrC(ctx,x,y,w,h,r,side){ctx.save();ctx.beginPath();if(side==="left"){ctx.moveTo(x+r,y);ctx.lineTo(x+w,y);ctx.lineTo(x+w,y+h);ctx.lineTo(x+r,y+h);ctx.quadraticCurveTo(x,y+h,x,y+h-r);ctx.lineTo(x,y+r);ctx.quadraticCurveTo(x,y,x+r,y)}else{ctx.moveTo(x,y);ctx.lineTo(x+w-r,y);ctx.quadraticCurveTo(x+w,y,x+w,y+r);ctx.lineTo(x+w,y+h-r);ctx.quadraticCurveTo(x+w,y+h,x+w-r,y+h);ctx.lineTo(x,y+h)}ctx.closePath();ctx.fill();ctx.restore()}

function showRatioHint(){
  var a=parseInt(document.getElementById("ratioA").value)||1,b=parseInt(document.getElementById("ratioB").value)||1;
  var total=parseFloat(document.getElementById("ratioTotal").value)||0,parts=a+b,g=gcd(a,b),el=document.getElementById("ratioHintText");
  var h=["<b>Step 1:</b> Add the parts: "+a+" + "+b+" = "+parts+" total parts."];
  if(g>1)h.push("<b>Note:</b> "+a+":"+b+" simplifies to "+(a/g)+":"+(b/g)+" (÷"+g+")");
  if(total>0){var pv=total/parts;h.push("<b>Step 2:</b> Divide total by parts: "+fN(total)+" ÷ "+parts+" = "+fN(pv)+" per part.");h.push("<b>Step 3:</b> A gets "+a+" × "+fN(pv)+" = <b>"+fN(a*pv)+"</b>");h.push("B gets "+b+" × "+fN(pv)+" = <b>"+fN(b*pv)+"</b>");h.push("<b>Check:</b> "+fN(a*pv)+" + "+fN(b*pv)+" = "+fN(total)+" ✓")}
  else h.push("Enter a total to see sharing steps.");
  el.innerHTML=h.join("<br>");el.style.display="block"}
