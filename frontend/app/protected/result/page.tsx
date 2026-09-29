"use client";

import LaserFlow from "@/components/laser";
import { useEffect, useRef, useState } from "react";

type Recommendation = {
  standard_number?: string;
  standard_name?: string;
  relevance?: string;
  explanation?: string;
  certification?: string | null;
  testing?: string[];
  amendments?: string[];
  relationships?: string[];
};

type RetrievedStandard = {
  standard_number?: string;
  standard_name?: string;
  standard_type?: string;
  department?: string;
  department_code?: string | null;
  committee?: string | null;
  technical_committee?: string | null;
  ics_code?: string | null;
  status?: string | null;
  is_active?: boolean | null;
  published_on?: string | null;
  review_on?: string | null;
  reaffirmation_year?: string | null;
  revision_count?: number | null;
  equivalence?: string | null;
  equivalent_is?: string | null;
  identical_is?: string | null;
  supersedes?: string | null;
  superseded_by?: string | null;
  certification_requirement?: string | null;
  bis_detail_url?: string | null;
  relationships?: Record<string, unknown>;
};

type BackendResponse = {
  query?: string;
  requirement_understanding?: string;
  recommendations?: Recommendation[];
  retrieved_standards?: RetrievedStandard[];
  notes?: string[];
};

