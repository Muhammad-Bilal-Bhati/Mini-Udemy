function Step({ number, title, text }) {
  return <div className="step"><span className="step-number">{number}</span><div><h3>{title}</h3><p>{text}</p></div></div>
}

function StepsSection() {
  return (
    <section className="steps-section" id="how-it-works">
      <div><p className="eyebrow">A BETTER WAY TO LEARN</p><h2>Small steps.<br /><em>Real momentum.</em></h2></div>
      <div className="steps"><Step number="01" title="Choose your direction" text="Browse honest, practical courses made for the skill you want next." /><Step number="02" title="Learn at your pace" text="Make progress in focused sessions that fit your actual life." /><Step number="03" title="Put it to work" text="Turn new knowledge into work you can see, share, and be proud of." /></div>
    </section>
  )
}

export default StepsSection
