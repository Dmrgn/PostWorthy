import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  ArrowRight,
  CheckCircle,
  BarChart3,
  Search,
  FileText,
  Bot,
  Twitter,
  Linkedin,
  Github,
  Mail,
} from "lucide-react"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <div className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-600">
              <BarChart3 className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold">Adsistance</span>
          </div>

          <nav className="hidden md:flex items-center space-x-6">
            <a href="#features" className="text-sm font-medium hover:text-orange-600 transition-colors">
              Features
            </a>
            <a href="#contact" className="text-sm font-medium hover:text-orange-600 transition-colors">
              Contact
            </a>
          </nav>

          <div className="flex items-center space-x-4">
            <Button variant="ghost" className="hidden md:inline-flex" asChild>
              <a href="/app">Source Code
                <Github></Github>
              </a>
            </Button>
            <Button asChild className="bg-orange-600 hover:bg-orange-700">
              <a href="/app">
                Try Now
                <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="relative py-20 md:py-32 md:px-20 overflow-hidden">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <Badge variant="secondary" className="w-fit bg-orange-100 text-orange-800">
                    🚀 Open Beta
                  </Badge>
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    AI-Powered Content Insights,
                    <span className="text-orange-600"> Instantly</span>
                  </h1>
                  <p className="max-w-[600px] text-gray-500 md:text-xl">
                    Adsistance helps you understand your audience and generate high-performing content. Scrape posts, analyze trends, and create engaging content with ease.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button size="lg" className="bg-orange-600 hover:bg-orange-700" asChild>
                    <a href="/app">
                      Try Now
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                </div>
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center">
                    <CheckCircle className="mr-1 h-4 w-4 text-green-500" />
                    Free to use
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="mr-1 h-4 w-4 text-green-500" />
                    No account required
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <img
                  src="/placeholder.svg?height=400&width=600"
                  width={600}
                  height={400}
                  alt="Adsistance Dashboard"
                  className="aspect-video overflow-hidden rounded-xl object-cover shadow-2xl"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 bg-gray-50">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <Badge variant="secondary" className="bg-orange-100 text-orange-800">Features</Badge>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Unlock Content Superpowers</h2>
                <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Our tools are designed to give you a competitive edge in content creation.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-2 lg:gap-12">
              <div className="flex flex-col justify-center space-y-8">
                <div className="grid gap-6">
                  <div className="flex items-start space-x-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-orange-100">
                      <Search className="h-6 w-6 text-orange-600" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-xl font-bold">Subreddit Post Scraper</h3>
                      <p className="text-gray-500">
                        Gather posts from any subreddit to analyze what's trending and what your audience is talking about.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
                      <FileText className="h-6 w-6 text-green-600" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-xl font-bold">In-Depth Content Analysis</h3>
                      <p className="text-gray-500">
                        Our AI analyzes scraped posts to identify keywords, topics, sentiment, and engagement patterns.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100">
                      <Bot className="h-6 w-6 text-purple-600" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-xl font-bold">AI-Powered Post Generation</h3>
                      <p className="text-gray-500">
                        Generate high-quality, engaging posts based on the insights from your content analysis.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <img
                src="/placeholder.svg?height=500&width=600"
                width={600}
                height={500}
                alt="Features"
                className="mx-auto aspect-video overflow-hidden rounded-xl object-cover"
              />
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="py-20">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Ready to supercharge your content?</h2>
                <p className="mx-auto max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Start using Adsistance now and take your content strategy to the next level.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Button size="lg" className="bg-orange-600 hover:bg-orange-700" asChild>
                  <a href="/app">
                    Try Now for Free
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer id="contact" className="border-t bg-gray-50">
        <div className="container px-4 md:px-6 py-12">
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-600">
                  <BarChart3 className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold">Adsistance</span>
              </div>
              <p className="text-sm text-gray-500">
                AI-powered content insights and generation.
              </p>
              <div className="flex space-x-4">
                <a href="https://x.com/danielisokayig" className="text-gray-400 hover:text-gray-600">
                  <Twitter className="h-5 w-5" />
                </a>
                <a href="https://linkedin.danielmorgan.xyz" className="text-gray-400 hover:text-gray-600">
                  <Linkedin className="h-5 w-5" />
                </a>
                <a href="https://github.com/dmrgn/" className="text-gray-400 hover:text-gray-600">
                  <Github className="h-5 w-5" />
                </a>
                <a href="mailto:me@danielmorgan.xyz" className="text-gray-400 hover:text-gray-600">
                  <Mail className="h-5 w-5" />
                </a>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-semibold">Product</h4>
              <div className="space-y-2 text-sm">
                <a href="#features" className="block text-gray-500 hover:text-gray-900">
                  Features
                </a>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-semibold">Company</h4>
              <div className="space-y-2 text-sm">
                <a href="mailto:me@danielmorgan.xyz" className="block text-gray-500 hover:text-gray-900">
                  Contact
                </a>
              </div>
            </div>

          </div>

          <div className="mt-8 border-t pt-8 flex flex-col sm:flex-row justify-between items-center">
            <p className="text-xs text-gray-500">© {new Date().getFullYear()} Adsistance. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
