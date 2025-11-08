import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, TrendingUp, TrendingDown } from "lucide-react";
import { useEffect, useState } from "react";

type StatusLevel = "stable" | "mild" | "severe";

interface MonitoringMetric {
  name: string;
  value: number;
  unit: string;
  status: StatusLevel;
  change: number;
  changeDirection: "up" | "down";
}

const getStatusColor = (status: StatusLevel) => {
  switch (status) {
    case "stable":
      return "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/30";
    case "mild":
      return "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/30";
    case "severe":
      return "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/30";
  }
};

const getStatusIcon = (status: StatusLevel) => {
  switch (status) {
    case "stable":
      return "✅";
    case "mild":
      return "⚠️";
    case "severe":
      return "🔴";
  }
};

const getStatusLabel = (status: StatusLevel) => {
  switch (status) {
    case "stable":
      return "Stable - No significant changes";
    case "mild":
      return "Mild Change Detected";
    case "severe":
      return "Progression - Consult Doctor";
  }
};

const RealTimeMonitoring = () => {
  const [metrics, setMetrics] = useState<MonitoringMetric[]>([
    {
      name: "Tremor Frequency",
      value: 4.2,
      unit: "Hz",
      status: "stable",
      change: 2.1,
      changeDirection: "up"
    },
    {
      name: "Typing Speed",
      value: 68,
      unit: "WPM",
      status: "mild",
      change: 8.3,
      changeDirection: "down"
    },
    {
      name: "Motor Control",
      value: 72,
      unit: "%",
      status: "severe",
      change: 12.5,
      changeDirection: "down"
    },
    {
      name: "Reaction Time",
      value: 285,
      unit: "ms",
      status: "stable",
      change: 1.8,
      changeDirection: "up"
    }
  ]);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => prev.map(metric => ({
        ...metric,
        value: metric.value + (Math.random() - 0.5) * 0.5,
        change: Math.abs(metric.change + (Math.random() - 0.5) * 0.2)
      })));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-24 bg-gradient-subtle relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-green-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl animate-pulse" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground">
            Real-Time Monitoring Dashboard
          </h2>
          <p className="text-xl text-muted-foreground">
            Live status with color-coded indicators updating as you interact
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {metrics.map((metric, index) => (
            <Card 
              key={index}
              className={`border-2 transition-all duration-500 hover:scale-105 ${
                metric.status === "stable" ? "border-green-500/30" :
                metric.status === "mild" ? "border-yellow-500/30" :
                "border-red-500/30"
              }`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {metric.name}
                  </CardTitle>
                  <Activity className={`w-4 h-4 ${
                    metric.status === "stable" ? "text-green-600" :
                    metric.status === "mild" ? "text-yellow-600" :
                    "text-red-600"
                  }`} />
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-3xl font-bold text-foreground">
                  {metric.value.toFixed(1)}{metric.unit}
                </div>
                <div className="flex items-center gap-1 text-xs">
                  {metric.changeDirection === "down" ? (
                    <TrendingDown className="w-3 h-3 text-destructive" />
                  ) : (
                    <TrendingUp className="w-3 h-3 text-destructive" />
                  )}
                  <span className="text-destructive">{metric.change.toFixed(1)}% change</span>
                </div>
                <Badge className={`w-full justify-center text-xs ${getStatusColor(metric.status)}`}>
                  {getStatusIcon(metric.status)} {metric.status.toUpperCase()}
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Status Legend */}
        <Card className="max-w-4xl mx-auto border-2 shadow-medical">
          <CardContent className="p-8">
            <h3 className="text-2xl font-bold text-foreground mb-6 text-center">
              Status Indicators Explained
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center space-y-3">
                <div className="text-5xl">✅</div>
                <Badge className={`${getStatusColor("stable")} text-base py-2 px-4`}>
                  STABLE
                </Badge>
                <p className="text-sm text-muted-foreground">
                  {getStatusLabel("stable")}
                </p>
              </div>
              <div className="text-center space-y-3">
                <div className="text-5xl">⚠️</div>
                <Badge className={`${getStatusColor("mild")} text-base py-2 px-4`}>
                  MILD
                </Badge>
                <p className="text-sm text-muted-foreground">
                  {getStatusLabel("mild")}
                </p>
              </div>
              <div className="text-center space-y-3">
                <div className="text-5xl">🔴</div>
                <Badge className={`${getStatusColor("severe")} text-base py-2 px-4`}>
                  SEVERE
                </Badge>
                <p className="text-sm text-muted-foreground">
                  {getStatusLabel("severe")}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default RealTimeMonitoring;
