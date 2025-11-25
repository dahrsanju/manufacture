'use client';

import { useState } from 'react';
import Image from 'next/image';
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Input,
  Breadcrumb,
} from '@/components/ui';
import { brand } from '@/config/brand';
import {
  Search,
  Book,
  HelpCircle,
  MessageCircle,
  Mail,
  Phone,
  FileText,
  Video,
  ChevronRight,
  ChevronDown,
  ExternalLink,
  Lightbulb,
  Zap,
  Package,
  Factory,
  ClipboardCheck,
  BarChart3,
} from 'lucide-react';

const quickStartGuides = [
  {
    id: 'inventory',
    title: 'Inventory Management',
    description: 'Learn how to manage products, stock levels, and transfers',
    icon: Package,
    articles: 12,
  },
  {
    id: 'production',
    title: 'Production & Manufacturing',
    description: 'Work orders, BOMs, and production planning',
    icon: Factory,
    articles: 15,
  },
  {
    id: 'quality',
    title: 'Quality Control',
    description: 'Inspections, defect tracking, and quality metrics',
    icon: ClipboardCheck,
    articles: 8,
  },
  {
    id: 'reports',
    title: 'Reports & Analytics',
    description: 'Generate reports and analyze business data',
    icon: BarChart3,
    articles: 10,
  },
];

const faqs = [
  {
    id: 'faq-1',
    question: 'How do I create a new product?',
    answer: 'Navigate to Inventory > Products and click the "Add Product" button. Fill in the required fields including SKU, name, category, and pricing information. You can also add images and set up inventory tracking options.',
  },
  {
    id: 'faq-2',
    question: 'How do I process a stock transfer?',
    answer: 'Go to Inventory > Transfers > New Transfer. Select the source and destination warehouses, add the products you want to transfer with quantities, and submit the transfer. You can track the transfer status in the transfers list.',
  },
  {
    id: 'faq-3',
    question: 'How do I create a work order?',
    answer: 'Navigate to Production > Work Orders and click "New Work Order". Select the product to manufacture, specify the quantity, assign a warehouse and optionally an assignee, set the schedule, and create the work order.',
  },
  {
    id: 'faq-4',
    question: 'How do I set up a Bill of Materials (BOM)?',
    answer: 'Go to Production > Bill of Materials and click "Create BOM". Select the finished product, add all required components with quantities, specify costs, and save. You can version BOMs and track changes over time.',
  },
  {
    id: 'faq-5',
    question: 'How do I run a quality inspection?',
    answer: 'Navigate to Quality > Inspections and create a new inspection. Select the work order or product batch, perform the checks according to your quality criteria, record results, and submit the inspection report.',
  },
  {
    id: 'faq-6',
    question: 'How do I generate reports?',
    answer: 'Go to Reports & Analytics to view dashboards and KPIs. You can select different time periods, download detailed reports in various formats, and set up scheduled report generation.',
  },
];

const videoTutorials = [
  { id: 'vid-1', title: 'Getting Started with the Dashboard', duration: '5:30' },
  { id: 'vid-2', title: 'Managing Inventory & Stock Levels', duration: '8:45' },
  { id: 'vid-3', title: 'Creating and Tracking Work Orders', duration: '7:20' },
  { id: 'vid-4', title: 'Quality Control Best Practices', duration: '6:15' },
  { id: 'vid-5', title: 'Advanced Reporting Features', duration: '9:00' },
];

