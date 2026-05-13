import React from 'react';
import { useApp } from '../../context/AppContext';
import { formatDate } from '../../utils/helpers';

export const CalendarView = () => {
  const { filteredTasks, calendarMonth, calendarYear, setCalendarMonth, setCalendarYear, setDetailModalTaskId } = useApp();
  
  const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  const firstDay = new Date(calendarYear, calendarMonth, 1).getDay();
  const daysInMonth = new Date(calendarYear, calendarMonth+1, 0).getDate();
  const daysInPrev = new Date(calendarYear, calendarMonth, 0).getDate();
  const todayStr = new Date().toISOString().slice(0,10);
  
  const colColors = {'p-critical':'#fde8ea','p-high':'#fde8d0','p-medium':'#fff3e0','p-low':'#d8f3dc'};
  const colText = {'p-critical':'#9b2335','p-high':'#b5500a','p-medium':'#c4531a','p-low':'#2d6a4f'};

  const nav = (dir) => {
    let nm = calendarMonth + dir;
    let ny = calendarYear;
    if (nm < 0) { nm = 11; ny--; }
    if (nm > 11) { nm = 0; ny++; }
    setCalendarMonth(nm);
    setCalendarYear(ny);
  };

  const cells = [];
  // Pad prev month
  for (let i=firstDay-1; i>=0; i--) {
    cells.push(<div key={'prev'+i} className="cal-day other-month"><span className="cal-day-num">{daysInPrev-i}</span></div>);
  }
  // This month
  for (let d=1; d<=daysInMonth; d++) {
    const ds = `${calendarYear}-${String(calendarMonth+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
    const dayTasks = filteredTasks.filter(t => t.deadline === ds);
    cells.push(
      <div key={d} className={`cal-day ${ds === todayStr ? 'today' : ''}`}>
        <span className="cal-day-num">{d}</span>
        {dayTasks.map(t => (
          <span key={t.id} className="cal-task-pill" 
                style={{background:colColors['p-'+t.priority], color:colText['p-'+t.priority]}}
                onClick={() => setDetailModalTaskId(t.id)} title={t.title}>
            {t.title}
          </span>
        ))}
      </div>
    );
  }
  // Pad next month
  const totalCellsSoFar = firstDay + daysInMonth;
  const endPad = totalCellsSoFar % 7 === 0 ? 0 : 7 - (totalCellsSoFar % 7);
  for (let d=1; d<=endPad; d++) {
    cells.push(<div key={'next'+d} className="cal-day other-month"><span className="cal-day-num">{d}</span></div>);
  }

  return (
    <div id="calendarView" className="calendar-view">
      <div className="cal-header">
        <div className="cal-nav">
          <button className="cal-nav-btn" onClick={() => nav(-1)}>←</button>
          <div className="cal-month-title">{monthNames[calendarMonth]} {calendarYear}</div>
          <button className="cal-nav-btn" onClick={() => nav(1)}>→</button>
        </div>
        <button className="btn btn-outline btn-sm" onClick={() => {
          setCalendarMonth(new Date().getMonth());
          setCalendarYear(new Date().getFullYear());
        }}>Today</button>
      </div>
      <div className="cal-grid">
        {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d => <div key={d} className="cal-day-name">{d}</div>)}
        {cells}
      </div>
    </div>
  );
};
