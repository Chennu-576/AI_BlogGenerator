
// import { AuthForm } from '@/components/auth/auth-form'

// export default function AuthPage() {
//   return (
    
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 flex items-center justify-center p-4">
//       <AuthForm />
//     </div>
//   )
// }

"use client";

import React, { useState, useEffect } from 'react';
import { Sparkles, Zap, FileText, Globe, CheckCircle, ArrowRight, Menu, X, Shield } from 'lucide-react';
import Link from 'next/link'

export default function BlogGeneratorLanding() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 text-white">
      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-slate-950/80 backdrop-blur-lg shadow-lg' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-8 h-8 text-purple-400" />
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">BlogForge</span>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <button onClick={() => scrollToSection('home')} className="hover:text-purple-400 transition-colors">Home</button>
              <button onClick={() => scrollToSection('features')} className="hover:text-purple-400 transition-colors">Features</button>
              <button onClick={() => scrollToSection('how-it-works')} className="hover:text-purple-400 transition-colors">How It Works</button>
              {/* <button className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 transition-all transform hover:scale-105">Login</button> */}
               <Link href="/login"> 
          <button className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 transition-all transform hover:scale-105">
            Login
          </button>
        </Link>
            </div>

            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden">
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-slate-950/95 backdrop-blur-lg">
            <div className="px-4 pt-2 pb-4 space-y-2">
              <button onClick={() => scrollToSection('home')} className="block w-full text-left px-3 py-2 hover:bg-purple-900/30 rounded">Home</button>
              <button onClick={() => scrollToSection('features')} className="block w-full text-left px-3 py-2 hover:bg-purple-900/30 rounded">Features</button>
              <button onClick={() => scrollToSection('how-it-works')} className="block w-full text-left px-3 py-2 hover:bg-purple-900/30 rounded">How It Works</button>
              <button onClick={() => scrollToSection('pricing')} className="block w-full text-left px-3 py-2 hover:bg-purple-900/30 rounded">Pricing</button>
              <Link href="/login"> 
          <button className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 transition-all transform hover:scale-105">
            Login
          </button>
        </Link>
              {/* <button className="w-full px-4 py-2 mt-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600">Login</button> */}
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section id="home" className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-block mb-6 px-4 py-2 bg-purple-900/30 rounded-full border border-purple-500/30">
            <span className="text-sm text-purple-300">🚀 AI-Powered Blog Generation</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Create Stunning Blogs
            <br />
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent animate-pulse">In Seconds</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto">
            Transform your ideas into professional, SEO-optimized blog posts with the power of advanced AI. No writing experience needed.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button onClick={() => scrollToSection('pricing')} className="px-8 py-4 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 transition-all transform hover:scale-105 text-lg font-semibold shadow-lg shadow-purple-500/50">
              Start Creating Free
            </button>
            <button onClick={() => scrollToSection('how-it-works')} className="px-8 py-4 rounded-xl border-2 border-purple-500 hover:bg-purple-900/30 transition-all text-lg font-semibold">
              Watch Demo
            </button>
          </div>
        </div>
      </section>

      {/* Features Section - 3 cards per row, 2 rows */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-transparent to-slate-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Powerful Features</h2>
            <p className="text-gray-400 text-lg">Everything you need to create amazing content</p>
          </div>
          
          {/* First Row - 3 Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-6">
            {[
              { icon: Zap, title: "Lightning Fast", desc: "Generate complete blog posts in under 30 seconds with our advanced AI engine" },
              { icon: FileText, title: "SEO Optimized", desc: "Built-in SEO tools ensure your content ranks high on search engines" },
              { icon: Globe, title: "Multi-Language", desc: "Create content in over 50 languages to reach a global audience" }
            ].map((feature, idx) => (
              <div key={idx} className="group p-8 rounded-2xl bg-gradient-to-br from-purple-900/20 to-pink-900/20 border border-purple-500/20 hover:border-purple-500/50 transition-all hover:transform hover:scale-105">
                <feature.icon className="w-12 h-12 text-purple-400 mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
                <p className="text-gray-400">{feature.desc}</p>
              </div>
            ))}
          </div>
          
          {/* Second Row - 3 Cards */}
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Sparkles, title: "Smart Templates", desc: "Choose from dozens of professionally designed templates for any niche" },
              { icon: Shield, title: "Plagiarism Free", desc: "100% original content guaranteed with built-in plagiarism checking" },
              { icon: ArrowRight, title: "One-Click Publish", desc: "Publish directly to WordPress, Medium, and more platforms" }
            ].map((feature, idx) => (
              <div key={idx} className="group p-8 rounded-2xl bg-gradient-to-br from-purple-900/20 to-pink-900/20 border border-purple-500/20 hover:border-purple-500/50 transition-all hover:transform hover:scale-105">
                <feature.icon className="w-12 h-12 text-purple-400 mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
                <p className="text-gray-400">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section - 3 cards in a row */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/10 to-transparent"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">How It Works</h2>
            <p className="text-gray-400 text-lg">Three simple steps to amazing content</p>
          </div>
          
          <div className="relative">
            {/* Connection Line */}
            <div className="hidden md:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600 transform -translate-y-1/2 opacity-30"></div>
            
            {/* 3 Cards in a Row */}
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { num: "01", title: "Enter Your Topic", desc: "Simply type in what you want to write about. Our AI understands context and intent.", icon: FileText },
                { num: "02", title: "AI Does the Magic", desc: "Watch as our advanced algorithms craft a unique, engaging blog post tailored to your needs.", icon: Sparkles },
                { num: "03", title: "Review & Publish", desc: "Edit if needed, or publish directly. Your professional blog post is ready to share.", icon: CheckCircle }
              ].map((step, idx) => (
                <div key={idx} className="relative">
                  <div className="bg-gradient-to-br from-purple-900/40 to-pink-900/40 rounded-2xl p-8 border border-purple-500/30 hover:border-purple-500/60 transition-all group hover:transform hover:scale-105 relative z-10">
                    <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-16 h-16 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-2xl font-bold shadow-lg shadow-purple-500/50">
                      {step.num}
                    </div>
                    <div className="mt-8 mb-4 flex justify-center">
                      <div className="w-20 h-20 rounded-full bg-purple-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <step.icon className="w-10 h-10 text-purple-400" />
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold mb-3 text-center">{step.title}</h3>
                    <p className="text-gray-400 text-center leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section - 3 cards in a row */}
      <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-transparent to-slate-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Simple Pricing</h2>
            <p className="text-gray-400 text-lg">Choose the plan that fits your needs</p>
          </div>
            
          {/* 3 Cards in a Row */}
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              { name: "Starter", price: "0", features: ["5 blog posts/month", "Basic templates", "Email support", "1 language"], popular: false },
              { name: "Pro", price: "29", features: ["50 blog posts/month", "All templates", "Priority support", "All languages", "SEO tools", "API access"], popular: true },
              { name: "Enterprise", price: "99", features: ["Unlimited posts", "Custom templates", "24/7 support", "All languages", "Advanced SEO", "API access", "White label"], popular: false }
            ].map((plan, idx) => (
              <div key={idx} className={`relative p-8 rounded-2xl transition-all hover:transform hover:scale-105 ${plan.popular ? 'bg-gradient-to-br from-purple-600 to-pink-600 shadow-2xl shadow-purple-500/50 md:scale-105' : 'bg-gradient-to-br from-purple-900/20 to-pink-900/20 border border-purple-500/20'}`}>
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 px-4 py-1 bg-yellow-500 text-slate-900 rounded-full text-sm font-bold">
                    MOST POPULAR
                  </div>
                )}
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <div className="mb-6">
                  <span className="text-5xl font-bold">${plan.price}</span>
                  <span className="text-gray-300">/month</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center">
                      <CheckCircle className="w-5 h-5 mr-2 text-green-400 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <button className={`w-full py-3 rounded-lg font-semibold transition-all ${plan.popular ? 'bg-white text-purple-600 hover:bg-gray-100' : 'bg-purple-600 hover:bg-purple-500'}`}>
                  Get Started
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto relative">
          {/* Decorative elements */}
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-pink-500/20 rounded-full blur-3xl"></div>
          
          <div className="relative bg-gradient-to-br from-purple-900/60 via-pink-900/60 to-purple-900/60 rounded-3xl p-12 md:p-16 border border-purple-500/30 backdrop-blur-sm overflow-hidden">
            {/* Animated background grid */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0" style={{
                backgroundImage: 'linear-gradient(rgba(168, 85, 247, 0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(168, 85, 247, 0.4) 1px, transparent 1px)',
                backgroundSize: '50px 50px'
              }}></div>
            </div>
            
            <div className="relative z-10 text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 mb-6 shadow-lg shadow-purple-500/50">
                <Sparkles className="w-10 h-10" />
              </div>
              
              <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                Ready to Transform Your Content?
              </h2>
              <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
                Join thousands of creators who are already using BlogForge to create amazing content. Start your journey today with our free plan.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <button onClick={() => scrollToSection('pricing')} className="group px-10 py-4 rounded-xl bg-white text-purple-600 hover:bg-gray-100 transition-all transform hover:scale-105 text-lg font-semibold shadow-xl flex items-center gap-2">
                  Start Your Free Trial
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <button className="px-10 py-4 rounded-xl border-2 border-white/30 hover:border-white/60 hover:bg-white/10 transition-all text-lg font-semibold backdrop-blur-sm">
                  Contact Sales
                </button>
              </div>
              
              <div className="mt-8 flex items-center justify-center gap-8 text-sm text-gray-400">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span>No credit card required</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span>Cancel anytime</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-purple-500/20">
        <div className="max-w-7xl mx-auto text-center text-gray-400">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Sparkles className="w-6 h-6 text-purple-400" />
            <span className="text-xl font-bold text-white">BlogForge</span>
          </div>
          <p>&copy; 2026 BlogForge. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}