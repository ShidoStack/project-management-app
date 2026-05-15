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

const CUSTOM_MEMBER_KEY = 'projectflow_custom_collaborators';

export const getCustomMembers = () => {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(window.localStorage.getItem(CUSTOM_MEMBER_KEY) || '[]');
  } catch {
    return [];
  }
};

export const saveCustomMember = (member) => {
  if (typeof window === 'undefined') return member;
  const members = getCustomMembers();
  const existing = members.find(m => m.id === member.id || m.name.toLowerCase() === member.name.toLowerCase());
  if (existing) return existing;
  const next = [...members, member];
  window.localStorage.setItem(CUSTOM_MEMBER_KEY, JSON.stringify(next));
  return member;
};

export const memberById = (id) => MEMBERS.find(m => m.id === id) || getCustomMembers().find(m => m.id === id);

export const formatFileSize = (bytes = 0) => {
  if (!bytes) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  const index = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  const value = bytes / (1024 ** index);
  return `${value >= 10 || index === 0 ? Math.round(value) : value.toFixed(1)} ${units[index]}`;
};
