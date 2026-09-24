import { Link } from "react-router-dom";
import { AlertCircle, ArrowLeft } from 'lucide-react';
import MetaData from "./MetaData";

export default function NotFound() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', textAlign: 'center', padding: '2rem' }}>
      <MetaData title="Page Not Found" />
      <div style={{ background: 'var(--accent-light)', color: 'var(--accent)', padding: '2rem', borderRadius: '50%', marginBottom: '2rem' }}>
        <AlertCircle size={64} />
      </div>
      <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text)', marginBottom: '1rem', letterSpacing: '-0.5px' }}>
        404 - Page Not Found
      </h1>
      <p style={{ color: 'var(--muted)', fontSize: '1.1rem', maxWidth: '400px', marginBottom: '2.5rem', lineHeight: 1.6 }}>
        Oops! The page you're looking for doesn't exist, has been moved, or is temporarily unavailable.
      </p>
      <Link 
        to="/" 
        className="da-btn da-btn-primary" 
        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.8rem 2rem' }}
      >
        <ArrowLeft size={18} />
        Back to Homepage
      </Link>
    </div>
  );
}
