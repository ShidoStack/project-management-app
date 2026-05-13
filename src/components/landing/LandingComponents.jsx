import React from 'react';

export const LandingNav = ({ onLaunch }) => (
  <nav className="land-nav" id="landNav">
    <div className="nav-logo">Project<span>Flow</span></div>
    <ul className="nav-links">
      <li><a href="#features">Features</a></li>
      <li><a href="#how-it-works">How it Works</a></li>
      <li><a href="#" onClick={(e) => { e.preventDefault(); onLaunch(); }} className="nav-cta">Launch App →</a></li>
    </ul>
  </nav>
);

export const Hero = ({ onLaunch }) => (
  <section className="hero">
    <div className="hero-badge">Workspace Productivity Suite</div>
    <h1 className="hero-title">The workspace where <em>great teams</em> get things done</h1>
    <p className="hero-sub">Beautiful boards, smart deadlines, and real-time collaboration — designed for teams who refuse to settle for ordinary.</p>
    <div className="hero-actions">
      <button className="btn-primary" onClick={onLaunch}>Start For Free →</button>
      <button className="btn-ghost" onClick={() => document.getElementById('features').scrollIntoView({behavior:'smooth'})}>See All Features</button>
    </div>
    <div className="hero-visual">
      <div className="mock-dots"><span></span><span></span><span></span></div>
      <div className="mock-content">
        <div className="mock-sidebar">
          {[1,2,3,4].map(i => <div key={i} className={`mock-sidebar-item ${i===2?'active':''}`}></div>)}
          <div style={{height:'1px',background:'rgba(255,255,255,0.08)',margin:'8px 0'}}></div>
          <div className="mock-sidebar-item"></div>
          <div className="mock-sidebar-item"></div>
        </div>
        <div className="mock-main">
          <div className="mock-columns">
            <div className="mock-col"><div className="mock-col-head"></div><div className="mock-card p1"></div><div className="mock-card p2"></div><div className="mock-card p3"></div></div>
            <div className="mock-col"><div className="mock-col-head"></div><div className="mock-card p2"></div><div className="mock-card p1"></div></div>
            <div className="mock-col"><div className="mock-col-head"></div><div className="mock-card p3"></div><div className="mock-card p3"></div><div className="mock-card p2"></div></div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export const Features = () => (
  <section id="features" className="features-section">
    <div className="section-label reveal">Everything you need</div>
    <h2 className="section-title reveal">Powerful features, thoughtfully designed</h2>
    <div className="features-grid reveal">
      {[
        {icon:'📋', title:'Drag & Drop Boards', text:'Organize work visually with intuitive kanban boards. Move tasks effortlessly between stages.'},
        {icon:'🎯', title:'Priority Levels', text:'Critical, high, medium, low — four levels help your team focus on what matters most.'},
        {icon:'👥', title:'Team Assignment', text:'Assign tasks to specific team members with avatar stacks.'},
        {icon:'⏰', title:'Deadline Alerts', text:'Smart deadline tracking with overdue and upcoming alerts.'},
        {icon:'📊', title:'Progress Tracking', text:'Per-project progress bars and analytics dashboards.'},
        {icon:'💬', title:'Comments & Attachments', text:'Keep all task context in one place. Comment threads and file attachments.'},
        {icon:'📅', title:'Calendar View', text:'See all deadlines on a monthly calendar. Spot scheduling conflicts.'},
        {icon:'🗂️', title:'Multiple Projects', text:'Switch between projects with tabbed navigation.'},
        {icon:'🍅', title:'Focus Mode Timer', text:'Built-in Pomodoro-style focus timer helps your team stay in the zone.'}
      ].map((f, i) => (
        <div key={i} className="feat-card">
          <div className="feat-icon">{f.icon}</div>
          <h3>{f.title}</h3>
          <p>{f.text}</p>
        </div>
      ))}
    </div>
  </section>
);

export const HowItWorks = () => (
  <section id="how-it-works" className="hiw-section">
    <div className="section-label">Simple workflow</div>
    <h2 className="section-title">Up and running in minutes</h2>
    <div className="steps-row">
      {[
        {n:'01', t:'Create a Project', p:'Set up a new project workspace with your team members and deadline targets.'},
        {n:'02', t:'Build Your Board', p:'Add custom columns that match your workflow — from backlog to done.'},
        {n:'03', t:'Assign & Prioritize', p:'Create tasks, set priorities, assign members, and attach deadlines.'},
        {n:'04', t:'Ship Together', p:'Track progress, comment on tasks, and celebrate completions.'}
      ].map((s, i) => (
        <div key={i} className="step-card">
          <div className="step-num">{s.n}</div>
          <h3>{s.t}</h3>
          <p>{s.p}</p>
        </div>
      ))}
    </div>
  </section>
);

export const Stats = () => (
  <section className="stats-section">
    <div className="stat-item reveal"><div className="stat-num">40%</div><div className="stat-label">Faster project delivery</div></div>
    <div className="stat-item reveal"><div className="stat-num">3×</div><div className="stat-label">Better team alignment</div></div>
    <div className="stat-item reveal"><div className="stat-num">∞</div><div className="stat-label">Projects supported</div></div>
    <div className="stat-item reveal"><div className="stat-num">100%</div><div className="stat-label">Free to use</div></div>
  </section>
);

export const LandingFooter = () => (
  <div className="land-footer"><p>© 2025 ProjectFlow · Built with care for productive teams everywhere</p></div>
);
