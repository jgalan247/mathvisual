// ═══════════════════════════════════════════════
// Angle Relationships Explorer
// Complementary, Supplementary, Vertically Opposite,
// Alternate, Co-interior, Corresponding
// ═══════════════════════════════════════════════

var ang = {
  angle: 55,
  mode: "complementary" // complementary, supplementary, vertically, alternate, cointerior, corresponding
};

var ANG_MODES = [
  { id: "complementary", label: "Complementary", color: "#3b82f6", desc: "Two angles that add up to 90°", max: 89 },
  { id: "supplementary", label: "Supplementary", color: "#8b5cf6", desc: "Two angles that add up to 180°", max: 179 },
  { id: "vertically", label: "Vertically Opposite", color: "#f59e0b", desc: "Equal angles formed when two lines cross", max: 179 },
  { id: "alternate", label: "Alternate (Z)", color: "#10b981", desc: "Equal angles on opposite sides of a transversal cutting parallel lines", max: 179 },
  { id: "cointerior", label: "Co-interior (C)", color: "#ef4444", desc: "Angles on the same side of a transversal — add up to 180°", max: 179 },
  { id: "corresponding", label: "Corresponding (F)", color: "#ec4899", desc: "Equal angles in matching positions at parallel lines", max: 179 }
];

function initAngles() {
  // Mode buttons
  document.querySelectorAll(".ang-mode-btn").forEach(function (btn) {
    btn.onclick = function () {
      document.querySelectorAll(".ang-mode-btn").forEach(function (b) { b.classList.remove("active"); });
      this.classList.add("active");
      ang.mode = this.dataset.amode;
      var m = ANG_MODES.find(function (m) { return m.id === ang.mode; });
      var slider = document.getElementById("angSlider");
      slider.max = m.max;
      if (parseInt(slider.value) > m.max) { slider.value = m.max; ang.angle = m.max; }
      updateAngles();
    };
  });

  // Slider
  document.getElementById("angSlider").oninput = function () {
    ang.angle = parseInt(this.value);
    updateAngles();
  };

  updateAngles();
}

function updateAngles() {
  var a = ang.angle;
  var mode = ang.mode;
  var m = ANG_MODES.find(function (x) { return x.id === mode; });

  // Update display
  document.getElementById("angAngleDisplay").textContent = a + "°";
  document.getElementById("angAngleDisplay").style.color = m.color;
  document.getElementById("angDesc").textContent = m.desc;

  // Calculate related angle
  var related, relLabel, rule;
  if (mode === "complementary") {
    related = 90 - a;
    relLabel = "Complement";
    rule = a + "° + " + related + "° = 90°";
  } else if (mode === "supplementary") {
    related = 180 - a;
    relLabel = "Supplement";
    rule = a + "° + " + related + "° = 180°";
  } else if (mode === "vertically") {
    related = a;
    relLabel = "Vertically opposite";
    rule = "Both angles = " + a + "° (equal)";
  } else if (mode === "alternate") {
    related = a;
    relLabel = "Alternate angle";
    rule = "Both angles = " + a + "° (equal, Z-rule)";
  } else if (mode === "cointerior") {
    related = 180 - a;
    relLabel = "Co-interior";
    rule = a + "° + " + related + "° = 180° (C-rule)";
  } else {
    related = a;
    relLabel = "Corresponding";
    rule = "Both angles = " + a + "° (equal, F-rule)";
  }

  document.getElementById("angRelated").textContent = related + "°";
  document.getElementById("angRelated").style.color = m.color;
  document.getElementById("angRelLabel").textContent = relLabel;
  document.getElementById("angRule").textContent = rule;

  // KaTeX equation
  var latex;
  if (mode === "complementary") latex = "\\alpha + \\beta = 90° \\quad\\Rightarrow\\quad \\beta = 90° - " + a + "° = " + related + "°";
  else if (mode === "supplementary") latex = "\\alpha + \\beta = 180° \\quad\\Rightarrow\\quad \\beta = 180° - " + a + "° = " + related + "°";
  else if (mode === "vertically") latex = "\\alpha = \\beta = " + a + "° \\quad\\text{(vertically opposite angles are equal)}";
  else if (mode === "alternate") latex = "\\alpha = \\beta = " + a + "° \\quad\\text{(alternate angles are equal)}";
  else if (mode === "cointerior") latex = "\\alpha + \\beta = 180° \\quad\\Rightarrow\\quad \\beta = 180° - " + a + "° = " + related + "°";
  else latex = "\\alpha = \\beta = " + a + "° \\quad\\text{(corresponding angles are equal)}";

  try { katex.render(latex, document.getElementById("angKatex"), { displayMode: true, throwOnError: false }); } catch (e) { }

  drawAngles(a, related, mode, m.color);
}

