// ═══════════════════════════════════════════════════════════
// shared.js — Ateliers CD47 v9.0
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
.listes-modal{background:#fff;border-radius:14px;width:580px;max-width:100%;max-height:90vh;display:flex;flex-direction:column;box-shadow:0 20px 60px rgba(0,0,0,.25);overflow:hidden}
.listes-header{background:#1e3a8a;color:#fff;padding:18px 22px 14px;flex-shrink:0;position:relative}
.listes-header h2{font-size:17px;font-weight:700;margin-bottom:2px}
.listes-header p{font-size:12px;opacity:.75}
.listes-close{position:absolute;top:14px;right:16px;background:rgba(255,255,255,.2);border:none;color:#fff;width:28px;height:28px;border-radius:50%;cursor:pointer;font-size:16px;display:flex;align-items:center;justify-content:center;transition:background .2s}
.listes-close:hover{background:rgba(255,255,255,.35)}
.listes-tabs{display:flex;border-bottom:2px solid #e2e8f0;padding:0 22px;background:#f8fafc;flex-shrink:0;overflow-x:auto}
.listes-tab{padding:10px 14px;font-size:13px;font-weight:600;color:#718096;cursor:pointer;border-bottom:2px solid transparent;margin-bottom:-2px;white-space:nowrap;transition:all .15s}
.listes-tab:hover{color:#1e3a8a}
.listes-tab.active{color:#1e3a8a;border-bottom-color:#1e3a8a}
.listes-tab .tab-count{display:inline-block;background:#e2e8f0;color:#4a5568;font-size:10px;font-weight:700;padding:1px 5px;border-radius:10px;margin-left:5px}
.listes-tab.active .tab-count{background:#1e3a8a22;color:#1e3a8a}
.listes-body{flex:1;overflow-y:auto;padding:16px 22px}
.listes-item{display:flex;align-items:center;gap:10px;padding:9px 12px;border-radius:8px;border:1px solid #e2e8f0;margin-bottom:7px;background:#fff;transition:box-shadow .15s}
.listes-item:hover{box-shadow:0 2px 8px rgba(0,0,0,.08)}
.listes-arrows{display:flex;flex-direction:column;gap:2px;flex-shrink:0}
.listes-arrows button{background:none;border:1px solid #e2e8f0;border-radius:3px;width:18px;height:14px;cursor:pointer;font-size:9px;color:#718096;display:flex;align-items:center;justify-content:center;padding:0;transition:all .1s;line-height:1}
.listes-arrows button:hover:not(:disabled){background:#f0f4f8;color:#1e3a8a}
.listes-arrows button:disabled{opacity:.3;cursor:default}
.listes-dot{width:10px;height:10px;border-radius:50%;flex-shrink:0}
.listes-name{flex:1;font-size:13px;font-weight:500;color:#1a202c}
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
.combo-cp{font-size:11px;font-weight:700;color:#1e3a8a;min-width:42px;font-family:monospace}
.combo-nom{color:#1a202c}
.combo-empty{padding:10px 12px;color:#718096;font-size:12px;font-style:italic}
.combo-loading{padding:10px 12px;color:#1e3a8a;font-size:12px;display:flex;align-items:center;gap:8px}
.bingo-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:14px;margin-bottom:20px}
.bingo-card{background:#fff;border-radius:12px;box-shadow:0 1px 4px rgba(0,0,0,.08);padding:16px 12px;text-align:center;cursor:pointer;transition:all .2s;border:2px solid transparent}
.bingo-card:hover{box-shadow:0 4px 16px rgba(0,0,0,.14);transform:translateY(-2px)}
.bingo-card.selected{border-color:#1e3a8a}
.bingo-circle{width:60px;height:60px;border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0 auto 8px;font-size:22px;font-weight:800;border:3px solid}
.bingo-nom{font-size:11px;font-weight:700;color:#1a202c;margin-bottom:4px;line-height:1.2}
.bingo-pct{font-size:11px;color:#718096}
.bingo-list{margin-top:16px}
.bingo-list-item{display:flex;align-items:center;gap:10px;padding:8px 12px;border-bottom:1px solid #f0f4f8;font-size:13px}
.bingo-list-item:last-child{border-bottom:none}
.bingo-dot{width:8px;height:8px;border-radius:50%;flex-shrink:0}
.bingo-list-date{color:#718096;font-size:12px;min-width:80px}
.bingo-list-theme{flex:1;color:#1a202c;font-weight:500}
.bingo-list-badge{padding:2px 8px;border-radius:10px;font-size:11px;font-weight:600}
@media print{nav{display:none!important}.main{padding:0!important}.btn{display:none!important}.filters{display:none!important}.side-panel{display:none!important}}
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
.bp-nonrealise{background:#f1f5f9;color:#475569}
.bp-retard{background:#fecaca;color:#991b1b;border:1px solid #f87171;animation:blink-retard 1.4s ease-in-out infinite}
.bp-public{background:#f1f5f9;color:#475569}
.side-panel{position:fixed;top:0;right:0;width:340px;max-width:95vw;height:100vh;background:#fff;box-shadow:-4px 0 24px rgba(0,0,0,.15);z-index:500;display:flex;flex-direction:column;transform:translateX(100%);transition:transform .25s ease}
.side-panel.open{transform:translateX(0)}
.side-panel-header{padding:16px 20px;border-bottom:1px solid #e2e8f0;display:flex;align-items:center;justify-content:space-between;background:#f8fafc}
.side-panel-header h3{font-size:14px;font-weight:700;color:#1a202c;margin:0}
.side-panel-body{flex:1;overflow-y:auto;padding:16px 20px}
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
.kpi-mini{flex:1;min-width:60px;background:#fff;border-radius:8px;padding:10px 8px;text-align:center;box-shadow:0 1px 3px rgba(0,0,0,.08)}
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
.cal-grid{display:grid;grid-template-columns:repeat(7,1fr);gap:3px;margin-bottom:3px}
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
.cal-event-label{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;flex:1;color:#1a202c}
.cal-more{font-size:9.5px;color:#6b7280;cursor:pointer;margin-top:2px;font-weight:600;padding:1px 4px;background:#f1f5f9;border-radius:3px;display:inline-block}
.cal-more:hover{color:#1e3a8a;background:#dbeafe}
.cal-year-sel{padding:4px 8px;border:1.5px solid rgba(255,255,255,.35);border-radius:6px;background:rgba(255,255,255,.12);color:#fff;font-size:12px;font-weight:700;cursor:pointer;outline:none}
.cal-year-sel option{background:#1e3a8a;color:#fff}
`;
  document.head.appendChild(s);
})();

// ── Globals ────────────────────────────────────────────────
if(!window.React||!window.ReactDOM){throw new Error('React/ReactDOM non chargé — vérifiez les CDN dans le HTML');}
const CE = React.createElement;

const GS_URL = 'https://script.google.com/macros/s/AKfycbw4u5tP97Drju1PiF16Lxl7KpnTwYMVWl18VwBbfm9AKuDI1F36dkNSvU08kKlifM6zbg/exec';

const COMMUNES = [
  'AGEN','ARGENTON','ASTAFFORT','CASSENEUIL','CASTELMORON SUR LOT',
  'FAUILLET','FIEUX','FUMEL','LAVARDAC','LAYRAC',
  'LE TEMPLE SUR LOT','MONCLAR','NERAC','Ste-Bazeille',
  "Saint Pardoux d'Isaac",'TONNEINS',"TOURNONS D'AGENAIS",'VILLENEUVE SUR LOT'
];
const COMMUNES_GPS = {
  'AGEN':{lat:44.2004,lng:0.6213},'ARGENTON':{lat:44.3167,lng:0.7833},
  'ASTAFFORT':{lat:44.0447,lng:0.6586},'CASSENEUIL':{lat:44.3614,lng:0.6667},
  'CASTELMORON SUR LOT':{lat:44.3961,lng:0.4944},'FAUILLET':{lat:44.3833,lng:0.3167},
  'FIEUX':{lat:44.1500,lng:0.8167},'FUMEL':{lat:44.4967,lng:0.9700},
  'LAVARDAC':{lat:44.1806,lng:0.2958},'LAYRAC':{lat:44.1347,lng:0.6625},
  'LE TEMPLE SUR LOT':{lat:44.3833,lng:0.5333},'MONCLAR':{lat:44.2167,lng:0.5833},
  'NERAC':{lat:44.1381,lng:0.3394},'Ste-Bazeille':{lat:44.3667,lng:0.1833},
  "Saint Pardoux d'Isaac":{lat:44.4000,lng:0.2167},'TONNEINS':{lat:44.3906,lng:0.3044},
  "TOURNONS D'AGENAIS":{lat:44.3833,lng:0.9667},'VILLENEUVE SUR LOT':{lat:44.4089,lng:0.7053}
};
const CONSEILLERS_DEFAULT = ['Cynthia Pineau','Corentin Tual','Michel Aswad','Eva Capelle'];
const STATUTS_DEFAULT = ['Planifié','Réalisé','Annulé','Non réalisé','Reporté'];
const PUBLICS_DEFAULT = ['Tous publics','Personnes en situation de handicap','Jeunes','ATTEE',
  'Classe - 6A','Classe - 6B','Classe - 6C','Classe - 6D','Elèves de 5è du collège',
  'Parents isolés','Professionnels des bibliothèques','Adhérents','BRSA',
  "Demandeur d'emploi",'Parents allophone','Collègiens','Autres'];
const MATERIELS_DEFAULT = ['Videoprojecteur','Ecran','Classe mobile','Boitier 4G','Tablette','Scanner','Multiprise','Ordinateur'];

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
const MOIS = ['Jan','Fév','Mar','Avr','Mai','Jun','Jul','Aoû','Sep','Oct','Nov','Déc'];
const JOURS = ['Dim','Lun','Mar','Mer','Jeu','Ven','Sam'];
const fmtDate = d=>{if(!d)return'';const[y,m,j]=d.split('-');const jour=JOURS[new Date(y,m-1,j).getDay()];return`${jour} ${j}/${m}/${y}`;};
function fmtCardDate(d){if(!d)return{day:'',month:'',jour:''};const[y,m,j]=d.split('-');const jour=JOURS[new Date(parseInt(y),parseInt(m)-1,parseInt(j)).getDay()];return{day:j,month:MOIS[parseInt(m)-1],jour};}
const isPasse = e=>e.date<new Date().toISOString().slice(0,10)&&e.statut==='Réalisé';
const isRetard = e=>e.statut==='Planifié'&&e.date<new Date().toISOString().slice(0,10);
const genId = ()=>`atelier_${Date.now()}_${Math.random().toString(36).slice(2,7)}`;
function stripAccents(str){return String(str||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();}
function normalizeDate(val){if(!val)return'';const s=String(val).trim();if(/^\d{4}-\d{2}-\d{2}$/.test(s))return s;if(/^\d{4}-\d{2}-\d{2}T/.test(s))return s.split('T')[0];const m=s.match(/^(\d{2})\/(\d{2})\/(\d{4})/);if(m)return`${m[3]}-${m[2]}-${m[1]}`;return s;}
function normalizeHoraire(val){if(!val)return'';const s=String(val).trim();const iso=s.match(/T(\d{2}:\d{2})/);if(iso)return iso[1];if(/^\d{1,2}[Hh]\d{2}$/.test(s))return s.replace(/[Hh]/,':');if(/^\d{1,2}:\d{2}(:\d{2})?$/.test(s))return s.slice(0,5);return s;}
const COMMUNE_MAP={'TEMPLE SUR LOT':'LE TEMPLE SUR LOT','VILLENEUVE-SUR-LOT':'VILLENEUVE SUR LOT'};
function normalizeCommune(c){return COMMUNE_MAP[String(c||'').trim()]||String(c||'').trim();}
function badgePill(statut,retard){
  if(retard)return CE('span',{className:'badge-pill bp-retard'},'⚠ À mettre à jour');
  const cls={'Planifié':'bp-planifie','Réalisé':'bp-realise','Annulé':'bp-annule','Reporté':'bp-reporte','Non réalisé':'bp-nonrealise'}[statut]||'bp-nonrealise';
  return CE('span',{className:'badge-pill '+cls},statut);
}
const STATUT_COLORS={'Planifié':'#3b82f6','Réalisé':'#22c55e','Annulé':'#ef4444','Reporté':'#f97316','Non réalisé':'#94a3b8'};

let _toastTimer;
function showToast(msg,ok=true){
  const t=document.getElementById('toast');if(!t)return;
  t.textContent=msg;t.className=`toast ${ok?'toast-ok':'toast-err'}`;t.style.opacity='1';
  clearTimeout(_toastTimer);_toastTimer=setTimeout(()=>{t.style.opacity='0';},3500);
}

// ── API ────────────────────────────────────────────────────
async function apiFetch(action,body={}){
  const params=new URLSearchParams({action});
  if(body&&Object.keys(body).length){Object.entries(body).forEach(([k,v])=>{params.set(k,typeof v==='object'?JSON.stringify(v):v);});}
  const res=await Promise.race([fetch(`${GS_URL}?${params.toString()}`),new Promise((_,r)=>setTimeout(()=>r(new Error('Délai dépassé (10s)')),10000))]);
  return res.json();
}
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
function VueListes({lists,onSave,onClose}){
  const TABS=[{key:'statuts',label:'Statuts'},{key:'conseillers',label:'Conseillers'},{key:'publics',label:'Types de public'},{key:'materiels',label:'Matériels'}];
  const[activeTab,setActiveTab]=React.useState('statuts');
  const[draft,setDraft]=React.useState({statuts:[...lists.statuts],conseillers:[...lists.conseillers],publics:[...lists.publics],materiels:[...lists.materiels]});
  const[newVal,setNewVal]=React.useState('');
  const[editIdx,setEditIdx]=React.useState(null);
  const[editVal,setEditVal]=React.useState('');
  const items=draft[activeTab];
  function setItems(fn){setDraft(d=>({...d,[activeTab]:fn(d[activeTab])}));setEditIdx(null);}
  function moveUp(i){if(i===0)return;setItems(arr=>{const a=[...arr];[a[i-1],a[i]]=[a[i],a[i-1]];return a;});}
  function moveDown(i){if(i===items.length-1)return;setItems(arr=>{const a=[...arr];[a[i],a[i+1]]=[a[i+1],a[i]];return a;});}
  function remove(i){setItems(arr=>arr.filter((_,j)=>j!==i));}
  function startEdit(i){setEditIdx(i);setEditVal(items[i]);}
  function saveEdit(i){if(!editVal.trim())return;setItems(arr=>{const a=[...arr];a[i]=editVal.trim();return a;});setEditIdx(null);}
  function addItem(){const v=newVal.trim();if(!v)return;if(draft[activeTab].includes(v)){showToast('⚠️ Cet élément existe déjà',false);return;}setItems(arr=>[...arr,v]);setNewVal('');}
  async function handleSave(){
    onSave(draft);onClose();
    try{const res=await apiFetch('saveLists',{lists:JSON.stringify(draft)});if(res&&res.ok)showToast('✅ Listes enregistrées et synchronisées');else showToast('⚠️ Sauvegardé localement (erreur GAS)',false);}
    catch(err){showToast('⚠️ Sauvegardé localement (hors-ligne)',false);}
  }
  React.useEffect(()=>{function k(e){if(e.key==='Escape')onClose();}document.addEventListener('keydown',k);return()=>document.removeEventListener('keydown',k);},[]);
  React.useEffect(()=>{setNewVal('');setEditIdx(null);},[activeTab]);
  return CE('div',{className:'listes-overlay',onClick:e=>{if(e.target.className==='listes-overlay')onClose();}},
    CE('div',{className:'listes-modal'},
      CE('div',{className:'listes-header'},
        CE('button',{className:'listes-close',onClick:onClose},'×'),
        CE('h2',null,'📋 Gestion des listes déroulantes'),
        CE('p',null,'Ajouter, modifier, supprimer et réordonner')
      ),
      CE('div',{className:'listes-tabs'},TABS.map(t=>CE('div',{key:t.key,className:'listes-tab'+(activeTab===t.key?' active':''),onClick:()=>setActiveTab(t.key)},t.label,CE('span',{className:'tab-count'},draft[t.key].length)))),
      CE('div',{className:'listes-body'},
        items.map((item,i)=>CE('div',{key:i,className:'listes-item'},
          CE('div',{className:'listes-arrows'},
            CE('button',{onClick:()=>moveUp(i),disabled:i===0,title:'Monter'},'▲'),
            CE('button',{onClick:()=>moveDown(i),disabled:i===items.length-1,title:'Descendre'},'▼')
          ),
          CE('span',{className:'listes-dot',style:{background:getItemColor(activeTab,item)}}),
          editIdx===i
            ?CE('div',{className:'listes-name'},CE('input',{autoFocus:true,value:editVal,onChange:e=>setEditVal(e.target.value),onKeyDown:e=>{if(e.key==='Enter')saveEdit(i);if(e.key==='Escape')setEditIdx(null);}}))
            :CE('div',{className:'listes-name'},item),
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

// ═══════════════════════════════════════════════════════════
// LOGIN — reçoit pwdHash en prop
// ═══════════════════════════════════════════════════════════
function Login({pwdHash,onLogin}){
  const[pwd,setPwd]=React.useState('');
  const[err,setErr]=React.useState('');
  function tryLogin(){
    async function check(){
      const enc=new TextEncoder().encode(pwd);
      const buf=await crypto.subtle.digest('SHA-256',enc);
      const hash=Array.from(new Uint8Array(buf)).map(b=>b.toString(16).padStart(2,'0')).join('');
      if(hash===pwdHash)onLogin();else setErr('Mot de passe incorrect');
    }
    check();
  }
  return CE('div',{className:'login-wrap'},
    CE('div',{className:'login-card'},
      CE('h2',null,'🔐 Accès Administrateur'),
      CE('label',null,'Mot de passe'),
      CE('input',{type:'password',value:pwd,onChange:e=>{setPwd(e.target.value);setErr('');},onKeyDown:e=>e.key==='Enter'&&tryLogin(),placeholder:'Mot de passe admin'}),
      err&&CE('div',{className:'err-msg',style:{marginBottom:8}},err),
      CE('button',{className:'btn btn-primary',style:{width:'100%'},onClick:tryLogin},'Connexion')
    )
  );
}

// ═══════════════════════════════════════════════════════════
// VUE SAISIE — v9.1 : mode unique + mode lot (cycle)
// ═══════════════════════════════════════════════════════════
const emptyRow=()=>({id:genId(),date:'',horaire:'',ampm:'',thematique:''});

function VueSaisie({entries,onSaved,onNewEntry,lists,editingId,onClearEdit,prefillData,onClearPrefill,accentColor}){
  const statuts    = lists?.statuts     || STATUTS_DEFAULT;
  const conseillers= lists?.conseillers || CONSEILLERS_DEFAULT;
  const publics    = lists?.publics     || PUBLICS_DEFAULT;
  const materiels  = lists?.materiels   || MATERIELS_DEFAULT;
  const empty={_id:'',_n:'',statut:'',date:'',horaire:'',ampm:'',orienteur:'',commune:'',lieu:'',thematique:'',inscrits:'',presents:'',public:'',conseiller:'',materiel:[],residence:'',remarques:''};

  // ── états mode unique ──
  const[form,setForm]   = React.useState(empty);
  const[errors,setErrors]= React.useState({});
  const[editId,setEditId]= React.useState(null);
  const[isDup,setIsDup]  = React.useState(false);

  // ── états mode lot ──
  const[modeLot,setModeLot]     = React.useState(false);
  const[lotForm,setLotForm]     = React.useState({orienteur:'',commune:'',lieu:'',conseiller:'',public:'',materiel:[],residence:'',remarques:''});
  const[lotRows,setLotRows]     = React.useState([emptyRow(),emptyRow()]);
  const[lotErrors,setLotErrors] = React.useState({});
  const[lotRowErrors,setLotRowErrors]= React.useState({});

  const[saving,setSaving]= React.useState(false);

  // ── chargement editingId → force mode unique ──
  React.useEffect(()=>{
    if(!editingId)return;
    const e=entries.find(x=>x._id===editingId);if(!e)return;
    setForm({...empty,...e,materiel:e.materiel||[]});setEditId(editingId);setIsDup(false);setModeLot(false);
    window.scrollTo(0,0);if(onClearEdit)onClearEdit();
  },[editingId,entries]);

  // ── chargement prefillData (duplication) → force mode unique ──
  React.useEffect(()=>{
    if(!prefillData)return;
    setForm({...empty,...prefillData,_id:'',_n:'',date:'',horaire:'',ampm:'',inscrits:'',presents:'',remarques:'',statut:'Planifié'});
    setEditId(null);setIsDup(true);setModeLot(false);setErrors({});
    window.scrollTo(0,0);if(onClearPrefill)onClearPrefill();
  },[prefillData]);

  function reset(){setForm(empty);setEditId(null);setIsDup(false);setErrors({});}
  function resetLot(){setLotForm({orienteur:'',commune:'',lieu:'',conseiller:'',public:'',materiel:[],residence:'',remarques:''});setLotRows([emptyRow(),emptyRow()]);setLotErrors({});setLotRowErrors({});}

  function set(k,v){setForm(f=>({...f,[k]:v}));setErrors(er=>({...er,[k]:''}));}
  function toggleMat(m){setForm(f=>({...f,materiel:f.materiel.includes(m)?f.materiel.filter(x=>x!==m):[...f.materiel,m]}));}
  function setLot(k,v){setLotForm(f=>({...f,[k]:v}));setLotErrors(er=>({...er,[k]:''}));}
  function toggleLotMat(m){setLotForm(f=>({...f,materiel:f.materiel.includes(m)?f.materiel.filter(x=>x!==m):[...f.materiel,m]}));}

  // ── lignes du lot ──
  function addRow(){setLotRows(r=>[...r,emptyRow()]);}
  function removeRow(id){if(lotRows.length<=1)return;setLotRows(r=>r.filter(x=>x.id!==id));}
  function setRow(id,k,v){setLotRows(r=>r.map(x=>x.id===id?{...x,[k]:v}:x));setLotRowErrors(er=>({...er,[id]:{...(er[id]||{}),[k]:''}}));}

  // ── validation mode unique ──
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
    setErrors(e);return Object.keys(e).length===0;
  }

  // ── validation mode lot ──
  function validateLot(){
    const e={};
    if(!lotForm.commune.trim())   e.commune='Requis';
    if(!lotForm.lieu.trim())      e.lieu='Requis';
    if(!lotForm.conseiller)       e.conseiller='Requis';
    if(!lotForm.orienteur.trim()) e.orienteur='Requis';
    if(!lotForm.public)           e.public='Requis';
    setLotErrors(e);
    const re={};
    lotRows.forEach(r=>{
      const er={};
      if(!r.date)       er.date='Requis';
      if(!r.horaire)    er.horaire='Requis';
      if(!r.ampm)       er.ampm='Requis';
      if(!r.thematique.trim()) er.thematique='Requis';
      if(Object.keys(er).length>0)re[r.id]=er;
    });
    setLotRowErrors(re);
    return Object.keys(e).length===0&&Object.keys(re).length===0;
  }

  // ── submit mode unique ──
  async function handleSubmit(){
    if(!validate())return;
    setSaving(true);
    try{
      const entry={...form,_id:form._id||genId(),inscrits:form.inscrits===''?'':parseInt(form.inscrits)||0,presents:form.presents===''?'':parseInt(form.presents)||0};
      const res=await apiFetch('save',{entry});
      if(!res.ok)throw new Error(res.error);
      showToast(editId?'✅ Atelier modifié':'✅ Atelier enregistré');
      if(onNewEntry&&!editId)onNewEntry(entry);
      if(!editId) window._pendingHighlight=[entry._id];
      onSaved();reset();
    }catch(err){showToast('❌ '+err.message,false);}
    finally{setSaving(false);}
  }

  // ── submit mode lot ──
  async function handleSubmitLot(){
    if(!validateLot())return;
    setSaving(true);
    try{
      let ok=0; const createdIds=[];
      for(const row of lotRows){
        const entry={_id:genId(),_n:'',statut:'Planifié',date:row.date,horaire:row.horaire,ampm:row.ampm,thematique:row.thematique,orienteur:lotForm.orienteur,commune:lotForm.commune,lieu:lotForm.lieu,conseiller:lotForm.conseiller,public:lotForm.public,materiel:lotForm.materiel,residence:lotForm.residence,remarques:lotForm.remarques,inscrits:'',presents:''};
        const res=await apiFetch('save',{entry});
        if(!res.ok)throw new Error(res.error);
        if(onNewEntry)onNewEntry(entry);
        createdIds.push(entry._id);ok++;
      }
      showToast(`✅ ${ok} atelier(s) créé(s)`);
      window._pendingHighlight=createdIds;
      onSaved();resetLot();
    }catch(err){showToast('❌ '+err.message,false);}
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
  const champsCommuns=(frm,setFn,errs,entries_)=>CE('div',null,
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
        materiels.map(m=>{
          const chk=frm.materiel.includes(m);
          return CE('label',{key:m,style:{display:'flex',alignItems:'center',gap:6,padding:'7px 12px',border:`2px solid ${chk?ac:'#e2e8f0'}`,borderRadius:20,cursor:'pointer',fontSize:12,fontWeight:600,color:chk?ac:'#718096',background:chk?acLight:'#fff',transition:'all .15s',userSelect:'none'}},
            CE('input',{type:'checkbox',checked:chk,style:{display:'none'},onChange:()=>(modeLot?toggleLotMat:toggleMat)(m)}),m);
        })
      )
    ),
    CE('div',{style:{marginTop:12}},
      LblG({t:'Remarques'}),
      CE('input',{type:'text',style:iStyle(false),value:frm.remarques,placeholder:'Notes libres',onChange:e=>setFn('remarques',e.target.value)}))
  );

  return CE('div',{style:{padding:'4px 0'}},
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
      CE('div',{style:secStyle},champsCommuns(form,set,errors,entries)),
      // Thématique
      CE('div',{style:secStyle},
        Lbl({t:'Thématique *',err:!!errors.thematique}),
        CE('textarea',{style:taStyle(errors.thematique),value:form.thematique,placeholder:"Thème abordé lors de l'atelier…",onChange:e=>set('thematique',e.target.value)}),
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
      CE('div',{style:{display:'flex',gap:12,marginTop:4}},
        CE('button',{style:{padding:'13px 28px',border:'none',borderRadius:12,cursor:saving?'not-allowed':'pointer',fontSize:14,fontWeight:700,color:'#fff',background:saving?'#94a3b8':ac,opacity:saving?.7:1,display:'flex',alignItems:'center',gap:8},onClick:handleSubmit,disabled:saving},
          saving?CE('span',null,CE('span',{className:'spinner'}),'Enregistrement…'):(editId?'💾 Modifier l\'atelier':'💾 Enregistrer l\'atelier')),
        CE('button',{style:{padding:'13px 24px',border:'2px solid #e2e8f0',borderRadius:12,cursor:'pointer',fontSize:14,fontWeight:600,color:'#718096',background:'#fff'},onClick:reset},isDup||editId?'✖ Annuler':'✖ Réinitialiser')
      )
    ),

    // ══════════════════════════════
    // MODE CYCLE — même design
    // ══════════════════════════════
    modeLot&&CE('div',null,
      CE('div',{style:{...secStyle,background:acLight,borderTop:`3px solid ${ac}`,display:'flex',alignItems:'center',gap:8,fontSize:13,fontWeight:700,color:ac}},
        '🔄 ',lotRows.length,' atelier(s) à créer — tous "Planifié", inscrits/présents à compléter après'
      ),
      // Champs communs
      CE('div',{style:secStyle},champsCommuns(lotForm,setLot,lotErrors,entries)),
      // Tableau des dates
      CE('div',{style:secStyle},
        CE('div',{style:{fontSize:13,fontWeight:700,color:ac,marginBottom:12}},'📅 Dates du cycle'),
        CE('div',{style:{display:'grid',gridTemplateColumns:'140px 100px 64px 1fr 32px',gap:8,padding:'0 4px',marginBottom:6}},
          CE('span',{style:{fontSize:11,fontWeight:700,color:'#718096'}},'DATE *'),
          CE('span',{style:{fontSize:11,fontWeight:700,color:'#718096'}},'HORAIRE *'),
          CE('span',{style:{fontSize:11,fontWeight:700,color:'#718096'}},'AM/PM'),
          CE('span',{style:{fontSize:11,fontWeight:700,color:'#718096'}},'THÉMATIQUE *'),
          CE('span',null)
        ),
        lotRows.map((row)=>{
          const rErr=lotRowErrors[row.id]||{};
          const hasErr=Object.keys(rErr).length>0;
          const brd=(err)=>`2px solid ${err?'#e53e3e':'#e2e8f0'}`;
          const inp=(type,val,key,err,ph)=>CE('input',{type,value:val,placeholder:ph||'',onChange:e=>setRow(row.id,key,e.target.value),style:{width:'100%',padding:'8px 10px',border:brd(err),borderRadius:8,fontSize:12,background:err?'#fff5f5':'#f8fafc',outline:'none',boxSizing:'border-box'}});
          return CE('div',{key:row.id,style:{display:'grid',gridTemplateColumns:'140px 100px 64px 1fr 32px',gap:8,alignItems:'start',padding:'9px 10px',borderRadius:10,border:`1.5px solid ${hasErr?'#fc8181':acLight}`,marginBottom:6,background:hasErr?'#fff5f5':acLight}},
            inp('date',row.date,'date',rErr.date),
            inp('time',row.horaire,'horaire',rErr.horaire),
            CE('select',{value:row.ampm,onChange:e=>setRow(row.id,'ampm',e.target.value),style:{width:'100%',padding:'8px 4px',border:brd(rErr.ampm),borderRadius:8,fontSize:12,background:'#f8fafc'}},
              CE('option',{value:'',disabled:true},'—'),CE('option',{value:'AM'},'AM'),CE('option',{value:'PM'},'PM')),
            inp('text',row.thematique,'thematique',rErr.thematique,"Thème de la séance"),
            CE('button',{onClick:()=>removeRow(row.id),disabled:lotRows.length===1,style:{background:'none',border:`1px solid ${acLight}`,borderRadius:6,color:'#9b2c2c',cursor:'pointer',fontSize:15,height:32,width:32,display:'flex',alignItems:'center',justifyContent:'center'}},'×')
          );
        }),
        CE('button',{onClick:addRow,style:{display:'flex',alignItems:'center',justifyContent:'center',gap:6,padding:10,background:'#fff',border:`2px dashed ${ac}`,borderRadius:10,cursor:'pointer',fontSize:13,color:ac,fontWeight:700,width:'100%',marginTop:6}},'＋ Ajouter une date')
      ),
      // Boutons
      CE('div',{style:{display:'flex',gap:12,marginTop:4}},
        CE('button',{style:{padding:'13px 28px',border:'none',borderRadius:12,cursor:saving?'not-allowed':'pointer',fontSize:14,fontWeight:700,color:'#fff',background:saving?'#94a3b8':ac,opacity:saving?.7:1,display:'flex',alignItems:'center',gap:8},onClick:handleSubmitLot,disabled:saving},
          saving?CE('span',null,CE('span',{className:'spinner'}),'Création…'):`💾 Créer ${lotRows.length} atelier(s)`),
        CE('button',{style:{padding:'13px 24px',border:'2px solid #e2e8f0',borderRadius:12,cursor:'pointer',fontSize:14,fontWeight:600,color:'#718096',background:'#fff'},onClick:resetLot},'✖ Réinitialiser')
      )
    )
  );
}

// ═══════════════════════════════════════════════════════════
// VUE HISTORIQUE — v9.0 : duplication + flux de clôture
// ═══════════════════════════════════════════════════════════
function VueHistorique({entries,onEdit,onDelete,onRefresh,onDuplicate,initConseiller,onResetConseiller,canDelete}){
  const[search,setSearch]=React.useState('');
  const[dSearch,setDSearch]=React.useState('');
  const[filtStatut,setFiltStatut]=React.useState('Planifié');
  const[filtMois,setFiltMois]=React.useState('Tous');
  const[filtCommune,setFiltCommune]=React.useState('Toutes');
  const[filtConseiller,setFiltConseiller]=React.useState(initConseiller||'Tous');
  const[sortDir,setSortDir]=React.useState(1);
  const[dateFrom,setDateFrom]=React.useState('');
  const[dateTo,setDateTo]=React.useState('');
  const[panel,setPanel]=React.useState(null);
  const[panelStatut,setPanelStatut]=React.useState('');
  const[panelInscrits,setPanelInscrits]=React.useState('');
  const[panelPresents,setPanelPresents]=React.useState('');
  const[panelNote,setPanelNote]=React.useState('');
  const[saving,setSaving]=React.useState(false);
  const[confirmDel,setConfirmDel]=React.useState(null);

  React.useEffect(()=>{if(initConseiller)setFiltConseiller(initConseiller);},[initConseiller]);
  React.useEffect(()=>{const t=setTimeout(()=>setDSearch(search),300);return()=>clearTimeout(t);},[search]);
  React.useEffect(()=>{
    window._filterNewEntries=(ids)=>{setFiltStatut('Tous');setFiltMois('Tous');setFiltCommune('Toutes');setFiltConseiller('Tous');setDateFrom('');setDateTo('');setSearch('');setDSearch('');window._newIdsFilter=new Set(ids);};
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
    setFiltConseiller('Tous');setDateFrom('');setDateTo('');
    setSearch('');setDSearch('');
    window._newIdsFilter=new Set(ids);
  },[entries]);

  const moisDispo=React.useMemo(()=>{const s=new Set(entries.map(e=>e.date?e.date.slice(0,7):'').filter(Boolean));return[...s].sort();},[entries]);
  const CHIP_STATUTS=[{key:'Tous',label:'Tous',cls:'chip-all'},{key:'Planifié',label:'Planifié',cls:'chip-planifie',dot:'#3b82f6'},{key:'Réalisé',label:'Réalisé',cls:'chip-realise',dot:'#22c55e'},{key:'Annulé',label:'Annulé',cls:'chip-annule',dot:'#ef4444'},{key:'Reporté',label:'Reporté',cls:'chip-reporte',dot:'#f59e0b'},{key:'Non réalisé',label:'Non réalisé',cls:'chip-nonrealise',dot:'#94a3b8'}];
  const counts=React.useMemo(()=>{const c={Tous:entries.length};STATUTS.forEach(s=>{c[s]=entries.filter(e=>e.statut===s).length;});return c;},[entries]);
  const filtered=React.useMemo(()=>{
    let r=entries;
    if(filtStatut!=='Tous')r=r.filter(e=>e.statut===filtStatut);
    if(filtMois!=='Tous')r=r.filter(e=>e.date&&e.date.startsWith(filtMois));
    if(filtCommune!=='Toutes')r=r.filter(e=>e.commune===filtCommune);
    if(filtConseiller!=='Tous')r=r.filter(e=>e.conseiller===filtConseiller);
    if(dateFrom)r=r.filter(e=>e.date>=dateFrom);
    if(dateTo)r=r.filter(e=>e.date<=dateTo);
    if(dSearch){const q=dSearch.toLowerCase();r=r.filter(e=>[e.lieu,e.thematique,e.orienteur,e.commune,e.public].some(v=>String(v||'').toLowerCase().includes(q)));}
    if(window._newIdsFilter&&window._newIdsFilter.size>0)r=r.filter(e=>window._newIdsFilter.has(e._id));
    return[...r].sort((a,b)=>{const va=a.date||'',vb=b.date||'';return va<vb?-sortDir:va>vb?sortDir:0;});
  },[entries,filtStatut,filtMois,filtCommune,filtConseiller,dSearch,sortDir,dateFrom,dateTo]);

  const kpi=React.useMemo(()=>{const realises=filtered.filter(e=>e.statut==='Réalisé');const annules=filtered.filter(e=>e.statut==='Annulé').length;const inscrits=filtered.reduce((s,e)=>s+(parseInt(e.inscrits)||0),0);const presents=filtered.reduce((s,e)=>s+(parseInt(e.presents)||0),0);const tx=inscrits>0?Math.round(presents/inscrits*100):0;return{total:filtered.length,realises:realises.length,annules,inscrits,presents,tx};},[filtered]);
  const nRetard=entries.filter(isRetard).length;

  function openPanel(e){setPanel(e);setPanelStatut(e.statut);setPanelInscrits(e.inscrits===undefined||e.inscrits===''?'':String(e.inscrits));setPanelPresents(e.presents===undefined||e.presents===''?'':String(e.presents));setPanelNote(e.remarques||'');}
  function closePanel(){setPanel(null);}

  async function savePanel(){
    if(!panel)return;setSaving(true);
    try{
      const updated={...panel,statut:panelStatut,inscrits:panelInscrits===''?'':parseInt(panelInscrits)||0,presents:panelPresents===''?'':parseInt(panelPresents)||0,remarques:panelNote};
      const res=await apiFetch('save',{entry:updated});
      if(!res.ok)throw new Error(res.error);
      showToast('✅ Mis à jour');closePanel();onRefresh();
    }catch(err){showToast('❌ '+err.message,false);}
    finally{setSaving(false);}
  }

  function resetFiltres(){setSearch('');setDSearch('');setFiltStatut('Planifié');setFiltMois('Tous');setFiltCommune('Toutes');setFiltConseiller('Tous');setDateFrom('');setDateTo('');window._newIdsFilter=null;if(onResetConseiller)onResetConseiller();}

  function exportXLSX(){
    const rows=[['N°','Statut','Date','Horaire','Commune','Lieu','Thématique','Inscrits','Présents','Public','Conseiller','Orienteur','Matériel','Résidence','Remarques']];
    filtered.forEach(e=>rows.push([e._n,e.statut,fmtDate(e.date),e.horaire,e.commune,e.lieu,e.thematique,e.inscrits,e.presents,e.public,e.conseiller,e.orienteur,(e.materiel||[]).join(', '),e.residence,e.remarques]));
    const wb=XLSX.utils.book_new();XLSX.utils.book_append_sheet(wb,XLSX.utils.aoa_to_sheet(rows),'Ateliers');
    XLSX.writeFile(wb,`ateliers_cd47_${new Date().toISOString().slice(0,10)}.xlsx`);
  }

  const hexToRgba=(hex,a)=>{const r=parseInt(hex.slice(1,3),16),g=parseInt(hex.slice(3,5),16),b=parseInt(hex.slice(5,7),16);return`rgba(${r},${g},${b},${a})`;};
  const BORDER_COLOR={'Planifié':'#3b82f6','Réalisé':'#22c55e','Annulé':'#ef4444','Reporté':'#f59e0b','Non réalisé':'#94a3b8'};

  // v9.0 : clôture rapide — preset statuts finaux
  const CLOTURE_PRESETS=[
    {label:'✅ Réalisé',   statut:'Réalisé',    bg:'#16a34a',color:'#fff'},
    {label:'❌ Annulé',    statut:'Annulé',     bg:'#dc2626',color:'#fff'},
    {label:'🚫 Non réalisé',statut:'Non réalisé',bg:'#6b7280',color:'#fff'},
    {label:'📅 Reporté',   statut:'Reporté',    bg:'#d97706',color:'#fff'},
  ];

  return CE('div',null,
    // KPIs
    CE('div',{className:'kpi-row'},
      CE('div',{className:'kpi-mini'},CE('div',{className:'v',style:{color:'#1e3a8a'}},kpi.total),CE('div',{className:'l'},'Total')),
      CE('div',{className:'kpi-mini'},CE('div',{className:'v',style:{color:'#166534'}},kpi.realises),CE('div',{className:'l'},'Réalisés'),CE('div',{className:'p',style:{color:'#166534'}},kpi.total?Math.round(kpi.realises/kpi.total*100)+'%':'-')),
      CE('div',{className:'kpi-mini'},CE('div',{className:'v',style:{color:'#991b1b'}},kpi.annules),CE('div',{className:'l'},'Annulés'),CE('div',{className:'p',style:{color:'#991b1b'}},kpi.total?Math.round(kpi.annules/kpi.total*100)+'%':'-')),
      CE('div',{className:'kpi-mini'},CE('div',{className:'v',style:{color:'#2563eb'}},kpi.inscrits),CE('div',{className:'l'},'Inscrits')),
      CE('div',{className:'kpi-mini'},CE('div',{className:'v',style:{color:'#d97706'}},kpi.presents),CE('div',{className:'l'},'Présents'),CE('div',{className:'p',style:{color:'#d97706'}},kpi.tx+'%'))
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
    initConseiller&&CE('div',{className:'filtre-banner'},
      CE('span',null,'👤 Affichage filtré : ',CE('strong',null,initConseiller)),
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
          CE('option',{value:'Toutes'},'Toutes communes'),COMMUNES.map(c=>CE('option',{key:c,value:c},c))),
        CE('select',{style:{padding:'6px 8px',border:'1.5px solid #e2e8f0',borderRadius:6,fontSize:12},value:filtConseiller,onChange:e=>setFiltConseiller(e.target.value)},
          CE('option',{value:'Tous'},'Tous conseillers'),CONSEILLERS.map(c=>CE('option',{key:c,value:c},c)))
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
        CE('button',{className:'btn btn-secondary btn-sm',onClick:onRefresh},'🔄 Sync'),
        CE('button',{className:'btn btn-secondary btn-sm',onClick:resetFiltres},'✖ Réinitialiser')
      ),
      CE('div',{style:{fontSize:11,color:'#718096',marginTop:8}},`${filtered.length} atelier(s) affiché(s) sur ${entries.length}`)
    ),
    // Liste des ateliers
    CE('div',null,filtered.map(e=>{
      const d=fmtCardDate(e.date);const retard=isRetard(e);const cColor=conseillerColor(e.conseiller);
      return CE('div',{key:e._id,className:'atelier-card',style:{background:retard?'#fffbeb':hexToRgba(cColor,0.04),borderLeft:'none'},onClick:()=>openPanel(e)},
        CE('div',{className:'atelier-card-border',style:{background:cColor}}),
        CE('div',{className:'atelier-card-date',style:{background:hexToRgba(cColor,0.08),borderRight:`1px solid ${hexToRgba(cColor,0.2)}`}},
          CE('div',{className:'atelier-card-day'},d.day),CE('div',{className:'atelier-card-month'},d.month),
          CE('div',{className:'atelier-card-jour'},d.jour),CE('div',{className:'atelier-card-time'},e.horaire)
        ),
        CE('div',{className:'atelier-card-body'},
          CE('div',{className:'atelier-card-badges'},badgePill(e.statut,retard),CE('span',{className:'badge-pill bp-public'},e.public||'Tous publics')),
          CE('div',{className:'atelier-card-conseiller',style:{color:cColor}},e.conseiller),
          CE('div',{className:'atelier-card-title'},e.thematique),
          CE('div',{className:'atelier-card-sub'},e.commune,' — ',e.lieu,(e.inscrits||e.presents)?CE('span',null,' · ',e.presents||0,'/',e.inscrits||0,' présents'):null)
        ),
        CE('div',{className:'atelier-card-arrow'},'›')
      );
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
          // v9.0 : Flux de clôture rapide si atelier en retard
          isRetard(panel)&&CE('div',{className:'cloture-banner'},
            CE('div',{className:'cloture-title'},'⚠️ Atelier passé — à clôturer'),
            CE('div',{className:'cloture-btns'},
              CLOTURE_PRESETS.map(p=>CE('button',{key:p.statut,className:'cloture-btn',style:{background:p.bg,color:p.color},onClick:()=>setPanelStatut(p.statut)},p.label))
            )
          ),
          CE('div',{style:{fontSize:13,fontWeight:700,color:'#1a202c',marginBottom:8}},panel.thematique),
          CE('div',{className:'sp-info-row'},CE('span',null,'Date'),CE('span',null,fmtDate(panel.date),' ',panel.horaire)),
          CE('div',{className:'sp-info-row'},CE('span',null,'Commune'),CE('span',null,panel.commune)),
          CE('div',{className:'sp-info-row'},CE('span',null,'Lieu'),CE('span',null,panel.lieu)),
          panel.orienteur&&CE('div',{className:'sp-info-row'},CE('span',null,'Orienteur'),CE('span',null,panel.orienteur)),
          CE('div',{className:'sp-info-row'},CE('span',null,'Public'),CE('span',null,panel.public)),
          CE('div',{className:'sp-info-row'},CE('span',null,'Conseiller'),CE('span',{style:{color:conseillerColor(panel.conseiller),fontWeight:700}},panel.conseiller)),
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
          CE('div',{className:'sp-field'},CE('label',null,'Remarques'),
            CE('textarea',{value:panelNote,onChange:e=>setPanelNote(e.target.value),rows:3,placeholder:'Ajouter une note…',style:{width:'100%',padding:'8px 10px',border:'1.5px solid #e2e8f0',borderRadius:6,fontSize:13,resize:'vertical'}}))
        ),
        CE('div',{className:'side-panel-footer'},
          canDelete&&CE('button',{className:'btn btn-danger btn-sm',onClick:()=>{setConfirmDel(panel);closePanel();}},'Supprimer'),
          onDuplicate&&CE('button',{className:'btn btn-secondary btn-sm',style:{background:'#eff6ff',color:'#1d4ed8',border:'1px solid #bfdbfe'},onClick:()=>{onDuplicate(panel);closePanel();}},'📋 Dupliquer'),
          CE('button',{className:'btn btn-secondary',style:{flex:1},onClick:()=>onEdit(panel._id)},'Éditer complet'),
          CE('button',{className:'btn btn-primary',style:{flex:1},onClick:savePanel,disabled:saving},saving?'…':'💾 Enregistrer')
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
          CE('button',{className:'btn btn-danger',onClick:()=>{onDelete(confirmDel._id);setConfirmDel(null);}},'🗑️ Supprimer'),
          CE('button',{className:'btn btn-secondary',onClick:()=>setConfirmDel(null)},'Annuler')
        )
      )
    )
  );
}

// ═══════════════════════════════════════════════════════════
// VUE CALENDRIER — v9.2
// ═══════════════════════════════════════════════════════════
function VueCalendrier({entries,onEdit,onDelete,onRefresh,onDuplicate,initConseiller,onResetConseiller,canDelete}){
  const today=new Date();
  const todayStr=today.toISOString().slice(0,10);
  const[calDate,setCalDate]=React.useState(new Date(today.getFullYear(),today.getMonth(),1));
  const[filtConseiller,setFiltConseiller]=React.useState(initConseiller||'Tous');
  const[panel,setPanel]=React.useState(null);
  const[panelStatut,setPanelStatut]=React.useState('');
  const[panelInscrits,setPanelInscrits]=React.useState('');
  const[panelPresents,setPanelPresents]=React.useState('');
  const[panelNote,setPanelNote]=React.useState('');
  const[saving,setSaving]=React.useState(false);
  const[confirmDel,setConfirmDel]=React.useState(null);
  const[expandDay,setExpandDay]=React.useState(null);

  React.useEffect(()=>{if(initConseiller)setFiltConseiller(initConseiller);},[initConseiller]);

  const yr=calDate.getFullYear();
  const mo=calDate.getMonth();
  const monthStr=`${yr}-${String(mo+1).padStart(2,'0')}`;
  const MOIS_LONG=['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre'];
  const JOURS_COURT=['Lun','Mar','Mer','Jeu','Ven','Sam','Dim'];
  const CLOTURE_PRESETS=[
    {label:'✅ Réalisé',statut:'Réalisé',bg:'#16a34a',color:'#fff'},
    {label:'❌ Annulé',statut:'Annulé',bg:'#dc2626',color:'#fff'},
    {label:'🚫 Non réalisé',statut:'Non réalisé',bg:'#6b7280',color:'#fff'},
    {label:'📅 Reporté',statut:'Reporté',bg:'#d97706',color:'#fff'},
  ];

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
  const firstDowMon=(firstDow+6)%7; // 0=Lun
  const daysInMonth=new Date(yr,mo+1,0).getDate();
  const cells=[];
  for(let i=0;i<firstDowMon;i++)cells.push(null);
  for(let d=1;d<=daysInMonth;d++)cells.push(d);
  while(cells.length%7!==0)cells.push(null);

  // Navigation
  function prevMonth(){setCalDate(d=>new Date(d.getFullYear(),d.getMonth()-1,1));setExpandDay(null);}
  function nextMonth(){setCalDate(d=>new Date(d.getFullYear(),d.getMonth()+1,1));setExpandDay(null);}
  function goToday(){setCalDate(new Date(today.getFullYear(),today.getMonth(),1));setExpandDay(null);}

  // Panel
  function openPanel(e){setPanel(e);setPanelStatut(e.statut);setPanelInscrits(e.inscrits===undefined||e.inscrits===''?'':String(e.inscrits));setPanelPresents(e.presents===undefined||e.presents===''?'':String(e.presents));setPanelNote(e.remarques||'');}
  function closePanel(){setPanel(null);}
  async function savePanel(){
    if(!panel)return;setSaving(true);
    try{
      const updated={...panel,statut:panelStatut,inscrits:panelInscrits===''?'':parseInt(panelInscrits)||0,presents:panelPresents===''?'':parseInt(panelPresents)||0,remarques:panelNote};
      const res=await apiFetch('save',{entry:updated});
      if(!res.ok)throw new Error(res.error);
      showToast('✅ Mis à jour');closePanel();onRefresh();
    }catch(err){showToast('❌ '+err.message,false);}
    finally{setSaving(false);}
  }

  // KPIs mois
  const kpi=React.useMemo(()=>{
    const r=monthEntries.filter(e=>e.statut==='Réalisé').length;
    const p=monthEntries.filter(e=>e.statut==='Planifié').length;
    const ins=monthEntries.reduce((s,e)=>s+(parseInt(e.inscrits)||0),0);
    const pres=monthEntries.reduce((s,e)=>s+(parseInt(e.presents)||0),0);
    return{total:monthEntries.length,realises:r,planifies:p,inscrits:ins,presents:pres};
  },[monthEntries]);

  return CE('div',null,
    // ── Header ──
    CE('div',{className:'card',style:{marginBottom:12}},
      CE('div',{style:{display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:10,marginBottom:12}},
        CE('div',{style:{display:'flex',alignItems:'center',gap:8}},
          CE('button',{className:'btn btn-secondary btn-sm',onClick:prevMonth},'‹'),
          CE('div',{style:{fontSize:18,fontWeight:800,color:'#1e3a8a',minWidth:170,textAlign:'center'}},`${MOIS_LONG[mo]} ${yr}`),
          CE('button',{className:'btn btn-secondary btn-sm',onClick:nextMonth},'›'),
          CE('button',{className:'btn btn-secondary btn-sm',style:{marginLeft:4,fontSize:12},onClick:goToday},'Aujourd\'hui')
        ),
        CE('div',{style:{display:'flex',alignItems:'center',gap:8}},
          CE('label',{style:{fontSize:12,fontWeight:600,color:'#4a5568',margin:0,whiteSpace:'nowrap'}},'Conseiller :'),
          CE('select',{value:filtConseiller,onChange:e=>setFiltConseiller(e.target.value),style:{padding:'5px 10px',border:'1.5px solid #e2e8f0',borderRadius:6,fontSize:13}},
            CE('option',{value:'Tous'},'Tous'),
            CONSEILLERS.map(c=>CE('option',{key:c,value:c},c))
          )
        )
      ),
      CE('div',{style:{display:'flex',gap:8,flexWrap:'wrap'}},
        CE('div',{className:'kpi-mini',style:{flex:'1 1 70px'}},CE('div',{className:'v',style:{color:'#1e3a8a',fontSize:20}},kpi.total),CE('div',{className:'l'},'Ateliers')),
        CE('div',{className:'kpi-mini',style:{flex:'1 1 70px'}},CE('div',{className:'v',style:{color:'#166534',fontSize:20}},kpi.realises),CE('div',{className:'l'},'Réalisés')),
        CE('div',{className:'kpi-mini',style:{flex:'1 1 70px'}},CE('div',{className:'v',style:{color:'#2563eb',fontSize:20}},kpi.planifies),CE('div',{className:'l'},'Planifiés')),
        CE('div',{className:'kpi-mini',style:{flex:'1 1 70px'}},CE('div',{className:'v',style:{color:'#7c3aed',fontSize:20}},kpi.inscrits),CE('div',{className:'l'},'Inscrits')),
        CE('div',{className:'kpi-mini',style:{flex:'1 1 70px'}},CE('div',{className:'v',style:{color:'#0891b2',fontSize:20}},kpi.presents),CE('div',{className:'l'},'Présents'))
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
                CE('span',{className:'cal-event-label'},e.thematique||e.lieu||'—')
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
          isRetard(panel)&&CE('div',{className:'cloture-banner'},
            CE('div',{className:'cloture-title'},'⚠️ Atelier passé — à clôturer'),
            CE('div',{className:'cloture-btns'},
              CLOTURE_PRESETS.map(p=>CE('button',{key:p.statut,className:'cloture-btn',style:{background:p.bg,color:p.color},onClick:()=>setPanelStatut(p.statut)},p.label))
            )
          ),
          CE('div',{style:{fontSize:13,fontWeight:700,color:'#1a202c',marginBottom:8}},panel.thematique),
          CE('div',{className:'sp-info-row'},CE('span',null,'Date'),CE('span',null,fmtDate(panel.date),' ',panel.horaire)),
          CE('div',{className:'sp-info-row'},CE('span',null,'Commune'),CE('span',null,panel.commune)),
          CE('div',{className:'sp-info-row'},CE('span',null,'Lieu'),CE('span',null,panel.lieu)),
          panel.orienteur&&CE('div',{className:'sp-info-row'},CE('span',null,'Orienteur'),CE('span',null,panel.orienteur)),
          CE('div',{className:'sp-info-row'},CE('span',null,'Public'),CE('span',null,panel.public)),
          CE('div',{className:'sp-info-row'},CE('span',null,'Conseiller'),CE('span',{style:{color:conseillerColor(panel.conseiller),fontWeight:700}},panel.conseiller)),
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
          CE('div',{className:'sp-field'},CE('label',null,'Remarques'),
            CE('textarea',{value:panelNote,onChange:e=>setPanelNote(e.target.value),rows:3,placeholder:'Ajouter une note…',style:{width:'100%',padding:'8px 10px',border:'1.5px solid #e2e8f0',borderRadius:6,fontSize:13,resize:'vertical'}}))
        ),
        CE('div',{className:'side-panel-footer'},
          canDelete&&CE('button',{className:'btn btn-danger btn-sm',onClick:()=>{setConfirmDel(panel);closePanel();}},'Supprimer'),
          onDuplicate&&CE('button',{className:'btn btn-secondary btn-sm',style:{background:'#eff6ff',color:'#1d4ed8',border:'1px solid #bfdbfe'},onClick:()=>{onDuplicate(panel);closePanel();}},'📋 Dupliquer'),
          CE('button',{className:'btn btn-secondary',style:{flex:1},onClick:()=>onEdit(panel._id)},'Éditer complet'),
          CE('button',{className:'btn btn-primary',style:{flex:1},onClick:savePanel,disabled:saving},saving?'…':'💾 Enregistrer')
        )
      )
    ),
    confirmDel&&CE('div',{style:{position:'fixed',inset:0,background:'rgba(0,0,0,.5)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:1000}},
      CE('div',{className:'card',style:{width:360}},
        CE('h2',null,'🗑️ Confirmer la suppression'),
        CE('p',{style:{margin:'12px 0',fontSize:13}},`Supprimer l'atelier #${confirmDel._n} — ${confirmDel.thematique} ?`),
        CE('p',{style:{fontSize:12,color:'#718096',marginBottom:16}},'Cette action est irréversible.'),
        CE('div',{style:{display:'flex',gap:10}},
          CE('button',{className:'btn btn-danger',onClick:()=>{onDelete(confirmDel._id);setConfirmDel(null);}},'🗑️ Supprimer'),
          CE('button',{className:'btn btn-secondary',onClick:()=>setConfirmDel(null)},'Annuler')
        )
      )
    )
  );
}

// ═══════════════════════════════════════════════════════════
// Recharts — variables déclarées globalement, assignées via IIFE
// pour être accessibles par BarChart/LineChart/RadialChart ET VueGraphiques
let RBarChart,Bar,XAxis,YAxis,CartesianGrid,RTooltip,RLineChart,Line,PieChart,Pie,Cell,Legend,ResponsiveContainer,LabelList;
(function initRecharts(){
  if(!window.Recharts){console.warn('shared.js : Recharts non disponible');return;}
  ({BarChart:RBarChart,Bar,XAxis,YAxis,CartesianGrid,Tooltip:RTooltip,LineChart:RLineChart,Line,PieChart,Pie,Cell,Legend,ResponsiveContainer,LabelList}=window.Recharts);
})();

function NoData(){return CE('p',{style:{color:'#718096',fontSize:12,textAlign:'center',paddingTop:20}},'Aucune donnée');}
function trunc(s,n){return s&&s.length>n?s.slice(0,n-1)+'…':s;}
function barH(n,base){return Math.max(base,base+(Math.max(0,n-6)*8));}
function labelMarginBottom(data){const max=data.reduce((m,d)=>Math.max(m,(d.label||'').length),0);if(max<=6)return 30;if(max<=12)return 55;return 75;}

function BarChart({data,colors,height}){
  if(!data||data.length===0)return CE(NoData,null);
  const colArr=Array.isArray(colors)?colors:[colors||'#1e3a8a'];
  const mb=labelMarginBottom(data);const h=height||barH(data.length,200);
  const maxLbl=data.length>8?7:data.length>5?10:14;
  const chartData=data.map(d=>({...d,name:trunc(d.label,maxLbl)}));
  return CE(ResponsiveContainer,{width:'100%',height:h},
    CE(RBarChart,{data:chartData,margin:{top:20,right:6,left:0,bottom:mb}},
      CE(CartesianGrid,{strokeDasharray:'3 3',stroke:'#e2e8f0',vertical:false}),
      CE(XAxis,{dataKey:'name',tick:{fontSize:10,fill:'#4a5568'},angle:-40,textAnchor:'end',interval:0}),
      CE(YAxis,{tick:{fontSize:10,fill:'#718096'},allowDecimals:false,width:28}),
      CE(RTooltip,{content:(props)=>{
        if(!props.active||!props.payload||!props.payload.length)return null;
        const p=props.payload[0].payload;const tip=p.tip||null;const label=p.label||props.label||'';const val=p.value;
        const CS={background:'#edf2f7',border:'1px solid #a0aec0',borderRadius:7,padding:'8px 12px',fontSize:12,boxShadow:'0 3px 10px rgba(0,0,0,.15)',maxWidth:260,lineHeight:1.6};
        if(tip){const parts=tip.split(' — ');return CE('div',{style:CS},CE('div',{style:{fontWeight:700,color:'#1e3a8a',marginBottom:parts[1]?4:0}},parts[0]),parts[1]&&CE('div',{style:{color:'#4a5568'}},parts[1]));}
        return CE('div',{style:CS},CE('div',{style:{fontWeight:700,color:'#1e3a8a'}},label),CE('div',{style:{color:'#4a5568'}},`${val} atelier(s)`));
      }}),
      CE(Bar,{dataKey:'value',radius:[3,3,0,0],maxBarSize:44},
        chartData.map((d,i)=>CE(Cell,{key:i,fill:colArr[i%colArr.length]})),
        CE(LabelList,{dataKey:'value',position:'top',style:{fontSize:11,fontWeight:700,fill:'#1a202c'}})
      )
    )
  );
}

function LineChart({data}){
  if(!data||data.length===0)return CE(NoData,null);
  return CE(ResponsiveContainer,{width:'100%',height:200},
    CE(RLineChart,{data,margin:{top:20,right:6,left:0,bottom:labelMarginBottom(data)}},
      CE(CartesianGrid,{strokeDasharray:'3 3',stroke:'#e2e8f0',vertical:false}),
      CE(XAxis,{dataKey:'label',tick:{fontSize:10,fill:'#4a5568'},angle:-40,textAnchor:'end',interval:0}),
      CE(YAxis,{tick:{fontSize:10,fill:'#718096'},allowDecimals:false,width:28}),
      CE(RTooltip,{content:(props)=>{
        if(!props.active||!props.payload||!props.payload.length)return null;
        const p=props.payload[0].payload;const tip=p.tip||null;const label=p.label||props.label||'';const val=p.value;
        const CS={background:'#edf2f7',border:'1px solid #a0aec0',borderRadius:7,padding:'8px 12px',fontSize:12,boxShadow:'0 3px 10px rgba(0,0,0,.15)',maxWidth:260,lineHeight:1.6};
        if(tip)return CE('div',{style:CS},CE('div',{style:{fontWeight:700,color:'#1e3a8a'}},tip));
        return CE('div',{style:CS},CE('div',{style:{fontWeight:700,color:'#1e3a8a'}},label),CE('div',{style:{color:'#4a5568'}},val));
      }}),
      CE(Line,{type:'monotone',dataKey:'value',stroke:'#059669',strokeWidth:2,dot:{r:3,fill:'#059669'},activeDot:{r:5}},
        CE(LabelList,{dataKey:'value',position:'top',style:{fontSize:9,fill:'#059669'}}))
    )
  );
}

function RadialChart({data,colors,height=220}){
  if(!data||data.length===0)return CE(NoData,null);
  const colArr=Array.isArray(colors)?colors:['#1e3a8a'];
  const total=data.reduce((s,d)=>s+d.value,0);
  const chartData=data.map((d,i)=>({...d,name:d.label,fill:colArr[i%colArr.length]}));
  return CE(ResponsiveContainer,{width:'100%',height:height},
    CE(RBarChart,{data:chartData,layout:'vertical',margin:{top:8,right:40,left:4,bottom:8}},
      CE(CartesianGrid,{strokeDasharray:'3 3',stroke:'#e2e8f0',horizontal:false}),
      CE(XAxis,{type:'number',tick:{fontSize:10,fill:'#718096'},allowDecimals:false}),
      CE(YAxis,{type:'category',dataKey:'name',tick:{fontSize:11,fill:'#4a5568'},width:80}),
      CE(RTooltip,{content:(props)=>{
        if(!props.active||!props.payload||!props.payload.length)return null;
        const p=props.payload[0].payload;
        const pct=Math.round(p.value/total*100);
        return CE('div',{style:{background:'#edf2f7',border:'1px solid #a0aec0',borderRadius:7,padding:'8px 12px',fontSize:12,boxShadow:'0 3px 10px rgba(0,0,0,.15)',lineHeight:1.6}},
          CE('div',{style:{fontWeight:700,color:'#1e3a8a',marginBottom:2}},p.name),
          CE('div',{style:{color:'#4a5568'}},p.value+' — '+pct+'%')
        );
      }}),
      CE(Bar,{dataKey:'value',radius:[0,4,4,0],maxBarSize:32},
        chartData.map((d,i)=>CE(Cell,{key:i,fill:d.fill})),
        CE(LabelList,{dataKey:'value',position:'right',style:{fontSize:11,fontWeight:700,fill:'#1a202c'}})
      )
    )
  );
}

function VueGraphiques({entries}){
  if(!ResponsiveContainer)return CE('div',{className:'card'},CE('p',{style:{color:'#718096',textAlign:'center',padding:'40px 0'}},'⚠️ Recharts non chargé — vérifiez la connexion internet.'));

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

  const byFutur={};filtered.filter(e=>e.statut==='Planifié'&&e.date&&e.date.slice(0,7)>=todayYM).forEach(e=>{const m=e.date.slice(0,7);byFutur[m]=(byFutur[m]||0)+1;});
  const dataFutur=Object.keys(byFutur).sort().map(k=>({label:fmtML(k),value:byFutur[k],tip:`${fmtML(k)} : ${byFutur[k]} atelier(s) planifié(s)`}));

  const byStat={};filtered.forEach(e=>{byStat[e.statut]=(byStat[e.statut]||0)+1;});
  const dataStat=Object.entries(byStat).map(([label,value])=>({label,value}));

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
            CE('div',{className:'kpi'},CE('div',{className:'val'},total),CE('div',{className:'lbl'},'Ateliers réalisés')),
            CE('div',{className:'kpi'},CE('div',{className:'val'},annules),CE('div',{className:'lbl'},'Annulés')),
            CE('div',{className:'kpi'},CE('div',{className:'val'},totalPresents),CE('div',{className:'lbl'},'Participants présents')),
            CE('div',{className:'kpi'},CE('div',{className:'val'},txPresence+'%'),CE('div',{className:'lbl'},'Taux de présence'))
          ),
          CE('div',{style:{display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:16}},
            CE('div',{className:'card'},CE('h2',null,'Ateliers par mois (révolus)'),CE(LineChart,{data:dataMois})),
            CE('div',{className:'card'},CE('h2',null,'Présents par mois (révolus)'),CE(LineChart,{data:dataMoisPresents})),
            CE('div',{className:'card'},CE('h2',null,'Par commune'),CE(BarChart,{data:dataCommune,colors:['#1e3a8a','#3b82f6','#60a5fa','#93c5fd','#1e40af','#2563eb','#1d4ed8','#1e3a8a']})),
            CE('div',{className:'card'},CE('h2',null,'Par type de public'),CE(BarChart,{data:dataPublic,colors:['#7C3AED','#2563EB','#059669','#DB2777','#d97706','#0891b2','#65a30d','#dc2626']})),
            CE('div',{className:'card'},CE('h2',null,'📅 Planifiés — mois à venir'),CE(BarChart,{data:dataFutur,colors:['#7c3aed','#8b5cf6','#a78bfa','#c4b5fd']})),
            CE('div',{className:'card'},CE('h2',null,'Par statut'),CE(RadialChart,{data:dataStat,colors:['#276749','#2a69ac','#9b2c2c','#718096','#744210']}))
          )
        )
  );
}

// ═══════════════════════════════════════════════════════════
// VUE CARTE
// ═══════════════════════════════════════════════════════════
function VueCarte({entries,active}){
  const mapRef=React.useRef(null);
  React.useEffect(()=>{
    if(!active||mapRef.current)return;
    mapRef.current=L.map('map-container').setView([44.35,0.52],9);
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',{attribution:'© OpenStreetMap contributors © CARTO',maxZoom:18}).addTo(mapRef.current);
    const byC={};
    entries.forEach(e=>{if(!byC[e.commune])byC[e.commune]={total:0,realises:0,planifies:0,presents:0};byC[e.commune].total++;if(e.statut==='Réalisé'){byC[e.commune].realises++;byC[e.commune].presents+=(parseInt(e.presents)||0);}if(e.statut==='Planifié')byC[e.commune].planifies++;});
    function markerColor(pct){if(pct>=70)return{fill:'#22c55e',stroke:'#166534'};if(pct>=40)return{fill:'#f97316',stroke:'#9a3412'};return{fill:'#3b82f6',stroke:'#1d4ed8'};}
    Object.entries(byC).forEach(([c,s])=>{
      const g=COMMUNES_GPS[c];if(!g)return;
      const pct=s.total>0?Math.round(s.realises/s.total*100):0;
      const mc=markerColor(pct);
      const popup=`<div style="min-width:165px;font-family:'Segoe UI',sans-serif;font-size:13px"><strong style="font-size:14px;color:#1e3a8a">${c}</strong><div style="margin:6px 0 4px;color:#4a5568">Total : ${s.total}</div><div style="color:#276749;font-weight:600">Réalisés : ${s.realises}</div><div style="color:#2a69ac;font-weight:600">Planifiés : ${s.planifies}</div><div style="color:#4a5568">Présents : ${s.presents}</div><div style="background:#e2e8f0;border-radius:4px;height:6px;margin-top:8px;overflow:hidden"><div style="background:#059669;width:${Math.max(2,pct)}%;height:100%;border-radius:4px"></div></div><div style="font-size:11px;color:#718096;margin-top:3px">${pct}% réalisé</div></div>`;
      L.circleMarker([g.lat,g.lng],{radius:Math.min(8+s.total*0.8,26),fillColor:mc.fill,color:mc.stroke,weight:2,opacity:1,fillOpacity:.82}).addTo(mapRef.current).bindPopup(popup,{maxWidth:220});
    });
  },[active]);
  return CE('div',null,
    CE('div',{style:{display:'flex',justifyContent:'flex-end',marginBottom:8}},CE('button',{className:'btn btn-print btn-sm',onClick:()=>window.print()},'🖨️ Imprimer')),
    CE('div',{className:'card'},
      CE('h2',null,'🗺️ Carte des communes'),
      CE('div',{style:{display:'flex',gap:16,marginBottom:10,flexWrap:'wrap',fontSize:12,color:'#4a5568'}},
        CE('span',null,CE('span',{style:{display:'inline-block',width:12,height:12,borderRadius:'50%',background:'#22c55e',marginRight:5,verticalAlign:'middle'}}),'≥ 70% réalisés'),
        CE('span',null,CE('span',{style:{display:'inline-block',width:12,height:12,borderRadius:'50%',background:'#f97316',marginRight:5,verticalAlign:'middle'}}),'40 – 70%'),
        CE('span',null,CE('span',{style:{display:'inline-block',width:12,height:12,borderRadius:'50%',background:'#3b82f6',marginRight:5,verticalAlign:'middle'}}),'< 40%')
      ),
      CE('div',{id:'map-container'})
    )
  );
}

// ═══════════════════════════════════════════════════════════
// VUE BINGO — par commune
// ═══════════════════════════════════════════════════════════
function VueBingo({entries}){
  const[selected,setSelected]=React.useState(null);
  const communes=React.useMemo(()=>{
    const byC={};
    entries.forEach(e=>{const c=e.commune||'Inconnue';if(!byC[c])byC[c]={total:0,realises:0,annules:0,ateliers:[]};byC[c].total++;if(e.statut==='Réalisé')byC[c].realises++;if(e.statut==='Annulé')byC[c].annules++;byC[c].ateliers.push(e);});
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
    CE('div',{className:'bingo-grid'},communes.map(c=>{const col=getCircleColor(c.pct);return CE('div',{key:c.nom,className:'bingo-card'+(selected===c.nom?' selected':''),onClick:()=>setSelected(selected===c.nom?null:c.nom)},CE('div',{className:'bingo-circle',style:{background:col.bg,borderColor:col.stroke,color:col.text}},c.total),CE('div',{className:'bingo-nom'},c.nom),CE('div',{className:'bingo-pct'},c.pct+'% réalisés'));})),
    sel&&CE('div',{className:'card'},
      CE('div',{style:{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:12}},
        CE('h2',{style:{borderBottom:'none',marginBottom:0,paddingBottom:0}},CE('span',{style:{color:'#1e3a8a'}},'📍 '+sel.nom),CE('span',{style:{fontSize:13,fontWeight:400,color:'#718096',marginLeft:8}},'— '+sel.total+' atelier(s)')),
        CE('button',{onClick:()=>setSelected(null),style:{background:'none',border:'none',fontSize:18,cursor:'pointer',color:'#718096'}},'✕')
      ),
      CE('div',{className:'bingo-list'},sel.ateliers.map((e,i)=>CE('div',{key:i,className:'bingo-list-item'},CE('span',{className:'bingo-dot',style:{background:BORDER_C[e.statut]||'#94a3b8'}}),CE('span',{className:'bingo-list-date'},fmtDate(e.date)),CE('span',{className:'bingo-list-theme'},e.thematique),CE('span',{className:'bingo-list-badge',style:{background:BADGE_COLORS[e.statut]||'#f1f5f9',color:BADGE_TEXT[e.statut]||'#475569'}},e.statut))))
    )
  );
}


// ═══════════════════════════════════════════════════════════
// GÉNÉRATION CALENDRIER (porté depuis calendrier-atelier-v5)
// ═══════════════════════════════════════════════════════════
const MONTH_NAMES_FR = {
  1:'JANVIER',2:'FÉVRIER',3:'MARS',4:'AVRIL',5:'MAI',6:'JUIN',
  7:'JUILLET',8:'AOÛT',9:'SEPTEMBRE',10:'OCTOBRE',11:'NOVEMBRE',12:'DÉCEMBRE'
};
const DAY_FR = ['Dim','Lun','Mar','Mer','Jeu','Ven','Sam'];
const CAL_STATUT_COLORS = {
  'Réalisé':'70AD47','Annulé':'FF5050','Planifié':'9683EC',
  'Non réalisé':'FFC000','Reporté':'ED7D31'
};
const STATUT_SYMBOLS = {
  'Réalisé':'R','Annulé':'A','Planifié':'P','Non réalisé':'NR','Reporté':'RP'
};

function isAM(horaire) {
  try {
    const h = parseInt(String(horaire).replace('H',':').split(':')[0]);
    return h < 12;
  } catch { return true; }
}

function getWorkingDays(year, month) {
  const days = [];
  const d = new Date(Date.UTC(year, month - 1, 1));
  while (d.getUTCMonth() === month - 1) {
    if (d.getUTCDay() !== 0 && d.getUTCDay() !== 6) days.push(new Date(d));
    d.setUTCDate(d.getUTCDate() + 1);
  }
  return days;
}

function dateKey(d) {
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth()+1).padStart(2,'0')}-${String(d.getUTCDate()).padStart(2,'0')}`;
}

function argbOf(hex) { return 'FF' + hex.toUpperCase(); }

function cellStyle(bold = false, bgHex = null, fgHex = '000000', sz = 8) {
  const style = {
    font: { bold, sz, color: { rgb: fgHex } },
    alignment: { horizontal: 'center', vertical: 'center', wrapText: true },
    border: {
      top:    { style: 'thin', color: { rgb: 'AAAAAA' } },
      bottom: { style: 'thin', color: { rgb: 'AAAAAA' } },
      left:   { style: 'thin', color: { rgb: 'AAAAAA' } },
      right:  { style: 'thin', color: { rgb: 'AAAAAA' } },
    }
  };
  if (bgHex) style.fill = { fgColor: { rgb: argbOf(bgHex) }, patternType: 'solid' };
  return style;
}

function cellStyleLeft(bold = false, bgHex = null, fgHex = '000000', sz = 8) {
  const style = {
    font: { bold, sz, color: { rgb: fgHex } },
    alignment: { horizontal: 'left', vertical: 'center' },
    border: {
      top:    { style: 'thin', color: { rgb: 'AAAAAA' } },
      bottom: { style: 'thin', color: { rgb: 'AAAAAA' } },
      left:   { style: 'thin', color: { rgb: 'AAAAAA' } },
      right:  { style: 'thin', color: { rgb: 'AAAAAA' } },
    }
  };
  if (bgHex) style.fill = { fgColor: { rgb: argbOf(bgHex) }, patternType: 'solid' };
  return style;
}

function generateCalendrier(df, year, months, conseillers) {
  const wb = XLSX.utils.book_new();

  for (const month of months) {
    const monthName = MONTH_NAMES_FR[month];
    const workingDays = getWorkingDays(year, month);
    const dfMonth = df.filter(r => r.date.getUTCFullYear() === year && r.date.getUTCMonth() + 1 === month);

    // Prépare la feuille comme tableau de lignes (AOA)
    const aoa = [];
    const merges = [];
    const styles = {}; // "R,C" -> style object

    let currentRow = 0;

    function S(r, c, style) { styles[`${r},${c}`] = style; }
    function W(r, c, v, style) {
      while (aoa.length <= r) aoa.push([]);
      while (aoa[r].length <= c) aoa[r].push(null);
      aoa[r][c] = v;
      if (style) S(r, c, style);
    }

    const DATE_START_COL = 2; // 0-indexed, col C

    for (const conseiller of conseillers) {
      const consNorm = conseiller.trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
      const dfCons = dfMonth.filter(r => {
        const rNorm = (r.conseiller||'').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
        return rNorm === consNorm;
      });

      // ── LOGIQUE TIMELINE : 1 ligne par organisme unique ──────────────────
      // Chaque organisme reçoit une ligne. Ses sessions sont placées dans les
      // colonnes jour+AM/PM correspondantes.
      // Conflit (même organisme, même créneau) → cellule ⚠ fond orange.

      const recapCounts = {};
      for (const row of dfCons) {
        const am = row.ampm ? row.ampm === 'AM' : isAM(row.horaire);
        const dk = dateKey(row.date) + (am ? '_AM' : '_PM');
        recapCounts[dk] = (recapCounts[dk] || 0) + 1;
      }

      // Normalise un nom d'organisme pour la déduplication :
      // trim + collapse espaces multiples + minuscules + sans accents
      function normOrg(s) {
        return String(s || '—').trim()
          .replace(/\s+/g, ' ')
          .toLowerCase()
          .normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      }

      // Liste des organismes uniques dans l'ordre de première apparition
      // La clé de dédup est normOrg(), le label affiché est la première
      // occurrence nettoyée (trim + collapse) pour éviter les espaces parasites.
      const seenOrgsKeys  = [];   // clés normalisées (pour le test d'unicité)
      const seenOrgs      = [];   // labels d'affichage (propres)
      for (const row of dfCons) {
        const raw   = String(row.orienteur || '—').trim().replace(/\s+/g, ' ');
        const key   = normOrg(raw);
        if (!seenOrgsKeys.includes(key)) {
          seenOrgsKeys.push(key);
          seenOrgs.push(raw);
        }
      }

      const nDataRows = Math.max(1, seenOrgs.length);

      // Index des sessions par clé normalisée
      // orgSessions[normKey] = [ session, session, ... ]
      const orgSessions = {};
      for (const row of dfCons) {
        const key = normOrg(row.orienteur || '—');
        if (!orgSessions[key]) orgSessions[key] = [];
        orgSessions[key].push(row);
      }

      // Titre conseiller — style appliqué sur TOUTES les cellules de la fusion
      const titleRow = currentRow;
      const titleLastCol = DATE_START_COL + workingDays.length * 2 - 1;
      const titleStyle = { font: { bold: true, sz: 26, name: 'Calibri', color: { rgb: 'FFFFFF' } },
        fill: { fgColor: { rgb: 'FF8DB4E2' }, patternType: 'solid' },
        alignment: { horizontal: 'center', vertical: 'center' } };
      W(titleRow, 0, `PLANNING ATELIERS — ${conseiller.toUpperCase()}`, titleStyle);
      for (let c = 1; c <= titleLastCol; c++) W(titleRow, c, null, titleStyle);
      merges.push({ s: { r: titleRow, c: 0 }, e: { r: titleRow, c: titleLastCol } });
      currentRow++;

      // Sous-titre mois — style appliqué sur TOUTES les cellules de la fusion
      const subRow = currentRow;
      const subStyle = { font: { bold: true, sz: 18, name: 'Calibri', color: { rgb: '16365C' } },
        fill: { fgColor: { rgb: 'FFC5D9F1' }, patternType: 'solid' },
        alignment: { horizontal: 'center', vertical: 'center' } };
      W(subRow, 0, `${monthName} ${year}`, subStyle);
      for (let c = 1; c <= titleLastCol; c++) W(subRow, c, null, subStyle);
      merges.push({ s: { r: subRow, c: 0 }, e: { r: subRow, c: titleLastCol } });
      currentRow++;

      // En-tête jours
      const hrow = currentRow;
      W(hrow, 0, 'CoNum',     cellStyle(true, '1F4E79', 'FFFFFF', 9));
      W(hrow, 1, 'Organisme', cellStyle(true, '1F4E79', 'FFFFFF', 9));
      for (let di = 0; di < workingDays.length; di++) {
        const day = workingDays[di];
        const colAM = DATE_START_COL + di * 2;
        const label = `${DAY_FR[day.getUTCDay()]} ${String(day.getUTCDate()).padStart(2,'0')}`;
        W(hrow, colAM, label, cellStyle(true, '2E75B6', 'FFFFFF', 8));
        W(hrow, colAM + 1, null, cellStyle(true, '2E75B6', 'FFFFFF', 8));
        merges.push({ s: { r: hrow, c: colAM }, e: { r: hrow, c: colAM + 1 } });
      }
      currentRow++;

      // AM/PM
      const srow = currentRow;
      W(srow, 0, null, cellStyle(false, null, '000000', 8));
      W(srow, 1, null, cellStyle(false, null, '000000', 8));
      for (let di = 0; di < workingDays.length; di++) {
        const colAM = DATE_START_COL + di * 2;
        W(srow, colAM,     'AM', cellStyle(true, 'BDD7EE', '1F3864', 8));
        W(srow, colAM + 1, 'PM', cellStyle(true, '9DC3E6', '1F3864', 8));
      }
      currentRow++;

      // Lignes de données — 1 ligne par organisme, sessions en timeline
      for (let oi = 0; oi < nDataRows; oi++) {
        const rn  = currentRow + oi;
        const org = seenOrgs[oi] || '';
        W(rn, 0, conseiller, cellStyle(false, null, '000000', 8));
        W(rn, 1, org,        cellStyleLeft(false, null, '000000', 8));

        // Pré-indexer les sessions de cet organisme par créneau
        // créneau = dateKey + '_AM' ou '_PM'
        // Un créneau peut avoir plusieurs sessions → conflit
        const creneau = {}; // dk_AM/PM → [session, ...]
        for (const sess of (orgSessions[normOrg(org)] || [])) {
          const am = sess.ampm ? sess.ampm === 'AM' : isAM(sess.horaire);
          const ck = dateKey(sess.date) + (am ? '_AM' : '_PM');
          if (!creneau[ck]) creneau[ck] = [];
          creneau[ck].push(sess);
        }

        for (let di = 0; di < workingDays.length; di++) {
          const day   = workingDays[di];
          const dk    = dateKey(day);
          const colAM = DATE_START_COL + di * 2;
          const ckAM  = dk + '_AM';
          const ckPM  = dk + '_PM';

          // Traite AM
          if (creneau[ckAM]) {
            const list = creneau[ckAM];
            if (list.length === 1) {
              const s   = list[0].statut;
              const sym = STATUT_SYMBOLS[s] || (s ? s.slice(0,2) : '?');
              const bg  = CAL_STATUT_COLORS[s]  || 'D9D9D9';
              W(rn, colAM, sym, cellStyle(true, bg, '000000', 8));
            } else {
              // CONFLIT : plusieurs sessions pour le même créneau
              W(rn, colAM, `⚠×${list.length}`, cellStyle(true, '7B2FBE', 'FFFFFF', 7));
              console.warn(`⚠ Conflit ${conseiller} | ${org} | ${dk} AM (${list.length} sessions)`, 'err');
            }
          } else {
            W(rn, colAM, null, cellStyle(false));
          }

          // Traite PM
          if (creneau[ckPM]) {
            const list = creneau[ckPM];
            if (list.length === 1) {
              const s   = list[0].statut;
              const sym = STATUT_SYMBOLS[s] || (s ? s.slice(0,2) : '?');
              const bg  = CAL_STATUT_COLORS[s]  || 'D9D9D9';
              W(rn, colAM + 1, sym, cellStyle(true, bg, '000000', 8));
            } else {
              W(rn, colAM + 1, `⚠×${list.length}`, cellStyle(true, '7B2FBE', 'FFFFFF', 7));
              console.warn(`⚠ Conflit ${conseiller} | ${org} | ${dk} PM (${list.length} sessions)`, 'err');
            }
          } else {
            W(rn, colAM + 1, null, cellStyle(false));
          }
        }
      }

      // Recap
      const recapRow = currentRow + nDataRows;
      W(recapRow, 0, conseiller,           cellStyleLeft(true, 'D6E4F0', '1F3864', 8));
      W(recapRow, 1, `RECAP ${monthName}`, cellStyleLeft(true, 'D6E4F0', '1F3864', 8));
      for (let di = 0; di < workingDays.length; di++) {
        const dk    = dateKey(workingDays[di]);
        const colAM = DATE_START_COL + di * 2;
        for (const [isAMSlot, col] of [[true, colAM], [false, colAM + 1]]) {
          const count = recapCounts[dk + (isAMSlot ? '_AM' : '_PM')] || 0;
          W(recapRow, col, count > 0 ? count : null, cellStyle(true, 'D6E4F0', '1F3864', 9));
        }
      }

      // ── Cartouche légende — compteurs dynamiques + centerContinuous ───────
      const legendRow = recapRow + 1;

      // Calculer les totaux depuis dfCons (données du conseiller pour ce mois)
      let totalP = 0, totalA = 0, totalR = 0, totalRP = 0, totalNR = 0, totalAlert = 0;
      for (const row of dfCons) {
        const s = (row.statut || '').trim();
        if (s === 'Planifié')          totalP++;
        else if (s === 'Annulé')       totalA++;
        else if (s === 'Réalisé')      totalR++;
        else if (s === 'Reporté')      totalRP++;
        else if (s === 'Non réalisé')  totalNR++;
      }
      // Compter les alertes conflit uniquement dans la plage de ce conseiller
      for (let ri = titleRow; ri <= recapRow; ri++) {
        if (!aoa[ri]) continue;
        for (const cell of aoa[ri]) {
          if (typeof cell === 'string' && cell.startsWith('⚠')) totalAlert++;
        }
      }

      // 6 segments colorés répartis uniformément sur toute la largeur de la feuille.
      // Chaque segment = fusion de N colonnes + texte centré + fond couleur statut.
      const lastLegendCol = DATE_START_COL + workingDays.length * 2 - 1;
      const totalCols     = lastLegendCol + 1;

      const segments = [
        { label: `P | Prévus : ${totalP}`,           bg: '9683EC', fg: 'FFFFFF' },
        { label: `A | Annulés : ${totalA}`,           bg: 'FF5050', fg: 'FFFFFF' },
        { label: `R | Réalisés : ${totalR}`,          bg: '70AD47', fg: 'FFFFFF' },
        { label: `RP | Reportés : ${totalRP}`,        bg: 'ED7D31', fg: 'FFFFFF' },
        { label: `NR | Non réalisés : ${totalNR}`,    bg: 'FFC000', fg: '7F4000' },
        { label: `⚠ | Alertes : ${totalAlert}`,       bg: '7B2FBE', fg: 'FFFFFF' },
      ];

      const nSeg      = segments.length;
      const baseWidth = Math.floor(totalCols / nSeg);
      const remainder = totalCols - baseWidth * nSeg;
      const bThin = (col) => ({ style: 'thin', color: { rgb: col } });

      let colCursor = 0;
      for (let si = 0; si < nSeg; si++) {
        const seg   = segments[si];
        const width = baseWidth + (si < remainder ? 1 : 0);
        const colS  = colCursor;
        const colE  = colCursor + width - 1;

        const segStyle = {
          font:      { name: 'Calibri', sz: 10, bold: true, color: { rgb: seg.fg } },
          fill:      { fgColor: { rgb: 'FF' + seg.bg }, patternType: 'solid' },
          alignment: { horizontal: 'center', vertical: 'center', wrapText: false },
          border:    { top: bThin('999999'), bottom: bThin('999999'), left: bThin('CCCCCC'), right: bThin('CCCCCC') },
        };

        W(legendRow, colS, seg.label, segStyle);
        for (let c = colS + 1; c <= colE; c++) W(legendRow, c, null, segStyle);
        if (colS < colE) merges.push({ s: { r: legendRow, c: colS }, e: { r: legendRow, c: colE } });

        colCursor += width;
      }

      currentRow = legendRow + 2; // espace de 2 lignes entre chaque conseiller


    } // fin boucle conseillers

    // ── Mention mise à jour après le dernier bloc ────────────────
    const today = new Date();
    const dd = String(today.getDate()).padStart(2,'0');
    const mm = String(today.getMonth()+1).padStart(2,'0');
    const yyyy = today.getFullYear();
    const majLabel = 'mise a jour : ' + dd + '/' + mm + '/' + yyyy;
    const majStyle = {
      font: { name: 'Calibri', sz: 9, italic: true, color: { rgb: '6B7280' } },
      alignment: { horizontal: 'left', vertical: 'center' },
    };
    W(currentRow, 0, majLabel, majStyle);
    currentRow += 2;

    // Largeurs de colonnes
    const colInfo = [{ wch: 18 }, { wch: 36 }];
    for (let di = 0; di < workingDays.length; di++) {
      colInfo.push({ wch: 5 }, { wch: 5 });
    }

    const ws = XLSX.utils.aoa_to_sheet(aoa);
    ws['!merges'] = merges;
    ws['!cols']   = colInfo;

    // Applique les styles
    for (const [key, style] of Object.entries(styles)) {
      const [r, c] = key.split(',').map(Number);
      const cellAddr = XLSX.utils.encode_cell({ r, c });
      if (!ws[cellAddr]) ws[cellAddr] = { t: 's', v: '' };
      ws[cellAddr].s = style;
    }

    const sheetTitle = `Planning ${String(month).padStart(2,'0')}-${year}`;
    XLSX.utils.book_append_sheet(wb, ws, sheetTitle);
  } // fin boucle mois

  return wb;
}

// ═══════════════════════════════════════════════════════════
// VUE ADMIN
// ═══════════════════════════════════════════════════════════
function VueAdmin({entries,onRefresh,addLog,conseillersList,onSaveColors}){
  const[resetStep,setResetStep]=React.useState(0);
  const[visibility,setVisibility]=React.useState(null);
  const[visSaving,setVisSaving]=React.useState(false);
  const[importing,setImporting]=React.useState(false);
  const[colorDraft,setColorDraft]=React.useState({...CONSEILLER_COLORS});
  const[colorSaving,setColorSaving]=React.useState(false);
  const[importProgress,setImportProgress]=React.useState(0);
  const[importMsg,setImportMsg]=React.useState('');
  const cancelRef=React.useRef(false);
  const VIS_ITEMS=[{key:'saisie',label:'✏️ Saisie',sub:'Formulaire de saisie'},{key:'historique',label:'📋 Historique',sub:'Liste des ateliers'},{key:'calendrier',label:'📅 Calendrier',sub:'Vue calendrier mensuelle'},{key:'graphiques',label:'📊 Graphiques',sub:'Tableaux de bord'},{key:'carte',label:'🗺️ Carte',sub:'Carte des communes'},{key:'bingo',label:'🎯 Bingo',sub:'Vue par commune'}];

  React.useEffect(()=>{apiFetch('getVisibility').then(res=>{if(res.ok)setVisibility(res.visibility);}).catch(()=>{});},[]);

  // Sync colorDraft quand la liste des conseillers change
  React.useEffect(()=>{
    const draft={...CONSEILLER_COLORS};
    (conseillersList||[]).forEach(c=>{if(!draft[c])draft[c]='#6B7280';});
    setColorDraft(draft);
  },[conseillersList]);

  async function handleSaveColors(){
    setColorSaving(true);
    try{
      const res=await apiFetch('saveColors',{colors:JSON.stringify(colorDraft)});
      if(!res.ok)throw new Error(res.error);
      applyColors(colorDraft);
      if(onSaveColors)onSaveColors(colorDraft);
      showToast('✅ Couleurs sauvegardées');
      addLog('Couleurs conseillers mises à jour','ok');
    }catch(err){showToast('❌ '+err.message,false);}
    finally{setColorSaving(false);}
  }

  async function handleSaveVisibility(){
    setVisSaving(true);
    try{const res=await apiFetch('saveVisibility',{visibility:JSON.stringify(visibility)});if(res.ok){showToast('✅ Visibilité sauvegardée');addLog('Visibilité frontend mise à jour','ok');}else throw new Error(res.error);}
    catch(err){showToast('❌ '+err.message,false);}
    finally{setVisSaving(false);}
  }

  function handleReset(){if(resetStep===0){setResetStep(1);return;}if(resetStep===1){setResetStep(2);return;}addLog('Réinitialisation BDD locale','info');showToast('✅ BDD locale vidée (Google Sheet intact)');setResetStep(0);onRefresh();}

  function exportCalendrier(){
    if(!entries||entries.length===0){showToast('❌ Aucun atelier à exporter',false);return;}
    try{
      const years=entries.map(e=>e.date?e.date.slice(0,4):'').filter(Boolean);
      const year=parseInt(years.sort((a,b)=>years.filter(v=>v===b).length-years.filter(v=>v===a).length)[0]||String(new Date().getFullYear()),10);
      function isoToDate(iso){if(!iso)return null;const[y,m,d]=iso.split('-');return new Date(Date.UTC(parseInt(y),parseInt(m)-1,parseInt(d)));}
      function toAmPm(horaire){if(!horaire)return'AM';return parseInt(String(horaire).replace(/[Hh]/,':').split(':')[0]||'0')<12?'AM':'PM';}
      const df=entries.map(e=>{const d=isoToDate(e.date);if(!d||!e.conseiller)return null;return{date:d,horaire:e.horaire||'9:00',ampm:toAmPm(e.horaire),conseiller:String(e.conseiller).trim(),orienteur:String(e.orienteur||'—').trim(),statut:String(e.statut||'').trim()};}).filter(Boolean);
      if(!df.length){showToast('❌ Aucun atelier valide',false);return;}
      const conseillers=[...new Set(df.map(r=>r.conseiller))];
      const monthSet=new Set(df.filter(r=>r.date.getUTCFullYear()===year).map(r=>r.date.getUTCMonth()+1));
      const months=[...monthSet].sort((a,b)=>a-b);
      if(!months.length){showToast('❌ Aucun atelier pour '+year,false);return;}
      const wb=generateCalendrier(df,year,months,conseillers);
      XLSX.writeFile(wb,`Calendrier_ateliers_${year}.xlsx`);
      addLog(`Calendrier généré : ${df.length} ateliers, ${months.length} mois, ${conseillers.length} conseillers`,'ok');
      showToast(`✅ Calendrier ${year} généré — ${df.length} ateliers`);
    }catch(err){showToast('❌ '+err.message,false);addLog('Erreur calendrier : '+err.message,'err');}
  }

  async function handleImportCSV(e){
    const file=e.target.files[0];if(!file)return;e.target.value='';
    cancelRef.current=false;
    setImporting(true);setImportProgress(0);setImportMsg('Lecture du fichier…');
    try{
      const text=await file.text();const lines=text.split('\n').filter(l=>l.trim());
      if(lines.length<2)throw new Error('Fichier vide ou invalide');
      const firstLine=lines[0];const sep=(firstLine.split(';').length>firstLine.split(',').length)?';':',';
      function parseCSVLine(line){const res=[];let cur='',inQ=false;for(let i=0;i<line.length;i++){const c=line[i];if(c==='"')inQ=!inQ;else if(c===sep&&!inQ){res.push(cur.trim());cur='';}else cur+=c;}res.push(cur.trim());return res;}
      const headers=parseCSVLine(lines[0]).map(h=>h.replace(/^"|"$/g,'').trim());
      const entries_raw=[];
      for(let i=1;i<lines.length;i++){const vals=parseCSVLine(lines[i]);if(vals.length<3)continue;const row={};headers.forEach((h,idx)=>{row[h]=vals[idx]?vals[idx].replace(/^"|"$/g,'').trim():'';});if(!row._id&&!row.statut&&!row['Statut'])continue;
        const g=(...keys)=>{for(const k of keys){if(row[k]!==undefined&&row[k]!=='')return row[k];}return '';};
        entries_raw.push({_id:g('_id')||genId(),_n:parseInt(g('_n','N°'))||0,statut:g('statut','Statut')||'Planifié',date:normalizeDate(g('date','Date')),horaire:normalizeHoraire(g('horaire','Horaire')),ampm:g('ampm','AM/PM')||'AM',orienteur:g('orienteur','Orienteur'),commune:normalizeCommune(g('commune','Commune')),lieu:g('lieu','Lieu',"Lieu de l'atelier"),thematique:g('thematique','Thématique','Thematique'),inscrits:g('inscrits','Inscrits')===''?'':parseInt(g('inscrits','Inscrits'))||0,presents:g('presents','Présents')===''?'':parseInt(g('presents','Présents'))||0,public:g('pub','public','Public')||'Tous publics',conseiller:g('conseiller','Conseiller','Conseiller numérique'),materiel:MATERIELS.filter(m=>String(g(m)).trim().toUpperCase()==='OUI'),residence:g('residence','Résidence','Résidence des participants'),remarques:g('remarques','Remarques')});}
      setImportMsg(`${entries_raw.length} lignes parsées — envoi vers Google Sheets…`);
      const BATCH=5;let done=0;
      for(let i=0;i<entries_raw.length;i+=BATCH){
        if(cancelRef.current){showToast(`⛔ Annulé — ${done} lignes importées`,false);addLog(`Import CSV annulé à ${done}/${entries_raw.length}`,'info');return;}
        const batch=entries_raw.slice(i,i+BATCH);const params=new URLSearchParams({action:'saveMany',entries:JSON.stringify(batch)});const res=await Promise.race([fetch(`${GS_URL}?${params.toString()}`),new Promise((_,r)=>setTimeout(()=>r(new Error('timeout')),45000))]);const data=await res.json();if(!data.ok)throw new Error(data.error);done+=batch.length;setImportProgress(Math.round(done/entries_raw.length*100));setImportMsg(`${done}/${entries_raw.length} lignes importées…`);}
      addLog(`Import CSV : ${entries_raw.length} ateliers`,'ok');showToast(`✅ ${entries_raw.length} ateliers importés`);onRefresh();
    }catch(err){showToast('❌ '+err.message,false);addLog('Erreur import CSV : '+err.message,'err');}
    finally{setImporting(false);setImportProgress(0);setImportMsg('');cancelRef.current=false;}
  }

  async function handleImportXLSX(e){
    const file=e.target.files[0];if(!file)return;e.target.value='';
    cancelRef.current=false;
    setImporting(true);setImportMsg('Lecture XLSX…');
    try{
      const ab=await file.arrayBuffer();const wb=XLSX.read(ab);const ws=wb.Sheets[wb.SheetNames[0]];const rows=XLSX.utils.sheet_to_json(ws,{defval:''});
      const g=(r,...keys)=>{for(const k of keys){if(r[k]!==undefined&&r[k]!=='')return r[k];}return '';};
      const entries_raw=rows.map(r=>({
        _id:       g(r,'_id')||genId(),
        _n:        parseInt(g(r,'_n','N°','n'))||0,
        statut:    g(r,'statut','Statut')||'Planifié',
        date:      normalizeDate(g(r,'date','Date')),
        horaire:   normalizeHoraire(g(r,'horaire','Horaire')),
        ampm:      g(r,'ampm','AM/PM')||'AM',
        orienteur: g(r,'orienteur','Orienteur'),
        commune:   normalizeCommune(g(r,'commune','Commune')),
        lieu:      g(r,'lieu','Lieu',"Lieu de l'atelier"),
        thematique:g(r,'thematique','Thématique','Thematique'),
        inscrits:  g(r,'inscrits','Inscrits')===''?'':parseInt(g(r,'inscrits','Inscrits'))||0,
        presents:  g(r,'presents','Présents','Presents')===''?'':parseInt(g(r,'presents','Présents','Presents'))||0,
        public:    g(r,'public','Public')||'Tous publics',
        conseiller:g(r,'conseiller','Conseiller','Conseiller numérique'),
        materiel:  MATERIELS.filter(m=>String(g(r,m)).trim().toUpperCase()==='OUI'),
        residence: g(r,'residence','Résidence','Résidence des participants'),
        remarques: g(r,'remarques','Remarques'),
      })).filter(r=>r.statut);
      const BATCH=5;let done=0;
      for(let i=0;i<entries_raw.length;i+=BATCH){
        if(cancelRef.current){showToast(`⛔ Annulé — ${done} lignes importées`,false);addLog(`Import XLSX annulé à ${done}/${entries_raw.length}`,'info');return;}
        const batch=entries_raw.slice(i,i+BATCH);const params=new URLSearchParams({action:'saveMany',entries:JSON.stringify(batch)});const res=await Promise.race([fetch(`${GS_URL}?${params.toString()}`),new Promise((_,r)=>setTimeout(()=>r(new Error('timeout')),45000))]);const data=await res.json();if(!data.ok)throw new Error(data.error);done+=batch.length;setImportProgress(Math.round(done/entries_raw.length*100));}
      addLog(`Import XLSX : ${entries_raw.length} ateliers`,'ok');showToast(`✅ ${entries_raw.length} ateliers importés`);onRefresh();
    }catch(err){showToast('❌ '+err.message,false);addLog('Erreur import XLSX : '+err.message,'err');}
    finally{setImporting(false);setImportProgress(0);setImportMsg('');cancelRef.current=false;}
  }

  const resetLabels=['🗑️ Réinitialiser la BDD locale','⚠️ Confirmer (1/2)','🚨 Confirmer définitivement (2/2)'];

  return CE('div',null,
    CE('div',{className:'card'},
      CE('h2',null,'⚙️ Panneau Administrateur'),
      CE('div',{style:{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16,marginBottom:8}},
        CE('div',{className:'kpi'},CE('div',{className:'val'},entries.length),CE('div',{className:'lbl'},'Total ateliers')),
        CE('div',{className:'kpi'},CE('div',{className:'val'},entries.filter(e=>e.statut==='Réalisé').length),CE('div',{className:'lbl'},'Réalisés'))
      )
    ),
    // Couleurs conseillers
    CE('div',{className:'admin-section'},
      CE('h3',null,'🎨 Couleurs des conseillers'),
      CE('p',{style:{fontSize:12,color:'#4a5568',marginBottom:16}},'Personnalisez la couleur de chaque conseiller numérique. S\'applique au bandeau, au formulaire et aux cartes.'),
      CE('div',{style:{display:'flex',flexDirection:'column',gap:10}},
        (conseillersList||Object.keys(CONSEILLER_COLORS)).map(c=>{
          const hexVal=(colorDraft[c]||'#6B7280').toUpperCase();
          return CE('div',{key:c,style:{display:'flex',alignItems:'center',gap:12,padding:'10px 14px',background:'#f8fafc',borderRadius:10,border:'1.5px solid #e2e8f0'}},
            // Color picker visuel
            CE('input',{type:'color',value:(colorDraft[c]||'#6B7280').toLowerCase(),
              onChange:e=>setColorDraft(d=>({...d,[c]:e.target.value.toUpperCase()})),
              style:{width:44,height:44,borderRadius:8,border:'none',cursor:'pointer',padding:2,background:'none',flexShrink:0}}),
            // Preview carré
            CE('div',{style:{width:36,height:36,borderRadius:8,background:colorDraft[c]||'#6B7280',flexShrink:0,boxShadow:'0 2px 6px rgba(0,0,0,.15)'}}),
            // Nom
            CE('span',{style:{flex:1,fontWeight:700,fontSize:14,color:'#1a202c'}},c),
            // Input hex éditable
            CE('input',{type:'text',value:hexVal,maxLength:7,
              onChange:e=>{
                const v=e.target.value.toUpperCase();
                setColorDraft(d=>({...d,[c]:v}));
              },
              onBlur:e=>{
                // Valider et corriger au blur
                const v=e.target.value;
                if(/^#[0-9A-Fa-f]{6}$/.test(v))setColorDraft(d=>({...d,[c]:v.toUpperCase()}));
                else setColorDraft(d=>({...d,[c]:colorDraft[c]||'#6B7280'}));
              },
              style:{width:88,fontFamily:'monospace',fontSize:13,fontWeight:700,color:'#1a202c',padding:'6px 10px',border:'1.5px solid #e2e8f0',borderRadius:8,background:'#fff',textAlign:'center'}}),
            // Bouton reset
            CE('button',{onClick:()=>{const orig=CONSEILLER_COLORS[c]||'#6B7280';setColorDraft(d=>({...d,[c]:orig}));},
              style:{padding:'4px 10px',border:'1px solid #e2e8f0',borderRadius:6,fontSize:11,color:'#718096',cursor:'pointer',background:'#fff',flexShrink:0}},'↩ Reset')
          );
        })
      ),
      CE('button',{className:'btn btn-primary',style:{marginTop:16},onClick:handleSaveColors,disabled:colorSaving},colorSaving?'…':'💾 Sauvegarder les couleurs')
    ),
    visibility&&CE('div',{className:'admin-section'},
      CE('h3',null,'👁️ Visibilité — Frontend conseillers'),
      CE('p',{style:{fontSize:12,color:'#4a5568',marginBottom:12}},'Choisissez les onglets visibles dans l\'interface conseiller.'),
      VIS_ITEMS.map(item=>CE('div',{key:item.key,className:'toggle-row'},
        CE('div',null,CE('div',{className:'toggle-label'},item.label),CE('div',{className:'toggle-sub'},item.sub)),
        CE('label',{className:'tgl'},CE('input',{type:'checkbox',checked:!!visibility[item.key],onChange:()=>setVisibility(v=>({...v,[item.key]:!v[item.key]}))}),CE('span',{className:'tgl-track'}))
      )),
      CE('button',{className:'btn btn-primary',style:{marginTop:16},onClick:handleSaveVisibility,disabled:visSaving},visSaving?'…':'💾 Enregistrer la visibilité')
    ),
    CE('div',{className:'admin-section'},
      CE('h3',null,'📅 Générer le Calendrier Planning'),
      CE('p',{style:{fontSize:12,color:'#4a5568',marginBottom:12}},`Génère le fichier Excel de planning mis en page directement depuis les données chargées. ${entries.length} atelier(s) disponible(s).`),
      CE('button',{className:'btn btn-success',onClick:exportCalendrier,disabled:!entries||entries.length===0},'📅 Générer le Calendrier Planning')
    ),
    CE('div',{className:'admin-section'},
      CE('h3',null,'📥 Import CSV'),
      CE('p',{style:{fontSize:12,color:'#4a5568',marginBottom:12}},'Importe un fichier CSV compatible. Les entrées existantes sont fusionnées.'),
      importing?CE('div',null,CE('p',{style:{fontSize:12,color:'#4a5568',marginBottom:6}},importMsg),CE('div',{className:'progress-bar'},CE('div',{className:'progress-fill',style:{width:importProgress+'%'}})),CE('div',{style:{display:'flex',justifyContent:'space-between',alignItems:'center',marginTop:6}},CE('p',{style:{fontSize:11,color:'#718096'}},importProgress+'%'),CE('button',{className:'btn btn-danger btn-sm',onClick:()=>cancelRef.current=true},'⛔ Annuler'))):CE('label',{style:{display:'inline-block',cursor:'pointer'}},CE('span',{className:'btn btn-primary'},'📂 Choisir un fichier CSV'),CE('input',{type:'file',accept:'.csv',style:{display:'none'},onChange:handleImportCSV}))
    ),
    CE('div',{className:'admin-section'},
      CE('h3',null,'📊 Import XLSX'),
      CE('p',{style:{fontSize:12,color:'#4a5568',marginBottom:12}},'Réimporte un fichier .xlsx précédemment exporté.'),
      importing?CE('div',null,CE('p',{style:{fontSize:12,color:'#4a5568',marginBottom:6}},importMsg||'Import en cours…'),CE('div',{className:'progress-bar'},CE('div',{className:'progress-fill',style:{width:importProgress+'%'}})),CE('div',{style:{display:'flex',justifyContent:'space-between',alignItems:'center',marginTop:6}},CE('p',{style:{fontSize:11,color:'#718096'}},importProgress+'%'),CE('button',{className:'btn btn-danger btn-sm',onClick:()=>cancelRef.current=true},'⛔ Annuler'))):CE('label',{style:{display:'inline-block',cursor:'pointer'}},CE('span',{className:'btn btn-warn'},'📂 Choisir un fichier XLSX'),CE('input',{type:'file',accept:'.xlsx',style:{display:'none'},onChange:handleImportXLSX}))
    ),
    CE('div',{className:'admin-section'},
      CE('h3',null,'🗑️ Réinitialiser la base de données'),
      CE('p',{style:{fontSize:12,color:'#4a5568',marginBottom:12}},'Vide uniquement le cache local. Le Google Sheet reste intact.'),
      resetStep>0&&CE('div',{className:'confirm-box'},CE('p',null,resetStep===1?'Êtes-vous sûr ? Cette action vide le cache local.':'Dernière confirmation — cliquez pour confirmer.')),
      CE('div',{style:{display:'flex',gap:10}},
        CE('button',{className:'btn btn-danger',onClick:handleReset},resetLabels[resetStep]),
        resetStep>0&&CE('button',{className:'btn btn-secondary',onClick:()=>setResetStep(0)},'Annuler')
      )
    )
  );
}

// ═══════════════════════════════════════════════════════════
// VUE ACCUEIL — frontend uniquement
// ═══════════════════════════════════════════════════════════
function VueAccueil({conseillers,onChoix,loading}){
  const[choix,setChoix]=React.useState('');
  return CE('div',{className:'accueil-wrap'},
    CE('div',{className:'accueil-card'},
      CE('div',{className:'accueil-logo'},'🖥️'),
      CE('div',{className:'accueil-title'},'Ateliers Inclusion Numérique'),
      CE('div',{className:'accueil-sub'},'Conseil Départemental du Lot-et-Garonne'),
      CE('label',{className:'accueil-label'},'Qui êtes-vous ?'),
      CE('select',{className:'accueil-select',value:choix,onChange:e=>setChoix(e.target.value)},
        CE('option',{value:''},'— Sélectionner votre nom —'),
        conseillers.map(c=>CE('option',{key:c,value:c},c))
      ),
      CE('button',{className:'accueil-btn',disabled:!choix||loading,onClick:()=>onChoix(choix)},
        loading?CE('span',null,CE('span',{className:'spinner'}),'Chargement…'):'📋 Accéder à mes ateliers'),
      CE('button',{className:'accueil-skip',disabled:loading,onClick:()=>onChoix(null),style:{opacity:loading?.4:1}},'Voir tous les ateliers')
    )
  );
}
