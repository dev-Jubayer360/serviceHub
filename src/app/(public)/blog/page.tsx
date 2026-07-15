import React from 'react';
import Link from 'next/link';
import { Calendar, User, ArrowRight, BookOpen } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { MOCK_BLOGS } from '@/lib/blogData';

export default function BlogPage() {
  const featuredPost = MOCK_BLOGS[0];
  const regularPosts = MOCK_BLOGS.slice(1);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="bg-primary/5 py-16 border-b border-border/50">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">ServiceHub <span className="text-primary">Blog</span></h1>
          <p className="text-lg text-muted max-w-2xl mx-auto">
            Insights, guides, and expert advice to help you manage your home and business better.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        {/* Featured Post */}
        <div className="mb-16">
          <div className="flex items-center gap-2 mb-6">
            <BookOpen className="w-5 h-5 text-primary" />
            <h2 className="text-2xl font-bold text-foreground">Featured Article</h2>
          </div>
          
          <Link href={`/blog/${featuredPost.id}`} className="block">
            <Card className="overflow-hidden border-none shadow-card hover:shadow-xl transition-shadow duration-300 rounded-3xl group cursor-pointer bg-white">
              <div className="grid grid-cols-1 lg:grid-cols-2">
                <div className="relative h-64 lg:h-auto overflow-hidden">
                  <img 
                    src={featuredPost.image} 
                    alt={featuredPost.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="p-8 lg:p-12 flex flex-col justify-center">
                  <Badge className="w-fit mb-4 bg-primary/10 text-primary hover:bg-primary/20 border-none px-3 py-1">
                    {featuredPost.category}
                  </Badge>
                  <h3 className="text-3xl font-bold text-foreground mb-4 leading-tight group-hover:text-primary transition-colors">
                    {featuredPost.title}
                  </h3>
                  <p className="text-lg text-muted mb-8 leading-relaxed">
                    {featuredPost.excerpt}
                  </p>
                  
                  <div className="flex items-center justify-between mt-auto pt-6 border-t border-border/50">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-muted/20 flex items-center justify-center text-foreground font-semibold">
                        {featuredPost.author.charAt(0)}
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-foreground">{featuredPost.author}</div>
                        <div className="text-xs text-muted flex items-center gap-2">
                          <Calendar className="w-3 h-3" /> {featuredPost.date}
                          <span className="w-1 h-1 rounded-full bg-muted"></span>
                          {featuredPost.readTime}
                        </div>
                      </div>
                    </div>
                    <span className="hidden sm:flex items-center text-sm font-medium text-foreground hover:bg-muted/10 px-4 py-2 rounded-xl group-hover:translate-x-1 transition-transform">
                      Read Article <ArrowRight className="w-4 h-4 ml-2" />
                  </span>
                  </div>
                </div>
              </div>
            </Card>
          </Link>
        </div>

        {/* Categories / Filters */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {['All Posts', 'Home Care', 'Guides', 'Maintenance', 'Cleaning', 'Electrical'].map((cat, i) => (
            <Badge 
              key={cat} 
              variant={i === 0 ? "default" : "secondary"} 
              className={`px-4 py-2 text-sm cursor-pointer ${i !== 0 && 'hover:bg-primary/10 hover:text-primary'}`}
            >
              {cat}
            </Badge>
          ))}
        </div>

        {/* Regular Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {regularPosts.map((post) => (
            <Link key={post.id} href={`/blog/${post.id}`} className="block h-full">
              <Card className="overflow-hidden border-none shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 rounded-2xl group flex flex-col bg-white h-full">
                <div className="relative h-56 overflow-hidden">
                  <img 
                    src={post.image} 
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-white/90 text-foreground backdrop-blur-sm border-none shadow-sm">
                      {post.category}
                    </Badge>
                  </div>
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="text-xl font-bold text-foreground mb-3 leading-snug group-hover:text-primary transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-muted text-sm mb-6 line-clamp-3 flex-1">
                    {post.excerpt}
                  </p>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-border/50">
                    <div className="flex items-center gap-3">
                      <div className="text-xs text-muted font-medium">
                        {post.author}
                      </div>
                    </div>
                    <div className="text-xs text-muted font-medium">
                      {post.date}
                    </div>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>

        <div className="mt-16 text-center">
          <Button size="lg" variant="outline" className="rounded-full px-8">
            Load More Articles
          </Button>
        </div>
      </div>
    </div>
  );
}