function drawAngles(a, related, mode, col) {
  var cv = document.getElementById("angCanvas");
  if (!cv) return;
  var rect = cv.getBoundingClientRect();
  if (rect.width < 10) return;
  var ctx = cv.getContext("2d");
  var dpr = window.devicePixelRatio || 1;
  cv.width = rect.width * dpr; cv.height = rect.height * dpr; ctx.scale(dpr, dpr);
  var W = rect.width, H = rect.height;
  ctx.clearRect(0, 0, W, H);

  var cx = W / 2, cy = H / 2;

  if (mode === "complementary") drawComplementary(ctx, W, H, cx, cy, a, col);
  else if (mode === "supplementary") drawSupplementary(ctx, W, H, cx, cy, a, col);
  else if (mode === "vertically") drawVerticallyOpposite(ctx, W, H, cx, cy, a, col);
  else if (mode === "alternate") drawParallelLines(ctx, W, H, a, col, "alternate");
  else if (mode === "cointerior") drawParallelLines(ctx, W, H, a, col, "cointerior");
  else drawParallelLines(ctx, W, H, a, col, "corresponding");
}

function drawComplementary(ctx, W, H, cx, cy, a, col) {
  var R = Math.min(W, H) * 0.35;
  var ox = cx - R * 0.3, oy = cy + R * 0.3;

  // Right angle box
  var rad1 = a * Math.PI / 180;
  var endX = ox + R * Math.cos(0), endY = oy;
  var topX = ox, topY = oy - R;

  // Draw the two rays and vertical
  ctx.strokeStyle = "#4a5a78"; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(ox, oy); ctx.lineTo(ox + R * 1.1, oy); ctx.stroke(); // horizontal
  ctx.beginPath(); ctx.moveTo(ox, oy); ctx.lineTo(ox, oy - R * 1.1); ctx.stroke(); // vertical

  // Right angle marker
  var sq = 14;
  ctx.strokeStyle = "#64748b"; ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.moveTo(ox + sq, oy); ctx.lineTo(ox + sq, oy - sq); ctx.lineTo(ox, oy - sq); ctx.stroke();

  // Angle ray
  var rayX = ox + R * Math.cos(-rad1), rayY = oy + R * Math.sin(-rad1);
  ctx.strokeStyle = "#e2e8f0"; ctx.lineWidth = 2.5;
  ctx.beginPath(); ctx.moveTo(ox, oy); ctx.lineTo(rayX, rayY); ctx.stroke();

  // Alpha arc
  var arcR = R * 0.3;
  ctx.strokeStyle = col; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.arc(ox, oy, arcR, 0, -rad1, true); ctx.stroke();
  // Alpha label
  ctx.fillStyle = col; ctx.font = "bold 14px 'Outfit',sans-serif"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
  var la1 = -rad1 / 2; var lr1 = arcR + 18;
  ctx.fillText("α = " + a + "°", ox + lr1 * Math.cos(la1), oy + lr1 * Math.sin(la1));

  // Beta arc
  var rad90 = Math.PI / 2;
  ctx.strokeStyle = "#34d399"; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.arc(ox, oy, arcR * 0.7, -rad1, -rad90, true); ctx.stroke();
  // Beta label
  var la2 = -(rad1 + rad90) / 2; var lr2 = arcR * 0.7 + 18;
  ctx.fillStyle = "#34d399"; ctx.font = "bold 14px 'Outfit',sans-serif";
  ctx.fillText("β = " + (90 - a) + "°", ox + lr2 * Math.cos(la2), oy + lr2 * Math.sin(la2));

  // 90° label
  ctx.fillStyle = "#64748b"; ctx.font = "11px 'JetBrains Mono',monospace";
  ctx.fillText("90°", ox + sq + 12, oy - sq - 6);
}

