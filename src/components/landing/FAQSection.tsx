import React, { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle, Cookie } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  {
    id: '1',
    question: 'What types of videos can I summarize with Digestly?',
    answer: 'Digestly supports YouTube videos. We can process educational content, tutorials, lectures, podcasts, webinars, and most other video formats.'
  },
  {
    id: '2',
    question: 'How long does it take to generate a summary?',
    answer: 'Processing time depends on video length. Most videos under 30 minutes are processed within 1-2 minutes. Longer videos may take 3-5 minutes. You\'ll see a progress indicator during processing.'
  },
  {
    id: '3',
    question: 'What summary formats are available?',
    answer: 'Digestly offers multiple summary formats: Quick Overview (key points), Detailed Summary (comprehensive breakdown), Bullet Points (structured list), and Custom Notes (tailored to your needs).'
  },
  {
    id: '4',
    question: 'How does the credit system work?',
    answer: 'Each video summary costs 1 credit. Free accounts get 5 credits monthly. Pro plans include more credits with rollover options. Credits are consumed only when summaries are successfully generated.'
  },
  {
    id: '5',
    question: 'Can I export or share my summaries?',
    answer: 'Yes! Summaries can be exported as PDF or markdown. You can also copy formatted text directly to your clipboard.'
  },
//   {
//     id: '6',
//     question: 'Is there a limit on video length?',
//     answer: 'Free accounts can process videos up to 60 minutes. Pro accounts support videos up to 3 hours. For longer content, consider breaking it into segments for better results.'
//   },
  {
    id: '7',
    question: 'How accurate are the AI-generated summaries?',
    answer: 'Our AI achieves 90%+ accuracy for clear audio content. Accuracy may vary with heavy accents, background noise, or highly technical jargon. We continuously improve our models based on user feedback.'
  },
  {
    id: '8',
    question: 'Do you support multiple languages?',
    answer: 'Currently, Digestly supports only suppurts English. Support for other languages will come soon.'
  }
];

interface FAQItemProps {
  item: FAQItem;
  isOpen: boolean;
  onToggle: () => void;
}

const FAQItemComponent: React.FC<FAQItemProps> = ({ item, isOpen, onToggle }) => {
  return (
    <Card className="transition-all duration-200 hover:shadow-md">
      <CardContent className="p-0">
        <button
          onClick={onToggle}
          className="w-full p-6 text-left flex items-center justify-between hover:bg-muted/50 transition-colors duration-200"
          aria-expanded={isOpen}
        >
          <h3 className="text-lg font-semibold pr-4 text-foreground">
            {item.question}
          </h3>
          <div className="flex-shrink-0">
            {isOpen ? (
              <ChevronUp className="h-5 w-5 text-primary" />
            ) : (
              <ChevronDown className="h-5 w-5 text-muted-foreground" />
            )}
          </div>
        </button>
        
        {isOpen && (
          <div className="px-6 pb-6 animate-in slide-in-from-top-2 duration-200">
            <div className="text-muted-foreground leading-relaxed border-t pt-4">
              {item.answer}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const FAQSection: React.FC = () => {
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());

  const toggleItem = (id: string) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(id)) {
      newOpenItems.delete(id);
    } else {
      newOpenItems.add(id);
    }
    setOpenItems(newOpenItems);
  };

  const toggleAll = () => {
    if (openItems.size === faqData.length) {
      setOpenItems(new Set());
    } else {
      setOpenItems(new Set(faqData.map(item => item.id)));
    }
  };

  return (
    <section className="py-16 px-4 bg-background">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Cookie className="h-8 w-8 text-primary cookie-btn-icon" />
            <HelpCircle className="h-8 w-8 text-primary" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Everything you need to know about Digestly and how it transforms your videos into summaries
          </p>
        </div>

        {/* Controls */}
        <div className="flex justify-center mb-8">
          <button
            onClick={toggleAll}
            className="text-sm text-primary hover:text-primary/80 font-medium transition-colors duration-200 flex items-center gap-2"
          >
            {openItems.size === faqData.length ? (
              <>
                <ChevronUp className="h-4 w-4" />
                Collapse All
              </>
            ) : (
              <>
                <ChevronDown className="h-4 w-4" />
                Expand All
              </>
            )}
          </button>
        </div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {faqData.map((item) => (
            <FAQItemComponent
              key={item.id}
              item={item}
              isOpen={openItems.has(item.id)}
              onToggle={() => toggleItem(item.id)}
            />
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-12 p-8 bg-muted rounded-lg">
          <h3 className="text-xl font-semibold mb-2">
            Still have questions?
          </h3>
          <p className="text-muted-foreground mb-4">
            Can't find what you're looking for? Get in touch with our support team.
          </p>
          <button className="bg-primary text-primary-foreground px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors duration-200 font-medium">
            Contact Support
          </button>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;