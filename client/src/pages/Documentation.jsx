import React from 'react';
import {
  Rocket,
  Network,
  Bot,
  SquareCode,
  CloudUpload,
  SquareTerminal,
  Database,
  Workflow,
  BrainCircuit,
  Boxes
} from 'lucide-react';

const cards = [
  {
    title: "VS Code Web Studio",
    description:
      "Manage schemas, inspect generated JSON, stream backend logs in real-time, and control the entire pipeline from a modern IDE-inspired interface.",
    icon: SquareCode,
    color: "blue"
  },
  {
    title: "Schema Introspection",
    description:
      "MockMate parses raw Mongoose schema files into ASTs to safely understand deeply nested structures and relationships without database execution.",
    icon: Network,
    color: "blue"
  },
  {
    title: "AI Semantic Mapping",
    description:
      "AI automatically maps schema fields to realistic Faker.js generators using semantic analysis powered by OpenRouter models.",
    icon: BrainCircuit,
    color: "purple"
  },
  {
    title: "Referential Integrity Engine",
    description:
      "Generate perfectly connected ObjectIds across collections with full support for ref and polymorphic refPath relationships.",
    icon: Workflow,
    color: "blue"
  },
  {
    title: "MongoDB Seeding",
    description:
      "Push generated datasets directly into local MongoDB instances or remote MongoDB Atlas clusters with bulk insertion.",
    icon: Database,
    color: "blue"
  },
  {
    title: "Dependency Graph Engine",
    description:
      "MockMate builds DAG execution schedules using topological sorting to guarantee safe generation order across collections.",
    icon: Boxes,
    color: "purple"
  }
];