function drawSupplementary(ctx, W, H, cx, cy, a, col) {
  var R = Math.min(W, H) * 0.35;
  var oy = cy + 20;

  // Straight line
  ctx.strokeStyle = "#4a5a78"; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(cx - R * 1.2, oy); ctx.lineTo(cx + R * 1.2, oy); ctx.stroke();

  // Angle ray
  var rad1 = a * Math.PI / 180;
  var rayX = cx + R * Math.cos(Math.PI - rad1), rayY = oy + R * Math.sin(Math.PI - rad1);
  ctx.strokeStyle = "#e2e8f0"; ctx.lineWidth = 2.5;
  ctx.beginPath(); ctx.moveTo(cx, oy); ctx.lineTo(rayX, rayY); ctx.stroke();

  // Alpha arc (left side)
  var arcR = R * 0.25;
  ctx.strokeStyle = col; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.arc(cx, oy, arcR, Math.PI, Math.PI - rad1, true); ctx.stroke();
  // Alpha label
  var la1 = Math.PI - rad1 / 2; var lr1 = arcR + 20;
  ctx.fillStyle = col; ctx.font = "bold 14px 'Outfit',sans-serif"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
  ctx.fillText("α = " + a + "°", cx + lr1 * Math.cos(la1), oy + lr1 * Math.sin(la1));

  // Beta arc (right side)
  ctx.strokeStyle = "#34d399"; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.arc(cx, oy, arcR * 0.7, 0, Math.PI - rad1, true); ctx.stroke();
  // Beta label
  var la2 = (Math.PI - rad1) / 2; var lr2 = arcR * 0.7 + 20;
  ctx.fillStyle = "#34d399"; ctx.font = "bold 14px 'Outfit',sans-serif";
  ctx.fillText("β = " + (180 - a) + "°", cx + lr2 * Math.cos(la2), oy + lr2 * Math.sin(la2));

  // 180° annotation on line
  ctx.fillStyle = "#64748b"; ctx.font = "11px 'JetBrains Mono',monospace"; ctx.textAlign = "center";
  ctx.fillText("straight line = 180°", cx, oy + 30);
}

