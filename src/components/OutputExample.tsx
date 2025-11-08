import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { TrendingDown, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";

const tremorData = [
  { day: "Mon", level: 42 },
  { day: "Tue", level: 45 },
  { day: "Wed", level: 48 },
  { day: "Thu", level: 52 },
  { day: "Fri", level: 58 },
  { day: "Sat", level: 62 },
  { day: "Sun", level: 65 },
];

const OutputExample = () => {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<"stable" | "mild" | "severe">("mild");

  useEffect(() => {
    // Animate progress bar
    const timer = setTimeout(() => setProgress(65), 500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Update status based on progress
    if (progress < 40) setStatus("stable");
    else if (progress < 60) setStatus("mild");
    else setStatus("severe");
  }, [progress]);

  const getProgressColor = () => {
    if (progress < 40) return "bg-green-500";
    if (progress < 60) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getStatusBadge = () => {
    if (status === "stable") {
      return <Badge className="bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/30">✅ Stable</Badge>;
    }
    if (status === "mild") {
      return <Badge className="bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/30">⚠️ Mild</Badge>;
    }
    return <Badge className="bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/30">🔴 Severe</Badge>;
  };

  return (
    <section className="py-24 bg-gradient-subtle relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
        <div className="absolute top-1/4 right-1/3 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground">
            📊 Output Example
          </h2>
          <p className="text-xl text-muted-foreground">
            Real visualization of what patients and doctors see
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Tremor Level Graph */}
          <Card className="border-2 shadow-medical">
            <CardContent className="p-6 space-y-4">
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-foreground">Daily Tremor Level Tracking</h3>
                <p className="text-sm text-muted-foreground">7-day progression monitoring</p>
              </div>
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={tremorData}>
                  <defs>
                    <linearGradient id="colorTremor" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--destructive))" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(var(--destructive))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: "hsl(var(--card))", 
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px"
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="level" 
                    stroke="hsl(var(--destructive))" 
                    fillOpacity={1} 
                    fill="url(#colorTremor)" 
                    strokeWidth={3}
                  />
                </AreaChart>
              </ResponsiveContainer>
              <div className="flex items-center gap-2 text-sm">
                <TrendingDown className="w-4 h-4 text-destructive" />
                <span className="text-muted-foreground">
                  Tremor intensity increased by <strong className="text-foreground">23 points</strong> this week
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Color-Coded Progress Bar */}
          <Card className="border-2 shadow-medical">
            <CardContent className="p-6 space-y-6">
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-foreground">Motor Performance Status</h3>
                <p className="text-sm text-muted-foreground">Real-time color-coded indicator</p>
              </div>

              {/* Progress Bar */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground">Current Status:</span>
                  {getStatusBadge()}
                </div>
                <div className="space-y-2">
                  <Progress value={progress} className="h-6" />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>0 (Stable)</span>
                    <span className="font-bold text-foreground">{progress}%</span>
                    <span>100 (Severe)</span>
                  </div>
                </div>
              </div>

              {/* Status Legend */}
              <div className="space-y-3 pt-4 border-t">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-6 bg-green-500 rounded"></div>
                  <div className="flex-1">
                    <div className="text-sm font-medium">Green (0-40%)</div>
                    <div className="text-xs text-muted-foreground">Stable - No concerns</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-6 bg-yellow-500 rounded"></div>
                  <div className="flex-1">
                    <div className="text-sm font-medium">Yellow (40-60%)</div>
                    <div className="text-xs text-muted-foreground">Mild - Monitor closely</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-6 bg-red-500 rounded"></div>
                  <div className="flex-1">
                    <div className="text-sm font-medium">Red (60-100%)</div>
                    <div className="text-xs text-muted-foreground">Severe - Consult doctor</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Auto-Generated Summary */}
        <Card className="max-w-6xl mx-auto mt-8 border-2 shadow-medical bg-gradient-medical">
          <CardContent className="p-8">
            <div className="flex items-start gap-4">
              <AlertCircle className="w-8 h-8 text-primary-foreground flex-shrink-0 mt-1" />
              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-primary-foreground">
                  AI-Generated Health Summary
                </h3>
                <p className="text-lg text-primary-foreground/90 leading-relaxed">
                  "Your motor performance decreased by <strong>8%</strong> this week, with tremor levels 
                  increasing notably on Thursday and Friday. Typing speed has also declined by <strong>8.3%</strong> from 
                  your baseline. These changes suggest possible symptom progression. 
                  <strong> Consider consulting your neurologist</strong> for a medication review."
                </p>
                <div className="flex gap-2 pt-2">
                  <Badge className="bg-primary-foreground/20 text-primary-foreground border-primary-foreground/30">
                    Action Required
                  </Badge>
                  <Badge className="bg-primary-foreground/20 text-primary-foreground border-primary-foreground/30">
                    Generated 2 hours ago
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default OutputExample;
