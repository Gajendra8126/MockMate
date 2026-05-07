import React from 'react';
import { Mail, ArrowRight } from 'lucide-react';

export default function Blog() {
  // Mock data for the blog posts tailored to Mockmate's domain
  const posts = [
    {
      id: 1,
      date: 'MAY 08, 2026',
      title: 'Relational Integrity: Introducing AI Schema Inference',
      excerpt: "Say goodbye to manually defining foreign keys. Our new AI engine automatically analyzes your existing database schemas to infer complex relationships, ensuring generated mock data perfectly maintains referential integrity out of the box without tedious configuration.",
      link: '#'
    },
    
  ];

  return (
    <main className="max-w-6xl mx-auto px-6 pt-28 pb-16 relative z-10 transition-colors duration-300">
      
      {/* Background Decor - Subtle Grid to match the tech/data vibe */}
      <div className="absolute inset-0 z-0 pointer-events-none" aria-hidden="true">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--color-border)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-border)_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30"></div>
      </div>

      <div className="relative z-10">
        {/* Header Section */}
        <header className="py-12 md:py-16 border-b border-[var(--color-border)]">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter text-[var(--color-foreground)] mb-6">
            Latest Updates
          </h1>
          <p className="text-lg md:text-xl text-gray-500 dark:text-gray-400 max-w-3xl leading-relaxed">
            All the latest news on AI-driven mock data generation, straight from the Mockmate team.
          </p>
        </header>

        {/* Subscription Section */}
        <section className="py-8 border-b border-[var(--color-border)]">
          <form className="flex flex-col sm:flex-row gap-3 items-start sm:items-center" onSubmit={(e) => e.preventDefault()}>
            <div className="relative w-full max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-500" />
              </div>
              <input
                type="email"
                className="w-full bg-[var(--color-card)] border border-[var(--color-border)] text-[var(--color-foreground)] text-sm rounded-full focus:ring-1 focus:ring-brand-500 focus:border-brand-500 block pl-10 p-3.5 transition-colors placeholder:text-gray-500"
                placeholder="Subscribe via email"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-3.5 bg-brand-500 hover:bg-brand-600 text-white text-sm font-medium rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 focus:ring-offset-[var(--color-background)]"
            >
              Subscribe
            </button>
          </form>
        </section>

        {/* Blog Posts List */}
        <section className="flex flex-col">
          {posts.map((post) => (
            <article 
              key={post.id} 
              className="grid grid-cols-1 md:grid-cols-12 border-b border-[var(--color-border)] group hover:bg-[var(--color-card-hover)] transition-colors duration-300"
            >
              {/* Date Column */}
              <div className="md:col-span-3 py-8 md:pr-8 md:border-r border-[var(--color-border)]">
                <time 
                  dateTime={post.date} 
                  className="text-xs sm:text-sm font-mono text-brand-500 dark:text-brand-400 uppercase tracking-[0.15em] whitespace-nowrap"
                >
                  {post.date}
                </time>
              </div>
              
              {/* Content Column */}
              <div className="md:col-span-9 py-8 md:pl-10 lg:pl-12">
                <h2 className="text-xl sm:text-2xl font-bold text-[var(--color-foreground)] mb-3 group-hover:text-brand-500 transition-colors">
                  <a href={post.link} className="focus:outline-none">
                    {/* Span absolute inset to make whole card clickable if desired, or keep to title/link */}
                    {post.title}
                  </a>
                </h2>
                <p className="text-gray-500 dark:text-gray-400 mb-5 leading-relaxed max-w-3xl">
                  {post.excerpt}
                </p>
                <a 
                  href={post.link} 
                  className="inline-flex items-center text-brand-500 hover:text-brand-400 font-medium text-sm transition-colors"
                >
                  Read more
                  <ArrowRight className="ml-1.5 h-4 w-4" />
                </a>
              </div>
            </article>
          ))}
        </section>
      </div>

    </main>
  );
}
