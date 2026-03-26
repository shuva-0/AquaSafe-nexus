export function Footer() {
  return (
    <footer className="border-t border-slate-700 bg-[#0f172a] py-4">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-xs text-slate-500">
            AquaSafe Nexus X&#8734; - Deterministic Risk Intelligence Platform
          </p>
          <div className="flex items-center gap-2 rounded-lg bg-slate-800 px-3 py-1.5">
            <span className="text-xs text-slate-500">Formula:</span>
            <code className="font-mono text-xs text-slate-300">
              R = &#931;(w&#7522; &#183; n&#7522;) / &#931;(w&#7522;)
            </code>
          </div>
        </div>
      </div>
    </footer>
  );
}
