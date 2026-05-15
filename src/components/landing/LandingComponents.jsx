import { ArrowRight, CalendarClock, Check, Clock3, KanbanSquare, UsersRound } from 'lucide-react';
import { motion } from 'framer-motion';

const reveal = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0 }
};

export const LandingNav = ({ onLaunch }) => (
  <nav className="land-nav" id="landNav">
    <div className="nav-logo">Project<span>Flow</span></div>
    <ul className="nav-links">
      <li><a href="#features">Story</a></li>
      <li><a href="#pricing">Pricing</a></li>
      <li><a href="#" onClick={(e) => { e.preventDefault(); onLaunch(); }} className="nav-cta">Enter Workspace</a></li>
    </ul>
  </nav>
);

export const Hero = ({ onLaunch }) => (
  <section className="hero cinematic-hero">
    <div className="hero-light hero-light-a"></div>
    <div className="hero-light hero-light-b"></div>
    <motion.div className="hero-badge" initial="hidden" animate="visible" variants={reveal} transition={{ duration: 0.65 }}>
      Calm systems for ambitious teams
    </motion.div>
    <motion.h1 className="hero-title cinematic-title" initial="hidden" animate="visible" variants={reveal} transition={{ duration: 0.8, delay: 0.08 }}>
      Work without <em>chaos.</em>
    </motion.h1>
    <motion.p className="hero-sub cinematic-sub" initial="hidden" animate="visible" variants={reveal} transition={{ duration: 0.8, delay: 0.18 }}>
      ProjectFlow turns scattered tasks, deadlines, files, and decisions into a calm editorial workspace where meaningful work can move with clarity.
    </motion.p>
    <motion.div className="hero-actions" initial="hidden" animate="visible" variants={reveal} transition={{ duration: 0.8, delay: 0.28 }}>
      <button className="btn-primary magnetic-btn" onClick={onLaunch}>Start with clarity <ArrowRight size={16} /></button>
      <button className="btn-ghost" onClick={() => document.getElementById('features').scrollIntoView({behavior:'smooth'})}>Watch the workflow</button>
    </motion.div>
    <motion.div className="cinematic-metrics" initial="hidden" animate="visible" variants={reveal} transition={{ duration: 0.8, delay: 0.38 }}>
      <span><strong>59:59</strong> deep focus</span>
      <span><strong>4</strong> work views</span>
      <span><strong>0</strong> chaos required</span>
    </motion.div>
    <ProductConstellation />
  </section>
);

const ProductConstellation = () => (
  <motion.div className="product-constellation" initial={{ opacity: 0, y: 38, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.9, delay: 0.45, ease: 'easeOut' }}>
    <div className="constellation-panel main">
      <div className="mock-dots"><span></span><span></span><span></span></div>
      <div className="constellation-header">
        <div><span className="mini-label">Product Studio</span><strong>Launch operating system</strong></div>
        <span className="health-pill">82% aligned</span>
      </div>
      <div className="constellation-board">
        {['Plan', 'Build', 'Review'].map((col, colIndex) => (
          <div key={col} className="story-col">
            <span>{col}</span>
            {[0, 1, 2].map(i => (
              <motion.div key={i} className={`story-task tone-${(colIndex + i) % 4}`} animate={{ y: [0, -4, 0] }} transition={{ duration: 4 + i, repeat: Infinity, delay: i * 0.3 }}>
                <b></b><small></small>
              </motion.div>
            ))}
          </div>
        ))}
      </div>
    </div>
    <motion.div className="floating-card float-a" animate={{ y: [0, -12, 0], rotate: [-1, 1, -1] }} transition={{ duration: 6, repeat: Infinity }}>
      <CalendarClock size={18} /><span>Deadline softened</span><strong>Fri, 4:00 PM</strong>
    </motion.div>
    <motion.div className="floating-card float-b" animate={{ y: [0, 10, 0], rotate: [1, -1, 1] }} transition={{ duration: 7, repeat: Infinity }}>
      <UsersRound size={18} /><span>Design review</span><strong>3 teammates synced</strong>
    </motion.div>
    <motion.div className="floating-card float-c" animate={{ y: [0, -8, 0] }} transition={{ duration: 5.5, repeat: Infinity }}>
      <Clock3 size={18} /><span>Focus block</span><strong>42 minutes protected</strong>
    </motion.div>
  </motion.div>
);

export const Features = () => {
  const stories = [
    {
      icon: KanbanSquare,
      label: 'Clarity for complex projects',
      title: 'See the work move, without the noise.',
      text: 'Boards, task evidence, comments, owners, and progress live in one calm surface. The team sees what changed without hunting through scattered updates.',
      flip: false,
      visual: 'board'
    },
    {
      icon: CalendarClock,
      label: 'Deadlines without stress',
      title: 'Dates become a rhythm, not a panic signal.',
      text: 'Calendar context, overdue cues, reminders, and focus sessions help deadlines feel visible and manageable instead of loud and reactive.',
      flip: true,
      visual: 'calendar'
    },
    {
      icon: UsersRound,
      label: 'Built for collaborative work',
      title: 'A workspace that remembers who is carrying what.',
      text: 'Switch workspaces, assign teammates, invite collaborators, and keep files attached to the task where progress actually happened.',
      flip: false,
      visual: 'team'
    },
    {
      icon: Clock3,
      label: 'Focus deeply',
      title: 'When it is time to make progress, the interface gets quiet.',
      text: 'A cinematic focus mode protects attention with a 59:59 deep-work timer, gentle overlays, and calmer feedback loops.',
      flip: true,
      visual: 'focus'
    }
  ];

  return (
    <section id="features" className="story-section">
      <div className="section-label reveal">The ProjectFlow method</div>
      <h2 className="section-title reveal">A calmer way to organize ambitious work.</h2>
      <div className="story-stack">
        {stories.map(story => <StoryShowcase key={story.label} {...story} />)}
      </div>
    </section>
  );
};

