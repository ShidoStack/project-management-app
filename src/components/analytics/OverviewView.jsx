import React from 'react';
import { useApp } from '../../context/AppContext';
import { MEMBERS } from '../../data/initialData';
import { isOverdue } from '../../utils/helpers';

export const OverviewView = () => {
  const { projects, currentProject } = useApp();
  const allTasks = projects.flatMap(p => p.tasks);
  
  const total = allTasks.length;
  const done = allTasks.filter(t => t.column==='Done'||t.column==='Archive').length;
  const overdueCount = allTasks.filter(t => isOverdue(t.deadline) && t.column!=='Done').length;
  const critical = allTasks.filter(t => t.priority==='critical').length;
  
  const tasks = currentProject ? currentProject.tasks : [];
  const pData = ['critical','high','medium','low'].map(p => ({
    label: p, count: tasks.filter(t => t.priority===p).length,
    color: {critical:'#9b2335',high:'#b5500a',medium:'#c4531a',low:'#2d6a4f'}[p]
  }));
  const totalPri = pData.reduce((s,d)=>s+d.count,0);

  const buildDonut = () => {
    if (!totalPri) return null;
    const r = 45, cx = 60, cy = 60;
    const circ = 2 * Math.PI * r;
    let offset = 0;
    return pData.map((d, i) => {
      const dash = (d.count / totalPri) * circ;
      const gap = circ - dash;
      const seg = <circle key={i} cx={cx} cy={cy} r={r} fill="none" stroke={d.color} strokeWidth="18" strokeDasharray={`${dash} ${gap}`} strokeDashoffset={-offset} />;
      offset += dash;
      return seg;
    });
  };

  return (
    <div id="overviewView" className="overview-view">
      <div className="analytics-grid">
        <div className="analytic-card">
          <div className="a-value">{total}</div><div className="a-label">Total Tasks</div><div className="a-change up">↑ Across {projects.length} projects</div>
        </div>
        <div className="analytic-card">
          <div className="a-value">{done}</div><div className="a-label">Completed</div><div className="a-change up">↑ {total?Math.round(done/total*100):0}% completion rate</div>
        </div>
        <div className="analytic-card">
          <div className="a-value">{overdueCount}</div><div className="a-label">Overdue</div><div className="a-change overdue">↓ {overdueCount>0?'Needs attention':'✓ All on track'}</div>
        </div>
        <div className="analytic-card">
          <div className="a-value">{critical}</div><div className="a-label">Critical Tasks</div><div className="a-change up">↑ {critical>2?'Review urgency':'Manageable'}</div>
        </div>
      </div>
      <div className="analytics-charts">
        <div className="chart-card">
          <h3>Project Progress</h3>
          {projects.map(p => {
            const tot = p.tasks.length;
            const dn = p.tasks.filter(t => t.column==='Done'||t.column==='Archive').length;
            const pct = tot ? Math.round(dn/tot*100) : 0;
            return (
              <div key={p.id} style={{marginBottom:14}}>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:4}}>
                  <div style={{display:'flex',alignItems:'center',gap:8}}><span style={{width:8,height:8,borderRadius:'50%',background:p.color}}></span><span style={{fontSize:'0.8rem',fontWeight:600,color:'var(--ink)'}}>{p.name}</span></div>
                  <span style={{fontFamily:'var(--font-mono)',fontSize:'0.75rem',color:'var(--ink-light)'}}>{dn}/{tot} · {pct}%</span>
                </div>
                <div style={{height:8,background:'var(--paper-3)',borderRadius:4,overflow:'hidden'}}><div style={{height:'100%',width:pct+'%',background:p.color,borderRadius:4}}></div></div>
              </div>
            );
          })}
          <h3 style={{marginTop:20}}>Weekly Activity</h3>
          <div className="bar-chart">
            {[4,7,5,9,6,2,1].map((v, i) => (
              <div key={i} className="bar-wrap">
                <div className="bar" style={{height:Math.round(v/9*100)+'%', background:i===new Date().getDay()-1?'var(--accent)':'var(--paper-3)'}}></div>
                <span className="bar-label">{['Mon','Tue','Wed','Thu','Fri','Sat','Sun'][i]}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="chart-card">
          <h3>Priority Breakdown</h3>
          <div className="donut-wrap">
            <svg className="donut-svg" width="120" height="120" viewBox="0 0 120 120">{buildDonut()}</svg>
            <div className="donut-legend">
              {pData.map((d, i) => (
                <div key={i} className="legend-item">
                  <span className="legend-dot" style={{background:d.color}}></span><span className="legend-name">{d.label}</span><span className="legend-val">{d.count}</span>
                </div>
              ))}
            </div>
          </div>
          <h3 style={{marginTop:20}}>Team Workload</h3>
          {MEMBERS.map(m => {
            const cnt = tasks.filter(t => t.assignees?.includes(m.id)).length;
            return (
              <div key={m.id} style={{display:'flex',alignItems:'center',gap:8,marginBottom:8}}>
                <span className="task-avatar" style={{background:m.color,fontSize:'0.6rem'}}>{m.initials}</span>
                <span style={{fontSize:'0.8rem',flex:1,color:'var(--ink-3)'}}>{m.name.split(' ')[0]}</span>
                <div style={{width:80,height:6,background:'var(--paper-3)',borderRadius:3,overflow:'hidden'}}><div style={{height:'100%',width:Math.min(100,cnt*15)+'%',background:m.color}}></div></div>
                <span style={{fontFamily:'var(--font-mono)',fontSize:'0.72rem',color:'var(--ink-light)',width:16,textAlign:'right'}}>{cnt}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
