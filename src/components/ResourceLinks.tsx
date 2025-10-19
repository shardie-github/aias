import { ExternalLink, BookOpen, Github, Cpu, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

const resources = [
  {
    icon: Github,
    title: 'GitHub AI Resources',
    description: 'Open-source AI models, tools, and frameworks',
    link: 'https://github.com/topics/artificial-intelligence',
    category: 'Code & Tools',
  },
  {
    icon: Cpu,
    title: 'Hugging Face',
    description: 'State-of-the-art AI models and datasets',
    link: 'https://huggingface.co/',
    category: 'Models & Datasets',
  },
  {
    icon: Sparkles,
    title: 'Ollama',
    description: 'Run large language models locally',
    link: 'https://ollama.ai/',
    category: 'Local AI',
  },
  {
    icon: BookOpen,
    title: 'Papers with Code',
    description: 'Latest AI research papers with implementations',
    link: 'https://paperswithcode.com/',
    category: 'Research',
  },
  {
    icon: BookOpen,
    title: 'Towards Data Science',
    description: 'AI and machine learning insights',
    link: 'https://towardsdatascience.com/',
    category: 'Learning',
  },
  {
    icon: Cpu,
    title: 'AI News by The Verge',
    description: 'Latest AI industry news and trends',
    link: 'https://www.theverge.com/ai-artificial-intelligence',
    category: 'News',
  },
];

export const ResourceLinks = () => {
  return (
    <section className="py-24 relative bg-gradient-to-b from-card to-background">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold">
            AI Knowledge
            <span className="block mt-2 bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
              Hub
            </span>
          </h2>
          <p className="text-xl text-muted-foreground">
            Curated resources from industry-leading AI platforms and communities
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {resources.map((resource, index) => (
            <a
              key={`resource-${index}`}
              href={resource.link}
              target="_blank"
              rel="noopener noreferrer"
              className="group p-6 rounded-xl bg-gradient-card backdrop-blur-sm border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-glow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                  <resource.icon className="w-6 h-6 text-primary" />
                </div>
                <ExternalLink className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
              
              <div className="mb-2">
                <span className="text-xs font-semibold text-primary">{resource.category}</span>
              </div>
              
              <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                {resource.title}
              </h3>
              
              <p className="text-sm text-muted-foreground">
                {resource.description}
              </p>
            </a>
          ))}
        </div>

        <div className="text-center mt-16">
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary/10 border border-primary/20">
            <Sparkles className="w-5 h-5 text-primary" />
            <span className="text-sm font-medium">
              All resources are free and open to the community
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
