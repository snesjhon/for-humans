// Shared label rendering for all Trace components

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
      nodes.push(<span key={m.index} className="ps-label-arrow">→</span>);
    } else {
      nodes.push(<code key={m.index} className="dfh-code-inline ps-label-code">{m[0].slice(1, -1)}</code>);
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
    <div className="ps-label-block">
      {subject && <div className="ps-label-context">{subject}</div>}
      <div className="ps-label-actions">
        {actions.map((action, i) => (
          <div key={i} className="ps-label-action-row">
            <RichTokens text={action} />
          </div>
        ))}
      </div>
      {extras.length > 0 && (
        <div className="ps-label-extras">
          {extras.map((line, i) => (
            <div key={i} className="ps-label-sublabel">
              <RichTokens text={line} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
