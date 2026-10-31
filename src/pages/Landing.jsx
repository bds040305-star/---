import Home from './Home';
import Inside from './Inside';
import Structure from './Structure';
import GrowingSystem from './GrowingSystem';
import Seed from './Seed';
import Support from './Support';

export default function Landing({ onNavigate, openControl, info, onSelect }) {
  return <>
    <Home onNavigate={onNavigate} />
    <Inside onChat={() => onNavigate('/ai')} />
    <Structure onNavigate={onNavigate} />
    <GrowingSystem openControl={openControl} info={info} />
    <Seed onSelect={onSelect} openControl={openControl} />
    <Support info={info} />
  </>;
}