export default function HelpPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);

  const filteredFaqs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <Breadcrumb />

      {/* Header */}
      <div className="text-center max-w-2xl mx-auto">
        <div className="flex justify-center mb-4">
          <Image
            src={brand.logo}
            alt={brand.name}
            width={160}
            height={40}
            className="h-10 w-auto object-contain dark:brightness-100 brightness-0"
          />
        </div>
        <h1 className="text-3xl font-bold">{brand.name} Help Center</h1>
        <p className="text-muted-foreground mt-2">
          Find answers, tutorials, and resources to help you get the most out of {brand.name}
        </p>
        <div className="relative mt-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Search for help articles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-12 h-12 text-lg"
          />
        </div>
      </div>

      {/* Quick Start Guides */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Quick Start Guides</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {quickStartGuides.map((guide) => {
            const Icon = guide.icon;
            return (
              <Card key={guide.id} className="hover:border-primary cursor-pointer transition-colors">
                <CardContent className="pt-6">
                  <div className="p-3 rounded-lg bg-primary/10 w-fit mb-4">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-medium">{guide.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{guide.description}</p>
                  <p className="text-xs text-muted-foreground mt-3">{guide.articles} articles</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* FAQs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5" />
            Frequently Asked Questions
          </CardTitle>
          <CardDescription>Quick answers to common questions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {filteredFaqs.map((faq) => (
              <div key={faq.id} className="border rounded-lg">
                <button
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-muted/50"
                  onClick={() => setExpandedFaq(expandedFaq === faq.id ? null : faq.id)}
                >
                  <span className="font-medium">{faq.question}</span>
                  {expandedFaq === faq.id ? (
                    <ChevronDown className="h-5 w-5 text-muted-foreground" />
                  ) : (
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  )}
                </button>
                {expandedFaq === faq.id && (
                  <div className="px-4 pb-4 text-muted-foreground">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
            {filteredFaqs.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No FAQs match your search. Try different keywords or contact support.
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Video Tutorials & Contact */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Video Tutorials */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Video className="h-5 w-5" />
              Video Tutorials
            </CardTitle>
            <CardDescription>Step-by-step video guides</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {videoTutorials.map((video) => (
                <div
                  key={video.id}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded bg-primary/10">
                      <Video className="h-4 w-4 text-primary" />
                    </div>
                    <span className="text-sm">{video.title}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">{video.duration}</span>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4">
              View All Tutorials
              <ExternalLink className="h-4 w-4 ml-2" />
            </Button>
          </CardContent>
        </Card>

        {/* Contact Support */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              Contact Support
            </CardTitle>
            <CardDescription>Get help from our team</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3 p-3 rounded-lg border">
              <div className="p-2 rounded bg-primary/10">
                <MessageCircle className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="font-medium">Live Chat</p>
                <p className="text-sm text-muted-foreground">Available 24/7</p>
              </div>
              <Button size="sm">Start Chat</Button>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg border">
              <div className="p-2 rounded bg-primary/10">
                <Mail className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="font-medium">Email Support</p>
                <p className="text-sm text-muted-foreground">{brand.support.email}</p>
              </div>
              <Button variant="outline" size="sm">Send Email</Button>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg border">
              <div className="p-2 rounded bg-primary/10">
                <Phone className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="font-medium">Phone Support</p>
                <p className="text-sm text-muted-foreground">{brand.support.phone}</p>
              </div>
              <Button variant="outline" size="sm">Call Now</Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Resources */}
      <Card>
        <CardHeader>
          <CardTitle>Additional Resources</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="flex items-start gap-3 p-4 rounded-lg border hover:border-primary cursor-pointer">
              <Book className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <h3 className="font-medium">Documentation</h3>
                <p className="text-sm text-muted-foreground">Complete API and user documentation</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 rounded-lg border hover:border-primary cursor-pointer">
              <Lightbulb className="h-5 w-5 text-warning mt-0.5" />
              <div>
                <h3 className="font-medium">Feature Requests</h3>
                <p className="text-sm text-muted-foreground">Suggest new features and improvements</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 rounded-lg border hover:border-primary cursor-pointer">
              <Zap className="h-5 w-5 text-success mt-0.5" />
              <div>
                <h3 className="font-medium">What's New</h3>
                <p className="text-sm text-muted-foreground">Latest updates and release notes</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Keyboard Shortcuts */}
      <Card>
        <CardHeader>
          <CardTitle>Keyboard Shortcuts</CardTitle>
          <CardDescription>Speed up your workflow with these shortcuts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[
              { keys: '⌘ + K', action: 'Open command palette' },
              { keys: '⌘ + N', action: 'Create new item' },
              { keys: '⌘ + S', action: 'Save current form' },
              { keys: '⌘ + /', action: 'Toggle sidebar' },
              { keys: 'Esc', action: 'Close modal/panel' },
              { keys: '?', action: 'Show keyboard shortcuts' },
            ].map((shortcut) => (
              <div key={shortcut.keys} className="flex items-center justify-between p-2">
                <span className="text-sm">{shortcut.action}</span>
                <kbd className="px-2 py-1 text-xs font-mono bg-muted rounded">{shortcut.keys}</kbd>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
