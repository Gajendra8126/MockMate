import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Database, Network, ArrowLeft, CheckCircle2, ChevronRight, LayoutGrid, Brain, Terminal, RefreshCw, Table, FileJson } from 'lucide-react';

const FEATURES_DATA = [
  {
    id: 'relational-integrity',
    title: 'Relational Integrity Engine',
    description: 'Maintain mathematically sound foreign key relationships across deeply nested datasets. Our engine ensures that randomly generated user IDs map perfectly to their corresponding transactional records without orphaned data.',
    icon: <Network className="w-8 h-8" />,
    color: 'text-brand-500',
    bgColor: 'bg-brand-500/10',
    borderColor: 'border-brand-500/20',
    details: [
      'Ensures referential integrity across all generated tables and collections.',
      'Intelligently distributes foreign keys to mimic real-world data patterns.',
      'Avoids orphan records and prevents constraint violation errors during database seeding.',
      'Configurable generation depth for complex nested relationships.'
    ]
  },
  {
    id: 'multi-source-sync',
    title: 'Multi-Source Sync',
    description: 'One-click deployment directly to your staging environments. Native support for major databases.',
    icon: <Database className="w-8 h-8" />,
    color: 'text-orange-400',
    bgColor: 'bg-orange-400/10',
    borderColor: 'border-orange-400/20',
    details: [
      'One-click export to standard JSON files for REST APIs and NoSQL databases.',
      'Generates bulk SQL INSERT statements compatible with PostgreSQL, MySQL, and SQLite.',
      'Direct MongoDB integration for instant cloud database seeding.',
      'Customizable export templates to match your specific system requirements.'
    ]
  },
  {
    id: 'ai-driven-schemas',
    title: 'AI-Driven Schemas',
    description: 'Describe your data structure in natural language, and let the Synthetic Intelligence generate the optimal schema blueprint.',
    icon: <Brain className="w-8 h-8" />,
    color: 'text-purple-400',
    bgColor: 'bg-purple-400/10',
    borderColor: 'border-purple-400/20',
    details: [
      'Supports natural language descriptions to generate Prisma, SQL, and JSON Schema definitions.',
      'Identifies primary keys, foreign keys, and unique constraints automatically.',
      'Resolves complex one-to-many and many-to-many relationships without manual intervention.',
      'Lightning-fast parsing engine optimized for massive schema files.'
    ]
  },
  {
    id: 'generation-console',
    title: 'Generation Console',
    description: 'Real-time terminal providing insights into the mock data generation process, resolving relationships, and executing batches.',
    icon: <Terminal className="w-8 h-8" />,
    color: 'text-green-400',
    bgColor: 'bg-green-400/10',
    borderColor: 'border-green-400/20',
    details: [
      'Multi-threaded generation process utilizes maximum CPU performance.',
      'Optimized memory footprint prevents browser or Node.js crashes on large datasets.',
      'Streams generated data directly to files for zero-delay exports.',
      'Batch processing capabilities for continuous integration pipelines.'
    ]
  }
];

