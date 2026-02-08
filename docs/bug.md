# Bug List

## Identified Bugs

- [x] **bug:** Missing Tauri icons directory - `tauri.conf.json` references icon files (icons/32x32.png, icons/128x128.png, icons/128x128@2x.png, icons/icon.icns, icons/icon.ico) that don't exist in src-tauri/ - will cause build failures
- [x] **bug:** Workflow branch reference error - `.github/workflows/pull.yml:65` references `origin/develop` but repository uses `main` as default branch
- [x] **bug:** No agent creation UI - App displays empty state but has no way to add agents via GUI
- [x] **bug:** No theme toggle implementation - Theme state exists in store but no UI control to toggle between light/dark modes
- [x] **bug:** Missing src-tauri/icons directory entirely - Tauri bundle config expects icons but directory doesn't exist

## Error List

- [x] **error:** Incomplete feature consolidation - StorX Phase 5 tasks incomplete (no file watchers, no SQLite integration, no skill composition UI)
- [x] **error:** Missing CSS custom properties - index.css only has Tailwind directives but no dark mode CSS variables or component styles
- [x] **error:** No error boundaries in React app - App.tsx has no error handling for component failures
- [x] **error:** Rust main.rs uses blocking Command instead of async for check_opencode_installed - could freeze UI
- [x] **error:** Zustand store persists only theme but agents/runs not persisted - data loss on app restart

## Console Errors/Warnings

*No browser console errors identified yet - requires running app in browser*

---

## Bug Format Template
- [ ] bug: [description]
- [/] bug: [description] (in progress)
- [x] bug: [description] (fixed)

## Error Format Template
- [ ] error: [description]
- [/] error: [description] (in progress)
- [x] error: [description] (fixed)