function drawVerticallyOpposite(ctx, W, H, cx, cy, a, col) {
  var R = Math.min(W, H) * 0.38;
  var rad1 = a * Math.PI / 180;

  // Two crossing lines
  var dx = R * Math.cos(rad1 / 2), dy = R * Math.sin(rad1 / 2);
  ctx.strokeStyle = "#4a5a78"; ctx.lineWidth = 2;
  // Line 1 — horizontal
  ctx.beginPath(); ctx.moveTo(cx - R, cy); ctx.lineTo(cx + R, cy); ctx.stroke();
  // Line 2 — angled
  var ang2 = rad1;
  ctx.beginPath();
  ctx.moveTo(cx - R * Math.cos(ang2), cy + R * Math.sin(ang2));
  ctx.lineTo(cx + R * Math.cos(ang2), cy - R * Math.sin(ang2));
  ctx.stroke();

  // Alpha arc (top-right)
  var arcR = R * 0.2;
  ctx.strokeStyle = col; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.arc(cx, cy, arcR, -ang2, 0); ctx.stroke();
  ctx.fillStyle = col; ctx.font = "bold 13px 'Outfit',sans-serif"; ctx.textAlign = "left"; ctx.textBaseline = "middle";
  var la1 = -ang2 / 2;
  ctx.fillText("α = " + a + "°", cx + arcR * 1.4 * Math.cos(la1), cy + arcR * 1.4 * Math.sin(la1));

  // Beta arc (bottom-left, vertically opposite)
  ctx.strokeStyle = col; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.arc(cx, cy, arcR, Math.PI - ang2, Math.PI); ctx.stroke();
  ctx.fillStyle = col; ctx.textAlign = "right";
  var la2 = Math.PI - ang2 / 2;
  ctx.fillText("β = " + a + "°", cx + arcR * 1.4 * Math.cos(la2), cy + arcR * 1.4 * Math.sin(la2));

  // Supplementary angles
  var supp = 180 - a;
  ctx.strokeStyle = "#64748b"; ctx.lineWidth = 1.5; ctx.setLineDash([4, 3]);
  ctx.beginPath(); ctx.arc(cx, cy, arcR * 0.65, 0, Math.PI - ang2); ctx.stroke();
  ctx.setLineDash([]);
  ctx.fillStyle = "#64748b"; ctx.font = "11px 'JetBrains Mono',monospace"; ctx.textAlign = "center";
  ctx.fillText(supp + "°", cx + arcR * 1.1, cy + arcR * 0.6);
  ctx.fillText(supp + "°", cx - arcR * 1.1, cy - arcR * 0.6);
}

