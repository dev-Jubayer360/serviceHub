import React from 'react';
import Link from 'next/link';
import { Calendar, User, ArrowLeft, Clock, Share2, Globe, MessageCircle, Mail } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { MOCK_BLOGS } from '@/lib/blogData';
import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';

export default function BlogDetailsPage({ params }: { params: { id: string } }) {
  const post = MOCK_BLOGS.find((b) => b.id.toString() === params.id);

  if (!post) {
    notFound();
  }

  const relatedPosts = MOCK_BLOGS.filter(b => b.category === post.category && b.id !== post.id).slice(0, 3);
  if (relatedPosts.length === 0) {
    relatedPosts.push(...MOCK_BLOGS.filter(b => b.id !== post.id).slice(0, 3));
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative pt-24 pb-32">
        <div className="absolute inset-0 bg-black/60 z-10"></div>
        <div 
          className="absolute inset-0 bg-cover bg-center z-0"
          style={{ backgroundImage: `url(${post.image})` }}
        ></div>
        
        <div className="container mx-auto px-4 relative z-20 text-center max-w-4xl">
          <Link href="/blog">
            <Button variant="outline" className="mb-8 border-white/20 text-white hover:bg-white/10 hover:text-white rounded-full">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Blog
            </Button>
          </Link>
          
          <Badge className="bg-primary text-white border-none mb-6 text-sm px-4 py-1.5 shadow-lg hover:bg-primary">
            {post.category}
          </Badge>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight drop-shadow-md">
            {post.title}
          </h1>
          
          <div className="flex flex-wrap items-center justify-center gap-6 text-white/80 font-medium">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white text-xs">
                {post.author.charAt(0)}
              </div>
              <span>{post.author}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>{post.date}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>{post.readTime}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16 -mt-16 relative z-30">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-3xl shadow-xl max-w-4xl mx-auto p-8 md:p-12 lg:p-16">
            
            {/* Excerpt */}
            <p className="text-xl md:text-2xl text-muted-foreground font-light italic border-l-4 border-primary pl-6 mb-12 leading-relaxed">
              "{post.excerpt}"
            </p>
            
            {/* Main Content (Markdown) */}
            <div className="prose prose-lg prose-slate max-w-none">
              <ReactMarkdown>{post.content || ''}</ReactMarkdown>
            </div>
            
            {/* Tags & Share */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 mt-16 pt-8 border-t border-border/50">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-foreground mr-2">Tags:</span>
                <Badge variant="secondary">{post.category}</Badge>
                <Badge variant="secondary">Tips</Badge>
                <Badge variant="secondary">ServiceHub</Badge>
              </div>
              
              <div className="flex items-center gap-4">
                <span className="font-semibold text-foreground flex items-center gap-2">
                  <Share2 className="w-4 h-4" /> Share:
                </span>
                <div className="flex gap-2">
                  <button className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-colors">
                    <Globe className="w-4 h-4" />
                  </button>
                  <button className="w-10 h-10 rounded-full bg-sky-50 text-sky-500 flex items-center justify-center hover:bg-sky-500 hover:text-white transition-colors">
                    <MessageCircle className="w-4 h-4" />
                  </button>
                  <button className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-700 flex items-center justify-center hover:bg-indigo-700 hover:text-white transition-colors">
                    <Mail className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </section>

      {/* Related Posts */}
      <section className="py-16 bg-muted/20">
        <div className="container mx-auto px-4 max-w-6xl">
          <h2 className="text-3xl font-bold text-foreground mb-10 text-center">Related Articles</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {relatedPosts.map((relatedPost) => (
              <Link key={relatedPost.id} href={`/blog/${relatedPost.id}`}>
                <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group h-full flex flex-col cursor-pointer">
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={relatedPost.image} 
                      alt={relatedPost.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-white/90 text-foreground backdrop-blur-sm border-none shadow-sm">
                        {relatedPost.category}
                      </Badge>
                    </div>
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <h3 className="font-bold text-lg text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2">
                      {relatedPost.title}
                    </h3>
                    <div className="flex items-center gap-3 mt-auto pt-4 border-t border-border/50 text-xs text-muted font-medium">
                      <span>{relatedPost.author}</span>
                      <span className="w-1 h-1 rounded-full bg-muted"></span>
                      <span>{relatedPost.date}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