const StoryShowcase = ({ icon: Icon, label, title, text, flip, visual }) => (
  <motion.article className={`story-showcase ${flip ? 'flip' : ''}`} initial={{ opacity: 0, y: 32 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.25 }} transition={{ duration: 0.55, ease: 'easeOut' }}>
    <div className="story-copy">
      <div className="story-kicker"><Icon size={18} />{label}</div>
      <h3>{title}</h3>
      <p>{text}</p>
    </div>
    <div className={`story-visual ${visual}`}>
      {visual === 'board' && <MiniBoard />}
      {visual === 'calendar' && <MiniCalendar />}
      {visual === 'team' && <MiniTeam />}
      {visual === 'focus' && <MiniFocus />}
    </div>
  </motion.article>
);

const MiniBoard = () => (
  <div className="mini-board">
    {['Backlog', 'Build', 'Done'].map((name, index) => (
      <div key={name}>
        <span>{name}</span>
        <motion.i layout className={`mini-ticket t-${index}`}></motion.i>
        <motion.i layout className={`mini-ticket t-${index + 1}`}></motion.i>
      </div>
    ))}
  </div>
);

const MiniCalendar = () => (
  <div className="mini-calendar">
    {Array.from({ length: 21 }).map((_, i) => <span key={i} className={i === 9 ? 'hot' : i === 15 ? 'done' : ''}>{i + 1}</span>)}
  </div>
);

const MiniTeam = () => (
  <div className="mini-team">
    {['AR', 'PN', 'JW', 'SM'].map((name, i) => <span key={name} style={{'--d': `${i * 0.08}s`}}>{name}</span>)}
    <div className="activity-preview">
      <p><b>Priya</b> attached launch-notes.pdf</p>
      <p><b>Jake</b> moved Navigation to Review</p>
      <p><b>Sofia</b> joined Product Studio</p>
    </div>
  </div>
);

const MiniFocus = () => (
  <div className="mini-focus">
    <div className="focus-orbit"><Clock3 size={34} /></div>
    <strong>59:59</strong>
    <span>Deep focus window</span>
  </div>
);

export const HowItWorks = () => (
  <section id="how-it-works" className="hiw-section cinematic-flow">
    <div className="section-label">A quieter operating rhythm</div>
    <h2 className="section-title">Capture, clarify, commit, complete.</h2>
    <div className="steps-row">
      {[
        {n:'01', t:'Capture the work', p:'Drop tasks into the right workspace before they become mental clutter.'},
        {n:'02', t:'Give it shape', p:'Assign ownership, priority, files, deadlines, and context in one place.'},
        {n:'03', t:'Protect attention', p:'Use views and focus mode to keep the team out of reactive loops.'},
        {n:'04', t:'Review progress', p:'Return to activity, files, and completion signals when you need proof.'}
      ].map((s) => (
        <div key={s.n} className="step-card">
          <div className="step-num">{s.n}</div>
          <h3>{s.t}</h3>
          <p>{s.p}</p>
        </div>
      ))}
    </div>
  </section>
);

export const Stats = () => (
  <section className="stats-section proof-section">
    {[
      ['1200+', 'hours of focused work reclaimed'],
      ['3.4×', 'faster project context recovery'],
      ['72%', 'fewer “where is this?” moments'],
      ['∞', 'calmer ways to ship meaningful work']
    ].map(([num, label]) => (
      <motion.div key={label} className="stat-item" initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.45 }}>
        <div className="stat-num">{num}</div><div className="stat-label">{label}</div>
      </motion.div>
    ))}
  </section>
);

export const Pricing = ({ onLaunch }) => {
  const tiers = [
    { name: 'Free', price: '$0', text: 'For personal clarity.', features: ['Personal productivity', 'Limited workspaces', 'Basic analytics'] },
    { name: 'Pro', price: '$12', text: 'For ambitious operators.', recommended: true, features: ['Advanced analytics', 'Unlimited projects', 'Premium focus mode', 'Advanced workspace controls'] },
    { name: 'Team', price: '$24', text: 'For collaborative momentum.', features: ['Team collaboration', 'Workspace management', 'Activity feeds', 'Future integrations'] }
  ];
  return (
    <section id="pricing" className="pricing-section">
      <div className="section-label reveal">Simple pricing</div>
      <h2 className="section-title reveal">Start calm. Scale when the team is ready.</h2>
      <div className="pricing-grid">
        {tiers.map(tier => (
          <motion.div key={tier.name} className={`pricing-card ${tier.recommended ? 'recommended' : ''}`} whileHover={{ y: -6 }} transition={{ duration: 0.18 }}>
            {tier.recommended && <span className="recommended-pill">Recommended</span>}
            <h3>{tier.name}</h3>
            <div className="price">{tier.price}<span>/mo</span></div>
            <p>{tier.text}</p>
            <ul>{tier.features.map(feature => <li key={feature}><Check size={15} />{feature}</li>)}</ul>
            <button className={tier.recommended ? 'btn-primary' : 'btn-ghost light'} onClick={onLaunch}>Choose {tier.name}</button>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export const LandingFooter = () => (
  <div className="land-footer"><p>© 2026 ProjectFlow · Calm productivity for teams that want clarity without ceremony.</p></div>
);