function drawParallelLines(ctx, W, H, a, col, type) {
  var R = Math.min(W, H) * 0.38;
  var gap = 80;
  var y1 = H / 2 - gap / 2, y2 = H / 2 + gap / 2;
  var cx = W / 2;
  var rad = a * Math.PI / 180;

  // Parallel lines
  ctx.strokeStyle = "#4a5a78"; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(40, y1); ctx.lineTo(W - 40, y1); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(40, y2); ctx.lineTo(W - 40, y2); ctx.stroke();

  // Parallel markers (arrows)
  var mkX = 100;
  drawParallelMark(ctx, mkX, y1);
  drawParallelMark(ctx, mkX, y2);

  // Transversal
  var tLen = R * 1.4;
  var tx1 = cx - tLen * Math.cos(rad), ty1 = y1 - tLen * Math.sin(rad) + gap / 2;
  var tx2 = cx + tLen * Math.cos(rad), ty2 = y1 + tLen * Math.sin(rad) + gap / 2;

  // Calculate where transversal meets each parallel line
  var int1x = cx + (y1 - H / 2) / Math.tan(rad) * (rad > Math.PI / 2 ? -1 : 1);
  // Simpler: just use cx offset
  var off = (gap / 2) / Math.tan(rad);
  var ix1 = cx - off, ix2 = cx + off;

  ctx.strokeStyle = "#e2e8f0"; ctx.lineWidth = 2.5;
  ctx.beginPath(); ctx.moveTo(ix1 - R * 0.6 * Math.cos(rad), y1 - R * 0.6 * Math.sin(rad));
  ctx.lineTo(ix2 + R * 0.6 * Math.cos(rad), y2 + R * 0.6 * Math.sin(rad)); ctx.stroke();

  // Draw angle arcs
  var arcR = 25;

  if (type === "alternate") {
    // Alpha at top intersection (between transversal and line, below-right)
    ctx.strokeStyle = col; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.arc(ix1, y1, arcR, 0, Math.PI - rad, true); ctx.stroke();
    ctx.fillStyle = col; ctx.font = "bold 13px 'Outfit',sans-serif"; ctx.textAlign = "left"; ctx.textBaseline = "bottom";
    ctx.fillText("α = " + a + "°", ix1 + arcR + 6, y1 + arcR * 0.3);

    // Beta at bottom intersection (above-left — alternate position)
    ctx.strokeStyle = col; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.arc(ix2, y2, arcR, Math.PI, Math.PI + (Math.PI - rad)); ctx.stroke();
    ctx.fillStyle = col; ctx.textAlign = "right"; ctx.textBaseline = "top";
    ctx.fillText("β = " + a + "°", ix2 - arcR - 6, y2 - arcR * 0.3);

    // Z shape hint
    ctx.strokeStyle = "rgba(16,185,129,.3)"; ctx.lineWidth = 1.5; ctx.setLineDash([4, 3]);
    ctx.beginPath(); ctx.moveTo(ix1 + 40, y1); ctx.lineTo(ix1, y1); ctx.lineTo(ix2, y2); ctx.lineTo(ix2 - 40, y2); ctx.stroke();
    ctx.setLineDash([]);
  } else if (type === "cointerior") {
    // Alpha at top intersection (below-right)
    ctx.strokeStyle = col; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.arc(ix1, y1, arcR, 0, Math.PI - rad, true); ctx.stroke();
    ctx.fillStyle = col; ctx.font = "bold 13px 'Outfit',sans-serif"; ctx.textAlign = "left"; ctx.textBaseline = "bottom";
    ctx.fillText("α = " + a + "°", ix1 + arcR + 6, y1 + arcR * 0.3);

    // Beta at bottom intersection (above-right — same side as alpha)
    var beta = 180 - a;
    ctx.strokeStyle = "#34d399"; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.arc(ix2, y2, arcR, -(Math.PI - rad), 0); ctx.stroke();
    ctx.fillStyle = "#34d399"; ctx.textAlign = "left"; ctx.textBaseline = "top";
    ctx.fillText("β = " + beta + "°", ix2 + arcR + 6, y2 - arcR * 0.6);

    // C shape hint
    ctx.strokeStyle = "rgba(239,68,68,.3)"; ctx.lineWidth = 1.5; ctx.setLineDash([4, 3]);
    ctx.beginPath(); ctx.moveTo(ix1 + 40, y1); ctx.lineTo(ix1, y1); ctx.lineTo(ix2, y2); ctx.lineTo(ix2 + 40, y2); ctx.stroke();
    ctx.setLineDash([]);
  } else {
    // Corresponding: same position at both intersections
    // Alpha at top intersection (above-right)
    ctx.strokeStyle = col; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.arc(ix1, y1, arcR, -(Math.PI - rad), 0); ctx.stroke();
    ctx.fillStyle = col; ctx.font = "bold 13px 'Outfit',sans-serif"; ctx.textAlign = "left"; ctx.textBaseline = "top";
    ctx.fillText("α = " + a + "°", ix1 + arcR + 6, y1 - arcR * 0.6);

    // Beta at bottom intersection (same position — above-right)
    ctx.strokeStyle = col; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.arc(ix2, y2, arcR, -(Math.PI - rad), 0); ctx.stroke();
    ctx.fillStyle = col; ctx.textAlign = "left"; ctx.textBaseline = "top";
    ctx.fillText("β = " + a + "°", ix2 + arcR + 6, y2 - arcR * 0.6);

    // F shape hint
    ctx.strokeStyle = "rgba(236,72,153,.3)"; ctx.lineWidth = 1.5; ctx.setLineDash([4, 3]);
    ctx.beginPath(); ctx.moveTo(ix1, y1); ctx.lineTo(ix1 + 40, y1); ctx.moveTo(ix1, y1); ctx.lineTo(ix2, y2); ctx.moveTo(ix2, y2); ctx.lineTo(ix2 + 40, y2); ctx.stroke();
    ctx.setLineDash([]);
  }
}

function drawParallelMark(ctx, x, y) {
  ctx.strokeStyle = "#64748b"; ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.moveTo(x - 4, y - 5); ctx.lineTo(x + 2, y + 5); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(x + 2, y - 5); ctx.lineTo(x + 8, y + 5); ctx.stroke();
}
