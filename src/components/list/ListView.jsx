import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { formatDate, isOverdue, getTagClass, memberById } from '../../utils/helpers';

export const ListView = () => {
  const { filteredTasks, setDetailModalTaskId } = useApp();
  const [sortField, setSortField] = useState('title');

  const sortedTasks = useMemo(() => {
    const pOrder = {critical:0,high:1,medium:2,low:3};
    return [...filteredTasks].sort((a,b) => {
      if (sortField==='priority') return pOrder[a.priority]-pOrder[b.priority];
      if (sortField==='deadline') return (a.deadline||'9999')>(b.deadline||'9999')?1:-1;
      if (sortField==='title') return a.title.localeCompare(b.title);
      if (sortField==='column') return a.column.localeCompare(b.column);
      return 0;
    });
  }, [filteredTasks, sortField]);

  return (
    <div id="listView" className="list-view">
      <table className="list-table">
        <thead>
          <tr>
            <th onClick={() => setSortField('title')}>Task ↕</th>
            <th onClick={() => setSortField('priority')}>Priority ↕</th>
            <th onClick={() => setSortField('column')}>Status ↕</th>
            <th onClick={() => setSortField('deadline')}>Deadline ↕</th>
            <th>Assigned</th>
            <th>Tag</th>
          </tr>
        </thead>
        <tbody>
          {sortedTasks.map(t => (
            <tr key={t.id} onClick={() => setDetailModalTaskId(t.id)}>
              <td style={{maxWidth:280}}>
                <div style={{fontWeight:600,color:'var(--ink)'}}>{t.title}</div>
                {t.desc && <div style={{fontSize:'0.75rem',color:'var(--ink-light)',marginTop:2}}>{t.desc.slice(0,60)}...</div>}
              </td>
              <td><span className={`task-priority p-${t.priority}`} style={{margin:0}}>{t.priority}</span></td>
              <td><span style={{fontSize:'0.8rem',color:'var(--ink-3)'}}>{t.column}</span></td>
              <td><span className={`task-date ${isOverdue(t.deadline)?'overdue':''}`} style={{fontFamily:'var(--font-mono)',fontSize:'0.78rem'}}>{t.deadline?formatDate(t.deadline):'—'}</span></td>
              <td>
                <div style={{display:'flex',gap:-4}}>
                  {(t.assignees||[]).map(mid => {const m=memberById(mid); return m && <span key={mid} className="task-avatar" style={{background:m.color,fontSize:'0.55rem',width:22,height:22}} title={m.name}>{m.initials}</span>})}
                </div>
              </td>
              <td>{t.tag && <span className={`task-tag ${getTagClass(t.tag)}`}>{t.tag}</span>}</td>
            </tr>
          ))}
          {filteredTasks.length === 0 && <tr><td colSpan="6"><div className="empty-state"><div className="es-icon">📋</div><p>No tasks found</p></div></td></tr>}
        </tbody>
      </table>
    </div>
  );
};
