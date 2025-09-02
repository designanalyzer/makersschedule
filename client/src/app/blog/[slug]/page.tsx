'use client';
import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import AuthModal from '../../../components/AuthModal';

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  author: string;
  description: string;
  content: string;
  date: string;
  category: string;
  thumbnail: string;
}

const blogPosts: BlogPost[] = [
  {
    id: '1',
    slug: 'makers-vs-managers-schedule',
    title: 'Manager\'s Schedule vs Maker\'s Schedule',
    author: 'Paul Graham',
    description: 'The fundamental difference between how managers and makers organize their time',
    content: `Paul Graham's essay "Maker's Schedule, Manager's Schedule" explains the fundamental difference between how different types of people organize their time - a concept that has shaped how successful companies and individuals think about productivity. Graham's insight came from observing how Y Combinator's most successful founders worked. He noticed that the most productive people weren't those who scheduled back-to-back meetings, but those who protected large blocks of uninterrupted time.

The Two Schedules That Shape Our Work

The manager's schedule is organized in hour-long blocks, designed for meetings and coordination, easy to schedule and reschedule, good for managing people and projects, focuses on communication and decision-making, and works well for executives and coordinators. The maker's schedule is organized in half-day blocks, designed for deep, focused work, disrupted by meetings and interruptions, good for creating and building, requires long periods of concentration, and is essential for programmers, writers, designers, and creators.

The Real Cost of Interruptions

Graham's key insight is that makers (programmers, writers, designers) need long, uninterrupted blocks of time to do their best work. A single meeting can destroy an entire morning of productive work because it takes time to get into the flow state, build context and momentum, solve complex problems, and create something meaningful.

The Impact on Company Culture

This concept has influenced how successful tech companies operate. Companies like Basecamp, 37signals, and many others have adopted maker-friendly policies including no-meeting Wednesdays, quiet hours for deep work, async communication over meetings, and protected maker time. Understanding the difference between maker and manager schedules is crucial because most people are makers, not managers, traditional office culture favors manager schedules, makers need to actively protect their time, and the best work happens in maker mode.

The Maker's Schedule Solution

This is why tools like Maker's Schedule are so valuable - they help makers protect their time and maintain the focus needed for creative work. By understanding and respecting the maker's schedule, you can block out large chunks of focused time, minimize interruptions and context switching, create the conditions for deep work, and build something meaningful instead of just managing. The lesson is clear: if you want to create something significant, you need to think like a maker, not a manager.`,
    date: '2009',
    category: 'Productivity',
    thumbnail: '/blog/paul-graham-schedule.svg'
  },
  {
    id: '2',
    slug: 'guillaume-moubeche-monk-mode',
    title: 'Guillaume Moubeche and the Power of Monk Mode',
    author: 'Guillaume Moubeche',
    description: 'How the founder of Lempire used monk mode to build a $50M+ company',
    content: `Guillaume Moubeche, the founder of Lempire, is a perfect example of how deep focus and monk mode can transform your productivity and business outcomes. Monk mode is a productivity technique where you eliminate all distractions and focus intensely on a single goal for an extended period. Guillaume used this approach to build Lempire into a $50M+ company, proving that sustained focus beats scattered effort every time.

The Story Behind Lempire's Success

Guillaume started Lempire in 2018 with a simple mission: help businesses grow through better outbound sales. But instead of trying to do everything at once, he committed to monk mode - dedicating 6-8 hours of uninterrupted work each day to building the product. During his monk mode periods, Guillaume would turn off all notifications and social media, work in 90-minute focused blocks, take only essential breaks, track his progress obsessively, and say no to meetings and distractions.

The Results Speak for Themselves

Within 18 months, Lempire grew to serve over 10,000 businesses and generate $50M+ in revenue. Guillaume attributes this success to the monk mode approach, which allowed him to build a product that truly solved customer problems. Key principles from Guillaume's monk mode approach include eliminating all non-essential activities, focusing on one major goal at a time, creating strict boundaries around your work time, removing all digital distractions, building systems that support deep work, measuring progress daily instead of weekly, and protecting your most productive hours.

The Lesson for Makers

Guillaume's success demonstrates that the most effective way to build something significant is through sustained, focused effort rather than scattered multitasking. In a world full of distractions, the ability to enter monk mode and focus deeply on your craft is what separates successful builders from the rest. This is exactly why tools like Maker's Schedule are so valuable - they help you create the structure and boundaries needed to enter your own monk mode and build something meaningful.`,
    date: '2024',
    category: 'Productivity',
    thumbnail: '/blog/guillaume-monk-mode.svg'
  },
  {
    id: '3',
    slug: 'noah-kagan-million-dollar-weekend',
    title: 'Noah Kagan and the Million Dollar Weekend',
    author: 'Noah Kagan',
    description: 'How Noah Kagan built a million-dollar business in just one weekend',
    content: `Noah Kagan's "Million Dollar Weekend" is a legendary case study in rapid business validation and execution that challenges everything we think we know about starting a business. The concept is simple but powerful: identify a problem, create a solution, and validate it with real customers - all within a weekend. Noah proved this approach works by building multiple successful businesses using this framework, including AppSumo, which now generates over $100M annually.

The $30,000 Weekend Experiment

Noah's most famous experiment started on a Friday afternoon. He identified a problem: small businesses needed better email marketing tools but couldn't afford expensive solutions. By Sunday evening, he had built a simple landing page, created a basic email marketing tool, sold $30,000 worth of subscriptions, and validated the business model with real customers.

Just Start Building

Noah's approach follows a specific framework that anyone can replicate. First, find a problem people are willing to pay to solve. Then create a minimum viable solution in 48 hours, get real customers to pay real money, use that feedback to iterate and improve, and finally scale what works and kill what doesn't. Key lessons from Noah's approach include starting with customer problems rather than product ideas, validating quickly with real money from real customers, focusing on execution over perfection, building in public and leveraging your network, measuring everything and iterating fast, not overthinking and just starting building, and using constraints to force creativity.

The Real Lesson: Stop Planning, Start Building

Noah's success shows that you don't need months of planning to start a business. Sometimes the best approach is to identify a problem and solve it immediately. The key is getting out of your head and into the market as quickly as possible. This rapid validation approach is perfect for makers who want to test ideas quickly and build momentum. It's about shipping fast, learning fast, and iterating based on real customer feedback rather than assumptions.

Why This Works for Makers

Noah's approach works because it respects the maker's schedule - focused, uninterrupted time to build and ship. Instead of endless planning meetings, it's about dedicated building time with clear deadlines and measurable outcomes.`,
    date: '2023',
    category: 'Entrepreneurship',
    thumbnail: '/blog/noah-kagan-weekend.svg'
  },
  {
    id: '4',
    slug: 'pat-walls-coffee-shop-routine',
    title: 'Pat Walls\' 2-Hour Coffee Shop Routine',
    author: 'Pat Walls',
    description: 'How the founder of Starter Story uses daily coffee shop sessions for deep work and strategic thinking',
    content: `Pat Walls, the founder of Starter Story, has developed a unique approach to maintaining clarity and strategic thinking while building one of the most valuable resources for entrepreneurs. His daily routine includes a 2-hour coffee shop session that has become the foundation of his productivity system.

The Daily Coffee Shop Ritual

Every morning, Pat Walls starts his day with a 2-hour session at a local coffee shop. This isn't just about caffeine - it's a carefully designed ritual for deep work and strategic thinking. During these sessions, Pat reviews the day's priorities without distractions, reads industry reports and market analysis, responds to critical emails and messages, plans strategic initiatives and company direction, and maintains focus on Starter Story's long-term vision.

The Power of the Coffee Shop Environment

Pat chose coffee shops for specific reasons. The ambient noise creates a perfect "focus zone" that helps him concentrate better than complete silence. There are no office interruptions or meeting requests to break his flow. The change of environment stimulates creative thinking and provides a fresh perspective. The routine creates consistency and discipline, and it separates work planning from execution.

The Steve Jobs Connection

Pat's approach is deeply influenced by Steve Jobs, who was famous for his "reality distortion field" and ability to focus intensely on what mattered most. Jobs taught that simplicity is the ultimate sophistication, and that you should focus on a few things and do them exceptionally well. Strategic thinking requires dedicated time and space, and the best decisions come from deep reflection, not rushed meetings.

The Strategic Benefits

This approach has helped Pat build Starter Story into a valuable resource for entrepreneurs. It provides clear strategic direction in a complex industry, enables him to make bold decisions with confidence, maintains focus on Starter Story's core mission, balances short-term execution with long-term vision, and creates space for innovation and creativity. Key lessons for makers include creating dedicated time for strategic thinking, separating planning from execution, using environment changes to stimulate creativity, building consistent routines that support your goals, protecting time for deep work and reflection, and not letting urgent tasks crowd out important strategic thinking.

The Maker's Schedule Connection

This is exactly what the maker's schedule is about - creating dedicated, uninterrupted time for the work that matters most. Whether you're building a company, a product, or a career, the ability to carve out focused time for strategic thinking is essential for long-term success. The lesson is clear: the most successful people aren't just busy - they're strategic about how they spend their time and energy.`,
    date: '2024',
    category: 'Entrepreneurship',
    thumbnail: '/blog/pat-walls-coffee.svg'
  },
  {
    id: '5',
    slug: 'steve-jobs-think-week',
    title: 'Steve Jobs and the Power of Think Weeks',
    author: 'Steve Jobs',
    description: 'How Steve Jobs used dedicated thinking time to make Apple\'s biggest decisions',
    content: `Steve Jobs was famous for his ability to make bold, visionary decisions that transformed entire industries. But what many people don't know is that his most important decisions came during dedicated "think weeks" - periods of complete isolation and deep reflection.

The Think Week Tradition

Jobs would regularly take week-long retreats to a cabin in the mountains, completely disconnected from the world. No phone, no email, no meetings, no distractions. Just Steve Jobs, his thoughts, and the time to think deeply about Apple's future. During these think weeks, Jobs would read extensively, meditate, take long walks, and most importantly, think. He would contemplate Apple's strategic direction, evaluate new product ideas, and make the kind of bold decisions that would define the company for years to come.

The Decision-Making Process

Jobs used these think weeks to make some of Apple's most important decisions. The iPhone was conceived during a think week. The decision to focus on mobile computing came from deep reflection. The strategy to create a closed ecosystem was born from these periods of isolation. What made these think weeks so powerful was Jobs' ability to think without constraints. He wasn't thinking about quarterly earnings or immediate market pressures. He was thinking about what Apple should be in five years, ten years, and beyond.

The Power of Deep Thinking

Jobs believed that the best decisions come from deep, uninterrupted thinking. In our modern world of constant distractions and immediate responses, we've lost the art of deep thinking. Jobs' think weeks were a deliberate attempt to reclaim this lost art. The results speak for themselves. Apple's most successful products - the iPhone, iPad, MacBook Air - all came from decisions made during these periods of deep reflection. Jobs understood that breakthrough ideas don't come from committee meetings or brainstorming sessions. They come from deep, focused thinking.

The Lesson for Makers

The think week concept has been adopted by many successful entrepreneurs and executives. Bill Gates famously took think weeks, and many other leaders have followed suit. The key insight is that breakthrough thinking requires dedicated time and space. For makers and creators, this means carving out time for deep thinking. It might not be a full week, but even a day or two of focused thinking can lead to breakthrough insights. The key is creating the space and time to think deeply without distractions.

The Maker's Schedule Connection

This is exactly what the maker's schedule is about - creating dedicated, uninterrupted time for the work that matters most. Whether you're making strategic decisions or creating something new, the ability to think deeply without interruption is essential for breakthrough results. The lesson from Jobs' think weeks is clear: the most important work often happens in solitude, with time to think deeply and without the pressure of immediate responses.`,
    date: '2024',
    category: 'Leadership',
    thumbnail: '/blog/steve-jobs-think.svg'
  },
  {
    id: '6',
    slug: 'four-burners-theory',
    title: 'The Four Burners Theory: Life\'s Greatest Trade-off',
    author: 'James Clear',
    description: 'Understanding the fundamental trade-off between work, health, family, and friends',
    content: `The Four Burners Theory is one of the most powerful frameworks for understanding life's fundamental trade-offs. Imagine your life as a stove with four burners: work, health, family, and friends. To be successful, you have to turn off at least one burner. To be really successful, you have to turn off two.

The Four Burners Explained

The theory was popularized by James Clear and suggests that we have limited time and energy to allocate across four major areas of life. Each burner represents a critical aspect of a well-rounded life, but trying to keep all four burning at full strength is impossible. The work burner represents your career, business, and professional ambitions. The health burner includes physical fitness, mental health, and overall wellbeing. The family burner covers relationships with your spouse, children, and immediate family. The friends burner represents your social life and community connections.

The Reality of Trade-offs

The harsh reality is that you cannot excel in all four areas simultaneously. Something has to give. This is why so many people feel overwhelmed and stretched thin - they're trying to keep all four burners running at full capacity. Successful people understand this trade-off and make deliberate choices about which burners to prioritize. They accept that they cannot be everything to everyone, and they focus their energy on what matters most to them.

The Different Approaches

Some people choose to turn off the friends burner, focusing on work, health, and family. Others might turn off the health burner temporarily to focus on building their career. Some successful entrepreneurs have turned off both the friends and family burners to focus entirely on work and health. The key insight is that there's no right or wrong choice - only the choice that aligns with your values and goals. The important thing is to make the choice consciously rather than letting circumstances decide for you.

The Maker's Schedule Connection

For makers and creators, this theory is particularly relevant. Deep work and creative output require significant time and energy. This often means turning off the friends burner or the family burner for periods of intense focus. The maker's schedule is about creating the conditions for deep work, which often requires making deliberate trade-offs. You might spend less time socializing to focus on building something meaningful. You might prioritize work and health over family time during critical project phases.

The Long-term Perspective

The Four Burners Theory also teaches us about the importance of timing and seasons in life. You don't have to keep the same burners turned off forever. You can rotate your focus based on your current priorities and life stage. A young entrepreneur might focus heavily on work and health, turning off family and friends temporarily. Later in life, they might shift focus to family and friends, turning down the work burner. The key is being intentional about these choices.

The Lesson for Success

The most successful people are those who understand their priorities and make deliberate choices about their burners. They don't try to do everything perfectly. Instead, they focus their energy on what matters most to them and accept the trade-offs that come with those choices. This is why tools like Maker's Schedule are so valuable - they help you make deliberate choices about how to allocate your time and energy. They help you turn off the right burners at the right time to focus on what matters most. The ultimate lesson is that success requires sacrifice. You cannot have it all, but you can have what matters most to you if you're willing to make the necessary trade-offs.`,
    date: '2024',
    category: 'Productivity',
    thumbnail: '/blog/four-burners-theory.svg'
  }
];

