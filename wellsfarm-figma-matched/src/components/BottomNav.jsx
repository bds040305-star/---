import { NavLink } from 'react-router-dom'
const items=[
  ['/', 'Home'],
  ['/inside','Inside'],
  ['/structure','Structure'],
  ['/seed','Seed'],
  ['/harvest','Harvest']
]
export default function BottomNav(){
  return <nav className="bottom-nav">
    {items.map(([to,label],i)=><NavLink key={to} to={to} className={({isActive})=>isActive?'active':''}>
      <b>0{i+1}</b><span>{label}</span>
    </NavLink>)}
  </nav>
}
