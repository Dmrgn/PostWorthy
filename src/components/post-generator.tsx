import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Zap, Sparkles, CheckCircle } from "lucide-react"

interface PostGeneratorProps {
  analysis: any
  ragContext: any
  onComplete: (data: { posts: any[] }) => void
}

export default function PostGenerator({ analysis, ragContext, onComplete }: PostGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedPosts, setGeneratedPosts] = useState<any[]>([])
  const [progress, setProgress] = useState(0)
  const [customPrompt, setCustomPrompt] = useState("")
  const [creativity, setCreativity] = useState([0.7])
  const [postCount] = useState(20)

  const startGeneration = async () => {
    setIsGenerating(true)
    setProgress(0)

    try {
      // Simulate agentic generation with progress updates
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 95) {
            clearInterval(progressInterval)
            return prev
          }
          return prev + Math.random() * 8
        })
      }, 800)

      // Simulate API call to Cerebras
      await new Promise((resolve) => setTimeout(resolve, 8000))

      // Mock generated posts
      const mockPosts = Array.from({ length: postCount }, (_, i) => ({
        id: i + 1,
        content: generateMockPost(i, analysis),
        score: Math.random() * 100,
        engagement_prediction: Math.random() * 1000,
        relevance_score: Math.random() * 100,
        brand_alignment: Math.random() * 100,
        format: ["text", "question", "tip", "story"][Math.floor(Math.random() * 4)],
        hashtags: generateHashtags(analysis),
        estimated_reach: Math.floor(Math.random() * 10000) + 1000,
      }))

      clearInterval(progressInterval)
      setProgress(100)
      setGeneratedPosts(mockPosts)
      setIsGenerating(false)
    } catch (error) {
      console.error("Generation failed:", error)
      setIsGenerating(false)
    }
  }

  const generateMockPost = (index: number, analysis: any) => {
    const templates = [
      `🚀 Just discovered an amazing ${analysis?.keywords?.[0]?.word || "marketing"} strategy that increased engagement by 40%! Here's what worked:\n\n• Focus on authentic storytelling\n• Use data-driven insights\n• Engage with your community\n\nWhat's your go-to strategy? 👇`,

      `💡 Quick tip: The best ${analysis?.keywords?.[1]?.word || "content"} performs 3x better when you:\n\n✅ Ask questions in your posts\n✅ Share behind-the-scenes content\n✅ Use relevant hashtags strategically\n\nTry this approach and watch your engagement soar! 📈`,

      `🤔 Unpopular opinion: ${analysis?.keywords?.[2]?.word || "social media"} success isn't about follower count.\n\nIt's about:\n→ Building genuine connections\n→ Providing real value\n→ Staying consistent\n\nQuality > Quantity every time. Agree? 🎯`,

      `📊 Data doesn't lie: Posts with ${analysis?.keywords?.[0]?.word || "strategy"} in the title get 60% more clicks.\n\nBut here's the catch - it only works if your content delivers on the promise.\n\nAlways lead with value, not just catchy headlines. 💪`,

      `🔥 Hot take: The future of ${analysis?.keywords?.[1]?.word || "marketing"} is personal.\n\nBrands that share their story, values, and mission will win.\n\nPeople don't just buy products - they buy into beliefs.\n\nWhat does your brand stand for? 🌟`,
    ]

    return templates[index % templates.length]
  }

  const generateHashtags = (analysis: any) => {
    const baseHashtags = ["#marketing", "#socialmedia", "#content", "#strategy", "#business"]
    const analysisHashtags = analysis?.keywords?.slice(0, 3).map((k: any) => `#${k.word.replace(" ", "")}`) || []
    return [...baseHashtags.slice(0, 3), ...analysisHashtags].slice(0, 5)
  }

  const handleComplete = () => {
    onComplete({ posts: generatedPosts })
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-medium text-slate-900 mb-2">AI Post Generation</h3>
        <p className="text-slate-600">
          Using Cerebras inference for fast, agentic content creation based on your analysis and brand context
        </p>
      </div>

      {!isGenerating && generatedPosts.length === 0 && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Generation Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="custom-prompt">Additional Instructions (Optional)</Label>
                <Textarea
                  id="custom-prompt"
                  placeholder="e.g., Focus on B2B audience, include call-to-actions, maintain professional tone..."
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  className="mt-2"
                />
              </div>

              <div>
                <Label>Creativity Level: {creativity[0]}</Label>
                <Slider
                  value={creativity}
                  onValueChange={setCreativity}
                  max={1}
                  min={0.1}
                  step={0.1}
                  className="mt-2"
                />
                <div className="flex justify-between text-xs text-slate-500 mt-1">
                  <span>Conservative</span>
                  <span>Balanced</span>
                  <span>Creative</span>
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-lg">
                <h4 className="font-medium text-slate-900 mb-2">Generation Context</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-slate-600">Analysis Data:</span>
                    <p className="font-medium">✓ Keywords, topics, sentiment</p>
                  </div>
                  <div>
                    <span className="text-slate-600">Brand Context:</span>
                    <p className="font-medium">✓ {ragContext?.files?.length || 0} documents</p>
                  </div>
                  <div>
                    <span className="text-slate-600">Posts to Generate:</span>
                    <p className="font-medium">{postCount} unique posts</p>
                  </div>
                  <div>
                    <span className="text-slate-600">AI Model:</span>
                    <p className="font-medium">Cerebras (Fast Inference)</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="text-center">
            <Button onClick={startGeneration} size="lg" className="bg-purple-600 hover:bg-purple-700 text-white">
              <Zap className="w-5 h-5 mr-2" />
              Generate 20 Posts
            </Button>
          </div>
        </div>
      )}

      {isGenerating && (
        <Card>
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-purple-600 mr-3 animate-pulse" />
                <h3 className="text-xl font-medium">AI Generation in Progress</h3>
              </div>

              <div className="max-w-md mx-auto">
                <div className="flex justify-between text-sm mb-2">
                  <span>Generating posts with Cerebras...</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>

              <div className="text-sm text-slate-600 space-y-1">
                <p>🧠 Analyzing successful post patterns</p>
                <p>📝 Creating contextual content</p>
                <p>🎯 Optimizing for engagement</p>
                <p>⚡ Fast inference with Cerebras</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {generatedPosts.length > 0 && !isGenerating && (
        <div className="space-y-6">
          <Card className="border-green-200 bg-green-50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center text-green-700">
                  <CheckCircle className="w-5 h-5 mr-2" />
                  <span className="font-medium">Generation Complete!</span>
                </div>
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  {generatedPosts.length} posts created
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Generated Posts Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {generatedPosts.slice(0, 3).map((post) => (
                  <div key={post.id} className="border rounded-lg p-4 bg-slate-50">
                    <div className="flex justify-between items-start mb-2">
                      <Badge variant="outline">{post.format}</Badge>
                      <div className="text-xs text-slate-500">Score: {post.score.toFixed(1)}</div>
                    </div>
                    <p className="text-sm text-slate-700 mb-2 line-clamp-3">{post.content}</p>
                    <div className="flex flex-wrap gap-1">
                      {post.hashtags.map((tag: string, i: number) => (
                        <span key={i} className="text-xs text-blue-600">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-center text-sm text-slate-500 mt-4">
                Showing 3 of {generatedPosts.length} posts. View all in the next step.
              </p>
            </CardContent>
          </Card>

          <div className="text-center">
            <Button onClick={handleComplete} size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">
              Continue to Ranking
              <CheckCircle className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
