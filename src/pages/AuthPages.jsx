import { Link, Navigate, useNavigate } from 'react-router-dom';
import { ArrowRight, LockKeyhole, Mail, UserRound } from 'lucide-react';
import { useApp } from '../context/AppContext';

const AuthShell = ({ eyebrow, title, subtitle, children, footer }) => (
  <div className="auth-page">
    <Link className="auth-brand" to="/">Project<span>Flow</span></Link>
    <div className="auth-panel">
      <div className="section-label">{eyebrow}</div>
      <h1>{title}</h1>
      <p>{subtitle}</p>
      {children}
      <div className="auth-footer">{footer}</div>
    </div>
  </div>
);

export const LoginPage = () => {
  const { isAuthenticated, login, toast, workspaces, currentWorkspaceId } = useApp();
  const navigate = useNavigate();

  if (isAuthenticated) {
    return <Navigate to={`/workspace/${currentWorkspaceId || workspaces[0]?.id || 'w-default'}`} replace />;
  }

  const onSubmit = (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const result = login({
      email: form.get('email'),
      password: form.get('password')
    });

    if (!result.ok) {
      toast(result.message, 'error');
      return;
    }

    navigate('/onboarding');
  };

  return (
    <AuthShell
      eyebrow="Welcome back"
      title="Sign in to your workspace"
      subtitle="Use the demo account or your locally created account to continue."
      footer={<span>New to ProjectFlow? <Link to="/signup">Create an account</Link></span>}
    >
      <form className="auth-form" onSubmit={onSubmit}>
        <label><Mail size={16} />Email<input name="email" type="email" defaultValue="alex@projectflow.local" required /></label>
        <label><LockKeyhole size={16} />Password<input name="password" type="password" defaultValue="projectflow" required /></label>
        <button className="btn-primary auth-submit" type="submit">Continue <ArrowRight size={16} /></button>
      </form>
    </AuthShell>
  );
};

export const SignupPage = () => {
  const { isAuthenticated, signup, toast } = useApp();
  const navigate = useNavigate();

  if (isAuthenticated) return <Navigate to="/onboarding" replace />;

  const onSubmit = (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const result = signup({
      name: form.get('name'),
      email: form.get('email'),
      password: form.get('password')
    });

    if (!result.ok) {
      toast(result.message, 'error');
      return;
    }

    navigate('/onboarding');
  };

  return (
    <AuthShell
      eyebrow="Start together"
      title="Create your ProjectFlow account"
      subtitle="This is a frontend-only mock account stored locally in your browser."
      footer={<span>Already have an account? <Link to="/login">Sign in</Link></span>}
    >
      <form className="auth-form" onSubmit={onSubmit}>
        <label><UserRound size={16} />Name<input name="name" placeholder="Alex Reed" required /></label>
        <label><Mail size={16} />Email<input name="email" type="email" placeholder="you@example.com" required /></label>
        <label><LockKeyhole size={16} />Password<input name="password" type="password" minLength="6" required /></label>
        <button className="btn-primary auth-submit" type="submit">Create account <ArrowRight size={16} /></button>
      </form>
    </AuthShell>
  );
};