const FeatureCard = ({
  title,
  description,
  icon: Icon,
  color
}) => {
  const isBlue = color === 'blue';

  const iconBg = isBlue
    ? 'bg-brand-500/20'
    : 'bg-purple-500/20';

  const iconColor = isBlue
    ? 'text-brand-500'
    : 'text-purple-400';

  return (
    <div className="bg-[var(--color-card)]/60 backdrop-blur-xl border border-[var(--color-border)] rounded-2xl p-6 flex flex-col hover:border-brand-500/30 transition-all duration-300 shadow-[inset_1px_1px_0px_rgba(255,255,255,0.05)] hover:shadow-brand-500/10 group hover:-translate-y-1">
      
      <div
        className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 ${iconBg} group-hover:scale-110 transition-transform duration-300`}
      >
        <Icon
          size={22}
          className={iconColor}
          strokeWidth={2}
        />
      </div>

      <h3 className="text-[var(--color-foreground)] font-semibold text-xl mb-3">
        {title}
      </h3>

      <p className="text-gray-400 text-[15px] leading-relaxed">
        {description}
      </p>
    </div>
  );
};

const QuickStart = () => {
  return (
    <div className="mt-10 bg-[var(--color-card)]/30 border border-[var(--color-border)] rounded-2xl overflow-hidden shadow-lg backdrop-blur-sm">
      
      {/* HEADER */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--color-border)] bg-[var(--color-card-hover)]/50">
        
        <div className="flex items-center gap-3">
          <SquareTerminal
            className="text-gray-400"
            size={22}
            strokeWidth={2}
          />

          <h2 className="text-[var(--color-foreground)] font-bold text-xl tracking-wide">
            Quick Start
          </h2>
        </div>

        <div className="bg-[var(--color-card)] border border-[var(--color-border)] text-gray-400 text-xs font-mono font-semibold px-2.5 py-1 rounded">
          WEB STUDIO
        </div>
      </div>

      {/* CONTENT */}
      <div className="p-6 font-mono text-[14px] leading-loose">
        
        <div className="mb-8">
          <p className="text-orange-400 opacity-80">
            # 1. Start the backend server
          </p>

          <p className="text-[var(--color-foreground)]">
            cd server && npm start
          </p>
        </div>

        <div className="mb-8">
          <p className="text-orange-400 opacity-80">
            # 2. Start the frontend client
          </p>

          <p className="text-[var(--color-foreground)]">
            cd client && npm run dev
          </p>
        </div>

        <div className="mb-8">
          <p className="text-orange-400 opacity-80">
            # 3. Upload your Mongoose schemas
          </p>

          <p className="text-[var(--color-foreground)]">
            Drag & drop schema files into{" "}
            <span className="text-brand-500">
              MockMate Studio
            </span>
          </p>
        </div>

        <div>
          <p className="text-orange-400 opacity-80">
            # 4. Generate realistic interconnected data
          </p>

          <p className="text-[var(--color-foreground)]">
            Configure rows → Generate → Download JSON or Seed MongoDB
          </p>
        </div>
      </div>
    </div>
  );
};

export default function Documentation() {
  return (
    <main className="flex-grow flex flex-col pt-32 pb-32">
      <div className="w-full max-w-7xl mx-auto px-6">

        {/* HERO */}
        <div className="mb-14 lg:mb-20 animate-in fade-in slide-in-from-bottom-8 duration-700">
          
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 text-brand-500 text-sm font-medium border border-brand-500/20 mb-6">
            <span className="w-2 h-2 rounded-full bg-pink-500"></span>
            <span>MockMate Engine v2.0</span>
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-tight mb-8">
            Get Started with MockMate
          </h1>

          <p className="text-gray-400 text-lg leading-relaxed mb-5 max-w-4xl">
            MockMate parses raw Mongoose schemas,
            builds dependency graphs mathematically,
            uses AI to infer realistic Faker.js mappings,
            and generates fully interconnected datasets
            with flawless referential integrity.
          </p>

          <p className="text-gray-400 text-lg leading-relaxed max-w-4xl">
            Upload schemas, inspect AI rulebooks,
            stream backend logs in real-time,
            and seed MongoDB Atlas clusters directly
            from the browser.
          </p>
        </div>

        {/* FEATURES GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-150">
          {cards.map((card, index) => (
            <FeatureCard
              key={index}
              title={card.title}
              description={card.description}
              icon={card.icon}
              color={card.color}
            />
          ))}
        </div>

        {/* HOW IT WORKS */}
        <div className="mt-20 mb-16">
          
          <h2 className="text-3xl md:text-4xl font-bold mb-10">
            How MockMate Works
          </h2>

          <div className="space-y-6">

            {[
              {
                step: "1",
                title: "AST Schema Parsing",
                desc: "MockMate reads Mongoose schemas as raw text and converts them into Abstract Syntax Trees using Acorn."
              },
              {
                step: "2",
                title: "AI Rulebook Generation",
                desc: "OpenRouter models analyze semantic field meaning and map them to executable Faker.js generators."
              },
              {
                step: "3",
                title: "Dependency Graph Sorting",
                desc: "Collections are transformed into DAGs and topologically sorted to guarantee safe generation order."
              },
              {
                step: "4",
                title: "Materialization Engine",
                desc: "Interconnected records are generated while ObjectIds are stored inside an in-memory registry."
              },
              {
                step: "5",
                title: "Reference Resolution",
                desc: "MockMate resolves both standard refs and polymorphic refPath relationships automatically."
              },
              {
                step: "6",
                title: "MongoDB Bulk Injection",
                desc: "Generated datasets are seeded directly into MongoDB using high-performance insertMany operations."
              }
            ].map((item) => (
              <div
                key={item.step}
                className="bg-[var(--color-card)]/40 border border-[var(--color-border)] rounded-2xl p-6 flex gap-5 hover:border-brand-500/20 transition-all"
              >
                <div className="w-12 h-12 rounded-xl bg-brand-500/10 flex items-center justify-center text-brand-500 font-bold text-lg flex-shrink-0">
                  {item.step}
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-2">
                    {item.title}
                  </h3>

                  <p className="text-gray-400 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}

          </div>
        </div>

        {/* QUICK START */}
        <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
          <QuickStart />
        </div>

      </div>
    </main>
  );
}