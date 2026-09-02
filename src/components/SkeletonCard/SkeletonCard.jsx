import "./SkeletonCard.css";

export function SkeletonCard({ count = 3 }) {
  return (
    <div className="mba-skeleton-list" aria-hidden="true">
      {Array.from({ length: count }).map((_, index) => (
        <div className="mba-skeleton" key={index}>
          <span className="mba-skeleton__line mba-skeleton__line--sm" />
          <span className="mba-skeleton__line mba-skeleton__line--lg" />
          <span className="mba-skeleton__line mba-skeleton__line--md" />
        </div>
      ))}
    </div>
  );
}
