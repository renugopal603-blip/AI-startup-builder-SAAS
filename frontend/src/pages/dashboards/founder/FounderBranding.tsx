import React from 'react';
import { Palette, Type, PenTool, LayoutTemplate, Share2, Sparkles, Image as ImageIcon, HeartHandshake, Instagram, Layout } from 'lucide-react';

interface FounderBrandingProps {
  branding: any;
}

const FounderBranding: React.FC<FounderBrandingProps> = ({ branding }) => {
  if (!branding) return null;

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Logo & Branding Suggestions</h2>
          <p className="text-sm text-gray-500 mt-1">AI-generated brand identity and visual guidelines for your startup.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Brand Names & Taglines */}
        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-violet-50 flex items-center justify-center">
              <Type className="text-[#5B21B6]" size={20} />
            </div>
            <h3 className="text-lg font-bold text-gray-900">Brand Identity</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Name Suggestions</h4>
              <div className="flex flex-wrap gap-2">
                {branding.brandNameSuggestions?.map((name: string, i: number) => (
                  <span key={i} className="px-3 py-1 bg-gray-50 text-gray-800 rounded-lg text-sm border border-gray-100 font-medium">{name}</span>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Taglines</h4>
              <ul className="space-y-2">
                {branding.taglineSuggestions?.map((tagline: string, i: number) => (
                  <li key={i} className="text-sm text-gray-700 italic border-l-2 border-[#5B21B6] pl-3">"{tagline}"</li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                <HeartHandshake size={14} /> Brand Personality
              </h4>
              <p className="text-sm text-gray-700 font-medium">{branding.brandPersonality}</p>
            </div>
          </div>
        </div>

        {/* Visuals & Colors */}
        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-pink-50 flex items-center justify-center">
              <Palette className="text-pink-600" size={20} />
            </div>
            <h3 className="text-lg font-bold text-gray-900">Visual Guidelines</h3>
          </div>
          
          <div className="space-y-5">
            <div>
              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Color Palette</h4>
              <div className="flex flex-wrap gap-3">
                {branding.brandColorPalette?.map((colorStr: string, i: number) => {
                  const hexMatch = colorStr.match(/#[0-9A-Fa-f]{6}/);
                  const hex = hexMatch ? hexMatch[0] : '#ccc';
                  return (
                    <div key={i} className="flex flex-col items-center gap-1">
                      <div className="w-10 h-10 rounded-full border border-gray-200 shadow-inner" style={{ backgroundColor: hex }}></div>
                      <span className="text-[10px] text-gray-500 font-medium truncate w-16 text-center" title={colorStr}>{colorStr.split(' ')[0]}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 flex items-center gap-1">
                <PenTool size={14} /> Fonts
              </h4>
              <p className="text-sm text-gray-700">{branding.fontStyleSuggestions}</p>
            </div>
            
            <div>
              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 flex items-center gap-1">
                <ImageIcon size={14} /> Logo Concept
              </h4>
              <p className="text-sm text-gray-700">{branding.logoConceptIdeas}</p>
            </div>
          </div>
        </div>

        {/* Packaging / UI & Social Media */}
        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm md:col-span-2">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
              <Sparkles className="text-blue-600" size={20} />
            </div>
            <h3 className="text-lg font-bold text-gray-900">Application & Marketing</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                  <LayoutTemplate size={14} /> Packaging / UI Style
                </h4>
                <p className="text-sm text-gray-700">{branding.packagingStyleSuggestions}</p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                  <Layout size={14} /> Website Hero Copy
                </h4>
                <p className="text-sm font-medium text-gray-900">{branding.websiteHero}</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                  <Share2 size={14} /> Social Media Strategy
                </h4>
                <p className="text-sm text-gray-700">{branding.socialMediaIdeas}</p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                  <Instagram size={14} /> Marketing Captions
                </h4>
                <ul className="space-y-1">
                  {branding.marketingCaptions?.map((caption: string, i: number) => (
                    <li key={i} className="text-sm text-gray-700 border-l-2 border-blue-400 pl-2">{caption}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default FounderBranding;
