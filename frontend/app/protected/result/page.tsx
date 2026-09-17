"use client";
import LaserFlow from '@/components/laser';
import { useRef, useState } from 'react';

interface Recommendation {
  standard_number: string;
  standard_name: string;
  relevance: string;
  explanation: string;
  certification: string | null;
  testing: string[];
  amendments: string[];
  relationships: string[];
}

interface ApiResponse {
  query: string;
  requirement_understanding: string;
  recommendations: Recommendation[];
  retrieved_standards: any[];
  notes: string[];
}

export default function LaserFlowBoxExample() {
  const revealImgRef = useRef<HTMLImageElement>(null);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ApiResponse | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('http://127.0.0.1:8000/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      });
      if (!res.ok) throw new Error(`Request failed: ${res.status}`);
      const data: ApiResponse = await res.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message ?? 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '800px',
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: '#120F17',
        paddingBottom: '4rem',
      }}
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const el = revealImgRef.current;
        if (el) {
          el.style.setProperty('--mx', `${x}px`);
          el.style.setProperty('--my', `${y + rect.height * 0.5}px`);
        }
      }}
      onMouseLeave={() => {
        const el = revealImgRef.current;
        if (el) {
          el.style.setProperty('--mx', '-9999px');
          el.style.setProperty('--my', '-9999px');
        }
      }}
    >
      <div style={{ height: '800px', position: 'relative' }}>
        <LaserFlow
          horizontalBeamOffset={0.1}
          verticalBeamOffset={0.0}
          color="#808080"
          horizontalSizing={0.5}
          verticalSizing={2}
          wispDensity={1}
          wispSpeed={15}
          wispIntensity={5}
          flowSpeed={0.35}
          flowStrength={0.25}
          fogIntensity={0.45}
          fogScale={0.3}
          fogFallSpeed={0.6}
          decay={1.1}
          falloffStart={1.2}
        />

        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '86%',
            height: '85%',
            backgroundColor: '#120F17',
            borderRadius: '20px',
            border: '2px solid #808080',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            zIndex: 6,
            padding: '2rem',
          }}
        >
          <h1 style={{ fontSize: '2rem', marginBottom: '1.5rem', textAlign: 'center' }}>
            BIS Standards Finder
          </h1>
          <form
            onSubmit={handleSearch}
            style={{ display: 'flex', gap: '0.75rem', width: '100%', maxWidth: '500px' }}
          >
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g. concrete block"
              style={{
                flex: 1,
                padding: '0.75rem 1rem',
                borderRadius: '10px',
                border: '1px solid #808080',
                backgroundColor: '#1a1620',
                color: 'white',
                fontSize: '1rem',
                outline: 'none',
              }}
            />
            <button
              type="submit"
              disabled={loading}
              style={{
                padding: '0.75rem 1.5rem',
                borderRadius: '10px',
                border: '1px solid #808080',
                backgroundColor: loading ? '#333' : '#808080',
                color: '#120F17',
                fontWeight: 600,
                cursor: loading ? 'not-allowed' : 'pointer',
              }}
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
          </form>
          {error && (
            <p style={{ color: '#ff6b6b', marginTop: '1rem' }}>{error}</p>
          )}
        </div>

        <img
          ref={revealImgRef}
          src="/path/to/image.jpg"
          alt="Reveal effect"
          style={{
            position: 'absolute',
            width: '100%',
            top: '-50%',
            zIndex: 5,
            mixBlendMode: 'lighten',
            opacity: 0.3,
            pointerEvents: 'none',
            '--mx': '-9999px',
            '--my': '-9999px',
            WebkitMaskImage:
              'radial-gradient(circle at var(--mx) var(--my), rgba(255,255,255,1) 0px, rgba(255,255,255,0.95) 60px, rgba(255,255,255,0.6) 120px, rgba(255,255,255,0.25) 180px, rgba(255,255,255,0) 240px)',
            maskImage:
              'radial-gradient(circle at var(--mx) var(--my), rgba(255,255,255,1) 0px, rgba(255,255,255,0.95) 60px, rgba(255,255,255,0.6) 120px, rgba(255,255,255,0.25) 180px, rgba(255,255,255,0) 240px)',
            WebkitMaskRepeat: 'no-repeat',
            maskRepeat: 'no-repeat',
          } as React.CSSProperties}
        />
      </div>

      {/* Results grid */}
      {result && (
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1.5rem 0' }}>
          {result.requirement_understanding && (
            <p style={{ color: '#ccc', marginBottom: '1.5rem', fontStyle: 'italic' }}>
              {result.requirement_understanding}
            </p>
          )}

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: '1.25rem',
            }}
          >
            {result.recommendations.map((rec, i) => (
              <div
                key={i}
                style={{
                  backgroundColor: '#1a1620',
                  border: '1px solid #808080',
                  borderRadius: '14px',
                  padding: '1.25rem',
                  color: 'white',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.6rem',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <span style={{ fontWeight: 700, fontSize: '1rem' }}>{rec.standard_number}</span>
                  {rec.relevance && (
                    <span
                      style={{
                        fontSize: '0.7rem',
                        textTransform: 'uppercase',
                        border: '1px solid #808080',
                        borderRadius: '999px',
                        padding: '0.15rem 0.6rem',
                        color: '#ccc',
                      }}
                    >
                      {rec.relevance}
                    </span>
                  )}
                </div>

                <p style={{ fontSize: '0.9rem', color: '#eee', margin: 0 }}>{rec.standard_name}</p>

                {rec.explanation && (
                  <p style={{ fontSize: '0.85rem', color: '#aaa', margin: 0 }}>{rec.explanation}</p>
                )}

                <div style={{ fontSize: '0.8rem', color: '#bbb' }}>
                  <strong>Certification:</strong> {rec.certification ?? 'None'}
                </div>

                {rec.amendments?.length > 0 && (
                  <div style={{ fontSize: '0.8rem', color: '#bbb' }}>
                    <strong>Amendments:</strong>
                    <ul style={{ margin: '0.25rem 0 0', paddingLeft: '1.1rem' }}>
                      {rec.amendments.map((a, j) => (
                        <li key={j}>{a}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {rec.relationships?.length > 0 && (
                  <details style={{ fontSize: '0.8rem', color: '#bbb' }}>
                    <summary style={{ cursor: 'pointer', color: '#ddd' }}>
                      Related standards ({rec.relationships.length})
                    </summary>
                    <ul style={{ margin: '0.5rem 0 0', paddingLeft: '1.1rem' }}>
                      {rec.relationships.map((r, j) => (
                        <li key={j}>{r}</li>
                      ))}
                    </ul>
                  </details>
                )}
              </div>
            ))}
          </div>

          {result.notes?.length > 0 && (
            <div
              style={{
                marginTop: '2rem',
                backgroundColor: '#1a1620',
                border: '1px solid #444',
                borderRadius: '14px',
                padding: '1.25rem',
                color: '#bbb',
              }}
            >
              <strong style={{ color: 'white' }}>Notes</strong>
              <ul style={{ margin: '0.5rem 0 0', paddingLeft: '1.1rem' }}>
                {result.notes.map((n, i) => (
                  <li key={i} style={{ fontSize: '0.85rem' }}>{n}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}