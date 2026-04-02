// Shared label rendering for all Trace components
import styles from './TraceLabel.module.css';

function parseLabel(raw: string): { subject: string | null; actions: string[] } {
  const colonAt = raw.indexOf(': ');
  if (colonAt === -1) return { subject: null, actions: [raw] };
  const subject = raw.slice(0, colonAt);
  const body    = raw.slice(colonAt + 2);
  const actions = body.split(/,\s+(?=[a-z])/);
  return { subject, actions };
}

const TOKEN_RE = /(`[^`]+`|→)/g;

function RichTokens({ text }: { text: string }) {
  const nodes: React.ReactNode[] = [];
  let last = 0;
  TOKEN_RE.lastIndex = 0;
  let m: RegExpExecArray | null;
  while ((m = TOKEN_RE.exec(text)) !== null) {
    if (m.index > last) nodes.push(text.slice(last, m.index));
    if (m[0] === '→') {
      nodes.push(<span key={m.index} className={styles.arrow}>→</span>);
    } else {
      nodes.push(<code key={m.index} className={`dfh-code-inline ${styles.code}`}>{m[0].slice(1, -1)}</code>);
    }
    last = m.index + m[0].length;
  }
  if (last < text.length) nodes.push(text.slice(last));
  return <>{nodes}</>;
}

export function TraceLabel({ raw }: { raw: string }) {
  const [primary, ...extras] = raw.split('\n');
  const { subject, actions } = parseLabel(primary);
  return (
    <div className={styles.block}>
      {subject && <div className={styles.context}>{subject}</div>}
      <div className={styles.actions}>
        {actions.map((action, i) => (
          <div key={i} className={styles.actionRow}>
            <RichTokens text={action} />
          </div>
        ))}
      </div>
      {extras.length > 0 && (
        <div className={styles.extras}>
          {extras.map((line, i) => (
            <div key={i} className={styles.sublabel}>
              <RichTokens text={line} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
