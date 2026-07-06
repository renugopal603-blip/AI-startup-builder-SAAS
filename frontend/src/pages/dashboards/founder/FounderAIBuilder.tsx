import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Lightbulb, FileText, BarChart3, Search, ClipboardList, MessageSquare, RefreshCw, Play } from 'lucide-react';
import FounderIdeaGenerator from './FounderIdeaGenerator';
import FounderBusinessPlan from './FounderBusinessPlan';
import FounderPitchDeck from './FounderPitchDeck';
import FounderMarketResearch from './FounderMarketResearch';
import FounderReports from './FounderReports';
import FounderAIChat from './FounderAIChat';

const tabs = [
  { id: 'idea',     label: 'AI Idea Generator',    icon: Lightbulb,    component: FounderIdeaGenerator },
  { id: 'plan',     label: 'Business Plan',         icon: FileText,     component: FounderBusinessPlan },
  { id: 'pitch',    label: 'Pitch Deck',             icon: BarChart3,    component: FounderPitchDeck },
  { id: 'market',   label: 'Market Research',        icon: Search,       component: FounderMarketResearch },
  { id: 'reports',  label: 'AI Reports',             icon: ClipboardList,component: FounderReports },
  { id: 'chat',     label: 'AI Chat',                icon: MessageSquare,component: FounderAIChat },
];

