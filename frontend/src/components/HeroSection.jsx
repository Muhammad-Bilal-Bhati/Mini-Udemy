function HeroSection({ search, onSearchChange, onSearch }) {
  return (
    <section className="hero-section">
      <div className="hero-copy">
        <p className="eyebrow">LEARN WITH INTENTION</p>
        <h1>Build skills that<br /><em>move you forward.</em></h1>
        <p className="hero-description">Practical courses from people who have done the work. Find your next edge and make it yours.</p>
        <form className="search-box" onSubmit={onSearch}>
          <span className="search-icon">/</span>
          <input value={search} onChange={(event) => onSearchChange(event.target.value)} placeholder="What do you want to learn?" aria-label="Search courses" />
          <button type="submit">Search</button>
        </form>
        <div className="hero-proof"><span className="avatars"><i>R</i><i>A</i><i>S</i></span><span><strong>2,400+</strong> learners growing every week</span></div>
      </div>
      <div className="hero-art"><div className="art-note note-one">FOCUS<br /><strong>ON THE<br />CRAFT</strong></div><div className="art-circle"><div className="art-orbit"></div><span className="art-letter">M</span></div><div className="art-note note-two">CURATED<br /><strong>FOR YOU</strong></div><span className="art-star">*</span></div>
    </section>
  )
}

export default HeroSection
