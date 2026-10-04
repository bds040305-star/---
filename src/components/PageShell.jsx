import Header from './Header'
export default function PageShell({eyebrow,title,desc,children,footer=false}){
  return <main className="mobile-page">
    <Header/>
    <section className="page-hero">
      <p className="eyebrow">{eyebrow}</p>
      <h1>{title}</h1>
      {desc && <p className="desc">{desc}</p>}
    </section>
    {children}
    {footer && <footer className="footer"><b>wells</b><span>KYOWON WELLS · MICRO SITE</span></footer>}
  </main>
}