export default function LaserFlowBoxExample() {
  const revealImgRef = useRef<HTMLImageElement>(null);

  const [result, setResult] = useState<BackendResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedResult = sessionStorage.getItem(
      "recommendation:result"
    );

    if (storedResult) {
      try {
        const parsedResult = JSON.parse(storedResult);
        setResult(parsedResult);
      } catch (error) {
        console.error(
          "Failed to parse recommendation result:",
          error
        );
      }
    }

    setLoading(false);
  }, []);

  return (
    <div
      style={{
        height: "800px",
        position: "relative",
        overflow: "hidden",
        backgroundColor: "#120F17",
      }}
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();

        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const el = revealImgRef.current;

        if (el) {
          el.style.setProperty("--mx", `${x}px`);
          el.style.setProperty(
            "--my",
            `${y + rect.height * 0.5}px`
          );
        }
      }}
      onMouseLeave={() => {
        const el = revealImgRef.current;

        if (el) {
          el.style.setProperty("--mx", "-9999px");
          el.style.setProperty("--my", "-9999px");
        }
      }}
    >
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

      {/* MAIN RESULT BOX */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "86%",
          height: "85%",
          backgroundColor: "#120F17",
          borderRadius: "20px",
          border: "2px solid #808080",
          color: "white",
          zIndex: 6,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* HEADER */}
        <div
          style={{
            padding: "24px 30px",
            borderBottom: "1px solid #444",
            flexShrink: 0,
          }}
        >
          <h1
            style={{
              margin: 0,
              fontSize: "28px",
              fontWeight: 700,
            }}
          >
            BIS Recommendation Results
          </h1>

          {result?.query && (
            <p
              style={{
                marginTop: "10px",
                marginBottom: 0,
                color: "#bdbdbd",
                fontSize: "15px",
              }}
            >
              Query: {result.query}
            </p>
          )}
        </div>

        {/* CONTENT */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "28px 30px",
          }}
        >
          {loading && (
            <div
              style={{
                textAlign: "center",
                padding: "50px 20px",
                color: "#aaa",
              }}
            >
              Loading results...
            </div>
          )}

          {!loading && !result && (
            <div
              style={{
                textAlign: "center",
                padding: "50px 20px",
                color: "#aaa",
              }}
            >
              No recommendation result found.
            </div>
          )}

          {!loading && result && (
            <>
              {/* REQUIREMENT UNDERSTANDING */}
              {result.requirement_understanding && (
                <section style={{ marginBottom: "30px" }}>
                  <h2 style={sectionTitleStyle}>
                    Requirement Understanding
                  </h2>

                  <div style={infoBoxStyle}>
                    {result.requirement_understanding}
                  </div>
                </section>
              )}

              {/* RECOMMENDATIONS */}
              {result.recommendations &&
                result.recommendations.length > 0 && (
                  <section style={{ marginBottom: "30px" }}>
                    <h2 style={sectionTitleStyle}>
                      Recommendations
                    </h2>

                    {result.recommendations.map(
                      (item, index) => (
                        <div
                          key={index}
                          style={cardStyle}
                        >
                          <h3
                            style={{
                              margin: 0,
                              fontSize: "20px",
                            }}
                          >
                            {item.standard_number ||
                              "Standard number unavailable"}
                          </h3>

                          {item.standard_name && (
                            <p
                              style={{
                                marginTop: "8px",
                                color: "#d0d0d0",
                                lineHeight: 1.5,
                              }}
                            >
                              {item.standard_name}
                            </p>
                          )}

                          {item.relevance && (
                            <div
                              style={{
                                marginTop: "14px",
                              }}
                            >
                              <strong>
                                Relevance:
                              </strong>{" "}
                              <span
                                style={{
                                  color: "#bdbdbd",
                                }}
                              >
                                {item.relevance}
                              </span>
                            </div>
                          )}

                          {item.explanation && (
                            <div
                              style={{
                                marginTop: "14px",
                              }}
                            >
                              <strong>
                                Explanation
                              </strong>

                              <p
                                style={{
                                  color: "#c7c7c7",
                                  lineHeight: 1.6,
                                }}
                              >
                                {item.explanation}
                              </p>
                            </div>
                          )}

                          <div
                            style={{
                              display: "grid",
                              gap: "14px",
                              marginTop: "18px",
                            }}
                          >
                            {/* CERTIFICATION */}
                            <DetailBlock
                              title="Certification"
                              value={
                                item.certification
                                  ? item.certification
                                  : "Not available"
                              }
                            />

                            {/* TESTING */}
                            <ListBlock
                              title="Testing"
                              items={item.testing}
                            />

                            {/* AMENDMENTS */}
                            <ListBlock
                              title="Amendments"
                              items={item.amendments}
                            />

                            {/* RELATIONSHIPS */}
                            <ListBlock
                              title="Related Standards"
                              items={
                                item.relationships
                              }
                            />
                          </div>
                        </div>
                      )
                    )}
                  </section>
                )}

              {/* RETRIEVED STANDARDS */}
              {result.retrieved_standards &&
                result.retrieved_standards.length > 0 && (
                  <section style={{ marginBottom: "30px" }}>
                    <h2 style={sectionTitleStyle}>
                      Retrieved Standards
                    </h2>

                    {result.retrieved_standards.map(
                      (standard, index) => (
                        <div
                          key={index}
                          style={cardStyle}
                        >
                          <h3
                            style={{
                              margin: 0,
                              fontSize: "19px",
                            }}
                          >
                            {standard.standard_number ||
                              "Standard number unavailable"}
                          </h3>

                          {standard.standard_name && (
                            <p
                              style={{
                                color: "#d0d0d0",
                                lineHeight: 1.5,
                              }}
                            >
                              {standard.standard_name}
                            </p>
                          )}

                          <div
                            style={{
                              display: "grid",
                              gap: "8px",
                              marginTop: "16px",
                            }}
                          >
                            <DetailBlock
                              title="Standard Type"
                              value={
                                standard.standard_type
                              }
                            />

                            <DetailBlock
                              title="Department"
                              value={
                                standard.department
                              }
                            />

                            <DetailBlock
                              title="Department Code"
                              value={
                                standard.department_code
                              }
                            />

                            <DetailBlock
                              title="Committee"
                              value={
                                standard.committee
                              }
                            />

                            <DetailBlock
                              title="Technical Committee"
                              value={
                                standard.technical_committee
                              }
                            />

                            <DetailBlock
                              title="ICS Code"
                              value={
                                standard.ics_code
                              }
                            />

                            <DetailBlock
                              title="Status"
                              value={
                                standard.status
                              }
                            />

                            <DetailBlock
                              title="Active"
                              value={
                                standard.is_active ===
                                null ||
                                standard.is_active ===
                                  undefined
                                  ? null
                                  : standard.is_active
                                    ? "Yes"
                                    : "No"
                              }
                            />

                            <DetailBlock
                              title="Published On"
                              value={
                                standard.published_on
                              }
                            />

                            <DetailBlock
                              title="Review On"
                              value={
                                standard.review_on
                              }
                            />

                            <DetailBlock
                              title="Reaffirmation Year"
                              value={
                                standard.reaffirmation_year
                              }
                            />

                            <DetailBlock
                              title="Revision Count"
                              value={
                                standard.revision_count
                              }
                            />

                            <DetailBlock
                              title="Certification Requirement"
                              value={
                                standard.certification_requirement
                              }
                            />

                            <DetailBlock
                              title="Supersedes"
                              value={
                                standard.supersedes
                              }
                            />

                            <DetailBlock
                              title="Superseded By"
                              value={
                                standard.superseded_by
                              }
                            />
                          </div>
                        </div>
                      )
                    )}
                  </section>
                )}

              {/* NOTES */}
              {result.notes &&
                result.notes.length > 0 && (
                  <section style={{ marginBottom: "20px" }}>
                    <h2 style={sectionTitleStyle}>
                      Notes
                    </h2>

                    {result.notes.map(
                      (note, index) => (
                        <div
                          key={index}
                          style={{
                            padding: "16px",
                            borderRadius: "10px",
                            backgroundColor:
                              "rgba(255,255,255,0.05)",
                            border:
                              "1px solid rgba(255,255,255,0.1)",
                            marginBottom: "10px",
                            color: "#d0d0d0",
                            lineHeight: 1.6,
                          }}
                        >
                          {note}
                        </div>
                      )
                    )}
                  </section>
                )}
            </>
          )}
        </div>
      </div>

      {/* REVEAL IMAGE */}
      <img
        ref={revealImgRef}
        src="/path/to/image.jpg"
        alt="Reveal effect"
        style={
          {
            position: "absolute",
            width: "100%",
            top: "-50%",
            zIndex: 5,
            mixBlendMode: "lighten",
            opacity: 0.3,
            pointerEvents: "none",
            "--mx": "-9999px",
            "--my": "-9999px",
            WebkitMaskImage:
              "radial-gradient(circle at var(--mx) var(--my), rgba(255,255,255,1) 0px, rgba(255,255,255,0.95) 60px, rgba(255,255,255,0.6) 120px, rgba(255,255,255,0.25) 180px, rgba(255,255,255,0) 240px)",
            maskImage:
              "radial-gradient(circle at var(--mx) var(--my), rgba(255,255,255,1) 0px, rgba(255,255,255,0.95) 60px, rgba(255,255,255,0.6) 120px, rgba(255,255,255,0.25) 180px, rgba(255,255,255,0) 240px)",
            WebkitMaskRepeat: "no-repeat",
            maskRepeat: "no-repeat",
          } as React.CSSProperties
        }
      />
    </div>
  );
}


