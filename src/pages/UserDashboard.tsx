import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Brain,
  Activity,
  TrendingUp,
  TrendingDown,
  Minus,
  AlertCircle,
  Bell,
  Settings,
  FileText,
  LogOut,
} from "lucide-react";
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

const UserDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [testResults, setTestResults] = useState<any[]>([]);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [aiInsights, setAiInsights] = useState<any>(null);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      navigate("/auth");
      return;
    }

    setUser(session.user);
    await loadData(session.user.id);
  };

  const loadData = async (userId: string) => {
    try {
      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      setProfile(profileData);

      const { data: resultsData } = await supabase
        .from("typing_test_results")
        .select("*")
        .eq("user_id", userId)
        .order("test_date", { ascending: false })
        .limit(30);

      setTestResults(resultsData || []);

      const { data: alertsData } = await supabase
        .from("alerts")
        .select("*")
        .eq("user_id", userId)
        .eq("is_read", false)
        .order("created_at", { ascending: false })
        .limit(5);

      setAlerts(alertsData || []);
    } catch (error: any) {
      toast.error("Error loading data");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const getAIAnalysis = async () => {
    if (testResults.length < 2) {
      toast.error("Need at least 2 test results for AI analysis");
      return;
    }

    setAnalyzing(true);
    try {
      const { data, error } = await supabase.functions.invoke("analyze-progression", {
        body: { testResults, userId: user.id },
      });

      if (error) throw error;
      setAiInsights(data);
      toast.success("AI analysis complete!");
    } catch (error: any) {
      toast.error(error.message || "Error generating analysis");
    } finally {
      setAnalyzing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const latestResult = testResults[0];
  const previousResult = testResults[1];

  const getStatusColor = (index: number) => {
    if (index >= 70) return "text-green-500";
    if (index >= 50) return "text-yellow-500";
    if (index >= 30) return "text-orange-500";
    return "text-red-500";
  };

  const getStatusLabel = (index: number) => {
    if (index >= 70) return "Normal";
    if (index >= 50) return "Mild";
    if (index >= 30) return "Moderate";
    return "Severe";
  };

  const getTrend = () => {
    if (!latestResult || !previousResult) return null;
    const diff = latestResult.pd_progression_index - previousResult.pd_progression_index;
    if (diff > 5) return { icon: TrendingUp, color: "text-green-500", text: "Improving" };
    if (diff < -5) return { icon: TrendingDown, color: "text-red-500", text: "Declining" };
    return { icon: Minus, color: "text-yellow-500", text: "Stable" };
  };

  const trend = getTrend();

  const chartData = testResults
    .slice(0, 14)
    .reverse()
    .map((result) => ({
      date: new Date(result.test_date).toLocaleDateString(),
      pdIndex: result.pd_progression_index,
      motorScore: result.motor_control_score,
    }));

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <header className="bg-background/80 backdrop-blur border-b">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Brain className="w-8 h-8 text-primary" />
            <h1 className="text-2xl font-bold">NeuroTrack</h1>
          </div>
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/monitoring")}
            >
              <Activity className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/reports")}
            >
              <FileText className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/settings")}
            >
              <Settings className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={handleLogout}>
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8 space-y-8">
        {/* Welcome Section */}
        <div>
          <h2 className="text-3xl font-bold text-foreground">
            Welcome back, {profile?.full_name || "User"}
          </h2>
          <p className="text-muted-foreground mt-2">
            Here's your health progress overview
          </p>
        </div>

        {/* Alerts */}
        {alerts.length > 0 && (
          <Card className="p-6 border-2 border-accent">
            <div className="flex items-start gap-4">
              <Bell className="w-6 h-6 text-accent flex-shrink-0" />
              <div className="flex-1">
                <h3 className="text-lg font-semibold mb-3">Recent Alerts</h3>
                <div className="space-y-2">
                  {alerts.map((alert) => (
                    <div
                      key={alert.id}
                      className="flex items-center gap-3 p-3 bg-background/50 rounded-lg"
                    >
                      <AlertCircle
                        className={`w-5 h-5 ${
                          alert.severity === "critical"
                            ? "text-red-500"
                            : alert.severity === "warning"
                            ? "text-yellow-500"
                            : "text-blue-500"
                        }`}
                      />
                      <p className="text-sm">{alert.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-muted-foreground">
                Current PD Index
              </h3>
              <Brain className="w-5 h-5 text-primary" />
            </div>
            <div className="space-y-2">
              <p
                className={`text-4xl font-bold ${getStatusColor(
                  latestResult?.pd_progression_index || 0
                )}`}
              >
                {latestResult?.pd_progression_index?.toFixed(0) || "N/A"}
              </p>
              <p className="text-sm text-muted-foreground">
                {getStatusLabel(latestResult?.pd_progression_index || 0)}
              </p>
              {trend && (
                <div className={`flex items-center gap-2 ${trend.color}`}>
                  <trend.icon className="w-4 h-4" />
                  <span className="text-sm">{trend.text}</span>
                </div>
              )}
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-muted-foreground">
                Motor Control
              </h3>
              <Activity className="w-5 h-5 text-primary" />
            </div>
            <div className="space-y-2">
              <p className="text-4xl font-bold text-foreground">
                {latestResult?.motor_control_score?.toFixed(0) || "N/A"}
              </p>
              <p className="text-sm text-muted-foreground">out of 100</p>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-muted-foreground">
                Total Tests
              </h3>
              <FileText className="w-5 h-5 text-primary" />
            </div>
            <div className="space-y-2">
              <p className="text-4xl font-bold text-foreground">
                {testResults.length}
              </p>
              <p className="text-sm text-muted-foreground">completed</p>
            </div>
          </Card>
        </div>

        {/* Progress Chart */}
        {chartData.length > 0 && (
          <Card className="p-6">
            <h3 className="text-xl font-bold mb-6">14-Day Progress Tracking</h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorPD" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor="hsl(var(--primary))"
                      stopOpacity={0.3}
                    />
                    <stop
                      offset="95%"
                      stopColor="hsl(var(--primary))"
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="date" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="pdIndex"
                  stroke="hsl(var(--primary))"
                  fillOpacity={1}
                  fill="url(#colorPD)"
                  name="PD Index"
                />
                <Line
                  type="monotone"
                  dataKey="motorScore"
                  stroke="hsl(var(--accent))"
                  name="Motor Score"
                />
              </AreaChart>
            </ResponsiveContainer>
          </Card>
        )}

        {/* AI Insights */}
        {testResults.length >= 2 && (
          <Card className="p-6 border-2 border-primary/20">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">AI Health Insights</h3>
              <Button onClick={getAIAnalysis} disabled={analyzing}>
                {analyzing ? "Analyzing..." : "Generate AI Analysis"}
              </Button>
            </div>
            
            {aiInsights && (
              <div className="space-y-4">
                <div className={`p-4 rounded-lg ${
                  aiInsights.status === "stable" ? "bg-green-50 dark:bg-green-950" :
                  aiInsights.status === "mild_change" ? "bg-yellow-50 dark:bg-yellow-950" :
                  "bg-orange-50 dark:bg-orange-950"
                }`}>
                  <h4 className="font-semibold mb-2">Overall Status</h4>
                  <p className="text-sm">{aiInsights.summary}</p>
                </div>

                {aiInsights.concerns && aiInsights.concerns.length > 0 && (
                  <div className="bg-background rounded-lg p-4">
                    <h4 className="font-semibold mb-2">Key Concerns</h4>
                    <ul className="text-sm space-y-1">
                      {aiInsights.concerns.map((concern: string, i: number) => (
                        <li key={i}>• {concern}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {aiInsights.recommendations && aiInsights.recommendations.length > 0 && (
                  <div className="bg-primary/5 rounded-lg p-4">
                    <h4 className="font-semibold mb-2">Recommendations</h4>
                    <ul className="text-sm space-y-1">
                      {aiInsights.recommendations.map((rec: string, i: number) => (
                        <li key={i}>• {rec}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {aiInsights.shouldConsultDoctor && (
                  <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg p-4">
                    <h4 className="font-semibold text-red-900 dark:text-red-100 mb-2">
                      ⚕️ Doctor Consultation Recommended
                    </h4>
                    <p className="text-sm text-red-800 dark:text-red-200">
                      {aiInsights.doctorReason}
                    </p>
                  </div>
                )}
              </div>
            )}
          </Card>
        )}

        {/* Quick Actions */}
        <Card className="p-6">
          <h3 className="text-xl font-bold mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              onClick={() => navigate("/typing-test")}
              className="h-auto py-6"
            >
              <div className="text-center">
                <Brain className="w-8 h-8 mx-auto mb-2" />
                <p className="font-semibold">Start Typing Test</p>
              </div>
            </Button>
            <Button
              onClick={() => navigate("/monitoring")}
              variant="outline"
              className="h-auto py-6"
            >
              <div className="text-center">
                <Activity className="w-8 h-8 mx-auto mb-2" />
                <p className="font-semibold">Live Monitoring</p>
              </div>
            </Button>
            <Button
              onClick={() => navigate("/reports")}
              variant="outline"
              className="h-auto py-6"
            >
              <div className="text-center">
                <FileText className="w-8 h-8 mx-auto mb-2" />
                <p className="font-semibold">View Reports</p>
              </div>
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default UserDashboard;