export default function BlogPostPage() {
  const params = useParams();
  const slug = params.slug as string;
  const post = blogPosts.find(p => p.slug === slug);

  if (!post) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-4xl mx-auto px-4 py-20 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Post Not Found</h1>
          <p className="text-gray-600 mb-8">The blog post you're looking for doesn't exist.</p>
          <Link href="/inspiration" className="text-[#A3C900] hover:underline">
            Back to Inspiration
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Link href="/" className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center shadow-lg">
                    <div className="w-5 h-5 bg-white/90 rounded-sm"></div>
                  </div>
                  <div className="absolute -inset-1 bg-gradient-to-br from-brand-purple/20 to-brand-blue/20 rounded-lg blur-sm -z-10"></div>
                </div>
                <div className="flex flex-col">
                  <span className="text-lg font-semibold text-gray-900">Maker's Schedule</span>
                  <span className="text-xs text-gray-500 font-medium tracking-wide hidden sm:block">From busy to focused.</span>
                </div>
              </Link>
            </div>
            <nav className="hidden md:flex items-center space-x-6">
              <Link href="/landing" className="text-gray-500 hover:text-gray-900 text-sm">Home</Link>
              <Link href="/inspiration" className="text-gray-500 hover:text-gray-900 text-sm">Inspiration</Link>
              <button
                type="button"
                className="flex items-center space-x-2 text-gray-500 hover:text-brand-purple text-sm transition-colors"
              >
                <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-brand-blue/20">
                  <svg className="w-3 h-3 text-brand-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14" />
                  </svg>
                </span>
                <span>Sign In</span>
              </button>
              <button
                type="button"
                className="flex items-center space-x-2 px-4 py-2 font-semibold rounded-md shadow transition-colors text-sm bg-brand-purple text-white hover:bg-brand-blue"
              >
                <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-white/20 mr-1">
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </span>
                <span>Sign Up</span>
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Blog Post Content */}
      <article className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <header className="mb-12">
          <div className="mb-6">
            <Link href="/inspiration" className="text-brand-purple hover:text-brand-blue hover:underline text-sm">
              ← Back to Inspiration
            </Link>
          </div>
          
          <h1 className="text-gray-900 mb-6 font-bold" style={{ fontSize: '1.5rem' }}>
            {post.title}
          </h1>
          
          <div className="flex items-center gap-6 mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-xl">{post.author.charAt(0)}</span>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 text-lg">{post.author}</h3>
              <p className="text-sm text-gray-500">{post.date} • {post.category}</p>
            </div>
          </div>
          
          <p className="text-xl text-gray-600 leading-relaxed">
            {post.description}
          </p>
        </header>

        {/* Thumbnail Image */}
        <div className="mb-12">
          <img src={post.thumbnail} alt={post.title} className="w-full h-64 md:h-96 object-cover rounded-2xl" />
        </div>

        {/* Content */}
        <div className="prose prose-lg max-w-none">
          {post.content.split('\n\n').map((section, index) => {
            const lines = section.trim().split('\n');
            
            return (
              <section key={index} className="mb-12">
                {lines.map((line, lineIndex) => {
                  // Check if this line looks like a heading (shorter, no period, ends with no punctuation)
                  const isHeading = line.length < 100 && 
                    !line.includes('.') && 
                    !line.includes('!') && 
                    !line.includes('?') &&
                    line.trim().length > 0;
                  
                  if (isHeading) {
                    return (
                      <h2 key={lineIndex} className="font-bold text-gray-900 mb-6" style={{ fontSize: '1.3rem' }}>
                        {line}
                      </h2>
                    );
                  } else {
                    return (
                      <p key={lineIndex} className="font-normal mb-4" style={{ fontSize: '1rem' }}>
                        {line}
                      </p>
                    );
                  }
                })}
              </section>
            );
          })}
        </div>

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <Link href="/inspiration" className="text-brand-purple hover:text-brand-blue hover:underline">
              ← Back to Inspiration
            </Link>
            <div className="text-sm text-gray-500">
              Share this story
            </div>
          </div>
        </footer>
      </article>

      {/* Footer */}
      <footer className="bg-white py-16 border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-gray-500 text-sm">
              © 2025 Maker's Schedule. Built for creators, developers, and builders.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
} 