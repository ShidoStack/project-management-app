import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, BriefcaseBusiness, CalendarDays, Check, Code2, GraduationCap, LayoutList, Palette, Plus, Sparkles, UsersRound } from 'lucide-react';
import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { getInitialProjects, MEMBERS } from '../data/initialData';

const workOptions = [
  { label: 'Development', icon: Code2, preview: 'Development Hub', detail: 'Roadmaps, bugs, reviews, and release work.' },
  { label: 'College', icon: GraduationCap, preview: 'Study Workspace', detail: 'Assignments, exams, group projects, and deadlines.' },
  { label: 'Startup', icon: BriefcaseBusiness, preview: 'Startup Team', detail: 'Launch plans, GTM work, investor prep, and team ops.' },
  { label: 'Design', icon: Palette, preview: 'Design Sprint', detail: 'Research, concepts, critique, production, and handoff.' },
  { label: 'Personal Productivity', icon: Sparkles, preview: 'Personal Clarity', detail: 'Focus blocks, errands, goals, and quiet progress.' }
];

const styleOptions = [
  { label: 'Kanban', icon: LayoutList, detail: 'Move work visually across stages.' },
  { label: 'Calendar', icon: CalendarDays, detail: 'Plan around dates and weekly rhythm.' },
  { label: 'List', icon: LayoutList, detail: 'Scan everything in one compact table.' },
  { label: 'Mixed', icon: Sparkles, detail: 'Start with the board and switch views as needed.' }
];

const themeOptions = [
  { label: 'Warm Professional', tone: '#c4531a', detail: 'ProjectFlow classic: cream paper, terracotta, editorial.' },
  { label: 'Minimal Light', tone: '#8b8a84', detail: 'Quieter surfaces with a cleaner productivity feel.' },
  { label: 'Dark Professional', tone: '#2b2621', detail: 'Focused contrast for late planning sessions.' }
];

const viewMap = {
  Kanban: 'board',
  Calendar: 'calendar',
  List: 'list',
  Mixed: 'board'
};

export const OnboardingPage = () => {
  const {
    isAuthenticated,
    onboardingComplete,
    completeOnboarding,
    createWorkspace,
    setCurrentView,
    currentWorkspaceId,
    workspaces
  } = useApp();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [inviteInput, setInviteInput] = useState('');
  const [answers, setAnswers] = useState({
    workType: 'Development',
    workStyle: 'Kanban',
    theme: 'Warm Professional',
    teammates: []
  });

  const selectedWork = workOptions.find(option => option.label === answers.workType) || workOptions[0];
  const progress = ((step + 1) / 4) * 100;

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (onboardingComplete && currentWorkspaceId) return <Navigate to={`/workspace/${currentWorkspaceId}`} replace />;

  const update = (key, value) => setAnswers(prev => ({ ...prev, [key]: value }));

  const addInvite = () => {
    const value = inviteInput.trim();
    if (!value) return;
    const invites = value.split(',').map(item => item.trim()).filter(Boolean);
    update('teammates', [...new Set([...answers.teammates, ...invites])]);
    setInviteInput('');
  };

  const removeInvite = (email) => {
    update('teammates', answers.teammates.filter(item => item !== email));
  };

  const finish = () => {
    const workspace = createWorkspace({
      name: selectedWork.preview,
      description: `A ${answers.theme.toLowerCase()} workspace tuned for ${answers.workStyle.toLowerCase()} planning.`,
      members: MEMBERS.slice(0, 2),
      projects: getInitialProjects().slice(0, 1),
      settings: {
        theme: answers.theme,
        preferredView: viewMap[answers.workStyle]
      }
    });
    completeOnboarding(answers);
    setCurrentView(viewMap[answers.workStyle]);
    navigate(`/workspace/${workspace.id}`);
  };

  const steps = [
    {
      eyebrow: 'Workspace shape',
      title: 'What kind of work keeps your team busy?',
      helper: 'Pick the closest pattern. ProjectFlow will tune the starter workspace around it.',
      body: <ChoiceGrid options={workOptions} value={answers.workType} onChange={value => update('workType', value)} />
    },
    {
      eyebrow: 'Planning rhythm',
      title: 'How do you naturally find your next move?',
      helper: 'This sets the first view you land in. You can still switch views anytime.',
      body: <ChoiceGrid options={styleOptions} value={answers.workStyle} onChange={value => update('workStyle', value)} />
    },
    {
      eyebrow: 'Workspace mood',
      title: 'Choose the tone your workspace should carry.',
      helper: 'Keep the familiar warm identity or pick a quieter planning surface.',
      body: <ThemeGrid options={themeOptions} value={answers.theme} onChange={value => update('theme', value)} />
    },
    {
      eyebrow: 'Collaboration',
      title: 'Who should be part of the first conversation?',
      helper: 'Invites are simulated locally for this frontend build, so you can safely experiment.',
      body: (
        <InviteComposer
          invites={answers.teammates}
          value={inviteInput}
          onValueChange={setInviteInput}
          onAdd={addInvite}
          onRemove={removeInvite}
        />
      )
    }
  ];

  return (
    <div className="onboarding-page cinematic-onboarding">
      <motion.div className="onboarding-shell" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, ease: 'easeOut' }}>
        <div className="onboarding-card">
          <div className="onboarding-progress">
            <span>Step {step + 1} of 4</span>
            <div className="onboarding-progress-track"><motion.div animate={{ width: `${progress}%` }} transition={{ duration: 0.25, ease: 'easeOut' }} /></div>
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              className="onboarding-step"
              initial={{ opacity: 0, x: 24, filter: 'blur(6px)' }}
              animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, x: -18, filter: 'blur(6px)' }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
            >
              <span className="onboarding-eyebrow">{steps[step].eyebrow}</span>
              <h1>{steps[step].title}</h1>
              <p className="onboarding-helper">{steps[step].helper}</p>
              {steps[step].body}
            </motion.div>
          </AnimatePresence>
          <div className="onboarding-actions">
            <button className="btn btn-outline" disabled={step === 0} onClick={() => setStep(prev => prev - 1)}>Back</button>
            {step < steps.length - 1 ? (
              <button className="btn btn-accent" onClick={() => setStep(prev => prev + 1)}>Continue <ArrowRight size={15} /></button>
            ) : (
              <button className="btn btn-accent" onClick={finish}>Create workspace <Plus size={15} /></button>
            )}
          </div>
        </div>
        <WorkspacePreview answers={answers} selectedWork={selectedWork} />
      </motion.div>
      {workspaces.length > 0 && (
        <button className="onboarding-skip" onClick={() => navigate(`/workspace/${currentWorkspaceId || workspaces[0]?.id}`)}>
          Skip for now
        </button>
      )}
    </div>
  );
};