/* =========================
   REUSABLE STYLES
========================= */

const sectionTitleStyle: React.CSSProperties = {
  fontSize: "21px",
  marginBottom: "14px",
  color: "#ffffff",
};

const infoBoxStyle: React.CSSProperties = {
  padding: "18px",
  borderRadius: "12px",
  backgroundColor: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.1)",
  color: "#d0d0d0",
  lineHeight: 1.6,
};

const cardStyle: React.CSSProperties = {
  padding: "20px",
  marginBottom: "16px",
  borderRadius: "14px",
  backgroundColor: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.12)",
};


/* =========================
   DETAIL COMPONENT
========================= */

function DetailBlock({
  title,
  value,
}: {
  title: string;
  value?: string | number | boolean | null;
}) {
  if (
    value === undefined ||
    value === null ||
    value === ""
  ) {
    return null;
  }

  return (
    <div>
      <strong>{title}:</strong>{" "}
      <span style={{ color: "#c7c7c7" }}>
        {String(value)}
      </span>
    </div>
  );
}


/* =========================
   LIST COMPONENT
========================= */

function ListBlock({
  title,
  items,
}: {
  title: string;
  items?: string[];
}) {
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <div>
      <strong>{title}:</strong>

      <ul
        style={{
          marginTop: "8px",
          paddingLeft: "20px",
          color: "#c7c7c7",
        }}
      >
        {items.map((item, index) => (
          <li
            key={index}
            style={{
              marginBottom: "5px",
            }}
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
