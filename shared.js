// ═══════════════════════════════════════════════════════════
// shared.js — Ateliers CD47 v15.0
// Code commun frontend + admin
// ═══════════════════════════════════════════════════════════

// ── CSS injection ──────────────────────────────────────────
(function injectCSS(){
  const s=document.createElement('style');
  s.textContent=`
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:'Segoe UI',sans-serif;background:#f0f4f8;color:#1a202c;font-size:14px}
nav{background:#197d89;color:#fff;padding:0 20px;display:flex;align-items:center;justify-content:space-between;gap:4px;height:52px;box-shadow:0 2px 8px rgba(0,0,0,.2);position:sticky;top:0;z-index:100;transition:background .3s}
nav .logo{font-weight:700;font-size:16px;margin-right:16px;white-space:nowrap}
nav .admin-badge{background:#dc2626;color:#fff;font-size:10px;font-weight:700;padding:2px 6px;border-radius:10px;margin-left:4px}
nav button{background:none;border:none;color:rgba(255,255,255,.75);padding:6px 12px;border-radius:6px;cursor:pointer;font-size:13px;transition:all .2s}
nav button:hover{background:rgba(255,255,255,.15);color:#fff}
nav button.active{background:rgba(255,255,255,.2);color:#fff;font-weight:600}
nav button.notif{background:#dc2626;color:#fff;font-weight:700;animation:pulse 1.5s infinite}
nav button.notif:hover{background:#b91c1c}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.7}}
.notif-badge{display:inline-block;background:#fbbf24;color:#1a202c;font-size:10px;font-weight:800;padding:1px 5px;border-radius:10px;margin-left:5px;vertical-align:middle}
.main{padding:20px;max-width:1200px;margin:0 auto}
.card{background:#fff;border-radius:10px;padding:20px;box-shadow:0 1px 4px rgba(0,0,0,.08);margin-bottom:16px}
.card h2{font-size:16px;font-weight:600;color:#1e3a8a;margin-bottom:16px;padding-bottom:10px;border-bottom:2px solid #e2e8f0}
label{display:block;font-size:12px;font-weight:600;color:#4a5568;margin-bottom:4px;margin-top:12px}
input,select,textarea{width:100%;padding:8px 10px;border:1.5px solid #e2e8f0;border-radius:6px;font-size:13px;color:#1a202c;background:#fff;transition:border .2s}
input:focus,select:focus,textarea:focus{outline:none;border-color:#1e3a8a}
input.err,select.err{border-color:#e53e3e}
.err-msg{color:#e53e3e;font-size:11px;margin-top:2px}
.row2{display:grid;grid-template-columns:1fr 1fr;gap:12px}
.row3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px}
.btn{padding:8px 18px;border:none;border-radius:6px;cursor:pointer;font-size:13px;font-weight:600;transition:all .2s}
.btn-primary{background:#1e3a8a;color:#fff}.btn-primary:hover{background:#1e40af}
.btn-secondary{background:#e2e8f0;color:#4a5568}.btn-secondary:hover{background:#cbd5e0}
.btn-danger{background:#dc2626;color:#fff}.btn-danger:hover{background:#b91c1c}
.btn-warn{background:#d97706;color:#fff}.btn-warn:hover{background:#b45309}
.btn-success{background:#16a34a;color:#fff}.btn-success:hover{background:#15803d}
.btn-sm{padding:4px 10px;font-size:12px}
.badge{display:inline-block;padding:2px 8px;border-radius:12px;font-size:11px;font-weight:600}
.badge-realise{background:#c6f6d5;color:#276749}
.badge-planifie{background:#bee3f8;color:#2a69ac}
.badge-annule{background:#fed7d7;color:#9b2c2c}
.badge-reporte{background:#fefcbf;color:#744210}
.badge-nonrealise{background:#e2e8f0;color:#4a5568}
table{width:100%;border-collapse:collapse;font-size:13px}
th{background:#f7fafc;padding:8px 10px;text-align:left;font-weight:600;color:#4a5568;border-bottom:2px solid #e2e8f0;white-space:nowrap;cursor:pointer;user-select:none}
th:hover{background:#edf2f7}
td{padding:8px 10px;border-bottom:1px solid #f0f4f8;vertical-align:middle}
tr:hover td{background:#f7fafc}
.filters{display:flex;gap:10px;flex-wrap:wrap;align-items:flex-end;margin-bottom:16px}
.filters .f-group{display:flex;flex-direction:column;min-width:140px}
.filters .f-group label{margin-top:0}
.kpi-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-bottom:20px}
.kpi{background:#fff;border-radius:10px;padding:16px 20px;box-shadow:0 1px 4px rgba(0,0,0,.08);text-align:center}
.kpi .val{font-size:32px;font-weight:700;color:#1e3a8a}
.kpi .lbl{font-size:12px;color:#718096;margin-top:4px}
#map-container{height:480px;border-radius:8px;overflow:hidden}
.toast{position:fixed;bottom:24px;right:24px;padding:12px 20px;border-radius:8px;font-weight:600;font-size:13px;z-index:9999;box-shadow:0 4px 12px rgba(0,0,0,.15);transition:opacity .3s}
.toast-ok{background:#276749;color:#fff}
.toast-err{background:#9b2c2c;color:#fff}
.spinner{display:inline-block;width:14px;height:14px;border:2px solid rgba(255,255,255,.4);border-top-color:#fff;border-radius:50%;animation:spin .6s linear infinite;vertical-align:middle;margin-right:6px}
@keyframes spin{to{transform:rotate(360deg)}}
@keyframes blink-retard{0%,100%{opacity:1}50%{opacity:.45}}
.loading-full{display:flex;flex-direction:column;align-items:center;justify-content:center;height:300px;color:#718096;gap:12px}
.loading-full .big-spin{width:40px;height:40px;border:4px solid #e2e8f0;border-top-color:#1e3a8a;border-radius:50%;animation:spin .8s linear infinite}
.mat-checks{display:flex;flex-wrap:wrap;gap:8px;margin-top:6px}
.mat-checks label{display:flex;align-items:center;gap:4px;font-size:12px;font-weight:400;color:#4a5568;margin-top:0;cursor:pointer}
.mat-checks input{width:auto}
.pagination{display:flex;align-items:center;gap:8px;margin-top:12px;justify-content:flex-end}
.pagination button{padding:4px 10px;border:1.5px solid #e2e8f0;border-radius:4px;background:#fff;cursor:pointer;font-size:12px}
.pagination button:disabled{opacity:.4;cursor:default}
.pagination span{font-size:12px;color:#718096}
.error-box{background:#fff5f5;border:1.5px solid #fc8181;border-radius:8px;padding:16px;color:#9b2c2c;display:flex;flex-direction:column;gap:10px;align-items:flex-start}
.admin-section{border:2px solid #fca5a5;border-radius:10px;padding:20px;margin-bottom:16px;background:#fff}
.admin-section h3{font-size:15px;font-weight:700;color:#dc2626;margin-bottom:12px;display:flex;align-items:center;gap:8px}
.confirm-box{background:#fff5f5;border:1.5px solid #fc8181;border-radius:8px;padding:14px;margin-top:12px}
.confirm-box p{font-size:13px;color:#9b2c2c;margin-bottom:10px}
.login-wrap{display:flex;align-items:center;justify-content:center;min-height:calc(100vh - 52px)}
.login-card{background:#fff;border-radius:12px;padding:36px 40px;box-shadow:0 4px 20px rgba(0,0,0,.1);width:340px;text-align:center}
.login-card h2{color:#1e3a8a;margin-bottom:24px;font-size:20px}
.login-card input{margin-top:8px;margin-bottom:16px}
.log-entry{padding:8px 12px;border-radius:6px;font-size:12px;margin-bottom:6px;display:flex;gap:10px}
.log-ok{background:#f0fff4;border-left:3px solid #276749}
.log-err{background:#fff5f5;border-left:3px solid #dc2626}
.log-info{background:#ebf8ff;border-left:3px solid #2a69ac}
.log-time{color:#a0aec0;white-space:nowrap}
.progress-bar{height:8px;background:#e2e8f0;border-radius:4px;overflow:hidden;margin-top:8px}
.progress-fill{height:100%;background:#1e3a8a;border-radius:4px;transition:width .3s}
.listes-overlay{position:fixed;inset:0;background:rgba(15,23,42,.55);z-index:800;display:flex;align-items:center;justify-content:center;padding:16px}
.listes-modal{background:#fff;border-radius:14px;width:760px;max-width:96vw;max-height:90vh;display:flex;flex-direction:column;box-shadow:0 20px 60px rgba(0,0,0,.25);overflow:hidden}
.listes-header{background:#1e3a8a;color:#fff;padding:18px 22px 14px;flex-shrink:0;position:relative}
.listes-header h2{font-size:17px;font-weight:700;margin-bottom:2px}
.listes-header p{font-size:12px;opacity:.75}
.listes-close{position:absolute;top:14px;right:16px;background:rgba(255,255,255,.2);border:none;color:#fff;width:28px;height:28px;border-radius:50%;cursor:pointer;font-size:16px;display:flex;align-items:center;justify-content:center;transition:background .2s}
.listes-close:hover{background:rgba(255,255,255,.35)}
.listes-tabs{display:flex;border-bottom:2px solid #e2e8f0;padding:0 22px;background:#f8fafc;flex-shrink:0;overflow-x:auto}
.listes-tab{padding:10px 14px;font-size:13px;font-weight:600;color:#718096;cursor:pointer;border-bottom:2px solid transparent;margin-bottom:-2px;white-space:nowrap;transition:all .15s}
.listes-tab:hover{color:#1e3a8a}
.listes-tab.active{color:#fff;background:#1e3a8a;border-bottom-color:#1e3a8a;border-radius:6px 6px 0 0}
.listes-tab .tab-count{display:inline-block;background:#e2e8f0;color:#4a5568;font-size:10px;font-weight:700;padding:1px 5px;border-radius:10px;margin-left:5px}
.listes-tab.active .tab-count{background:rgba(255,255,255,.25);color:#fff}
.listes-body{flex:1;overflow-y:auto;padding:16px 22px}
.listes-item{display:flex;align-items:center;gap:10px;padding:9px 12px;border-radius:8px;border:1px solid #e2e8f0;margin-bottom:7px;background:#fff;transition:box-shadow .15s}
.listes-item:hover{box-shadow:0 2px 8px rgba(0,0,0,.08)}
.listes-arrows{display:flex;flex-direction:column;gap:2px;flex-shrink:0}
.listes-arrows button{background:none;border:1px solid #e2e8f0;border-radius:3px;width:18px;height:14px;cursor:pointer;font-size:9px;color:#718096;display:flex;align-items:center;justify-content:center;padding:0;transition:all .1s;line-height:1}
.listes-arrows button:hover:not(:disabled){background:#f0f4f8;color:#1e3a8a}
.listes-arrows button:disabled{opacity:.3;cursor:default}
.listes-dot{width:10px;height:10px;border-radius:50%;flex-shrink:0}
.listes-name{flex:1;min-width:60px;font-size:13px;font-weight:500;color:#1a202c;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.listes-name input{border:1.5px solid #1e3a8a;border-radius:5px;padding:3px 7px;font-size:13px;width:100%;outline:none}
.listes-actions{display:flex;gap:5px;flex-shrink:0}
.listes-add-row{display:flex;gap:8px;margin-top:14px}
.listes-add-row input{flex:1;padding:8px 12px;border:1.5px solid #e2e8f0;border-radius:7px;font-size:13px;outline:none;transition:border .2s}
.listes-add-row input:focus{border-color:#1e3a8a}
.listes-footer{padding:14px 22px;border-top:1px solid #e2e8f0;display:flex;justify-content:flex-end;gap:10px;background:#f8fafc;flex-shrink:0}
.combo-wrap{position:relative}
.combo-dropdown{position:absolute;top:100%;left:0;right:0;background:#fff;border:1.5px solid #1e3a8a;border-top:none;border-radius:0 0 6px 6px;max-height:240px;overflow-y:auto;z-index:200;box-shadow:0 4px 12px rgba(0,0,0,.1)}
.combo-item{display:flex;align-items:center;gap:10px;padding:7px 12px;cursor:pointer;font-size:13px;transition:background .1s}
.combo-item:hover,.combo-item.active{background:#eff6ff}
/* Écran d'attente — repris de NEWGEN le 26/09/2026 (variables NextStep : --bg2, --text2). */
.attente-gas{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:18px;padding:44px 28px;text-align:center;background:var(--bg2,#fff);border-radius:14px;box-shadow:0 2px 4px rgba(12,36,48,.06),0 10px 28px rgba(12,36,48,.11);max-width:380px;margin:32px auto}
/* ── Bobine façon amorce SMPTE (compte à rebours cinéma vintage) ─────────── */
@property --sweep{syntax:'<angle>';initial-value:0deg;inherits:false}
.attente-reel{position:relative;width:92px;height:92px;border-radius:50%;flex:none;
  background:radial-gradient(circle at 42% 38%,#ddd7c7 0%,#c7c0ac 45%,#a89f89 78%,#8b8270 100%);
  box-shadow:0 6px 16px rgba(0,0,0,.3),inset 0 0 20px rgba(0,0,0,.35),inset 0 0 0 2px rgba(20,18,14,.45);
  display:flex;align-items:center;justify-content:center;overflow:hidden;
  animation:reel-flicker 3.6s steps(1) infinite}
.attente-reel-grain{position:absolute;inset:0;border-radius:50%;pointer-events:none;mix-blend-mode:multiply;opacity:.3;z-index:1;
  background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")}
.attente-reel-ring{position:absolute;inset:8px;border-radius:50%;border:1.5px solid rgba(20,18,14,.4);z-index:2}
.attente-reel-tickwrap{position:absolute;inset:0;z-index:2}
.attente-reel-tick{position:absolute;top:5px;left:50%;width:2px;height:8px;background:rgba(20,18,14,.55);transform:translateX(-1px);border-radius:1px}
.attente-reel-tick.maj{height:11px;background:rgba(20,18,14,.8)}
.attente-reel-cross{position:absolute;inset:0;z-index:2}
.attente-reel-cross::before,.attente-reel-cross::after{content:'';position:absolute;background:rgba(20,18,14,.55)}
.attente-reel-cross::before{left:6%;right:6%;top:50%;height:1.5px}
.attente-reel-cross::after{top:6%;bottom:6%;left:50%;width:1.5px}
.attente-reel-wedge{position:absolute;inset:0;border-radius:50%;z-index:3;
  background:conic-gradient(from 0deg,rgba(18,16,12,.85) 0deg,rgba(18,16,12,.85) var(--sweep),transparent var(--sweep),transparent 360deg);
  animation:reel-sweep 1s linear infinite}
.attente-reel-num{position:relative;z-index:4;font-size:30px;font-weight:800;color:#14120e;font-variant-numeric:tabular-nums;letter-spacing:-.5px}
@keyframes reel-sweep{from{--sweep:0deg}to{--sweep:360deg}}
@keyframes reel-flicker{0%,84%,100%{filter:brightness(1)}86%{filter:brightness(.9)}88%{filter:brightness(1.06)}90%{filter:brightness(.96)}92%{filter:brightness(1)}}
.attente-gas-titre{font-size:15px;font-weight:700;color:#1b4fd6}
.attente-gas-txt{font-size:13px;color:var(--text2,#4e6270);max-width:300px;line-height:1.5;animation:attente-fade .4s ease}
@keyframes attente-fade{from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:translateY(0)}}
.combo-cat-header{padding:6px 12px 2px;font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:.08em;color:#1e3a8a;pointer-events:none;user-select:none}
.combo-cp{font-size:11px;font-weight:700;color:#1e3a8a;min-width:42px;font-family:monospace}
.combo-nom{color:#1a202c}
.combo-empty{padding:10px 12px;color:#718096;font-size:12px;font-style:italic}
.combo-loading{padding:10px 12px;color:#1e3a8a;font-size:12px;display:flex;align-items:center;gap:8px}
.bingo-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:14px;margin-bottom:20px}
.bingo-card{background:#fff;border-radius:14px;box-shadow:0 3px 12px rgba(0,0,0,.1);padding:16px 12px;text-align:center;cursor:pointer;transition:all .25s;border:2px solid transparent}
.bingo-card:hover{box-shadow:0 8px 24px rgba(0,0,0,.16);transform:translateY(-3px)}
.bingo-card.selected{border-color:#1e3a8a}
.bingo-circle{width:64px;height:64px;border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0 auto 10px;font-size:24px;font-weight:800;border:3px solid}
.bingo-nom{font-size:11px;font-weight:700;color:#1a202c;margin-bottom:4px;line-height:1.2}
.bingo-pct{font-size:12px;font-weight:700}
.bingo-list{margin-top:16px}
.bingo-list-item{display:flex;align-items:center;gap:10px;padding:8px 12px;border-bottom:1px solid #f0f4f8;font-size:13px}
.bingo-list-item:last-child{border-bottom:none}
.bingo-dot{width:8px;height:8px;border-radius:50%;flex-shrink:0}
.bingo-list-date{color:#718096;font-size:12px;min-width:80px}
.bingo-list-theme{flex:1;color:#1a202c;font-weight:500}
.bingo-list-badge{padding:2px 8px;border-radius:10px;font-size:11px;font-weight:600}
@media print{
  /* ── Reset page ── */
  *{-webkit-print-color-adjust:exact!important;print-color-adjust:exact!important}
  @page{margin:12mm 10mm;size:A4 portrait}
  body{background:#fff!important;font-size:11px!important}

  /* ── Éléments cachés ── */
  nav,
  .topbar-sync-info,
  .btn:not(.btn-print-keep),
  .btn-print,
  .chip-bar,
  .filters,
  .filter-bar,
  .side-panel,
  .side-panel-overlay,
  .conseiller-picker,
  .offline-badge,
  .period-selector,
  [class*="period"],
  .kpi-row .chip,
  input[type="text"],
  input[type="search"],
  select,
  .view-anim>div:not(:first-child),
  .no-print
  {display:none!important}

  /* ── Layout ── */
  .main{padding:0!important;margin:0!important}
  .card{box-shadow:none!important;border:1px solid #e2e8f0!important;break-inside:avoid;margin-bottom:8px!important;padding:10px!important}
  
  /* ── KPI tuiles ── */
  .kpi-grid{grid-template-columns:repeat(4,1fr)!important;gap:6px!important}
  .kpi{padding:8px 10px!important;font-size:10px!important}
  .kpi .val{font-size:20px!important}
  .kpi-row{flex-wrap:nowrap!important;gap:4px!important}
  .kpi-mini{padding:6px 8px!important}
  .kpi-mini .v{font-size:16px!important}

  /* ── Graphiques ECharts ── */
  canvas{max-width:100%!important}

  /* ── Historique ── */
  .atelier-card{box-shadow:none!important;border:1px solid #e2e8f0!important;margin-bottom:4px!important;break-inside:avoid}
  .atelier-card-arrow{display:none!important}

  /* ── Calendrier ── */
  .cal-grid{break-inside:avoid}
  .cal-cell{border:1px solid #e2e8f0!important}

  /* ── Agenda ── */
  table{break-inside:avoid}
  thead{display:table-header-group}

  /* ── Roadmap / Gantt ── */
  .gantt-bar{-webkit-print-color-adjust:exact!important}

  /* ── Frise du parc (Gestion ordi) ── */
  /* Le repli sur minmax(colWidth,1fr) sert à l'écran (colonne jamais trop
     étroite pour rester cliquable) mais empêche la grille de rétrécir pour
     tenir sur une page — on la remplace par des 1fr sans plancher.
     28 = FRISE_NB_JOURS (constante ci-dessous), à garder synchronisé si
     elle change. */
  .frise-grid-wrap{min-width:0!important;width:100%!important;overflow:visible!important}
  .frise-grid-row{grid-template-columns:140px repeat(28,1fr)!important}

  /* ── Bingo ── */
  .bingo-grid{grid-template-columns:repeat(4,1fr)!important;gap:6px!important}
  .bingo-card{padding:8px!important;break-inside:avoid}
  .bingo-circle{width:44px!important;height:44px!important;font-size:16px!important}

  /* ── Admin ── */
  .admin-section{border:1px solid #fca5a5!important;break-inside:avoid;page-break-inside:avoid}

  /* ── En-tête d'impression ── */
  body::before{
    content:'Ateliers Inclusion Numérique — Lot-et-Garonne — Imprimé le 'attr(data-print-date);
    display:block;font-size:10px;color:#9ca3af;text-align:right;
    margin-bottom:8px;padding-bottom:6px;border-bottom:1px solid #e2e8f0
  }

  /* ── Sauts de page ── */
  .card.page-break{page-break-before:always}
  h1,h2,h3{page-break-after:avoid}
}
/* ══════════════════════════════════════════════════════════
   DESKTOP — breakpoints ≥ 768px et ≥ 1024px
   ══════════════════════════════════════════════════════════ */
@media(min-width:768px){
  /* Layout principal plus large */
  .main{padding:28px 32px;max-width:1400px}

  /* KPI : 4 colonnes bien espacées */
  .kpi-grid{grid-template-columns:repeat(4,1fr);gap:18px}
  .kpi{padding:18px 20px}
  .kpi .val{font-size:32px}

  /* kpi-row historique : toutes les tuiles sur une ligne */
  .kpi-row{flex-wrap:nowrap;gap:12px}
  .kpi-mini{padding:12px 14px}
  .kpi-mini .v{font-size:24px}

  /* Cards : ombres plus profondes sur grand écran */
  .card{box-shadow:0 2px 12px rgba(0,0,0,.08)}

  /* Historique : panel latéral plus large */
  .side-panel{width:420px}

  /* Atelier-cards : layout 2 colonnes sur tablette */
  .atelier-list{display:grid;grid-template-columns:1fr 1fr;gap:10px}
  .atelier-card{margin-bottom:0}

  /* Bingo : plus de colonnes */
  .bingo-grid{grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:16px}
  .bingo-card{padding:20px 16px}
  .bingo-circle{width:72px;height:72px;font-size:26px}

  /* Calendrier : cellules plus grandes */
  .cal-cell{min-height:90px}

  /* Formulaire saisie : 2 colonnes */
  .sf-grid2{grid-template-columns:1fr 1fr;gap:16px}
  .sf-grid3{grid-template-columns:1fr 1fr 1fr;gap:16px}
  .sf-grid-date{grid-template-columns:1fr 1fr 100px;gap:16px}

  /* Nav : plus d'espace entre les éléments */
  nav{padding:0 32px;height:56px}
  nav .nav-title{font-size:17px}
}

@media(min-width:1024px){
  .main{padding:32px 40px;max-width:1600px}

  /* Historique : 3 colonnes */
  .atelier-list{grid-template-columns:1fr 1fr 1fr}

  /* Dashboard : graphiques côte à côte en 2×2 */
  .dashboard-charts{display:grid;grid-template-columns:1fr 1fr;gap:20px}

  /* Bingo : 5 colonnes min */
  .bingo-grid{grid-template-columns:repeat(auto-fill,minmax(180px,1fr))}

  /* Roadmap : gantt plus lisible */
  .gantt-table{font-size:13px}

  /* Admin sections en 2 colonnes */
  .admin-grid{display:grid;grid-template-columns:1fr 1fr;gap:20px}
  .admin-section{margin-bottom:0}
}

@media(min-width:1400px){
  .main{max-width:1800px}
  .kpi-grid{grid-template-columns:repeat(6,1fr)}
  .bingo-grid{grid-template-columns:repeat(auto-fill,minmax(160px,1fr))}
}
.btn-print{background:#f8fafc;color:#4a5568;border:1.5px solid #e2e8f0}.btn-print:hover{background:#e2e8f0}
.badge-retard{background:#fecaca;color:#991b1b;border:1px solid #f87171;animation:blink-retard 1.4s ease-in-out infinite}
.atelier-card{background:#fff;border-radius:12px;box-shadow:0 1px 4px rgba(0,0,0,.08);margin-bottom:10px;display:flex;overflow:hidden;transition:box-shadow .2s;cursor:pointer}
.atelier-card:hover{box-shadow:0 4px 16px rgba(0,0,0,.12)}
.atelier-card-border{width:5px;flex-shrink:0}
.atelier-card-date{width:64px;flex-shrink:0;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:14px 8px;background:#f8fafc;border-right:1px solid #e2e8f0}
.atelier-card-day{font-size:26px;font-weight:800;color:#1a202c;line-height:1}
.atelier-card-month{font-size:11px;font-weight:700;color:#718096;text-transform:uppercase;letter-spacing:.05em}
.atelier-card-time{font-size:12px;color:#4a5568;margin-top:4px;font-weight:600}
.atelier-card-jour{font-size:10px;font-weight:700;color:#718096;text-transform:uppercase;letter-spacing:.05em;margin-top:2px}
.atelier-card-body{flex:1;padding:12px 14px;min-width:0}
.atelier-card-badges{display:flex;flex-wrap:wrap;gap:5px;margin-bottom:6px;align-items:center}
.atelier-card-conseiller{font-size:12px;font-weight:700;margin-bottom:3px}
.atelier-card-title{font-size:14px;font-weight:700;color:#1a202c;line-height:1.3;margin-bottom:4px}
.atelier-card-sub{font-size:12px;color:#718096}
.atelier-card-arrow{display:flex;align-items:center;padding:0 10px;color:#cbd5e0;font-size:18px}
.badge-pill{display:inline-block;padding:2px 9px;border-radius:20px;font-size:11px;font-weight:600}
.bp-planifie{background:#dbeafe;color:#1d4ed8}
.bp-realise{background:#dcfce7;color:#166534}
.bp-annule{background:#fee2e2;color:#991b1b}
.bp-reporte{background:#fef3c7;color:#92400e}
.bp-nonrealise{background:#fee2e2;color:#991b1b}
.bp-retard{background:#fecaca;color:#991b1b;border:1px solid #f87171;animation:blink-retard 1.4s ease-in-out infinite}
.bp-public{background:#f1f5f9;color:#475569}
.side-panel{position:fixed;top:0;right:0;width:340px;max-width:95vw;height:auto;max-height:92vh;background:#fff;box-shadow:-4px 0 24px rgba(0,0,0,.15);z-index:500;display:flex;flex-direction:column;transform:translateX(100%);transition:transform .25s ease;border-radius:0 0 0 16px}
.side-panel.open{transform:translateX(0)}
.side-panel-header{padding:16px 20px;border-bottom:1px solid #e2e8f0;display:flex;align-items:center;justify-content:space-between;background:#f8fafc}
.side-panel-header h3{font-size:14px;font-weight:700;color:#1a202c;margin:0}
.side-panel-body{overflow-y:auto;padding:16px 20px}
.side-panel-footer{padding:12px 20px;border-top:1px solid #e2e8f0;display:flex;gap:6px;flex-wrap:wrap}
.side-panel-overlay{position:fixed;inset:0;background:rgba(0,0,0,.3);z-index:499}
.sp-info-row{display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid #f0f4f8;font-size:13px}
.sp-info-row span:first-child{color:#718096}
.sp-info-row span:last-child{font-weight:600;color:#1a202c;text-align:right;max-width:60%}
.mat-chip{display:inline-block;padding:2px 8px;border-radius:12px;font-size:11px;background:#e2e8f0;color:#4a5568;margin:2px}
.chip-bar{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:12px}
.chip{display:inline-flex;align-items:center;gap:5px;padding:4px 12px;border-radius:20px;font-size:12px;font-weight:600;border:1.5px solid transparent;cursor:pointer;background:#f0f4f8;color:#4a5568;transition:all .15s}
.chip.active{border-color:currentColor}
.chip-all.active{background:#1e3a8a22;color:#1e3a8a}
.chip-planifie.active{background:#dbeafe;color:#1d4ed8}
.chip-realise.active{background:#dcfce7;color:#166534}
.chip-annule.active{background:#fee2e2;color:#991b1b}
.chip-reporte.active{background:#fef3c7;color:#92400e}
.chip-nonrealise.active{background:#f1f5f9;color:#475569}
.chip-dot{width:7px;height:7px;border-radius:50%;background:currentColor;flex-shrink:0}
.kpi-row{display:flex;gap:8px;margin-bottom:12px;flex-wrap:wrap}
.kpi-histo{display:grid!important;grid-template-columns:repeat(6,1fr);gap:8px}
@media(max-width:600px){.kpi-histo{grid-template-columns:repeat(3,1fr);gap:6px!important}}
@keyframes kpiSlideUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
.kpi-mini{flex:1;min-width:60px;background:#fff;border-radius:8px;padding:10px 8px;text-align:center;box-shadow:0 1px 3px rgba(0,0,0,.08);animation:kpiSlideUp .38s cubic-bezier(.22,.68,0,1.2) both}
.kpi-mini .v{font-size:22px;font-weight:800;line-height:1}
.kpi-mini .l{font-size:10px;color:#718096;margin-top:2px}
.kpi-mini .p{font-size:10px;font-weight:600;margin-top:1px}
.sp-field{margin-bottom:14px}
.sp-field label{font-size:11px;font-weight:700;color:#718096;display:block;margin-bottom:4px;text-transform:uppercase;letter-spacing:.05em}
.toggle-row{display:flex;align-items:center;justify-content:space-between;padding:11px 0;border-bottom:1px solid #f0f4f8}
.toggle-row:last-child{border-bottom:none}
.toggle-label{font-size:13px;font-weight:600;color:#1a202c}
.toggle-sub{font-size:11px;color:#718096;margin-top:2px}
.tgl{position:relative;display:inline-block;width:44px;height:24px;flex-shrink:0}
.tgl input{opacity:0;width:0;height:0;position:absolute}
.tgl-track{position:absolute;inset:0;background:#cbd5e0;border-radius:24px;cursor:pointer;transition:background .2s}
.tgl-track:before{content:"";position:absolute;top:3px;left:3px;width:18px;height:18px;background:#fff;border-radius:50%;transition:transform .2s;box-shadow:0 1px 3px rgba(0,0,0,.2)}
.tgl input:checked+.tgl-track{background:#1e3a8a}
.tgl input:checked+.tgl-track:before{transform:translateX(20px)}
.accueil-wrap{display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:60vh}
.accueil-card{background:#fff;border-radius:16px;box-shadow:0 4px 24px rgba(30,58,138,.12);padding:40px 44px;width:100%;max-width:420px;text-align:center}
.accueil-logo{font-size:48px;margin-bottom:12px}
.accueil-title{font-size:22px;font-weight:800;color:#1e3a8a;margin-bottom:4px}
.accueil-sub{font-size:13px;color:#718096;margin-bottom:28px}
.accueil-label{font-size:12px;font-weight:700;color:#4a5568;text-align:left;margin-bottom:6px;display:block}
.accueil-select{width:100%;padding:10px 14px;border:2px solid #e2e8f0;border-radius:8px;font-size:14px;color:#1a202c;background:#f8fafc;margin-bottom:20px;cursor:pointer;transition:border .2s}
.accueil-select:focus{outline:none;border-color:#1e3a8a;background:#fff}
.accueil-btn{width:100%;padding:12px;background:#1e3a8a;color:#fff;border:none;border-radius:8px;font-size:15px;font-weight:700;cursor:pointer;transition:background .2s}
.accueil-btn:hover{background:#1e40af}
.accueil-btn:disabled{background:#93afd4;cursor:not-allowed}
.accueil-skip{margin-top:14px;font-size:12px;color:#a0aec0;cursor:pointer;text-decoration:underline;background:none;border:none}
.accueil-skip:hover{color:#4a5568}
.filtre-banner{background:#eff6ff;border:1.5px solid #bfdbfe;border-radius:8px;padding:9px 14px;display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;font-size:13px;color:#1e3a8a;font-weight:600}
.filtre-banner button{background:#1e3a8a;color:#fff;border:none;border-radius:6px;padding:4px 12px;font-size:12px;font-weight:600;cursor:pointer}
.filtre-banner button:hover{background:#1e40af}
/* ── v9.0 : Flux de clôture rapide ── */
.cloture-banner{background:#fffbeb;border:1.5px solid #fcd34d;border-radius:10px;padding:14px;margin-bottom:16px}
.cloture-title{font-size:12px;font-weight:700;color:#92400e;margin-bottom:10px;display:flex;align-items:center;gap:6px;text-transform:uppercase;letter-spacing:.04em}
.cloture-btns{display:flex;gap:7px}
.cloture-btn{flex:1;padding:9px 6px;border:none;border-radius:8px;cursor:pointer;font-size:12px;font-weight:700;transition:filter .15s}
.cloture-btn:hover{filter:brightness(.9)}
/* ── v9.0 : Badge duplication ── */
.dup-badge{background:#eff6ff;border:1.5px solid #bfdbfe;color:#1d4ed8;font-size:12px;font-weight:600;padding:4px 10px;border-radius:6px;display:inline-flex;align-items:center;gap:5px;margin-bottom:12px}
/* ── v9.1 : Saisie en lot ── */
.mode-toggle{display:flex;gap:0;border:1.5px solid #e2e8f0;border-radius:8px;overflow:hidden;margin-bottom:16px;width:fit-content}
.mode-toggle button{padding:7px 18px;background:#fff;border:none;cursor:pointer;font-size:13px;font-weight:600;color:#718096;transition:all .15s}
.mode-toggle button.active{background:#1e3a8a;color:#fff}
.lot-row{display:grid;grid-template-columns:140px 100px 64px 1fr 32px;gap:8px;align-items:end;padding:10px 12px;border-radius:8px;border:1px solid #e2e8f0;margin-bottom:6px;background:#f8fafc}
.lot-row:hover{background:#eff6ff;border-color:#bfdbfe}
.lot-row-err{border-color:#fc8181 !important;background:#fff5f5 !important}
.lot-add-btn{display:flex;align-items:center;justify-content:center;gap:6px;padding:9px;background:#f8fafc;border:1.5px dashed #93c5fd;border-radius:8px;cursor:pointer;font-size:13px;color:#1d4ed8;font-weight:600;width:100%;transition:all .15s;margin-top:4px;box-sizing:border-box}
.lot-add-btn:hover{background:#eff6ff;border-color:#3b82f6}
.lot-summary{background:#eff6ff;border:1.5px solid #bfdbfe;border-radius:8px;padding:10px 14px;font-size:13px;color:#1d4ed8;font-weight:600;margin-bottom:12px;display:flex;align-items:center;gap:8px}
.lot-del-btn{background:none;border:1px solid #e2e8f0;border-radius:6px;color:#9b2c2c;cursor:pointer;font-size:15px;height:32px;width:32px;display:flex;align-items:center;justify-content:center;transition:all .15s;flex-shrink:0}
.lot-del-btn:hover{background:#fee2e2;border-color:#fc8181}
/* ── v9.1 : Saisie formulaire redesign ── */
.sf-wrap{padding:4px 0}
.sf-section{background:#fff;border-radius:14px;padding:18px 20px;margin-bottom:12px;box-shadow:0 1px 4px rgba(0,0,0,.07)}
.sf-section-accent{border-top:3px solid var(--ac)}
.sf-label{font-size:11px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:var(--ac);margin-bottom:8px;display:block}
.sf-label-gray{font-size:11px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#94a3b8;margin-bottom:8px;display:block}
.sf-input{width:100%;padding:11px 14px;border:2px solid #e2e8f0;border-radius:10px;font-size:14px;color:#1a202c;background:#f8fafc;transition:all .2s;outline:none}
.sf-input:focus{border-color:var(--ac);background:#fff;box-shadow:0 0 0 3px var(--ac-light)}
.sf-input.err{border-color:#e53e3e;background:#fff5f5}
.sf-textarea{width:100%;padding:11px 14px;border:2px solid #e2e8f0;border-radius:10px;font-size:14px;color:#1a202c;background:#f8fafc;transition:all .2s;outline:none;resize:vertical;min-height:80px}
.sf-textarea:focus{border-color:var(--ac);background:#fff;box-shadow:0 0 0 3px var(--ac-light)}
.sf-select{width:100%;padding:11px 14px;border:2px solid #e2e8f0;border-radius:10px;font-size:14px;color:#1a202c;background:#f8fafc;transition:all .2s;outline:none;cursor:pointer;appearance:auto}
.sf-select:focus{border-color:var(--ac);background:#fff;box-shadow:0 0 0 3px var(--ac-light)}
.sf-select.err{border-color:#e53e3e}
.sf-pills{display:flex;flex-wrap:wrap;gap:8px}
.sf-pill{padding:8px 16px;border-radius:20px;border:2px solid #e2e8f0;background:#fff;font-size:13px;font-weight:600;color:#718096;cursor:pointer;transition:all .18s;display:flex;align-items:center;gap:6px}
.sf-pill:hover{border-color:var(--ac);color:var(--ac);background:var(--ac-light)}
.sf-pill.active{border-color:var(--ac);background:var(--ac);color:#fff}
.sf-pill-dot{width:7px;height:7px;border-radius:50%;background:currentColor;opacity:.7}
.sf-grid2{display:grid;grid-template-columns:1fr 1fr;gap:12px}
.sf-grid3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px}
.sf-grid-date{display:grid;grid-template-columns:1fr 1fr 80px;gap:12px}
.sf-num{width:100%;padding:11px 14px;border:2px solid #e2e8f0;border-radius:10px;font-size:18px;font-weight:700;color:#1a202c;background:#f8fafc;text-align:center;transition:all .2s;outline:none}
.sf-num:focus{border-color:var(--ac);background:#fff;box-shadow:0 0 0 3px var(--ac-light)}
.sf-mat-checks{display:flex;flex-wrap:wrap;gap:10px}
.sf-mat-chip{display:flex;align-items:center;gap:6px;padding:7px 12px;border:2px solid #e2e8f0;border-radius:20px;cursor:pointer;font-size:12px;font-weight:600;color:#718096;background:#fff;transition:all .15s;user-select:none}
.sf-mat-chip.checked{border-color:var(--ac);background:var(--ac-light);color:var(--ac)}
.sf-mat-chip input{display:none}
.sf-err{color:#e53e3e;font-size:11px;font-weight:600;margin-top:4px;display:block}
.sf-title{font-size:18px;font-weight:800;color:#1a202c;margin-bottom:2px}
.sf-subtitle{font-size:12px;color:#94a3b8;margin-bottom:16px}
.sf-btn-primary{padding:13px 28px;border:none;border-radius:12px;cursor:pointer;font-size:14px;font-weight:700;color:#fff;background:var(--ac);transition:filter .2s;display:flex;align-items:center;gap:8px}
.sf-btn-primary:hover:not(:disabled){filter:brightness(1.1)}
.sf-btn-primary:disabled{opacity:.6;cursor:not-allowed}
.sf-btn-secondary{padding:13px 24px;border:2px solid #e2e8f0;border-radius:12px;cursor:pointer;font-size:14px;font-weight:600;color:#718096;background:#fff;transition:all .2s}
.sf-btn-secondary:hover{border-color:#94a3b8;color:#1a202c}
.sf-conseiller-badge{display:inline-flex;align-items:center;gap:8px;padding:6px 14px;border-radius:20px;font-size:12px;font-weight:700;color:#fff;background:var(--ac);margin-bottom:14px}
/* ── v9.2 : Calendrier ── */
.cal-grid{display:grid;grid-template-columns:repeat(5,1fr);gap:3px;margin-bottom:3px}
.cal-header-cell{text-align:center;font-size:11px;font-weight:700;color:#718096;padding:6px 2px;text-transform:uppercase;letter-spacing:.06em;background:#f8fafc;border-radius:4px}
.cal-cell{min-height:88px;padding:5px;border-radius:6px;border:1px solid #e2e8f0;background:#fff;transition:background .12s;vertical-align:top;overflow:hidden}
.cal-cell:hover{background:#f8fafc}
.cal-cell-empty{background:#f8fafc;border-color:#f0f4f8;cursor:default}
.cal-today{background:#eff6ff;border-color:#93c5fd}
.cal-today:hover{background:#dbeafe}
.cal-day-num{font-size:12px;font-weight:600;color:#4a5568;margin-bottom:3px;line-height:1.4}
.cal-today-num{display:inline-flex;align-items:center;justify-content:center;width:20px;height:20px;background:#1e3a8a;color:#fff;border-radius:50%;font-size:11px;font-weight:700}
.cal-event{display:flex;align-items:center;gap:3px;padding:2px 5px;border-radius:3px;font-size:9.5px;cursor:pointer;margin-bottom:2px;transition:filter .1s;overflow:hidden;max-width:100%;line-height:1.3}
.cal-event:hover{filter:brightness(.9)}
.cal-event-time{font-weight:700;flex-shrink:0;font-size:9px}
.cal-event-label{display:flex;flex-direction:column;min-width:0;flex:1;color:#1a202c}
.cal-event-label>span{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.cal-event-orienteur{opacity:.7;font-style:italic;font-size:9px}
.cal-more{font-size:9.5px;color:#6b7280;cursor:pointer;margin-top:2px;font-weight:600;padding:1px 4px;background:#f1f5f9;border-radius:3px;display:inline-block}
.cal-more:hover{color:#1e3a8a;background:#dbeafe}
.cal-year-sel{padding:4px 8px;border:1.5px solid rgba(255,255,255,.35);border-radius:6px;background:rgba(255,255,255,.12);color:#fff;font-size:12px;font-weight:700;cursor:pointer;outline:none}
.cal-year-sel option{background:#1e3a8a;color:#fff}
@keyframes fadeInUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
@keyframes fadeSlideIn{from{opacity:0;transform:translateY(7px)}to{opacity:1;transform:translateY(0)}}
/* fill-mode backwards, pas both : avec both, le transform:translateY(0) final
   restait actif et faisait de .view-anim la référence de tout position:fixed
   à l'intérieur — le panneau latéral de l'Historique défilait avec la page
   au lieu de rester à l'écran (signalé le 24/09/2026). Rien ne reste après
   l'animation, l'état final étant celui par défaut. */
.view-anim{animation:fadeSlideIn .22s ease backwards}
`;
  document.head.appendChild(s);
})();

// ── Globals ────────────────────────────────────────────────

// ── Impression : injecter la date courante ─────────────────
window.addEventListener('beforeprint',()=>{
  document.body.setAttribute('data-print-date',new Date().toLocaleDateString('fr-FR',{day:'2-digit',month:'long',year:'numeric'}));
});
window.addEventListener('afterprint',()=>{
  document.body.removeAttribute('data-print-date');
});

if(!window.React||!window.ReactDOM){throw new Error('React/ReactDOM non chargé — vérifiez les CDN dans le HTML');}
const CE = React.createElement;
function FadeItem({children,delay=0,style={}}){
  const[v,setV]=React.useState(false);
  React.useEffect(()=>{const t=setTimeout(()=>setV(true),delay*1000+20);return()=>clearTimeout(t);},[]);
  return CE('div',{style:{opacity:v?1:0,transition:'opacity .6s ease',...style}},children);
}

// ── Serveur : API Alwaysdata depuis la bascule du 25/09/2026 ───────────────
// (refonte GAS → PHP + MySQL, AG-009 / AG-011, dépôt ATELIERS_NEWGEN, dossier
// api/). Plus aucun appel au GAS : tout passe par requeteServeur (POST vers
// l'API, jeton dans le corps) ; une réponse {auth:true} déclenche
// « ateliers:auth-expiree ».
const API_PHP_URL = 'https://ateliers-numeriques.alwaysdata.net/api/index.php';
// Un onglet resté sur ?backend=gas l'avait mémorisé : on l'efface.
try{ sessionStorage.removeItem('ateliers_backend'); }catch(_){}
// Adresse et corps d'un appel : POST vers l'API (action dans l'URL pour lire
// les journaux, le reste dans le corps).
// Lien « mot de passe oublié » : la page s'ouvre en mode API par défaut.
window.RETOUR_REINIT_SUFFIXE = '';
window.requeteServeur = function(params){
  const token = window.authToken && window.authToken.get();
  if(token && !params.has('token')) params.set('token', token);
  return {url:`${API_PHP_URL}?action=${encodeURIComponent(params.get('action')||'')}`, corps:params.toString()};
};
// ── Politique d'appel GAS ──────────────────────────────────────────────────
// MESURÉ le 18/09/2026 (journal Admin, PC et Android, 221 ateliers) : la
// livraison Apps Script est BIMODALE, pas lente. Livrée, une réponse arrive en
// 1 à 3 s (getAll 1.1 s, getComptes 1.8 s, checkPassword 2.7 s). Perdue, elle
// part en HTTP 404 ou en blocage au bout de 26 à 35 s — or un 404 authentique
// revient en ~200 ms, et l'exécution doGet correspondante dure moins de 2 s
// côté serveur. Un 404 à 27 s veut dire que la réponse N'EXISTE PLUS : elle
// s'est perdue sur la redirection /exec → googleusercontent.
//
// D'où toute la politique ci-dessous, et son interdit central :
// NE JAMAIS RALLONGER CES PLAFONDS. Attendre ne récupère aucune réponse
// perdue, ça ne fait qu'allonger l'écran d'attente — à 35 s, une connexion a
// été relevée à 84 s, dont 51 d'attente pure sur des appels déjà morts.
// Les valeurs et les comportements sont verrouillés par e2e/reseau.spec.js : si
// un de ses cas échoue, c'est qu'on est en train de refaire l'erreur.
//
// Lectures  : coupées tôt, plusieurs tentatives, et appel DOUBLÉ passé un
//             délai plutôt que d'attendre un échec (une exécution GAS de plus
//             coûte 1 à 3 s, pas 30).
// Écritures : mêmes plafonds courts, mais SÉQUENTIELLES et jamais doublées.
//             Rejouer est sûr (actionSaveEntry retrouve sa ligne par _id,
//             toujours généré côté client — vérifié en production), mais deux
//             appels EN PARALLÈLE pourraient tous deux conclure « ligne
//             absente » et faire chacun leur appendRow.
const GAS_RETRYABLE_HTTP = [404, 408, 429, 500, 502, 503, 504];
const GAS_TIMEOUT_LECTURE_MS  = 12000;
// Écriture simple : même plafond qu'une lecture. Le 20 s d'origine était
// calibré sur le cas le plus lourd (saveMany), alors qu'un saveEntry répond
// en 2 à 4 s quand la livraison passe (18/09/2026 : 2.8 s et 3.5 s en
// production). Résultat, une écriture perdue coûtait 20 s d'attente avant
// même la première reprise. Rejouer est sans danger : actionSaveEntry
// retrouve sa ligne par _id et la remplace.
const GAS_TIMEOUT_ECRITURE_MS = 12000;
// saveMany écrit N ateliers d'affilée, chacun avec sa lecture de feuille :
// légitimement long, et le couper trop tôt ferait repartir tout le lot.
const GAS_TIMEOUT_ECRITURE_LOT_MS = 25000;
const GAS_ACTIONS_LOT = new Set(['saveMany']);
// Actions qui MODIFIENT l'état côté GAS. C'est la couche réseau qui décide,
// à partir du nom de l'action, et non l'appelant via une option : une
// écriture n'est jamais doublée (deux appels en parallèle pourraient tous
// deux conclure « ligne absente » et faire chacun leur appendRow), et faire
// dépendre cette garantie d'un `{ecriture:true}` que l'appelant doit penser
// à passer, c'est la faire reposer sur la vigilance. Un futur
// `gasAppel(url,'saveEntry')` écrit sans l'option aurait été doublé, donc
// susceptible de créer un atelier en double.
// Repris d'ateliers-cd47_NextStep (GAS_ACTIONS_ECRITURE), qui avait placé la
// décision au bon endroit dès le départ.
// À ne pas confondre avec WRITE_ACTIONS plus bas, qui répond à une autre
// question — « faut-il joindre un token ? » : getLogs exige un token sans
// rien modifier, logLogin écrit une ligne sans exiger de token.
const GAS_ACTIONS_ECRITURE = new Set([
  'saveEntry','saveMany','delete',
  'saveLists','saveConfig','setConfig','saveVisibility','saveColors',
  'saveEmails','saveCompte','resetPassword','setPassword','selfSetPassword',
  // Écrivent une ligne dans Logs_Connexion : doubler fabriquerait de fausses
  // connexions dans le journal.
  'logLogin','logAccesIndex',
  // Mot de passe oublié (AG-013) : doubler enverrait deux mails et
  // consommerait deux fois le quota de 3 demandes par heure.
  'demanderReinit','reinitMotDePasse',
  // Corbeille et copie à la demande (AG-014) : écritures, jamais doublées.
  'restaurerCorbeille','copieMaintenant'
]);
const GAS_HEDGE_MS            = 7000;   // délai avant de doubler une lecture
const GAS_TENTATIVES_LECTURE  = 3;
const GAS_TENTATIVES_ECRITURE = 2;
const GAS_PAUSE_LECTURE_MS    = 300;    // inutile d'attendre : ce n'est pas une file d'attente
const GAS_PAUSE_ECRITURE_MS   = 1000;   // laisse retomber une écriture encore en vol
const GAS_BUDGET_TOTAL_MS     = 45000;  // au-delà, on rend la main (bouton Réessayer)

// Plafond d'un appel selon son régime : lecture, écriture, ou lot d'écritures.
function gasPlafond(action, ecriture){
  if(!ecriture) return GAS_TIMEOUT_LECTURE_MS;
  return GAS_ACTIONS_LOT.has(action) ? GAS_TIMEOUT_ECRITURE_LOT_MS : GAS_TIMEOUT_ECRITURE_MS;
}

// Journal consultable : window.__gasLog, et console pour le suivi en direct.
window.__gasLog = [];

window.logGas = function(action, attempt, ms, issue){
  const e = {t:new Date().toLocaleTimeString('fr-FR'), action, attempt, ms:Math.round(ms), issue:issue||'ok'};
  window.__gasLog.push(e);
  if(window.__gasLog.length > 200) window.__gasLog.shift();
  const txt = `[GAS] ${action} #${attempt} — ${e.issue} en ${(ms/1000).toFixed(1)} s`;
  if(issue) console.warn(txt); else console.info(txt);
  if(window.gasLogHook){ try{ window.gasLogHook(e); }catch(_){} }
};

// Un seul appel réseau, journalisé. reessayable=true seulement pour un échec
// de transport (jamais atteint Google) ou un refus immédiat (429/503).
// ctrl : AbortController fourni par l'appelant quand il veut pouvoir annuler
// l'appel lui-même (cas du doublage : dès que l'un des deux répond, l'autre
// n'a plus lieu d'être). Marquer ctrl.inutile avant d'annuler évite de
// journaliser en rouge un appel qu'on a sciemment arrêté.
// corps : chaîne form-urlencoded → POST (mode API) ; absent → GET (GAS).
window.gasUnAppel = async function(url, action, numero, timeoutMs, ctrlFourni, corps){
  const plafond = timeoutMs || GAS_TIMEOUT_LECTURE_MS;
  const t0 = Date.now();
  const ctrl = ctrlFourni || new AbortController();
  const chien = setTimeout(()=>ctrl.abort(), plafond);
  let res;
  try{
    res = await fetch(url, corps
      ? {method:'POST', body:corps, headers:{'Content-Type':'application/x-www-form-urlencoded'}, signal:ctrl.signal}
      : {signal:ctrl.signal});
  }catch(err){
    if(ctrl.inutile){
      // Le jumeau a répondu : ce n'est PAS un échec. Journalisé quand même
      // depuis le 22/09/2026 (AG-006), sous un motif distinct que
      // resumeLogsTexte exclut des pertes et admin_app affiche en neutre.
      // Pourquoi : sans cette ligne, un doublon annulé est invisible, et le
      // taux de sauvetage de la production se calcule sur ok/(ok+ko) alors que
      // celui du banc se calcule sur ok/(ok+ko+annulés) — deux définitions
      // comparées l'une à l'autre pendant une journée entière. Le motif reste
      // distinct de 'ok' pour ne pas gonfler les réussites : l'appel n'a rien
      // rapporté, c'est son jumeau qui a servi.
      logGas(action, numero, Date.now()-t0, 'annulé — le jumeau a répondu');
      throw Object.assign(new Error('doublon inutile'), {reessayable:false, inutile:true});
    }
    if(ctrl.signal.aborted){
      logGas(action, numero, Date.now()-t0, `bloqué — abandonné après ${plafond/1000}s`);
      throw Object.assign(new Error('timeout'), {reessayable:true});
    }
    logGas(action, numero, Date.now()-t0, 'réseau : '+err.message);
    throw Object.assign(new Error(err.message), {reessayable:true});
  }finally{
    clearTimeout(chien);
  }
  if(!res.ok){
    logGas(action, numero, Date.now()-t0, 'HTTP '+res.status);
    throw Object.assign(new Error(`HTTP ${res.status}`), {
      httpStatus:res.status,
      reessayable:GAS_RETRYABLE_HTTP.indexOf(res.status) > -1
    });
  }
  const text = await res.text();
  let data;
  try{ data = JSON.parse(text); }
  catch(_){
    logGas(action, numero, Date.now()-t0, 'réponse non-JSON');
    throw new Error('Réponse invalide du serveur.');
  }
  // Refus explicite du serveur (ok:false) : journalise avec son motif. Sans
  // cela un waitLock epuise sur saveMany apparaissait comme une reussite
  // (AG-004, 22/09/2026). Motif « serveur : » — pas une perte reseau, et
  // resumeLogsTexte le compte a part.
  const refus = data && data.ok === false ? 'serveur : ' + (data.error || 'refus') : undefined;
  logGas(action, numero, Date.now()-t0, refus);
  // Jeton refusé par l'API : retour à l'écran de connexion (AG-011).
  if(data && data.auth === true){
    try{ window.dispatchEvent(new Event('ateliers:auth-expiree')); }catch(_){}
  }
  return data;
};

// Lecture doublée : lance l'appel, et s'il n'a toujours rien renvoyé au bout
// de GAS_HEDGE_MS, en lance un second en parallèle sans attendre l'échec du
// premier. Le premier qui répond gagne, l'autre est ignoré. On ne rejette que
// si TOUS les appels partis ont échoué (sinon on abandonnerait à 3 s sur un
// 404 pendant qu'un doublon est encore en route).
// Pourquoi doubler plutôt que d'attendre : un appel qui n'a pas répondu en 7 s
// n'est pas en train de calculer (les réponses saines arrivent en 1-3 s), sa
// réponse est perdue en chemin — le relancer est le seul moyen d'en obtenir
// une, et attendre son abandon ne fait qu'ajouter le délai du plafond.
function gasLectureDoublee(url, action, numero, plafond, corps){
  return new Promise((resolve, reject)=>{
    let termine=false, partis=1, echecs=0, derniere=null;
    let minuteurDoublon=null;
    const ctrls=[];
    // Dès qu'un des deux aboutit, l'autre n'a plus d'objet : on l'annule au
    // lieu de le laisser courir jusqu'à son plafond. Sans ça, un doublon parti
    // à 7 s continuait après la réponse du premier et finissait par écrire
    // « bloqué — abandonné après 12s » dans le journal — une ligne rouge pour
    // un appel qui avait réussi (observé le 18/09/2026 à 23:04:23), plus une
    // exécution GAS consommée pour rien.
    // `sauf` = le contrôleur de l'appel qui vient d'aboutir : son fetch est
    // déjà terminé, l'annuler n'aurait aucun effet utile.
    const arreterLesAutres=(sauf)=>{
      ctrls.forEach(c=>{ if(c!==sauf && !c.signal.aborted){ c.inutile=true; c.abort(); } });
    };
    const gagner=(data, ctrlGagnant)=>{
      if(termine)return;
      termine=true; clearTimeout(minuteurDoublon); arreterLesAutres(ctrlGagnant); resolve(data);
    };
    const perdre=(err)=>{
      if(termine||(err&&err.inutile))return;
      echecs++; derniere=err;
      if(echecs>=partis){ termine=true; clearTimeout(minuteurDoublon); reject(derniere); }
    };
    const lancer=(num)=>{
      const ctrl=new AbortController();
      ctrls.push(ctrl);
      gasUnAppel(url, action, num, plafond, ctrl, corps).then(d=>gagner(d, ctrl), perdre);
    };
    lancer(numero);
    minuteurDoublon=setTimeout(()=>{
      if(termine)return;
      partis=2;
      lancer(numero+'b');
    }, GAS_HEDGE_MS);
  });
}

// Lectures qu'on ne double JAMAIS, bien qu'elles ne modifient pas d'atelier :
//  - checkPassword incrémente un compteur d'échecs (5 = blocage 15 min). Deux
//    appels espacés de 7 s le voient l'un après l'autre : un mot de passe mal
//    tapé compterait double et bloquerait le compte après 3 saisies au lieu
//    de 5, précisément les jours où le réseau va mal.
//  - logLogin / logAccesIndex ajoutent une ligne dans Logs_Connexion : doubler
//    fabriquerait de fausses connexions dans le journal.
// logLogin et logAccesIndex n'ont plus à figurer ici : elles sont désormais
// déclarées dans GAS_ACTIONS_ECRITURE, et une écriture n'est jamais doublée.
const GAS_SANS_DOUBLON = new Set(['checkPassword']);
// Les actions de journalisation ont d'abord été limitées à une seule
// tentative, au motif que personne n'attend leur résultat. Mauvais arbitrage,
// visible dès le premier relevé (18/09/2026 22:32:21 : « logLogin bloqué —
// abandonné après 12s ») : cette connexion n'a jamais été écrite dans
// Logs_Connexion. Personne n'attend ce résultat, mais la traçabilité des
// accès en dépend. Elles suivent donc le régime normal de reprise — sans
// doublage (ci-dessus), et en arrière-plan, donc sans coût perçu.

// Politique d'appel unique, partagée par apiFetch, fetchAll et fetchConfig —
// les trois recopiaient jusqu'ici la même logique de reprise, avec des
// plafonds qui divergeaient à chaque retouche.
// Le régime (lecture doublée / écriture séquentielle) se déduit de l'action
// via GAS_ACTIONS_ECRITURE — l'appelant n'a rien à déclarer, donc rien à
// oublier.
window.gasAppel = async function(url, action, corps){
  const ecriture   = GAS_ACTIONS_ECRITURE.has(action);
  const plafond    = gasPlafond(action, ecriture);
  const pause      = ecriture ? GAS_PAUSE_ECRITURE_MS   : GAS_PAUSE_LECTURE_MS;
  const doubler    = !ecriture && !GAS_SANS_DOUBLON.has(action);
  const tentatives = ecriture ? GAS_TENTATIVES_ECRITURE : GAS_TENTATIVES_LECTURE;
  const t0 = Date.now();
  let derniere = null;
  for(let n=1; n<=tentatives; n++){
    try{
      return doubler
        ? await gasLectureDoublee(url, action, n, plafond, corps)
        : await gasUnAppel(url, action, n, plafond, undefined, corps);
    }catch(err){
      derniere = err;
      // Erreur définitive (403, réponse non-JSON, déploiement cassé) : insister
      // ne changera rien, on rend la main tout de suite.
      if(!err.reessayable) break;
      // Budget épuisé : mieux vaut un bouton Réessayer qu'une attente qui
      // s'allonge sans fin.
      if(n < tentatives && Date.now()-t0 + pause >= GAS_BUDGET_TOTAL_MS) break;
      if(n < tentatives) await new Promise(r=>setTimeout(r, pause));
    }
  }
  if(derniere && derniere.httpStatus)
    throw new Error(`Google n'a pas livré la réponse (HTTP ${derniere.httpStatus}) après ${tentatives} tentatives — réessaie.`);
  if(derniere && derniere.message==='timeout')
    throw new Error(`Aucune réponse de Google après ${tentatives} tentatives — réessaie.`);
  throw derniere || new Error('Échec inconnu');
};

// Après un enregistrement dont la réponse s'est perdue, demande au serveur si
// les ateliers sont bien dans la feuille (idée de l'utilisateur, 23/09/2026 :
// « pourquoi afficher un échec au lieu de vérifier dans le sheet ? »).
// true = tous présents, false = au moins un absent, null = on ne sait pas
// (vérification perdue elle aussi, ou GAS sans l'action verifierIds).
window.verifierEnregistres = async function(ids){
  try{
    const r = await apiFetch('verifierIds', {ids:ids.join(',')});
    if(!r || !r.ok || !Array.isArray(r.presents)) return null;
    const presents = new Set(r.presents);
    return ids.every(id=>presents.has(id));
  }catch(_){ return null; }
};

// ── Choix des années chargées : cases à cocher (23/09/2026) ─────────────────
// Un bouton (même classe CSS que l'ancien <select>) ouvre une liste de cases.
// Position FIXE calculée depuis le bouton : dans le flux, la liste serait
// coupée par le menu latéral replié. Le choix ne s'applique qu'à la fermeture
// (clic ailleurs, OK, Échap annule) : un seul rechargement, pas un par case.
function ChoixAnnees({value,onChange,className,title}){
  const[ouvert,setOuvert]=React.useState(false);
  const[brouillon,setBrouillon]=React.useState(()=>anneesListe(value));
  const[pos,setPos]=React.useState(null);
  const btnRef=React.useRef(null),panRef=React.useRef(null),brouillonRef=React.useRef(brouillon);
  brouillonRef.current=brouillon;
  const c=new Date().getFullYear();
  const choix=[...new Set([String(c-1),String(c),String(c+1),...anneesListe(value)])].sort();
  const appliquer=(l)=>{setOuvert(false);const v=l.join(',');if(v!==anneesListe(value).join(','))onChange(v);};
  const ouvrir=()=>{
    const r=btnRef.current.getBoundingClientRect(),h=choix.length*32+52;
    const enHaut=r.bottom+h>window.innerHeight;
    setPos({left:Math.max(8,r.left),top:enHaut?Math.max(8,r.top-h-4):r.bottom+4,minWidth:Math.max(r.width,130)});
    setBrouillon(anneesListe(value));setOuvert(true);
  };
  React.useEffect(()=>{
    if(!ouvert)return;
    const clic=e=>{if(panRef.current&&!panRef.current.contains(e.target)&&btnRef.current&&!btnRef.current.contains(e.target))appliquer(brouillonRef.current);};
    const touche=e=>{if(e.key==='Escape')setOuvert(false);};
    document.addEventListener('mousedown',clic);document.addEventListener('keydown',touche);
    return()=>{document.removeEventListener('mousedown',clic);document.removeEventListener('keydown',touche);};
  },[ouvert,value]);
  // Au moins une année reste cochée.
  const basculer=an=>setBrouillon(l=>{const n=l.indexOf(an)>=0?l.filter(x=>x!==an):[...l,an].sort();return n.length?n:l;});
  return CE(React.Fragment,null,
    CE('button',{type:'button',ref:btnRef,className,title,'aria-label':title,'aria-haspopup':'true','aria-expanded':ouvert,
      style:{cursor:'pointer',textAlign:'left',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'},
      onClick:()=>ouvert?appliquer(brouillon):ouvrir()},anneesListe(value).join(' + ')+' ▾'),
    ouvert&&pos&&CE('div',{ref:panRef,role:'group','aria-label':title,style:{position:'fixed',left:pos.left,top:pos.top,minWidth:pos.minWidth,zIndex:3000,background:'#fff',color:'#1a202c',border:'1px solid #e2e8f0',borderRadius:10,boxShadow:'0 8px 24px rgba(0,0,0,.18)',padding:8,fontSize:13}},
      choix.map(an=>CE('label',{key:an,style:{display:'flex',alignItems:'center',gap:8,padding:'6px 8px',borderRadius:6,cursor:'pointer',fontWeight:600}},
        CE('input',{type:'checkbox',checked:brouillon.indexOf(an)>=0,onChange:()=>basculer(an)}),an)),
      CE('button',{type:'button',onClick:()=>appliquer(brouillon),style:{marginTop:6,width:'100%',padding:'6px 0',border:'none',borderRadius:6,background:'#1e3a8a',color:'#fff',fontWeight:700,cursor:'pointer'}},'OK')
    )
  );
}

// Chargement d'un script à la demande, une seule fois même si plusieurs
// actions le réclament en même temps. Sert aux grosses librairies qui ne
// servent qu'à un clic (xlsxstyle.js : 414 Ko, 138 Ko compressés) et qui
// n'ont donc rien à faire dans le <head>, où elles retardent l'affichage de
// la page pour tout le monde, y compris ceux qui n'exporteront jamais rien.
window.__scriptsCharges = window.__scriptsCharges || {};
window.chargerScriptUneFois = function(src){
  if(window.__scriptsCharges[src]) return window.__scriptsCharges[src];
  window.__scriptsCharges[src] = new Promise((resolve,reject)=>{
    const s=document.createElement('script');
    s.src=src;
    s.onload=()=>resolve();
    s.onerror=()=>{ delete window.__scriptsCharges[src]; reject(new Error('Chargement impossible : '+src)); };
    document.head.appendChild(s);
  });
  return window.__scriptsCharges[src];
};

// Export PDF (paysage A4) d'un élément du DOM — capture vectorisée via
// html2canvas puis insérée dans un PDF via jsPDF, chargés à la demande
// (chargerScriptUneFois : ces deux libs ne servent qu'à l'export). Remplace
// une tentative précédente basée sur window.print() + @page{size:landscape}
// injecté dynamiquement : constaté le 20/09/2026 en production, Chrome
// mémorise l'orientation choisie dans sa boîte de dialogue Imprimer par
// origine et l'impose à la prévisualisation, sans effet du CSS de la page —
// aucune API ne permet de la court-circuiter. Générer le PDF nous-mêmes
// contourne le problème entièrement, sans dépendre de ce que la boîte de
// dialogue du navigateur décide de faire.
async function exporterElementPDF(selector, titre, nomFichier){
  await window.chargerScriptUneFois('vendor/html2canvas-1.4.1/html2canvas.min.js');
  await window.chargerScriptUneFois('vendor/jspdf-2.5.1/jspdf.umd.min.js');
  const el = document.querySelector(selector);
  if(!el) throw new Error('Rien à exporter pour le moment.');
  const canvas = await window.html2canvas(el, { scale: 3, backgroundColor: '#ffffff' });
  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
  const pageW = pdf.internal.pageSize.getWidth();
  const pageH = pdf.internal.pageSize.getHeight();
  const marge = 10;
  pdf.setFontSize(11);
  pdf.setFont(undefined, 'bold');
  // La police par défaut de jsPDF (Helvetica, encodage WinAnsi) ne rend pas
  // le « → » utilisé par fmtPeriode (rendu garbled, constaté le 20/09/2026) —
  // remplacé par un tiret dans le PDF uniquement, l'app garde la flèche.
  pdf.text(titre.replace(/→/g, '-'), marge, marge);
  pdf.setFont(undefined, 'normal');
  pdf.setFontSize(8);
  pdf.setTextColor(140);
  const dateStr = new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' });
  pdf.text('Ateliers Inclusion Numérique — Imprimé le ' + dateStr, pageW - marge, marge, { align: 'right' });
  const zoneY = marge + 6, zoneW = pageW - marge * 2, zoneH = pageH - marge - zoneY;
  const ratio = canvas.width / canvas.height;
  let imgW = zoneW, imgH = imgW / ratio;
  if (imgH > zoneH) { imgH = zoneH; imgW = imgH * ratio; }
  pdf.addImage(canvas.toDataURL('image/png'), 'PNG', marge + (zoneW - imgW) / 2, zoneY, imgW, imgH);
  pdf.save(nomFichier);
}

// ── Écran d'attente d'un appel GAS ─────────────────────────────────────────
// Un getAll prend 10 à 30 s en cas de cache froid, redirection /exec → echo
// comprise. Sans rien à l'écran, l'attente passe pour un blocage : on affiche
// ce qui se passe, un compteur de secondes qui prouve que ça avance, et une
// petite animation + astuces pour rendre l'attente moins pesante — rien ici
// n'affecte la durée réelle de l'appel, purement cosmétique.
function AttenteGAS({titre}){
  const PALIERS = [
    {t:0,     txt:'Chargement des ateliers…'},
    {t:6000,  txt:"Plus lent que d'habitude (moins d'une seconde en temps normal)…"},
    {t:13000, txt:'Réponse perdue en chemin — nouvelle tentative…'},
    {t:26000, txt:'Dernière tentative…'},
  ];
  const[palier,setPalier]=React.useState(0);
  const[secs,setSecs]=React.useState(0);
  React.useEffect(()=>{
    const timers=PALIERS.slice(1).map((p,i)=>setTimeout(()=>setPalier(i+1),p.t));
    const tick=setInterval(()=>setSecs(s=>s+1),1000);
    return()=>{timers.forEach(clearTimeout);clearInterval(tick);};
  },[]);
  return CE('div',{className:'attente-gas'},
    CE('div',{className:'attente-reel'},
      CE('div',{className:'attente-reel-grain'}),
      CE('div',{className:'attente-reel-ring'}),
      // 12 repères façon amorce de film — 4 principaux (0/3/6/9h) plus longs
      Array.from({length:12}).map((_,i)=>CE('div',{key:i,className:'attente-reel-tickwrap',style:{transform:`rotate(${i*30}deg)`}},
        CE('div',{className:'attente-reel-tick'+(i%3===0?' maj':'')})
      )),
      CE('div',{className:'attente-reel-cross'}),
      CE('div',{className:'attente-reel-wedge'}),
      CE('span',{className:'attente-reel-num'},secs)
    ),
    titre&&CE('div',{className:'attente-gas-titre'},titre),
    CE('div',{key:palier,className:'attente-gas-txt'},PALIERS[palier].txt)
  );
}

const COMMUNES = [
  'AGEN','ARGENTON','ASTAFFORT','CASSENEUIL','CASTELMORON SUR LOT',
  'FAUILLET','FIEUX','FUMEL','LAVARDAC','LAYRAC',
  'LE TEMPLE SUR LOT','MONCLAR','NERAC','Ste-Bazeille',
  "Saint Pardoux d'Isaac",'TONNEINS',"TOURNONS D'AGENAIS",'VILLENEUVE SUR LOT'
];
// ──────────────────────────────────────────────────────────
const COMMUNES_GPS = {
  // ── Communes du CD47 ──
  'AGEN':{lat:44.2004,lng:0.6213},
  'AIGUILLON':{lat:44.2989,lng:0.3408},
  'ARGENTON':{lat:44.3167,lng:0.7833},
  'ASTAFFORT':{lat:44.0447,lng:0.6586},
  'BARBASTE':{lat:44.1558,lng:0.2814},
  'BON ENCONTRE':{lat:44.1833,lng:0.6417},
  'CASSENEUIL':{lat:44.3614,lng:0.6667},
  'CASTELJALOUX':{lat:44.3117,lng:0.0878},
  'CASTELMORON SUR LOT':{lat:44.3961,lng:0.4944},
  'CLAIRAC':{lat:44.3600,lng:0.3878},
  'DAMAZAN':{lat:44.2831,lng:0.2753},
  'DURAS':{lat:44.6731,lng:0.1794},
  'FAUILLET':{lat:44.3833,lng:0.3167},
  'FIEUX':{lat:44.1500,lng:0.8167},
  'FUMEL':{lat:44.4967,lng:0.9700},
  'LAVARDAC':{lat:44.1806,lng:0.2958},
  'LAYRAC':{lat:44.1347,lng:0.6625},
  'LE PASSAGE':{lat:44.2097,lng:0.5958},
  'LE TEMPLE SUR LOT':{lat:44.3833,lng:0.5333},
  'MARMANDE':{lat:44.5019,lng:0.1669},
  'MEZIN':{lat:44.0558,lng:0.2608},
  'MONCLAR':{lat:44.2167,lng:0.5833},
  'NERAC':{lat:44.1381,lng:0.3394},
  'PENNE D AGENAIS':{lat:44.3586,lng:0.9894},
  'PORT SAINTE MARIE':{lat:44.2500,lng:0.3833},
  'PRAYSSAS':{lat:44.2167,lng:0.5167},
  'SAINTE BAZEILLE':{lat:44.3667,lng:0.1833},
  'SAINTE LIVRADE SUR LOT':{lat:44.4014,lng:0.5933},
  'SAINT PARDOUX ISAAC':{lat:44.4000,lng:0.2167},
  'SOS':{lat:44.0631,lng:0.0344},
  'TONNEINS':{lat:44.3906,lng:0.3044},
  'TOURNON D AGENAIS':{lat:44.3833,lng:0.9667},
  'VILLENEUVE SUR LOT':{lat:44.4089,lng:0.7053},
};
const CONSEILLERS_DEFAULT = ['Cynthia Pineau','Corentin Tual','Michel Aswad','Eva Capelle'];
const STATUTS_DEFAULT = ['Planifié','Réalisé','Annulé','Non réalisé','Reporté'];
const PUBLICS_DEFAULT = [
  'Tous publics',
  'Besoin particulier',
  'Collèges',
  'Jeunes',
  'Séniors',
  'Insertion Pro',
  'Interne',
  'Autres'
];
const MATERIELS_DEFAULT = ['Videoprojecteur','Ecran','Classe mobile','Boitier 4G','Tablette','Scanner','Multiprise','Ordinateur'];
// normalizeMat, matIncludes → utils.js ; matériel et prêts (filterMaterielsVisibles,
// conflits, périodes, totaux, STOCK_ORDINATEURS) → logic.js, chargé par les deux
// pages depuis le 26/09/2026 (AG-015, lot 0). Il n'en existait jusque-là qu'une
// copie ici, que les pages exécutaient, pendant que les tests testaient logic.js.
// let (pas const) : écrasée par la config (materielsCaches renvoyé par getAll)
// dans loadData.
let MATERIELS_CACHES=[];


let STATUTS     = [...STATUTS_DEFAULT];
let CONSEILLERS = [...CONSEILLERS_DEFAULT];
let PUBLICS     = [...PUBLICS_DEFAULT];
let MATERIELS   = [...MATERIELS_DEFAULT];
let COMMUNES_47_CACHE = null;

// ── Utilitaires ────────────────────────────────────────────
const NAV_DEFAULT_COLOR = '#197d89';
let CONSEILLER_COLORS = {'Cynthia Pineau':'#7C3AED','Corentin Tual':'#2563EB','Michel Aswad':'#059669','Eva Capelle':'#DB2777'};
function conseillerColor(c){return(c&&CONSEILLER_COLORS[c])||'#6B7280';}
function applyColors(colors){if(colors&&typeof colors==='object')Object.assign(CONSEILLER_COLORS,colors);}

function fmtPeriode(debut,fin){return debut===fin?fmtDate(debut):fmtDate(debut)+' → '+fmtDate(fin);}
// todayLocal() en heure locale (évite le bug UTC après 22h/23h en France)
const isPasse = e=>e.date<todayLocal()&&e.statut==='Réalisé';
const isRetard = e=>e.statut==='Planifié'&&e.date<todayLocal();
const genId = ()=>`atelier_${Date.now()}_${Math.random().toString(36).slice(2,7)}`;
function badgePill(statut,retard){
  if(retard)return CE('span',{className:'badge-pill bp-retard'},'⚠ À mettre à jour');
  const cls={'Planifié':'bp-planifie','Réalisé':'bp-realise','Annulé':'bp-annule','Reporté':'bp-reporte','Non réalisé':'bp-nonrealise'}[statut]||'bp-nonrealise';
  return CE('span',{className:'badge-pill '+cls},statut);
}
const STATUT_COLORS={'Planifié':'#3b82f6','Réalisé':'#22c55e','Annulé':'#ef4444','Reporté':'#f97316','Non réalisé':'#94a3b8'};
// constante partagée — évite la duplication dans VueHistorique et VueCalendrier
const CLOTURE_PRESETS=[
  {label:'✅ Réalisé',    statut:'Réalisé',     bg:'#16a34a',color:'#fff'},
  {label:'❌ Annulé',     statut:'Annulé',      bg:'#dc2626',color:'#fff'},
  {label:'🚫 Non réalisé',statut:'Non réalisé', bg:'#6b7280',color:'#fff'},
  {label:'📅 Reporté',    statut:'Reporté',     bg:'#d97706',color:'#fff'},
];

let _toastTimer;
function showToast(msg,ok=true){
  const t=document.getElementById('toast');if(!t)return;
  t.textContent=msg;t.className=`toast ${ok?'toast-ok':'toast-err'}`;t.style.opacity='1';
  clearTimeout(_toastTimer);_toastTimer=setTimeout(()=>{t.style.opacity='0';},3500);
}

// ── Politique de mot de passe (auto-choisi par un conseiller) ───
// 12 caractères min., majuscule, minuscule, chiffre, caractère spécial.
// Ne s'applique pas au mot de passe par défaut (cd47+prénom) généré par
// resetPassword : celui-ci est volontairement faible mais temporaire —
// le changement obligatoire à la connexion force à le remplacer.
const PWD_POLICY_MSG='Le mot de passe doit contenir au moins 12 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial.';
function pwdPolicyOk(pwd){
  return typeof pwd==='string'&&pwd.length>=12&&/[A-Z]/.test(pwd)&&/[a-z]/.test(pwd)&&/[0-9]/.test(pwd)&&/[^A-Za-z0-9]/.test(pwd);
}

// ── Mot de passe oublié (AG-013, mode API seulement) ───────────────────────
// Le conseiller demande un lien par mail ; le lien ramène sur cette même page
// avec ?reinit=<jeton>, qui affiche le formulaire « nouveau mot de passe ».
// Le jeton part ensuite dans le corps POST (requeteServeur), jamais dans l'URL
// d'un appel, et il est retiré de la barre d'adresse une fois utilisé.
window.jetonReinitUrl=function(){
  try{const j=new URLSearchParams(window.location.search).get('reinit');return /^[0-9a-f]{64}$/.test(j||'')?j:null;}catch(_){return null;}
};
function oterReinitUrl(){
  try{const u=new URL(window.location.href);u.searchParams.delete('reinit');window.history.replaceState(null,'',u.pathname+u.search+u.hash);}catch(_){}
}
const REINIT_CHAMP={width:'100%',padding:'10px 14px',border:'1px solid var(--border)',borderRadius:8,fontSize:14,outline:'none',boxSizing:'border-box',background:'var(--surface)',color:'var(--text)',marginBottom:10};
const REINIT_BTN={width:'100%',padding:'11px',background:'#1e3a8a',color:'#fff',border:'none',borderRadius:8,fontSize:14,fontWeight:700,cursor:'pointer'};
const REINIT_LIEN={background:'none',border:'none',color:'#1e3a8a',cursor:'pointer',fontSize:12,textDecoration:'underline',padding:0};

// Repère visible du serveur (demande de l'utilisateur, 25/09/2026).
window.VERSION_APPLI = 'Version 2 — serveur Alwaysdata';
function MentionVersion(){
  return CE('p',{className:'mention-version',style:{fontSize:11,color:'#94a3b8',textAlign:'center',margin:'14px 0 0',fontWeight:400}},window.VERSION_APPLI);
}

function LienMotDePasseOublie({conseiller}){
  const[ouvert,setOuvert]=React.useState(false);
  const[envoi,setEnvoi]=React.useState(false);
  const[msg,setMsg]=React.useState(null); // {ok,texte}
  async function envoyer(){
    setEnvoi(true);setMsg(null);
    try{
      const retour=window.location.origin+window.location.pathname+(window.RETOUR_REINIT_SUFFIXE||'');
      const r=await apiFetch('demanderReinit',{conseiller,retour,userAgent:navigator.userAgent});
      setMsg(r&&r.ok?{ok:true,texte:r.message}:{ok:false,texte:(r&&r.error)||'Erreur'});
    }catch(e){setMsg({ok:false,texte:'Erreur réseau : '+e.message});}
    finally{setEnvoi(false);}
  }
  if(!ouvert) return CE('div',{style:{textAlign:'center',marginTop:12}},
    CE('button',{type:'button',style:REINIT_LIEN,onClick:()=>setOuvert(true)},'Mot de passe oublié ?'));
  return CE('div',{style:{marginTop:14,padding:12,border:'1px solid var(--border)',borderRadius:8,fontSize:13,color:'var(--text-2)'}},
    CE('div',{style:{marginBottom:8}},'Un lien pour choisir un nouveau mot de passe sera envoyé à l’adresse mail enregistrée pour ',CE('strong',null,conseiller||'…'),'.'),
    msg&&CE('p',{style:{color:msg.ok?'#15803d':'#c53030',margin:'0 0 8px'}},msg.texte),
    !(msg&&msg.ok)&&CE('button',{type:'button',style:{...REINIT_BTN,opacity:envoi||!conseiller?.6:1},disabled:envoi||!conseiller,onClick:envoyer},envoi?'Envoi…':'📧 Recevoir un lien par mail'),
    CE('div',{style:{textAlign:'center',marginTop:8}},CE('button',{type:'button',style:REINIT_LIEN,onClick:()=>{setOuvert(false);setMsg(null);}},'Fermer'))
  );
}

function VueReinitMotDePasse({jeton,onFini}){
  const[p1,setP1]=React.useState('');
  const[p2,setP2]=React.useState('');
  const[voir,setVoir]=React.useState(false);
  const[envoi,setEnvoi]=React.useState(false);
  const[err,setErr]=React.useState('');
  const[fini,setFini]=React.useState(false);
  function terminer(){oterReinitUrl();onFini&&onFini();}
  async function valider(){
    if(!pwdPolicyOk(p1)){setErr('❌ '+PWD_POLICY_MSG);return;}
    if(p1!==p2){setErr('Les deux mots de passe ne correspondent pas.');return;}
    setEnvoi(true);setErr('');
    try{
      const r=await apiFetch('reinitMotDePasse',{jeton,password:p1,userAgent:navigator.userAgent});
      if(r&&r.ok){setFini(true);oterReinitUrl();}
      else setErr((r&&r.error)||'Erreur');
    }catch(e){setErr('Erreur réseau : '+e.message);}
    finally{setEnvoi(false);}
  }
  if(fini) return CE('div',{style:{textAlign:'center'}},
    CE('div',{style:{fontSize:32,marginBottom:8}},'✅'),
    CE('div',{style:{fontSize:15,fontWeight:700,marginBottom:12,color:'var(--text)'}},'Mot de passe changé. Vous pouvez vous connecter.'),
    CE('button',{type:'button',style:REINIT_BTN,onClick:terminer},'Aller à la connexion'));
  const champ=(val,set,ph,entree)=>CE('input',{type:voir?'text':'password',placeholder:ph,value:val,autoComplete:'new-password',
    onChange:e=>set(e.target.value),onKeyDown:e=>entree&&e.key==='Enter'&&valider(),style:REINIT_CHAMP});
  return CE('div',null,
    CE('div',{style:{textAlign:'center',fontSize:32,marginBottom:8}},'🔑'),
    CE('div',{style:{fontSize:15,fontWeight:700,textAlign:'center',marginBottom:4,color:'var(--text)'}},'Choisir un nouveau mot de passe'),
    CE('div',{style:{fontSize:11,color:'#718096',textAlign:'center',marginBottom:12}},'12 caractères min. avec majuscule, minuscule, chiffre et caractère spécial.'),
    champ(p1,setP1,'Nouveau mot de passe',false),
    champ(p2,setP2,'Confirmer',true),
    CE('label',{style:{fontSize:12,color:'var(--text-2)',display:'flex',gap:6,alignItems:'center',marginBottom:10}},
      CE('input',{type:'checkbox',checked:voir,onChange:e=>setVoir(e.target.checked)}),'Afficher'),
    err&&CE('p',{style:{color:'#c53030',fontSize:13,marginBottom:8}},err),
    CE('button',{type:'button',style:{...REINIT_BTN,opacity:envoi||!p1||!p2?.6:1},disabled:envoi||!p1||!p2,onClick:valider},envoi?'Enregistrement…':'✅ Valider'),
    CE('div',{style:{textAlign:'center',marginTop:10}},CE('button',{type:'button',style:REINIT_LIEN,onClick:terminer},'Annuler et revenir à la connexion'))
  );
}

// ── Helper login : à appeler après un checkPassword réussi ──────
// Stocke le token et le rôle en sessionStorage pour apiFetch
window.onLoginSuccess = function(conseiller, res){
  if(res && res.token){
    window.authToken.set(res.token);
    window.authToken.setRole(res.role || 'user');
    sessionStorage.setItem('gs_conseiller', conseiller);
    // Pas de logLogin : checkPassword journalise déjà la connexion.
  }
};
window.onLogout = function(){
  window.authToken.clear();
};

// ── API — AbortController + token auth (GET uniquement — GAS ne supporte pas CORS preflight POST) ──
// ── Jeton de session, en sessionStorage (propre à l'onglet) ──────────
window.authToken = {
  get()  { return sessionStorage.getItem('gs_token') || null; },
  set(t) { sessionStorage.setItem('gs_token', t); },
  clear(){
    // Déconnexion côté serveur (25/09/2026) : le jeton est effacé en base avant
    // d'être oublié ici, sinon il restait valable 6 h. keepalive : l'envoi part
    // même si la page se ferme. Sans réponse attendue : oublier le jeton ici
    // ne doit jamais dépendre du réseau.
    const t = sessionStorage.getItem('gs_token');
    if(t){
      try{ fetch(`${API_PHP_URL}?action=logout`, {method:'POST', keepalive:true, headers:{'Content-Type':'application/x-www-form-urlencoded'}, body:'token='+encodeURIComponent(t)}).catch(()=>{}); }catch(_){}
    }
    sessionStorage.removeItem('gs_token'); sessionStorage.removeItem('gs_role'); sessionStorage.removeItem('gs_conseiller');
  },
  getRole()   { return sessionStorage.getItem('gs_role') || 'user'; },
  setRole(r)  { sessionStorage.setItem('gs_role', r); }
};

(function(){
  // Le jeton part avec toutes les actions (requeteServeur l'ajoute) : c'est
  // l'API qui décide de ce que chaque rôle peut faire. Plafonds et reprises :
  // gasAppel, qui déduit seul le régime du nom de l'action.
  window.apiFetch = async function apiFetch(action, body={}){
    const params = new URLSearchParams({action});
    // source=admin : l'API laisse l'admin travailler pendant une maintenance.
    if(window.location.pathname.indexOf('admin.html') > -1) params.set('source', 'admin');
    if(body && Object.keys(body).length){
      Object.entries(body).forEach(([k,v])=>{
        params.set(k, typeof v==='object' ? JSON.stringify(v) : v);
      });
    }
    const {url, corps} = window.requeteServeur(params);
    return window.gasAppel(url, action, corps);
  };
})();

// ── getAll partagé : un seul appel réseau par année ────────────────────────
// admin.html lançait plusieurs getAll simultanés au chargement (liste des
// conseillers du dropdown + loadData, en plus du préchauffage) : au mieux
// plusieurs exécutions GAS pour la même donnée, au pire les timeouts de
// loadData qui expirent tous ensemble → « Google Sheets ne répond pas après
// 3 tentatives ». Vérifié depuis via le panneau Exécutions Apps Script : GAS
// ne sérialise pas ses exécutions (deux doGet démarrés à 1s d'intervalle s'y
// chevauchent) — la dédup ci-dessous reste justifiée (plusieurs appels
// réseau pour la même donnée est un gaspillage dans tous les cas), mais pas
// pour la raison initialement supposée.
//
// fetchAll() garantit un seul appel en vol par année et sert un cache court :
// le préchauffage de l'écran de login devient un vrai prefetch dont loadData
// réutilise le résultat après connexion.
(function(){
  const TTL_MS = 45000;      // fenêtre pendant laquelle le prefetch reste valable
  const cache  = new Map();  // année → {promise, inflight, ts}

  async function rawGetAll(year, source){
    // « 2026,2027 » : plusieurs années en un seul appel (years=, AG-007).
    // Une seule année garde le paramètre year, et donc le chemin serveur
    // d'avant — y compris sur un GAS pas encore redéployé.
    const params = new URLSearchParams({action:'getAll'});
    params.set(String(year).indexOf(',')>=0 ? 'years' : 'year', String(year));
    if(source) params.set('source', source);
    const req = window.requeteServeur(params);
    const data = await window.gasAppel(req.url, 'getAll', req.corps);
    // Maintenance : GAS répond {ok:false, maintenance:true, msg} aux appels
    // non-admin (_actionGetAllFresh). Ce n'est pas une panne mais une réponse
    // valide — la traiter en erreur affichait « Erreur serveur » au lieu du
    // message prévu. C'est aussi ce qui permet à Index de connaître l'état de
    // maintenance sans un getConfig dédié.
    if(data && data.maintenance) return data;
    if(!data || !data.ok) throw new Error((data && data.error) || 'Erreur serveur');
    // Plusieurs années demandées, mais le GAS en ligne ne connaît pas encore
    // years= : il ne renvoie que l'année en cours, sans le dire. On le dit à
    // sa place (AG-007, amendement de la session B, point 1).
    if(String(year).indexOf(',')>=0 && !Array.isArray(data.years)){
      try{ showToast('⚠️ Serveur pas encore à jour : seule l\'année '+new Date().getFullYear()+' est chargée.',false); }catch(_){}
    }
    return data;
  }

  // force:true = ignore le cache terminé (après une écriture, un refresh manuel).
  // Un appel déjà en vol est toujours réutilisé.
  window.fetchAll = function fetchAll(year, opts){
    const o = opts || {};
    const key = String(year);
    const hit = cache.get(key);
    if(hit && (hit.inflight || (!o.force && Date.now()-hit.ts < TTL_MS))) return hit.promise;
    const entry = {inflight:true, ts:Date.now(), promise:null};
    entry.promise = rawGetAll(year, o.source)
      .then(data=>{ entry.inflight=false; entry.ts=Date.now(); return data; })
      .catch(err=>{ cache.delete(key); throw err; });
    cache.set(key, entry);
    return entry.promise;
  };

  window.invalidateFetchAll = function(){ cache.clear(); };
})();

// ── getConfig partagé : un seul appel réseau, réutilisé par tous les
// composants qui en ont besoin. Contrairement à getAll, getConfig n'avait
// aucune déduplication : jusqu'à 4 composants (hint login, maintenance,
// rappels_actifs, check maintenance Index) déclenchaient chacun leur propre
// aller-retour GAS pour la même info au même instant — inutilement, puisque
// c'est toujours la même donnée. Logs de prod : des getConfig abandonnés à
// 35s ou résolus en 27s juste après un login par ailleurs réussi.
(function(){
  const TTL_MS = 30000;
  let cache = null; // {promise, inflight, ts}

  async function rawGetConfig(){
    const req = window.requeteServeur(new URLSearchParams({action:'getConfig'}));
    const data = await window.gasAppel(req.url, 'getConfig', req.corps);
    if(!data || !data.ok) throw new Error((data && data.error) || 'Erreur serveur');
    return data;
  }

  // force:true = ignore le cache terminé. Un appel déjà en vol est toujours réutilisé.
  window.fetchConfig = function fetchConfig(opts){
    const o = opts || {};
    if(cache && (cache.inflight || (!o.force && Date.now()-cache.ts < TTL_MS))) return cache.promise;
    const entry = {inflight:true, ts:Date.now(), promise:null};
    entry.promise = rawGetConfig()
      .then(data=>{ entry.inflight=false; entry.ts=Date.now(); return data; })
      .catch(err=>{ cache=null; throw err; });
    cache = entry;
    return entry.promise;
  };
})();
async function loadCommunes47(){
  if(COMMUNES_47_CACHE)return COMMUNES_47_CACHE;
  try{
    const res=await Promise.race([fetch('https://geo.api.gouv.fr/departements/47/communes?fields=nom,codesPostaux&format=json'),new Promise((_,r)=>setTimeout(()=>r(new Error('timeout')),3000))]);
    const data=await res.json();
    const result=[];
    data.forEach(c=>{(c.codesPostaux||[]).forEach(cp=>{result.push({cp,nom:c.nom.toUpperCase()});});});
    result.sort((a,b)=>a.nom.localeCompare(b.nom));
    COMMUNES_47_CACHE=result;return result;
  }catch(e){COMMUNES_47_CACHE=COMMUNES.map(nom=>({cp:'47???',nom}));return COMMUNES_47_CACHE;}
}

// ═══════════════════════════════════════════════════════════
// COMBO COMMUNE
// ═══════════════════════════════════════════════════════════
function ComboCommune({value,onChange,hasError}){
  const[inputVal,setInputVal]=React.useState(value||'');
  const[open,setOpen]=React.useState(false);
  const[activeIdx,setActiveIdx]=React.useState(0);
  const[communes,setCommunes]=React.useState(COMMUNES_47_CACHE||[]);
  const[apiLoading,setApiLoading]=React.useState(false);
  const wrapRef=React.useRef(null);
  React.useEffect(()=>{setInputVal(value||'');},[value]);
  React.useEffect(()=>{
    if(!COMMUNES_47_CACHE){setApiLoading(true);loadCommunes47().then(d=>{setCommunes(d);setApiLoading(false);}).catch(()=>setApiLoading(false));}
    else setCommunes(COMMUNES_47_CACHE);
  },[]);
  React.useEffect(()=>{
    function h(e){if(wrapRef.current&&!wrapRef.current.contains(e.target))setOpen(false);}
    document.addEventListener('mousedown',h);return()=>document.removeEventListener('mousedown',h);
  },[]);
  const suggestions=React.useMemo(()=>{const q=inputVal.trim();if(!q||q.length<2)return[];const qs=stripAccents(q);return communes.filter(c=>c.cp.startsWith(q)||stripAccents(c.nom).includes(qs)).slice(0,50);},[inputVal,communes]);
  function selectItem(item){const d=item.nom+' ('+item.cp+')';setInputVal(d);onChange(d);setOpen(false);setActiveIdx(0);}
  function handleKeyDown(e){if(!open||suggestions.length===0)return;if(e.key==='ArrowDown'){e.preventDefault();setActiveIdx(i=>Math.min(i+1,suggestions.length-1));}else if(e.key==='ArrowUp'){e.preventDefault();setActiveIdx(i=>Math.max(i-1,0));}else if(e.key==='Enter'){e.preventDefault();if(suggestions[activeIdx])selectItem(suggestions[activeIdx]);}else if(e.key==='Escape')setOpen(false);}
  return CE('div',{className:'combo-wrap',ref:wrapRef},
    CE('input',{type:'text',value:inputVal,placeholder:apiLoading?'Chargement…':'Code postal ou commune…',className:hasError?'err':'',autoComplete:'off',disabled:apiLoading,onChange:e=>{setInputVal(e.target.value);setOpen(true);setActiveIdx(0);if(!e.target.value)onChange('');},onFocus:()=>{if(inputVal.trim().length>=2)setOpen(true);},onKeyDown:handleKeyDown}),
    apiLoading&&CE('div',{className:'combo-dropdown'},CE('div',{className:'combo-loading'},CE('span',{className:'spinner',style:{borderTopColor:'#1e3a8a',borderColor:'#e2e8f0',marginRight:8}}),'Chargement des communes…')),
    !apiLoading&&open&&suggestions.length>0&&CE('div',{className:'combo-dropdown'},suggestions.map((item,i)=>CE('div',{key:item.cp+'-'+item.nom+'-'+i,className:'combo-item'+(i===activeIdx?' active':''),onMouseDown:e=>{e.preventDefault();selectItem(item);},onMouseEnter:()=>setActiveIdx(i)},CE('span',{className:'combo-cp'},item.cp),CE('span',{className:'combo-nom'},item.nom)))),
    !apiLoading&&open&&inputVal.trim().length>=2&&suggestions.length===0&&CE('div',{className:'combo-dropdown'},CE('div',{className:'combo-empty'},'Aucune commune trouvée'))
  );
}

// ═══════════════════════════════════════════════════════════
// COMBO ORIENTEUR
// ═══════════════════════════════════════════════════════════
function ComboOrienteur({value,onChange,entries,hasError}){
  const[inputVal,setInputVal]=React.useState(value||'');
  const[open,setOpen]=React.useState(false);
  const[activeIdx,setActiveIdx]=React.useState(0);
  const wrapRef=React.useRef(null);
  React.useEffect(()=>{setInputVal(value||'');},[value]);
  React.useEffect(()=>{
    function h(e){if(wrapRef.current&&!wrapRef.current.contains(e.target))setOpen(false);}
    document.addEventListener('mousedown',h);return()=>document.removeEventListener('mousedown',h);
  },[]);
  const orienteurs=React.useMemo(()=>{const s=new Set();(entries||[]).forEach(e=>{if(e.orienteur&&e.orienteur.trim())s.add(e.orienteur.trim());});return[...s].sort((a,b)=>a.localeCompare(b));},[entries]);
  const suggestions=React.useMemo(()=>{const q=inputVal.trim();if(!q||q.length<2)return[];const qs=stripAccents(q);return orienteurs.filter(o=>stripAccents(o).includes(qs)).slice(0,20);},[inputVal,orienteurs]);
  function selectItem(name){setInputVal(name);onChange(name);setOpen(false);setActiveIdx(0);}
  function handleKeyDown(e){if(!open||suggestions.length===0)return;if(e.key==='ArrowDown'){e.preventDefault();setActiveIdx(i=>Math.min(i+1,suggestions.length-1));}else if(e.key==='ArrowUp'){e.preventDefault();setActiveIdx(i=>Math.max(i-1,0));}else if(e.key==='Enter'){e.preventDefault();if(suggestions[activeIdx])selectItem(suggestions[activeIdx]);}else if(e.key==='Escape')setOpen(false);}
  return CE('div',{className:'combo-wrap',ref:wrapRef},
    CE('input',{type:'text',value:inputVal,placeholder:"Nom de l'orienteur",className:hasError?'err':'',autoComplete:'off',onChange:e=>{setInputVal(e.target.value);onChange(e.target.value);setOpen(true);setActiveIdx(0);},onFocus:()=>{if(inputVal.trim().length>=2)setOpen(true);},onBlur:()=>setTimeout(()=>setOpen(false),150),onKeyDown:handleKeyDown}),
    open&&suggestions.length>0&&CE('div',{className:'combo-dropdown'},suggestions.map((name,i)=>CE('div',{key:name,className:'combo-item'+(i===activeIdx?' active':''),onMouseDown:e=>{e.preventDefault();selectItem(name);},onMouseEnter:()=>setActiveIdx(i)},CE('span',{className:'combo-nom'},name))))
  );
}

const CATALOGUE_THEMATIQUES_GROUPED=[
  {cat:'A — Le numérique par l\'outil',items:[
    'Prendre en main l\'ordinateur',
    'Prendre en main la tablette',
    'Prendre en main le smartphone',
    'Télécharger et gérer ses applis (iOS, Android)',
    'Naviguer sur internet',
    'Sécuriser son environnement numérique',
  ]},
  {cat:'B — Le numérique pour le quotidien',items:[
    'Prendre en main sa boite mail',
    'Recevoir et envoyer un mail avec pièce jointe',
    'Créer son identité numérique (FranceConnect)',
    'Démarches administratives en ligne (servicepublic.fr, boussole des jeunes…)',
    'Espace personnel site administratif (Ameli, CAF, MSA, Impôts…)',
    'Espace personnel site médical (Mon espace santé, Doctolib…)',
    'Outils numériques de scolarité (Pronote, Educonnect, Parcoursup…)',
    'Solutions numériques pour la gestion de budget',
    'Sécuriser ses achats en ligne et éviter les arnaques',
  ]},
  {cat:'C — Bureautique & stockage',items:[
    'Traitement de texte',
    'Tableur',
    'Manier les PDF',
    'Transférer et stocker ses fichiers (Drive, Cloud…)',
    'Organiser ses fichiers multimédias',
  ]},
  {cat:'D — Emploi & formation',items:[
    'Recherche d\'emploi (CV, lettre de motivation…)',
    'Compte Personnel de Formation (CPF)',
    'Sites JOB47 et France Travail',
  ]},
  {cat:'E — Mobilité',items:[
    'Solutions numériques liées à la mobilité (GPS, bus, covoiturage…)',
  ]},
  {cat:'F — Sécurité & citoyenneté numérique',items:[
    'Cybersécurité',
    'Découverte des réseaux sociaux',
    'Réseaux sociaux et jeunesse',
    'E-réputation',
    'Écrans et jeunesse',
  ]},
  {cat:'G — Environnement & IA',items:[
    'Numérique et environnement',
    'Intelligence artificielle (IA)',
  ]},
  {cat:'H — Culture & loisirs numériques',items:[
    'Plateforme ressources numériques de la Médiathèque Départementale',
    'Regarder et écouter (films, musiques)',
    'Lire (e-book)',
    'Apprendre et s\'informer (autoformation, presse)',
    'Visites virtuelles (musées, opéras, théâtres…)',
  ]},
];
const CATALOGUE_THEMATIQUES=CATALOGUE_THEMATIQUES_GROUPED.flatMap(g=>g.items);

function buildThemGroups(inputVal,entries){
  const q=(inputVal||'').trim();
  const qs=q?stripAccents(q.toLowerCase()):null;
  const catSet=new Set(CATALOGUE_THEMATIQUES);
  const extras=[...new Set((entries||[]).map(e=>e.thematique&&e.thematique.trim()).filter(t=>t&&!catSet.has(t)))].sort((a,b)=>a.localeCompare(b,'fr'));
  const groups=[];
  CATALOGUE_THEMATIQUES_GROUPED.forEach(({cat,items})=>{
    const filtered=qs?items.filter(t=>stripAccents(t.toLowerCase()).includes(qs)):items;
    if(filtered.length>0)groups.push({cat,items:filtered});
  });
  const filteredExtras=qs?extras.filter(t=>stripAccents(t.toLowerCase()).includes(qs)):extras;
  if(filteredExtras.length>0)groups.push({cat:'Thèmes précédents',items:filteredExtras});
  return groups;
}

function ComboThematique({value,onChange,entries,hasError}){
  const[inputVal,setInputVal]=React.useState(value||'');
  const[open,setOpen]=React.useState(false);
  const[activeIdx,setActiveIdx]=React.useState(0);
  const wrapRef=React.useRef(null);
  React.useEffect(()=>{setInputVal(value||'');},[value]);
  React.useEffect(()=>{function h(e){if(wrapRef.current&&!wrapRef.current.contains(e.target))setOpen(false);}document.addEventListener('mousedown',h);return()=>document.removeEventListener('mousedown',h);},[]);
  const groups=React.useMemo(()=>buildThemGroups(inputVal,entries),[inputVal,entries]);
  const flatItems=React.useMemo(()=>groups.flatMap(g=>g.items),[groups]);
  function selectItem(name){setInputVal(name);onChange(name);setOpen(false);setActiveIdx(0);}
  function handleKeyDown(e){if(!open||flatItems.length===0)return;if(e.key==='ArrowDown'){e.preventDefault();setActiveIdx(i=>Math.min(i+1,flatItems.length-1));}else if(e.key==='ArrowUp'){e.preventDefault();setActiveIdx(i=>Math.max(i-1,0));}else if(e.key==='Enter'){e.preventDefault();if(flatItems[activeIdx])selectItem(flatItems[activeIdx]);}else if(e.key==='Escape')setOpen(false);}
  return CE('div',{className:'combo-wrap',ref:wrapRef},
    CE('input',{type:'text',value:inputVal,placeholder:"Thème abordé lors de l'atelier…",className:hasError?'err':'',autoComplete:'off',
      onChange:e=>{setInputVal(e.target.value);onChange(e.target.value);setOpen(true);setActiveIdx(0);},
      onFocus:()=>setOpen(true),
      onBlur:()=>setTimeout(()=>setOpen(false),150),
      onKeyDown:handleKeyDown}),
    open&&flatItems.length>0&&CE('div',{className:'combo-dropdown'},
      groups.flatMap(({cat,items})=>{
        const rows=[];
        if(cat)rows.push(CE('div',{key:'h:'+cat,className:'combo-cat-header'},cat));
        items.forEach(name=>{const idx=flatItems.indexOf(name);rows.push(CE('div',{key:name,className:'combo-item'+(idx===activeIdx?' active':''),onMouseDown:e=>{e.preventDefault();selectItem(name);},onMouseEnter:()=>setActiveIdx(idx)},CE('span',{className:'combo-nom'},name)));});
        return rows;
      })
    )
  );
}

// ═══════════════════════════════════════════════════════════
// VUE LISTES
// ═══════════════════════════════════════════════════════════
function getItemColor(tabKey,name){
  if(tabKey==='statuts')return STATUT_COLORS[name]||'#94a3b8';
  if(tabKey==='conseillers'){const cols=['#7C3AED','#2563EB','#059669','#DB2777','#d97706','#0891b2','#65a30d','#dc2626'];const idx=(name.charCodeAt(0)+(name.charCodeAt(1)||0))%cols.length;return cols[idx];}
  if(tabKey==='publics')return'#6366f1';
  if(tabKey==='materiels')return'#0891b2';
  return'#94a3b8';
}
// ── Après une écriture réussie : appliquer en local, ne rien redemander ────
// app.js / admin_app.js exposent ces points d'entrée (voir le bloc
// « Application locale après écriture »). Ils mettent l'entrée à jour dans la
// liste déjà chargée et programment une resynchro différée, au lieu du getAll
// complet qui repartait immédiatement derrière chaque sauvegarde.
// Le repli sur onRefresh couvre le cas où un appelant n'aurait pas ce
// mécanisme (rien ne doit pouvoir laisser l'écran désynchronisé).
function entreeSauvegardee(entry, onRefresh){
  if(window.__entreeSauvegardee) window.__entreeSauvegardee(entry);
  else if(onRefresh) onRefresh();
}

function VueListes({lists,onSave,onClose,emails,onSaveEmails}){
  const TABS=[{key:'statuts',label:'Statuts'},{key:'conseillers',label:'Conseillers'},{key:'publics',label:'Types de public'},{key:'materiels',label:'Matériels'}];
  const[activeTab,setActiveTab]=React.useState('statuts');
  const[draft,setDraft]=React.useState({statuts:[...lists.statuts],conseillers:[...lists.conseillers],publics:[...lists.publics],materiels:[...lists.materiels]});
  const[newVal,setNewVal]=React.useState('');
  const[editIdx,setEditIdx]=React.useState(null);
  const[editVal,setEditVal]=React.useState('');
  const[emailDraft,setEmailDraft]=React.useState(()=>Object.assign({},emails||{}));
  const[rappelsActif,setRappelsActif]=React.useState({});
  const[rappelsSaving,setRappelsSaving]=React.useState(false);
  const[comptes,setComptes]=React.useState({});   // { CONSEILLER: {role, actif} }
  const[comptesSaving,setComptesSaving]=React.useState({});
  const[materielsCachesLocal,setMaterielsCachesLocal]=React.useState([]);
  const[materielCacheSaving,setMaterielCacheSaving]=React.useState({});

  const items=draft[activeTab];
  function setItems(fn){setDraft(d=>({...d,[activeTab]:fn(d[activeTab])}));setEditIdx(null);}
  function moveUp(i){if(i===0)return;setItems(arr=>{const a=[...arr];[a[i-1],a[i]]=[a[i],a[i-1]];return a;});}
  function moveDown(i){if(i===items.length-1)return;setItems(arr=>{const a=[...arr];[a[i],a[i+1]]=[a[i+1],a[i]];return a;});}
  function remove(i){setItems(arr=>arr.filter((_,j)=>j!==i));}
  function startEdit(i){setEditIdx(i);setEditVal(items[i]);}
  function saveEdit(i){if(!editVal.trim())return;setItems(arr=>{const a=[...arr];a[i]=editVal.trim();return a;});setEditIdx(null);}
  function addItem(){const v=newVal.trim();if(!v)return;if(draft[activeTab].includes(v)){showToast('⚠️ Cet élément existe déjà',false);return;}setItems(arr=>[...arr,v]);setNewVal('');}
  async function handleSave(){
    onSave(draft);
    // Sauvegarder listes
    try{const res=await apiFetch('saveLists',{lists:JSON.stringify(draft)});if(!res||!res.ok)showToast('⚠️ Listes : erreur GAS',false);}
    catch(_){showToast('⚠️ Listes : hors-ligne',false);}
    // Sauvegarder emails si onglet conseillers actif ou systématiquement
    try{
      const res=await apiFetch('saveEmails',{emails:JSON.stringify(emailDraft)});
      if(res&&res.ok){if(onSaveEmails)onSaveEmails(emailDraft);}
      else showToast('⚠️ Emails : erreur GAS',false);
    }catch(_){showToast('⚠️ Emails : hors-ligne',false);}
    showToast('✅ Listes et emails enregistrés');
    onClose();
  }
  React.useEffect(()=>{function k(e){if(e.key==='Escape')onClose();}document.addEventListener('keydown',k);return()=>document.removeEventListener('keydown',k);},[]);
  React.useEffect(()=>{setNewVal('');setEditIdx(null);},[activeTab]);
  React.useEffect(()=>{fetchConfig().then(res=>{if(res.ok&&res.config){
    try{setRappelsActif(JSON.parse(res.config['rappels_actifs']||'{}'));}catch(_){setRappelsActif({});}
    try{setMaterielsCachesLocal(JSON.parse(res.config['materiels_caches']||'[]'));}catch(_){setMaterielsCachesLocal([]);}
  }}).catch(()=>{});},[]);
  React.useEffect(()=>{if(activeTab==='conseillers'){apiFetch('getComptes').then(res=>{if(res.ok&&res.comptes){const m={};res.comptes.forEach(c=>{m[c.conseiller]={role:c.role||'user',actif:c.actif};});setComptes(m);}}).catch(()=>{});}},[activeTab]);

  async function handleSaveRappels(newObj){
    setRappelsSaving(true);
    try{const res=await apiFetch('setConfig',{key:'rappels_actifs',value:JSON.stringify(newObj)});if(res&&res.ok){setRappelsActif(newObj);}else throw new Error(res.error);}
    catch(err){showToast('❌ '+err.message,false);}
    finally{setRappelsSaving(false);}
  }
  async function handleToggleActif(nom,newActif){
    setComptesSaving(s=>({...s,[nom]:true}));
    const existing=comptes[nom]||{role:'user'};
    try{
      const res=await apiFetch('saveCompte',{conseiller:nom,role:existing.role,actif:newActif?'OUI':'NON'});
      if(res&&res.ok){setComptes(m=>({...m,[nom]:{...existing,actif:newActif?'OUI':'NON'}}));showToast(newActif?'✅ '+nom+' : accès Admin autorisé':'🔒 '+nom+' : accès Admin retiré (Index reste ouvert)');}
      else showToast('❌ Erreur serveur',false);
    }catch(_){showToast('❌ Hors-ligne',false);}
    finally{setComptesSaving(s=>({...s,[nom]:false}));}
  }
  async function handleSaveRole(nom,newRole){
    setComptesSaving(s=>({...s,[nom]:true}));
    const existing=comptes[nom]||{actif:'OUI'};
    try{
      const res=await apiFetch('saveCompte',{conseiller:nom,role:newRole,actif:existing.actif});
      if(res&&res.ok){setComptes(m=>({...m,[nom]:{...existing,role:newRole}}));showToast('✅ Rôle mis à jour : '+newRole);}
      else showToast('❌ Erreur serveur',false);
    }catch(_){showToast('❌ Hors-ligne',false);}
    finally{setComptesSaving(s=>({...s,[nom]:false}));}
  }
  async function handleToggleMaterielCache(item,hidden){
    setMaterielCacheSaving(s=>({...s,[item]:true}));
    const next=hidden?[...materielsCachesLocal,item]:materielsCachesLocal.filter(m=>m!==item);
    try{
      const res=await apiFetch('setConfig',{key:'materiels_caches',value:JSON.stringify(next)});
      if(res&&res.ok){setMaterielsCachesLocal(next);MATERIELS_CACHES=next;showToast(hidden?'🙈 '+item+' masqué du formulaire':'👁️ '+item+' de nouveau visible');}
      else showToast('❌ Erreur serveur',false);
    }catch(_){showToast('❌ Hors-ligne',false);}
    finally{setMaterielCacheSaving(s=>({...s,[item]:false}));}
  }
  return CE('div',{className:'listes-overlay',onClick:e=>{if(e.target.className==='listes-overlay')onClose();}},
    CE('div',{className:'listes-modal'},
      CE('div',{className:'listes-header'},
        CE('button',{className:'listes-close',onClick:onClose},'×'),
        CE('h2',null,'📋 Gestion des listes déroulantes'),
        CE('p',null,'Ajouter, modifier, supprimer et réordonner')
      ),
      CE('div',{className:'listes-tabs'},TABS.map(t=>CE('div',{key:t.key,className:'listes-tab'+(activeTab===t.key?' active':''),onClick:()=>setActiveTab(t.key)},t.label,CE('span',{className:'tab-count'},draft[t.key].length)))),
      CE('div',{className:'listes-body'},
        activeTab==='conseillers'&&CE('div',{style:{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'8px 14px',marginBottom:8,background:'#f8fafc',border:'1.5px solid #e2e8f0',borderRadius:8}},
          CE('span',{style:{fontSize:12,fontWeight:700,color:'#4a5568'}},'📧 Rappels email'),
          CE('button',{
            style:{fontSize:11,padding:'4px 10px',borderRadius:6,border:'1.5px solid #cbd5e0',background:'#fff',cursor:'pointer',color:'#4a5568'},
            disabled:rappelsSaving,
            onClick:()=>{
              const allOn=draft.conseillers.every(c=>rappelsActif[c]!==false);
              const newObj={};
              draft.conseillers.forEach(c=>newObj[c]=allOn?false:true);
              handleSaveRappels(newObj);
            }
          },draft.conseillers.every(c=>rappelsActif[c]!==false)?'🔕 Tout désactiver':'✅ Tout activer')
        ),
        items.map((item,i)=>CE('div',{key:i,className:'listes-item'},
          CE('div',{className:'listes-arrows'},
            CE('button',{onClick:()=>moveUp(i),disabled:i===0,title:'Monter'},'▲'),
            CE('button',{onClick:()=>moveDown(i),disabled:i===items.length-1,title:'Descendre'},'▼')
          ),
          CE('span',{className:'listes-dot',style:{background:getItemColor(activeTab,item)}}),
          editIdx===i
            ?CE('div',{className:'listes-name',style:activeTab==='conseillers'?{flex:'0 1 100px',maxWidth:100}:null},CE('input',{autoFocus:true,value:editVal,onChange:e=>setEditVal(e.target.value),onKeyDown:e=>{if(e.key==='Enter')saveEdit(i);if(e.key==='Escape')setEditIdx(null);}}))
            :CE('div',{className:'listes-name',style:activeTab==='conseillers'?{flex:'0 1 100px',maxWidth:100}:null},item),
          // Champ email + toggle rappel inline pour l'onglet Conseillers
          activeTab==='conseillers'&&CE(React.Fragment,null,
            CE('input',{
              type:'email',
              placeholder:'email@exemple.com',
              value:emailDraft[item]||'',
              onChange:e=>setEmailDraft(d=>({...d,[item]:e.target.value})),
              title:'Email pour les rappels automatiques',
              style:{flex:'0 1 130px',minWidth:60,padding:'5px 8px',border:'1.5px solid #bee3f8',borderRadius:6,fontSize:12,color:'#2a69ac',background:'#ebf8ff'}
            }),
            CE('div',{title:rappelsActif[item]!==false?'Rappels email activés — cliquer pour désactiver':'Rappels email désactivés — cliquer pour activer',style:{flexShrink:0,display:'flex',flexDirection:'column',alignItems:'center',fontSize:10,color:rappelsActif[item]!==false?'#2563eb':'#9ca3af',gap:2}},
              CE('label',{className:'tgl',style:{marginBottom:0}},
                CE('input',{type:'checkbox',checked:rappelsActif[item]!==false,disabled:rappelsSaving,
                  onChange:e=>{const n={...rappelsActif,[item]:e.target.checked};handleSaveRappels(n);}}),
                CE('span',{className:'tgl-track',style:rappelsActif[item]===false?{background:'#e2e8f0'}:{}})
              ),
              CE('span',null,rappelsActif[item]!==false?'📧 mail':'🔕 mail')
            ),
            CE('div',{
              title:(comptes[item]?.actif!=='NON'?'Compte actif (visible au login) — cliquer pour désactiver':'Compte inactif (caché au login) — cliquer pour activer'),
              style:{flexShrink:0,display:'flex',flexDirection:'column',alignItems:'center',fontSize:10,color:comptes[item]?.actif!=='NON'?'#22543d':'#9ca3af',gap:2}
            },
              CE('label',{className:'tgl',style:{marginBottom:0}},
                CE('input',{type:'checkbox',checked:comptes[item]?.actif!=='NON',disabled:!!comptesSaving[item],
                  onChange:e=>handleToggleActif(item,e.target.checked)}),
                CE('span',{className:'tgl-track',style:comptes[item]?.actif==='NON'?{background:'#e2e8f0'}:{}})
              ),
              // Mode API : l'interrupteur ne ferme que l'Admin (24/09/2026), Index reste ouvert.
              CE('span',null,comptes[item]?.actif!=='NON'?'🔑 accès Admin':'🔒 sans Admin')
            ),
            CE('select',{
              value:comptes[item]?.role||'user',
              disabled:!!comptesSaving[item],
              onChange:e=>handleSaveRole(item,e.target.value),
              title:'Rôle du conseiller',
              style:{flexShrink:0,flexGrow:0,width:112,fontSize:11,padding:'5px 4px',borderRadius:6,border:'1.5px solid #e2e8f0',background:'#fff',color:'#4a5568',cursor:'pointer'}
            },
              CE('option',{value:'user'},'👤 Utilisateur'),
              CE('option',{value:'admin'},'⚙️ Admin'),
              CE('option',{value:'superviseur'},'👁️ Superviseur')
            )
          ),
          // Masquer un matériel du formulaire de saisie sans le supprimer de
          // cette liste (les ateliers déjà enregistrés le gardent).
          activeTab==='materiels'&&(()=>{
            const cache=materielsCachesLocal.includes(item);
            return CE('div',{
              title:cache?'Masqué du formulaire de saisie — cliquer pour rendre visible':'Visible dans le formulaire de saisie — cliquer pour masquer',
              style:{flexShrink:0,display:'flex',flexDirection:'column',alignItems:'center',fontSize:10,color:cache?'#9ca3af':'#22543d',gap:2}
            },
              CE('label',{className:'tgl',style:{marginBottom:0}},
                CE('input',{type:'checkbox',checked:!cache,disabled:!!materielCacheSaving[item],
                  onChange:e=>handleToggleMaterielCache(item,!e.target.checked)}),
                CE('span',{className:'tgl-track',style:cache?{background:'#e2e8f0'}:{}})
              ),
              CE('span',null,cache?'🙈 masqué':'👁️ visible')
            );
          })(),
          CE('div',{className:'listes-actions'},
            editIdx===i
              ?CE('button',{className:'btn btn-primary btn-sm',onClick:()=>saveEdit(i)},'✓ OK')
              :CE('button',{className:'btn btn-secondary btn-sm',onClick:()=>startEdit(i)},'Modifier'),
            CE('button',{className:'btn btn-sm',style:{background:'#fee2e2',color:'#991b1b',border:'none'},onClick:()=>remove(i)},'Suppr.')
          )
        )),
        CE('div',{className:'listes-add-row'},
          CE('input',{type:'text',placeholder:`Ajouter dans ${TABS.find(t=>t.key===activeTab)?.label}…`,value:newVal,onChange:e=>setNewVal(e.target.value),onKeyDown:e=>{if(e.key==='Enter')addItem();}}),
          CE('button',{className:'btn btn-primary',onClick:addItem},'+ Ajouter')
        )
      ),
      CE('div',{className:'listes-footer'},
        CE('button',{className:'btn btn-secondary',onClick:onClose},'Annuler'),
        CE('button',{className:'btn btn-primary',onClick:handleSave},'💾 Enregistrer')
      )
    )
  );
}

// Login — supprimé v10.0 (remplacé par AdminLogin dans admin.html)

// ═══════════════════════════════════════════════════════════
// ComboThematiqueFixed — dropdown en position:fixed pour les contextes grid/overflow
function ComboThematiqueFixed({value,onChange,onBlur,entries,hasError}){
  const[inputVal,setInputVal]=React.useState(value||'');
  const[open,setOpen]=React.useState(false);
  const[activeIdx,setActiveIdx]=React.useState(0);
  const[dropPos,setDropPos]=React.useState({top:0,left:0,width:0});
  const inputRef=React.useRef(null);
  const wrapRef=React.useRef(null);
  const dropRef=React.useRef(null);
  React.useEffect(()=>{setInputVal(value||'');},[value]);
  React.useEffect(()=>{function h(e){if(wrapRef.current&&!wrapRef.current.contains(e.target)&&dropRef.current&&!dropRef.current.contains(e.target))setOpen(false);}document.addEventListener('mousedown',h);return()=>document.removeEventListener('mousedown',h);},[]);
  const groups=React.useMemo(()=>buildThemGroups(inputVal,entries),[inputVal,entries]);
  const flatItems=React.useMemo(()=>groups.flatMap(g=>g.items),[groups]);
  function openDrop(){
    if(inputRef.current){const r=inputRef.current.getBoundingClientRect();setDropPos({top:r.bottom,left:r.left,width:r.width});}
    setOpen(true);setActiveIdx(0);
  }
  function selectItem(name){setInputVal(name);onChange(name);setOpen(false);}
  function handleKeyDown(e){if(!open||flatItems.length===0)return;if(e.key==='ArrowDown'){e.preventDefault();setActiveIdx(i=>Math.min(i+1,flatItems.length-1));}else if(e.key==='ArrowUp'){e.preventDefault();setActiveIdx(i=>Math.max(i-1,0));}else if(e.key==='Enter'){e.preventDefault();if(flatItems[activeIdx])selectItem(flatItems[activeIdx]);}else if(e.key==='Escape')setOpen(false);}
  return CE('div',{ref:wrapRef,style:{position:'relative',width:'100%'}},
    CE('input',{ref:inputRef,type:'text',value:inputVal,placeholder:'Thème de la séance',
      className:hasError?'err':'',autoComplete:'off',
      style:{width:'100%',padding:'8px 10px',border:`2px solid ${hasError?'#e53e3e':'#e2e8f0'}`,borderRadius:8,fontSize:12,background:hasError?'#fff5f5':'#f8fafc',outline:'none',boxSizing:'border-box'},
      onChange:e=>{setInputVal(e.target.value);onChange(e.target.value);openDrop();},
      onFocus:openDrop,
      onBlur:()=>setTimeout(()=>{setOpen(false);if(onBlur)onBlur(inputVal);},150),
      onKeyDown:handleKeyDown}),
    open&&flatItems.length>0&&ReactDOM.createPortal(
      CE('div',{ref:dropRef,style:{position:'fixed',top:dropPos.top,left:dropPos.left,width:dropPos.width,background:'#fff',border:'1.5px solid #1e3a8a',borderTop:'none',borderRadius:'0 0 6px 6px',maxHeight:240,overflowY:'auto',zIndex:9999,boxShadow:'0 4px 12px rgba(0,0,0,.15)'}},
        groups.flatMap(({cat,items})=>{
          const rows=[];
          if(cat)rows.push(CE('div',{key:'h:'+cat,style:{padding:'6px 12px 2px',fontSize:10,fontWeight:800,textTransform:'uppercase',letterSpacing:'.08em',color:'#1e3a8a',pointerEvents:'none',userSelect:'none'}},cat));
          items.forEach(name=>{const idx=flatItems.indexOf(name);rows.push(CE('div',{key:name,style:{padding:'7px 12px',cursor:'pointer',fontSize:13,background:idx===activeIdx?'#eff6ff':'#fff',transition:'background .1s'},onMouseDown:e=>{e.preventDefault();selectItem(name);},onMouseEnter:()=>setActiveIdx(idx)},name));});
          return rows;
        })
      ),
      document.body
    )
  );
}

// VUE SAISIE — v9.1 : mode unique + mode lot (cycle)
// ═══════════════════════════════════════════════════════════
const emptyRow=()=>({id:genId(),date:'',horaire:'',ampm:'',thematique:'',inscrits:4,presents:'',date_prelevement_materiel:'',date_retour_materiel:''});

function VueSaisie({entries,onSaved,onNewEntry,lists,editingId,onClearEdit,prefillData,onClearPrefill,accentColor}){
  const statuts    = lists?.statuts     || STATUTS_DEFAULT;
  const conseillers= lists?.conseillers || CONSEILLERS_DEFAULT;
  const publics    = lists?.publics     || PUBLICS_DEFAULT;
  const materiels  = lists?.materiels   || MATERIELS_DEFAULT;
  const empty={_id:'',_n:'',statut:'',date:'',horaire:'',ampm:'',orienteur:'',commune:'',lieu:'',thematique:'',inscrits:4,presents:'',public:'',conseiller:'',co_animateur:'',materiel:[],residence:'',remarques:'',nb_ordinateurs:'',date_prelevement_materiel:'',date_retour_materiel:''};

  // ── états mode unique ──
  const[form,setForm]   = React.useState(empty);
  const[errors,setErrors]= React.useState({});
  const[editId,setEditId]= React.useState(null);
  const[isDup,setIsDup]  = React.useState(false);

  // ── états mode lot ──
  const[modeLot,setModeLot]     = React.useState(false);
  const[lotForm,setLotForm]     = React.useState({orienteur:'',commune:'',lieu:'',conseiller:'',co_animateur:'',public:'',materiel:[],residence:'',remarques:'',nb_ordinateurs:''});
  const[lotRows,setLotRows]     = React.useState([emptyRow(),emptyRow()]);
  const[lotErrors,setLotErrors] = React.useState({});
  const[lotRowErrors,setLotRowErrors]= React.useState({});

  const[saving,setSaving]= React.useState(false);
  const[formError,setFormError]= React.useState('');

  // ── chargement editingId → force mode unique ──
  React.useEffect(()=>{
    if(!editingId)return;
    idNouveauRef.current=null;
    const e=entries.find(x=>x._id===editingId);if(!e)return;
    setForm({...empty,...e,materiel:e.materiel||[]});setEditId(editingId);setIsDup(false);setModeLot(false);
    window.scrollTo(0,0);if(onClearEdit)onClearEdit();
  },[editingId,entries]);

  // ── chargement prefillData (duplication) → force mode unique ──
  React.useEffect(()=>{
    if(!prefillData)return;
    idNouveauRef.current=null;
    setForm({...empty,...prefillData,_id:'',_n:'',date:'',horaire:'',ampm:'',inscrits:4,presents:'',remarques:'',statut:'Planifié'});
    setEditId(null);setIsDup(true);setModeLot(false);setErrors({});
    window.scrollTo(0,0);if(onClearPrefill)onClearPrefill();
  },[prefillData]);

  // Identifiants des ateliers d'un envoi, GARDÉS tant que l'envoi n'a pas
  // réussi. Un clic dont la réponse se perd, puis un second clic, renvoient
  // les MÊMES _id : le serveur remplace ses lignes au lieu d'en ajouter.
  // Constaté le 23/09/2026 : cycle de 8 ateliers recliqué après « Google n'a
  // pas livré la réponse » = 16 lignes, chaque clic tirant de nouveaux _id.
  const idNouveauRef=React.useRef(null);
  const idsLotRef=React.useRef({});
  function reset(){idNouveauRef.current=null;setForm(empty);setEditId(null);setIsDup(false);setErrors({});}
  function resetLot(){idsLotRef.current={};setLotForm({orienteur:'',commune:'',lieu:'',conseiller:'',co_animateur:'',public:'',materiel:[],residence:'',remarques:'',nb_ordinateurs:''});setLotRows([emptyRow(),emptyRow()]);setLotErrors({});setLotRowErrors({});}

  function set(k,v){const a=k==='horaire'?ampmDepuisHoraire(v):'';setForm(f=>({...f,[k]:v,...(a?{ampm:a}:{})}));setErrors(er=>({...er,[k]:'',...(a?{ampm:''}:{})}));}
  function toggleMat(m){setForm(f=>{const already=matIncludes(f.materiel,m);return{...f,materiel:already?f.materiel.filter(x=>normalizeMat(x)!==normalizeMat(m)):[...f.materiel,m]};});}
  function setLot(k,v){setLotForm(f=>({...f,[k]:v}));setLotErrors(er=>({...er,[k]:''}));}
  function toggleLotMat(m){setLotForm(f=>{const already=matIncludes(f.materiel,m);return{...f,materiel:already?f.materiel.filter(x=>normalizeMat(x)!==normalizeMat(m)):[...f.materiel,m]};});}

  // ── lignes du lot ──
  function addRow(){setLotRows(r=>[...r,emptyRow()]);}
  function removeRow(id){if(lotRows.length<=1)return;setLotRows(r=>r.filter(x=>x.id!==id));}
  function setRow(id,k,v){const a=k==='horaire'?ampmDepuisHoraire(v):'';setLotRows(r=>r.map(x=>x.id===id?{...x,[k]:v,...(a?{ampm:a}:{})}:x));setLotRowErrors(er=>({...er,[id]:{...(er[id]||{}),[k]:'',...(a?{ampm:''}:{})}}));}

  // ── validation mode unique ──
  const FIELD_LABELS={'statut':'Statut','date':'Date','horaire':'Horaire','ampm':'AM/PM','commune':'Commune','lieu':'Lieu','thematique':'Thématique','conseiller':'Conseiller','orienteur':'Orienteur','public':'Type de public','inscrits':'Inscrits','nb_ordinateurs':'Ordinateurs prêtés'};

  function validate(){
    const e={};
    if(!form.statut)            e.statut='Requis';
    if(!form.date)              e.date='Requis';
    if(!form.horaire)           e.horaire='Requis';
    if(!form.ampm)              e.ampm='Requis';
    if(!form.commune.trim())    e.commune='Requis';
    if(!form.lieu.trim())       e.lieu='Requis';
    if(!form.thematique.trim()) e.thematique='Requis';
    if(!form.conseiller)        e.conseiller='Requis';
    if(!form.orienteur.trim())  e.orienteur='Requis';
    if(!form.public)            e.public='Requis';
    if(form.inscrits==='')      e.inscrits='Requis';
    // Classe mobile cochée sans quantité : le conflit de stock (Frise du
    // parc, findOrdinateursConflicts) ne peut rien détecter sans ce nombre
    // — confirmé en prod le 18/09/2026 (ateliers Classe mobile sans
    // ordinateurs prêtés invisibles dans la Frise, alors que le conflit
    // Classe mobile lui-même s'affichait bien dans la liste).
    if(matIncludes(form.materiel,'Classe mobile')&&!(parseInt(form.nb_ordinateurs)>0)) e.nb_ordinateurs='Requis';
    setErrors(e);
    const missing=Object.keys(e).map(k=>FIELD_LABELS[k]||k);
    if(missing.length>0)setFormError('Champs obligatoires manquants : '+missing.join(', '));
    else setFormError('');
    return missing.length===0;
  }

  // ── validation mode lot ──
  function validateLot(rows=lotRows){
    const e={};
    if(!lotForm.commune.trim())   e.commune='Requis';
    if(!lotForm.lieu.trim())      e.lieu='Requis';
    if(!lotForm.conseiller)       e.conseiller='Requis';
    if(!lotForm.orienteur.trim()) e.orienteur='Requis';
    if(!lotForm.public)           e.public='Requis';
    if(matIncludes(lotForm.materiel,'Classe mobile')&&!(parseInt(lotForm.nb_ordinateurs)>0)) e.nb_ordinateurs='Requis';
    setLotErrors(e);
    const re={};
    rows.forEach(r=>{
      const er={};
      if(!r.date)       er.date='Requis';
      if(!r.horaire)    er.horaire='Requis';
      if(!r.ampm)       er.ampm='Requis';
      if(!(r.thematique||'').trim()) er.thematique='Requis';
      if(r.inscrits==='')er.inscrits='Requis';
      if(Object.keys(er).length>0)re[r.id]=er;
    });
    setLotRowErrors(re);
    const missing=[...Object.keys(e).map(k=>FIELD_LABELS[k]||k)];
    if(Object.keys(re).length>0)missing.push('Date/Horaire/AM-PM/Thématique/Inscrits dans le tableau');
    if(missing.length>0)setFormError('Champs obligatoires manquants : '+missing.join(', '));
    else setFormError('');
    return Object.keys(e).length===0&&Object.keys(re).length===0;
  }

  // ── submit mode unique ──
  async function handleSubmit(){
    if(!validate()){showToast('⚠️ Champs obligatoires manquants',false);return;}
    setSaving(true);
    const entry={...form,_id:form._id||idNouveauRef.current||(idNouveauRef.current=genId()),inscrits:form.inscrits===''?'':parseInt(form.inscrits)||0,presents:form.presents===''?'':parseInt(form.presents)||0,nb_ordinateurs:form.nb_ordinateurs===''?'':parseInt(form.nb_ordinateurs)||0,materiel:(form.materiel||[]).join('|')};
    const reussir=()=>{
      showToast(editId?'✅ Atelier modifié':'✅ Atelier enregistré');
      // materiel repart en tableau (pas la chaîne '|' envoyée à GAS) : c'est
      // le format attendu partout ailleurs dans l'app (badges, filtres...).
      // _n reste vide : seul GAS connaît le vrai numéro de ligne, il arrivera
      // au prochain rechargement réel sans que ça bloque l'affichage ici.
      if(onNewEntry&&!editId)onNewEntry({...entry,_n:'',materiel:form.materiel||[]});
      // Mise en évidence dans Historique : _pendingHighlight est lu au montage
      // (l'Historique n'est pas encore affiché au moment de l'enregistrement),
      // l'événement sert quand il l'est déjà.
      if(!editId){ window._pendingHighlight=[entry._id]; document.dispatchEvent(new CustomEvent('ateliers:highlight',{detail:{ids:[entry._id]}})); }
      // Application locale, sans relire le serveur : entreeSauvegardee (les
      // deux applis) et onSaved(isNew, entry) (NEWGEN).
      entreeSauvegardee({...entry,materiel:form.materiel||[]});
      onSaved(!editId,{...entry,materiel:form.materiel||[]});reset();
    };
    try{
      const res=await apiFetch('saveEntry',{entry});
      if(!res.ok)throw Object.assign(new Error(res.error),{refus:true});
      reussir();
    }catch(err){
      // Réponse perdue : on vérifie dans la feuille avant d'annoncer un échec.
      // Une modification (editId) existait déjà : sa présence ne prouve rien.
      if(!err.refus&&!editId&&await verifierEnregistres([entry._id])){reussir();return;}
      showToast('❌ '+err.message+(err.refus?'':' — il a peut-être été enregistré quand même : recliquez sur Enregistrer, cela ne créera pas de doublon.'),false);
    }
    finally{setSaving(false);}
  }

  // ── submit mode lot ──
  async function handleSubmitLot(){
    const rowsFilled=lotRows.filter(r=>r.date||r.horaire||(r.thematique||'').trim());
    if(rowsFilled.length===0){setFormError('Ajoutez au moins une date dans le tableau.');showToast('⚠️ Ajoutez au moins une date dans le tableau.',false);return;}
    if(rowsFilled.length<lotRows.length)setLotRows(rowsFilled);
    if(!validateLot(rowsFilled)){showToast('⚠️ Champs obligatoires manquants',false);return;}
    setSaving(true);
    try{
      const entries=rowsFilled.map(row=>({_id:idsLotRef.current[row.id]||(idsLotRef.current[row.id]=genId()),_n:'',statut:'Planifié',date:row.date,horaire:row.horaire,ampm:row.ampm,thematique:row.thematique,orienteur:lotForm.orienteur,commune:lotForm.commune,lieu:lotForm.lieu,conseiller:lotForm.conseiller,co_animateur:lotForm.co_animateur||'',public:lotForm.public,materiel:(lotForm.materiel||[]).join('|'),residence:lotForm.residence,remarques:lotForm.remarques,inscrits:row.inscrits===''?'':parseInt(row.inscrits)||0,presents:row.presents===''?'':parseInt(row.presents)||0,nb_ordinateurs:lotForm.nb_ordinateurs===''?'':parseInt(lotForm.nb_ordinateurs)||0,date_prelevement_materiel:row.date_prelevement_materiel||'',date_retour_materiel:row.date_retour_materiel||''}));
      // Même conversion materiel string→tableau que le mode unique.
      const appliquer=liste=>{
        liste.forEach(entry=>{const loc={...entry,materiel:lotForm.materiel||[]};if(onNewEntry)onNewEntry(loc);entreeSauvegardee(loc);});
        const ids=liste.map(e=>e._id);
        window._pendingHighlight=ids;
        document.dispatchEvent(new CustomEvent('ateliers:highlight',{detail:{ids}}));
      };
      const reussir=(verifie)=>{appliquer(entries);showToast(`✅ ${entries.length} atelier(s) créé(s)`+(verifie?' — confirmé après vérification':''));onSaved(true);resetLot();};
      let res;
      try{ res=await apiFetch('saveMany',{entries}); }
      catch(err){
        // Réponse perdue : on vérifie en base avant d'annoncer un échec.
        if(await verifierEnregistres(entries.map(e=>e._id))){reussir(true);return;}
        throw err;
      }
      if(res.ok){reussir();return;}
      // L'API n'est pas transactionnelle (api/lib/ecriture.php, action_save_many) :
      // un refus peut ne toucher qu'une partie des dates, listées dans
      // « Erreurs batch: [{idx,error}] ». Les dates écrites s'affichent, celles
      // en échec restent dans le tableau pour être corrigées (repris de NextStep,
      // qui vidait le tableau, 26/09/2026).
      let echecs=null;
      try{const m=/Erreurs batch: (.+)/.exec(res.error||'');if(m)echecs=JSON.parse(m[1]).map(e=>e.idx);}catch(_){}
      if(!echecs||!echecs.length) throw Object.assign(new Error(res.error||'Erreur serveur'),{refus:true});
      const ecrites=entries.filter((_,i)=>!echecs.includes(i));
      if(ecrites.length) appliquer(ecrites);
      setLotRows(rowsFilled.filter((_,i)=>echecs.includes(i)));
      const dates=echecs.map(i=>fmtDate(entries[i]&&entries[i].date)||('#'+(i+1))).join(', ');
      setFormError(`${ecrites.length}/${entries.length} atelier(s) créé(s). Échec sur : ${dates} — ces dates restent dans le tableau.`);
      showToast(`⚠️ ${ecrites.length}/${entries.length} créé(s) — échec sur ${dates}`,false);
    }catch(err){showToast('❌ '+err.message+(err.refus?'':' — les dates ont peut-être été enregistrées quand même : recliquez sur Enregistrer, cela ne créera pas de doublon.'),false);}
    finally{setSaving(false);}
  }

  // ── champs communs (utilisés en mode unique ET en mode lot) ──
  const canToggle=!editId&&!isDup;

  // ── Couleur d'accent ─────────────────────────────────────
  const ac=accentColor||'#1e3a8a';
  const acLight=ac+'22';
  const acVars={'--ac':ac,'--ac-light':acLight};

  // ── Labels ───────────────────────────────────────────────
  const Lbl=({t,err})=>CE('span',{style:{fontSize:11,fontWeight:700,letterSpacing:'.08em',textTransform:'uppercase',color:err?'#e53e3e':ac,display:'block',marginBottom:6}},t);
  const LblG=({t})=>CE('span',{style:{fontSize:11,fontWeight:700,letterSpacing:'.08em',textTransform:'uppercase',color:'#94a3b8',display:'block',marginBottom:6}},t);

  // ── Style inputs ─────────────────────────────────────────
  const iStyle=(err)=>({width:'100%',padding:'11px 14px',border:`2px solid ${err?'#e53e3e':'#e2e8f0'}`,borderRadius:10,fontSize:14,color:'#1a202c',background:err?'#fff5f5':'#f8fafc',outline:'none',boxSizing:'border-box'});
  const sStyle=(err)=>({...iStyle(err),cursor:'pointer',appearance:'auto'});
  const nStyle=()=>({...iStyle(false),fontSize:18,fontWeight:700,textAlign:'center'});
  const taStyle=(err)=>({...iStyle(err),minHeight:84,resize:'vertical'});
  const secStyle={background:'#fff',borderRadius:14,padding:'18px 20px',marginBottom:12,boxShadow:'0 1px 4px rgba(0,0,0,.07)',borderTop:`3px solid ${ac}`};

  // ── Statut pills ─────────────────────────────────────────
  const SDOTS={'Planifié':'#3b82f6','Réalisé':'#22c55e','Annulé':'#ef4444','Reporté':'#f59e0b','Non réalisé':'#94a3b8'};
  const statutPills=CE('div',{style:secStyle},
    Lbl({t:'Statut *',err:!!errors.statut}),
    errors.statut&&CE('span',{style:{color:'#e53e3e',fontSize:11,fontWeight:600,display:'block',marginBottom:6}},errors.statut),
    CE('div',{style:{display:'flex',flexWrap:'wrap',gap:8}},
      statuts.map(s=>{
        const active=form.statut===s;
        return CE('button',{key:s,type:'button',
          style:{padding:'8px 16px',borderRadius:20,border:`2px solid ${active?ac:'#e2e8f0'}`,background:active?ac:'#fff',color:active?'#fff':'#718096',fontSize:13,fontWeight:600,cursor:'pointer',display:'flex',alignItems:'center',gap:6,transition:'all .18s'},
          onClick:()=>set('statut',s)},
          CE('span',{style:{width:7,height:7,borderRadius:'50%',background:active?'rgba(255,255,255,.7)':SDOTS[s]||'#94a3b8',display:'inline-block'}}),s);
      })
    )
  );

  // ── Champs communs (One Shot + Cycle) ─────────────────────
  // datesConflit : date(s) concernée(s) par ce formulaire (une seule en mode
  // unique, une par ligne en mode cycle) — sert uniquement à l'alerte
  // Classe mobile ci-dessous, purement informative (jamais bloquante).
  const champsCommuns=(frm,setFn,errs,entries_,datesConflit)=>{
    const matMobileActif=matIncludes(frm.materiel,'Classe mobile');
    const conflitsMat=matMobileActif&&datesConflit&&datesConflit.length
      ?[...new Set(datesConflit.filter(Boolean))].map(d=>({
          date:d,
          autres:(entries_||entries).filter(e=>e._id!==editId&&e.date===d&&e.statut!=='Annulé'&&e.conseiller&&e.conseiller!==frm.conseiller&&matIncludes(e.materiel,'Classe mobile'))
        })).filter(g=>g.autres.length>0)
      :[];
    return CE('div',null,
    CE('div',{style:{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}},
      CE('div',null,
        Lbl({t:'Orienteur *',err:!!errs.orienteur}),
        CE(ComboOrienteur,{value:frm.orienteur,onChange:v=>setFn('orienteur',v),entries:entries_,hasError:!!errs.orienteur}),
        errs.orienteur&&CE('span',{style:{color:'#e53e3e',fontSize:11,fontWeight:600}},errs.orienteur)),
      CE('div',null,
        Lbl({t:'Commune *',err:!!errs.commune}),
        CE(ComboCommune,{value:frm.commune,onChange:v=>setFn('commune',v),hasError:!!errs.commune}),
        errs.commune&&CE('span',{style:{color:'#e53e3e',fontSize:11,fontWeight:600}},errs.commune))
    ),
    CE('div',{style:{marginTop:12}},
      Lbl({t:'Lieu de l\'atelier *',err:!!errs.lieu}),
      CE('input',{type:'text',style:iStyle(errs.lieu),value:frm.lieu,placeholder:'Salle, médiathèque, établissement…',onChange:e=>setFn('lieu',e.target.value)}),
      errs.lieu&&CE('span',{style:{color:'#e53e3e',fontSize:11,fontWeight:600}},errs.lieu)
    ),
    CE('div',{style:{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:12,marginTop:12}},
      CE('div',null,
        Lbl({t:'Conseiller *',err:!!errs.conseiller}),
        CE('select',{style:sStyle(errs.conseiller),value:frm.conseiller,onChange:e=>setFn('conseiller',e.target.value)},
          CE('option',{value:'',disabled:true},'— Choisir —'),
          conseillers.map(c=>CE('option',{key:c,value:c},c))),
        errs.conseiller&&CE('span',{style:{color:'#e53e3e',fontSize:11,fontWeight:600}},errs.conseiller)),
      CE('div',null,
        LblG({t:'Co-animateur'}),
        CE('select',{style:sStyle(false),value:frm.co_animateur||'',onChange:e=>setFn('co_animateur',e.target.value)},
          CE('option',{value:''},'— Aucun —'),
          conseillers.filter(c=>c!==frm.conseiller).map(c=>CE('option',{key:c,value:c},c)))),
      CE('div',null,
        Lbl({t:'Type de public *',err:!!errs.public}),
        CE('select',{style:sStyle(errs.public),value:frm.public,onChange:e=>setFn('public',e.target.value)},
          CE('option',{value:'',disabled:true},'— Choisir —'),
          publics.map(p=>CE('option',{key:p,value:p},p))),
        errs.public&&CE('span',{style:{color:'#e53e3e',fontSize:11,fontWeight:600}},errs.public)),
      CE('div',null,
        LblG({t:'Résidence'}),
        CE('input',{type:'text',style:iStyle(false),value:frm.residence,placeholder:'Commune d\'origine',onChange:e=>setFn('residence',e.target.value)}))
    ),
    CE('div',{style:{marginTop:12}},
      LblG({t:'Matériel utilisé'}),
      CE('div',{style:{display:'flex',flexWrap:'wrap',gap:8}},
        filterMaterielsVisibles(materiels,MATERIELS_CACHES,frm.materiel).map(m=>{
          const chk=matIncludes(frm.materiel,m);
          return CE('label',{key:m,style:{display:'flex',alignItems:'center',gap:6,padding:'7px 12px',border:`2px solid ${chk?ac:'#e2e8f0'}`,borderRadius:20,cursor:'pointer',fontSize:12,fontWeight:600,color:chk?ac:'#718096',background:chk?acLight:'#fff',transition:'all .15s',userSelect:'none'},onClick:e=>{e.preventDefault();(modeLot?toggleLotMat:toggleMat)(m);}},
            CE('input',{type:'checkbox',checked:chk,style:{display:'none'},onChange:()=>{}}),m);
        })
      ),
      // Alerte purement informative (jamais bloquante) : Classe mobile est un
      // matériel physique unique, ne peut pas être à deux endroits le même
      // jour. Les Annulés et le conseiller lui-même sont exclus du calcul.
      conflitsMat.length>0&&CE('div',{style:{marginTop:8,display:'flex',flexDirection:'column',gap:4,background:'#fff7ed',border:'1px solid #fed7aa',borderRadius:8,padding:'8px 12px'}},
        conflitsMat.map(g=>CE('div',{key:g.date,style:{fontSize:12,color:'#9a3412',display:'flex',alignItems:'flex-start',gap:6}},
          CE('span',null,'⚠️'),
          CE('span',null,fmtDate(g.date)+' — Classe mobile déjà réservée par '+g.autres.map(e=>e.conseiller).join(', ')+' ce jour-là. Pour info, rien ne vous empêche d\'enregistrer.')
        ))
      )
    ),
    // Nombre d'ordinateurs prêtés + dates de prélèvement/retour : uniquement
    // pertinent si Classe mobile est cochée (les 10 ordinateurs du stock à
    // prêter aux participants, distincts du matériel "Ordinateur" du
    // conseiller lui-même). Le prélèvement peut précéder la date de
    // l'atelier (ex. retrait le mardi pour un atelier le vendredi) — sert
    // au calcul de findOrdinateursConflicts (periodePretMateriel).
    matMobileActif&&CE('div',{style:{marginTop:12,display:'grid',gridTemplateColumns:modeLot?'1fr':'1fr 1fr 1fr',gap:12}},
      CE('div',null,
        Lbl({t:'Ordinateurs prêtés *',err:!!errs.nb_ordinateurs}),
        CE('input',{type:'number',min:0,max:10,style:iStyle(errs.nb_ordinateurs),value:frm.nb_ordinateurs,placeholder:'Ex : 4',onChange:e=>setFn('nb_ordinateurs',e.target.value)}),
        errs.nb_ordinateurs&&CE('span',{style:{color:'#e53e3e',fontSize:11,fontWeight:600}},errs.nb_ordinateurs)),
      // En mode cycle, les dates de prélèvement/retour se saisissent par
      // séance (tableau ci-dessous) — une seule date partagée pour tout le
      // cycle n'aurait pas de sens (séances étalées sur plusieurs semaines).
      !modeLot&&CE('div',null,
        LblG({t:'Date de prélèvement ordi'}),
        CE('input',{type:'date',style:iStyle(false),value:frm.date_prelevement_materiel||'',onChange:e=>setFn('date_prelevement_materiel',e.target.value)})),
      !modeLot&&CE('div',null,
        LblG({t:'Date de retour ordi'}),
        CE('input',{type:'date',style:iStyle(false),value:frm.date_retour_materiel||'',onChange:e=>setFn('date_retour_materiel',e.target.value)}))
    ),
    modeLot&&matMobileActif&&CE('div',{style:{marginTop:4,fontSize:11,color:'#94a3b8'}},'Les dates de prélèvement/retour se saisissent par séance dans le tableau ci-dessous.'),
    CE('div',{style:{marginTop:12}},
      LblG({t:'Remarques'}),
      CE('input',{type:'text',style:iStyle(false),value:frm.remarques,placeholder:'Notes libres',onChange:e=>setFn('remarques',e.target.value)}))
  );};

  return CE('div',{'data-saisie':'1',style:{padding:'4px 0'}},
    // Badge conseiller coloré
    accentColor&&CE('div',{style:{display:'inline-flex',alignItems:'center',gap:8,padding:'6px 14px',borderRadius:20,fontSize:12,fontWeight:700,color:'#fff',background:ac,marginBottom:14}},
      editId?'✏️ Modifier':isDup?'📋 Duplication':modeLot?'🔄 Saisie par cycle':'⚡ Saisie One Shot'
    ),

    // Toggle One Shot / Cycle
    canToggle&&CE('div',{style:{display:'flex',gap:0,border:'1.5px solid #e2e8f0',borderRadius:8,overflow:'hidden',marginBottom:16,width:'fit-content'}},
      CE('button',{style:{padding:'8px 20px',background:!modeLot?ac:'#fff',border:'none',cursor:'pointer',fontSize:13,fontWeight:700,color:!modeLot?'#fff':'#718096',transition:'all .15s'},onClick:()=>{setModeLot(false);resetLot();}},'⚡ Saisie One Shot'),
      CE('button',{style:{padding:'8px 20px',background:modeLot?ac:'#fff',border:'none',cursor:'pointer',fontSize:13,fontWeight:700,color:modeLot?'#fff':'#718096',transition:'all .15s'},onClick:()=>{setModeLot(true);reset();}},'🔄 Saisie par cycle')
    ),

    isDup&&CE('div',{className:'dup-badge'},'📋 Duplication — vérifiez et complétez avant d\'enregistrer'),

    // ══════════════════════════════
    // MODE ONE SHOT
    // ══════════════════════════════
    !modeLot&&CE('div',null,
      // Statut pills
      statutPills,
      // Date / Horaire / AM-PM
      CE('div',{style:secStyle},
        CE('div',{style:{display:'grid',gridTemplateColumns:'1fr 1fr 80px',gap:12}},
          CE('div',null,
            Lbl({t:'Date *',err:!!errors.date}),
            CE('input',{type:'date',style:iStyle(errors.date),value:form.date,onChange:e=>set('date',e.target.value)}),
            errors.date&&CE('span',{style:{color:'#e53e3e',fontSize:11,fontWeight:600}},errors.date)),
          CE('div',null,
            Lbl({t:'Horaire *',err:!!errors.horaire}),
            CE('input',{type:'time',style:iStyle(errors.horaire),value:form.horaire,onChange:e=>set('horaire',e.target.value)}),
            errors.horaire&&CE('span',{style:{color:'#e53e3e',fontSize:11,fontWeight:600}},errors.horaire)),
          CE('div',null,
            Lbl({t:'AM/PM *',err:!!errors.ampm}),
            CE('select',{style:sStyle(errors.ampm),value:form.ampm,onChange:e=>set('ampm',e.target.value)},
              CE('option',{value:'',disabled:true},'—'),CE('option',{value:'AM'},'AM'),CE('option',{value:'PM'},'PM')),
            errors.ampm&&CE('span',{style:{color:'#e53e3e',fontSize:11,fontWeight:600}},errors.ampm))
        )
      ),
      // Champs communs
      CE('div',{style:secStyle},champsCommuns(form,set,errors,entries,[form.date])),
      // Thématique
      CE('div',{style:secStyle},
        Lbl({t:'Thématique *',err:!!errors.thematique}),
        CE(ComboThematique,{value:form.thematique,onChange:v=>set('thematique',v),entries:entries,hasError:!!errors.thematique}),
        errors.thematique&&CE('span',{style:{color:'#e53e3e',fontSize:11,fontWeight:600}},errors.thematique)
      ),
      // Inscrits / Présents
      CE('div',{style:secStyle},
        CE('div',{style:{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}},
          CE('div',null,
            Lbl({t:'Inscrits *',err:!!errors.inscrits}),
            CE('input',{type:'number',min:0,style:{...nStyle(),border:`2px solid ${errors.inscrits?'#e53e3e':'#e2e8f0'}`},value:form.inscrits,placeholder:'0',onChange:e=>set('inscrits',e.target.value)}),
            errors.inscrits&&CE('span',{style:{color:'#e53e3e',fontSize:11,fontWeight:600}},errors.inscrits)),
          CE('div',null,
            LblG({t:'Présents'}),
            CE('input',{type:'number',min:0,style:nStyle(),value:form.presents,placeholder:'0',onChange:e=>set('presents',e.target.value)}))
        )
      ),
      // Boutons
      formError&&CE('div',{style:{background:'#fff5f5',border:'2px solid #fc8181',borderRadius:10,padding:'10px 14px',marginBottom:10,color:'#c53030',fontSize:13,fontWeight:600,display:'flex',alignItems:'center',gap:8}},
        CE('span',{style:{fontSize:16}},'⚠️'),formError),
      CE('div',{style:{display:'flex',gap:12,marginTop:4}},
        CE('button',{style:{padding:'13px 28px',border:'none',borderRadius:12,cursor:saving?'not-allowed':'pointer',fontSize:14,fontWeight:700,color:'#fff',background:saving?'#94a3b8':ac,opacity:saving?.7:1,display:'flex',alignItems:'center',gap:8},onClick:handleSubmit,disabled:saving},
          saving?CE('span',null,CE('span',{className:'spinner'}),'Enregistrement…'):(editId?'💾 Modifier l\'atelier':'💾 Enregistrer l\'atelier')),
        CE('button',{style:{padding:'13px 24px',border:'2px solid #e2e8f0',borderRadius:12,cursor:'pointer',fontSize:14,fontWeight:600,color:'#718096',background:'#fff'},onClick:()=>{reset();setFormError('');}},isDup||editId?'✖ Annuler':'✖ Réinitialiser')
      )
    ),

    // ══════════════════════════════
    // MODE CYCLE — même design
    // ══════════════════════════════
    modeLot&&CE('div',null,
      CE('div',{style:{...secStyle,background:acLight,borderTop:`3px solid ${ac}`,display:'flex',alignItems:'center',gap:8,fontSize:13,fontWeight:700,color:ac}},
        '🔄 ',lotRows.length,' atelier(s) à créer — tous "Planifié"'
      ),
      // Champs communs
      CE('div',{style:secStyle},champsCommuns(lotForm,setLot,lotErrors,entries,lotRows.map(r=>r.date))),
      // Tableau des dates
      CE('div',{style:secStyle},
        CE('div',{style:{fontSize:13,fontWeight:700,color:ac,marginBottom:12}},'📅 Dates du cycle'),
        lotRows.map((row)=>{
          const rErr=lotRowErrors[row.id]||{};
          const hasErr=Object.values(rErr).some(v=>v);
          const brd=(err)=>`2px solid ${err?'#e53e3e':'#e2e8f0'}`;
          const bg=(err)=>err?'#fff5f5':'#f8fafc';
          const inp=(type,val,key,err,ph)=>CE('input',{type,value:val,placeholder:ph||'',onChange:e=>setRow(row.id,key,e.target.value),style:{width:'100%',padding:'8px 10px',border:brd(err),borderRadius:8,fontSize:12,background:bg(err),outline:'none',boxSizing:'border-box'}});
          const lbl=(t,err)=>CE('span',{style:{fontSize:10,fontWeight:700,color:err?'#e53e3e':'#718096',textTransform:'uppercase',letterSpacing:'.06em',display:'block',marginBottom:3}},t);
          return CE('div',{key:row.id,style:{borderRadius:10,border:`1.5px solid ${hasErr?'#fc8181':acLight}`,marginBottom:6,background:hasErr?'#fff5f5':acLight,position:'relative'}},
            // Ligne 1 : Date + Horaire + AM/PM + Supprimer
            CE('div',{style:{display:'grid',gridTemplateColumns:'1fr 1fr auto 32px',gap:8,alignItems:'end',padding:'9px 10px 8px'}},
              CE('div',null,lbl('Date *',rErr.date),inp('date',row.date,'date',rErr.date)),
              CE('div',null,lbl('Horaire *',rErr.horaire),inp('time',row.horaire,'horaire',rErr.horaire)),
              CE('div',null,lbl('AM/PM',rErr.ampm),
                CE('select',{value:row.ampm,onChange:e=>setRow(row.id,'ampm',e.target.value),style:{padding:'8px 6px',border:brd(rErr.ampm),borderRadius:8,fontSize:12,background:bg(rErr.ampm)}},
                  CE('option',{value:'',disabled:true},'—'),CE('option',{value:'AM'},'AM'),CE('option',{value:'PM'},'PM'))),
              CE('button',{onClick:()=>removeRow(row.id),disabled:lotRows.length===1,style:{background:'none',border:`1px solid ${acLight}`,borderRadius:6,color:'#9b2c2c',cursor:'pointer',fontSize:15,height:32,width:32,display:'flex',alignItems:'center',justifyContent:'center',alignSelf:'end'}},'×')
            ),
            // Ligne 2 : Thématique pleine largeur
            CE('div',{style:{padding:'0 10px 8px'}},
              lbl('Thématique *',rErr.thematique),
              CE(ComboThematiqueFixed,{value:row.thematique,onChange:v=>setRow(row.id,'thematique',v),entries:entries,hasError:!!rErr.thematique})
            ),
            // Ligne 3 : Inscrits + Présents
            CE('div',{style:{display:'flex',gap:8,padding:'0 10px 9px',borderTop:`1px solid ${acLight}`}},
              CE('div',{style:{flex:1}},
                lbl('Inscrits *',rErr.inscrits),
                CE('input',{type:'number',min:0,value:row.inscrits,placeholder:'—',onChange:e=>setRow(row.id,'inscrits',e.target.value),style:{width:'100%',padding:'7px 10px',border:brd(rErr.inscrits),borderRadius:8,fontSize:13,fontWeight:700,textAlign:'center',background:bg(rErr.inscrits),outline:'none',boxSizing:'border-box'}})
              ),
              CE('div',{style:{flex:1}},
                lbl('Présents',false),
                CE('input',{type:'number',min:0,value:row.presents,placeholder:'—',onChange:e=>setRow(row.id,'presents',e.target.value),style:{width:'100%',padding:'7px 10px',border:brd(false),borderRadius:8,fontSize:13,fontWeight:700,textAlign:'center',background:'#f8fafc',outline:'none',boxSizing:'border-box'}})
              )
            ),
            // Ligne 4 : Dates de prélèvement/retour matériel — uniquement si
            // Classe mobile est cochée (champ commun du cycle), par séance
            // car chaque date de ce tableau emprunte et rend le matériel à
            // son propre rythme (le prélèvement peut précéder la date de
            // cette séance).
            matIncludes(lotForm.materiel,'Classe mobile')&&CE('div',{style:{display:'flex',gap:8,padding:'0 10px 9px',borderTop:`1px solid ${acLight}`}},
              CE('div',{style:{flex:1}},
                lbl('Prélèvement ordi',false),
                inp('date',row.date_prelevement_materiel,'date_prelevement_materiel',false)
              ),
              CE('div',{style:{flex:1}},
                lbl('Retour ordi',false),
                inp('date',row.date_retour_materiel,'date_retour_materiel',false)
              )
            )
          );
        }),
        CE('button',{onClick:addRow,style:{display:'flex',alignItems:'center',justifyContent:'center',gap:6,padding:10,background:'#fff',border:`2px dashed ${ac}`,borderRadius:10,cursor:'pointer',fontSize:13,color:ac,fontWeight:700,width:'100%',marginTop:6}},'＋ Ajouter une date')
      ),
      // Boutons
      formError&&CE('div',{style:{background:'#fff5f5',border:'2px solid #fc8181',borderRadius:10,padding:'10px 14px',marginBottom:10,color:'#c53030',fontSize:13,fontWeight:600,display:'flex',alignItems:'center',gap:8}},
        CE('span',{style:{fontSize:16}},'⚠️'),formError),
      CE('div',{style:{display:'flex',gap:12,marginTop:4}},
        CE('button',{style:{padding:'13px 28px',border:'none',borderRadius:12,cursor:saving?'not-allowed':'pointer',fontSize:14,fontWeight:700,color:'#fff',background:saving?'#94a3b8':ac,opacity:saving?.7:1,display:'flex',alignItems:'center',gap:8},onClick:handleSubmitLot,disabled:saving},
          saving?CE('span',null,CE('span',{className:'spinner'}),'Création…'):`💾 Créer ${lotRows.length} atelier(s)`),
        CE('button',{style:{padding:'13px 24px',border:'2px solid #e2e8f0',borderRadius:12,cursor:'pointer',fontSize:14,fontWeight:600,color:'#718096',background:'#fff'},onClick:()=>{resetLot();setFormError('');}}, '✖ Réinitialiser')
      )
    )
  );
}

// ═══════════════════════════════════════════════════════════
// VUE HISTORIQUE — v9.0 : duplication + flux de clôture
// ═══════════════════════════════════════════════════════════
function VueHistorique({entries,onEdit,onDelete,onRefresh,onDuplicate,initConseiller,onResetConseiller,canDelete,onChangeConseiller}){
  const[search,setSearch]=React.useState('');
  const[dSearch,setDSearch]=React.useState('');
  const[filtStatut,setFiltStatut]=React.useState('Planifié');
  const[filtMois,setFiltMois]=React.useState('Tous');
  const[filtCommune,setFiltCommune]=React.useState('Toutes');
  const[filtConseiller,setFiltConseiller]=React.useState(initConseiller||'Tous');
  // Plusieurs publics sélectionnables (26/09/2026) : [] = tous.
  const[filtPublic,setFiltPublic]=React.useState([]);
  const basculerPublic=p=>setFiltPublic(l=>l.includes(p)?l.filter(x=>x!==p):[...l,p]);
  const[sortDir,setSortDir]=React.useState(1);
  const[dateFrom,setDateFrom]=React.useState('');
  const[dateTo,setDateTo]=React.useState('');
  const[panel,setPanel]=React.useState(null);
  const[panelStatut,setPanelStatut]=React.useState('');
  const[panelInscrits,setPanelInscrits]=React.useState('');
  const[panelPresents,setPanelPresents]=React.useState('');
  const[panelThematique,setPanelThematique]=React.useState('');const[panelDate,setPanelDate]=React.useState('');const[panelHoraire,setPanelHoraire]=React.useState('');const[panelNbOrdi,setPanelNbOrdi]=React.useState('');const[panelPublic,setPanelPublic]=React.useState('');const[panelMobile,setPanelMobile]=React.useState(false);const[panelPrelev,setPanelPrelev]=React.useState('');const[panelRetour,setPanelRetour]=React.useState('');
  const[panelNote,setPanelNote]=React.useState('');
  const[saving,setSaving]=React.useState(false);
  const[confirmDel,setConfirmDel]=React.useState(null);
  const[suppressionEnCours,setSuppressionEnCours]=React.useState(false);

  React.useEffect(()=>{if(initConseiller)setFiltConseiller(initConseiller);},[initConseiller]);
  React.useEffect(()=>{const t=setTimeout(()=>setDSearch(search),300);return()=>clearTimeout(t);},[search]);
  React.useEffect(()=>{
    window._filterNewEntries=(ids)=>{setFiltStatut('Tous');setFiltMois('Tous');setFiltCommune('Toutes');setFiltConseiller('Tous');setFiltPublic([]);setDateFrom('');setDateTo('');setSearch('');setDSearch('');window._newIdsFilter=new Set(ids);};
    return()=>{window._filterNewEntries=null;};
  },[]);
  // Applique le filtre de mise en évidence après rechargement post-sauvegarde
  React.useEffect(()=>{
    if(!window._pendingHighlight||!window._pendingHighlight.length||!entries.length)return;
    const ids=window._pendingHighlight;
    const found=ids.some(id=>entries.find(e=>e._id===id));
    if(!found)return;
    window._pendingHighlight=null;
    setFiltStatut('Tous');setFiltMois('Tous');setFiltCommune('Toutes');
    setFiltConseiller('Tous');setFiltPublic([]);setDateFrom('');setDateTo('');
    setSearch('');setDSearch('');
    window._newIdsFilter=new Set(ids);
  },[entries]);

  const moisDispo=React.useMemo(()=>{const s=new Set(entries.map(e=>e.date?e.date.slice(0,7):'').filter(Boolean));return[...s].sort();},[entries]);
  const conseillersHist=React.useMemo(()=>{const s=new Set();entries.forEach(e=>{if(e.conseiller)s.add(e.conseiller);});return[...Array.from(s).sort()];},[entries]);
  const CHIP_STATUTS=[{key:'Tous',label:'Tous',cls:'chip-all'},{key:'Planifié',label:'Planifié',cls:'chip-planifie',dot:'#3b82f6'},{key:'Réalisé',label:'Réalisé',cls:'chip-realise',dot:'#22c55e'},{key:'Annulé',label:'Annulé',cls:'chip-annule',dot:'#ef4444'},{key:'Reporté',label:'Reporté',cls:'chip-reporte',dot:'#f59e0b'},{key:'Non réalisé',label:'Non réalisé',cls:'chip-nonrealise',dot:'#94a3b8'}];
  const counts=React.useMemo(()=>{const c={Tous:entries.length};STATUTS.forEach(s=>{c[s]=entries.filter(e=>e.statut===s).length;});return c;},[entries]);
  // Tous les filtres sauf le statut : base des tuiles (kpiHistorique).
  const sansStatut=React.useMemo(()=>{
    let r=entries;
    if(filtMois!=='Tous')r=r.filter(e=>e.date&&e.date.startsWith(filtMois));
    if(filtCommune!=='Toutes'){const normFilt=filtCommune.replace(/\s*\(\d+\)\s*/g,'').trim().toUpperCase();r=r.filter(e=>e.commune===filtCommune||e.commune.replace(/\s*\(\d+\)\s*/g,'').trim().toUpperCase()===normFilt);}
    if(filtConseiller!=='Tous')r=r.filter(e=>e.conseiller===filtConseiller);
    if(filtPublic.length)r=r.filter(e=>filtPublic.includes(e.public||'Tous publics'));
    if(dateFrom)r=r.filter(e=>e.date>=dateFrom);
    if(dateTo)r=r.filter(e=>e.date<=dateTo);
    if(dSearch){const q=stripAccents(dSearch);r=r.filter(e=>[e.lieu,e.thematique,e.orienteur,e.commune,e.public,e.remarques].some(v=>stripAccents(String(v||'')).includes(q)));}
    // Filtre de mise en évidence post-enregistrement. Si aucun des ateliers
    // mis en évidence n'existe plus (supprimé juste après), il ne montrerait
    // que « 0 sur N » : on l'abandonne (constaté le 23/09/2026).
    if(window._newIdsFilter&&window._newIdsFilter.size>0){
      if(entries.some(e=>window._newIdsFilter.has(e._id)))r=r.filter(e=>window._newIdsFilter.has(e._id));
      else window._newIdsFilter=null;
    }
    return r;
  },[entries,filtMois,filtCommune,filtConseiller,filtPublic,dSearch,dateFrom,dateTo]);
  const filtered=React.useMemo(()=>[...(filtStatut!=='Tous'?sansStatut.filter(e=>e.statut===filtStatut):sansStatut)].sort((a,b)=>comparerHistorique(a,b,sortDir)),[sansStatut,filtStatut,sortDir]);

  const kpi=React.useMemo(()=>kpiHistorique(sansStatut),[sansStatut]);
  const nRetard=entries.filter(e=>isRetard(e)&&(filtConseiller==='Tous'||e.conseiller===filtConseiller)).length;

  function openPanel(e){setPanel(e);setPanelStatut(e.statut);setPanelInscrits(e.inscrits===undefined||e.inscrits===''?'':String(e.inscrits));setPanelPresents(e.presents===undefined||e.presents===''?'':String(e.presents));setPanelThematique(e.thematique||'');setPanelNote(e.remarques||'');setPanelDate(normalizeDate(e.date)||'');setPanelHoraire(normalizeHoraire(e.horaire)||'');setPanelNbOrdi(e.nb_ordinateurs===undefined||e.nb_ordinateurs===''||e.nb_ordinateurs===null?'':String(e.nb_ordinateurs));setPanelPublic(e.public||'');setPanelMobile(matIncludes(e.materiel,'Classe mobile'));setPanelPrelev(normalizeDate(e.date_prelevement_materiel)||'');setPanelRetour(normalizeDate(e.date_retour_materiel)||'');}
  function closePanel(){setPanel(null);}

  async function savePanel(){
    if(!panel)return;if(!panelDate){showToast('❌ Date requise',false);return;}if(panelMobile&&!(parseInt(panelNbOrdi)>0)){showToast('❌ Ordinateurs prêtés requis avec la Classe mobile',false);return;}setSaving(true);
    try{
      const updated={...panel,statut:panelStatut,inscrits:panelInscrits===''?'':parseInt(panelInscrits)||0,presents:panelPresents===''?'':parseInt(panelPresents)||0,thematique:panelThematique,date:panelDate,horaire:panelHoraire,ampm:panelHoraire!==(normalizeHoraire(panel.horaire)||'')?(ampmDepuisHoraire(panelHoraire)||panel.ampm):panel.ampm,public:panelPublic,materiel:matierePanneau(panel,panelMobile),nb_ordinateurs:panelMobile?(panelNbOrdi===''?'':parseInt(panelNbOrdi)||0):'',date_prelevement_materiel:panelMobile?panelPrelev:'',date_retour_materiel:panelMobile?panelRetour:'',remarques:panelNote};
      const res=await apiFetch('saveEntry',{entry:updated});
      if(!res.ok)throw new Error(res.error);
      showToast('✅ Mis à jour');closePanel();entreeSauvegardee(updated, onRefresh);
    }catch(err){showToast('❌ '+err.message,false);}
    finally{setSaving(false);}
  }

  function resetFiltres(){setSearch('');setDSearch('');setFiltStatut('Planifié');setFiltMois('Tous');setFiltCommune('Toutes');setFiltConseiller('Tous');setFiltPublic([]);setDateFrom('');setDateTo('');window._newIdsFilter=null;if(onResetConseiller)onResetConseiller();}

  function exportXLSX(){
    const rows=[['N°','Statut','Date','Horaire','Commune','Lieu','Thématique','Inscrits','Présents','Public','Conseiller','Orienteur','Matériel','Résidence','Remarques']];
    filtered.forEach(e=>rows.push([e._n,e.statut,fmtDate(e.date),e.horaire,normCommune(e.commune),e.lieu,e.thematique,e.inscrits,e.presents,e.public,e.conseiller,e.orienteur,(e.materiel||[]).join(', '),e.residence,e.remarques]));
    const wb=XLSX.utils.book_new();XLSX.utils.book_append_sheet(wb,XLSX.utils.aoa_to_sheet(rows),'Ateliers');
    XLSX.writeFile(wb,`ateliers_cd47_${new Date().toISOString().slice(0,10)}.xlsx`);
  }

  function exportICS(){
    function _escICS(s){return String(s||'').replace(/\\/g,'\\\\').replace(/;/g,'\\;').replace(/,/g,'\\,').replace(/\n/g,'\\n');}
    function _foldICS(l){if(l.length<=75)return l;const c=[l.slice(0,75)];let i=75;while(i<l.length){c.push(' '+l.slice(i,i+74));i+=74;}return c.join('\r\n');}
    function _parseH(h){const s=String(h||'09H00').toUpperCase().replace('H',':');const p=s.split(':');return{hh:String(parseInt(p[0]||9,10)).padStart(2,'0'),mm:String(parseInt(p[1]||0,10)).padStart(2,'0')};}
    function _buildICS(evts){
      const out=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Ateliers Numerique 47//FR','CALSCALE:GREGORIAN','METHOD:PUBLISH'];
      for(const e of evts){
        const m=String(e.date||'').match(/^(\d{4})-(\d{2})-(\d{2})/);if(!m)continue;
        const[,y,mo,j]=m;const{hh,mm}=_parseH(e.horaire);const startH=parseInt(hh,10);
        const dts=`${y}${mo}${j}T${hh}${mm}00`;
        let dte;if(startH<23){dte=`${y}${mo}${j}T${String(startH+1).padStart(2,'0')}${mm}00`;}else{const nx=new Date(parseInt(y),parseInt(mo)-1,parseInt(j)+1);dte=`${nx.getFullYear()}${String(nx.getMonth()+1).padStart(2,'0')}${String(nx.getDate()).padStart(2,'0')}T000000`;}
        const summary=_escICS([e.thematique,e.commune].filter(Boolean).join(' | '));
        const location=_escICS([e.lieu,e.commune].filter(Boolean).join(', '));
        const desc=[e.conseiller&&'Conseiller : '+e.conseiller,e.orienteur&&'Orienteur : '+e.orienteur,e.statut&&'Statut : '+e.statut,e.public&&'Public : '+e.public,(e.inscrits!==''&&e.inscrits!=null)&&'Inscrits : '+e.inscrits,(e.presents!==''&&e.presents!=null)&&'Présents : '+e.presents,e.remarques&&'Remarques : '+e.remarques].filter(Boolean);
        out.push('BEGIN:VEVENT','DTSTART:'+dts,'DTEND:'+dte,'SUMMARY:'+summary);
        if(location)out.push('LOCATION:'+location);
        if(desc.length)out.push('DESCRIPTION:'+_escICS(desc.join('\n')));
        out.push('UID:'+e._id+'@ateliers-cd47','END:VEVENT');
      }
      out.push('END:VCALENDAR');return out.map(_foldICS).join('\r\n');
    }
    const icsStr=_buildICS(filtered);
    const fname=`ateliers_cd47_${new Date().toISOString().slice(0,10)}.ics`;
    // data: URI — fonctionne sur mobile (Android/iOS) contrairement à createObjectURL+click
    const uri='data:text/calendar;charset=utf-8,'+encodeURIComponent(icsStr);
    const a=document.createElement('a');
    a.href=uri;a.download=fname;a.style.display='none';
    document.body.appendChild(a);a.click();
    setTimeout(()=>document.body.removeChild(a),200);
  }

  const hexToRgba=(hex,a)=>{const r=parseInt(hex.slice(1,3),16),g=parseInt(hex.slice(3,5),16),b=parseInt(hex.slice(5,7),16);return`rgba(${r},${g},${b},${a})`;};
  const BORDER_COLOR={'Planifié':'#3b82f6','Réalisé':'#22c55e','Annulé':'#ef4444','Reporté':'#f59e0b','Non réalisé':'#94a3b8'};

  // v9.0 : clôture rapide — preset statuts finaux
  // CLOTURE_PRESETS : défini globalement dans shared.js

  return CE('div',null,
    // KPIs
    CE('div',{className:'kpi-row kpi-histo'},
      CE(FadeItem,{delay:0,style:{minWidth:0}},CE('div',{className:'kpi-mini',style:{borderLeft:'3px solid #1e3a8a',background:'#f0f4ff'}},CE('div',{className:'v',style:{color:'#1e3a8a'}},kpi.total),CE('div',{className:'l'},'Total'))),
      CE(FadeItem,{delay:0.06,style:{minWidth:0}},CE('div',{className:'kpi-mini',style:{borderLeft:'3px solid #2563eb',background:'#eff6ff'}},CE('div',{className:'v',style:{color:'#2563eb'}},kpi.planifies),CE('div',{className:'l'},'Planifiés'),CE('div',{className:'p',style:{color:'#2563eb'}},kpi.total?kpi.pct.planifies+'%':'-'))),
      CE(FadeItem,{delay:0.12,style:{minWidth:0}},CE('div',{className:'kpi-mini',style:{borderLeft:'3px solid #16a34a',background:'#f0fdf4'}},CE('div',{className:'v',style:{color:'#166534'}},kpi.realises),CE('div',{className:'l'},'Réalisés'),CE('div',{className:'p',style:{color:'#166534'}},kpi.total?kpi.pct.realises+'%':'-'))),
      CE(FadeItem,{delay:0.18,style:{minWidth:0}},CE('div',{className:'kpi-mini',style:{borderLeft:'3px solid #dc2626',background:'#fff5f5'}},CE('div',{className:'v',style:{color:'#991b1b'}},kpi.annules),CE('div',{className:'l'},'Annulés'),CE('div',{className:'p',style:{color:'#991b1b'}},kpi.total?kpi.pct.annules+'%':'-'))),
      CE(FadeItem,{delay:0.24,style:{minWidth:0}},CE('div',{className:'kpi-mini',style:{borderLeft:'3px solid #94a3b8',background:'#f8fafc'},title:'Reportés et non réalisés'},CE('div',{className:'v',style:{color:'#475569'}},kpi.autres),CE('div',{className:'l'},'Autres'),CE('div',{className:'p',style:{color:'#475569'}},kpi.total?kpi.pct.autres+'%':'-'))),
      CE(FadeItem,{delay:0.3,style:{minWidth:0}},CE('div',{className:'kpi-mini',style:{borderLeft:'3px solid #d97706',background:'#fffbeb'},title:'Présents / inscrits des ateliers réalisés'},CE('div',{className:'v',style:{color:'#d97706'}},kpi.presents+'/'+kpi.inscrits),CE('div',{className:'l'},'Présents'),CE('div',{className:'p',style:{color:'#d97706'}},kpi.inscrits?kpi.tx+'%':'-')))
    ),
    // Alerte retards
    nRetard>0&&CE('div',{style:{background:'#fffbeb',border:'1px solid #fcd34d',borderRadius:10,padding:'10px 14px',marginBottom:10,display:'flex',gap:10,alignItems:'center'}},
      CE('span',{style:{fontSize:20}},'⚠️'),
      CE('div',null,
        CE('div',{style:{fontWeight:700,color:'#92400e',fontSize:13}},`${nRetard} atelier(s) en attente de mise à jour`),
        CE('div',{style:{fontSize:12,color:'#b45309'}},'Statut "Planifié" mais date déjà passée — cliquez sur un atelier pour le clôturer rapidement')
      )
    ),
    // Filtre conseiller (frontend)
    // Bandeau lié au filtre réel, pas au conseiller de départ : sinon « Voir
    // tous » vidait le filtre mais laissait le bandeau (26/09/2026).
    filtConseiller!=='Tous'&&CE('div',{className:'filtre-banner'},
      CE('span',null,'👤 Affichage filtré : ',CE('strong',null,filtConseiller)),
      CE('button',{onClick:resetFiltres},'Voir tous')
    ),
    // Filtres
    CE('div',{className:'card',style:{marginBottom:10}},
      CE('div',{style:{fontSize:11,fontWeight:700,color:'#718096',letterSpacing:'.06em',marginBottom:6}},'STATUT'),
      CE('div',{className:'chip-bar'},
        CHIP_STATUTS.map(c=>CE('button',{key:c.key,className:`chip ${c.cls}${filtStatut===c.key?' active':''}`,onClick:()=>setFiltStatut(c.key)},
          c.dot&&CE('span',{className:'chip-dot',style:{background:c.dot}}),c.label,' ',CE('span',{style:{opacity:.7,fontSize:11}},'('+counts[c.key]+')')))
      ),
      CE('hr',{style:{border:'none',borderTop:'1px solid #f0f4f8',margin:'10px 0'}}),
      CE('div',{style:{display:'flex',gap:8,flexWrap:'wrap',alignItems:'center'}},
        CE('input',{type:'text',value:search,placeholder:'🔍 Recherche…',style:{flex:'1 1 160px',padding:'6px 10px',border:'1.5px solid #e2e8f0',borderRadius:6,fontSize:13},onChange:e=>setSearch(e.target.value)}),
        CE('select',{style:{padding:'6px 8px',border:'1.5px solid #e2e8f0',borderRadius:6,fontSize:12},value:filtMois,onChange:e=>setFiltMois(e.target.value)},
          CE('option',{value:'Tous'},'Tous les mois'),moisDispo.map(m=>CE('option',{key:m,value:m},m))),
        CE('select',{style:{padding:'6px 8px',border:'1.5px solid #e2e8f0',borderRadius:6,fontSize:12},value:filtCommune,onChange:e=>setFiltCommune(e.target.value)},
          CE('option',{value:'Toutes'},'Toutes communes'),
          [...new Set(entries.map(e=>e.commune).filter(Boolean))].sort((a,b)=>a.localeCompare(b)).map(c=>CE('option',{key:c,value:c},c))),
        CE('div',{className:'chip-bar',style:{marginBottom:0}},
          CE('span',{className:'chip chip-all'+(filtConseiller==='Tous'?' active':''),onClick:()=>{setFiltConseiller('Tous');if(onChangeConseiller)onChangeConseiller('Tous');}},
            CE('span',{className:'chip-dot'}),'Tous'),
          conseillersHist.map(c=>CE('span',{key:c,className:'chip'+(filtConseiller===c?' active':''),style:{color:conseillerColor(c)},onClick:()=>{const nv=filtConseiller===c?'Tous':c;setFiltConseiller(nv);if(onChangeConseiller)onChangeConseiller(nv);}},
            CE('span',{className:'chip-dot',style:{background:conseillerColor(c)}}),c))),
        CE('div',{className:'chip-bar',style:{marginBottom:0}},
          CE('span',{className:'chip chip-all'+(filtPublic.length===0?' active':''),onClick:()=>setFiltPublic([]),title:'Retirer le filtre de public'},'Tout afficher'),
          PUBLICS.map(p=>CE('span',{key:p,className:'chip'+(filtPublic.includes(p)?' active':''),onClick:()=>basculerPublic(p)},p)))
      ),
      CE('div',{style:{display:'flex',gap:8,flexWrap:'wrap',alignItems:'center',marginTop:8}},
        CE('div',{style:{display:'flex',alignItems:'center',gap:4}},
          CE('span',{style:{fontSize:11,fontWeight:700,color:'#718096',whiteSpace:'nowrap'}},'Du'),
          CE('input',{type:'date',value:dateFrom,onChange:e=>setDateFrom(e.target.value),style:{padding:'6px 8px',border:'1.5px solid #e2e8f0',borderRadius:6,fontSize:12}}),
          CE('span',{style:{fontSize:11,fontWeight:700,color:'#718096',whiteSpace:'nowrap'}},'Au'),
          CE('input',{type:'date',value:dateTo,onChange:e=>setDateTo(e.target.value),style:{padding:'6px 8px',border:'1.5px solid #e2e8f0',borderRadius:6,fontSize:12}})
        ),
        CE('button',{className:'btn btn-secondary btn-sm',onClick:()=>setSortDir(d=>-d)},sortDir===1?'↑ Date':'↓ Date'),
        CE('button',{className:'btn btn-secondary btn-sm',onClick:exportXLSX},'📥 XLSX'),
        CE('button',{className:'btn btn-secondary btn-sm',onClick:exportICS},'📅 ICS'),
        CE('button',{className:'btn btn-secondary btn-sm',onClick:onRefresh},'🔄 Sync'),
        CE('button',{className:'btn btn-secondary btn-sm',onClick:resetFiltres},'✖ Réinitialiser')
      ),
      CE('div',{style:{fontSize:11,color:'#718096',marginTop:8}},`${filtered.length} atelier(s) affiché(s) sur ${entries.length}`)
    ),
    // Liste des ateliers
    filtered.length===0&&CE('div',{style:{textAlign:'center',padding:'40px 0',color:'#94a3b8',fontSize:14}},
      CE('div',{style:{fontSize:32,marginBottom:8}},'📭'),
      entries.length===0?'Aucun atelier enregistré pour cette année.':'Aucun atelier ne correspond aux filtres sélectionnés.'
    ),
    CE('div',{className:'atelier-list'},filtered.map((e,ei)=>{
      const d=fmtCardDate(e.date);const retard=isRetard(e);const cColor=conseillerColor(e.conseiller);
      return CE(FadeItem,{key:e._id,delay:Math.min(ei*0.05,0.5)},CE('div',{className:'atelier-card',style:{background:retard?'#fffbeb':hexToRgba(cColor,0.04),borderLeft:'none'},onClick:()=>openPanel(e)},
        CE('div',{className:'atelier-card-border',style:{background:cColor}}),
        CE('div',{className:'atelier-card-date',style:{background:hexToRgba(cColor,0.08),borderRight:`1px solid ${hexToRgba(cColor,0.2)}`}},
          CE('div',{className:'atelier-card-day'},d.day),CE('div',{className:'atelier-card-month'},d.month),
          CE('div',{className:'atelier-card-jour'},d.jour),CE('div',{className:'atelier-card-time'},e.horaire)
        ),
        CE('div',{className:'atelier-card-body'},
          CE('div',{className:'atelier-card-badges'},
            badgePill(e.statut,retard),
            e.orienteur&&CE('span',{style:{fontSize:11,color:'#718096',fontStyle:'italic',alignSelf:'center'}},e.orienteur),
            CE('span',{className:'badge-pill bp-public'},e.public||'Tous publics')
          ),
          CE('div',{className:'atelier-card-conseiller',style:{color:cColor}},e.conseiller),
          CE('div',{className:'atelier-card-title'},e.thematique),
          CE('div',{className:'atelier-card-sub'},e.commune,' — ',e.lieu,(e.inscrits||e.presents)?CE('span',null,' · ',e.presents||0,'/',e.inscrits||0,' présents'):null)
        ),
        CE('div',{className:'atelier-card-arrow'},'›')
      ));
    })),
    // Side panel overlay
    panel&&CE('div',{className:'side-panel-overlay',onClick:closePanel}),
    CE('div',{className:'side-panel'+(panel?' open':'')},
      panel&&CE(React.Fragment,null,
        CE('div',{className:'side-panel-header'},
          CE('h3',null,'Détail / Mise à jour'),
          CE('button',{onClick:closePanel,style:{background:'none',border:'none',fontSize:18,cursor:'pointer',color:'#718096'}},'✕')
        ),
        CE('div',{className:'side-panel-body'},
          // v9.0 : Flux de clôture rapide — toujours visible
          CE('div',{className:'cloture-banner',style:{background:isRetard(panel)?'#fffbeb':'#f0f4ff',borderColor:isRetard(panel)?'#fcd34d':'#bfdbfe'}},
            CE('div',{className:'cloture-title',style:{color:isRetard(panel)?'#92400e':'#1e3a8a'}},isRetard(panel)?'⚠️ Atelier passé — à clôturer':'⚡ Changement rapide de statut'),
            CE('div',{className:'cloture-btns'},
              CLOTURE_PRESETS.map(p=>CE('button',{key:p.statut,className:'cloture-btn',style:{background:p.bg,color:p.color,outline:panelStatut===p.statut?'2px solid #1e3a8a':'none'},onClick:()=>setPanelStatut(p.statut)},p.label))
            )
          ),
          CE('div',{style:{fontSize:13,fontWeight:700,color:'#1a202c',marginBottom:8}},panel.thematique),
          CE('div',{className:'sp-info-row'},CE('span',null,'Commune'),CE('span',null,panel.commune)),
          CE('div',{className:'sp-info-row'},CE('span',null,'Lieu'),CE('span',null,panel.lieu)),
          panel.orienteur&&CE('div',{className:'sp-info-row'},CE('span',null,'Orienteur'),CE('span',null,panel.orienteur)),
          CE('div',{className:'sp-info-row'},CE('span',null,'Conseiller'),CE('span',{style:{color:conseillerColor(panel.conseiller),fontWeight:700}},panel.conseiller)),panel.co_animateur&&CE('div',{className:'sp-info-row'},CE('span',null,'Co-animateur'),CE('span',{style:{color:conseillerColor(panel.co_animateur),fontWeight:700}},panel.co_animateur)),
          panel.materiel&&panel.materiel.length>0&&CE('div',{style:{marginTop:10,marginBottom:4}},
            CE('div',{style:{fontSize:11,fontWeight:700,color:'#718096',marginBottom:4}},'MATÉRIEL'),
            panel.materiel.map(m=>CE('span',{key:m,className:'mat-chip'},m))
          ),
          CE('hr',{style:{border:'none',borderTop:'1px solid #e2e8f0',margin:'12px 0'}}),
          CE('div',{className:'sp-field'},CE('label',null,'Statut *'),
            CE('select',{value:panelStatut,onChange:e=>setPanelStatut(e.target.value),style:{width:'100%',padding:'8px 10px',border:'1.5px solid #e2e8f0',borderRadius:6,fontSize:13}},
              STATUTS.map(s=>CE('option',{key:s,value:s},s)))),
          CE('div',{className:'sp-field'},CE('label',null,"Nombre d'inscrits"),
            CE('input',{type:'number',min:0,value:panelInscrits,onChange:e=>setPanelInscrits(e.target.value),style:{width:'100%',padding:'8px 10px',border:'1.5px solid #e2e8f0',borderRadius:6,fontSize:13},placeholder:'0'})),
          CE('div',{className:'sp-field'},CE('label',null,'Nombre de présents'),
            CE('input',{type:'number',min:0,value:panelPresents,onChange:e=>setPanelPresents(e.target.value),style:{width:'100%',padding:'8px 10px',border:'1.5px solid #e2e8f0',borderRadius:6,fontSize:13},placeholder:'0'})),
          // Modifiables ici depuis le 26/09/2026 (demande de l'utilisateur) :
          // date, horaire (AM/PM recalculé s'il change), public, ordinateurs ;
          // thématique en auto-proposition comme dans le formulaire.
          CE('div',{style:{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8}},
            CE('div',{className:'sp-field'},CE('label',null,'Date *'),
              CE('input',{type:'date',value:panelDate,onChange:e=>setPanelDate(e.target.value),style:{width:'100%',padding:'8px 10px',border:'1.5px solid #e2e8f0',borderRadius:6,fontSize:13}})),
            CE('div',{className:'sp-field'},CE('label',null,'Horaire'),
              CE('input',{type:'time',value:panelHoraire,onChange:e=>setPanelHoraire(e.target.value),style:{width:'100%',padding:'8px 10px',border:'1.5px solid #e2e8f0',borderRadius:6,fontSize:13}}))),
          CE('div',{className:'sp-field'},CE('label',null,'Type de public'),
            CE('select',{value:panelPublic,onChange:e=>setPanelPublic(e.target.value),style:{width:'100%',padding:'8px 10px',border:'1.5px solid #e2e8f0',borderRadius:6,fontSize:13}},
              CE('option',{value:''},'—'),
              [...PUBLICS,...(panelPublic&&!PUBLICS.includes(panelPublic)?[panelPublic]:[])].map(x=>CE('option',{key:x,value:x},x)))),
          // Classe mobile : case comme dans le formulaire ; le nombre
          // d'ordinateurs n'apparaît (et ne compte) que si elle est cochée.
          CE('label',{style:{display:'flex',alignItems:'center',justifyContent:'flex-start',gap:8,fontSize:13,fontWeight:600,cursor:'pointer',margin:'4px 0',width:'auto'}},
            CE('input',{type:'checkbox',checked:panelMobile,onChange:e=>setPanelMobile(e.target.checked),style:{width:18,height:18,margin:0,flex:'none'}}),CE('span',null,'Classe mobile')),
          panelMobile&&CE('div',{className:'sp-field'},CE('label',null,"Ordinateurs prêtés *"),
            CE('input',{type:'number',min:1,max:10,value:panelNbOrdi,onChange:e=>setPanelNbOrdi(e.target.value),style:{width:'100%',padding:'8px 10px',border:'1.5px solid #e2e8f0',borderRadius:6,fontSize:13},placeholder:'Ex : 4'})),
          // Facultatives, comme dans le formulaire : sans elles le prêt ne
          // couvre que le jour de l'atelier (periodePretMateriel).
          panelMobile&&CE('div',{style:{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8}},
            CE('div',{className:'sp-field'},CE('label',null,'Prélèvement ordi'),
              CE('input',{type:'date',value:panelPrelev,onChange:e=>setPanelPrelev(e.target.value),style:{width:'100%',padding:'8px 10px',border:'1.5px solid #e2e8f0',borderRadius:6,fontSize:13}})),
            CE('div',{className:'sp-field'},CE('label',null,'Retour ordi'),
              CE('input',{type:'date',value:panelRetour,onChange:e=>setPanelRetour(e.target.value),style:{width:'100%',padding:'8px 10px',border:'1.5px solid #e2e8f0',borderRadius:6,fontSize:13}}))),
          parseInt(panel.nb_ordinateurs)>0&&(panel.date_prelevement_materiel||panel.date_retour_materiel)&&CE('div',{className:'sp-info-row'},CE('span',null,'Période de prêt'),CE('span',null,fmtPeriode(periodePretMateriel(panel).debut,periodePretMateriel(panel).fin))),
          // Conflit de matériel si l'on enregistre (26/09/2026) : même contrôle
          // que l'onglet Anomalies, sur l'atelier tel qu'il sera enregistré.
          (()=>{const c=typeof conflitsDeLEntree==='function'?conflitsDeLEntree(entries,{...panel,date:panelDate,horaire:panelHoraire,ampm:panelHoraire!==(normalizeHoraire(panel.horaire)||'')?(ampmDepuisHoraire(panelHoraire)||panel.ampm):panel.ampm,materiel:matierePanneau(panel,panelMobile),nb_ordinateurs:panelMobile?(panelNbOrdi===''?'':parseInt(panelNbOrdi)||0):'',date_prelevement_materiel:panelMobile?panelPrelev:'',date_retour_materiel:panelMobile?panelRetour:''},typeof findOrdinateursConflicts==='function'?findOrdinateursConflicts:null,typeof findMobileClassConflicts==='function'?findMobileClassConflicts:null):{ordi:[],mobile:[]};
            if(!c.ordi.length&&!c.mobile.length)return null;
            return CE('div',{style:{background:'#fff7ed',border:'1px solid #fed7aa',borderRadius:8,padding:'8px 10px',fontSize:12,color:'#9a3412',display:'flex',flexDirection:'column',gap:4}},
              CE('strong',null,'⚠️ Conflit de matériel si vous enregistrez :'),
              c.ordi.map(g=>CE('div',{key:'o'+g.date},'🖥️ '+fmtPeriode(g.date,g.dateFin)+' : '+g.total+' ordinateurs demandés sur '+STOCK_ORDINATEURS+' en stock')),
              c.mobile.map(g=>CE('div',{key:'m'+g.date},'📦 '+fmtDate(g.date)+' : Classe mobile aussi réservée par '+[...new Set(g.entries.filter(x=>x._id!==panel._id).map(x=>x.conseiller))].join(', '))),
              CE('div',{style:{color:'#6b7280'}},'Enregistrement possible : à régler ensuite dans Gestion ordi ou Anomalies.'));})(),
          CE('div',{className:'sp-field'},CE('label',null,'Thématique'),
            CE(ComboThematique,{value:panelThematique,onChange:setPanelThematique,entries:entries})),
          CE('div',{className:'sp-field'},CE('label',null,'Remarques'),
            CE('textarea',{value:panelNote,onChange:e=>setPanelNote(e.target.value),rows:3,placeholder:'Ajouter une note…',style:{width:'100%',padding:'8px 10px',border:'1.5px solid #e2e8f0',borderRadius:6,fontSize:13,resize:'vertical'}}))
        ),
        CE('div',{className:'side-panel-footer',style:{flexDirection:'column',gap:8}},
          CE('button',{className:'btn btn-primary',style:{width:'100%',padding:'12px',fontSize:15,fontWeight:700,background:'#16a34a',borderColor:'#16a34a'},onClick:savePanel,disabled:saving},saving?'…':'💾 Enregistrer'),
          CE('div',{style:{display:'flex',gap:6}},
            canDelete&&CE('button',{className:'btn btn-danger btn-sm',onClick:()=>{setConfirmDel(panel);closePanel();}},'Supprimer'),
            onDuplicate&&CE('button',{className:'btn btn-secondary btn-sm',style:{background:'#eff6ff',color:'#1d4ed8',border:'1px solid #bfdbfe'},onClick:()=>{onDuplicate(panel);closePanel();}},'📋 Dupliquer'),
            CE('button',{className:'btn btn-secondary btn-sm',style:{flex:1},onClick:()=>onEdit(panel._id)},'Éditer complet')
          )
        )
      )
    ),
    // Confirmation suppression
    confirmDel&&CE('div',{style:{position:'fixed',inset:0,background:'rgba(0,0,0,.5)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:1000}},
      CE('div',{className:'card',style:{width:360}},
        CE('h2',null,'🗑️ Confirmer la suppression'),
        CE('p',{style:{margin:'12px 0',fontSize:13}},`Supprimer l'atelier #${confirmDel._n} — ${confirmDel.thematique} ?`),
        CE('p',{style:{fontSize:12,color:'#718096',marginBottom:16}},'Cette action est irréversible.'),
        CE('div',{style:{display:'flex',gap:10}},
          CE('button',{className:'btn btn-danger',disabled:suppressionEnCours,onClick:async()=>{
            // La fenêtre reste ouverte jusqu'à la réponse : sans ça, 3 à 25 s
            // sans aucun signe que la suppression est partie (23/09/2026).
            setSuppressionEnCours(true);
            try{ await onDelete(confirmDel._id); }
            finally{ setSuppressionEnCours(false); setConfirmDel(null); }
          }},suppressionEnCours?CE('span',null,CE('span',{className:'spinner'}),'Suppression en cours…'):'🗑️ Supprimer'),
          CE('button',{className:'btn btn-secondary',disabled:suppressionEnCours,onClick:()=>setConfirmDel(null)},'Annuler')
        ),
        suppressionEnCours&&CE('p',{style:{fontSize:11,color:'#718096',marginTop:10,marginBottom:0}},'Suppression en cours — ne fermez pas la page.')
      )
    )
  );
}

// ═══════════════════════════════════════════════════════════
// VUE CALENDRIER — v9.2
// ═══════════════════════════════════════════════════════════
function VueCalendrier({entries,onEdit,onDelete,onRefresh,onDuplicate,initConseiller,onResetConseiller,canDelete,onChangeConseiller}){
  const today=new Date();
  const todayStr=today.toISOString().slice(0,10);
  const[calDate,setCalDate]=React.useState(new Date(today.getFullYear(),today.getMonth(),1));
  const[filtConseiller,setFiltConseiller]=React.useState(initConseiller||'Tous');
  const[panel,setPanel]=React.useState(null);
  const[panelStatut,setPanelStatut]=React.useState('');
  const[panelInscrits,setPanelInscrits]=React.useState('');
  const[panelPresents,setPanelPresents]=React.useState('');
  const[panelThematique,setPanelThematique]=React.useState('');const[panelDate,setPanelDate]=React.useState('');const[panelHoraire,setPanelHoraire]=React.useState('');const[panelNbOrdi,setPanelNbOrdi]=React.useState('');const[panelPublic,setPanelPublic]=React.useState('');const[panelMobile,setPanelMobile]=React.useState(false);const[panelPrelev,setPanelPrelev]=React.useState('');const[panelRetour,setPanelRetour]=React.useState('');
  const[panelNote,setPanelNote]=React.useState('');
  const[saving,setSaving]=React.useState(false);
  const[confirmDel,setConfirmDel]=React.useState(null);
  const[suppressionEnCours,setSuppressionEnCours]=React.useState(false);
  const[expandDay,setExpandDay]=React.useState(null);

  React.useEffect(()=>{if(initConseiller)setFiltConseiller(initConseiller);},[initConseiller]);

  const yr=calDate.getFullYear();
  const mo=calDate.getMonth();
  const monthStr=`${yr}-${String(mo+1).padStart(2,'0')}`;
  const MOIS_LONG=['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre'];
  const JOURS_COURT=['Lun','Mar','Mer','Jeu','Ven'];
  // CLOTURE_PRESETS : défini globalement dans shared.js

  // Entrées du mois filtrées par conseiller
  const monthEntries=React.useMemo(()=>{
    let r=entries.filter(e=>e.date&&e.date.startsWith(monthStr));
    if(filtConseiller!=='Tous')r=r.filter(e=>e.conseiller===filtConseiller);
    return r;
  },[entries,monthStr,filtConseiller]);

  // Map jour→ateliers
  const dayMap=React.useMemo(()=>{
    const m={};
    monthEntries.forEach(e=>{const d=parseInt(e.date.slice(8,10));if(!m[d])m[d]=[];m[d].push(e);});
    // Tri par horaire dans chaque jour
    Object.values(m).forEach(arr=>arr.sort((a,b)=>(a.horaire||'').localeCompare(b.horaire||'')));
    return m;
  },[monthEntries]);

  // Grille calendrier
  const firstDow=new Date(yr,mo,1).getDay();
  const firstDowMon=(firstDow+6)%7; // 0=Lun … 4=Ven, 5=Sam, 6=Dim
  const daysInMonth=new Date(yr,mo+1,0).getDate();
  const cells=[];
  // Offset semaine (sam/dim → 0, sinon position lun-ven)
  const offset5=firstDowMon>=5?0:firstDowMon;
  for(let i=0;i<offset5;i++)cells.push(null);
  for(let d=1;d<=daysInMonth;d++){
    const dow=new Date(yr,mo,d).getDay(); // 0=dim,6=sam
    if(dow!==0&&dow!==6)cells.push(d);   // jours ouvrés uniquement
  }
  while(cells.length%5!==0)cells.push(null);

  // Navigation
  function prevMonth(){setCalDate(d=>new Date(d.getFullYear(),d.getMonth()-1,1));setExpandDay(null);}
  function nextMonth(){setCalDate(d=>new Date(d.getFullYear(),d.getMonth()+1,1));setExpandDay(null);}
  function goToday(){setCalDate(new Date(today.getFullYear(),today.getMonth(),1));setExpandDay(null);}

  // Panel
  function openPanel(e){setPanel(e);setPanelStatut(e.statut);setPanelInscrits(e.inscrits===undefined||e.inscrits===''?'':String(e.inscrits));setPanelPresents(e.presents===undefined||e.presents===''?'':String(e.presents));setPanelThematique(e.thematique||'');setPanelNote(e.remarques||'');setPanelDate(normalizeDate(e.date)||'');setPanelHoraire(normalizeHoraire(e.horaire)||'');setPanelNbOrdi(e.nb_ordinateurs===undefined||e.nb_ordinateurs===''||e.nb_ordinateurs===null?'':String(e.nb_ordinateurs));setPanelPublic(e.public||'');setPanelMobile(matIncludes(e.materiel,'Classe mobile'));setPanelPrelev(normalizeDate(e.date_prelevement_materiel)||'');setPanelRetour(normalizeDate(e.date_retour_materiel)||'');}
  function closePanel(){setPanel(null);}
  async function savePanel(){
    if(!panel)return;if(!panelDate){showToast('❌ Date requise',false);return;}if(panelMobile&&!(parseInt(panelNbOrdi)>0)){showToast('❌ Ordinateurs prêtés requis avec la Classe mobile',false);return;}setSaving(true);
    try{
      const updated={...panel,statut:panelStatut,inscrits:panelInscrits===''?'':parseInt(panelInscrits)||0,presents:panelPresents===''?'':parseInt(panelPresents)||0,thematique:panelThematique,date:panelDate,horaire:panelHoraire,ampm:panelHoraire!==(normalizeHoraire(panel.horaire)||'')?(ampmDepuisHoraire(panelHoraire)||panel.ampm):panel.ampm,public:panelPublic,materiel:matierePanneau(panel,panelMobile),nb_ordinateurs:panelMobile?(panelNbOrdi===''?'':parseInt(panelNbOrdi)||0):'',date_prelevement_materiel:panelMobile?panelPrelev:'',date_retour_materiel:panelMobile?panelRetour:'',remarques:panelNote};
      const res=await apiFetch('saveEntry',{entry:updated});
      if(!res.ok)throw new Error(res.error);
      showToast('✅ Mis à jour');closePanel();entreeSauvegardee(updated, onRefresh);
    }catch(err){showToast('❌ '+err.message,false);}
    finally{setSaving(false);}
  }

  // KPIs mois
  const kpi=React.useMemo(()=>{
    const r=monthEntries.filter(e=>e.statut==='Réalisé').length;
    const p=monthEntries.filter(e=>e.statut==='Planifié').length;
    const rea=monthEntries.filter(e=>e.statut==='Réalisé');
    const ins=rea.reduce((s,e)=>s+(parseInt(e.inscrits)||0),0);
    const pres=rea.reduce((s,e)=>s+(parseInt(e.presents)||0),0);
    return{total:monthEntries.length,realises:r,planifies:p,inscrits:ins,presents:pres};
  },[monthEntries]);

  const conseillersCal=React.useMemo(()=>{const s=new Set();entries.forEach(e=>{if(e.conseiller)s.add(e.conseiller);});return[...Array.from(s).sort()];},[entries]);

  return CE('div',null,
    // ── Header ──
    CE('div',{className:'card',style:{marginBottom:12}},
      CE('div',{style:{display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:10,marginBottom:12}},
        CE('div',{style:{display:'flex',alignItems:'center',gap:8}},
          CE('button',{className:'btn btn-secondary btn-sm',onClick:prevMonth},'‹'),
          CE('div',{style:{fontSize:18,fontWeight:800,color:'#1e3a8a',minWidth:170,textAlign:'center'}},`${MOIS_LONG[mo]} ${yr}`),
          CE('button',{className:'btn btn-secondary btn-sm',onClick:nextMonth},'›'),
          CE('button',{className:'btn btn-secondary btn-sm',style:{marginLeft:4,fontSize:12},onClick:goToday},'Aujourd\'hui')
        )
      ),
      CE('div',{className:'chip-bar',style:{marginBottom:8}},
        CE('span',{className:'chip chip-all'+(filtConseiller==='Tous'?' active':''),onClick:()=>{setFiltConseiller('Tous');if(onChangeConseiller)onChangeConseiller('Tous');}},
          CE('span',{className:'chip-dot'}),'Tous'),
        conseillersCal.map(c=>CE('span',{key:c,className:'chip'+(filtConseiller===c?' active':''),style:{color:conseillerColor(c)},onClick:()=>{setFiltConseiller(f=>f===c?'Tous':c);if(onChangeConseiller)onChangeConseiller(filtConseiller===c?'Tous':c);}},
          CE('span',{className:'chip-dot',style:{background:conseillerColor(c)}}),c))
      ),
      CE('div',{key:monthStr,style:{display:'flex',gap:8,flexWrap:'wrap'}},
        CE('div',{className:'kpi-mini',style:{flex:'1 1 70px',borderLeft:'3px solid #1e3a8a',background:'#f0f4ff',animationDelay:'.00s'}},CE('div',{className:'v',style:{color:'#1e3a8a',fontSize:20}},kpi.total),CE('div',{className:'l'},'Ateliers')),
        CE('div',{className:'kpi-mini',style:{flex:'1 1 70px',borderLeft:'3px solid #16a34a',background:'#f0fdf4',animationDelay:'.07s'}},CE('div',{className:'v',style:{color:'#166534',fontSize:20}},kpi.realises),CE('div',{className:'l'},'Réalisés')),
        CE('div',{className:'kpi-mini',style:{flex:'1 1 70px',borderLeft:'3px solid #2563eb',background:'#eff6ff',animationDelay:'.14s'}},CE('div',{className:'v',style:{color:'#2563eb',fontSize:20}},kpi.planifies),CE('div',{className:'l'},'Planifiés')),
        CE('div',{className:'kpi-mini',style:{flex:'1 1 70px',borderLeft:'3px solid #7c3aed',background:'#faf5ff',animationDelay:'.21s'}},CE('div',{className:'v',style:{color:'#7c3aed',fontSize:20}},kpi.inscrits),CE('div',{className:'l'},'Inscrits')),
        CE('div',{className:'kpi-mini',style:{flex:'1 1 70px',borderLeft:'3px solid #0891b2',background:'#ecfeff',animationDelay:'.28s'}},CE('div',{className:'v',style:{color:'#0891b2',fontSize:20}},kpi.presents),CE('div',{className:'l'},'Présents'))
      )
    ),
    // ── Grille ──
    CE('div',{className:'card',style:{padding:'12px 16px'}},
      // En-têtes jours
      CE('div',{className:'cal-grid',style:{marginBottom:4}},
        JOURS_COURT.map(j=>CE('div',{key:j,className:'cal-header-cell'},j))
      ),
      // Cellules
      CE('div',{className:'cal-grid'},
        cells.map((day,idx)=>{
          if(day===null)return CE('div',{key:'e'+idx,className:'cal-cell cal-cell-empty'});
          const ds=`${yr}-${String(mo+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
          const isToday=ds===todayStr;
          const dayAteliers=dayMap[day]||[];
          const MAX_VISIBLE=3;
          const hidden=dayAteliers.length-MAX_VISIBLE;
          const expanded=expandDay===day;
          const visible=expanded?dayAteliers:dayAteliers.slice(0,MAX_VISIBLE);
          return CE('div',{key:day,className:'cal-cell'+(isToday?' cal-today':'')},
            CE('div',{className:'cal-day-num'},
              isToday?CE('span',{className:'cal-today-num'},day):day
            ),
            visible.map(e=>{
              const sc=conseillerColor(e.conseiller);
              const retard=isRetard(e);
              return CE('div',{key:e._id,className:'cal-event',
                style:{background:retard?'#fecaca':sc+'22',borderLeft:`3px solid ${retard?'#ef4444':sc}`},
                onClick:ev=>{ev.stopPropagation();openPanel(e);}},
                CE('span',{className:'cal-event-time',style:{color:retard?'#991b1b':sc}},e.horaire||''),
                CE('span',{className:'cal-event-label',title:[e.thematique||e.lieu,e.orienteur].filter(Boolean).join(' — ')},CE('span',null,e.thematique||e.lieu||'—'),e.orienteur&&CE('span',{className:'cal-event-orienteur'},'🤝 '+e.orienteur))
              );
            }),
            hidden>0&&!expanded&&CE('div',{className:'cal-more',onClick:ev=>{ev.stopPropagation();setExpandDay(day);}},`+${hidden} autre${hidden>1?'s':''}`),
            expanded&&hidden>0&&CE('div',{className:'cal-more',style:{color:'#dc2626'},onClick:ev=>{ev.stopPropagation();setExpandDay(null);}},`Réduire ▲`)
          );
        })
      )
    ),
    // ── Side panel ──
    panel&&CE('div',{className:'side-panel-overlay',onClick:closePanel}),
    CE('div',{className:'side-panel'+(panel?' open':'')},
      panel&&CE(React.Fragment,null,
        CE('div',{className:'side-panel-header'},
          CE('h3',null,'Détail / Mise à jour'),
          CE('button',{onClick:closePanel,style:{background:'none',border:'none',fontSize:18,cursor:'pointer',color:'#718096'}},'✕')
        ),
        CE('div',{className:'side-panel-body'},
          CE('div',{className:'cloture-banner',style:{background:isRetard(panel)?'#fffbeb':'#f0f4ff',borderColor:isRetard(panel)?'#fcd34d':'#bfdbfe'}},
            CE('div',{className:'cloture-title',style:{color:isRetard(panel)?'#92400e':'#1e3a8a'}},isRetard(panel)?'⚠️ Atelier passé — à clôturer':'⚡ Changement rapide de statut'),
            CE('div',{className:'cloture-btns'},
              CLOTURE_PRESETS.map(p=>CE('button',{key:p.statut,className:'cloture-btn',style:{background:p.bg,color:p.color,outline:panelStatut===p.statut?'2px solid #1e3a8a':'none'},onClick:()=>setPanelStatut(p.statut)},p.label))
            )
          ),
          CE('div',{style:{fontSize:13,fontWeight:700,color:'#1a202c',marginBottom:8}},panel.thematique),
          CE('div',{className:'sp-info-row'},CE('span',null,'Commune'),CE('span',null,panel.commune)),
          CE('div',{className:'sp-info-row'},CE('span',null,'Lieu'),CE('span',null,panel.lieu)),
          panel.orienteur&&CE('div',{className:'sp-info-row'},CE('span',null,'Orienteur'),CE('span',null,panel.orienteur)),
          CE('div',{className:'sp-info-row'},CE('span',null,'Conseiller'),CE('span',{style:{color:conseillerColor(panel.conseiller),fontWeight:700}},panel.conseiller)),panel.co_animateur&&CE('div',{className:'sp-info-row'},CE('span',null,'Co-animateur'),CE('span',{style:{color:conseillerColor(panel.co_animateur),fontWeight:700}},panel.co_animateur)),
          panel.materiel&&panel.materiel.length>0&&CE('div',{style:{marginTop:10,marginBottom:4}},
            CE('div',{style:{fontSize:11,fontWeight:700,color:'#718096',marginBottom:4}},'MATÉRIEL'),
            panel.materiel.map(m=>CE('span',{key:m,className:'mat-chip'},m))
          ),
          CE('hr',{style:{border:'none',borderTop:'1px solid #e2e8f0',margin:'12px 0'}}),
          CE('div',{className:'sp-field'},CE('label',null,'Statut *'),
            CE('select',{value:panelStatut,onChange:e=>setPanelStatut(e.target.value),style:{width:'100%',padding:'8px 10px',border:'1.5px solid #e2e8f0',borderRadius:6,fontSize:13}},
              STATUTS.map(s=>CE('option',{key:s,value:s},s)))),
          CE('div',{className:'sp-field'},CE('label',null,"Nombre d'inscrits"),
            CE('input',{type:'number',min:0,value:panelInscrits,onChange:e=>setPanelInscrits(e.target.value),style:{width:'100%',padding:'8px 10px',border:'1.5px solid #e2e8f0',borderRadius:6,fontSize:13},placeholder:'0'})),
          CE('div',{className:'sp-field'},CE('label',null,'Nombre de présents'),
            CE('input',{type:'number',min:0,value:panelPresents,onChange:e=>setPanelPresents(e.target.value),style:{width:'100%',padding:'8px 10px',border:'1.5px solid #e2e8f0',borderRadius:6,fontSize:13},placeholder:'0'})),
          // Modifiables ici depuis le 26/09/2026 (demande de l'utilisateur) :
          // date, horaire (AM/PM recalculé s'il change), public, ordinateurs ;
          // thématique en auto-proposition comme dans le formulaire.
          CE('div',{style:{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8}},
            CE('div',{className:'sp-field'},CE('label',null,'Date *'),
              CE('input',{type:'date',value:panelDate,onChange:e=>setPanelDate(e.target.value),style:{width:'100%',padding:'8px 10px',border:'1.5px solid #e2e8f0',borderRadius:6,fontSize:13}})),
            CE('div',{className:'sp-field'},CE('label',null,'Horaire'),
              CE('input',{type:'time',value:panelHoraire,onChange:e=>setPanelHoraire(e.target.value),style:{width:'100%',padding:'8px 10px',border:'1.5px solid #e2e8f0',borderRadius:6,fontSize:13}}))),
          CE('div',{className:'sp-field'},CE('label',null,'Type de public'),
            CE('select',{value:panelPublic,onChange:e=>setPanelPublic(e.target.value),style:{width:'100%',padding:'8px 10px',border:'1.5px solid #e2e8f0',borderRadius:6,fontSize:13}},
              CE('option',{value:''},'—'),
              [...PUBLICS,...(panelPublic&&!PUBLICS.includes(panelPublic)?[panelPublic]:[])].map(x=>CE('option',{key:x,value:x},x)))),
          // Classe mobile : case comme dans le formulaire ; le nombre
          // d'ordinateurs n'apparaît (et ne compte) que si elle est cochée.
          CE('label',{style:{display:'flex',alignItems:'center',justifyContent:'flex-start',gap:8,fontSize:13,fontWeight:600,cursor:'pointer',margin:'4px 0',width:'auto'}},
            CE('input',{type:'checkbox',checked:panelMobile,onChange:e=>setPanelMobile(e.target.checked),style:{width:18,height:18,margin:0,flex:'none'}}),CE('span',null,'Classe mobile')),
          panelMobile&&CE('div',{className:'sp-field'},CE('label',null,"Ordinateurs prêtés *"),
            CE('input',{type:'number',min:1,max:10,value:panelNbOrdi,onChange:e=>setPanelNbOrdi(e.target.value),style:{width:'100%',padding:'8px 10px',border:'1.5px solid #e2e8f0',borderRadius:6,fontSize:13},placeholder:'Ex : 4'})),
          // Facultatives, comme dans le formulaire : sans elles le prêt ne
          // couvre que le jour de l'atelier (periodePretMateriel).
          panelMobile&&CE('div',{style:{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8}},
            CE('div',{className:'sp-field'},CE('label',null,'Prélèvement ordi'),
              CE('input',{type:'date',value:panelPrelev,onChange:e=>setPanelPrelev(e.target.value),style:{width:'100%',padding:'8px 10px',border:'1.5px solid #e2e8f0',borderRadius:6,fontSize:13}})),
            CE('div',{className:'sp-field'},CE('label',null,'Retour ordi'),
              CE('input',{type:'date',value:panelRetour,onChange:e=>setPanelRetour(e.target.value),style:{width:'100%',padding:'8px 10px',border:'1.5px solid #e2e8f0',borderRadius:6,fontSize:13}}))),
          parseInt(panel.nb_ordinateurs)>0&&(panel.date_prelevement_materiel||panel.date_retour_materiel)&&CE('div',{className:'sp-info-row'},CE('span',null,'Période de prêt'),CE('span',null,fmtPeriode(periodePretMateriel(panel).debut,periodePretMateriel(panel).fin))),
          // Conflit de matériel si l'on enregistre (26/09/2026) : même contrôle
          // que l'onglet Anomalies, sur l'atelier tel qu'il sera enregistré.
          (()=>{const c=typeof conflitsDeLEntree==='function'?conflitsDeLEntree(entries,{...panel,date:panelDate,horaire:panelHoraire,ampm:panelHoraire!==(normalizeHoraire(panel.horaire)||'')?(ampmDepuisHoraire(panelHoraire)||panel.ampm):panel.ampm,materiel:matierePanneau(panel,panelMobile),nb_ordinateurs:panelMobile?(panelNbOrdi===''?'':parseInt(panelNbOrdi)||0):'',date_prelevement_materiel:panelMobile?panelPrelev:'',date_retour_materiel:panelMobile?panelRetour:''},typeof findOrdinateursConflicts==='function'?findOrdinateursConflicts:null,typeof findMobileClassConflicts==='function'?findMobileClassConflicts:null):{ordi:[],mobile:[]};
            if(!c.ordi.length&&!c.mobile.length)return null;
            return CE('div',{style:{background:'#fff7ed',border:'1px solid #fed7aa',borderRadius:8,padding:'8px 10px',fontSize:12,color:'#9a3412',display:'flex',flexDirection:'column',gap:4}},
              CE('strong',null,'⚠️ Conflit de matériel si vous enregistrez :'),
              c.ordi.map(g=>CE('div',{key:'o'+g.date},'🖥️ '+fmtPeriode(g.date,g.dateFin)+' : '+g.total+' ordinateurs demandés sur '+STOCK_ORDINATEURS+' en stock')),
              c.mobile.map(g=>CE('div',{key:'m'+g.date},'📦 '+fmtDate(g.date)+' : Classe mobile aussi réservée par '+[...new Set(g.entries.filter(x=>x._id!==panel._id).map(x=>x.conseiller))].join(', '))),
              CE('div',{style:{color:'#6b7280'}},'Enregistrement possible : à régler ensuite dans Gestion ordi ou Anomalies.'));})(),
          CE('div',{className:'sp-field'},CE('label',null,'Thématique'),
            CE(ComboThematique,{value:panelThematique,onChange:setPanelThematique,entries:entries})),
          CE('div',{className:'sp-field'},CE('label',null,'Remarques'),
            CE('textarea',{value:panelNote,onChange:e=>setPanelNote(e.target.value),rows:3,placeholder:'Ajouter une note…',style:{width:'100%',padding:'8px 10px',border:'1.5px solid #e2e8f0',borderRadius:6,fontSize:13,resize:'vertical'}}))
        ),
        CE('div',{className:'side-panel-footer',style:{flexDirection:'column',gap:8}},
          CE('button',{className:'btn btn-primary',style:{width:'100%',padding:'12px',fontSize:15,fontWeight:700,background:'#16a34a',borderColor:'#16a34a'},onClick:savePanel,disabled:saving},saving?'…':'💾 Enregistrer'),
          CE('div',{style:{display:'flex',gap:6}},
            canDelete&&CE('button',{className:'btn btn-danger btn-sm',onClick:()=>{setConfirmDel(panel);closePanel();}},'Supprimer'),
            onDuplicate&&CE('button',{className:'btn btn-secondary btn-sm',style:{background:'#eff6ff',color:'#1d4ed8',border:'1px solid #bfdbfe'},onClick:()=>{onDuplicate(panel);closePanel();}},'📋 Dupliquer'),
            CE('button',{className:'btn btn-secondary btn-sm',style:{flex:1},onClick:()=>onEdit(panel._id)},'Éditer complet')
          )
        )
      )
    ),
    confirmDel&&CE('div',{style:{position:'fixed',inset:0,background:'rgba(0,0,0,.5)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:1000}},
      CE('div',{className:'card',style:{width:360}},
        CE('h2',null,'🗑️ Confirmer la suppression'),
        CE('p',{style:{margin:'12px 0',fontSize:13}},`Supprimer l'atelier #${confirmDel._n} — ${confirmDel.thematique} ?`),
        CE('p',{style:{fontSize:12,color:'#718096',marginBottom:16}},'Cette action est irréversible.'),
        CE('div',{style:{display:'flex',gap:10}},
          CE('button',{className:'btn btn-danger',disabled:suppressionEnCours,onClick:async()=>{
            // La fenêtre reste ouverte jusqu'à la réponse : sans ça, 3 à 25 s
            // sans aucun signe que la suppression est partie (23/09/2026).
            setSuppressionEnCours(true);
            try{ await onDelete(confirmDel._id); }
            finally{ setSuppressionEnCours(false); setConfirmDel(null); }
          }},suppressionEnCours?CE('span',null,CE('span',{className:'spinner'}),'Suppression en cours…'):'🗑️ Supprimer'),
          CE('button',{className:'btn btn-secondary',disabled:suppressionEnCours,onClick:()=>setConfirmDel(null)},'Annuler')
        ),
        suppressionEnCours&&CE('p',{style:{fontSize:11,color:'#718096',marginTop:10,marginBottom:0}},'Suppression en cours — ne fermez pas la page.')
      )
    )
  );
}

// ═══════════════════════════════════════════════════════════
// ECharts — composants graphiques (migration depuis Recharts)
// ═══════════════════════════════════════════════════════════
function NoData(){return CE('p',{style:{color:'#718096',fontSize:12,textAlign:'center',paddingTop:20}},'Aucune donnée');}
function barH(n,base){return Math.max(base,base+(Math.max(0,n-6)*8));}

// ── Base wrapper ECharts ────────────────────────────────────
const EC_ANIM={animation:true,animationDuration:800,animationEasing:'cubicOut',animationDurationUpdate:500,animationEasingUpdate:'cubicInOut'};
function EChart({option,height}){
  const ref=React.useRef(null);
  const inst=React.useRef(null);
  const optRef=React.useRef(option);
  React.useEffect(()=>{
    if(!ref.current||!window.echarts)return;
    const isNew=!inst.current;
    if(isNew){
      inst.current=window.echarts.init(ref.current);
      const ro=new ResizeObserver(()=>{if(inst.current)inst.current.resize();});
      ro.observe(ref.current);
      inst.current._ro=ro;
    }
    if(!isNew&&optRef.current===option)return;
    optRef.current=option;
    const merged={...EC_ANIM,...option};
    if(isNew){requestAnimationFrame(()=>requestAnimationFrame(()=>{if(inst.current)inst.current.setOption(merged,{notMerge:true,lazyUpdate:false});}));}
    else{inst.current.setOption(merged,{notMerge:false,lazyUpdate:false});}
  });
  React.useEffect(()=>{return()=>{if(inst.current){if(inst.current._ro)inst.current._ro.disconnect();inst.current.dispose();inst.current=null;}};},[]); 
  return CE('div',{ref,style:{width:'100%',height:height||200}});
}

function mkGrad(c1,c2,dir='v'){
  if(!window.echarts)return c1;
  const[x1,y1,x2,y2]=dir==='v'?[0,0,0,1]:[0,0,1,0];
  return new window.echarts.graphic.LinearGradient(x1,y1,x2,y2,[{offset:0,color:c1},{offset:1,color:c2}]);
}
// ── Style graphiques GDIN ────────────────────────────
const EC_TT={backgroundColor:'#111827',borderColor:'#374151',textStyle:{color:'#f1f5f9',fontSize:12},extraCssText:'border-radius:8px;padding:10px 14px;box-shadow:none'};
const EC_GRID={top:24,right:8,bottom:48,left:28,containLabel:true};
const EC_AXIS_LABEL={color:'#94a3b8',fontSize:10};
const EC_SPLIT={lineStyle:{color:'rgba(255,255,255,0.06)',type:'dashed'}};
const EC_AXIS_BASE={axisLine:{show:false},axisTick:{show:false},axisLabel:EC_AXIS_LABEL,splitLine:EC_SPLIT};
const EC_APN={axisPointer:{type:'none'}};

// ── BarChart vertical ───────────────────────────────────────
function BarChart({data,colors,height}){
  if(!data||data.length===0)return CE(NoData,null);
  const colArr=Array.isArray(colors)?colors:[colors||'#3b82f6'];
  const h=height||barH(data.length,200);
  const maxLbl=data.length>8?9:data.length>5?12:16;
  const labels=data.map(d=>trunc(d.label,maxLbl));
  const option={
    backgroundColor:'transparent',grid:{...EC_GRID,bottom:data.length>6?68:48},
    tooltip:{trigger:'axis',...EC_TT,...EC_APN,
      formatter:params=>{const i=params[0];const d=data[i.dataIndex];return`<b style="color:#60a5fa">${d.label}</b><br/>${i.value} atelier(s)`+(d.tip?'<br/><span style="color:#94a3b8;font-size:11px">'+d.tip+'</span>':'');}},
    xAxis:{data:labels,...EC_AXIS_BASE,splitLine:{show:false},axisLabel:{...EC_AXIS_LABEL,rotate:data.length>5?-35:0,interval:0}},
    yAxis:{...EC_AXIS_BASE},
    series:[{type:'bar',barMaxWidth:44,
      data:data.map((d,i)=>({value:d.value,itemStyle:{color:colArr[i%colArr.length],borderRadius:[4,4,0,0]}})),
      label:{show:true,position:'top',color:'#94a3b8',fontSize:10,fontWeight:'bold'}
    }]
  };
  return CE(EChart,{option,height:h});
}

// ── LineChart simple ─────────────────────────────────────────
function LineChart({data}){
  if(!data||data.length===0)return CE(NoData,null);
  const option={
    backgroundColor:'transparent',grid:{...EC_GRID},
    tooltip:{trigger:'axis',...EC_TT,...EC_APN,
      formatter:params=>{const i=params[0];const d=data[i.dataIndex];return d.tip||`<b style="color:#a78bfa">${d.label}</b><br/>${i.value}`;}},
    xAxis:{data:data.map(d=>d.label),...EC_AXIS_BASE,splitLine:{show:false},axisLabel:{...EC_AXIS_LABEL,rotate:data.length>8?-35:0,interval:0}},
    yAxis:{...EC_AXIS_BASE},
    series:[{type:'line',data:data.map(d=>d.value),smooth:true,symbol:'circle',symbolSize:5,
      lineStyle:{width:2.5,color:'#a78bfa'},
      itemStyle:{color:'#a78bfa'},
      areaStyle:{color:mkGrad('rgba(167,139,250,0.25)','rgba(167,139,250,0.02)')},
      label:{show:true,position:'top',color:'#94a3b8',fontSize:9,fontWeight:'bold'}
    }]
  };
  return CE(EChart,{option,height:200});
}

// ── DualLineChart inscrits/présents ──────────────────────────
function DualLineChart({data}){
  if(!data||data.length===0)return CE(NoData,null);
  const option={
    backgroundColor:'transparent',grid:{...EC_GRID,bottom:50},
    tooltip:{trigger:'axis',...EC_TT,...EC_APN},
    legend:{data:['Inscrits','Présents'],textStyle:{color:'#94a3b8',fontSize:11},bottom:0,icon:'circle',itemWidth:8,itemHeight:8},
    xAxis:{data:data.map(d=>d.label),...EC_AXIS_BASE,splitLine:{show:false},axisLabel:{...EC_AXIS_LABEL,rotate:data.length>8?-35:0,interval:0}},
    yAxis:{...EC_AXIS_BASE},
    series:[
      {name:'Inscrits',type:'line',data:data.map(d=>d.inscrits),smooth:true,symbol:'circle',symbolSize:4,
       lineStyle:{width:2,color:'#3b82f6'},itemStyle:{color:'#3b82f6'},
       areaStyle:{color:mkGrad('rgba(59,130,246,0.2)','rgba(59,130,246,0.02)')}},
      {name:'Présents',type:'line',data:data.map(d=>d.presents),smooth:true,symbol:'circle',symbolSize:4,
       lineStyle:{width:2,color:'#22c55e'},itemStyle:{color:'#22c55e'},
       areaStyle:{color:mkGrad('rgba(34,197,94,0.2)','rgba(34,197,94,0.02)')}}
    ]
  };
  return CE(EChart,{option,height:220});
}

// ── RadialChart barres horizontales ──────────────────────────
function RadialChart({data,colors,height=220}){
  if(!data||data.length===0)return CE(NoData,null);
  const colArr=Array.isArray(colors)?colors:['#3b82f6'];
  const total=data.reduce((s,d)=>s+d.value,0);
  const option={
    backgroundColor:'transparent',grid:{top:8,right:50,bottom:8,left:8,containLabel:true},
    tooltip:{trigger:'axis',...EC_TT,...EC_APN,
      formatter:params=>{const i=params[0];const d=data[i.dataIndex];const pct=Math.round(d.value/total*100);return`<b style="color:#60a5fa">${d.label}</b><br/>${d.value} — ${pct}%`;}},
    xAxis:{...EC_AXIS_BASE},
    yAxis:{type:'category',data:data.map(d=>d.label),axisLabel:{...EC_AXIS_LABEL,fontSize:11},axisLine:{show:false},axisTick:{show:false},splitLine:{show:false}},
    series:[{type:'bar',barMaxWidth:32,
      data:data.map((d,i)=>({value:d.value,itemStyle:{color:colArr[i%colArr.length],borderRadius:[0,4,4,0]}})),
      label:{show:true,position:'right',color:'#94a3b8',fontSize:10,fontWeight:'bold'}
    }]
  };
  return CE(EChart,{option,height});
}

// ── DonutChart ───────────────────────────────────────────────
function DonutChart({data,colors,height=220}){
  if(!data||data.length===0)return CE(NoData,null);
  const colArr=Array.isArray(colors)?colors:['#3b82f6'];
  const total=data.reduce((s,d)=>s+d.value,0);
  const option={
    backgroundColor:'transparent',
    tooltip:{trigger:'item',...EC_TT,formatter:params=>`<b style="color:${params.color}">${params.name}</b><br/>${params.value} (${Math.round(params.value/total*100)}%)`},
    legend:{orient:'horizontal',bottom:0,textStyle:{color:'#94a3b8',fontSize:11},icon:'circle',itemWidth:8,itemHeight:8},
    series:[{type:'pie',radius:['38%','65%'],center:['50%','46%'],
      itemStyle:{borderRadius:5,borderColor:'#1a1d27',borderWidth:3},
      label:{show:true,position:'inside',color:'#fff',fontSize:10,fontWeight:'bold',formatter:p=>p.percent>6?Math.round(p.percent)+'%':''},
      data:data.map((d,i)=>({name:d.label,value:d.value,itemStyle:{color:colArr[i%colArr.length]}})),
      emphasis:{scale:true,scaleSize:5}
    }]
  };
  return CE(EChart,{option,height});
}

// ── StackedActivityChart barres empilées ─────────────────────
function StackedActivityChart({data}){
  if(!data||Object.keys(data).length===0)return CE(NoData,null);
  const todayYM=new Date().toISOString().slice(0,7);
  const fmtML=ym=>`${ym.slice(5,7)}/${ym.slice(2,4)}`;
  const keys=Object.keys(data).sort();
  const labels=keys.map(k=>fmtML(k));
  const option={
    backgroundColor:'transparent',grid:{top:28,right:8,bottom:48,left:28,containLabel:true},
    tooltip:{trigger:'axis',...EC_TT,...EC_APN,
      formatter:params=>{const k=keys[params[0].dataIndex];const d=data[k];const futur=k>=todayYM?' (à venir)':'';return`<b style="color:#60a5fa">${fmtML(k)}${futur}</b><br/><span style="color:#22c55e">✅ ${d.realises} réalisés</span><br/><span style="color:#3b82f6">📅 ${d.planifies} planifiés</span><br/><span style="color:#ef4444">❌ ${d.annules} annulés</span>`;}},
    legend:{data:['Réalisés','Annulés','Planifiés'],textStyle:{color:'#94a3b8',fontSize:10},bottom:0,icon:'roundRect',itemWidth:10,itemHeight:8},
    xAxis:{data:labels,...EC_AXIS_BASE,splitLine:{show:false},axisLabel:{...EC_AXIS_LABEL,rotate:-35,interval:0}},
    yAxis:{...EC_AXIS_BASE},
    series:[
      {name:'Réalisés',type:'bar',stackId:'a',barMaxWidth:30,data:keys.map(k=>data[k].realises),
        itemStyle:{color:'#22c55e'}},
      {name:'Annulés',type:'bar',stackId:'a',barMaxWidth:30,data:keys.map(k=>data[k].annules),
        itemStyle:{color:'#ef4444'}},
      {name:'Planifiés',type:'bar',barMaxWidth:30,data:keys.map(k=>data[k].planifies),
        itemStyle:{color:'#3b82f6',borderRadius:[4,4,0,0]}}
    ]
  };
  return CE(EChart,{option,height:220});
}

// ── ConseillerBarChart groupé horizontal ─────────────────────
function ConseillerBarChart({entries}){
  if(!entries||entries.length===0)return CE(NoData,null);
  const cons={};
  entries.forEach(e=>{
    const cs=[e.conseiller||'?'];
    if(e.co_animateur)cs.push(e.co_animateur);
    cs.forEach(c=>{
      if(!cons[c])cons[c]={realises:0,planifies:0,annules:0,inscrits:0,presents:0};
      if(e.statut==='Réalisé'){cons[c].realises++;cons[c].inscrits+=(parseInt(e.inscrits)||0);cons[c].presents+=(parseInt(e.presents)||0);}
      else if(e.statut==='Planifié')cons[c].planifies++;
      else if(e.statut==='Annulé')cons[c].annules++;
    });
  });
  const data=Object.entries(cons).sort((a,b)=>b[1].realises-a[1].realises)
    .map(([name,d])=>({name:trunc(name,14),...d,tx:d.inscrits>0?Math.round(d.presents/d.inscrits*100):0}));
  if(!data.length)return CE(NoData,null);
  const h=Math.max(180,100+data.length*34);
  const option={
    backgroundColor:'transparent',grid:{top:8,right:60,bottom:30,left:8,containLabel:true},
    tooltip:{trigger:'axis',...EC_TT,...EC_APN,
      formatter:params=>{const d=data[params[0].dataIndex];return`<b style="color:#60a5fa">${d.name}</b><br/><span style="color:#22c55e">✅ Réalisés : ${d.realises}</span><br/><span style="color:#3b82f6">📅 Planifiés : ${d.planifies}</span><br/><span style="color:#ef4444">❌ Annulés : ${d.annules}</span><br/><span style="color:#a78bfa;font-weight:700">👥 Présents : ${d.presents}/${d.inscrits} — ${d.tx}%</span>`;}},
    legend:{data:['Réalisés','Planifiés','Annulés'],textStyle:{color:'#94a3b8',fontSize:10},bottom:0,icon:'roundRect',itemWidth:10,itemHeight:8},
    xAxis:{...EC_AXIS_BASE},
    yAxis:{type:'category',data:data.map(d=>d.name),axisLabel:{...EC_AXIS_LABEL,fontSize:11},axisLine:{show:false},axisTick:{show:false},splitLine:{show:false}},
    series:[
      {name:'Réalisés',type:'bar',barMaxWidth:14,data:data.map(d=>d.realises),
        itemStyle:{color:p=>conseillerColor(data[p.dataIndex].name),borderRadius:[0,4,4,0]},
        label:{show:true,position:'right',color:'#94a3b8',fontSize:9,fontWeight:'bold'}},
      {name:'Planifiés',type:'bar',barMaxWidth:14,data:data.map(d=>d.planifies),
        itemStyle:{color:'rgba(59,130,246,0.5)',borderRadius:[0,4,4,0]}},
      {name:'Annulés',type:'bar',barMaxWidth:14,data:data.map(d=>d.annules),
        itemStyle:{color:'rgba(239,68,68,0.5)',borderRadius:[0,4,4,0]}}
    ]
  };
  return CE(EChart,{option,height:h});
}

// ── Utilitaire couleur éclaircissement ──────────────────────
function lighten(hex){try{const r=parseInt(hex.slice(1,3),16),g=parseInt(hex.slice(3,5),16),b=parseInt(hex.slice(5,7),16);const f=n=>Math.min(255,Math.round(n+(255-n)*.35)).toString(16).padStart(2,'0');return'#'+f(r)+f(g)+f(b);}catch{return hex;}}

// ═══════════════════════════════════════════════════════════
// VUE DASHBOARD — v11.0 Tableau de bord de pilotage
// ═══════════════════════════════════════════════════════════

// DonutChart → remplacé par version ECharts ci-dessus


// ── KPI Card avec tendance ─────────────────────────────────
function KpiCard({val,lbl,sub,trend,color,icon,bgColor,delay=0}){
  const up=trend>0,down=trend<0;
  const[sv,setSv]=React.useState(false);React.useEffect(()=>{const t=setTimeout(()=>setSv(true),delay*1000+20);return()=>clearTimeout(t);},[]);
  return CE('div',{className:'kpi',style:{background:bgColor||'#fff',borderLeft:'4px solid '+(color||'#1e3a8a'),textAlign:'left',padding:'14px 16px',position:'relative',overflow:'hidden',opacity:sv?1:0,transform:sv?'none':'translateY(14px)',transition:'opacity .45s ease,transform .45s ease'}},
    CE('div',{style:{position:'absolute',right:10,top:8,fontSize:28,opacity:.08}},icon),
    CE('div',{style:{display:'flex',alignItems:'flex-start',justifyContent:'space-between'}},
      CE('div',null,
        CE('div',{style:{fontSize:11,color:'#94a3b8',fontWeight:600,marginBottom:4,display:'flex',alignItems:'center',gap:4}},icon,' ',lbl),
        CE('div',{className:'val',style:{color:color||'#1e3a8a',fontSize:26,lineHeight:1.1}},val),
        sub&&CE('div',{style:{fontSize:11,color:'#94a3b8',marginTop:3}},sub)
      ),
      trend!==undefined&&CE('div',{style:{
        fontSize:11,fontWeight:700,
        color:up?'#16a34a':down?'#dc2626':'#718096',
        background:up?'#f0fdf4':down?'#fef2f2':'#f8fafc',
        padding:'2px 7px',borderRadius:8,whiteSpace:'nowrap',marginTop:2,alignSelf:'flex-start'
      }},(up?'↑ +':down?'↓ ':'')+Math.abs(trend)+'%')
    )
  );
}

// StackedActivityChart → remplacé par version ECharts ci-dessus

// ConseillerBarChart → remplacé par version ECharts ci-dessus

// VueDashboard : une SECONDE définition du même nom vivait ici. En JavaScript
// la dernière déclaration l'emporte, donc celle-ci n'a jamais servi — c'était
// l'ancienne version, conservée par accident lors d'une évolution du tableau
// de bord (la version active, plus bas, ajoute le filtre par mois et remplace
// le graphe « Inscrits vs Présents » par « Par type de public »).
//
// Supprimée le 19/09/2026 : 164 lignes analysées et parsées à chaque
// chargement pour rien, et surtout un piège — modifier celle-ci en croyant
// agir sur le tableau de bord n'aurait produit aucun effet visible.
// DualLineChart, qu'elle utilisait, reste employé par VueGraphiques.

// ═══════════════════════════════════════════════════════════
// VUE GRAPHIQUES (stats détaillées — inchangé)
// ═══════════════════════════════════════════════════════════
function VueGraphiques({entries}){
  if(!window.echarts)return CE('div',{className:'card'},CE('p',{style:{color:'#718096',textAlign:'center',padding:'40px 0'}},'⚠️ ECharts non chargé — vérifiez la connexion internet.'));

  const[dateFrom,setDateFrom]=React.useState('');
  const[dateTo,setDateTo]=React.useState('');

  const filtered=React.useMemo(()=>{
    let r=entries;
    if(dateFrom)r=r.filter(e=>e.date&&e.date>=dateFrom);
    if(dateTo)r=r.filter(e=>e.date&&e.date<=dateTo);
    return r;
  },[entries,dateFrom,dateTo]);

  const hasFilter=dateFrom||dateTo;
  const passes=filtered.filter(isPasse);
  const total=passes.length;
  const totalInscrits=passes.reduce((s,e)=>s+(parseInt(e.inscrits)||0),0);
  const totalPresents=passes.reduce((s,e)=>s+(parseInt(e.presents)||0),0);
  const txPresence=totalInscrits>0?Math.round(totalPresents/totalInscrits*100):0;
  const annules=filtered.filter(e=>e.statut==='Annulé').length;
  const todayYM=new Date().toISOString().slice(0,7);
  const fmtML=ym=>ym==='?'?'?':`${ym.slice(5,7)}-${ym.slice(0,4)}`;

  const byCommune={};passes.forEach(e=>{byCommune[e.commune]=(byCommune[e.commune]||0)+1;});
  const dataCommune=Object.entries(byCommune).sort((a,b)=>b[1]-a[1]).map(([label,value])=>({label,value}));

  const byPublic={};passes.forEach(e=>{const p=e.public||'Autres';if(!byPublic[p])byPublic[p]={value:0,inscrits:0,presents:0};byPublic[p].value++;byPublic[p].inscrits+=(parseInt(e.inscrits)||0);byPublic[p].presents+=(parseInt(e.presents)||0);});
  const dataPublic=Object.entries(byPublic).sort((a,b)=>b[1].value-a[1].value).map(([label,d])=>({label,value:d.value,tip:`${label} : ${d.value} atelier(s) — ${d.inscrits} inscrits / ${d.presents} présents`}));

  const byMois={};filtered.forEach(e=>{const m=e.date?e.date.slice(0,7):'?';if(m>='2000'&&m<todayYM){if(!byMois[m])byMois[m]={realises:0,annules:0};if(e.statut==='Réalisé')byMois[m].realises++;if(e.statut==='Annulé')byMois[m].annules++;}});
  const dataMois=Object.keys(byMois).sort().map(k=>({label:fmtML(k),value:byMois[k].realises+byMois[k].annules,tip:`${fmtML(k)} : ${byMois[k].realises} réalisé(s) / ${byMois[k].annules} annulé(s)`}));

  const byMoisPresents={};passes.forEach(e=>{const m=e.date?e.date.slice(0,7):'?';if(m<todayYM)byMoisPresents[m]=(byMoisPresents[m]||0)+(parseInt(e.presents)||0);});
  const dataMoisPresents=Object.keys(byMoisPresents).sort().map(k=>({label:fmtML(k),value:byMoisPresents[k],tip:`${fmtML(k)} : ${byMoisPresents[k]} présent(s)`}));

  // Inscrits vs Présents par mois
  const byMoisDual={};passes.forEach(e=>{const m=e.date?e.date.slice(0,7):'?';if(m<todayYM){if(!byMoisDual[m])byMoisDual[m]={inscrits:0,presents:0};byMoisDual[m].inscrits+=(parseInt(e.inscrits)||0);byMoisDual[m].presents+=(parseInt(e.presents)||0);}});
  const dataDual=Object.keys(byMoisDual).sort().map(k=>({label:fmtML(k),...byMoisDual[k]}));

  // Répartition AM / PM (uniquement entrées avec ampm ou horaire renseigné)
  const withAmPm=filtered.filter(e=>e.ampm==='AM'||e.ampm==='PM'||(e.horaire&&!isNaN(parseInt(e.horaire))));
  const amCount=withAmPm.filter(e=>e.ampm==='AM'||(!e.ampm&&parseInt(e.horaire)<12)).length;
  const pmCount=withAmPm.filter(e=>e.ampm==='PM'||(!e.ampm&&parseInt(e.horaire)>=12)).length;
  const ampmBase=amCount+pmCount||1;
  const dataAmPm=[
    {label:'Matin (AM)',value:amCount,tip:`Matin : ${amCount} atelier(s) — ${Math.round(amCount/ampmBase*100)}%`},
    {label:'Après-midi (PM)',value:pmCount,tip:`Après-midi : ${pmCount} atelier(s) — ${Math.round(pmCount/ampmBase*100)}%`},
  ];

  const byFutur={};filtered.filter(e=>e.statut==='Planifié'&&e.date&&e.date.slice(0,7)>=todayYM).forEach(e=>{const m=e.date.slice(0,7);byFutur[m]=(byFutur[m]||0)+1;});
  const dataFutur=Object.keys(byFutur).sort().map(k=>({label:fmtML(k),value:byFutur[k],tip:`${fmtML(k)} : ${byFutur[k]} atelier(s) planifié(s)`}));

  const byStat={};filtered.forEach(e=>{byStat[e.statut]=(byStat[e.statut]||0)+1;});
  const dataStat=Object.entries(byStat).map(([label,value])=>({label,value}));

  // ── Nouveaux graphiques ──────────────────────────────────────

  // 1. Taux de réalisation mensuel
  const byMoisTx={};filtered.forEach(e=>{const m=e.date?e.date.slice(0,7):'?';if(m<'2000'||m>=todayYM)return;if(!byMoisTx[m])byMoisTx[m]={realises:0,total:0};if(['Réalisé','Annulé','Non réalisé','Reporté'].includes(e.statut))byMoisTx[m].total++;if(e.statut==='Réalisé')byMoisTx[m].realises++;});
  const dataTxRealisation=Object.keys(byMoisTx).sort().map(k=>({label:fmtML(k),value:byMoisTx[k].total>0?Math.round(byMoisTx[k].realises/byMoisTx[k].total*100):0}));

  // 2. Comparaison N vs N-1 — year derived from entries (most recent réalisé), never hardcoded
  const cmpYear=entries.reduce((mx,e)=>e.statut==='Réalisé'&&e.date?Math.max(mx,parseInt(e.date.slice(0,4))||0):mx,new Date().getFullYear());const prevCmpYear=cmpYear-1;
  const byMoisCmp={};entries.forEach(e=>{if(e.statut!=='Réalisé')return;const yr=e.date?parseInt(e.date.slice(0,4)):0;if(yr!==cmpYear&&yr!==prevCmpYear)return;const mo=e.date.slice(5,7);if(!byMoisCmp[mo])byMoisCmp[mo]={curr:0,prev:0};if(yr===cmpYear)byMoisCmp[mo].curr++;else byMoisCmp[mo].prev++;});
  const CMP_MOIS=['Jan','Fév','Mar','Avr','Mai','Jun','Jul','Aoû','Sep','Oct','Nov','Déc'];
  const dataCmpCurr=Array.from({length:12},(_,i)=>{const m=String(i+1).padStart(2,'0');return byMoisCmp[m]?byMoisCmp[m].curr:0;});
  const dataCmpPrev=Array.from({length:12},(_,i)=>{const m=String(i+1).padStart(2,'0');return byMoisCmp[m]?byMoisCmp[m].prev:0;});

  // 3. Top thématiques × communes
  const byCommTheme={};passes.forEach(e=>{const c=e.commune||'?';const t=e.thematique||'Autre';if(!byCommTheme[c])byCommTheme[c]={};byCommTheme[c][t]=(byCommTheme[c][t]||0)+1;});
  const topComm5=Object.entries(byCommune).sort((a,b)=>b[1]-a[1]).slice(0,5).map(([k])=>k);
  const topThemes5=[...new Set(passes.map(e=>e.thematique||'Autre'))].map(t=>[t,passes.filter(e=>(e.thematique||'Autre')===t).length]).sort((a,b)=>b[1]-a[1]).slice(0,5).map(([t])=>t);
  const THEME_COLORS=['#6366f1','#8b5cf6','#ec4899','#f97316','#eab308'];

  // 4. Orienteurs par conseiller (uniquement entrées avec orienteur renseigné)
  const byConsOri={};passes.forEach(e=>{if(!e.orienteur||!e.orienteur.trim())return;const c=e.conseiller||'?';const o=e.orienteur.trim();if(!byConsOri[c])byConsOri[c]={};byConsOri[c][o]=(byConsOri[c][o]||0)+1;});
  const consListOri=Object.keys(byConsOri).sort();
  const allOri=[...new Set(passes.filter(e=>e.orienteur&&e.orienteur.trim()).map(e=>e.orienteur.trim()))].map(o=>[o,passes.filter(e=>e.orienteur===o).length]).sort((a,b)=>b[1]-a[1]).map(([o])=>o);
  const ORI_COLORS=['#3b82f6','#22c55e','#f97316','#ec4899','#a78bfa','#14b8a6','#f59e0b','#ef4444','#6366f1','#84cc16'];

  // 5. Distribution horaire
  const byHeure={};filtered.forEach(e=>{if(!e.horaire)return;const h=parseInt(String(e.horaire).replace(/[Hh:].*/,''));if(isNaN(h)||h<6||h>19)return;byHeure[h]=(byHeure[h]||0)+1;});
  const dataHoraire=Array.from({length:14},(_,i)=>({label:`${i+6}h`,value:byHeure[i+6]||0}));

  // Années disponibles
  const annees=[...new Set(entries.map(e=>e.date?e.date.slice(0,4):'').filter(Boolean))].sort();

  return CE('div',null,
    // Barre filtre période
    CE('div',{className:'card',style:{marginBottom:12}},
      CE('div',{style:{display:'flex',alignItems:'center',gap:10,flexWrap:'wrap'}},
        CE('span',{style:{fontSize:12,fontWeight:700,color:'#718096',whiteSpace:'nowrap'}},'📅 Période'),
        // Boutons années
        CE('button',{onClick:()=>{setDateFrom('');setDateTo('');},style:{padding:'5px 12px',borderRadius:6,border:`1.5px solid ${!hasFilter?'#1e3a8a':'#e2e8f0'}`,background:!hasFilter?'#1e3a8a':'#fff',color:!hasFilter?'#fff':'#718096',fontSize:12,fontWeight:600,cursor:'pointer'}},'Tout'),
        annees.map(yr=>CE('button',{key:yr,onClick:()=>{setDateFrom(`${yr}-01-01`);setDateTo(`${yr}-12-31`);},style:{padding:'5px 12px',borderRadius:6,border:`1.5px solid ${dateFrom===`${yr}-01-01`&&dateTo===`${yr}-12-31`?'#1e3a8a':'#e2e8f0'}`,background:dateFrom===`${yr}-01-01`&&dateTo===`${yr}-12-31`?'#1e3a8a':'#fff',color:dateFrom===`${yr}-01-01`&&dateTo===`${yr}-12-31`?'#fff':'#718096',fontSize:12,fontWeight:600,cursor:'pointer'}},yr)),
        // Saisie manuelle
        CE('div',{style:{display:'flex',alignItems:'center',gap:6,marginLeft:4}},
          CE('span',{style:{fontSize:12,color:'#718096'}},'Du'),
          CE('input',{type:'date',value:dateFrom,onChange:e=>setDateFrom(e.target.value),style:{padding:'5px 8px',border:'1.5px solid #e2e8f0',borderRadius:6,fontSize:12}}),
          CE('span',{style:{fontSize:12,color:'#718096'}},'Au'),
          CE('input',{type:'date',value:dateTo,onChange:e=>setDateTo(e.target.value),style:{padding:'5px 8px',border:'1.5px solid #e2e8f0',borderRadius:6,fontSize:12}})
        ),
        hasFilter&&CE('span',{style:{fontSize:12,color:'#1e3a8a',fontWeight:600,background:'#eff6ff',padding:'4px 10px',borderRadius:6}},`${filtered.length} / ${entries.length}`),
        CE('button',{className:'btn btn-print btn-sm',style:{marginLeft:'auto'},onClick:()=>window.print()},'🖨️ Imprimer')
      )
    ),
    passes.length===0
      ?CE('div',{className:'card'},CE('p',{style:{color:'#718096',textAlign:'center',padding:'40px 0'}},hasFilter?'Aucun atelier réalisé sur cette période.':'Aucun atelier réalisé.'))
      :CE('div',null,
          CE('div',{className:'kpi-grid'},
            CE(FadeItem,{delay:0,style:{display:'contents'}},CE('div',{className:'kpi',style:{borderLeft:'4px solid #16a34a',background:'#f0fdf4',textAlign:'left'}},CE('div',{className:'val',style:{color:'#16a34a'}},total),CE('div',{className:'lbl'},'Ateliers réalisés'))),
            CE(FadeItem,{delay:0.08,style:{display:'contents'}},CE('div',{className:'kpi',style:{borderLeft:'4px solid #dc2626',background:'#fff5f5',textAlign:'left'}},CE('div',{className:'val',style:{color:'#dc2626'}},annules),CE('div',{className:'lbl'},'Annulés'))),
            CE(FadeItem,{delay:0.16,style:{display:'contents'}},CE('div',{className:'kpi',style:{borderLeft:'4px solid #7c3aed',background:'#faf5ff',textAlign:'left'}},CE('div',{className:'val',style:{color:'#7c3aed'}},totalPresents),CE('div',{className:'lbl'},'Participants présents'))),
            CE(FadeItem,{delay:0.24,style:{display:'contents'}},CE('div',{className:'kpi',style:{borderLeft:'4px solid #0891b2',background:'#ecfeff',textAlign:'left'}},CE('div',{className:'val',style:{color:'#0891b2'}},txPresence+'%'),CE('div',{className:'lbl'},'Taux de présence')))
          ),
          CE('div',{className:'dashboard-charts',style:{display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:16}},
            CE('div',{className:'card'},CE('h2',null,'Ateliers par mois (révolus)'),CE(LineChart,{data:dataMois})),
            CE('div',{className:'card'},CE('h2',null,'Présents par mois (révolus)'),CE(LineChart,{data:dataMoisPresents})),
            CE('div',{className:'card'},CE('h2',null,'Par commune'),CE(BarChart,{data:dataCommune,colors:['#1e3a8a','#3b82f6','#60a5fa','#93c5fd','#1e40af','#2563eb','#1d4ed8','#1e3a8a']})),
            CE('div',{className:'card'},CE('h2',null,'Par type de public'),CE(BarChart,{data:dataPublic,colors:['#7C3AED','#2563EB','#059669','#DB2777','#d97706','#0891b2','#65a30d','#dc2626']})),
            CE('div',{className:'card'},CE('h2',null,'📅 Planifiés — mois à venir'),CE(BarChart,{data:dataFutur,colors:['#7c3aed','#8b5cf6','#a78bfa','#c4b5fd']})),
            CE('div',{className:'card'},CE('h2',null,'Par statut'),CE(RadialChart,{data:dataStat,colors:['#276749','#2a69ac','#9b2c2c','#718096','#744210']})),
            CE('div',{className:'card',style:{gridColumn:'1 / -1'}},CE('h2',null,'📈 Inscrits vs Présents par mois'),CE(DualLineChart,{data:dataDual})),
            CE('div',{className:'card'},CE('h2',null,'🌅 Répartition Matin / Après-midi'),CE(DonutChart,{data:dataAmPm,colors:['#f97316','#0891b2'],height:200})),

            // ── Taux de réalisation mensuel ──
            dataTxRealisation.length>1&&CE('div',{className:'card',style:{gridColumn:'1 / -1'}},
              CE('h2',null,'📉 Taux de réalisation mensuel (%)'),
              CE(EChart,{height:220,option:{backgroundColor:'transparent',grid:{...EC_GRID},
                tooltip:{trigger:'axis',...EC_TT,...EC_APN,formatter:p=>`<b style="color:#60a5fa">${p[0].name}</b><br/>Taux : <b>${p[0].value}%</b>`},
                xAxis:{data:dataTxRealisation.map(d=>d.label),...EC_AXIS_BASE,splitLine:{show:false},axisLabel:{...EC_AXIS_LABEL,rotate:dataTxRealisation.length>8?-35:0,interval:0}},
                yAxis:{...EC_AXIS_BASE,min:0,max:100,axisLabel:{...EC_AXIS_LABEL,formatter:v=>v+'%'}},
                series:[
                  {type:'line',data:dataTxRealisation.map(d=>d.value),smooth:true,symbol:'circle',symbolSize:5,
                    lineStyle:{width:2.5,color:'#22c55e'},
                    itemStyle:{color:p=>dataTxRealisation[p.dataIndex].value>=70?'#22c55e':dataTxRealisation[p.dataIndex].value>=40?'#f97316':'#ef4444'},
                    areaStyle:{color:mkGrad('rgba(34,197,94,0.2)','rgba(34,197,94,0.02)')},
                    label:{show:true,position:'top',color:'#94a3b8',fontSize:9,fontWeight:'bold',formatter:p=>p.value+'%'}},
                  {type:'line',data:dataTxRealisation.map(()=>70),silent:true,symbol:'none',
                    lineStyle:{width:1.5,color:'#f97316',type:'dashed'}}
                ]
              }})
            ),

            // ── Comparaison N vs N-1 ──
            (dataCmpCurr.some(v=>v>0)||dataCmpPrev.some(v=>v>0))&&CE('div',{className:'card',style:{gridColumn:'1 / -1'}},
              CE('h2',null,`📊 Comparaison ${cmpYear} vs ${prevCmpYear}`),
              CE(EChart,{height:240,option:{backgroundColor:'transparent',grid:{...EC_GRID,bottom:55},
                tooltip:{trigger:'axis',...EC_TT,...EC_APN},
                legend:{data:[String(cmpYear),String(prevCmpYear)],textStyle:{color:'#94a3b8',fontSize:11},bottom:0,icon:'roundRect',itemWidth:10,itemHeight:8},
                xAxis:{data:CMP_MOIS,...EC_AXIS_BASE,splitLine:{show:false},axisLabel:{...EC_AXIS_LABEL,interval:0}},
                yAxis:{...EC_AXIS_BASE},
                series:[
                  {name:String(cmpYear),type:'bar',barMaxWidth:20,data:dataCmpCurr,itemStyle:{color:'#3b82f6',borderRadius:[4,4,0,0]},
                    label:{show:true,position:'top',color:'#94a3b8',fontSize:9,fontWeight:'bold'}},
                  {name:String(prevCmpYear),type:'bar',barMaxWidth:20,data:dataCmpPrev,itemStyle:{color:'rgba(148,163,184,0.4)',borderRadius:[4,4,0,0]},
                    label:{show:true,position:'top',color:'#94a3b8',fontSize:9,fontWeight:'bold'}}
                ]
              }})
            ),

            // ── Top thématiques × communes ──
            topComm5.length>0&&topThemes5.length>0&&CE('div',{className:'card',style:{gridColumn:'1 / -1'}},
              CE('h2',null,'🗂️ Top thématiques × communes'),
              CE(EChart,{height:Math.max(200,80+topComm5.length*32),option:{backgroundColor:'transparent',grid:{top:28,right:8,bottom:48,left:8,containLabel:true},
                tooltip:{trigger:'axis',...EC_TT,...EC_APN},
                legend:{data:topThemes5,textStyle:{color:'#94a3b8',fontSize:10},bottom:0,icon:'roundRect',itemWidth:10,itemHeight:8,type:'scroll'},
                xAxis:{...EC_AXIS_BASE},
                yAxis:{type:'category',data:topComm5.map(c=>trunc(c,18)),axisLabel:{...EC_AXIS_LABEL,fontSize:11},axisLine:{show:false},axisTick:{show:false},splitLine:{show:false}},
                series:topThemes5.map((t,i)=>({name:t,type:'bar',stack:'total',barMaxWidth:28,
                  data:topComm5.map(c=>(byCommTheme[c]&&byCommTheme[c][t])||0),
                  itemStyle:{color:THEME_COLORS[i%THEME_COLORS.length],borderRadius:i===topThemes5.length-1?[0,4,4,0]:[]},
                  label:{show:true,position:'inside',color:'#fff',fontSize:9,formatter:p=>p.value>0?p.value:''}
                }))
              }})
            ),

            // ── Orienteurs par conseiller ──
            consListOri.length>0&&allOri.length>1&&CE('div',{className:'card',style:{gridColumn:'1 / -1'}},
              CE('h2',null,'🔀 Orienteurs par conseiller'),
              CE(EChart,{height:Math.max(200,80+consListOri.length*34),option:{backgroundColor:'transparent',grid:{top:28,right:8,bottom:55,left:8,containLabel:true},
                tooltip:{trigger:'axis',...EC_TT,...EC_APN},
                legend:{data:allOri.slice(0,10),textStyle:{color:'#94a3b8',fontSize:10},bottom:0,icon:'roundRect',itemWidth:10,itemHeight:8,type:'scroll'},
                xAxis:{...EC_AXIS_BASE},
                yAxis:{type:'category',data:consListOri.map(c=>trunc(c,14)),axisLabel:{...EC_AXIS_LABEL,fontSize:11},axisLine:{show:false},axisTick:{show:false},splitLine:{show:false}},
                series:allOri.slice(0,10).map((o,i)=>({name:o,type:'bar',stack:'total',barMaxWidth:28,
                  data:consListOri.map(c=>(byConsOri[c]&&byConsOri[c][o])||0),
                  itemStyle:{color:ORI_COLORS[i%ORI_COLORS.length],borderRadius:i===Math.min(allOri.length,10)-1?[0,4,4,0]:[]},
                  label:{show:true,position:'inside',color:'#fff',fontSize:9,formatter:p=>p.value>0?p.value:''}
                }))
              }})
            ),

            // ── Distribution horaire ──
            dataHoraire.some(d=>d.value>0)&&CE('div',{className:'card'},
              CE('h2',null,'🕐 Distribution horaire'),
              CE(EChart,{height:200,option:{backgroundColor:'transparent',grid:{...EC_GRID},
                tooltip:{trigger:'axis',...EC_TT,...EC_APN,formatter:p=>`<b style="color:#60a5fa">${p[0].name}</b><br/>${p[0].value} atelier(s)`},
                xAxis:{data:dataHoraire.map(d=>d.label),...EC_AXIS_BASE,splitLine:{show:false},axisLabel:{...EC_AXIS_LABEL,interval:0}},
                yAxis:{...EC_AXIS_BASE},
                series:[{type:'bar',barMaxWidth:36,
                  data:dataHoraire.map(d=>({value:d.value,itemStyle:{color:parseInt(d.label)<12?'#f97316':'#0891b2',borderRadius:[4,4,0,0]}})),
                  label:{show:true,position:'top',color:'#94a3b8',fontSize:9,fontWeight:'bold',formatter:p=>p.value||''}
                }]
              }})
            )
          )
        )
  );
}

// ═══════════════════════════════════════════════════════════
// VUE CARTE
// ═══════════════════════════════════════════════════════════
// Cache GPS dynamique pour les communes non présentes dans COMMUNES_GPS
const GPS_DYN_CACHE={};
async function fetchGPSCommune(communeRaw){
  const norm=communeRaw.toUpperCase().normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/-/g,' ').replace(/'/g,' ').replace(/\s*\(\d+\)\s*/g,'').replace(/\s+/g,' ').trim();
  if(GPS_DYN_CACHE[norm])return GPS_DYN_CACHE[norm];
  // Extrait le code postal si présent ("FUMEL (47500)" → "47500")
  const cpMatch=communeRaw.match(/\((\d{5})\)/);
  const url=cpMatch
    ?`https://geo.api.gouv.fr/communes?codePostal=${cpMatch[1]}&fields=centre&format=json`
    :`https://geo.api.gouv.fr/communes?nom=${encodeURIComponent(norm)}&codeDepartement=47&fields=centre&format=json`;
  try{
    const res=await fetch(url);const data=await res.json();
    if(data&&data[0]&&data[0].centre){
      const[lng,lat]=data[0].centre.coordinates;
      GPS_DYN_CACHE[norm]={lat,lng};return{lat,lng};
    }
  }catch(e){}
  GPS_DYN_CACHE[norm]=null;return null;
}

// ── Contours des communes (geo.api.gouv.fr) ────────────────────────────────
// Couche de repère géographique dessinée SOUS les pastilles : elle situe les
// communes sans rien coûter à la lecture des données, les pastilles gardant
// l'encodage volume (rayon) et réalisation (couleur).
// Trois précautions, parce que la charge utile est de l'ordre du Mo :
//  1. chargée au premier affichage de l'onglet Carte, jamais au démarrage ;
//  2. mémorisée pour la session (CONTOURS_CACHE) et partagée entre index et
//     admin — pas de localStorage : la taille dépasserait le quota de 5 Mo sur
//     certains navigateurs, et le cache HTTP de geo.api.gouv.fr fait déjà le
//     travail d'une visite à l'autre ;
//  3. purement décorative — si l'appel échoue, la carte reste celle
//     d'aujourd'hui, sans message d'erreur.
// ⚠️ NON VÉRIFIÉ : l'API n'était pas joignable depuis l'environnement de
// développement (proxy). La forme exacte de la réponse n'a donc pas pu être
// constatée — le code accepte les deux que geo.api.gouv.fr peut renvoyer
// (FeatureCollection, ou tableau de communes portant chacune un `contour`).
// À confirmer au premier affichage réel.
let CONTOURS_CACHE = null;
let CONTOURS_PROMISE = null;
function chargerContoursCommunes(){
  if(CONTOURS_CACHE) return Promise.resolve(CONTOURS_CACHE);
  if(CONTOURS_PROMISE) return CONTOURS_PROMISE;
  const url='https://geo.api.gouv.fr/departements/47/communes'
           +'?fields=nom,code,contour&format=geojson&geometry=contour';
  CONTOURS_PROMISE=fetch(url).then(r=>r.ok?r.json():null).then(data=>{
    let fc=null;
    if(data&&data.type==='FeatureCollection'&&Array.isArray(data.features)){
      fc=data;
    }else if(Array.isArray(data)){
      // Forme JSON simple : chaque commune porte son `contour` en GeoJSON.
      fc={type:'FeatureCollection',features:data.filter(c=>c&&c.contour).map(c=>(
        {type:'Feature',properties:{nom:c.nom,code:c.code},geometry:c.contour}))};
    }
    if(!fc||!fc.features.length) return null;
    CONTOURS_CACHE=fc;return fc;
  }).catch(()=>null);
  return CONTOURS_PROMISE;
}
// Dessine les contours dans un panneau dédié placé entre les tuiles (200) et
// les pastilles (400). Sans ce panneau, l'ordre dépendrait de l'ordre d'ajout
// dans le SVG : buildMarkers réinsère les pastilles à chaque changement de
// filtre, et un jour l'une d'elles passerait dessous.
// pointerEvents none + interactive false : les clics traversent les polygones
// et atteignent les pastilles, y compris dans les zones sans pastille.
function ajouterContours(map){
  // typeof createPane : les stubs Leaflet des suites navigateur n'implémentent
  // qu'une poignée de méthodes. Une couche décorative ne doit pas faire tomber
  // une page parce qu'elle manque — elle s'efface.
  if(!map||typeof map.createPane!=='function'||map.getPane('contours')) return;
  const pane=map.createPane('contours');
  pane.style.zIndex='350';
  pane.style.pointerEvents='none';
  chargerContoursCommunes().then(fc=>{
    if(!fc||!map||!map.getPane('contours')||typeof L.geoJSON!=='function') return;
    L.geoJSON(fc,{pane:'contours',interactive:false,style:{
      color:'#64748b',weight:1,opacity:.55,fill:true,fillColor:'#94a3b8',fillOpacity:.06
    }}).addTo(map);
  });
}

function VueCarte({entries,active}){
  const CE=React.createElement;
  const mapRef=React.useRef(null);
  const markersRef=React.useRef([]);
  const[, forceUpdate]=React.useReducer(x=>x+1,0);
  // Récupère la liste unique des conseillers présents dans les données
  const conseillers=React.useMemo(()=>{
    const s=new Set();entries.forEach(e=>{if(e.conseiller)s.add(e.conseiller);if(e.co_animateur)s.add(e.co_animateur);});return['Tous',...Array.from(s).sort()];
  },[entries]);
  const[filtreConum,setFiltreConum]=React.useState('Tous');
  const[modeAffichage,setModeAffichage]=React.useState('realisation'); // 'realisation' | 'conum'

  function buildMarkers(entriesToUse,mode){
    if(!mapRef.current)return;
    // Nettoyer les anciens marqueurs
    markersRef.current.forEach(m=>m.remove());
    markersRef.current=[];
    const byC={};
    entriesToUse.forEach(e=>{
      if(!byC[e.commune])byC[e.commune]={total:0,realises:0,planifies:0,presents:0,conums:new Set()};
      byC[e.commune].total++;
      if(e.conseiller)byC[e.commune].conums.add(e.conseiller);
      if(e.co_animateur)byC[e.commune].conums.add(e.co_animateur);
      if(e.statut==='Réalisé'){byC[e.commune].realises++;byC[e.commune].presents+=(parseInt(e.presents)||0);}
      if(e.statut==='Planifié')byC[e.commune].planifies++;
    });
    function markerColor(pct){if(pct>=70)return{fill:'#22c55e',stroke:'#166534'};if(pct>=40)return{fill:'#f97316',stroke:'#9a3412'};return{fill:'#3b82f6',stroke:'#1d4ed8'};}
    function normGPS(s){return s.toUpperCase().normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/-/g,' ').replace(/'/g,' ').replace(/\s*\(\d+\)\s*/g,'').replace(/\s+/g,' ').trim();}
    function addMarker(commune,s,g){
      const pct=s.total>0?Math.round(s.realises/s.total*100):0;
      let fillColor,strokeColor;
      if(mode==='conum'){
        if(filtreConum!=='Tous'){
          fillColor=conseillerColor(filtreConum);strokeColor='#1e3a8a';
        } else {
          const domConum=Array.from(s.conums).reduce((best,c)=>{
            const cnt=entriesToUse.filter(e=>e.commune===commune&&(e.conseiller===c||e.co_animateur===c)).length;
            return cnt>(best.cnt||0)?{c,cnt}:best;
          },{});
          fillColor=domConum.c?conseillerColor(domConum.c):'#94a3b8';
          strokeColor='#1e3a8a';
        }
      } else {
        const mc=markerColor(pct);fillColor=mc.fill;strokeColor=mc.stroke;
      }
      const conumsList=Array.from(s.conums).join(', ')||'—';
      const popup=`<div style="min-width:175px;font-family:'Segoe UI',sans-serif;font-size:13px"><strong style="font-size:14px;color:#1e3a8a">${commune}</strong><div style="margin:6px 0 2px;color:#4a5568">Total : ${s.total}</div><div style="color:#276749;font-weight:600">Réalisés : ${s.realises}</div><div style="color:#2a69ac;font-weight:600">Planifiés : ${s.planifies}</div><div style="color:#4a5568">Présents : ${s.presents}</div><div style="margin-top:6px;padding-top:6px;border-top:1px solid #e2e8f0;font-size:11px;color:#6b7280">Conseiller(s) :<br><strong style="color:#1e3a8a">${conumsList}</strong></div><div style="background:#e2e8f0;border-radius:4px;height:6px;margin-top:8px;overflow:hidden"><div style="background:#059669;width:${Math.max(2,pct)}%;height:100%;border-radius:4px"></div></div><div style="font-size:11px;color:#718096;margin-top:3px">${pct}% réalisé</div></div>`;
      const m=L.circleMarker([g.lat,g.lng],{radius:Math.min(8+s.total*0.8,26),fillColor,color:strokeColor,weight:2,opacity:1,fillOpacity:.82}).addTo(mapRef.current).bindPopup(popup,{maxWidth:230});
      markersRef.current.push(m);
    }
    const unknowns=[];
    Object.entries(byC).forEach(([commune,s])=>{
      const normC=normGPS(commune);
      const g=COMMUNES_GPS[commune]||COMMUNES_GPS[normC]||Object.entries(COMMUNES_GPS).find(([k])=>normGPS(k)===normC)?.[1];
      if(!g){
        if(GPS_DYN_CACHE[normC]===undefined)unknowns.push(commune);
        else if(GPS_DYN_CACHE[normC])addMarker(commune,s,GPS_DYN_CACHE[normC]);
        return;
      }
      addMarker(commune,s,g);
    });
    if(unknowns.length){
      Promise.all(unknowns.map(c=>fetchGPSCommune(c))).then(()=>forceUpdate());
    }
  }

  // Init carte
  React.useEffect(()=>{
    if(!active||mapRef.current)return;
    if(!window.L){console.error('Leaflet non chargé');return;}
    mapRef.current=L.map('map-container').setView([44.35,0.52],9);
    // Fond de carte : OpenStreetMap France (tile.openstreetmap.fr/osmfr).
    // Remplace basemaps.cartocdn.com, dont l'offre gratuite a fermé. Pas de
    // {r} : le style osmfr n'a pas de variante retina, le garder demanderait
    // des tuiles @2x qui n'existent pas (404 sur chaque tuile en écran HiDPI).
    // Service associatif : l'attribution ci-dessous n'est pas décorative, elle
    // fait partie des conditions d'usage — ne pas la retirer.
    L.tileLayer('https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png',{
      attribution:'© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> — tuiles <a href="https://openstreetmap.fr">OSM France</a>',
      subdomains:'abc',maxZoom:20
    }).addTo(mapRef.current);
    ajouterContours(mapRef.current);
    buildMarkers(entries,modeAffichage);
  },[active]);

  // Redessiner quand filtre ou mode change
  React.useEffect(()=>{
    if(!mapRef.current)return;
    const filtered=filtreConum==='Tous'?entries:entries.filter(e=>e.conseiller===filtreConum||e.co_animateur===filtreConum);
    buildMarkers(filtered,modeAffichage);
  },[filtreConum,modeAffichage,entries]);

  // Légende selon le mode
  const legende=modeAffichage==='realisation'
    ? CE('div',{style:{display:'flex',gap:16,flexWrap:'wrap',fontSize:12,color:'#4a5568'}},
        CE('span',null,CE('span',{style:{display:'inline-block',width:12,height:12,borderRadius:'50%',background:'#22c55e',marginRight:5,verticalAlign:'middle'}}),'≥ 70% réalisés'),
        CE('span',null,CE('span',{style:{display:'inline-block',width:12,height:12,borderRadius:'50%',background:'#f97316',marginRight:5,verticalAlign:'middle'}}),'40 – 70%'),
        CE('span',null,CE('span',{style:{display:'inline-block',width:12,height:12,borderRadius:'50%',background:'#3b82f6',marginRight:5,verticalAlign:'middle'}}),'< 40%')
      )
    : CE('div',{style:{display:'flex',gap:8,flexWrap:'wrap',fontSize:12,alignItems:'center'}},
        CE('span',{style:{fontSize:11,color:'#94a3b8',marginRight:4}},filtreConum==='Tous'?'Conseiller dominant par commune :':'Conseiller sélectionné :'),
        conseillers.filter(c=>c!=='Tous').map(c=>CE('span',{key:c,style:{display:'inline-flex',alignItems:'center',gap:4,background:'#f1f5f9',borderRadius:12,padding:'2px 8px',opacity:filtreConum==='Tous'||filtreConum===c?1:0.35}},
          CE('span',{style:{display:'inline-block',width:10,height:10,borderRadius:'50%',background:conseillerColor(c),flexShrink:0}}),c.split(' ')[0]
        ))
      );

  return CE('div',null,
    CE('div',{style:{display:'flex',justifyContent:'flex-end',marginBottom:8}},CE('button',{className:'btn btn-print btn-sm',onClick:()=>window.print()},'🖨️ Imprimer')),
    CE('div',{className:'card'},
      CE('h2',null,'🗺️ Carte des communes'),
      // Barre de filtres
      CE('div',{style:{display:'flex',gap:10,marginBottom:12,flexWrap:'wrap',alignItems:'center'}},
        // Mode
        CE('div',{style:{display:'flex',gap:4}},
          CE('button',{onClick:()=>setModeAffichage('realisation'),style:{fontSize:11,padding:'4px 10px',borderRadius:6,border:'none',background:modeAffichage==='realisation'?'#1e3a8a':'#e5e7eb',color:modeAffichage==='realisation'?'#fff':'#374151',cursor:'pointer',fontWeight:modeAffichage==='realisation'?700:400}},'📊 Réalisation'),
          CE('button',{onClick:()=>setModeAffichage('conum'),style:{fontSize:11,padding:'4px 10px',borderRadius:6,border:'none',background:modeAffichage==='conum'?'#1e3a8a':'#e5e7eb',color:modeAffichage==='conum'?'#fff':'#374151',cursor:'pointer',fontWeight:modeAffichage==='conum'?700:400}},'👤 Par conum')
        ),
        // Filtre conum (visible dans les 2 modes)
        CE('div',{className:'chip-bar',style:{margin:0}},
          conseillers.map(c=>CE('span',{key:c,className:'chip'+(c==='Tous'?' chip-all':'')+(filtreConum===c?' active':''),style:c!=='Tous'?{color:conseillerColor(c)}:{},onClick:()=>setFiltreConum(p=>p===c&&c!=='Tous'?'Tous':c)},
            CE('span',{className:'chip-dot',style:c!=='Tous'?{background:conseillerColor(c)}:{}}),c))
        )
      ),
      // Légende
      CE('div',{style:{marginBottom:10}},legende),
      CE('div',{id:'map-container'})
    )
  );
}

// ═══════════════════════════════════════════════════════════
// VUE BINGO — par commune
// ═══════════════════════════════════════════════════════════

// ── Conflits matériel — helpers partagés (Anomalies + Frise) ────────────────
// Portés depuis ATELIERS_NEWGEN. estConflitPasse/periodePretMateriel/
// getPretsMateriel/totauxParJourMateriel/findOrdinateursConflicts vivent
// dans logic.js (chargé avant, en global navigateur).
// 'AM' | 'PM' | 'AM+PM' → libellé lisible. Le créneau change la correction à
// apporter : un dépassement l'après-midi seulement se règle en déplaçant un
// atelier le matin, pas en renonçant à du matériel.
function libelleDemi(d){return d==='AM'?'le matin':d==='PM'?'l\'après-midi':'toute la journée';}
function titreConflitOrdi(g){return '📅 '+fmtPeriode(g.date,g.dateFin)+' '+libelleDemi(g.demi)+' — jusqu\'à '+g.total+' ordinateurs demandés sur '+STOCK_ORDINATEURS+' en stock';}
// findMobileClassConflicts pousse l'entry brute dans chaque groupe : nb_
// ordinateurs/date_retour_materiel sont déjà là, pas besoin de les recalculer.
function itemConflitMobile(onEdit){
  return e=>CE('div',{key:e._id,style:{display:'flex',flexDirection:'column',gap:2,fontSize:12,padding:'4px 0'}},
    CE('div',{style:{display:'flex',alignItems:'center',gap:8,flexWrap:'wrap'}},
      CE('span',{style:{fontWeight:600,color:conseillerColor(e.conseiller)}},e.conseiller||'—'),
      CE('span',{style:{color:'#6b7280'}},e.thematique||''),
      CE('span',{style:{color:'#9ca3af'}},e.commune||''),
      onEdit&&CE('button',{onClick:()=>onEdit(e._id),style:{fontSize:11,padding:'2px 8px',borderRadius:4,border:'1px solid #3b82f6',background:'#eff6ff',color:'#1d4ed8',cursor:'pointer',marginLeft:'auto'}},'✏️ Ouvrir')
    ),
    (parseInt(e.nb_ordinateurs)>0)&&CE('div',{style:{color:'#9ca3af',fontSize:11}},
      '🖥️ '+e.nb_ordinateurs+' ordinateur(s)'+(e.date_retour_materiel?' — retour prévu '+fmtDate(e.date_retour_materiel):''))
  );
}
function itemConflitOrdi(onEdit){
  return e=>CE('div',{key:e._id,style:{display:'flex',flexDirection:'column',gap:2,fontSize:12,padding:'4px 0'}},
    CE('div',{style:{display:'flex',alignItems:'center',gap:8,flexWrap:'wrap'}},
      CE('span',{style:{fontWeight:600,color:conseillerColor(e.conseiller)}},e.conseiller||'—'),
      CE('span',{style:{color:'#6b7280'}},e.qte+' ordinateur(s)'),
      onEdit&&CE('button',{onClick:()=>onEdit(e._id),style:{fontSize:11,padding:'2px 8px',borderRadius:4,border:'1px solid #3b82f6',background:'#eff6ff',color:'#1d4ed8',cursor:'pointer',marginLeft:'auto'}},'✏️ Ouvrir')
    ),
    CE('div',{style:{color:'#9ca3af',fontSize:11}}, ([e.commune,e.lieu].filter(Boolean).join(' · ')||'—')+' — '+fmtPeriode(e.dateDebut,e.dateFin))
  );
}
// Rendu d'une liste de groupes de conflits (par date) — réutilisé par les
// deux catégories de VueAnomalies (Classe mobile même jour / stock
// ordinateurs). renderTitre(g) et renderItem(e,g) laissent chaque catégorie
// personnaliser son contenu, seule la coquille (état vide vs liste) est
// commune. Une fois la date de l'atelier passée, plus rien à décider — le
// conflit bascule dans une section "Historique" séparée (grisée), sous les
// conflits encore actifs/à venir, plutôt que de rester mélangé avec eux.
function BlocConflits({groupes,vide,bg,border,titreColor,renderTitre,renderItem}){
  if(groupes.length===0)return CE('div',{style:{textAlign:'center',padding:'40px 0',color:'#16a34a',fontSize:14}},
    CE('div',{style:{fontSize:32,marginBottom:8}},'✅'), vide
  );
  const today=todayLocal();
  const actifs=groupes.filter(g=>!estConflitPasse(g,today));
  const historique=groupes.filter(g=>estConflitPasse(g,today));
  const carte=(g,muted)=>CE('div',{key:g.date,style:{background:muted?'#f8fafc':bg,border:'1px solid '+(muted?'#e2e8f0':border),borderRadius:8,padding:'10px 14px',opacity:muted?.75:1}},
    CE('div',{style:{fontWeight:700,fontSize:12,color:muted?'#64748b':titreColor,marginBottom:6}},renderTitre(g)),
    CE('div',{style:{display:'flex',flexDirection:'column',gap:4}}, g.entries.map(e=>renderItem(e,g)))
  );
  return CE('div',{style:{display:'flex',flexDirection:'column',gap:8}},
    actifs.length===0
      ?CE('div',{style:{textAlign:'center',padding:'16px 0',color:'#16a34a',fontSize:13}},'✅ Aucun conflit actif ou à venir')
      :actifs.map(g=>carte(g,false)),
    historique.length>0&&CE('div',{style:{marginTop:4}},
      CE('div',{style:{fontSize:11,fontWeight:700,color:'#9ca3af',textTransform:'uppercase',letterSpacing:'.04em',margin:'4px 0 6px'}},'🗄️ Historique — dates passées'),
      CE('div',{style:{display:'flex',flexDirection:'column',gap:8}}, historique.map(g=>carte(g,true)))
    )
  );
}
// Frise/Gantt du parc d'ordinateurs : une ligne par prêt Classe mobile, une
// barre du prélèvement au retour sur un axe de dates — les chevauchements
// sautent aux yeux visuellement, plus besoin de lire chaque carte de
// conflit une par une. Fenêtre de 28 jours navigable (± 1 semaine par clic).
const FRISE_NB_JOURS=28;
function FriseMateriel({entries,onEdit}){
  const[offset,setOffset]=React.useState(0);
  const[agrandi,setAgrandi]=React.useState(false);
  const[exportEnCours,setExportEnCours]=React.useState(false);
  const today=todayLocal();
  const jourDebut=addJoursIso(today,offset);
  const jours=React.useMemo(()=>Array.from({length:FRISE_NB_JOURS},(_,i)=>addJoursIso(jourDebut,i)),[jourDebut]);
  const jourFin=jours[jours.length-1];
  const prets=React.useMemo(()=>getPretsMateriel(entries),[entries]);
  const pretsVisibles=React.useMemo(()=>prets.filter(p=>p.fin>=jourDebut&&p.debut<=jourFin).sort((a,b)=>a.debut<b.debut?-1:a.debut>b.debut?1:0),[prets,jourDebut,jourFin]);
  // Détail par demi-journée : c'est lui qui décide du dépassement, la case
  // n'affichant que la pointe de la journée (le max des deux).
  const detail=React.useMemo(()=>totauxParDemiJourneeMateriel(prets,jours),[prets,jours]);
  const totaux=React.useMemo(()=>{const t={};Object.keys(detail).forEach(j=>{t[j]=Math.max(detail[j].AM,detail[j].PM);});return t;},[detail]);
  // Index (0-based) d'un jour dans la fenêtre visible, clampé aux bornes —
  // une barre qui déborde de la fenêtre est simplement tronquée à l'affichage.
  const colIdx=d=>d<jourDebut?0:d>jourFin?jours.length-1:jours.indexOf(d);
  const MOIS_ABREGE=['jan','fév','mar','avr','mai','jun','jul','aoû','sep','oct','nov','déc'];
  const jourLabel=d=>{const[y,m,j]=d.split('-');return{num:parseInt(j,10),mois:MOIS_ABREGE[parseInt(m,10)-1],weekend:[0,6].includes(new Date(parseInt(y,10),parseInt(m,10)-1,parseInt(j,10)).getDay())};};
  const navBoutons=CE('div',{style:{display:'flex',gap:6}},
    CE('button',{onClick:()=>setOffset(o=>o-7),style:{padding:'4px 10px',border:'1px solid #e2e8f0',borderRadius:6,background:'#fff',cursor:'pointer',fontSize:12}},'◀ Semaine'),
    CE('button',{onClick:()=>setOffset(0),style:{padding:'4px 10px',border:'1px solid #e2e8f0',borderRadius:6,background:offset===0?'#eff6ff':'#fff',color:offset===0?'#1d4ed8':'#1a202c',cursor:'pointer',fontSize:12}},'Aujourd\'hui'),
    CE('button',{onClick:()=>setOffset(o=>o+7),style:{padding:'4px 10px',border:'1px solid #e2e8f0',borderRadius:6,background:'#fff',cursor:'pointer',fontSize:12}},'Semaine ▶')
  );
  // colWidth/tailleTexte paramétrables : version compacte dans la carte,
  // version agrandie dans le panneau plein écran (au clic sur 🔍 Agrandir).
  // printable=true uniquement sur l'appel compact : c'est lui la cible de
  // l'impression (position:fixed est peu fiable à l'impression selon les
  // navigateurs, le panneau plein écran est donc explicitement masqué en
  // print — voir plus bas — et ne doit pas recevoir les mêmes classes, sinon
  // les deux grilles se superposeraient sur le papier si les deux étaient
  // montées en même temps).
  function renderGrille(colWidth,tailleTexte,printable){
    const gridTemplate='140px repeat('+jours.length+',minmax('+colWidth+'px,1fr))';
    if(pretsVisibles.length===0)return CE('div',{style:{textAlign:'center',padding:'24px 0',color:'#16a34a',fontSize:13}},'✅ Aucun prêt Classe mobile sur cette période');
    return CE('div',{className:printable?'frise-grid-wrap':undefined,style:{minWidth:jours.length*colWidth+140}},
      // En-tête jours
      CE('div',{className:printable?'frise-grid-row':undefined,style:{display:'grid',gridTemplateColumns:gridTemplate,gap:1}},
        CE('div',null),
        jours.map(d=>{const l=jourLabel(d);const estAujourdhui=d===today;
          return CE('div',{key:d,style:{textAlign:'center',fontSize:tailleTexte,color:estAujourdhui?'#1d4ed8':l.weekend?'#cbd5e0':'#9ca3af',fontWeight:estAujourdhui?700:400,padding:'2px 0',borderBottom:estAujourdhui?'2px solid #1d4ed8':'2px solid transparent'}},l.num+' '+l.mois);
        })
      ),
      // Ligne stock cumulé
      CE('div',{className:printable?'frise-grid-row':undefined,style:{display:'grid',gridTemplateColumns:gridTemplate,gap:1,marginBottom:6}},
        CE('div',{style:{fontSize:tailleTexte+1,fontWeight:700,color:'#718096',alignSelf:'center'}},'Stock ('+STOCK_ORDINATEURS+')'),
        jours.map(d=>{const dt=detail[d]||{AM:0,PM:0};const t=Math.max(dt.AM,dt.PM);
          const depasse=t>STOCK_ORDINATEURS;
          const quand=dt.AM===dt.PM?'':' (matin '+dt.AM+' · après-midi '+dt.PM+')';
          return CE('div',{key:d,title:t+' ordinateur(s) réservé(s)'+quand,style:{height:colWidth<32?14:22,background:t===0?'#f1f5f9':depasse?'#dc2626':'#86efac',borderRadius:2,fontSize:tailleTexte,color:depasse?'#fff':'#166534',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:700}},t>0?t:'');
        })
      ),
      // Une ligne par prêt
      CE('div',{style:{display:'flex',flexDirection:'column',gap:colWidth<32?3:6}},
        pretsVisibles.map(p=>{
          const debutIdx=colIdx(p.debut),finIdx=colIdx(p.fin),atelierIdx=colIdx(p.dateAtelier);
          // Le marquage ⚠️ suit l'occupation réelle, pas la barre dessinée : le
          // jour du retour est affiché mais ne réserve plus le stock, il ne doit
          // donc pas faire passer ce prêt en conflit.
          const conflit=jours.some(d=>['AM','PM'].some(dm=>
            occupeCreneauMateriel(p,d,dm)&&((detail[d]&&detail[d][dm])||0)>STOCK_ORDINATEURS));
          // Barre teintée dans la couleur du conum (même couleur que le
          // libellé à gauche et que partout ailleurs dans l'appli), plutôt
          // qu'un bleu/rouge générique — identifier qui réserve quoi d'un
          // coup d'œil sur la frise. Le conflit reste visible (bordure rouge
          // épaissie + ⚠️ + texte rouge) : la couleur ne doit pas faire
          // disparaître le signal que ce composant existe pour donner.
          const cCol=conseillerColor(p.conseiller);
          return CE('div',{key:p._id,className:printable?'frise-grid-row':undefined,style:{display:'grid',gridTemplateColumns:gridTemplate,gap:1,alignItems:'center'}},
            CE('div',{style:{fontSize:tailleTexte+2,fontWeight:600,color:cCol,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis',paddingRight:4}},p.conseiller||'—'),
            CE('div',{style:{gridColumn:(debutIdx+2)+' / '+(finIdx+3),gridRow:'1',background:cCol+'22',border:(conflit?'2px solid #dc2626':'1px solid '+cCol),borderRadius:6,padding:'2px 6px',fontSize:tailleTexte+1,color:conflit?'#7f1d1d':cCol,fontWeight:600,cursor:onEdit?'pointer':'default',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'},onClick:()=>onEdit&&onEdit(p._id),title:(p.commune||'')+' · '+p.qte+' ordinateur(s) · '+fmtPeriode(p.debut,p.fin)},
              (conflit?'⚠️ ':'')+p.qte+' 🖥️ '+(p.commune||'')),
            // Repère du jour de l'atelier (distinct du prélèvement/retour qui
            // entourent la barre) — un triangle superposé, sans bloquer le
            // clic sur la barre en dessous.
            CE('div',{key:p._id+'_mark',title:'Atelier le '+fmtDate(p.dateAtelier),style:{gridColumn:(atelierIdx+2)+' / '+(atelierIdx+3),gridRow:'1',alignSelf:'start',justifySelf:'center',pointerEvents:'none',fontSize:tailleTexte+3,lineHeight:1,color:'#1a202c',transform:'translateY(-70%)'}},'▼')
          );
        })
      )
    );
  }
  const legende=CE('div',{style:{fontSize:10,color:'#94a3b8',marginBottom:8}},'▼ = jour de l\'atelier (entre le prélèvement et le retour de la barre) · le jour du retour ne réserve plus le stock (retour le matin) · un prêt d\'une seule journée ne réserve que sa demi-journée (AM/PM)');
  return CE(React.Fragment,null,
    CE('div',{className:'card',style:{maxWidth:'100%',margin:'0 auto 16px',overflowX:'auto'}},
      CE('div',{style:{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:4,flexWrap:'wrap',gap:8}},
        CE('div',{style:{display:'flex',alignItems:'center',gap:8}},
          CE('span',{style:{fontSize:18}},'📊'),
          CE('h3',{style:{margin:0,fontSize:14,fontWeight:700}},'Frise du parc — '+fmtPeriode(jourDebut,jourFin))
        ),
        CE('div',{className:'no-print',style:{display:'flex',gap:6,alignItems:'center'}},
          navBoutons,
          CE('button',{onClick:()=>setAgrandi(true),title:'Agrandir la frise',style:{padding:'4px 10px',border:'1px solid #3b82f6',borderRadius:6,background:'#eff6ff',color:'#1d4ed8',cursor:'pointer',fontSize:12,fontWeight:600}},'🔍 Agrandir'),
          pretsVisibles.length>0&&CE('button',{className:'btn btn-print btn-sm',disabled:exportEnCours,onClick:async()=>{
            setExportEnCours(true);
            try{
              await exporterElementPDF('.frise-grid-wrap','Frise du parc — '+fmtPeriode(jourDebut,jourFin),'frise-du-parc-'+jourDebut+'.pdf');
            }catch(e){
              alert('Export PDF impossible : '+e.message);
            }finally{
              setExportEnCours(false);
            }
          },title:'Exporter la frise en PDF (paysage A4)'},exportEnCours?'⏳ Export…':'📄 Export PDF')
        )
      ),
      legende,
      renderGrille(22,9,true)
    ),
    // Panneau plein écran monté via portail dans document.body : le wrapper
    // .view-anim (animation d'entrée d'onglet) laisse un
    // transform:translateY(0) actif en permanence après coup (fill-mode
    // "both", @keyframes fadeSlideIn), ce qui en fait la containing block de
    // tout position:fixed à l'intérieur — le panneau se retrouverait coincé
    // dans la largeur du contenu au lieu de l'écran entier. Le portail sort
    // du sous-arbre .view-anim et échappe au problème (même bug/correctif
    // que sur ATELIERS_NEWGEN, 8964b53 — vérifié : NextStep a la même
    // définition CSS .view-anim/fadeSlideIn).
    // Masqué à l'impression (no-print) plutôt qu'adapté : position:fixed
    // imprime de façon peu fiable selon les navigateurs. La cible
    // d'impression est la grille compacte ci-dessus (printable=true).
    agrandi&&ReactDOM.createPortal(
      CE(React.Fragment,null,
        CE('div',{className:'side-panel-overlay no-print',onClick:()=>setAgrandi(false)}),
        CE('div',{className:'no-print',style:{position:'fixed',top:'4%',left:'4%',right:'4%',bottom:'4%',background:'#fff',borderRadius:14,padding:'20px 24px',zIndex:1000,overflow:'auto',boxShadow:'0 10px 40px rgba(0,0,0,.35)'}},
          CE('div',{style:{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:16,flexWrap:'wrap',gap:8}},
            CE('h3',{style:{margin:0,fontSize:18,fontWeight:700}},'📊 Frise du parc — '+fmtPeriode(jourDebut,jourFin)),
            CE('div',{style:{display:'flex',gap:8,alignItems:'center'}},
              navBoutons,
              CE('button',{onClick:()=>setAgrandi(false),style:{padding:'4px 12px',border:'1px solid #e2e8f0',borderRadius:6,background:'#fff',cursor:'pointer',fontSize:13}},'✕ Fermer')
            )
          ),
          legende,
          renderGrille(48,12,false)
        )
      ),
      document.body
    )
  );
}

// ─── VueGestionOrdi ────────────────────────────────────────────────────────
// Onglet dédié à la gestion du matériel partagé : Classe mobile (même jour,
// matériel indivisible) et stock d'ordinateurs (période de prêt, divisible).
// Contrairement à VueAnomalies (champs manquants/communes invalides), pas de
// filtre par conseiller ni d'autres catégories — le stock est partagé par
// tous, chacun doit voir l'ensemble des conflits.
function VueGestionOrdi({entries,onEdit}){
  const conflitsMobile=React.useMemo(()=>findMobileClassConflicts(entries),[entries]);
  const conflitsOrdi=React.useMemo(()=>findOrdinateursConflicts(entries),[entries]);
  // Compteurs des tuiles : conflits actifs/à venir uniquement — l'historique
  // (dates passées) est visible plus bas dans chaque bloc, pas dans le total.
  const today=todayLocal();
  const nbActifsMobile=conflitsMobile.filter(g=>!estConflitPasse(g,today)).length;
  const nbActifsOrdi=conflitsOrdi.filter(g=>!estConflitPasse(g,today)).length;
  return CE(React.Fragment,null,
    CE(FriseMateriel,{entries,onEdit}),
    CE('div',{className:'card',style:{maxWidth:900,margin:'0 auto'}},
      CE('div',{style:{display:'flex',alignItems:'center',gap:12,marginBottom:16}},
        CE('span',{style:{fontSize:22}},'🖥️'),
        CE('div',null,
          CE('h2',{style:{margin:0,fontSize:16,fontWeight:700}},'Gestion ordi'),
          CE('p',{style:{margin:0,fontSize:12,color:'#6b7280'}},'Classe mobile & stock de '+STOCK_ORDINATEURS+' ordinateurs prêtés aux participants')
        )
      ),
      CE('div',{style:{display:'flex',gap:10,marginBottom:16,flexWrap:'wrap'}},
        CE('div',{style:{background:'#ffedd5',borderRadius:8,padding:'8px 14px',flex:'1',minWidth:120}},
          CE('div',{style:{fontSize:20,fontWeight:700,color:'#9a3412'}},nbActifsMobile),
          CE('div',{style:{fontSize:11,color:'#7c2d12'}},'⚠️ Conflits Classe mobile')
        ),
        CE('div',{style:{background:'#fee2e2',borderRadius:8,padding:'8px 14px',flex:'1',minWidth:120}},
          CE('div',{style:{fontSize:20,fontWeight:700,color:'#991b1b'}},nbActifsOrdi),
          CE('div',{style:{fontSize:11,color:'#7f1d1d'}},'🖥️ Stock ordinateurs dépassé')
        )
      ),
      CE('div',{style:{marginBottom:8,fontSize:12,fontWeight:700,color:'#9a3412'}},'Classe mobile'),
      CE(BlocConflits,{
        groupes:conflitsMobile, vide:'Aucun conflit Classe mobile',
        bg:'#fff7ed', border:'#fed7aa', titreColor:'#9a3412',
        renderTitre:g=>'📅 '+fmtDate(g.date)+' '+libelleDemi(g.demi)+' — Classe mobile réservée par '+g.entries.length+' conseillers',
        renderItem:itemConflitMobile(onEdit)
      }),
      CE('div',{style:{margin:'20px 0 8px',fontSize:12,fontWeight:700,color:'#991b1b'}},'Stock ordinateurs'),
      CE(BlocConflits,{
        groupes:conflitsOrdi, vide:'Aucun dépassement de stock',
        bg:'#fef2f2', border:'#fecaca', titreColor:'#991b1b',
        renderTitre:titreConflitOrdi,
        renderItem:itemConflitOrdi(onEdit)
      })
    )
  );
}

// ─── VueAnomalies ──────────────────────────────────────────────────────────
function VueAnomalies({entries,onEdit,communes:communesProp,apiFetch,showToast,addLog}){
  const CE=React.createElement;
  const CHAMPS_OBL=['statut','date','horaire','ampm','commune','lieu','thematique','conseiller','orienteur','public'];
  const LABELS={statut:'Statut',date:'Date',horaire:'Horaire',ampm:'AM/PM',commune:'Commune',lieu:'Lieu',thematique:'Thématique',conseiller:'Conseiller',orienteur:'Orienteur',public:'Public',inscrits:'Inscrits',presents:'Présents'};
  const[filter,setFilter]=React.useState('all');
  const[saving,setSaving]=React.useState(null);
  const[corrections,setCorrections]=React.useState({});
  const[saved,setSaved]=React.useState({});
  const[filtreConum,setFiltreConum]=React.useState('Tous');
  const[communes,setCommunes]=React.useState(COMMUNES_47_CACHE||(communesProp&&communesProp.length>0?communesProp:[]));
  const[loadingCommunes,setLoadingCommunes]=React.useState(!COMMUNES_47_CACHE||COMMUNES_47_CACHE.length===0);
  React.useEffect(()=>{
    if(communes&&communes.length>0){setLoadingCommunes(false);return;}
    loadCommunes47().then(d=>{setCommunes(d);setLoadingCommunes(false);}).catch(()=>setLoadingCommunes(false));
  },[]);
  const anomalies=React.useMemo(()=>{
    if(!entries||!Array.isArray(entries))return[];
    const nomsCommunesOff=new Set(communes.map(c=>stripAccents(c.nom.toLowerCase())));
    return entries.map(e=>{
      const champsVides=[
        ...CHAMPS_OBL.filter(k=>!e[k]||!String(e[k]).trim()),
        ...(e.inscrits===''||e.inscrits===null||e.inscrits===undefined?['inscrits']:[]),
        ...(e.statut==='Réalisé'&&(e.presents===''||e.presents===null||e.presents===undefined)?['presents']:[]),
      ];
      let communeInvalide=false,communeSugg=null;
      if(e.commune&&communes.length>0){
        const q=stripAccents(e.commune.replace(/\s*\(\d+\)\s*/g,'').trim().toLowerCase());
        if(!nomsCommunesOff.has(q)){
          communeInvalide=true;
          function lev(a,b){const m=a.length,n=b.length;const dp=Array.from({length:m+1},(_,i)=>Array.from({length:n+1},(_,j)=>i===0?j:j===0?i:0));for(let i=1;i<=m;i++)for(let j=1;j<=n;j++)dp[i][j]=a[i-1]===b[j-1]?dp[i-1][j-1]:1+Math.min(dp[i-1][j],dp[i][j-1],dp[i-1][j-1]);return dp[m][n];}
          const scored=communes.map(c=>({nom:c.nom,d:lev(q,stripAccents(c.nom.toLowerCase()))})).sort((a,b)=>a.d-b.d);
          if(scored.length>0&&scored[0].d<=3)communeSugg=scored[0].nom;
        }
      }
      // Présents > inscrits : contrôle repris de l'Admin (ménage du 25/09/2026).
      const chiffres=typeof presentsSuperieursInscrits==='function'&&presentsSuperieursInscrits(e);
      const ordiSansMobile=typeof ordiSansClasseMobile==='function'&&ordiSansClasseMobile(e);
      if(champsVides.length===0&&!communeInvalide&&!chiffres&&!ordiSansMobile)return null;
      return{e,champsVides,communeInvalide,communeSugg,chiffres,ordiSansMobile};
    }).filter(Boolean);
  },[entries,communes]);
  const anomaliesFiltrees=filtreConum==='Tous'?anomalies:anomalies.filter(a=>a.e.conseiller===filtreConum||a.e.co_animateur===filtreConum);
  const filtered=filter==='manquants'?anomaliesFiltrees.filter(a=>a.champsVides.length>0):filter==='communes'?anomaliesFiltrees.filter(a=>a.communeInvalide):filter==='chiffres'?anomaliesFiltrees.filter(a=>a.chiffres):filter==='ordi'?anomaliesFiltrees.filter(a=>a.ordiSansMobile):anomaliesFiltrees;
  async function handleSaveCommune(entry,valeur){
    if(!valeur||!valeur.trim())return;
    setSaving(entry._id);
    try{
      const updated={...entry,commune:valeur.trim()};
      const res=await apiFetch('saveEntry',{entry:updated});
      if(res&&res.ok){setSaved(s=>({...s,[entry._id]:true}));entreeSauvegardee(updated);if(showToast)showToast('✅ Commune corrigée');if(addLog)addLog('Commune corrigée : '+entry._id,'ok');}
      else{if(showToast)showToast('⚠️ Erreur sauvegarde');}
    }catch(err){if(showToast)showToast('⚠️ Erreur : '+err.message);}
    setSaving(null);
  }
  const nbTotal=anomaliesFiltrees.length,nbManquants=anomaliesFiltrees.filter(a=>a.champsVides.length>0).length,nbCommunes=anomaliesFiltrees.filter(a=>a.communeInvalide).length,nbChiffres=anomaliesFiltrees.filter(a=>a.chiffres).length,nbOrdi=anomaliesFiltrees.filter(a=>a.ordiSansMobile).length;
  const conumsList=['Tous',...Array.from(new Set(anomalies.map(a=>a.e.conseiller).filter(Boolean))).sort()];
  return CE('div',{className:'card',style:{maxWidth:900,margin:'0 auto'}},
    CE('div',{style:{display:'flex',alignItems:'center',gap:12,marginBottom:16}},
      CE('span',{style:{fontSize:22}},'⚠️'),
      CE('div',null,
        CE('h2',{style:{margin:0,fontSize:16,fontWeight:700}},'Anomalies BDD'),
        CE('p',{style:{margin:0,fontSize:12,color:'#6b7280'}},nbTotal+' entrée(s) avec anomalie(s) sur '+entries.length+' au total')
      )
    ),
    CE('div',{style:{display:'flex',gap:10,marginBottom:12,flexWrap:'wrap'}},
      CE('div',{style:{background:'#fef9c3',borderRadius:8,padding:'8px 14px',flex:'1',minWidth:120,cursor:'pointer',border:filter==='all'?'2px solid #ca8a04':'2px solid transparent'},onClick:()=>setFilter('all')},
        CE('div',{style:{fontSize:20,fontWeight:700,color:'#92400e'}},nbTotal),
        CE('div',{style:{fontSize:11,color:'#78350f'}},'Total anomalies')
      ),
      CE('div',{style:{background:'#fee2e2',borderRadius:8,padding:'8px 14px',flex:'1',minWidth:120,cursor:'pointer',border:filter==='manquants'?'2px solid #dc2626':'2px solid transparent'},onClick:()=>setFilter('manquants')},
        CE('div',{style:{fontSize:20,fontWeight:700,color:'#b91c1c'}},nbManquants),
        CE('div',{style:{fontSize:11,color:'#7f1d1d'}},'Champs manquants')
      ),
      CE('div',{style:{background:'#ede9fe',borderRadius:8,padding:'8px 14px',flex:'1',minWidth:120,cursor:'pointer',border:filter==='communes'?'2px solid #7c3aed':'2px solid transparent'},onClick:()=>setFilter('communes')},
        CE('div',{style:{fontSize:20,fontWeight:700,color:'#6d28d9'}},nbCommunes),
        CE('div',{style:{fontSize:11,color:'#4c1d95'}},loadingCommunes?'⏳ Chargement…':'Communes invalides')
      ),
      CE('div',{style:{background:'#ffedd5',borderRadius:8,padding:'8px 14px',flex:'1',minWidth:120,cursor:'pointer',border:filter==='chiffres'?'2px solid #ea580c':'2px solid transparent'},onClick:()=>setFilter('chiffres')},
        CE('div',{style:{fontSize:20,fontWeight:700,color:'#c2410c'}},nbChiffres),
        CE('div',{style:{fontSize:11,color:'#7c2d12'}},'Présents > inscrits')
      ),
      CE('div',{style:{background:'#e0f2fe',borderRadius:8,padding:'8px 14px',flex:'1',minWidth:120,cursor:'pointer',border:filter==='ordi'?'2px solid #0284c7':'2px solid transparent'},onClick:()=>setFilter('ordi')},
        CE('div',{style:{fontSize:20,fontWeight:700,color:'#0369a1'}},nbOrdi),
        CE('div',{style:{fontSize:11,color:'#0c4a6e'}},'Ordinateurs sans Classe mobile')
      )
    ),
    CE('div',{className:'chip-bar',style:{marginBottom:12}},
      conumsList.map(c=>CE('span',{key:c,className:'chip'+(c==='Tous'?' chip-all':'')+(filtreConum===c?' active':''),style:c!=='Tous'?{color:conseillerColor(c)}:{},onClick:()=>setFiltreConum(p=>p===c&&c!=='Tous'?'Tous':c)},
        CE('span',{className:'chip-dot',style:c!=='Tous'?{background:conseillerColor(c)}:{}}),c))
    ),
    filtered.length===0
      ?CE('div',{style:{textAlign:'center',padding:'40px 0',color:'#16a34a',fontSize:14}},
          CE('div',{style:{fontSize:32,marginBottom:8}},'✅'),
          'Aucune anomalie dans cette catégorie'
        )
      :CE('div',{style:{display:'flex',flexDirection:'column',gap:8}},
          filtered.map(({e,champsVides,communeInvalide,communeSugg,chiffres,ordiSansMobile})=>{
            const corrVal=corrections[e._id]?.commune!==undefined?corrections[e._id].commune:(communeSugg||e.commune||'');
            const estCorrige=saved[e._id];
            return CE('div',{key:e._id,style:{background:estCorrige?'#f0fdf4':'#fff',border:'1px solid '+(estCorrige?'#86efac':'#e5e7eb'),borderRadius:8,padding:'10px 14px'}},
              CE('div',{style:{display:'flex',alignItems:'center',gap:8,marginBottom:6,flexWrap:'wrap'}},
                CE('span',{style:{fontWeight:700,fontSize:12,color:'#374151',flex:1}},[e.thematique,e.commune,fmtDate(e.date)].filter(Boolean).join(' — ')||e._id),
                estCorrige&&CE('span',{style:{fontSize:11,color:'#16a34a',fontWeight:600}},'✅ Corrigé'),
                onEdit&&CE('button',{onClick:()=>onEdit(e._id),style:{fontSize:11,padding:'2px 8px',borderRadius:4,border:'1px solid #3b82f6',background:'#eff6ff',color:'#1d4ed8',cursor:'pointer'}},'✏️ Ouvrir')
              ),
              ordiSansMobile&&CE('div',{style:{fontSize:11,color:'#0369a1',fontWeight:600,marginBottom:6}},
                '🖥️ '+e.nb_ordinateurs+' ordinateur(s) prêté(s) sans « Classe mobile » cochée : non compté(s) dans le stock — ✏️ Ouvrir pour cocher la case ou vider le nombre'),
              chiffres&&CE('div',{style:{fontSize:11,color:'#c2410c',fontWeight:600,marginBottom:(champsVides.length>0||communeInvalide)?6:0}},
                '📊 '+e.presents+' présent(s) pour '+e.inscrits+' inscrit(s) — à corriger via ✏️ Ouvrir'),
              champsVides.length>0&&CE('div',{style:{marginBottom:communeInvalide?6:0}},
                CE('div',{style:{fontSize:11,color:'#9ca3af',marginBottom:4}},'Champs obligatoires vides :'),
                CE('div',{style:{display:'flex',gap:4,flexWrap:'wrap'}},
                  champsVides.map(k=>CE('span',{key:k,style:{background:'#fee2e2',color:'#b91c1c',fontSize:11,padding:'1px 7px',borderRadius:10,fontWeight:600}},LABELS[k]||k))
                )
              ),
              communeInvalide&&!estCorrige&&CE('div',{style:{display:'flex',alignItems:'center',gap:8,flexWrap:'wrap',marginTop:4}},
                CE('div',{style:{fontSize:11,color:'#9ca3af',whiteSpace:'nowrap'}},'Commune invalide :'),
                CE('span',{style:{background:'#ede9fe',color:'#6d28d9',fontSize:11,padding:'1px 7px',borderRadius:10,fontWeight:600}},e.commune),
                apiFetch&&CE(React.Fragment,null,
                  CE('span',{style:{fontSize:11,color:'#9ca3af'}},'→ Corriger :'),
                  CE('input',{type:'text',value:corrVal||normCommune(e.commune),list:'communes-datalist-ano',placeholder:'Commune officielle…',style:{fontSize:11,padding:'2px 6px',borderRadius:4,border:'1px solid #d1d5db',minWidth:220,flex:1},onChange:ev=>setCorrections(s=>({...s,[e._id]:{...(s[e._id]||{}),commune:ev.target.value}}))}),
                  CE('datalist',{id:'communes-datalist-ano'},(communes||[]).slice(0,300).map(c=>CE('option',{key:c.nom,value:c.nom}))),
                  CE('button',{disabled:saving===e._id||!corrVal.trim(),onClick:()=>handleSaveCommune(e,corrVal),style:{fontSize:11,padding:'2px 8px',borderRadius:4,border:'none',background:saving===e._id?'#e5e7eb':'#7c3aed',color:saving===e._id?'#6b7280':'#fff',cursor:saving===e._id?'default':'pointer'}},saving===e._id?'…':'💾 Sauver')
                )
              )
            );
          })
        )
  );
}

function VueBingo({entries}){
  const[selected,setSelected]=React.useState(null);
  const communes=React.useMemo(()=>{
    const byC={};
    entries.forEach(e=>{const c=normalizeCommune(e.commune)||'Inconnue';if(!byC[c])byC[c]={total:0,realises:0,annules:0,ateliers:[]};byC[c].total++;if(e.statut==='Réalisé')byC[c].realises++;if(e.statut==='Annulé')byC[c].annules++;byC[c].ateliers.push(e);});
    return Object.entries(byC).sort((a,b)=>b[1].total-a[1].total).map(([nom,d])=>({nom,total:d.total,realises:d.realises,annules:d.annules,pct:d.total>0?Math.round(d.realises/d.total*100):0,ateliers:[...d.ateliers].sort((a,b)=>a.date>b.date?1:-1)}));
  },[entries]);
  function getCircleColor(pct){if(pct>=70)return{stroke:'#22c55e',text:'#166534',bg:'#dcfce7'};if(pct>=40)return{stroke:'#f97316',text:'#9a3412',bg:'#ffedd5'};return{stroke:'#3b82f6',text:'#1d4ed8',bg:'#dbeafe'};}
  const BADGE_COLORS={'Réalisé':'#dcfce7','Annulé':'#fee2e2','Planifié':'#dbeafe','Reporté':'#fef3c7','Non réalisé':'#f1f5f9'};
  const BADGE_TEXT={'Réalisé':'#166534','Annulé':'#991b1b','Planifié':'#1d4ed8','Reporté':'#92400e','Non réalisé':'#475569'};
  const BORDER_C={'Réalisé':'#22c55e','Annulé':'#ef4444','Planifié':'#3b82f6','Reporté':'#f59e0b','Non réalisé':'#94a3b8'};
  const sel=selected?communes.find(c=>c.nom===selected):null;
  return CE('div',null,
    CE('div',{style:{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:12}},
      CE('div',{style:{fontSize:13,color:'#718096'}},
        CE('span',{style:{marginRight:16}},CE('span',{style:{display:'inline-block',width:10,height:10,borderRadius:'50%',background:'#22c55e',border:'2px solid #22c55e',marginRight:4}}),'≥70% réalisés'),
        CE('span',{style:{marginRight:16}},CE('span',{style:{display:'inline-block',width:10,height:10,borderRadius:'50%',background:'#ffedd5',border:'2px solid #f97316',marginRight:4}}),'40-70%'),
        CE('span',null,CE('span',{style:{display:'inline-block',width:10,height:10,borderRadius:'50%',background:'#dbeafe',border:'2px solid #3b82f6',marginRight:4}}),'<40%')
      ),
      CE('button',{className:'btn btn-print btn-sm',onClick:()=>window.print()},'🖨️ Imprimer')
    ),
    CE('div',{className:'bingo-grid'},communes.map((c,ci)=>{const col=getCircleColor(c.pct);return CE(FadeItem,{key:c.nom,delay:ci*0.04},CE('div',{className:'bingo-card'+(selected===c.nom?' selected':''),style:{background:col.bg+'44',borderColor:col.stroke+'66'},onClick:()=>setSelected(selected===c.nom?null:c.nom)},CE('div',{className:'bingo-circle',style:{background:col.bg,borderColor:col.stroke,color:col.text,boxShadow:'0 0 0 4px '+col.stroke+'22'}},c.total),CE('div',{className:'bingo-nom'},c.nom),CE('div',{className:'bingo-pct',style:{color:col.text}},c.pct+'% réalisés')));})),
    sel&&CE('div',{className:'card'},
      CE('div',{style:{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:12}},
        CE('h2',{style:{borderBottom:'none',marginBottom:0,paddingBottom:0}},CE('span',{style:{color:'#1e3a8a'}},'📍 '+sel.nom),CE('span',{style:{fontSize:13,fontWeight:400,color:'#718096',marginLeft:8}},'— '+sel.total+' atelier(s)')),
        CE('button',{onClick:()=>setSelected(null),style:{background:'none',border:'none',fontSize:18,cursor:'pointer',color:'#718096'}},'✕')
      ),
      CE('div',{className:'bingo-list'},sel.ateliers.map((e,i)=>CE('div',{key:i,className:'bingo-list-item'},CE('span',{className:'bingo-dot',style:{background:BORDER_C[e.statut]||'#94a3b8'}}),CE('span',{className:'bingo-list-date'},fmtDate(e.date)),CE('span',{className:'bingo-list-theme'},e.thematique),CE('span',{className:'bingo-list-badge',style:{background:BADGE_COLORS[e.statut]||'#f1f5f9',color:BADGE_TEXT[e.statut]||'#475569'}},e.statut))))
    )
  );
}

// Détail communes du Dashboard, triable en touchant l'en-tête d'une colonne
// (demande de l'utilisateur, 26/09/2026). Commune : A→Z d'abord ; colonnes
// chiffrées : du plus grand au plus petit d'abord ; second appui = inverse.
function TableCommunes({fd}){
  const[tri,setTri]=React.useState({col:'commune',sens:1});
  const lignes=React.useMemo(()=>{
    const m={};
    fd.forEach(d=>{const c=normCommune(d.commune);if(!c)return;const x=m[c]||(m[c]={commune:c,ateliers:0,presents:0,inscrits:0});x.ateliers++;if(d.statut==='Réalisé'){x.presents+=parseInt(d.presents)||0;x.inscrits+=parseInt(d.inscrits)||0;}});
    return Object.values(m);
  },[fd]);
  const triees=[...lignes].sort((a,b)=>{
    const va=a[tri.col],vb=b[tri.col];
    const c=tri.col==='commune'?String(va).localeCompare(String(vb),'fr'):(va-vb);
    return c?c*tri.sens:a.commune.localeCompare(b.commune,'fr');
  });
  const COLS=[['commune','Commune'],['ateliers','Ateliers'],['presents','Présents'],['inscrits','Inscrits']];
  function trier(col){setTri(t=>t.col===col?{col,sens:-t.sens}:{col,sens:col==='commune'?1:-1});}
  return CE('table',{style:{width:'100%',borderCollapse:'collapse',fontSize:11}},
    CE('thead',null,CE('tr',null,
      COLS.map(([k,h])=>CE('th',{key:k,onClick:()=>trier(k),title:'Trier',style:{padding:'6px 8px',textAlign:'left',fontWeight:700,color:tri.col===k?'#1e3a8a':'#6b7280',borderBottom:'2px solid #e5e7eb',fontSize:10,cursor:'pointer',userSelect:'none',whiteSpace:'nowrap'}},h,tri.col===k?(tri.sens===1?' ▲':' ▼'):''))
    )),
    CE('tbody',null,
      triees.map(x=>CE('tr',{key:x.commune,style:{borderBottom:'1px solid #f0f4f8'}},
        CE('td',{style:{padding:'6px 8px',fontWeight:600}},x.commune),
        CE('td',{style:{padding:'6px 8px'}},x.ateliers),
        CE('td',{style:{padding:'6px 8px',color:'#16a34a',fontWeight:600}},x.presents),
        CE('td',{style:{padding:'6px 8px',color:'#2563eb'}},x.inscrits)
      ))
    )
  );
}

// ═══════════════════════════════════════════════════════════
// VUE ACCUEIL — frontend uniquement
// ═══════════════════════════════════════════════════════════
function VueAccueil({conseillers,onChoix,loading}){
  const[choix,setChoix]=React.useState('');
  const hasConseillers=Array.isArray(conseillers)&&conseillers.length>0;
  return CE('div',{className:'accueil-wrap'},
    CE('div',{className:'accueil-card'},
      CE('div',{className:'accueil-logo'},'🖥️'),
      CE('div',{className:'accueil-title'},'Ateliers Inclusion Numérique'),
      CE('div',{className:'accueil-sub'},'Conseil Départemental du Lot-et-Garonne'),
      CE('label',{className:'accueil-label'},'Qui êtes-vous ?'),
      loading&&!hasConseillers
        ? CE('div',{style:{display:'flex',alignItems:'center',gap:8,padding:'10px 14px',background:'#f0f4f8',borderRadius:8,marginBottom:20,fontSize:13,color:'#718096'}},
            CE('span',{className:'spinner',style:{borderTopColor:'#1e3a8a',borderColor:'#e2e8f0'}}),
            'Chargement de la liste…')
        : CE('select',{className:'accueil-select',value:choix,onChange:e=>setChoix(e.target.value)},
            CE('option',{value:''},'— Sélectionner votre nom —'),
            conseillers.map(c=>CE('option',{key:c,value:c},c))
          ),
      CE('button',{className:'accueil-btn',disabled:!choix||(loading&&!hasConseillers),onClick:()=>onChoix(choix)},
        (loading&&!hasConseillers)?CE('span',null,CE('span',{className:'spinner'}),'Chargement…'):'📋 Accéder à mes ateliers'),
      CE('button',{className:'accueil-skip',disabled:false,onClick:()=>onChoix(null)},'Voir tous les ateliers')
    )
  );
}

// ═══════════════════════════════════════════════════════════
// VuePowerBI — Dashboard Territoire (commun index + admin)
// ═══════════════════════════════════════════════════════════
// ── VuePowerBI ──────────────────────────────────────────────
function VuePowerBI({entries, conseillers: conseillersList}){
  const CONS = conseillersList && conseillersList.length ? conseillersList : CONSEILLERS_DEFAULT;
  const CONS_COLORS_PBI = ['#7C3AED','#2563EB','#059669','#DB2777','#d97706','#0891b2','#65a30d','#dc2626'];
  function cColor(c){ return CONSEILLER_COLORS[c]||CONS_COLORS_PBI[CONS.indexOf(c)%CONS_COLORS_PBI.length]||'#6B7280'; }

  const S_COL_PBI={'Réalisé':'#22c55e','Planifié':'#3b82f6','Annulé':'#ef4444','Non réalisé':'#94a3b8','Reporté':'#f97316'};
  const MOIS_PBI=['Jan','Fév','Mar','Avr','Mai','Jun','Jul','Aoû','Sep','Oct','Nov','Déc'];
  const STATUTS_PBI=['Réalisé','Planifié','Annulé','Non réalisé','Reporté'];

  const[page,setPage]=React.useState('general');
  const[fCons,setFCons]=React.useState([]);
  const[fStat,setFStat]=React.useState([]);
  const[fMois,setFMois]=React.useState([]);
  const[showF,setShowF]=React.useState(false);

  function togF(arr,setArr,v){ setArr(p=>p.includes(v)?p.filter(x=>x!==v):[...p,v]); }
  const hasF=fCons.length||fStat.length||fMois.length;

  const fd=React.useMemo(()=>entries.filter(d=>{
    if(fCons.length&&!fCons.includes(d.conseiller))return false;
    if(fStat.length&&!fStat.includes(d.statut))return false;
    if(fMois.length){const m=d.date?parseInt(d.date.split('-')[1]):0;if(!fMois.includes(m))return false;}
    return true;
  }),[entries,fCons,fStat,fMois]);

  const getMois=d=>d.date?parseInt(d.date.split('-')[1]):0;

  // KPIs
  const total=fd.length;
  const real=fd.filter(d=>d.statut==='Réalisé').length;
  const tReal=total?Math.round(real/total*100):0;
  const totPre=kpiHistorique(fd).presents;
  const totIns=kpiHistorique(fd).inscrits;
  const tPres=totIns?Math.round(totPre/totIns*100):0;

  // Par mois
  const pMois=MOIS_PBI.map((l,i)=>{
    const m=i+1,r=fd.filter(d=>getMois(d)===m);
    return{mois:l,
      Réalisés:r.filter(d=>d.statut==='Réalisé').length,
      Planifiés:r.filter(d=>d.statut==='Planifié').length,
      Annulés:r.filter(d=>d.statut==='Annulé').length,
      Présents:kpiHistorique(r).presents
    };
  });

  // Statuts donut
  const pStat=STATUTS_PBI.map(s=>({name:s,value:fd.filter(d=>d.statut===s).length,color:S_COL_PBI[s]})).filter(d=>d.value>0);

  // Thématiques top 10
  const allThemes=[...new Set(fd.map(d=>d.thematique).filter(Boolean))];
  const pTheme=allThemes.map(t=>({name:t.length>22?t.slice(0,22)+'…':t,count:fd.filter(d=>d.thematique===t).length})).sort((a,b)=>b.count-a.count).slice(0,10);

  // Orienteurs top 8
  const allOris=[...new Set(fd.map(d=>d.orienteur).filter(Boolean))];
  const pOri=allOris.map(o=>({name:o.length>16?o.slice(0,16)+'…':o,count:fd.filter(d=>d.orienteur===o).length})).sort((a,b)=>b.count-a.count).slice(0,8);

  // Conseillers × mois (jusqu'au mois en cours)
  const _moisCourant=new Date().getMonth()+1;
  const pMoisFilt=pMois.filter((_,i)=>i+1<=_moisCourant);
  const pConsMois=MOIS_PBI.map((l,i)=>{
    const m=i+1,obj={mois:l};
    CONS.forEach(c=>{obj[c]=fd.filter(d=>getMois(d)===m&&(d.conseiller===c||d.co_animateur===c)&&d.statut==='Réalisé').length;});
    return obj;
  }).filter((_,i)=>i+1<=_moisCourant);

  // Communes top 8
  const allComm=[...new Set(fd.map(d=>normCommune(d.commune)).filter(Boolean))];
  const pComm=allComm.map(c=>({
    name:c.length>14?c.slice(0,14)+'…':c,fullName:c,
    presents:kpiHistorique(fd.filter(d=>normCommune(d.commune)===c)).presents,
    ateliers:fd.filter(d=>normCommune(d.commune)===c).length
  })).sort((a,b)=>b.presents-a.presents).slice(0,8);

  // ── Sous-composants ────────────────────────────────────────
  // Couleurs dark-aware pour VuePowerBI
  const isDark=document.documentElement.getAttribute('data-theme')==='dark';
  const PBI_BG    = isDark?'#1a1d27':'#ffffff';
  const PBI_BG2   = isDark?'#252836':'#f3f4f6';
  const PBI_BORDER= isDark?'#2d3148':'#e5e7eb';
  const PBI_TEXT  = isDark?'#e2e8f0':'#111827';
  const PBI_TEXT2 = isDark?'#94a3b8':'#6b7280';
  const PBI_CONT  = isDark?'rgba(255,255,255,0.06)':'#f3f4f6';

  function KpiPBI({label,value,sub,color,icon,delay=0}){
    return CE(FadeItem,{delay},CE('div',{style:{background:PBI_BG,borderRadius:6,padding:'14px',borderLeft:`4px solid ${color}`,boxShadow:'0 1px 6px rgba(0,0,0,.15)'}},
      CE('div',{style:{display:'flex',justifyContent:'space-between',alignItems:'flex-start'}},
        CE('div',null,
          CE('div',{style:{fontSize:10,color:PBI_TEXT2,fontWeight:700,textTransform:'uppercase',letterSpacing:'.06em',marginBottom:5}},label),
          CE('div',{style:{fontSize:28,fontWeight:800,color:PBI_TEXT,lineHeight:1}},value),
          sub&&CE('div',{style:{fontSize:11,color:'#94a3b8',marginTop:4}},sub)
        ),
        CE('div',{style:{width:38,height:38,borderRadius:8,background:color+'22',display:'flex',alignItems:'center',justifyContent:'center',fontSize:20}},icon)
      )
    ));
  }

  function ChipPBI({label,active,color,onClick}){
    return CE('span',{onClick,style:{
      display:'inline-block',padding:'4px 10px',borderRadius:20,fontSize:11,fontWeight:600,
      cursor:'pointer',userSelect:'none',marginRight:4,marginBottom:4,
      background:active?color:PBI_CONT,color:active?'#fff':PBI_TEXT2,
      border:`1.5px solid ${active?color:PBI_BORDER}`,transition:'all .15s'
    }},label);
  }

  function CardPBI({title,children,style={}}){
    return CE('div',{style:{background:PBI_BG,borderRadius:6,padding:14,boxShadow:'0 1px 6px rgba(0,0,0,.15)',...style}},
      CE('div',{style:{fontSize:10,fontWeight:700,color:PBI_TEXT2,textTransform:'uppercase',letterSpacing:'.06em',marginBottom:12,paddingBottom:8,borderBottom:`1px solid ${PBI_BORDER}`}},title),
      children
    );
  }

  // ── Style PBI aligné sur GDIN ────────────────────
  const ecTT={backgroundColor:'#111827',borderColor:'#374151',textStyle:{color:'#f1f5f9',fontSize:11},extraCssText:'border-radius:8px;padding:10px 14px;box-shadow:none'};
  const _ecAPN={axisPointer:{type:'none'}};
  // Pas de dégradé — couleurs solides pour fiabilité mobile
  function mkGradPBI(c1,c2,dir='v'){return c1;}
  // Plus d'ombre 3D
  const _bar3D={borderRadius:[3,3,0,0]};
  function PBIChart({option,height}){
    const ref=React.useRef(null);const inst=React.useRef(null);const prevOpt=React.useRef(option);
    React.useEffect(()=>{
      if(!ref.current||!window.echarts)return;
      const isNew=!inst.current;
      if(isNew){inst.current=window.echarts.init(ref.current);const ro=new ResizeObserver(()=>{if(inst.current)inst.current.resize();});ro.observe(ref.current);inst.current._ro=ro;}
      if(!isNew&&prevOpt.current===option)return;
      prevOpt.current=option;
      const merged={...EC_ANIM,...option};
      if(isNew){requestAnimationFrame(()=>requestAnimationFrame(()=>{if(inst.current)inst.current.setOption(merged,{notMerge:true,lazyUpdate:false});}));}
      else{inst.current.setOption(merged,{notMerge:false,lazyUpdate:false});}
    });
    React.useEffect(()=>{return()=>{if(inst.current){if(inst.current._ro)inst.current._ro.disconnect();inst.current.dispose();inst.current=null;}};},[]);
    return CE('div',{ref,style:{width:'100%',height:height||180}});
  }

  // ── Pages ──────────────────────────────────────────────────
  const PAGES_PBI=[{id:'general',ico:'📊',label:'Général'},{id:'conseillers',ico:'👥',label:'Conseillers'},{id:'territoire',ico:'🗺️',label:'Territoire'}];

  return CE('div',{style:{fontFamily:"'Segoe UI',system-ui,sans-serif",minHeight:'60vh'}},

    // ── Bandeau Power BI ──
    CE('div',{style:{background:'#1e2132',borderRadius:'6px 6px 0 0',padding:'0 14px',display:'flex',alignItems:'center',gap:8,minHeight:44}},
      CE('div',{style:{width:24,height:24,background:'#f2c811',borderRadius:3,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}},
        CE('div',{style:{width:12,height:12,background:'#1e2132',borderRadius:2}})
      ),
      CE('div',{style:{flex:1,minWidth:0}},
        CE('span',{style:{fontSize:12,fontWeight:700,color:'#f2c811'}},'Power BI '),
        CE('span',{style:{fontSize:11,color:'#94a3b8'}}),'· Ateliers Inclusion Numérique'
      ),
      hasF&&CE('button',{
        onClick:()=>{setFCons([]);setFStat([]);setFMois([]);},
        style:{padding:'3px 10px',borderRadius:4,border:'none',background:'#ef4444',color:'#fff',fontSize:10,fontWeight:700,cursor:'pointer'}
      },'✕ Filtres'),
      CE('button',{
        onClick:()=>setShowF(s=>!s),
        style:{padding:'4px 10px',borderRadius:4,border:`1px solid ${showF?'#f2c811':'#374151'}`,background:showF?'#2d3250':'transparent',color:showF?'#f2c811':'#9ca3af',cursor:'pointer',fontSize:11,fontWeight:showF?700:400}
      },'⚙️ '+fd.length)
    ),

    // ── Onglets pages ──
    CE('div',{style:{background:'#1e2132',display:'flex',borderBottom:'1px solid #374151',overflowX:'auto'}},
      PAGES_PBI.map(p=>CE('button',{key:p.id,onClick:()=>setPage(p.id),style:{
        padding:'8px 16px',border:'none',background:'transparent',cursor:'pointer',
        fontSize:12,fontWeight:page===p.id?700:400,whiteSpace:'nowrap',fontFamily:'inherit',
        color:page===p.id?'#f2c811':'#9ca3af',
        borderBottom:page===p.id?'2px solid #f2c811':'2px solid transparent',transition:'all .15s'
      }},p.ico+' '+p.label))
    ),

    // ── Filtres ──
    showF&&CE('div',{style:{background:PBI_BG,border:`1px solid ${PBI_BORDER}`,borderTop:'none',padding:'12px 14px'}},
      CE('div',{style:{display:'flex',gap:16,flexWrap:'wrap'}},
        CE('div',null,
          CE('div',{style:{fontSize:10,fontWeight:700,color:'#6b7280',textTransform:'uppercase',letterSpacing:'.06em',marginBottom:6}}),'Mois',
          CE('div',null,MOIS_PBI.map((m,i)=>CE(ChipPBI,{key:m,label:m,active:fMois.includes(i+1),color:'#1e40af',onClick:()=>togF(fMois,setFMois,i+1)})))
        ),
        CE('div',null,
          CE('div',{style:{fontSize:10,fontWeight:700,color:'#6b7280',textTransform:'uppercase',letterSpacing:'.06em',marginBottom:6}}),'Conseiller·ère',
          CE('div',null,CONS.map(c=>CE(ChipPBI,{key:c,label:c.split(' ')[0],active:fCons.includes(c),color:cColor(c),onClick:()=>togF(fCons,setFCons,c)})))
        ),
        CE('div',null,
          CE('div',{style:{fontSize:10,fontWeight:700,color:'#6b7280',textTransform:'uppercase',letterSpacing:'.06em',marginBottom:6}}),'Statut',
          CE('div',null,STATUTS_PBI.map(s=>CE(ChipPBI,{key:s,label:s,active:fStat.includes(s),color:S_COL_PBI[s],onClick:()=>togF(fStat,setFStat,s)})))
        )
      )
    ),

    // ── Contenu ──
    CE('div',{style:{padding:14,background:isDark?'#0f1117':PBI_BG2,borderRadius:'0 0 6px 6px'}},

      // PAGE GÉNÉRAL
      page==='general'&&CE(React.Fragment,null,
        CE('div',{style:{display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:10,marginBottom:12}},
          CE(KpiPBI,{label:'Ateliers',value:total,sub:real+' réalisés',color:'#2563EB',icon:'🖥️',delay:0}),
          CE(KpiPBI,{label:'Réalisation',value:tReal+'%',sub:'Objectif 80%',color:'#16a34a',icon:'✅',delay:0.08}),
          CE(KpiPBI,{label:'Participants',value:totPre,sub:totIns+' inscrits',color:'#7C3AED',icon:'👥',delay:0.16}),
          CE(KpiPBI,{label:'Présence',value:tPres+'%',sub:'Sur réalisés',color:'#d97706',icon:'📊',delay:0.24})
        ),

        CE(CardPBI,{title:'Ateliers par mois',style:{marginBottom:12}},
          CE(PBIChart,{height:180,option:{backgroundColor:'transparent',
            grid:{top:8,right:4,bottom:36,left:0,containLabel:true},
            tooltip:{trigger:'axis',..._ecAPN,...ecTT},
            legend:{data:['Réalisés','Planifiés','Annulés'],textStyle:{color:'#94a3b8',fontSize:9},bottom:0,icon:'roundRect',itemWidth:8,itemHeight:6},
            xAxis:{data:pMois.map(d=>d.mois),axisLine:{show:false},axisTick:{show:false},axisLabel:{color:'#94a3b8',fontSize:9}},
            yAxis:{splitLine:{lineStyle:{color:'#2d3250',type:'dashed'}},axisLabel:{color:'#94a3b8',fontSize:9},axisLine:{show:false},axisTick:{show:false}},
            series:[
              {name:'Réalisés',type:'bar',barMaxWidth:16,data:pMois.map(d=>d['Réalisés']),itemStyle:{color:mkGradPBI('#34d399','#16a34a'),..._bar3D,borderRadius:[3,3,0,0]}},
              {name:'Planifiés',type:'bar',barMaxWidth:16,data:pMois.map(d=>d['Planifiés']),itemStyle:{color:mkGradPBI('#60a5fa','#2563eb'),..._bar3D,borderRadius:[3,3,0,0]}},
              {name:'Annulés',type:'bar',barMaxWidth:16,data:pMois.map(d=>d['Annulés']),itemStyle:{color:mkGradPBI('#f87171','#dc2626'),..._bar3D,borderRadius:[3,3,0,0]}}
            ]}})
        ),

        CE('div',{style:{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,marginBottom:12}},
          CE(CardPBI,{title:'Statuts',style:{}},
            CE(PBIChart,{height:150,option:{backgroundColor:'transparent',
              tooltip:{trigger:'item',..._ecAPN,...ecTT},
              series:[{type:'pie',radius:['42%','65%'],center:['50%','50%'],
                itemStyle:{borderRadius:4,borderColor:'#1e2132',borderWidth:2},
                label:{show:false},
                data:pStat.map(d=>({name:d.name,value:d.value,itemStyle:{color:d.color,shadowColor:d.color+'66',shadowBlur:6}})),
                emphasis:{itemStyle:{shadowBlur:12},scaleSize:5}
              }]}}),
            CE('div',{style:{display:'flex',flexWrap:'wrap',gap:4,justifyContent:'center',marginTop:6}},
              pStat.map(s=>CE('div',{key:s.name,style:{display:'flex',alignItems:'center',gap:3,fontSize:9}},
                CE('div',{style:{width:7,height:7,borderRadius:'50%',background:s.color}}),
                s.name,': ',CE('b',null,s.value)
              ))
            )
          ),
          CE(CardPBI,{title:'Présents / mois',style:{}},
            CE(PBIChart,{height:150,option:{backgroundColor:'transparent',
              grid:{top:8,right:4,bottom:22,left:0,containLabel:true},
              tooltip:{trigger:'axis',..._ecAPN,...ecTT},
              xAxis:{data:pMoisFilt.map(d=>d.mois),axisLine:{show:false},axisTick:{show:false},axisLabel:{color:'#94a3b8',fontSize:9}},
              yAxis:{splitLine:{lineStyle:{color:'#2d3250',type:'dashed'}},axisLabel:{color:'#94a3b8',fontSize:9},axisLine:{show:false},axisTick:{show:false}},
              series:[{type:'line',data:pMoisFilt.map(d=>d['Présents']),smooth:true,symbol:'none',
                lineStyle:{width:2,color:'#22c55e'},
                areaStyle:{color:mkGradPBI('rgba(34,197,94,0.35)','rgba(34,197,94,0.02)')}}]}}))
        ),

        pTheme.length>0&&CE(CardPBI,{title:'Top thématiques',style:{marginBottom:12}},
          CE(PBIChart,{height:Math.max(180,pTheme.length*24),option:{backgroundColor:'transparent',
            grid:{top:8,right:50,bottom:8,left:8,containLabel:true},
            tooltip:{trigger:'axis',..._ecAPN,...ecTT},
            xAxis:{splitLine:{lineStyle:{color:'#2d3250',type:'dashed'}},axisLabel:{color:'#94a3b8',fontSize:9},axisLine:{show:false},axisTick:{show:false}},
            yAxis:{type:'category',data:pTheme.map(d=>d.name),axisLabel:{color:'#94a3b8',fontSize:9},axisLine:{show:false},axisTick:{show:false}},
            series:[{type:'bar',barMaxWidth:14,
              data:pTheme.map((d,i)=>({value:d.count,itemStyle:{color:mkGradPBI(`hsl(${230+i*10},70%,65%)`,`hsl(${230+i*10},70%,45%)`,'h'),borderRadius:[0,4,4,0]}})),
              label:{show:true,position:'right',color:'#94a3b8',fontSize:9,fontWeight:'bold'}
            }]}})
        ),

        pOri.length>0&&CE(CardPBI,{title:'Organismes orienteurs'},
          CE(PBIChart,{height:160,option:{backgroundColor:'transparent',
            grid:{top:8,right:4,bottom:48,left:0,containLabel:true},
            tooltip:{trigger:'axis',..._ecAPN,...ecTT},
            xAxis:{data:pOri.map(d=>d.name),axisLine:{show:false},axisTick:{show:false},axisLabel:{color:'#94a3b8',fontSize:8,rotate:-20,interval:0}},
            yAxis:{splitLine:{lineStyle:{color:'#2d3250',type:'dashed'}},axisLabel:{color:'#94a3b8',fontSize:9},axisLine:{show:false},axisTick:{show:false}},
            series:[{type:'bar',barMaxWidth:20,data:pOri.map(d=>d.count),
              itemStyle:{color:mkGradPBI('#fdba74','#f97316'),..._bar3D,borderRadius:[3,3,0,0]},
              label:{show:true,position:'top',color:'#94a3b8',fontSize:8}}]}}))
      ),

      // PAGE CONSEILLERS
      page==='conseillers'&&CE(React.Fragment,null,
        CE('div',{style:{display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:10,marginBottom:12}},
          CONS.map(c=>{
            const r=fd.filter(d=>d.conseiller===c);
            const rl=r.filter(d=>d.statut==='Réalisé').length;
            const pct=r.length?Math.round(rl/r.length*100):0;
            const pre=kpiHistorique(r).presents;
            const ann=r.filter(d=>d.statut==='Annulé').length;
            return CE('div',{key:c,style:{background:PBI_BG,borderRadius:6,padding:12,boxShadow:'0 1px 6px rgba(0,0,0,.15)',borderTop:`3px solid ${cColor(c)}`}},
              CE('div',{style:{fontSize:11,fontWeight:700,color:cColor(c),marginBottom:8,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}},c),
              CE('div',{style:{display:'grid',gridTemplateColumns:'1fr 1fr',gap:6,marginBottom:8}},
                CE('div',null,CE('div',{style:{fontSize:20,fontWeight:800,color:PBI_TEXT}},r.length),CE('div',{style:{fontSize:9,color:PBI_TEXT2}},'Ateliers')),
                CE('div',null,CE('div',{style:{fontSize:20,fontWeight:800,color:cColor(c)}},pct+'%'),CE('div',{style:{fontSize:9,color:PBI_TEXT2}},'Réalisation')),
                CE('div',null,CE('div',{style:{fontSize:16,fontWeight:700,color:PBI_TEXT}},pre),CE('div',{style:{fontSize:9,color:PBI_TEXT2}},'Présents')),
                CE('div',null,CE('div',{style:{fontSize:16,fontWeight:700,color:'#ef4444'}},ann),CE('div',{style:{fontSize:9,color:PBI_TEXT2}},'Annulés'))
              ),
              CE('div',{style:{height:5,background:PBI_BG2,borderRadius:3}},
                CE('div',{style:{height:5,background:cColor(c),borderRadius:3,width:pct+'%',transition:'width .5s'}})
              )
            );
          })
        ),

        CE(CardPBI,{title:'Réalisés par conseiller·ère — par mois',style:{marginBottom:12}},
          CE(PBIChart,{height:200,option:{backgroundColor:'transparent',
            grid:{top:8,right:4,bottom:44,left:0,containLabel:true},
            tooltip:{trigger:'axis',..._ecAPN,...ecTT},
            legend:{data:CONS.map(c=>c.split(' ')[0]),textStyle:{color:'#94a3b8',fontSize:9},bottom:0,icon:'roundRect',itemWidth:8,itemHeight:6},
            xAxis:{data:pConsMois.map(d=>d.mois),axisLine:{show:false},axisTick:{show:false},axisLabel:{color:'#94a3b8',fontSize:9}},
            yAxis:{splitLine:{lineStyle:{color:'#2d3250',type:'dashed'}},axisLabel:{color:'#94a3b8',fontSize:9},axisLine:{show:false},axisTick:{show:false}},
            series:CONS.map((c,ci)=>({name:c.split(' ')[0],type:'bar',stackId:'a',barMaxWidth:30,data:pConsMois.map(d=>d[c]||0),itemStyle:{color:cColor(c),..._bar3D,borderRadius:ci===CONS.length-1?[3,3,0,0]:[0,0,0,0]}}))}}),

        CE(CardPBI,{title:'Tableau récapitulatif'},
          CE('div',{style:{overflowX:'auto'}},
            CE('table',{style:{width:'100%',borderCollapse:'collapse',fontSize:11}},
              CE('thead',null,CE('tr',{style:{background:PBI_BG2}},
                ['','Total','Réal.','Ann.','Présents','Taux'].map(h=>CE('th',{key:h,style:{padding:'7px 8px',textAlign:'left',fontWeight:700,color:'#6b7280',borderBottom:'2px solid #e5e7eb',fontSize:10,whiteSpace:'nowrap'}},h))
              )),
              CE('tbody',null,CONS.map((c,i)=>{
                const r=fd.filter(d=>d.conseiller===c);
                const rl=r.filter(d=>d.statut==='Réalisé').length;
                const pct=r.length?Math.round(rl/r.length*100):0;
                const pre=kpiHistorique(r).presents;
                const ann=r.filter(d=>d.statut==='Annulé').length;
                return CE('tr',{key:c,style:{background:i%2?PBI_BG2:PBI_BG}},
                  CE('td',{style:{padding:'6px 8px'}},CE('div',{style:{display:'flex',alignItems:'center',gap:5}},
                    CE('div',{style:{width:8,height:8,borderRadius:2,background:cColor(c),flexShrink:0}}),
                    CE('span',{style:{fontWeight:600,fontSize:10}},c.split(' ')[0])
                  )),
                  CE('td',{style:{padding:'6px 8px',fontWeight:700}},r.length),
                  CE('td',{style:{padding:'6px 8px',color:'#16a34a',fontWeight:600}},rl),
                  CE('td',{style:{padding:'6px 8px',color:'#dc2626',fontWeight:600}},ann),
                  CE('td',{style:{padding:'6px 8px'}},pre),
                  CE('td',{style:{padding:'6px 8px'}},CE('div',{style:{display:'flex',alignItems:'center',gap:5}},
                    CE('div',{style:{height:5,width:40,background:PBI_BG2,borderRadius:3}},
                      CE('div',{style:{height:5,background:cColor(c),borderRadius:3,width:pct+'%'}})
                    ),
                    CE('span',{style:{fontSize:10,fontWeight:700,color:cColor(c)}},pct+'%')
                  ))
                );
              }))
            )
          )
        )
      ),
      ),

      // PAGE TERRITOIRE
      page==='territoire'&&CE(React.Fragment,null,
        pComm.length>0&&CE(CardPBI,{title:'Présents par commune',style:{marginBottom:12}},
          CE(PBIChart,{height:220,option:{backgroundColor:'transparent',
            grid:{top:8,right:50,bottom:8,left:8,containLabel:true},
            tooltip:{trigger:'axis',..._ecAPN,...ecTT},
            xAxis:{splitLine:{lineStyle:{color:'#2d3250',type:'dashed'}},axisLabel:{color:'#94a3b8',fontSize:9},axisLine:{show:false},axisTick:{show:false}},
            yAxis:{type:'category',data:pComm.map(d=>d.name),axisLabel:{color:'#94a3b8',fontSize:9},axisLine:{show:false},axisTick:{show:false}},
            series:[{type:'bar',barMaxWidth:18,
              data:pComm.map((d,i)=>({value:d.presents,itemStyle:{color:mkGradPBI(`hsl(${210+i*12},70%,60%)`,`hsl(${210+i*12},70%,40%)`,'h'),borderRadius:[0,4,4,0]}})),
              label:{show:true,position:'right',color:'#94a3b8',fontSize:9,fontWeight:'bold'}
            }]}})
        ),

        pComm.length>0&&CE(CardPBI,{title:'Ateliers par commune',style:{marginBottom:12}},
          CE(PBIChart,{height:180,option:{backgroundColor:'transparent',
            grid:{top:8,right:4,bottom:48,left:0,containLabel:true},
            tooltip:{trigger:'axis',..._ecAPN,...ecTT},
            xAxis:{data:pComm.map(d=>d.name),axisLine:{show:false},axisTick:{show:false},axisLabel:{color:'#94a3b8',fontSize:8,rotate:-20,interval:0}},
            yAxis:{splitLine:{lineStyle:{color:'#2d3250',type:'dashed'}},axisLabel:{color:'#94a3b8',fontSize:9},axisLine:{show:false},axisTick:{show:false}},
            series:[{type:'bar',barMaxWidth:22,data:pComm.map(d=>d.ateliers),
              itemStyle:{color:mkGradPBI('#c084fc','#7c3aed'),..._bar3D,borderRadius:[3,3,0,0]},
              label:{show:true,position:'top',color:'#94a3b8',fontSize:8}}]}})        
        ),

        CE(CardPBI,{title:'Détail communes'},
          CE('div',{style:{overflowX:'auto'}},
            CE(TableCommunes,{fd})
          )
        )
      ),

      CE('div',{style:{textAlign:'right',fontSize:10,color:'#94a3b8',marginTop:8}},
        fd.length+'/'+entries.length+' ateliers affichés · CD47 Inclusion Numérique'
      )
    )
  );
}

// ════════════════════════════════════════════════════════════
// ── ConfirmModal — Modale de confirmation de suppression ────
// ════════════════════════════════════════════════════════════
function ConfirmModal({item,onConfirm,onCancel}){
  if(!item)return null;
  // La fenêtre reste ouverte jusqu'à la réponse de onConfirm : sans ça, 3 à
  // 25 s sans aucun signe que la suppression est partie (23/09/2026).
  const[enCours,setEnCours]=React.useState(false);
  const confirmer=async()=>{ if(enCours)return; setEnCours(true); try{ await onConfirm(); }finally{ setEnCours(false); } };
  const annuler=()=>{ if(!enCours)onCancel(); };
  const refs=React.useRef({});refs.current={confirmer,annuler};
  React.useEffect(()=>{
    function onKey(e){if(e.key==='Escape')refs.current.annuler();if(e.key==='Enter')refs.current.confirmer();}
    window.addEventListener('keydown',onKey);return()=>window.removeEventListener('keydown',onKey);
  },[]);
  return CE('div',{className:'confirm-overlay',onClick:annuler},
    CE('div',{className:'confirm-card',onClick:e=>e.stopPropagation()},
      CE('h3',null,'🗑️ Supprimer cet atelier ?'),
      CE('p',null,item.label),
      CE('div',{className:'confirm-actions'},
        CE('button',{
          onClick:annuler,disabled:enCours,
          style:{padding:'8px 18px',border:'1px solid #e2e8f0',borderRadius:8,background:'#f8fafc',cursor:enCours?'not-allowed':'pointer',fontSize:13,fontWeight:600,color:'#4a5568',opacity:enCours?.5:1}
        },'Annuler'),
        CE('button',{
          onClick:confirmer,autoFocus:true,disabled:enCours,
          style:{padding:'8px 18px',border:'none',borderRadius:8,background:'#dc2626',cursor:enCours?'wait':'pointer',fontSize:13,fontWeight:700,color:'#fff',boxShadow:'0 2px 8px rgba(220,38,38,.3)'}
        },enCours?CE('span',null,CE('span',{className:'spinner'}),'Suppression en cours…'):'Supprimer')
      ),
      enCours&&CE('p',{style:{fontSize:11,color:'#718096',marginTop:10,marginBottom:0}},'Suppression en cours — ne fermez pas la page.')
    )
  );
}
// ════════════════════════════════════════════════════════════
// ── VueAgendaSemaine — Planning hebdo AM/PM ─────────────────
// ════════════════════════════════════════════════════════════
function VueAgendaSemaine({entries,onEdit,onDelete,onDuplicate,canDelete,initConseiller,accentColor}){
  const[weekOffset,setWeekOffset]=React.useState(0);
  const[filterConseiller,setFilterConseiller]=React.useState(initConseiller||'Tous');
  const[selectedEntry,setSelectedEntry]=React.useState(null);
  const[confirmDel,setConfirmDel]=React.useState(null);

  // ── Calcul semaine ──────────────────────────────────────────
  function getMondayOfWeek(offset){
    const t=new Date();const day=t.getDay();
    const diff=day===0?-6:1-day;
    const m=new Date(t);m.setDate(t.getDate()+diff+offset*7);m.setHours(0,0,0,0);return m;
  }
  const monday=getMondayOfWeek(weekOffset);
  const weekDays=Array.from({length:5},(_,i)=>{const d=new Date(monday);d.setDate(monday.getDate()+i);return d;});
  const dk=d=>`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
  const firstDay=dk(weekDays[0]);const lastDay=dk(weekDays[4]);

  // ── Filtres ─────────────────────────────────────────────────
  const conseillers=[...new Set(entries.map(e=>e.conseiller).filter(Boolean))].sort();
  const weekEntries=entries.filter(e=>e.date>=firstDay&&e.date<=lastDay);
  const filtered=filterConseiller==='Tous'?weekEntries:weekEntries.filter(e=>e.conseiller===filterConseiller);

  // ── AM/PM ───────────────────────────────────────────────────
  function isAM(e){
    if(e.ampm)return e.ampm==='AM';
    const h=e.horaire?parseInt(String(e.horaire).replace(/[Hh]/,':').split(':')[0])||9:9;
    return h<12;
  }

  // ── Slots par jour ──────────────────────────────────────────
  const slots={};
  weekDays.forEach(d=>{const k=dk(d);slots[k]={AM:[],PM:[]};});
  filtered.forEach(e=>{if(slots[e.date])slots[e.date][isAM(e)?'AM':'PM'].push(e);});

  // ── Libellés ────────────────────────────────────────────────
  const MOIS=['Jan','Fév','Mar','Avr','Mai','Jun','Jul','Aoû','Sep','Oct','Nov','Déc'];
  const JOURS=['Dim','Lun','Mar','Mer','Jeu','Ven','Sam'];
  const MOIS_LONG=['janvier','février','mars','avril','mai','juin','juillet','août','septembre','octobre','novembre','décembre'];
  function fmtWeekLabel(){
    const d1=weekDays[0];const d5=weekDays[4];
    if(d1.getMonth()===d5.getMonth())return`${d1.getDate()} – ${d5.getDate()} ${MOIS_LONG[d5.getMonth()]} ${d5.getFullYear()}`;
    return`${d1.getDate()} ${MOIS_LONG[d1.getMonth()]} – ${d5.getDate()} ${MOIS_LONG[d5.getMonth()]} ${d5.getFullYear()}`;
  }

  // ── KPIs semaine ────────────────────────────────────────────
  const todayStr=todayLocal();
  const totalW=filtered.length;
  const planifies=filtered.filter(e=>e.statut==='Planifié').length;
  const realises=filtered.filter(e=>e.statut==='Réalisé').length;
  const retards=filtered.filter(e=>isRetard(e)).length;
  const inscritsW=kpiHistorique(filtered).inscrits;
  const presentsW=kpiHistorique(filtered).presents;

  // ── Card atelier ────────────────────────────────────────────
  function renderCard(e){
    const color=conseillerColor(e.conseiller);
    const statColor=STATUT_COLORS[e.statut]||'#94a3b8';
    const retard=isRetard(e);
    return CE('div',{
      key:e._id,
      onClick:()=>setSelectedEntry(e),
      style:{
        background:'#fff',borderRadius:8,borderLeft:`4px solid ${color}`,
        padding:'6px 8px',marginBottom:4,cursor:'pointer',
        boxShadow:'0 1px 4px rgba(0,0,0,.09)',fontSize:11,
        transition:'box-shadow .15s, transform .12s',
        outline: retard?`1.5px solid #fca5a5`:'none'
      }
    },
      CE('div',{style:{display:'flex',alignItems:'center',gap:4,marginBottom:2}},
        CE('span',{style:{width:6,height:6,borderRadius:'50%',background:statColor,flexShrink:0,display:'inline-block'}}),
        CE('span',{style:{fontWeight:700,color,fontSize:10,flex:1,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}},e.conseiller||'—')
      ),
      CE('div',{style:{fontWeight:600,color:'#1a202c',lineHeight:1.25,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',marginBottom:1}},
        e.thematique||e.commune||'—'),
      e.commune&&e.thematique&&CE('div',{style:{color:'#718096',fontSize:10,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}},e.commune),
      e.orienteur&&CE('div',{title:'Orienteur',style:{color:'#718096',fontSize:10,fontStyle:'italic',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}},'🤝 '+e.orienteur),
      e.horaire&&CE('div',{style:{color:'#a0aec0',fontSize:10,marginTop:1}},e.horaire),
      retard&&CE('div',{style:{color:'#dc2626',fontSize:9,fontWeight:700,marginTop:2,animation:'blink-retard 1.4s ease-in-out infinite'}},'⚠ À mettre à jour')
    );
  }

  // ── Side panel ──────────────────────────────────────────────
  function SidePanel(){
    if(!selectedEntry)return null;
    const e=selectedEntry;const color=conseillerColor(e.conseiller);
    return CE(React.Fragment,null,
      CE('div',{className:'side-panel-overlay',onClick:()=>setSelectedEntry(null)}),
      CE('div',{className:'side-panel open'},
        CE('div',{className:'side-panel-header'},
          CE('h3',{style:{fontSize:14}},e.thematique||e.commune||'Atelier'),
          CE('button',{onClick:()=>setSelectedEntry(null),style:{background:'none',border:'none',cursor:'pointer',fontSize:18,color:'#718096',padding:0}},'✕')
        ),
        CE('div',{className:'side-panel-body'},
          CE('div',{className:'sp-field'},CE('label',null,'Statut'),badgePill(e.statut,isRetard(e))),
          CE('div',{className:'sp-field'},CE('label',null,'Conseiller'),CE('div',{style:{fontWeight:700,color,fontSize:13}},e.conseiller||'—')),
          CE('div',{className:'sp-field'},CE('label',null,'Date & Créneau'),
            CE('div',{style:{fontWeight:600}},fmtDate(e.date)+(e.horaire?' — '+e.horaire:'')+(e.ampm?' ('+e.ampm+')':''))),
          CE('div',{className:'sp-field'},CE('label',null,'Commune'),CE('div',null,e.commune||'—')),
          CE('div',{className:'sp-field'},CE('label',null,'Thématique'),CE('div',null,e.thematique||'—')),
          e.orienteur&&CE('div',{className:'sp-field'},CE('label',null,'Orienteur'),CE('div',null,e.orienteur)),CE('div',{className:'sp-field'},CE('label',null,'Matériels'),CE('div',{style:{fontSize:12,color:(e.materiel&&e.materiel.length>0)?'inherit':'#a0aec0'}},(e.materiel&&e.materiel.length>0)?e.materiel.join(', '):'—')),
          (e.inscrits||e.presents)&&CE('div',{className:'sp-field'},CE('label',null,'Participants'),
            CE('div',null,(e.presents||'—')+' présents / '+(e.inscrits||'—')+' inscrits')),
          e.public&&CE('div',{className:'sp-field'},CE('label',null,'Public'),CE('div',null,e.public)),
          e.remarques&&CE('div',{className:'sp-field'},CE('label',null,'Remarques'),
            CE('div',{style:{fontSize:12,color:'#4a5568',fontStyle:'italic',lineHeight:1.5}},e.remarques))
        ),
        CE('div',{className:'side-panel-footer'},
          onEdit&&CE('button',{className:'btn btn-primary btn-sm',onClick:()=>{onEdit(e._id);setSelectedEntry(null);}},'✏️ Modifier'),
          onDuplicate&&CE('button',{className:'btn btn-secondary btn-sm',onClick:()=>{onDuplicate(e);setSelectedEntry(null);}},'📋 Dupliquer'),
          canDelete&&CE('button',{className:'btn btn-danger btn-sm',
            onClick:()=>{setConfirmDel({id:e._id,label:`${fmtDate(e.date)} — ${e.thematique||e.commune||e._id}`});setSelectedEntry(null);}
          },'🗑️ Supprimer')
        )
      )
    );
  }

  return CE('div',null,
    CE('div',{className:'card'},

      // ── Barre navigation ───────────────────────────────────
      CE('div',{style:{display:'flex',alignItems:'center',gap:8,marginBottom:14,flexWrap:'wrap'}},
        CE('div',{style:{display:'flex',gap:4}},
          CE('button',{className:'btn btn-secondary btn-sm',onClick:()=>setWeekOffset(w=>w-1)},'← Préc.'),
          CE('button',{className:'btn btn-secondary btn-sm',onClick:()=>setWeekOffset(0),disabled:weekOffset===0,style:{opacity:weekOffset===0?.4:1}},'Auj.'),
          CE('button',{className:'btn btn-secondary btn-sm',onClick:()=>setWeekOffset(w=>w+1)},'Suiv. →')
        ),
        CE('h2',{style:{margin:0,flex:1,textAlign:'center',fontSize:14,fontWeight:700,color:'#1a202c'}},
          '🗓️ Semaine du '+fmtWeekLabel()),
        CE('div',{style:{display:'flex',gap:5,flexWrap:'wrap'}},
          CE('span',{style:{fontSize:11,background:'#f1f5f9',borderRadius:20,padding:'3px 10px',color:'#475569'}},totalW+' atelier'+(totalW!==1?'s':'')),
          planifies>0&&CE('span',{style:{fontSize:11,background:'#dbeafe',borderRadius:20,padding:'3px 10px',color:'#1d4ed8'}},planifies+' planifié'+(planifies>1?'s':'')),
          realises>0&&CE('span',{style:{fontSize:11,background:'#dcfce7',borderRadius:20,padding:'3px 10px',color:'#166534'}},realises+' réalisé'+(realises>1?'s':'')),
          retards>0&&CE('span',{style:{fontSize:11,background:'#fee2e2',borderRadius:20,padding:'3px 10px',color:'#991b1b',fontWeight:700}},'⚠ '+retards+' retard'+(retards>1?'s':''))
        )
      ),

      // ── Chips conseillers ──────────────────────────────────
      CE('div',{className:'chip-bar',style:{marginBottom:10}},
        CE('span',{className:'chip chip-all'+(filterConseiller==='Tous'?' active':''),onClick:()=>setFilterConseiller('Tous')},
          CE('span',{className:'chip-dot'}),'Tous'),
        conseillers.map(c=>CE('span',{
          key:c,className:'chip'+(filterConseiller===c?' active':''),
          style:{color:conseillerColor(c)},
          onClick:()=>setFilterConseiller(f=>f===c?'Tous':c)
        },CE('span',{className:'chip-dot',style:{background:conseillerColor(c)}}),c))
      ),

      // ── KPIs semaine ──────────────────────────────────────
      CE('div',{key:firstDay,style:{display:'flex',gap:8,flexWrap:'wrap',marginBottom:14}},
        CE('div',{className:'kpi-mini',style:{flex:'1 1 70px',borderLeft:'3px solid #1e3a8a',background:'#f0f4ff',animationDelay:'.00s'}},CE('div',{className:'v',style:{color:'#1e3a8a',fontSize:20}},totalW),CE('div',{className:'l'},'Ateliers')),
        CE('div',{className:'kpi-mini',style:{flex:'1 1 70px',borderLeft:'3px solid #16a34a',background:'#f0fdf4',animationDelay:'.07s'}},CE('div',{className:'v',style:{color:'#166534',fontSize:20}},realises),CE('div',{className:'l'},'Réalisés')),
        CE('div',{className:'kpi-mini',style:{flex:'1 1 70px',borderLeft:'3px solid #2563eb',background:'#eff6ff',animationDelay:'.14s'}},CE('div',{className:'v',style:{color:'#2563eb',fontSize:20}},planifies),CE('div',{className:'l'},'Planifiés')),
        CE('div',{className:'kpi-mini',style:{flex:'1 1 70px',borderLeft:'3px solid #7c3aed',background:'#faf5ff',animationDelay:'.21s'}},CE('div',{className:'v',style:{color:'#7c3aed',fontSize:20}},inscritsW),CE('div',{className:'l'},'Inscrits')),
        CE('div',{className:'kpi-mini',style:{flex:'1 1 70px',borderLeft:'3px solid #0891b2',background:'#ecfeff',animationDelay:'.28s'}},CE('div',{className:'v',style:{color:'#0891b2',fontSize:20}},presentsW),CE('div',{className:'l'},'Présents'))
      ),

      // ── Grille ────────────────────────────────────────────
      CE('div',{style:{overflowX:'auto'}},
        CE('table',{style:{width:'100%',borderCollapse:'separate',borderSpacing:'4px 0',tableLayout:'fixed',minWidth:580}},
          CE('thead',null,
            CE('tr',null,
              CE('th',{style:{width:36,border:'none',background:'transparent'}}),
              weekDays.map(d=>{
                const dkey=dk(d);const isToday=dkey===todayStr;
                const count=(slots[dkey]?slots[dkey].AM.length+slots[dkey].PM.length:0);
                const acc=isToday?accentColor:'#6b7280';
                return CE('th',{key:dkey,style:{
                  padding:'10px 6px 8px',textAlign:'center',border:'none',
                  background:isToday?accentColor+'15':'#f8fafc',
                  borderRadius:'12px 12px 0 0',fontWeight:400
                }},
                  CE('div',{style:{fontSize:10,fontWeight:800,textTransform:'uppercase',letterSpacing:'.08em',color:acc}},JOURS[d.getDay()]),
                  CE('div',{style:{fontSize:26,fontWeight:800,lineHeight:1.1,color:isToday?accentColor:'#1a202c',margin:'2px 0'}},d.getDate()),
                  CE('div',{style:{fontSize:10,color:'#9ca3af',marginBottom:4}},MOIS[d.getMonth()]),
                  count>0&&CE('span',{style:{
                    display:'inline-block',background:isToday?accentColor:'#e2e8f0',
                    color:isToday?'#fff':'#4a5568',borderRadius:20,
                    fontSize:10,fontWeight:700,padding:'1px 8px'
                  }},count)
                );
              })
            )
          ),
          CE('tbody',null,
            ['AM','PM'].map((slot,si)=>CE('tr',{key:slot},
              CE('td',{style:{
                textAlign:'center',fontWeight:800,fontSize:11,
                color:slot==='AM'?'#2563eb':'#d97706',
                background:slot==='AM'?'#eff6ff':'#fffbeb',
                borderRadius:8,padding:'6px 2px',verticalAlign:'middle',width:36
              }},slot),
              weekDays.map(d=>{
                const dkey=dk(d);const isToday=dkey===todayStr;
                const items=slots[dkey]?slots[dkey][slot]:[];
                return CE('td',{key:dkey+slot,style:{
                  verticalAlign:'top',padding:4,
                  background:isToday
                    ?(slot==='AM'?accentColor+'12':accentColor+'08')
                    :(slot==='AM'?'#f8fafc':'#fafafa'),
                  borderBottom:si===0?`1px dashed ${isToday?accentColor+'40':'#e2e8f0'}`:'none',
                  borderRadius:si===1?'0 0 10px 10px':'0',
                  border:isToday&&si===1?`1px solid ${accentColor}30`:'',
                  minHeight:70
                }},
                  items.length>0
                    ?items.map(e=>renderCard(e))
                    :CE('div',{style:{height:66,display:'flex',alignItems:'center',justifyContent:'center'}},
                        CE('span',{style:{fontSize:14,color:'#e2e8f0'}},slot==='AM'?'☀️':'🌙')
                      )
                );
              })
            ))
          )
        )
      )
    ),

    CE(SidePanel,null),

    confirmDel&&CE(ConfirmModal,{
      item:confirmDel,
      onConfirm:async()=>{if(onDelete)await onDelete(confirmDel.id);setConfirmDel(null);},
      onCancel:()=>setConfirmDel(null)
    })
  );
}
// ── VueRoadmap — Timeline & Densité par conseiller ──────────
// ════════════════════════════════════════════════════════════
function VueRoadmap({entries,annee,conseillers}){
  const[filterConseiller,setFilterConseiller]=React.useState('Tous');
  const[filterStatut,setFilterStatut]=React.useState('Tous');
  const[hoveredItem,setHoveredItem]=React.useState(null);
  const[tooltipPos,setTooltipPos]=React.useState({x:0,y:0});
  const[viewMode,setViewMode]=React.useState('gantt');
  const[tooltip,setTooltip]=React.useState(null);
  const[dateFrom,setDateFrom]=React.useState(annee+'-01-01');
  const[dateTo,setDateTo]=React.useState(annee+'-12-31');

  // Resync période quand l'année sidebar change
  React.useEffect(()=>{setDateFrom(annee+'-01-01');setDateTo(annee+'-12-31');},[annee]);

  const MOIS_FR=['Jan','Fév','Mar','Avr','Mai','Jun','Jul','Aoû','Sep','Oct','Nov','Déc'];

  const STATUT_STYLE={
    'Réalisé':    {bg:'#16a34a',border:'#15803d',label:'✓'},
    'Planifié':   {bg:'#2563eb',border:'#1d4ed8',label:'◷'},
    'Annulé':     {bg:'#dc2626',border:'#b91c1c',label:'✕'},
    'Non réalisé':{bg:'#d97706',border:'#b45309',label:'!'},
    'Reporté':    {bg:'#9333ea',border:'#7e22ce',label:'↺'},
  };

  // Raccourcis de période
  const PRESETS=[
    {label:'Année',from:annee+'-01-01',to:annee+'-12-31'},
    {label:'T1',from:annee+'-01-01',to:annee+'-03-31'},
    {label:'T2',from:annee+'-04-01',to:annee+'-06-30'},
    {label:'T3',from:annee+'-07-01',to:annee+'-09-30'},
    {label:'T4',from:annee+'-10-01',to:annee+'-12-31'},
    {label:'S1',from:annee+'-01-01',to:annee+'-06-30'},
    {label:'S2',from:annee+'-07-01',to:annee+'-12-31'},
  ];
  const activePreset=PRESETS.find(p=>p.from===dateFrom&&p.to===dateTo)||null;

  // Validation : from <= to
  const dateError=dateFrom&&dateTo&&dateFrom>dateTo;

  const rangeEntries=React.useMemo(()=>entries.filter(e=>{
    if(!e.date)return false;
    const d=String(e.date).slice(0,10);
    return d>=dateFrom&&d<=dateTo;
  }),[entries,dateFrom,dateTo]);

  const filtered=React.useMemo(()=>rangeEntries.filter(e=>{
    if(filterConseiller!=='Tous'&&e.conseiller!==filterConseiller)return false;
    if(filterStatut!=='Tous'&&e.statut!==filterStatut)return false;
    return true;
  }),[rangeEntries,filterConseiller,filterStatut]);

  const kpis=React.useMemo(()=>{
    const total=filtered.length;
    const realises=filtered.filter(e=>e.statut==='Réalisé').length;
    const presents=kpiHistorique(filtered).presents;
    const taux=total>0?Math.round(realises/total*100):0;
    return{total,realises,presents,taux};
  },[filtered]);

  // posPercent basé sur la période sélectionnée
  function posPercent(dateStr){
    try{
      const d=new Date(String(dateStr).slice(0,10)+'T00:00:00');
      const start=new Date(dateFrom+'T00:00:00');
      const end=new Date(dateTo+'T00:00:00');
      const span=end-start||1;
      return Math.max(0,Math.min(100,((d-start)/span)*100));
    }catch{return 0;}
  }

  // Marqueurs de mois dans la plage sélectionnée
  const monthMarkers=React.useMemo(()=>{
    const markers=[];
    const start=new Date(dateFrom+'T00:00:00');
    const end=new Date(dateTo+'T00:00:00');
    const cur=new Date(Date.UTC(start.getFullYear(),start.getMonth(),1));
    while(cur<=end){
      const label=MOIS_FR[cur.getMonth()]+(cur.getFullYear()!==parseInt(annee)?' '+String(cur.getFullYear()).slice(2):'');
      const ds=cur.getFullYear()+'-'+String(cur.getMonth()+1).padStart(2,'0')+'-01';
      markers.push({label,pos:posPercent(ds)});
      cur.setMonth(cur.getMonth()+1);
    }
    return markers;
  },[dateFrom,dateTo,annee]);

  const todayStr=new Date().toISOString().slice(0,10);
  const todayInRange=todayStr>=dateFrom&&todayStr<=dateTo;
  const todayPos=todayInRange?posPercent(todayStr):null;

  const displayedConseillers=filterConseiller==='Tous'
    ?(conseillers&&conseillers.length>0?conseillers:[...new Set(rangeEntries.map(e=>e.conseiller).filter(Boolean))])
    :[filterConseiller];

  function handleMouseMove(e){setTooltipPos({x:e.clientX,y:e.clientY});}

  return CE('div',{onMouseMove:handleMouseMove},

    // ── KPIs + Filtres ──────────────────────────────────────
    CE('div',{className:'card',style:{marginBottom:12}},

      // Titre + toggle vue
      CE('div',{style:{display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:10,marginBottom:14}},
        CE('h2',{style:{margin:0}},'🛣️ Roadmap '+annee),
        CE('div',{style:{display:'flex',background:'#f1f5f9',borderRadius:8,padding:3,gap:2}},
          [['gantt','📊 Timeline'],['densite','🔥 Densité']].map(([v,l])=>
            CE('button',{key:v,onClick:()=>setViewMode(v),style:{
              padding:'5px 14px',borderRadius:6,border:'none',cursor:'pointer',
              fontSize:12,fontWeight:600,
              background:viewMode===v?'#1e3a8a':'transparent',
              color:viewMode===v?'#fff':'#718096',transition:'all .2s'
            }},l)
          )
        )
      ),

      // ── Sélecteur de période ────────────────────────────────
      CE('div',{style:{
        display:'flex',gap:10,alignItems:'center',flexWrap:'wrap',
        background:'#f8fafc',borderRadius:8,padding:'10px 14px',
        border:'1px solid '+(dateError?'#fca5a5':'#e2e8f0'),
        marginBottom:14
      }},
        CE('span',{style:{fontSize:11,fontWeight:700,color:'#4a5568',whiteSpace:'nowrap'}},'📅 Période'),
        // Raccourcis
        CE('div',{style:{display:'flex',gap:4,flexWrap:'wrap'}},
          PRESETS.map(p=>CE('button',{key:p.label,onClick:()=>{setDateFrom(p.from);setDateTo(p.to);},style:{
            padding:'3px 9px',borderRadius:6,cursor:'pointer',fontSize:11,fontWeight:600,
            border:'1.5px solid '+(activePreset&&activePreset.label===p.label?'#1e3a8a':'#e2e8f0'),
            background:activePreset&&activePreset.label===p.label?'#1e3a8a':'#fff',
            color:activePreset&&activePreset.label===p.label?'#fff':'#4a5568',
            transition:'all .15s'
          }},p.label))
        ),
        // Séparateur
        CE('div',{style:{width:1,height:24,background:'#e2e8f0',flexShrink:0}}),
        // Inputs date
        CE('div',{style:{display:'flex',gap:6,alignItems:'center',flexWrap:'wrap'}},
          CE('input',{type:'date',value:dateFrom,
            onChange:e=>{setDateFrom(e.target.value);},
            style:{
              padding:'4px 8px',border:'1.5px solid '+(dateError?'#fca5a5':'#e2e8f0'),
              borderRadius:6,fontSize:12,color:'#1a202c',background:'#fff',cursor:'pointer',outline:'none'
            }
          }),
          CE('span',{style:{fontSize:12,color:'#9ca3af',fontWeight:600}},'→'),
          CE('input',{type:'date',value:dateTo,
            onChange:e=>{setDateTo(e.target.value);},
            style:{
              padding:'4px 8px',border:'1.5px solid '+(dateError?'#fca5a5':'#e2e8f0'),
              borderRadius:6,fontSize:12,color:'#1a202c',background:'#fff',cursor:'pointer',outline:'none'
            }
          }),
          dateError&&CE('span',{style:{fontSize:11,color:'#dc2626',fontWeight:600}},'⚠ Date de début > fin')
        )
      ),

      // KPIs
      CE('div',{style:{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:10,marginBottom:14}},
        [
          {label:'Ateliers',value:kpis.total,color:'#1e3a8a'},
          {label:'Réalisés',value:kpis.realises,color:'#16a34a'},
          {label:'Participants',value:kpis.presents,color:'#d97706'},
          {label:'Taux réalisation',value:kpis.taux+'%',color:kpis.taux>=75?'#16a34a':kpis.taux>=50?'#d97706':'#dc2626'},
        ].map(k=>CE('div',{key:k.label,style:{
          background:'#f8fafc',borderRadius:8,padding:'10px 14px',
          borderLeft:'3px solid '+k.color
        }},
          CE('div',{style:{fontSize:22,fontWeight:800,color:k.color}},k.value),
          CE('div',{style:{fontSize:11,color:'#718096',marginTop:2}},k.label)
        ))
      ),

      // Filtres conseiller + statut
      CE('div',{style:{display:'flex',gap:12,flexWrap:'wrap',alignItems:'center'}},
        CE('div',{className:'chip-bar',style:{margin:0}},
          ['Tous',...(conseillers||[])].map(c=>CE('span',{key:c,className:'chip'+(c==='Tous'?' chip-all':'')+(filterConseiller===c?' active':''),style:c!=='Tous'?{color:conseillerColor(c)}:{},onClick:()=>setFilterConseiller(p=>p===c&&c!=='Tous'?'Tous':c)},
            CE('span',{className:'chip-dot',style:c!=='Tous'?{background:conseillerColor(c)}:{}}),c))
        ),
        CE('div',{style:{display:'flex',gap:5,alignItems:'center',flexWrap:'wrap'}},
          CE('span',{style:{fontSize:11,color:'#9ca3af',fontWeight:600}},'Statut :'),
          ['Tous',...Object.keys(STATUT_STYLE)].map(s=>CE('button',{key:s,onClick:()=>setFilterStatut(s),style:{
            padding:'3px 10px',borderRadius:20,cursor:'pointer',fontSize:11,
            fontWeight:filterStatut===s?700:400,
            border:'1.5px solid '+(filterStatut===s?(STATUT_STYLE[s]?.bg||'#1e3a8a'):'#e2e8f0'),
            background:filterStatut===s?(STATUT_STYLE[s]?.bg||'#1e3a8a')+'18':'transparent',
            color:filterStatut===s?(STATUT_STYLE[s]?.bg||'#1e3a8a'):'#4a5568',
            transition:'all .15s'
          }},s))
        )
      )
    ),

    // ── GANTT ────────────────────────────────────────────────
    viewMode==='gantt'&&CE('div',{className:'card',style:{padding:0,overflow:'hidden'}},
      // En-tête mois
      CE('div',{style:{display:'flex',borderBottom:'1px solid #e2e8f0',background:'#f8fafc'}},
        CE('div',{style:{width:170,minWidth:170,padding:'8px 16px',fontSize:10,fontWeight:700,color:'#9ca3af',textTransform:'uppercase',letterSpacing:'.08em',borderRight:'1px solid #e2e8f0'}},'Conseiller'),
        CE('div',{style:{flex:1,position:'relative',height:32}},
          monthMarkers.map((m,i)=>CE('div',{key:i,style:{
            position:'absolute',left:m.pos+'%',top:0,height:'100%',
            borderLeft:'1px dashed #e2e8f0',display:'flex',alignItems:'center',paddingLeft:5
          }},CE('span',{style:{fontSize:10,fontWeight:700,color:'#9ca3af',whiteSpace:'nowrap'}},m.label))),
          todayPos!==null&&CE('div',{style:{
            position:'absolute',left:todayPos+'%',top:0,height:'100%',
            borderLeft:'2px solid #dc2626',pointerEvents:'none'
          }},CE('span',{style:{
            position:'absolute',top:6,left:4,fontSize:9,color:'#dc2626',
            fontWeight:700,whiteSpace:'nowrap',background:'#fff',padding:'0 2px',borderRadius:2
          }},'Auj.'))
        )
      ),
      // Lignes conseillers
      displayedConseillers.map((conseiller,ci)=>{
        const col=conseillerColor(conseiller)||'#1e3a8a';
        const items=filtered.filter(e=>e.conseiller===conseiller);
        return CE('div',{key:conseiller,style:{
          display:'flex',background:ci%2===0?'#fff':'#fafbfc',
          borderBottom:'1px solid #f0f4f8',minHeight:58
        }},
          CE('div',{style:{
            width:170,minWidth:170,padding:'10px 16px',
            borderRight:'1px solid #e2e8f0',
            display:'flex',alignItems:'center',gap:8
          }},
            CE('div',{style:{width:8,height:8,borderRadius:'50%',background:col,flexShrink:0,boxShadow:'0 0 4px '+col+'88'}}),
            CE('div',null,
              CE('div',{style:{fontSize:12,fontWeight:700,color:'#1a202c',lineHeight:1.2}},conseiller.split(' ')[0]),
              CE('div',{style:{fontSize:10,color:'#9ca3af'}},conseiller.split(' ').slice(1).join(' '))
            ),
            CE('span',{style:{
              marginLeft:'auto',fontSize:10,fontWeight:700,
              background:col+'18',color:col,padding:'2px 7px',
              borderRadius:20,border:'1px solid '+col+'30'
            }},items.length)
          ),
          CE('div',{style:{flex:1,position:'relative',minHeight:58}},
            monthMarkers.map((m,i)=>CE('div',{key:i,style:{
              position:'absolute',left:m.pos+'%',top:0,height:'100%',
              borderLeft:'1px dashed #f0f4f8',pointerEvents:'none'
            }})),
            todayPos!==null&&CE('div',{style:{
              position:'absolute',left:todayPos+'%',top:0,height:'100%',
              borderLeft:'1px solid #dc262633',pointerEvents:'none'
            }}),
            items.map(item=>{
              const pos=posPercent(item.date);
              const st=STATUT_STYLE[item.statut]||{bg:'#9ca3af',border:'#6b7280',label:'?'};
              const isH=hoveredItem&&hoveredItem._id===item._id;
              return CE('div',{
                key:item._id||item.date+item.conseiller+Math.random(),
                onMouseEnter:()=>setHoveredItem(item),
                onMouseLeave:()=>setHoveredItem(null),
                style:{
                  position:'absolute',left:'calc('+pos+'% - 9px)',
                  top:'50%',transform:'translateY(-50%) scale('+(isH?1.35:1)+')',
                  width:18,height:18,borderRadius:5,
                  background:st.bg,border:'2px solid '+st.border,
                  cursor:'pointer',zIndex:isH?20:1,
                  boxShadow:isH?'0 0 10px '+st.bg+'88':'none',
                  transition:'transform .12s,box-shadow .12s',
                  display:'flex',alignItems:'center',justifyContent:'center',
                  fontSize:8,color:'#fff',fontWeight:700,userSelect:'none'
                }
              },st.label);
            })
          )
        );
      }),
      // Légende
      CE('div',{style:{display:'flex',gap:14,padding:'10px 16px',background:'#f8fafc',borderTop:'1px solid #e2e8f0',flexWrap:'wrap'}},
        Object.entries(STATUT_STYLE).map(([s,st])=>CE('div',{key:s,style:{display:'flex',alignItems:'center',gap:5,fontSize:11,color:'#4a5568'}},
          CE('div',{style:{width:14,height:14,borderRadius:3,background:st.bg,display:'flex',alignItems:'center',justifyContent:'center',fontSize:7,color:'#fff',fontWeight:700}},st.label),
          s
        )),
        filtered.length===0&&CE('span',{style:{fontSize:12,color:'#9ca3af',marginLeft:'auto'}},'Aucun atelier pour cette période')
      )
    ),

    // ── DENSITÉ ──────────────────────────────────────────────
    viewMode==='densite'&&(()=>{
      // Calcul des mois visibles dans la plage dateFrom → dateTo
      const visibleMonths=[];
      const cur=new Date(dateFrom+'T00:00:00');
      const endD=new Date(dateTo+'T00:00:00');
      // On démarre au 1er du mois de dateFrom
      cur.setDate(1);
      while(cur<=endD){
        visibleMonths.push({
          year:cur.getFullYear(),
          month:cur.getMonth()+1, // 1-12
          label:MOIS_FR[cur.getMonth()]+(cur.getFullYear()!==parseInt(annee)?' '+String(cur.getFullYear()).slice(2):'')
        });
        cur.setMonth(cur.getMonth()+1);
      }

      // max global sur tous conseillers/mois pour harmoniser les barres
      const allCounts=displayedConseillers.flatMap(conseiller=>{
        const items=filtered.filter(e=>e.conseiller===conseiller);
        return visibleMonths.map(({year,month})=>
          items.filter(e=>{
            const d=String(e.date||'');
            return parseInt(d.slice(0,4))===year&&parseInt(d.slice(5,7))===month;
          }).length
        );
      });
      const globalMax=Math.max(...allCounts,1);

      return CE('div',{className:'card'},
        CE('div',{style:{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:16,flexWrap:'wrap',gap:8}},
          CE('h3',{style:{margin:0,fontSize:14,color:'#1a202c'}},'Ateliers par mois & conseiller'),
          CE('div',{style:{display:'flex',gap:12,fontSize:11,color:'#9ca3af'}},
            CE('span',null,'▪ Clair = planifiés/autres'),
            CE('span',null,'▪ Plein = réalisés')
          )
        ),
        visibleMonths.length===0
          ?CE('p',{style:{color:'#9ca3af',fontSize:13}},'Aucune période sélectionnée.')
          :CE('div',{style:{overflowX:'auto'}},
            CE('table',{style:{width:'100%',borderCollapse:'collapse',minWidth:Math.max(400,visibleMonths.length*52+140)}},
              CE('thead',null,CE('tr',null,
                CE('th',{style:{width:140,minWidth:140,textAlign:'left',padding:'6px 10px',fontSize:11,fontWeight:700,color:'#9ca3af',borderBottom:'2px solid #e2e8f0'}},'Conseiller'),
                visibleMonths.map(({label},i)=>CE('th',{key:i,style:{textAlign:'center',padding:'6px 8px',fontSize:11,fontWeight:700,color:'#9ca3af',borderBottom:'2px solid #e2e8f0',whiteSpace:'nowrap'}},label))
              )),
              CE('tbody',null,
                displayedConseillers.map(conseiller=>{
                  const col=conseillerColor(conseiller)||'#1e3a8a';
                  const items=filtered.filter(e=>e.conseiller===conseiller);
                  const byMonth=visibleMonths.map(({year,month})=>{
                    const inMonth=items.filter(e=>{
                      const d=String(e.date||'');
                      return parseInt(d.slice(0,4))===year&&parseInt(d.slice(5,7))===month;
                    });
                    return{count:inMonth.length,realises:inMonth.filter(e=>e.statut==='Réalisé').length};
                  });
                  return CE('tr',{key:conseiller},
                    CE('td',{style:{padding:'8px 10px',borderBottom:'1px solid #f0f4f8',whiteSpace:'nowrap'}},
                      CE('div',{style:{display:'flex',alignItems:'center',gap:6}},
                        CE('div',{style:{width:8,height:8,borderRadius:'50%',background:col,flexShrink:0}}),
                        CE('span',{style:{fontSize:12,fontWeight:700,color:'#1a202c'}},conseiller.split(' ')[0])
                      )
                    ),
                    byMonth.map((m,mi)=>{
                      const mLabel=visibleMonths[mi].label;
                      const planifies=m.count-m.realises;
                      return CE('td',{key:mi,style:{
                        padding:'8px 4px',borderBottom:'1px solid #f0f4f8',
                        verticalAlign:'bottom',textAlign:'center',position:'relative',cursor:m.count>0?'pointer':'default'
                      },
                      onMouseEnter:m.count>0?e=>{const r=e.currentTarget.getBoundingClientRect();setTooltip({conseiller,mois:mLabel,total:m.count,realises:m.realises,planifies,col,x:r.left+r.width/2,y:r.top});}:null,
                      onMouseLeave:()=>setTooltip(null)
                      },
                        CE('div',{style:{display:'flex',flexDirection:'column',alignItems:'center',gap:2}},
                          CE('div',{style:{
                            width:26,background:col+'28',borderRadius:'4px 4px 0 0',
                            height:Math.max(4,Math.round(m.count/globalMax*52))+'px',
                            position:'relative',overflow:'hidden'
                          }},
                            CE('div',{style:{
                              position:'absolute',bottom:0,left:0,right:0,
                              height:(m.count>0?Math.round(m.realises/m.count*100):0)+'%',
                              background:col,borderRadius:'4px 4px 0 0'
                            }})
                          ),
                          m.count>0&&CE('span',{style:{fontSize:10,fontWeight:700,color:col}},m.count)
                        )
                      );
                    })
                  );
                })
              )
            )
          ),
        tooltip&&CE('div',{style:{
          position:'fixed',zIndex:9999,
          left:Math.min(tooltip.x,window.innerWidth-160)+'px',
          top:(tooltip.y-88)+'px',
          transform:'translateX(-50%)',
          background:'#1a202c',color:'#fff',
          borderRadius:10,padding:'10px 14px',
          fontSize:12,pointerEvents:'none',
          boxShadow:'0 4px 20px rgba(0,0,0,.3)',
          minWidth:140,lineHeight:1.7
        }},
          CE('div',{style:{fontWeight:700,color:tooltip.col,marginBottom:4}},tooltip.conseiller.split(' ')[0]+' — '+tooltip.mois),
          CE('div',null,React.createElement(React.Fragment,null,'📦 Total : ',CE('strong',null,tooltip.total))),
          CE('div',null,React.createElement(React.Fragment,null,'✅ Réalisés : ',CE('strong',{style:{color:'#4ade80'}},tooltip.realises))),
          CE('div',null,React.createElement(React.Fragment,null,'📅 Planifiés : ',CE('strong',{style:{color:'#93c5fd'}},tooltip.planifies)))
        )
      );
    })(),

    // ── Tooltip opaque ───────────────────────────────────────
    hoveredItem&&CE('div',{style:{
      position:'fixed',
      left:Math.min(tooltipPos.x+16,window.innerWidth-255)+'px',
      top:(tooltipPos.y+18)+'px',
      background:'#1a202c',
      border:'1px solid #2d3748',
      borderRadius:10,padding:'12px 16px',
      boxShadow:'0 8px 24px rgba(0,0,0,.6)',
      zIndex:9999,minWidth:230,
      pointerEvents:'none',color:'#e2e8f0',
    }},
      CE('div',{style:{fontWeight:700,fontSize:13,color:'#fff',marginBottom:8,paddingBottom:8,borderBottom:'1px solid #2d3748'}},
        hoveredItem.thematique||'—'),
      CE('div',{style:{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'4px 10px',marginBottom:10}},
        [
          ['📅',String(hoveredItem.date||'—').slice(0,10)],
          ['📍',hoveredItem.commune||'—'],
          ['🏢',hoveredItem.lieu||'—'],
          ['👤',(hoveredItem.conseiller||'—').split(' ')[0]],
          ['📋',(hoveredItem.inscrits||'—')+' inscrits'],
          ['✅',(hoveredItem.presents||'—')+' présents'],
        ].map(([ico,val])=>CE('div',{key:ico,style:{fontSize:11,display:'flex',gap:4,alignItems:'center'}},
          CE('span',null,ico),
          CE('span',{style:{color:'#cbd5e1',fontWeight:600}},String(val))
        ))
      ),
      CE('div',{style:{
        display:'inline-block',padding:'3px 10px',borderRadius:20,
        background:(STATUT_STYLE[hoveredItem.statut]||{bg:'#6b7280'}).bg,
        color:'#fff',fontSize:11,fontWeight:700
      }},
        (STATUT_STYLE[hoveredItem.statut]||{label:'?'}).label+' '+(hoveredItem.statut||'—')
      )
    )
  );
}

function VueDashboard({entries}){
  if(!window.echarts)return CE('div',{className:'card'},CE('p',{style:{color:'#718096',textAlign:'center',padding:'40px 0'}},'⚠️ ECharts non chargé.'));

  const[periodeIdx,setPeriodeIdx]=React.useState(0); // défaut : tout
  const[selectedMonths,setSelectedMonths]=React.useState([]); // mois sélectionnés (1-12)
  const MOIS_LABELS=['Jan','Fév','Mar','Avr','Mai','Jun','Jul','Aoû','Sep','Oct','Nov','Déc'];
  function toggleMonth(m){ setSelectedMonths(s=>s.includes(m)?s.filter(x=>x!==m):[...s,m]); }
  const now=new Date();
  const todayStr=now.toISOString().slice(0,10);
  const todayYM=now.toISOString().slice(0,7);

  function getDateFrom(idx){
    if(idx===0)return '';
    const d=new Date(now);
    if(idx===1){d.setDate(1);return d.toISOString().slice(0,10);}
    if(idx===2){d.setMonth(d.getMonth()-3);return d.toISOString().slice(0,10);}
    if(idx===3){d.setMonth(d.getMonth()-6);return d.toISOString().slice(0,10);}
    if(idx===4){d.setFullYear(d.getFullYear()-1);return d.toISOString().slice(0,10);}
    return '';
  }
  const dateFrom=getDateFrom(periodeIdx);
  const filtered=React.useMemo(()=>{
    let r=dateFrom?entries.filter(e=>e.date&&e.date>=dateFrom):entries;
    if(selectedMonths.length>0) r=r.filter(e=>e.date&&selectedMonths.includes(parseInt(e.date.slice(5,7))));
    return r;
  },[entries,dateFrom,selectedMonths]);

  // Période précédente (même durée) pour tendances
  const prevFiltered=React.useMemo(()=>{
    if(periodeIdx===0)return[];
    const df=new Date(dateFrom);const prevTo=new Date(dateFrom);prevTo.setDate(prevTo.getDate()-1);
    const prevFrom=new Date(df);
    if(periodeIdx===1)prevFrom.setMonth(prevFrom.getMonth()-1);
    if(periodeIdx===2)prevFrom.setMonth(prevFrom.getMonth()-3);
    if(periodeIdx===3)prevFrom.setMonth(prevFrom.getMonth()-6);
    if(periodeIdx===4)prevFrom.setFullYear(prevFrom.getFullYear()-1);
    const pf=prevFrom.toISOString().slice(0,10);const pt=prevTo.toISOString().slice(0,10);
    return entries.filter(e=>e.date&&e.date>=pf&&e.date<=pt);
  },[entries,periodeIdx,dateFrom]);

  function mkTrend(curr,prev){
    if(periodeIdx===0||prev===0)return undefined;
    return Math.round((curr-prev)/prev*100);
  }

  // KPIs
  const realises=filtered.filter(e=>e.statut==='Réalisé');
  const annules=filtered.filter(e=>e.statut==='Annulé');
  const planifies=filtered.filter(e=>e.statut==='Planifié'&&e.date>=todayStr);
  const presents=realises.reduce((s,e)=>s+(parseInt(e.presents)||0),0);
  const inscrits=realises.reduce((s,e)=>s+(parseInt(e.inscrits)||0),0);
  const txPresence=inscrits>0?Math.round(presents/inscrits*100):0;
  const txAnnul=filtered.length>0?Math.round(annules.length/filtered.length*100):0;
  const prevR=prevFiltered.filter(e=>e.statut==='Réalisé');
  const prevPresents=prevR.reduce((s,e)=>s+(parseInt(e.presents)||0),0);

  // Statuts donut
  const STATUS_COLORS={'Réalisé':'#16a34a','Planifié':'#2563eb','Annulé':'#dc2626','Non réalisé':'#d97706','Reporté':'#9683EC'};
  const byStat={};filtered.forEach(e=>{byStat[e.statut]=(byStat[e.statut]||0)+1;});
  const dataStat=Object.entries(byStat).map(([label,value])=>({label,value}));

  // Activité mensuelle empilée
  const byMoisAct={};filtered.forEach(e=>{
    const m=e.date?e.date.slice(0,7):'?';
    if(m==='?')return;
    if(!byMoisAct[m])byMoisAct[m]={realises:0,annules:0,planifies:0};
    if(e.statut==='Réalisé')byMoisAct[m].realises++;
    else if(e.statut==='Annulé')byMoisAct[m].annules++;
    else if(e.statut==='Planifié')byMoisAct[m].planifies++;
  });

  // Top communes
  const byCommune={};realises.forEach(e=>{byCommune[e.commune]=(byCommune[e.commune]||0)+1;});
  const topCommunes=Object.entries(byCommune).sort((a,b)=>b[1]-a[1]).slice(0,8).map(([label,value])=>({label,value}));

  // Thématiques
  const byTheme={};realises.forEach(e=>{const t=e.thematique||'Autre';byTheme[t]=(byTheme[t]||0)+1;});
  const dataTheme=Object.entries(byTheme).sort((a,b)=>b[1]-a[1]).slice(0,8).map(([label,value])=>({label,value}));

  // Public
  const byPublic={};realises.forEach(e=>{const p=e.public||'Autres';byPublic[p]=(byPublic[p]||0)+1;});
  const dataPublic=Object.entries(byPublic).sort((a,b)=>b[1]-a[1]).map(([label,value])=>({label,value}));

  const PERIODES=[{l:'Tout'},{l:'Ce mois'},{l:'3 mois'},{l:'6 mois'},{l:'12 mois'}];
  const accent='#1e3a8a';

  return CE('div',null,

    // ── Barre période ──
    CE('div',{className:'card',style:{marginBottom:12,padding:'12px 16px'}},
      CE('div',{style:{display:'flex',alignItems:'center',gap:8,flexWrap:'wrap'}},
        CE('span',{style:{fontSize:12,fontWeight:700,color:'#718096'}},'Période :'),
        PERIODES.map((p,i)=>CE('button',{key:i,onClick:()=>setPeriodeIdx(i),style:{
          padding:'4px 13px',borderRadius:20,fontSize:12,fontWeight:600,cursor:'pointer',
          border:`1.5px solid ${periodeIdx===i?accent:'#e2e8f0'}`,
          background:periodeIdx===i?accent:'#fff',
          color:periodeIdx===i?'#fff':'#718096',transition:'all .15s'
        }},p.l)),
        CE('span',{style:{marginLeft:'auto',fontSize:11,color:'#9ca3af'}},filtered.length+' ateliers · '+now.toLocaleDateString('fr-FR'))
      ),
      CE('div',{style:{display:'flex',alignItems:'center',gap:6,flexWrap:'wrap',marginTop:8,paddingTop:8,borderTop:'1px solid #f1f5f9'}},
        CE('span',{style:{fontSize:12,fontWeight:700,color:'#718096'}},'Mois :'),
        MOIS_LABELS.map((m,i)=>{const mo=i+1;return CE('button',{key:mo,onClick:()=>toggleMonth(mo),style:{
          padding:'3px 10px',borderRadius:20,fontSize:11,fontWeight:600,cursor:'pointer',
          border:`1.5px solid ${selectedMonths.includes(mo)?accent:'#e2e8f0'}`,
          background:selectedMonths.includes(mo)?accent:'#fff',
          color:selectedMonths.includes(mo)?'#fff':'#718096',transition:'all .15s'
        }},m);}),
        selectedMonths.length>0&&CE('button',{onClick:()=>setSelectedMonths([]),style:{
          padding:'3px 10px',borderRadius:20,fontSize:11,cursor:'pointer',
          border:'1.5px solid #fca5a5',background:'#fff',color:'#ef4444',fontWeight:600
        }},'✕ Effacer')
      )
    ),

    // ── KPIs ──
    CE('div',{style:{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(160px,1fr))',gap:12,marginBottom:16}},
      CE(KpiCard,{val:realises.length,lbl:'Ateliers réalisés',icon:'✅',color:'#16a34a',bgColor:'#f0fdf4',trend:mkTrend(realises.length,prevR.length)}),
      CE(KpiCard,{val:planifies.length,lbl:'Planifiés à venir',icon:'📅',color:'#2563eb',bgColor:'#eff6ff'}),
      CE(KpiCard,{val:presents,lbl:'Participants présents',icon:'👥',color:'#7c3aed',bgColor:'#faf5ff',trend:mkTrend(presents,prevPresents)}),
      CE(KpiCard,{val:inscrits,lbl:'Inscrits total',icon:'📝',color:'#0891b2',bgColor:'#ecfeff'}),
      CE(KpiCard,{val:txPresence+'%',lbl:'Taux de présence',icon:'🎯',
        color:txPresence>=70?'#16a34a':txPresence>=50?'#d97706':'#dc2626',
        bgColor:txPresence>=70?'#f0fdf4':txPresence>=50?'#fffbeb':'#fef2f2'}),
      CE(KpiCard,{val:txAnnul+'%',lbl:'Taux d\'annulation',icon:'❌',
        color:txAnnul<=10?'#16a34a':txAnnul<=20?'#d97706':'#dc2626',
        bgColor:txAnnul<=10?'#f0fdf4':txAnnul<=20?'#fffbeb':'#fef2f2'})
    ),

    // ── Ligne 1 : Activité mensuelle + Donut statuts ──
    CE('div',{style:{display:'grid',gridTemplateColumns:'2fr 1fr',gap:16,marginBottom:16}},
      CE('div',{className:'card'},
        CE('h2',null,'📈 Activité mensuelle'),
        CE(StackedActivityChart,{data:byMoisAct})
      ),
      CE('div',{className:'card'},
        CE('h2',null,'🔵 Répartition statuts'),
        CE(DonutChart,{data:dataStat,colors:dataStat.map(d=>STATUS_COLORS[d.label]||'#718096'),height:220})
      )
    ),

    // ── Ligne 2 : Par conseiller (pleine largeur) ──
    CE('div',{className:'card',style:{marginBottom:16}},
      CE('h2',null,'👤 Performance par conseiller'),
      CE(ConseillerBarChart,{entries:filtered})
    ),

    // ── Ligne 3 : Communes + Thématiques ──
    CE('div',{style:{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16,marginBottom:16}},
      CE('div',{className:'card'},
        CE('h2',null,'📍 Top communes (réalisés)'),
        CE(BarChart,{data:topCommunes,colors:['#1e3a8a','#2563eb','#3b82f6','#60a5fa','#93c5fd']})
      ),
      CE('div',{className:'card'},
        CE('h2',null,'📚 Par thématique'),
        CE(BarChart,{data:dataTheme,colors:['#7c3aed','#8b5cf6','#a78bfa','#c4b5fd']})
      )
    ),

    // ── Ligne 4 : Public + AM/PM ──
    CE('div',{style:{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16}},
      CE('div',{className:'card'},
        CE('h2',null,'🧑‍🤝‍🧑 Par type de public'),
        CE(BarChart,{data:dataPublic,colors:['#DB2777','#ec4899','#f472b6','#fbcfe8']})
      ),
      CE('div',{className:'card'},
        CE('h2',null,'🌅 Matin vs Après-midi'),
        CE(DonutChart,{
          data:[
            {label:'Matin (AM)',value:filtered.filter(e=>e.ampm==='AM'||(!e.ampm&&e.horaire&&parseInt(e.horaire)<12)).length},
            {label:'Après-midi (PM)',value:filtered.filter(e=>e.ampm==='PM'||(!e.ampm&&e.horaire&&parseInt(e.horaire)>=12)).length}
          ],
          colors:['#f97316','#0891b2'],height:200
        })
      )
    )
  );
}


// ── VueDashboardTabs — Dashboard unifié (3 onglets) ──────────
function VueDashboardTabs({entries, conseillers}){
  const[tab,setTab]=React.useState('dashboard');
  const TABS=[
    {id:'dashboard', ico:'🚀', label:'Synthèse'},
    {id:'graphiques', ico:'📊', label:'Analyse'},
    {id:'powerbi',    ico:'🗺️', label:'Territoire'},
  ];
  return CE('div',null,
    CE('div',{style:{display:'flex',borderBottom:'2px solid #e5e7eb',marginBottom:16,gap:4}},
      TABS.map(t=>CE('button',{
        key:t.id,
        onClick:()=>setTab(t.id),
        style:{
          padding:'8px 18px',border:'none',background:'none',cursor:'pointer',
          fontSize:13,fontWeight:tab===t.id?700:400,fontFamily:'inherit',
          color:tab===t.id?'var(--accent,#0ea5e9)':'#6b7280',
          borderBottom:tab===t.id?'3px solid var(--accent,#0ea5e9)':'3px solid transparent',
          marginBottom:-2,transition:'all .15s'
        }
      }, t.ico+' '+t.label))
    ),
    tab==='dashboard'  && CE(VueDashboard,{entries}),
    tab==='graphiques' && CE(VueGraphiques,{entries}),
    tab==='powerbi'    && CE(VuePowerBI,{entries,conseillers})
  );
}