const ChoiceGrid = ({ options, value, onChange }) => (
  <div className="choice-grid premium-choice-grid">
    {options.map(option => {
      const Icon = option.icon;
      return (
        <motion.button key={option.label} type="button" className={`choice-card ${value === option.label ? 'active' : ''}`} onClick={() => onChange(option.label)} whileHover={{ y: -3 }} whileTap={{ scale: 0.98 }}>
          <span className="choice-icon"><Icon size={18} /></span>
          <span>
            <strong>{option.label}</strong>
            <small>{option.detail}</small>
          </span>
          {value === option.label && <Check size={16} />}
        </motion.button>
      );
    })}
  </div>
);

const ThemeGrid = ({ options, value, onChange }) => (
  <div className="choice-grid theme-choice-grid">
    {options.map(option => (
      <motion.button key={option.label} type="button" className={`choice-card theme-choice ${value === option.label ? 'active' : ''}`} onClick={() => onChange(option.label)} whileHover={{ y: -3 }} whileTap={{ scale: 0.98 }}>
        <span className="theme-swatch" style={{ background: option.tone }}></span>
        <span>
          <strong>{option.label}</strong>
          <small>{option.detail}</small>
        </span>
        {value === option.label && <Check size={16} />}
      </motion.button>
    ))}
  </div>
);

const InviteComposer = ({ invites, value, onValueChange, onAdd, onRemove }) => (
  <div className="invite-step premium-invite-step">
    <div className="invite-hero">
      <UsersRound size={24} />
      <div>
        <strong>Invite collaborators when you are ready.</strong>
        <span>Add emails or names, separated by commas.</span>
      </div>
    </div>
    <div className="invite-input-row">
      <input value={value} onChange={event => onValueChange(event.target.value)} onKeyDown={event => event.key === 'Enter' && onAdd()} placeholder="aarav@studio.com, Priya" />
      <button type="button" onClick={onAdd}>Add</button>
    </div>
    <div className="invite-chip-list">
      <AnimatePresence initial={false}>
        {invites.map(invite => (
          <motion.button key={invite} type="button" className="invite-chip" onClick={() => onRemove(invite)} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}>
            {invite}<span>Remove</span>
          </motion.button>
        ))}
      </AnimatePresence>
      {!invites.length && <div className="invite-empty">Your first workspace can stay solo. Add teammates later from settings.</div>}
    </div>
  </div>
);

const WorkspacePreview = ({ answers, selectedWork }) => (
  <motion.aside className="workspace-preview" layout>
    <span className="preview-label">Your workspace preview</span>
    <h2>{selectedWork.preview}</h2>
    <p>{selectedWork.detail}</p>
    <div className="preview-board">
      {['Collect', 'Focus', 'Finish'].map((column, index) => (
        <div key={column} className="preview-column">
          <span>{column}</span>
          <motion.div layout className={`preview-task preview-task-${index}`}>
            <strong>{answers.workStyle} planning</strong>
            <small>{answers.theme}</small>
          </motion.div>
        </div>
      ))}
    </div>
    <div className="preview-meta">
      <span>{answers.teammates.length || 1} member{answers.teammates.length === 1 ? '' : 's'}</span>
      <span>{answers.workType}</span>
      <span>{answers.workStyle}</span>
    </div>
  </motion.aside>
);
