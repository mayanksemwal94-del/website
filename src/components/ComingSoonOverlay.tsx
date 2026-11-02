import type { ReactNode } from "react";
import ThreadLoom from "./ThreadLoom";

type ComingSoonOverlayProps = {
  label: string;
  children: ReactNode;
};

export default function ComingSoonOverlay({ label, children }: ComingSoonOverlayProps) {
  return (
    <div className="coming-soon-shell">
      <div className="coming-soon-blurred" aria-hidden="true" inert>
        {children}
      </div>
      <div className="coming-soon-overlay" role="status">
        <div className="coming-soon-panel">
          <div className="coming-soon-panel-head">
            <span className="eyebrow">{label}</span>
            <span className="coming-soon-state"><i aria-hidden="true" /> In the works</span>
          </div>
          <div className="coming-soon-panel-body">
            <div className="coming-soon-copy">
              <span className="coming-soon-kicker">The next collection</span>
              <strong className="coming-soon-title"><span>Coming </span><em>soon.</em></strong>
              <p>New pieces are taking shape.</p>
            </div>
            <div className="coming-soon-seal-wrap" aria-hidden="true">
              <div className="coming-soon-seal">
                <ThreadLoom />
                <span className="coming-soon-seal-star">✳</span>
                <span className="coming-soon-seal-text">On its way</span>
              </div>
              <span className="coming-soon-seal-hint">Move / tap</span>
            </div>
          </div>
          <div className="coming-soon-panel-foot">
            <span className="coming-soon-foot-rule" aria-hidden="true" />
            <span className="eyebrow">Stay tuned</span>
            <span className="coming-soon-foot-mark" aria-hidden="true">↗</span>
          </div>
        </div>
      </div>
    </div>
  );
}
