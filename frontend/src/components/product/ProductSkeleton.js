export default function ProductSkeleton() {
  return (
    <div className="myntra-card-wrap">
      <div className="myntra-card" style={{ pointerEvents: 'none' }}>
        {/* Image skeleton */}
        <div className="myntra-card-img-wrap skeleton-img-wrap">
          <div className="skeleton-block" style={{ width: '100%', height: '100%' }} />
        </div>
        {/* Body skeleton */}
        <div className="myntra-card-body">
          <div className="skeleton-block" style={{ height: '12px', width: '60%', marginBottom: '8px', borderRadius: 4 }} />
          <div className="skeleton-block" style={{ height: '14px', width: '85%', marginBottom: '8px', borderRadius: 4 }} />
          <div className="skeleton-block" style={{ height: '14px', width: '40%', marginBottom: '8px', borderRadius: 4 }} />
          <div className="skeleton-block" style={{ height: '10px', width: '50%', borderRadius: 4 }} />
        </div>
      </div>
    </div>
  );
}