const Features = () => {
  const { featureId } = useParams();
  const navigate = useNavigate();

  // Detail View
  if (featureId) {
    const feature = FEATURES_DATA.find((f) => f.id === featureId);

    if (!feature) {
      return (
        <main className="max-w-6xl mx-auto px-6 pt-32 pb-16 relative z-10 min-h-screen flex flex-col items-center justify-center">
          <div className="text-center space-y-6">
            <LayoutGrid className="w-16 h-16 text-gray-500 mx-auto opacity-50" />
            <h1 className="text-3xl font-bold text-gray-300">Feature not found</h1>
            <p className="text-gray-500">The feature you are looking for does not exist.</p>
            <button 
              onClick={() => navigate('/features')}
              className="inline-flex items-center gap-2 text-brand-400 hover:text-brand-300 transition-colors mt-4"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Features
            </button>
          </div>
        </main>
      );
    }

    return (
      <main className="max-w-5xl mx-auto px-6 pt-32 pb-16 relative z-10 min-h-screen">
        <button 
          onClick={() => navigate('/features')}
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-12 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Features
        </button>

        <div className="grid md:grid-cols-[1fr_400px] gap-12 items-start">
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className={`inline-flex p-4 rounded-2xl ${feature.bgColor} ${feature.color} border ${feature.borderColor}`}>
              {feature.icon}
            </div>
            
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
              {feature.title}
            </h1>
            
            <p className="text-xl text-gray-400 leading-relaxed">
              {feature.description}
            </p>

            <div className="pt-8 space-y-6">
              <h3 className="text-xl font-semibold text-gray-200">Capabilities</h3>
              <div className="space-y-4">
                {feature.details.map((detail, index) => (
                  <div key={index} className="flex items-start gap-3 p-4 rounded-xl bg-[var(--color-card)] border border-[var(--color-border)] hover:border-gray-600 transition-colors">
                    <CheckCircle2 className={`w-5 h-5 mt-0.5 flex-shrink-0 ${feature.color}`} />
                    <p className="text-gray-300">{detail}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="glassmorphism rounded-2xl p-8 border border-white/5 sticky top-32 animate-in fade-in slide-in-from-right-8 duration-700 delay-150">
            <h3 className="text-lg font-semibold mb-6">Explore More Features</h3>
            <div className="space-y-3">
              {FEATURES_DATA.filter(f => f.id !== featureId).map((f) => (
                <Link 
                  key={f.id}
                  to={`/features/${f.id}`}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-white/5 transition-colors group border border-transparent hover:border-white/10"
                >
                  <span className="text-gray-400 group-hover:text-white transition-colors">{f.title}</span>
                  <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-gray-400 transition-colors" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>
    );
  }

  // Index View - Landing Page for Features
  return (
    <main className="flex-grow flex flex-col pt-32 pb-32">
      <div className="text-center mb-4 px-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight leading-tight">
          Powerful <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-500 to-blue-500">Features</span>
        </h1>
        <p className="text-lg text-gray-400 max-w-2xl mx-auto mt-6">
          Everything you need to generate production-ready relational mock data in seconds. Designed for modern development teams.
        </p>
      </div>

      {/* Feature Bento Grid */}
      <section className="max-w-7xl mx-auto px-6 py-12 w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[minmax(280px,auto)]">
          {/* Card 1: Relational Integrity (Large) */}
          <Link to="/features/relational-integrity" className="md:col-span-2 bg-[var(--color-card)]/60 backdrop-blur-xl border border-[var(--color-border)] rounded-xl p-8 flex flex-col relative overflow-hidden group shadow-[inset_1px_1px_0px_rgba(255,255,255,0.05)] hover:shadow-brand-500/10 hover:border-brand-500/30 transition-all duration-300">
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/5 rounded-full blur-3xl -z-10 group-hover:bg-brand-500/10 transition-colors duration-500"></div>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-brand-500/20 rounded-lg text-brand-500 group-hover:scale-110 transition-transform duration-300">
                <Network className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-semibold text-white">Relational Integrity Engine</h3>
            </div>
            <p className="text-gray-400 mb-8 max-w-md leading-relaxed">
              Maintain mathematically sound foreign key relationships across deeply nested datasets. Our engine ensures that randomly generated user IDs map perfectly to their corresponding transactional records without orphaned data.
            </p>
            <div className="mt-auto flex items-center justify-between p-4 bg-[var(--color-card-hover)] border border-[var(--color-border)] rounded-lg">
              <div className="flex flex-col gap-1 font-mono text-sm text-gray-400">
                <div className="flex items-center gap-3">
                  <span className="text-orange-400">Users</span> 
                  <span className="w-12 h-[1.5px] bg-gray-600 relative"><span className="absolute right-0 -top-[3px] w-2 h-2 rounded-full bg-brand-500"></span></span> 
                  <span className="text-brand-500">Transactions</span>
                </div>
                <div className="text-[12px] opacity-70">1:N Relationship Maintained</div>
              </div>
              <CheckCircle2 className="w-6 h-6 text-brand-500 opacity-50 group-hover:opacity-100 transition-opacity" />
            </div>
          </Link>

          {/* Card 2: Multi-Source Sync (Small) */}
          <Link to="/features/multi-source-sync" className="col-span-1 bg-[var(--color-card)]/60 backdrop-blur-xl border border-[var(--color-border)] rounded-xl p-8 flex flex-col shadow-[inset_1px_1px_0px_rgba(255,255,255,0.05)] hover:shadow-orange-400/10 hover:border-orange-400/30 transition-all duration-300 group">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-orange-400/20 rounded-lg text-orange-400 group-hover:scale-110 transition-transform duration-300">
                <Database className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-semibold text-white">Multi-Source Sync</h3>
            </div>
            <p className="text-gray-400 mb-8 leading-relaxed">
              One-click deployment directly to your staging environments. Native support for major databases.
            </p>
            <div className="mt-auto flex flex-col gap-3">
              <div className="flex items-center justify-between px-4 py-3 bg-[var(--color-card-hover)]/50 rounded border border-[var(--color-border)]/50">
                <span className="font-mono text-sm text-white">PostgreSQL</span>
                <RefreshCw className="w-4 h-4 text-gray-400 group-hover:animate-spin" />
              </div>
              <div className="flex items-center justify-between px-4 py-3 bg-[var(--color-card-hover)]/50 rounded border border-[var(--color-border)]/50">
                <span className="font-mono text-sm text-white">MongoDB</span>
                <RefreshCw className="w-4 h-4 text-gray-400 group-hover:animate-spin" />
              </div>
            </div>
          </Link>

          {/* Card 3: AI-Driven Schemas (Small) */}
          <Link to="/features/ai-driven-schemas" className="col-span-1 bg-[var(--color-card)]/60 backdrop-blur-xl border border-[var(--color-border)] rounded-xl p-8 flex flex-col shadow-[inset_1px_1px_0px_rgba(255,255,255,0.05)] hover:shadow-purple-400/10 hover:border-purple-400/30 transition-all duration-300 group">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-purple-400/20 rounded-lg text-purple-400 group-hover:scale-110 transition-transform duration-300">
                <Brain className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-semibold text-white">AI-Driven Schemas</h3>
            </div>
            <p className="text-gray-400 mb-8 leading-relaxed">
              Describe your data structure in natural language, and let the Synthetic Intelligence generate the optimal schema blueprint.
            </p>
            <div className="mt-auto p-4 bg-[var(--color-card-hover)] rounded border border-purple-400/20 relative overflow-hidden">
              <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-purple-400"></div>
              <p className="font-mono text-[12px] text-gray-400 italic">"Generate a schema for an e-commerce platform with users, products, and nested order histories..."</p>
            </div>
          </Link>

          {/* Card 4: Real-time Terminal (Large) */}
          <Link to="/features/generation-console" className="md:col-span-2 bg-[var(--color-card-hover)] border border-[var(--color-border)] rounded-xl p-0 flex flex-col overflow-hidden shadow-xl hover:shadow-green-400/10 hover:border-green-400/30 transition-all duration-300 group">
            <div className="bg-[var(--color-card)] px-4 py-3 border-b border-[var(--color-border)] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-gray-400" />
                <span className="font-mono uppercase tracking-widest text-xs text-gray-400">Generation Console</span>
              </div>
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-400/50"></div>
                <div className="w-3 h-3 rounded-full bg-orange-400/50"></div>
                <div className="w-3 h-3 rounded-full bg-green-400/50"></div>
              </div>
            </div>
            <div className="p-6 font-mono text-[13px] leading-loose text-gray-400 overflow-y-auto h-[200px] flex flex-col bg-black/20">
              <div><span className="text-brand-500">[INFO]</span> Initializing schema build process...</div>
              <div><span className="text-brand-500">[INFO]</span> Resolving foreign key constraints for <span className="text-orange-400">public.orders</span> {'->'} <span className="text-orange-400">public.users</span></div>
              <div><span className="text-purple-400">[AI_SYS]</span> Optimizing data distribution for column 'status' (Gaussian curve applied)</div>
              <div><span className="text-brand-500">[INFO]</span> Generating batch 1/50 (20,000 records) <span className="text-white">████████░░ 80%</span></div>
              <div className="mt-auto flex items-center gap-2 text-green-400 group-hover:animate-pulse">
                <span>&gt;</span> <span className="w-2 h-4 bg-green-400 inline-block"></span>
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* Live Preview Section */}
      <section className="max-w-7xl mx-auto px-6 py-12 w-full mt-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-semibold text-white mb-4">Visual Schema Editor</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">Design structural logic visually while instantly previewing the generated JSON output.</p>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-6 bg-[var(--color-card)]/30 border border-[var(--color-border)]/50 rounded-xl p-4 md:p-6">
          {/* Left: Schema Editor View */}
          <div className="flex-1 bg-[var(--color-card)] border border-[var(--color-border)] rounded-lg overflow-hidden flex flex-col shadow-[inset_1px_1px_0px_rgba(255,255,255,0.05)]">
            <div className="px-6 py-4 bg-[var(--color-card-hover)]/50 border-b border-[var(--color-border)] flex items-center justify-between">
              <span className="font-mono uppercase tracking-widest text-xs text-white">Schema Logic</span>
              <FileJson className="w-4 h-4 text-gray-400" />
            </div>
            <div className="p-6 flex flex-col gap-4">
              <div className="bg-[var(--color-card-hover)] border border-[var(--color-border)] rounded p-4">
                <div className="flex items-center gap-3 mb-4 border-b border-[var(--color-border)] pb-3">
                  <Table className="w-5 h-5 text-brand-500" />
                  <span className="font-mono font-bold text-white">Users_Table</span>
                </div>
                <div className="flex flex-col gap-3 font-mono text-[13px]">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">id</span>
                    <span className="bg-brand-500/10 text-brand-500 px-2 py-0.5 rounded text-[11px] border border-brand-500/20">UUID (PK)</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">email_address</span>
                    <span className="bg-purple-400/10 text-purple-400 px-2 py-0.5 rounded text-[11px] border border-purple-400/20">AI: Mock Email</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">status</span>
                    <span className="bg-gray-600/20 text-gray-400 px-2 py-0.5 rounded text-[11px] border border-gray-600/30">Enum</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Generated Output View */}
          <div className="flex-1 bg-[#0a0f18] border border-[var(--color-border)] rounded-lg overflow-hidden flex flex-col shadow-inner">
            <div className="px-6 py-4 bg-[var(--color-card-hover)]/50 border-b border-[var(--color-border)] flex items-center justify-between">
              <span className="font-mono uppercase tracking-widest text-xs text-white">Live Output Preview</span>
              <span className="font-mono text-[11px] text-gray-400 bg-[var(--color-card)] px-2 py-0.5 rounded border border-[var(--color-border)]">JSON</span>
            </div>
            <div className="p-6 font-mono text-[13px] leading-relaxed overflow-x-auto">
              <pre className="text-gray-400"><span className="text-gray-500">{'{'}</span>
{'\n'}  <span className="text-brand-500">"data"</span><span className="text-gray-500">:</span> <span className="text-gray-500">{'['}</span>
{'\n'}    <span className="text-gray-500">{'{'}</span>
{'\n'}      <span className="text-brand-500">"id"</span><span className="text-gray-500">:</span> <span className="text-orange-400">"f47ac10b-58cc-4372-a567-0e02b2c3d479"</span>,
{'\n'}      <span className="text-brand-500">"email_address"</span><span className="text-gray-500">:</span> <span className="text-orange-400">"dev.ops@example.com"</span>,
{'\n'}      <span className="text-brand-500">"status"</span><span className="text-gray-500">:</span> <span className="text-orange-400">"ACTIVE"</span>,
{'\n'}      <span className="text-brand-500">"created_at"</span><span className="text-gray-500">:</span> <span className="text-orange-400">"2023-10-27T10:00:00Z"</span>
{'\n'}    <span className="text-gray-500">{'}'}</span>,
{'\n'}    <span className="text-gray-500">{'{'}</span>
{'\n'}      <span className="text-brand-500">"id"</span><span className="text-gray-500">:</span> <span className="text-orange-400">"a1b2c3d4-e5f6-7890-1234-567890abcdef"</span>,
{'\n'}      <span className="text-brand-500">"email_address"</span><span className="text-gray-500">:</span> <span className="text-orange-400">"test_user_99@domain.io"</span>,
{'\n'}      <span className="text-brand-500">"status"</span><span className="text-gray-500">:</span> <span className="text-orange-400">"PENDING"</span>,
{'\n'}      <span className="text-brand-500">"created_at"</span><span className="text-gray-500">:</span> <span className="text-orange-400">"2023-10-27T10:05:12Z"</span>
{'\n'}    <span className="text-gray-500">{'}'}</span>
{'\n'}  <span className="text-gray-500">{']'}</span>
{'\n'}<span className="text-gray-500">{'}'}</span>
              </pre>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Features;
