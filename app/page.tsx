import Image from "next/image";
import BrandCard from "./components/BrandCard";

const BRANDS = [
  { slug: "one-com",      displayName: "one.com",      logo: "/brand/one-com.svg",      ext: "svg" },
  { slug: "checkdomain",  displayName: "checkdomain",  logo: "/brand/checkdomain.svg",  ext: "svg" },
  { slug: "dogado",       displayName: "Dogado",        logo: "/brand/dogado.svg",        ext: "svg" },
  { slug: "metanet",      displayName: "Metanet",       logo: "/brand/metanet.svg",       ext: "svg" },
  { slug: "herold",       displayName: "Herold",        logo: null,                       ext: null  },
  { slug: "hostnet",      displayName: "Hostnet",       logo: "/brand/hostnet.svg",       ext: "svg" },
  { slug: "zoner",        displayName: "Zoner",         logo: "/brand/zoner.svg",         ext: "svg" },
  { slug: "uniweb",       displayName: "Uniweb",        logo: "/brand/uniweb.svg",        ext: "svg" },
  { slug: "webglobe",     displayName: "Webglobe",      logo: "/brand/webglobe.svg",      ext: "svg" },
  { slug: "alfahosting",  displayName: "Alfahosting",   logo: null,                       ext: null  },
  { slug: "easyname",     displayName: "Easyname",      logo: "/brand/easyname.svg",      ext: "svg" },
  { slug: "antagonist",   displayName: "Antagonist",    logo: "/brand/antagonist.png",    ext: "png" },
] as const;

const EXAMPLE_ROWS = [
  {
    section: "Domain Personnel",
    fields: [
      { label: "Name", value: "Anna Meier" },
      { label: "Title", value: "Hostmaster" },
      { label: "Department / Team", value: "Domain Operations" },
      { label: "Primary assignment", value: "Domain operations" },
      { label: "Tasks", value: "Primary contact for restores, transfers, registrant changes, abuse escalation, and GDPR requests." },
      { label: "% on domain work", value: "100%" },
    ],
  },
  {
    section: "Technical Resources",
    fields: [
      { label: "Name", value: "Erik Larsen" },
      { label: "Title", value: "Backend Developer" },
      { label: "Department / Team", value: "Platform / CTO Engineering" },
      { label: "Primary assignment", value: "Backend development for checkout and billing" },
      { label: "Tasks", value: "Maintains EPP integrations, implements registry changes, and troubleshoots failed transfers." },
      { label: "% on domain work", value: "30%" },
    ],
  },
  {
    section: "Operational Ownership",
    fields: [
      { label: "Question", value: "Registrant change" },
      { label: "Responsible", value: "Anna Meier, Hostmaster" },
      { label: "Notes", value: "Verifies identity by email and ID upload, then executes the change at the registry. Around 30 minutes per case." },
    ],
  },
  {
    section: "Registries & Suppliers",
    fields: [
      { label: "Registry / Wholesale registrar", value: "DENIC (.de)" },
      { label: "Type", value: "Direct accreditation" },
      { label: "Primary contact", value: "Anna Meier, Hostmaster" },
    ],
  },
  {
    section: "Communication & Governance",
    fields: [
      { label: "Question", value: "Internal escalation within the brand" },
      { label: "Responsible", value: "Anna Meier, Hostmaster" },
      { label: "Notes", value: "No formal channel exists yet; guidance is handled ad hoc." },
    ],
  },
];

