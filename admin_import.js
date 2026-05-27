// ═══════════════════════════════════════════════════════════
// admin_import.js — Import Google Sheet externe v1.0
// À inclure dans admin_v14.html APRÈS shared.js :
//   <script src="admin_import.js"></script>
//
// Puis dans admin_app.js, dans le render de VueAdmin,
// ajouter le bouton déclencheur et le panneau :
//
//   // Dans l'état du composant VueAdmin :
//   const [showImport, setShowImport] = React.useState(false);
//
//   // Dans la nav ou la section admin :
//   CE('button', { className:'btn btn-warn', onClick:()=>setShowImport(true) }, '📥 Import Sheet externe'),
//
//   // Dans le render (au même niveau que VueListes, etc.) :
//   showImport && CE(PanelImportSheet, {
//     onClose: () => setShowImport(false),
//     onImported: (entries) => {
//       // entries = tableau prêt à sauvegarder
//       apiFetch('saveMany', { entries: JSON.stringify(entries) })
//         .then(res => {
//           if (res.ok) { showToast('✅ ' + res.saved + ' entrées importées'); setShowImport(false); reload(); }
//           else showToast('❌ ' + res.error, false);
//         });
//     }
//   })
// ═══════════════════════════════════════════════════════════

const IMPORT_SOURCE_SHEET_ID = '1i-4MiVuL0wMYNhIrF4a1Jt4lg_KJrogxc0cKvCuI0Kg';

