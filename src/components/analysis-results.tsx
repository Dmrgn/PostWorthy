import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { Brain, TrendingUp, Hash } from "lucide-react"

interface AnalysisResultsProps {
  posts: any[]
  onComplete: (data: { analysis: any }) => void
}

const COLORS = ["#3b82f6", "#ef4444", "#10b981", "#f59e0b", "#8b5cf6", "#06b6d4"]

export default function AnalysisResults({ posts, onComplete }: AnalysisResultsProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisComplete, setAnalysisComplete] = useState(false)
  const [progress, setProgress] = useState(0)
  const [analysis, setAnalysis] = useState<any>(null)

  useEffect(() => {
    const performAnalysis = async () => {
      setIsAnalyzing(true);
      setProgress(0);

      try {
        // Smooth progress updates
        const progressInterval = setInterval(() => {
          setProgress((prev) => {
            const remaining = 100 - prev;
            if (remaining < 5) {
              clearInterval(progressInterval);
              return prev;
            }
            return prev + remaining * 0.1;
          });
        }, 500);

        const response = await fetch("/api/analyze-posts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ posts }),
        });

        const data = await response.json();

        console.log(data);

        clearInterval(progressInterval);
        setProgress(100);
        setAnalysis(data.analysis);
        setAnalysisComplete(true);
        setIsAnalyzing(false);
      } catch (error) {
        console.error("Analysis failed:", error);
        setIsAnalyzing(false);
      }
    };

    performAnalysis();
  }, [posts]);

  const handleComplete = () => {
    onComplete({ analysis: analysis })
  }

  if (!analysisComplete) {
    return (
      <div className="text-center space-y-6">
        <div className="flex items-center justify-center">
          <Brain className="w-8 h-8 text-blue-600 mr-3" />
          <h3 className="text-xl font-medium">AI Analysis in Progress</h3>
        </div>
        <p className="text-slate-600">
          Using Gemini Flash to analyze {posts?.length || 50} posts for keywords, sentiment, topics, and engagement
          patterns...
        </p>
        <div className="max-w-md mx-auto">
          <Progress value={progress} className="h-2" />
          <p className="text-sm text-slate-500 mt-2">Processing with long context window...</p>
        </div>
      </div>
    )
  }

  const currentAnalysis = analysis

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-xl font-medium text-slate-900 mb-2">Analysis Complete</h3>
        <p className="text-slate-600">AI-powered insights from your Reddit data</p>
      </div>

      <Tabs defaultValue="keywords" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="keywords">Keywords</TabsTrigger>
          <TabsTrigger value="topics">Topics</TabsTrigger>
          <TabsTrigger value="sentiment">Sentiment</TabsTrigger>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="keywords" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Hash className="w-5 h-5 mr-2" />
                Top Keywords & Frequency
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={currentAnalysis.keywords}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="word" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="frequency" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="topics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Topic Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={currentAnalysis.topics}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ topic, percentage }) => `${topic}: ${percentage}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="percentage"
                  >
                    {currentAnalysis.topics.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sentiment" className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-2xl font-bold text-green-600">{currentAnalysis.sentiment.positive}%</div>
                <div className="text-sm text-slate-600">Positive</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-2xl font-bold text-slate-600">{currentAnalysis.sentiment.neutral}%</div>
                <div className="text-sm text-slate-600">Neutral</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-2xl font-bold text-red-600">{currentAnalysis.sentiment.negative}%</div>
                <div className="text-sm text-slate-600">Negative</div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="engagement" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="w-5 h-5 mr-2" />
                Engagement Patterns
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={currentAnalysis.engagement}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="type" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Key Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {currentAnalysis.insights.map((insight: string, index: number) => (
                  <div key={index} className="flex items-start">
                    <Badge variant="outline" className="mr-3 mt-0.5">
                      {index + 1}
                    </Badge>
                    <p className="text-slate-700">{insight}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="text-center pt-6">
        <Button onClick={handleComplete} size="lg" className="bg-purple-600 hover:bg-purple-700 text-white">
          Continue to RAG Setup
          <Brain className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  )
}
