export function Footer() {
  return (
    <footer className="relative z-10 mt-32 border-t border-white/10 bg-void/60 backdrop-blur">
      <div className="container flex flex-col gap-4 py-10 text-sm text-dim sm:flex-row sm:items-center sm:justify-between">
        <p className="font-display uppercase tracking-[0.2em]">Re<span className="text-ion">spawn</span> <span className="ml-2 font-mono text-xs normal-case tracking-normal">© {new Date().getFullYear()}</span></p>
        <p className="font-mono text-xs">
          Game data from <a href="https://rawg.io" target="_blank" rel="noreferrer" className="text-ion hover:underline">RAWG</a> · Character data from{" "}
          <a href="https://www.fandom.com" target="_blank" rel="noreferrer" className="text-ion hover:underline">Fandom</a>
        </p>
      </div>
    </footer>
  );
}
