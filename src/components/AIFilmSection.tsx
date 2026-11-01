import AIPortraitReveal from "./AIPortraitReveal";
import { aiPerspective } from "../lib/content";

export default function AIFilmSection() {
  const leftCopy = aiPerspective.body.slice(0, 3);
  const rightCopy = aiPerspective.body.slice(3);
  const renderCopy = (paragraphs: readonly string[], startIndex: number) => paragraphs.map((paragraph, index) => (
    <div className="ai-film-copy-item" key={paragraph}>
      <span className="ai-film-index" aria-hidden="true">{String(startIndex + index + 1).padStart(2, "0")}</span>
      <p>{paragraph}</p>
    </div>
  ));

  return (
    <section className="section ai-film-section" id="ai-film" aria-labelledby="ai-film-title">
      <div className="page-wrap">
        <div className="ai-film-layout">
          <header className="ai-film-intro">
            <p className="ai-film-kicker">AI / FILMMAKING</p>
            <h2 className="ai-film-title" id="ai-film-title">{aiPerspective.title}</h2>
          </header>
          <div className="ai-film-column ai-film-column-left">
            {renderCopy(leftCopy, 0)}
          </div>
          <div className="ai-film-column ai-film-column-right">
            {renderCopy(rightCopy, 3)}
          </div>
          <AIPortraitReveal />
        </div>
      </div>
    </section>
  );
}
