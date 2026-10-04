import { Menu } from 'lucide-react'
export default function Header(){
  return <header className="top-header">
    <div className="brand-wrap">
      <b className="wells-logo">wells</b>
      <span className="farm-badge">FARM MINI</span>
    </div>
    <button className="menu-btn" aria-label="메뉴"><Menu size={16}/></button>
  </header>
}
