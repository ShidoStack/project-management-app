import { MEMBERS } from '../data/initialData';

export const formatDate = (s) => {
  if (!s) return '';
  const d = new Date(s + 'T00:00:00');
  return d.toLocaleDateString('en-GB', { day:'numeric', month:'short' });
};

export const isOverdue = (s) => {
  if (!s) return false;
  return new Date(s + 'T23:59:59') < new Date();
};

export const isDueToday = (s) => {
  if (!s) return false;
  return s === new Date().toISOString().slice(0,10);
};

export const isDueSoon = (s) => {
  if (!s) return false;
  const d = new Date(s + 'T00:00:00');
  const now = new Date();
  const diff = (d - now) / (1000*60*60*24);
  return diff >= 0 && diff <= 3;
};

export const getTagClass = (tag) => {
  const map = { design:'tag-design', dev:'tag-dev', marketing:'tag-marketing', research:'tag-research', bug:'tag-bug', feature:'tag-feature', content:'tag-content' };
  return map[tag] || 'tag-research';
};

export const uid = () => 't' + Date.now() + Math.random().toString(36).slice(2,6);
export const pid = () => 'p' + Date.now();

export const memberById = (id) => MEMBERS.find(m => m.id === id);
