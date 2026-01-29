type Props = {
  onOpenAllocate(): void;
};

export default function TopBar({ onOpenAllocate }: Props) {
  return (
    <header className="topbar">
      <div className="topbar-inner">
        <div className="logo">
          ProWM <small>Alocação</small>
        </div>

        <nav className="menu">
          <button className="btn btn-primary" onClick={onOpenAllocate}>
            Alocar
          </button>
        </nav>
      </div>
    </header>
  );
}