function PanelImportSheet({ onClose, onImported }) {
  const [sheetId,    setSheetId]    = React.useState(IMPORT_SOURCE_SHEET_ID);
  const [sheetName,  setSheetName]  = React.useState('');
  const [loading,    setLoading]    = React.useState(false);
  const [saving,     setSaving]     = React.useState(false);
  const [preview,    setPreview]    = React.useState(null); // { entries, count }
  const [filterVide, setFilterVide] = React.useState(true); // ignorer lignes sans date

  React.useEffect(() => {
    function k(e) { if (e.key === 'Escape') onClose(); }
    document.addEventListener('keydown', k);
    return () => document.removeEventListener('keydown', k);
  }, []);

  async function handleFetch() {
    if (!sheetId.trim()) { showToast('❌ ID du Sheet requis', false); return; }
    setLoading(true);
    setPreview(null);
    try {
      const res = await apiFetch('importFromSheet', { sheetId: sheetId.trim(), sheetName: sheetName.trim() });
      if (!res.ok) throw new Error(res.error || 'Erreur inconnue');
      setPreview(res);
      showToast('✅ ' + res.count + ' ligne(s) récupérée(s)');
    } catch (e) {
      showToast('❌ ' + e.message, false);
    } finally {
      setLoading(false);
    }
  }

  async function handleConfirm() {
    if (!preview || !preview.entries) return;
    let entries = preview.entries;
    if (filterVide) entries = entries.filter(e => e.date && e.date.length >= 10);
    if (entries.length === 0) { showToast('⚠️ Aucune entrée valide à importer', false); return; }
    setSaving(true);
    try {
      await onImported(entries);
    } finally {
      setSaving(false);
    }
  }

  const validCount = preview
    ? (filterVide ? preview.entries.filter(e => e.date && e.date.length >= 10).length : preview.count)
    : 0;

  return CE('div', { className: 'listes-overlay', onClick: e => { if (e.target.className === 'listes-overlay') onClose(); } },
    CE('div', { className: 'listes-modal', style: { width: 560 } },

      // ── Header ──
      CE('div', { className: 'listes-header' },
        CE('button', { className: 'listes-close', onClick: onClose }, '×'),
        CE('h2', null, '📥 Import depuis Google Sheet'),
        CE('p', null, 'Récupère et importe les ateliers d\'un sheet externe')
      ),

      // ── Corps ──
      CE('div', { className: 'listes-body' },

        // Sheet ID
        CE('label', { style: { fontSize: 12, fontWeight: 700, color: '#4a5568', display: 'block', marginBottom: 4 } }, 'ID du Google Sheet source'),
        CE('input', {
          type: 'text',
          value: sheetId,
          placeholder: '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgVE2upms',
          style: { width: '100%', padding: '8px 10px', border: '1.5px solid #e2e8f0', borderRadius: 6, fontSize: 13, marginBottom: 12 },
          onChange: e => { setSheetId(e.target.value); setPreview(null); }
        }),

        // Nom de feuille (optionnel)
        CE('label', { style: { fontSize: 12, fontWeight: 700, color: '#4a5568', display: 'block', marginBottom: 4 } }, 'Nom de la feuille (laisser vide = première feuille)'),
        CE('input', {
          type: 'text',
          value: sheetName,
          placeholder: 'ex : 2026',
          style: { width: '100%', padding: '8px 10px', border: '1.5px solid #e2e8f0', borderRadius: 6, fontSize: 13, marginBottom: 16 },
          onChange: e => { setSheetName(e.target.value); setPreview(null); }
        }),

        // Bouton fetch
        CE('button', {
          className: 'btn btn-primary',
          disabled: loading,
          onClick: handleFetch,
          style: { marginBottom: 16 }
        }, loading
          ? CE('span', null, CE('span', { className: 'spinner' }), ' Lecture en cours…')
          : '🔍 Lire le sheet'
        ),

        // Aperçu résultat
        preview && CE('div', null,
          CE('div', {
            style: {
              background: preview.count > 0 ? '#f0fdf4' : '#fff5f5',
              border: '1.5px solid ' + (preview.count > 0 ? '#86efac' : '#fc8181'),
              borderRadius: 8, padding: '12px 16px', marginBottom: 12
            }
          },
            CE('div', { style: { fontWeight: 700, fontSize: 14, color: preview.count > 0 ? '#166534' : '#9b2c2c', marginBottom: 6 } },
              preview.count > 0 ? `✅ ${preview.count} ligne(s) lue(s)` : '⚠️ Aucune ligne trouvée'
            ),
            preview.count > 0 && CE('div', { style: { fontSize: 12, color: '#4a5568' } },
              `Colonnes détectées : N°, Statut, Date, Horaire, AM/PM, Orienteur, Commune, Lieu, Thématique, Inscrits, Présents, Public, Conseiller, Matériel (×7), Résidence, Remarques`
            )
          ),

          // Option filtre
          preview.count > 0 && CE('label', {
            style: { display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#4a5568', marginBottom: 12, cursor: 'pointer' }
          },
            CE('input', { type: 'checkbox', checked: filterVide, onChange: e => setFilterVide(e.target.checked) }),
            `Ignorer les lignes sans date (${preview.count - preview.entries.filter(e => e.date && e.date.length >= 10).length} ligne(s) exclue(s))`
          ),

          // Aperçu tableau (5 premières lignes valides)
          preview.count > 0 && CE('div', { style: { overflowX: 'auto', marginBottom: 12 } },
            CE('table', { style: { width: '100%', borderCollapse: 'collapse', fontSize: 12 } },
              CE('thead', null,
                CE('tr', { style: { background: '#f7fafc' } },
                  ['Date','Horaire','Thématique','Commune','Conseiller','Statut'].map(h =>
                    CE('th', { key: h, style: { padding: '6px 10px', textAlign: 'left', borderBottom: '2px solid #e2e8f0', fontWeight: 700, color: '#4a5568', whiteSpace: 'nowrap' } }, h)
                  )
                )
              ),
              CE('tbody', null,
                preview.entries.filter(e => !filterVide || (e.date && e.date.length >= 10)).slice(0, 5).map((e, i) =>
                  CE('tr', { key: i },
                    [e.date, e.horaire || '—', (e.thematique || '—').slice(0, 30) + (e.thematique && e.thematique.length > 30 ? '…' : ''), e.commune || '—', e.conseiller || '—', e.statut || '—'].map((v, j) =>
                      CE('td', { key: j, style: { padding: '6px 10px', borderBottom: '1px solid #f0f4f8' } }, v)
                    )
                  )
                )
              )
            ),
            preview.entries.filter(e => !filterVide || (e.date && e.date.length >= 10)).length > 5 &&
              CE('div', { style: { fontSize: 11, color: '#718096', padding: '4px 10px', fontStyle: 'italic' } },
                `… et ${validCount - 5} autre(s) ligne(s)`
              )
          )
        )
      ),

      // ── Footer ──
      CE('div', { className: 'listes-footer' },
        CE('button', { className: 'btn btn-secondary', onClick: onClose }, 'Annuler'),
        preview && preview.count > 0 && CE('button', {
          className: 'btn btn-success',
          disabled: saving || validCount === 0,
          onClick: handleConfirm
        }, saving
          ? CE('span', null, CE('span', { className: 'spinner' }), ` Enregistrement…`)
          : `💾 Importer ${validCount} atelier(s)`
        )
      )
    )
  );
}