export default function LandingPage() {
  return (
    <div style={{ backgroundColor: "var(--color-background)", color: "var(--color-text)" }} className="min-h-screen">

      {/* Header */}
      <header style={{ borderBottom: "1px solid #E7E5E4" }} className="sticky top-0 z-10 backdrop-blur-sm" aria-label="Site header">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <Image
            src="/brand/group-one-logo-dark.svg"
            alt="Group.one"
            width={120}
            height={32}
            priority
          />
          <span style={{ color: "var(--color-secondary)", fontSize: "0.8125rem", fontWeight: 500, letterSpacing: "0.04em" }} className="uppercase tracking-widest">
            Internal Tool
          </span>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-16 flex flex-col gap-16">

        {/* Hero */}
        <section className="flex flex-col gap-5 max-w-2xl">
          <p style={{ color: "var(--color-cta)", fontWeight: 600, fontSize: "0.8125rem", letterSpacing: "0.1em" }} className="uppercase">
            Group.one — Domain Operations
          </p>
          <h1 style={{ color: "var(--color-primary)", fontWeight: 700, fontSize: "clamp(2rem, 5vw, 3rem)", lineHeight: 1.1, letterSpacing: "-0.02em" }}>
            Domain Operations<br />Discovery
          </h1>
          <p style={{ color: "var(--color-secondary)", fontSize: "1.125rem", lineHeight: 1.7 }}>
            This questionnaire maps the current state of domain operations across all Group.one brands — identifying who does what, what exists, and where gaps are.
            It takes roughly <strong style={{ color: "var(--color-text)" }}>10 to 15 minutes</strong> to complete.
          </p>
        </section>

        {/* Instructions */}
        <section
          style={{ background: "white", borderRadius: 16, padding: "2rem", boxShadow: "var(--shadow-md)" }}
          aria-labelledby="instructions-heading"
        >
          <h2 id="instructions-heading" style={{ color: "var(--color-primary)", fontWeight: 700, fontSize: "1.125rem", marginBottom: "1.25rem" }}>
            How to complete this questionnaire
          </h2>
          <ul style={{ display: "flex", flexDirection: "column", gap: "0.75rem", listStyle: "none", padding: 0, margin: 0 }}>
            {[
              "Select your brand below to open the questionnaire for that brand.",
              "Include people who regularly perform, decide on, or are accountable for domain-related tasks.",
              "Do not include occasional customer-facing support staff.",
              "Work through all six sections. Each section autosaves as you type.",
              "Submit when done. A submitted response is locked and cannot be edited.",
            ].map((item, i) => (
              <li key={i} style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
                <span
                  style={{
                    flexShrink: 0,
                    width: 24,
                    height: 24,
                    borderRadius: "50%",
                    background: "var(--color-cta)",
                    color: "white",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    marginTop: 2,
                  }}
                >
                  {i + 1}
                </span>
                <span style={{ color: "var(--color-secondary)", lineHeight: 1.6 }}>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Blank-answer guidance */}
        <section
          style={{
            borderLeft: "4px solid var(--color-cta)",
            background: "#FFFBEB",
            borderRadius: "0 12px 12px 0",
            padding: "1.5rem 2rem",
          }}
          aria-labelledby="blank-heading"
        >
          <h2 id="blank-heading" style={{ color: "#92400E", fontWeight: 700, fontSize: "1rem", marginBottom: "0.5rem" }}>
            Blank answers are valuable
          </h2>
          <p style={{ color: "#78350F", lineHeight: 1.7, margin: 0 }}>
            There are no wrong answers. If a responsibility is unassigned, a process does not exist, or you are unsure who owns something —
            leave the field blank. Blank fields are stored faithfully and interpreted as <strong>missing ownership</strong>, <strong>missing process</strong>,
            or <strong>missing resource</strong>. They are just as useful as filled answers for identifying gaps.
          </p>
        </section>

        {/* Example preview */}
        <section aria-labelledby="example-heading">
          <h2 id="example-heading" style={{ color: "var(--color-primary)", fontWeight: 700, fontSize: "1.125rem", marginBottom: "1rem" }}>
            What the form looks like — example entries
          </h2>
          <p style={{ color: "var(--color-secondary)", marginBottom: "1.5rem", lineHeight: 1.6 }}>
            These are illustrative examples only. The real form starts blank for each brand.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {EXAMPLE_ROWS.map((ex) => (
              <div
                key={ex.section}
                style={{
                  background: "white",
                  borderRadius: 12,
                  padding: "1.25rem 1.5rem",
                  boxShadow: "var(--shadow-sm)",
                  border: "1px solid #F5F5F4",
                }}
              >
                <p style={{ fontWeight: 600, fontSize: "0.75rem", color: "var(--color-cta)", letterSpacing: "0.07em", textTransform: "uppercase", marginBottom: "0.75rem" }}>
                  {ex.section}
                </p>
                <dl style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "0.5rem 1.5rem", margin: 0 }}>
                  {ex.fields.map((f) => (
                    <div key={f.label}>
                      <dt style={{ fontSize: "0.6875rem", fontWeight: 600, color: "#A8A29E", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 2 }}>
                        {f.label}
                      </dt>
                      <dd style={{ fontSize: "0.875rem", color: "var(--color-secondary)", margin: 0, lineHeight: 1.5 }}>
                        {f.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            ))}
          </div>
        </section>

        {/* Brand picker */}
        <section aria-labelledby="brand-heading">
          <h2 id="brand-heading" style={{ color: "var(--color-primary)", fontWeight: 700, fontSize: "1.125rem", marginBottom: "0.5rem" }}>
            Select your brand to begin
          </h2>
          <p style={{ color: "var(--color-secondary)", marginBottom: "1.5rem", lineHeight: 1.6 }}>
            Each brand has its own separate questionnaire. Select yours below.
          </p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
              gap: "1rem",
            }}
          >
            {BRANDS.map((brand) => (
              <BrandCard
                key={brand.slug}
                slug={brand.slug}
                displayName={brand.displayName}
                logo={brand.logo ?? null}
              />
            ))}
          </div>
        </section>
      </main>

      <footer style={{ borderTop: "1px solid #E7E5E4", marginTop: "4rem" }}>
        <div className="max-w-5xl mx-auto px-6 py-8">
          <p style={{ color: "#A8A29E", fontSize: "0.8125rem", textAlign: "center" }}>
            Group.one — Domain Operations Discovery — Internal use only
          </p>
        </div>
      </footer>
    </div>
  );
}