const FounderAIBuilder: React.FC = () => {
  const [active, setActive] = useState('idea');
  const [startupData, setStartupData] = useState<any>(null);
  const [allStartups, setAllStartups] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState('');
  const [searchParams, setSearchParams] = useSearchParams();
  const startupId = searchParams.get('id') || searchParams.get('startupId');

  useEffect(() => {
    const fetchStartup = async () => {
      if (!startupId) {
        // Load all startups if no specific ID is provided
        const keys = Object.keys(localStorage);
        const locals: any[] = [];
        keys.forEach(key => {
          if (key.startsWith('startup_')) {
            try {
              locals.push(JSON.parse(localStorage.getItem(key) || ''));
            } catch (e) {}
          }
        });
        // Sort by newest first
        locals.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setAllStartups(locals);
        return;
      }
      
      setLoading(true);
      setError('');
      try {
        const savedData = localStorage.getItem(startupId);
        if (savedData) {
          setStartupData(JSON.parse(savedData));
        } else {
          setError('Could not load startup data. It may not exist.');
        }
      } catch (err) {
        setError('Failed to load from local storage.');
      } finally {
        setLoading(false);
      }
    };

    fetchStartup();
  }, [startupId]);

  const handleGenerate = async () => {
    if (!startupId || !startupData) return;
    setGenerating(true);
    setError('');

    try {
      // Mock AI generation delay for demo purposes
      await new Promise(resolve => setTimeout(resolve, 3500));
      
      const generatedOutput = {
        ideaAnalysis: {
          refinedStartupIdea: `A premium, tech-enabled luxury brand for ${startupData.startupName}. ${startupData.startupIdea}. We elevate this concept by integrating sustainable sourcing, artisanal craftsmanship, and a hyper-personalized digital customer journey.`,
          problemStatement: `The current market is saturated with mass-produced, low-quality alternatives that fail to deliver a memorable experience. Modern consumers, particularly high-earning millennials and Gen-Z, are increasingly dissatisfied with generic offerings. They are actively seeking out brands that offer not just a product, but a premium lifestyle aesthetic, ethical transparency, and a frictionless digital purchasing experience. Existing competitors compromise on either design, quality, or technological convenience, leaving a significant gap in the market for a truly elevated offering.`,
          solution: `We are building a highly curated, modernized ecosystem for ${startupData.startupName} that focuses relentlessly on aesthetic superiority, high-quality materials, and a seamless omnichannel customer experience. By combining artisanal product quality with cutting-edge e-commerce technology, an intuitive mobile app, and bespoke unboxing experiences, we provide a product that acts as a status symbol and a daily luxury.`,
          targetCustomers: [
            "High-Net-Worth Individuals (HNWIs) seeking premium lifestyle products.",
            "Design-conscious Millennials & Gen Z who value brand aesthetics and sustainability.",
            "Corporate Clients looking for high-end gifting and wellness packages.",
            "Urban professionals with high disposable income who prioritize convenience without sacrificing quality."
          ],
          uniqueValueProposition: `We are the only brand in the ${startupData.startupName} space that seamlessly merges heritage-level product quality with Silicon Valley-level digital convenience, wrapped in an uncompromisingly premium visual identity.`,
          businessModel: "Direct-to-consumer (D2C) e-commerce with a high-margin monthly subscription tier for recurring revenue, supplemented by lucrative B2B corporate partnerships.",
          revenueModel: "1. High-margin single product sales (65%+ gross margin). 2. 'VIP Club' recurring monthly subscriptions providing exclusive early access and curated boxes. 3. High-ticket B2B bulk orders for corporate gifting.",
          coreFeatures: [
            "Ultra-Premium Branding & Sustainable Packaging",
            "AI-Powered Personalization & Recommendation Engine",
            "Smart Inventory & Frictionless Subscription Management",
            "Exclusive Tiered Loyalty Program with Experiential Rewards"
          ],
          marketOpportunity: "We are entering a market undergoing rapid premiumization. Consumers are willing to pay a 30-50% price premium for superior design and ethical sourcing, unlocking a highly profitable niche within a multi-billion dollar global industry.",
          nextSteps: [
            "Phase 1: Finalize core brand identity, logo, and premium packaging design.",
            "Phase 2: Secure exclusive contracts with top-tier, sustainable material suppliers.",
            "Phase 3: Develop and launch a high-converting MVP landing page to build an early-adopter waitlist."
          ]
        },
        businessPlan: {
          executiveSummary: `${startupData.startupName} is poised to disrupt the market by introducing a hyper-focus on premium look, feel, and digital design. In an industry plagued by commoditization, we elevate an everyday product into a highly sought-after luxury experience. Our founding team brings together deep expertise in digital product design, supply chain optimization, and luxury retail. By targeting the rapidly expanding demographic of design-conscious consumers who prioritize aesthetics and quality over price, we project reaching $2.5M ARR within 24 months of launch, driven by a robust D2C subscription engine and high organic social media virality.`,
          problemAndSolution: "Problem: The market is currently dominated by uninspired, generic options that lack brand soul and digital sophistication. Consumers are forced to choose between overpriced legacy brands with poor digital experiences or cheap, low-quality alternatives.\n\nSolution: A highly curated, design-first brand that makes customers feel special. We offer a meticulously crafted product line supported by a beautiful, intuitive app and eco-friendly packaging that creates a highly shareable unboxing moment.",
          marketOpportunity: "We are strategically targeting the top 15% of the market. This segment is highly resilient to economic downturns and exhibits immense brand loyalty when their aesthetic and ethical standards are met. The total addressable market is valued at over $50B, with the premium segment growing at 3x the rate of the broader market. Our initial focus will be on tier-1 urban centers in North America before expanding globally.",
          productAndFeatures: [
            "Curated Premium Selection: Limited-edition drops and highly curated core product lines.",
            "Beautiful Eco-friendly Packaging: Designed specifically for the 'unboxing' social media trend.",
            "Seamless Digital Ordering: One-click purchasing, Apple Pay integration, and AI-driven recommendations.",
            "VIP Member Dashboard: Custom portal for subscribers to manage deliveries and access exclusive perks."
          ],
          businessModel: "Our financial engine is built on high-margin D2C sales (projected 65-70% gross margins) coupled with a sticky recurring revenue subscription tier. This hybrid model ensures both high immediate cash flow from impulse purchases and predictable long-term LTV from subscribers.",
          goToMarketStrategy: "Our GTM is entirely digitally-native and brand-led. We will leverage micro-influencer partnerships, highly aesthetic Instagram and TikTok lifestyle campaigns, and exclusive pop-up experiential retail events in cities like New York, Los Angeles, and London to build initial hype and exclusivity.",
          competitiveAnalysis: "Unlike mass-market competitors who compete on price in a race to the bottom, we compete on brand equity and customer experience. We differentiate entirely through superior visual identity, exclusive community feel, and flawless customer service, building a defensible moat based on brand love.",
          teamSuggestion: "To execute this vision, the founding team must be supplemented with a world-class Creative Director to maintain the visual identity, a Growth Hacker specializing in D2C e-commerce, and an Operations Lead to ensure the premium supply chain remains robust and scalable.",
          financialProjection: "Year 1: $500k ARR focusing on initial market penetration and brand building. Year 2: $2.5M ARR driven by scaling the subscription tier and B2B channels. Break-even is aggressively targeted for Month 14, with gross margins stabilizing at 68% at scale.",
          fundingAsk: "We are seeking a $500k Pre-Seed investment. Use of funds: 40% Product Development & Inventory, 35% Brand & Marketing Launch, 25% Key Hires and Operations runway."
        },
        pitchDeck: [
          { slideTitle: "Cover Slide", content: `${startupData.startupName}: Premium Redefined.\nElevating the everyday through uncompromising design and technology.` },
          { slideTitle: "Problem", content: "The market is flooded with generic, low-quality, and uninspiring options that fail to resonate with modern premium consumers. Legacy brands lack digital agility." },
          { slideTitle: "Solution", content: "A design-first, tech-enabled premium experience. We offer superior products, breathtaking packaging, and a frictionless digital journey." },
          { slideTitle: "Market Size", content: "$50B Global TAM. $5B Premium SAM. $50M SOM for initial rollout. The premium segment is the fastest-growing category, expanding at 12% YoY." },
          { slideTitle: "Product Demo", content: "Sleek, minimalist product design paired with a beautiful mobile app for seamless ordering, subscription management, and VIP access." },
          { slideTitle: "Business Model", content: "D2C e-commerce with 65%+ gross margins. A powerful recurring subscription engine drives high Customer Lifetime Value (LTV)." },
          { slideTitle: "Traction", content: "Over 2,500 highly-engaged users on our early-access waitlist. 3 signed LOIs for B2B corporate gifting partnerships." },
          { slideTitle: "Go-To-Market", content: "Aesthetic-driven organic social (TikTok/IG), micro-influencer seeding, and exclusive, invite-only launch events in tier-1 cities." },
          { slideTitle: "Team", content: "A complementary team of founders with proven track records in luxury retail design, supply chain logistics, and D2C growth marketing." },
          { slideTitle: "Funding Ask", content: "Raising $500k Pre-Seed to finalize MVP manufacturing, scale initial inventory, and aggressively fund our launch marketing motion." }
        ],
        marketResearch: {
          tam: "$50.0 Billion",
          sam: "$5.0 Billion",
          som: "$50.0 Million",
          targetMarket: "Urban professionals, high-earning Millennials, and Gen Z consumers with significant disposable income and a strong preference for aesthetic brands.",
          customerSegments: [
            "Aesthetic-driven lifestyle buyers",
            "Premium gift shoppers seeking unique items",
            "Corporate wellness and HR gifting programs"
          ],
          competitors: [
            "Traditional Legacy Brands (High awareness, poor digital experience)",
            "Local Niche Boutiques (High quality, low scalability)",
            "Mass Market D2C Brands (High scale, low premium perception)"
          ],
          marketTrends: [
            "Massive shift towards 'premiumization' in everyday goods.",
            "The critical importance of the 'unboxing' experience for organic social sharing.",
            "Rising demand for ethical transparency paired with luxury aesthetics."
          ],
          opportunities: [
            "Lucrative corporate B2B gifting packages with high ACV.",
            "Limited edition 'drop' models (hype-culture) to drive immediate sales spikes.",
            "International expansion into emerging premium markets (e.g., Middle East, Asia)."
          ],
          risks: [
            "High supply chain costs for premium, sustainable materials.",
            "Sensitivity to macro-economic downturns affecting discretionary luxury spending.",
            "Intense competition for digital ad space driving up Customer Acquisition Cost (CAC)."
          ],
          pricingSuggestions: [
            "Adopt premium pricing (20-30% above market average) to reinforce brand value and exclusivity.",
            "Introduce a highly-priced 'Hero' product to anchor the rest of the catalog.",
            "Offer a slight discount for locking into a 6-month subscription."
          ]
        },
        aiReport: {
          investmentReadinessScore: 92,
          startupScoreReason: "Exceptionally strong brand vision, clear market differentiation through design, and a highly scalable, high-margin D2C business model.",
          keyStrengths: [
            "Clear, unapologetic focus on premium aesthetics and customer experience.",
            "Identified a highly lucrative gap in a traditional, sleepy market.",
            "Excellent potential for high gross margins and recurring subscription revenue."
          ],
          riskFactors: [
            "Execution depends almost entirely on flawless branding and visual identity.",
            "Potential margin squeeze if premium suppliers raise costs.",
            "Risk of early inventory stockouts if the brand goes viral prematurely."
          ],
          improvementSuggestions: [
            "Develop a highly targeted, data-driven customer acquisition strategy to keep CAC low.",
            "Secure reliable, secondary high-quality manufacturing partners early to mitigate supply chain risks.",
            "Consider filing design patents or trademarks early to protect the brand's visual moat."
          ],
          fundingReadiness: "Highly Ready. Excellent candidate for Pre-Seed or Angel investment from consumer-focused or D2C-specialized funds.",
          mentorReviewSummary: "A fantastic, highly investable concept. The market is hungry for elevated experiences. Your success will rely entirely on your visual execution, maintaining an impeccable customer experience, and keeping a tight grip on unit economics as you scale."
        }
      };

      const updatedStartup = {
        ...startupData,
        status: 'generated',
        aiGenerated: generatedOutput
      };
      
      // Save back to local storage
      localStorage.setItem(startupId, JSON.stringify(updatedStartup));
      setStartupData(updatedStartup);
    } catch (err) {
      setError('AI generation failed. Please try again.');
      setStartupData(prev => prev ? { ...prev, status: 'failed' } : null);
    } finally {
      setGenerating(false);
    }
  };

  const ActiveComponent = tabs.find(t => t.id === active)!.component;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 animate-fade-in-up">
        <RefreshCw size={32} className="animate-spin text-[#5B21B6] mb-4" />
        <h2 className="text-xl font-bold text-gray-900">Loading your startup...</h2>
      </div>
    );
  }

  if (!startupId) {
    return (
      <div className="animate-fade-in-up pb-10">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">AI Builder</h1>
          <p className="text-gray-500 mt-1">Select a startup idea to generate or view its AI-powered documents.</p>
        </div>

        {allStartups.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
            <div className="w-16 h-16 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lightbulb size={24} className="text-[#5B21B6]" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">No startup ideas found</h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">You haven't added any startup ideas yet. Go to 'My Startups' to add your first idea.</p>
            <button 
              onClick={() => window.location.href = '/dashboard/founder/startups'}
              className="px-6 py-2.5 bg-[#5B21B6] text-white font-bold rounded-xl shadow-md"
            >
              Go to My Startups
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allStartups.map(startup => (
              <div key={startup.startupId} className="bg-white border border-gray-200 rounded-xl p-6 hover:border-[#5B21B6]/30 hover:shadow-md transition-all group flex flex-col h-full">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 bg-purple-100 text-purple-700 rounded-xl flex items-center justify-center font-black text-xl shadow-sm">
                    {startup.startupName.charAt(0)}
                  </div>
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-md border ${
                    startup.status === 'generated' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-yellow-50 text-yellow-700 border-yellow-200'
                  }`}>
                    {startup.status === 'generated' ? 'Generated' : 'Draft'}
                  </span>
                </div>
                
                <h3 className="text-lg font-bold text-gray-900 mb-2">{startup.startupName}</h3>
                <p className="text-sm text-gray-500 mb-6 flex-1 line-clamp-3">{startup.startupIdea}</p>
                
                <div className="flex gap-2 mt-auto pt-4 border-t border-gray-100">
                  <button 
                    onClick={() => setSearchParams({ startupId: startup.startupId })}
                    className="flex-1 py-2 bg-purple-50 hover:bg-[#5B21B6] text-[#5B21B6] hover:text-white rounded-lg font-bold text-sm transition-colors border border-purple-100 hover:border-[#5B21B6]"
                  >
                    View Details
                  </button>
                  <button 
                    onClick={() => {
                      if (window.confirm('Are you sure you want to delete this startup?')) {
                        localStorage.removeItem(startup.startupId);
                        setAllStartups(prev => prev.filter(s => s.startupId !== startup.startupId));
                      }
                    }}
                    className="px-4 py-2 bg-red-50 hover:bg-red-600 text-red-600 hover:text-white rounded-lg font-bold text-sm transition-colors border border-red-100 hover:border-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  if (startupData?.status === 'generating' || generating) {
    return (
      <div className="flex flex-col items-center justify-center py-20 animate-fade-in-up">
        <RefreshCw size={48} className="animate-spin text-[#5B21B6] mb-6" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">AI is analyzing your startup idea...</h2>
        <p className="text-gray-500 max-w-md text-center">
          Generating business plan, pitch deck, market research, and reports...
        </p>
      </div>
    );
  }

  if (startupData?.status === 'pending_analysis' || startupData?.status === 'failed') {
    return (
      <div className="animate-fade-in-up pb-10 max-w-3xl mx-auto mt-10">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
          <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Lightbulb size={32} className="text-[#5B21B6]" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{startupData.startupName}</h1>
          <p className="text-gray-600 text-lg mb-8">{startupData.startupIdea}</p>

          {error && <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl font-bold text-sm">{error}</div>}

          <div className="bg-purple-50 rounded-xl p-6 mb-8 border border-purple-100">
            <h3 className="font-bold text-purple-900 mb-2">Your startup idea is ready for AI analysis.</h3>
            <p className="text-purple-700 text-sm">
              Our AI will generate a complete business plan, pitch deck, market research, and readiness report based on your idea.
            </p>
          </div>

          <button
            onClick={handleGenerate}
            disabled={generating}
            className="inline-flex items-center px-8 py-3.5 bg-[#5B21B6] hover:bg-[#7C3AED] text-white font-bold rounded-xl transition-all shadow-md shadow-purple-900/20 active:scale-95 text-lg"
          >
            <Play size={20} className="mr-3 fill-current" />
            Analyze & Generate with AI
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in-up">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">AI Builder</h1>
        <p className="text-gray-500 mt-1">All your AI-powered startup tools in one place.</p>
      </div>
      
      {error && <div className="mb-4 p-4 bg-red-50 text-red-600 rounded-xl font-bold text-sm">{error}</div>}

      {/* Tab Bar */}
      <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-7 overflow-x-auto flex-wrap">
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setActive(t.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition-all duration-200 ${
              active === t.id
                ? 'bg-white text-[#5B21B6] shadow-sm'
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            <t.icon size={15} /> {t.label}
          </button>
        ))}
      </div>

      {startupData && startupData.status === 'generated' && (
        <ActiveComponent startupData={startupData} setStartupData={setStartupData} />
      )}
    </div>
  );
};

export default FounderAIBuilder;
