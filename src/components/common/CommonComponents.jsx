import { AnimatePresence, motion } from 'framer-motion';
import { Focus, Pause, Play, Square } from 'lucide-react';
import { useRef, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatFileSize } from '../../utils/helpers';

const DEEP_FOCUS_SECONDS = 59 * 60 + 59;

export const ToastContainer = () => {
  const { toasts } = useApp();
  return (
    <div className="toast-container">
      <AnimatePresence>
      {toasts.map(t => (
        <motion.div
          key={t.id}
          className={`toast ${t.out?'out':''}`}
          initial={{ opacity: 0, x: 28 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 28 }}
          transition={{ duration: 0.18, ease: 'easeOut' }}
        >
          <span className="toast-icon">{{info:'ℹ️', success:'✅', warn:'⚠️', error:'❌'}[t.type]||'ℹ️'}</span>{t.msg}
        </motion.div>
      ))}
      </AnimatePresence>
    </div>
  );
};

export const FocusModeBar = () => {
  const { focusActive, focusSeconds, focusPaused, setFocusPaused, setFocusActive, setFocusSeconds } = useApp();
  if (!focusActive) return null;
  
  const m = Math.floor(focusSeconds/60).toString().padStart(2,'0');
  const s = (focusSeconds%60).toString().padStart(2,'0');
  const stopFocus = () => {
    setFocusActive(false);
    setFocusPaused(false);
    setFocusSeconds(DEEP_FOCUS_SECONDS);
  };
  
  return (
    <motion.div className="focus-immersive" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className="focus-haze focus-haze-a"></div>
      <div className="focus-haze focus-haze-b"></div>
      <motion.div className="focus-shell" initial={{ y: 20, scale: 0.98 }} animate={{ y: 0, scale: 1 }} transition={{ duration: 0.24, ease: 'easeOut' }}>
        <span className="focus-eyebrow"><Focus size={16} /> Deep focus mode</span>
        <div className="focus-timer-xl">{m}:{s}</div>
        <p className="focus-quote">Make the next visible piece of progress. The rest can wait.</p>
        <div className="focus-actions">
          <button className="focus-btn pause" onClick={() => setFocusPaused(!focusPaused)}>
            {focusPaused ? <Play size={15} /> : <Pause size={15} />}
            {focusPaused ? 'Resume' : 'Pause'}
          </button>
          <button className="focus-btn stop" onClick={stopFocus}><Square size={14} /> Stop</button>
        </div>
      </motion.div>
    </motion.div>
  );
};

const readFileAsDataUrl = (file) => new Promise((resolve) => {
  const reader = new FileReader();
  reader.onload = () => resolve(reader.result);
  reader.onerror = () => resolve('');
  reader.readAsDataURL(file);
});

const fileToAttachment = async (file) => ({
  id: `${file.name}-${file.lastModified}-${file.size}`,
  name: file.name,
  size: formatFileSize(file.size),
  type: file.type || 'file',
  lastModified: file.lastModified,
  addedAt: new Date().toISOString(),
  url: await readFileAsDataUrl(file)
});

const getAttachmentIcon = (name = '') => {
  if (name.endsWith('.pdf')) return '📄';
  if (name.endsWith('.fig')) return '🎨';
  if (/\.(png|jpe?g|gif|webp|svg)$/i.test(name)) return '🖼️';
  return '📁';
};

const formatAttachmentDate = (value) => {
  if (!value) return '';
  return new Date(value).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
};

export const AttachmentList = ({ attachments = [], emptyText = 'No attachments yet', removable = false, onRemove }) => {
  if (!attachments.length) return <div className="attachment-empty">{emptyText}</div>;

  return (
    <div className="attachment-list">
      {attachments.map((attachment, index) => (
        <div key={attachment.id || `${attachment.name}-${index}`} className="attachment-pill">
          <span className="attach-icon">{getAttachmentIcon(attachment.name)}</span>
          <span className="attach-name">
            {attachment.name}
            {(attachment.source || attachment.status || attachment.addedAt) && (
              <span className="attach-context">
                {attachment.source && <span>{attachment.source}</span>}
                {attachment.status && <span>{attachment.status}</span>}
                {attachment.addedAt && <span>Added {formatAttachmentDate(attachment.addedAt)}</span>}
              </span>
            )}
          </span>
          <span className="attach-size">{attachment.size}</span>
          {attachment.url && (
            <>
              <a className="attachment-action" href={attachment.url} target="_blank" rel="noreferrer">View</a>
              <a className="attachment-action" href={attachment.url} download={attachment.name}>Download</a>
            </>
          )}
          {removable && (
            <button
              type="button"
              className="attachment-remove"
              onClick={(event) => {
                event.stopPropagation();
                onRemove?.(attachment.id, index);
              }}
              aria-label={`Remove ${attachment.name}`}
            >
              ✕
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export const AttachmentDropzone = ({ attachments = [], onChange, label = 'Attachments' }) => {
  const inputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  const addFiles = async (fileList) => {
    const incoming = await Promise.all(Array.from(fileList || []).map(fileToAttachment));
    if (!incoming.length) return;

    const seen = new Set(attachments.map(a => a.id || `${a.name}-${a.size}`));
    const next = [...attachments];
    incoming.forEach(file => {
      if (!seen.has(file.id)) {
        seen.add(file.id);
        next.push(file);
      }
    });
    onChange(next);
  };

  const onDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);
    addFiles(event.dataTransfer.files);
  };

  const removeAttachment = (id, index) => {
    onChange(attachments.filter((attachment, attachmentIndex) => (
      (attachment.id || attachmentIndex) !== (id || index)
    )));
  };

  return (
    <div className="form-group">
      <label className="form-label">{label}</label>
      <div
        className={`attachment-dropzone ${isDragging ? 'dragging' : ''}`}
        onDragEnter={(event) => { event.preventDefault(); setIsDragging(true); }}
        onDragOver={(event) => event.preventDefault()}
        onDragLeave={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) setIsDragging(false);
        }}
        onDrop={onDrop}
        role="button"
        tabIndex={0}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            inputRef.current?.click();
          }
        }}
      >
        <input
          ref={inputRef}
          className="attachment-file-input"
          type="file"
          multiple
          onChange={(event) => {
            addFiles(event.target.files);
            event.target.value = '';
          }}
        />
        <div className="attachment-drop-icon">📎</div>
        <div className="attachment-drop-copy">
          <strong>Drop files here</strong>
          <span>or click to browse from your device</span>
        </div>
      </div>
      {attachments.length > 0 && (
        <AttachmentList attachments={attachments} removable onRemove={removeAttachment} />
      )}
    </div>
  );
};
