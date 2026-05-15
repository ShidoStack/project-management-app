import { useApp } from '../../context/AppContext';

export const NotificationPanel = () => {
  const { notifPanelOpen, notifications, setNotifications, toast } = useApp();
  if (!notifPanelOpen) return null;

  return (
    <div className="notif-panel open">
      <div className="notif-header">
        <span className="notif-title">Notifications</span>
        <button className="btn btn-sm btn-outline" onClick={() => { setNotifications([]); toast('Notifications cleared'); }}>Clear all</button>
      </div>
      <div className="notif-list">
        {notifications.length === 0 && <div className="empty-state"><div className="es-icon">🔔</div><p>No notifications</p></div>}
        {notifications.map(n => (
          <div key={n.id} className={`notif-item ${n.read?'':'unread'}`}>
            <span className="notif-dot" style={{visibility:n.read?'hidden':'visible'}}></span>
            <div><div className="notif-text" dangerouslySetInnerHTML={{__html: n.text}}></div><div className="notif-time">{n.time}</div></div>
          </div>
        ))}
      </div>
    </div>
  );
};
