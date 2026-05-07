import React from 'react';
import { Rocket, Network, Bot, SquareCode, CloudUpload, SquareTerminal } from 'lucide-react';

const cards = [
  {
    title: "Getting Started",
    description: "Install DataForge, configure your first workspace, and run your initial mock generation.",
    icon: Rocket,
    color: "blue"
  },
  {
    title: "Schema Definition",
    description: "Learn the syntax for defining complex relational tables, constraints, and data types.",
    icon: Network,
    color: "blue"
  },
  {
    title: "AI Configuration",
    description: "Tune the generative models for domain-specific vocabulary and realistic statistical distributions.",
    icon: Bot,
    color: "purple"
  },
  {
    title: "API Reference",
    description: "Detailed documentation of REST endpoints, authentication, and webhook integrations.",
    icon: SquareCode,
    color: "blue"
  },
  {
    title: "Deployment",
    description: "Guides for pushing schemas to PostgreSQL, MySQL, and integrating with CI/CD pipelines.",
    icon: CloudUpload,
    color: "blue"
  }
];

const FeatureCard = ({ title, description, icon: Icon, color }) => {
  const isBlue = color === 'blue';
  
  const iconBg = isBlue ? 'bg-brand-500/20' : 'bg-purple-500/20';
  const iconColor = isBlue ? 'text-brand-500' : 'text-purple-400';

  return (
    <div className="bg-[var(--color-card)]/60 backdrop-blur-xl border border-[var(--color-border)] rounded-xl p-6 flex flex-col hover:border-brand-500/30 transition-all duration-300 shadow-[inset_1px_1px_0px_rgba(255,255,255,0.05)] hover:shadow-brand-500/10 group">
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-5 ${iconBg} group-hover:scale-110 transition-transform duration-300`}>
        <Icon size={20} className={iconColor} strokeWidth={2} />
      </div>
      <h3 className="text-[var(--color-foreground)] font-semibold text-lg mb-2">{title}</h3>
      <p className="text-gray-400 text-[15px] leading-relaxed">{description}</p>
    </div>
  );
};

const QuickStart = () => {
  return (
    <div className="mt-8 bg-[var(--color-card)]/30 border border-[var(--color-border)] rounded-xl overflow-hidden shadow-lg backdrop-blur-sm">
      {/* Header Area */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--color-border)] bg-[var(--color-card-hover)]/50">
        <div className="flex items-center gap-3">
          <SquareTerminal className="text-gray-400" size={22} strokeWidth={2} />
          <h2 className="text-[var(--color-foreground)] font-bold text-xl tracking-wide">Quick Start</h2>
        </div>
        <div className="bg-[var(--color-card)] border border-[var(--color-border)] text-gray-400 text-xs font-mono font-semibold px-2.5 py-1 rounded">
          BASH
        </div>
      </div>
      
      {/* Terminal Code Area */}
      <div className="p-6 font-mono text-[14px] leading-loose">
        <div className="mb-6">
          <p className="text-orange-400 opacity-80"># 1. Install the CLI via npm</p>
          <p className="text-[var(--color-foreground)]">npm install -g dataforge-cli</p>
        </div>

        <div className="mb-6">
          <p className="text-orange-400 opacity-80"># 2. Initialize a new project in your directory</p>
          <p className="text-[var(--color-foreground)]">
            dataforge init <span className="text-brand-500">my-mock-project</span>
          </p>
        </div>

        <div>
          <p className="text-orange-400 opacity-80"># 3. Generate 1000 rows based on your schema.yaml</p>
          <p className="text-[var(--color-foreground)]">
            dataforge generate --rows <span className="text-orange-400">1000</span> --out <span className="text-brand-500">./data.sql</span>
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
        
        {/* Intro Header Section */}
        <div className="mb-12 lg:mb-16 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6">
            Get started with <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-500 to-blue-500">DataForge</span>
          </h1>
          <p className="text-gray-400 text-lg leading-relaxed mb-4 max-w-3xl">
            DataForge works by parsing your workspace configurations, analyzing your schema dependencies, and using AI models to generate realistic relational mock data, then writing it directly to a static SQL file.
          </p>
          <p className="text-gray-400 text-lg leading-relaxed max-w-3xl">
            It's fast, flexible, and reliable — with zero manual data entry.
          </p>
        </div>

        {/* Features Grid */}
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

        {/* Quick Start Section */}
        <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
          <QuickStart />
        </div>

      </div>
    </main>
  );
}
