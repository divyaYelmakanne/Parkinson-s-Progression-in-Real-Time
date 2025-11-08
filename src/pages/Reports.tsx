import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { Brain, ArrowLeft, Download, Calendar } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

const Reports = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [testResults, setTestResults] = useState<any[]>([]);
  const [dailySummaries, setDailySummaries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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
    await loadReports(session.user.id);
  };

  const loadReports = async (userId: string) => {
    try {
      const { data: resultsData } = await supabase
        .from("typing_test_results")
        .select("*")
        .eq("user_id", userId)
        .order("test_date", { ascending: false });

      setTestResults(resultsData || []);

      const { data: summariesData } = await supabase
        .from("daily_summaries")
        .select("*")
        .eq("user_id", userId)
        .order("summary_date", { ascending: false })
        .limit(30);

      setDailySummaries(summariesData || []);
    } catch (error: any) {
      toast.error("Error loading reports");
    } finally {
      setLoading(false);
    }
  };

  const chartData = testResults
    .slice(0, 30)
    .reverse()
    .map((result) => ({
      date: new Date(result.test_date).toLocaleDateString(),
      pdIndex: result.pd_progression_index,
      dwellTime: result.avg_dwell_time,
      flightTime: result.avg_flight_time / 10, // Scale down for visibility
      rhythmVar: result.rhythm_variability,
    }));

  const downloadReport = () => {
    const reportData = testResults.map(r => ({
      Date: new Date(r.test_date).toLocaleDateString(),
      "PD Index": r.pd_progression_index,
      "Motor Score": r.motor_control_score,
      "Dwell Time": r.avg_dwell_time,
      "Flight Time": r.avg_flight_time,
      "Rhythm Variability": r.rhythm_variability,
      Symptoms: r.detected_symptoms?.join(", ") || "None",
    }));

    const csv = [
      Object.keys(reportData[0]).join(","),
      ...reportData.map(row => Object.values(row).join(","))
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `neurotrack-report-${new Date().toISOString()}.csv`;
    a.click();
    
    toast.success("Report downloaded");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <header className="bg-background/80 backdrop-blur border-b">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <Brain className="w-8 h-8 text-primary" />
            <h1 className="text-2xl font-bold">Progress Reports</h1>
          </div>
          <Button onClick={downloadReport}>
            <Download className="w-4 h-4 mr-2" />
            Download CSV
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8 max-w-6xl space-y-8">
        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <Calendar className="w-5 h-5 text-primary" />
              <h3 className="font-semibold">Total Tests</h3>
            </div>
            <p className="text-3xl font-bold">{testResults.length}</p>
          </Card>

          <Card className="p-6">
            <h3 className="font-semibold mb-2">Avg PD Index</h3>
            <p className="text-3xl font-bold">
              {testResults.length > 0
                ? (testResults.reduce((sum, r) => sum + r.pd_progression_index, 0) / testResults.length).toFixed(0)
                : "N/A"}
            </p>
          </Card>

          <Card className="p-6">
            <h3 className="font-semibold mb-2">Avg Motor Score</h3>
            <p className="text-3xl font-bold">
              {testResults.length > 0
                ? (testResults.reduce((sum, r) => sum + r.motor_control_score, 0) / testResults.length).toFixed(0)
                : "N/A"}
            </p>
          </Card>

          <Card className="p-6">
            <h3 className="font-semibold mb-2">Latest Status</h3>
            <p className={`text-xl font-bold ${
              testResults[0]?.pd_progression_index >= 70 ? "text-green-500" :
              testResults[0]?.pd_progression_index >= 50 ? "text-yellow-500" :
              testResults[0]?.pd_progression_index >= 30 ? "text-orange-500" :
              "text-red-500"
            }`}>
              {testResults[0]?.pd_progression_index >= 70 ? "Normal" :
               testResults[0]?.pd_progression_index >= 50 ? "Mild" :
               testResults[0]?.pd_progression_index >= 30 ? "Moderate" : "Severe"}
            </p>
          </Card>
        </div>

        {/* Progression Chart */}
        {chartData.length > 0 && (
          <Card className="p-6">
            <h3 className="text-xl font-bold mb-6">30-Day Progression Tracking</h3>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="pdIndex"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  name="PD Index"
                />
                <Line
                  type="monotone"
                  dataKey="dwellTime"
                  stroke="hsl(var(--accent))"
                  strokeWidth={2}
                  name="Dwell Time (ms)"
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        )}

        {/* Recent Tests Table */}
        <Card className="p-6">
          <h3 className="text-xl font-bold mb-4">Recent Test Results</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Date</th>
                  <th className="text-left py-3 px-4">PD Index</th>
                  <th className="text-left py-3 px-4">Motor Score</th>
                  <th className="text-left py-3 px-4">Status</th>
                  <th className="text-left py-3 px-4">Symptoms</th>
                </tr>
              </thead>
              <tbody>
                {testResults.slice(0, 10).map((result) => (
                  <tr key={result.id} className="border-b hover:bg-accent/10">
                    <td className="py-3 px-4">
                      {new Date(result.test_date).toLocaleDateString()}
                    </td>
                    <td className={`py-3 px-4 font-semibold ${
                      result.pd_progression_index >= 70 ? "text-green-500" :
                      result.pd_progression_index >= 50 ? "text-yellow-500" :
                      result.pd_progression_index >= 30 ? "text-orange-500" :
                      "text-red-500"
                    }`}>
                      {result.pd_progression_index.toFixed(0)}
                    </td>
                    <td className="py-3 px-4">{result.motor_control_score.toFixed(0)}</td>
                    <td className="py-3 px-4">
                      <span className={`px-3 py-1 rounded-full text-xs ${
                        result.pd_progression_index >= 70 ? "bg-green-100 text-green-800" :
                        result.pd_progression_index >= 50 ? "bg-yellow-100 text-yellow-800" :
                        result.pd_progression_index >= 30 ? "bg-orange-100 text-orange-800" :
                        "bg-red-100 text-red-800"
                      }`}>
                        {result.pd_progression_index >= 70 ? "Normal" :
                         result.pd_progression_index >= 50 ? "Mild" :
                         result.pd_progression_index >= 30 ? "Moderate" : "Severe"}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm">
                      {result.detected_symptoms?.length || 0} detected
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Reports;
