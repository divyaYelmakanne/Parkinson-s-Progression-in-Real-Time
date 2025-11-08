import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Gauge, Target, TrendingUp, ArrowLeft, Activity, Brain, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ThemeToggle from "@/components/ThemeToggle";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface KeystrokeEvent {
  key: string;
  timestamp: number;
  dwellTime?: number;
}

interface PDMetrics {
  avgDwellTime: number;
  avgFlightTime: number;
  rhythmVariability: number;
  motorControlScore: number;
  pdProgressionIndex: number;
  detectedSymptoms: string[];
}

const sampleTexts = [
  "The quick brown fox jumps over the lazy dog. Typing speed is an essential skill in the modern world. Practice makes perfect, and consistent effort leads to improvement.",
  "Programming is the art of telling another human what one wants the computer to do. Good code is its own best documentation. Always write code as if the person maintaining it is a violent psychopath.",
  "Digital biomarkers represent the future of healthcare monitoring. Through continuous passive data collection, we can track health metrics in real-time without disrupting daily activities.",
  "Machine learning algorithms can identify patterns in keystroke dynamics that are imperceptible to humans. These subtle changes can indicate neurological changes over time.",
];

const TypingTest = () => {
  const navigate = useNavigate();
  const [duration, setDuration] = useState(30);
  const [status, setStatus] = useState<"idle" | "testing" | "results">("idle");
  const [timeLeft, setTimeLeft] = useState(duration);
  const [textToType, setTextToType] = useState("");
  const [userInput, setUserInput] = useState("");
  const [startTime, setStartTime] = useState<number | null>(null);
  const [user, setUser] = useState<any>(null);
  
  // Results
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(0);
  const [netWpm, setNetWpm] = useState(0);
  const [typos, setTypos] = useState(0);
  
  // Parkinson's-specific metrics
  const [keystrokeEvents, setKeystrokeEvents] = useState<KeystrokeEvent[]>([]);
  const [keyDownTime, setKeyDownTime] = useState<number | null>(null);
  const [pdMetrics, setPdMetrics] = useState<PDMetrics | null>(null);

  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    setUser(session?.user || null);
  };

  useEffect(() => {
    if (status === "testing" && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (status === "testing" && timeLeft === 0) {
      finishTest();
    }
  }, [status, timeLeft]);

  const startTest = () => {
    const randomText = sampleTexts[Math.floor(Math.random() * sampleTexts.length)];
    setTextToType(randomText);
    setUserInput("");
    setTimeLeft(duration);
    setStatus("testing");
    setStartTime(Date.now());
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key.length === 1) {
      setKeyDownTime(Date.now());
    }
  };

  const handleKeyUp = (e: React.KeyboardEvent) => {
    if (e.key.length === 1 && keyDownTime) {
      const dwellTime = Date.now() - keyDownTime;
      const newEvent: KeystrokeEvent = {
        key: e.key,
        timestamp: Date.now(),
        dwellTime,
      };
      setKeystrokeEvents((prev) => [...prev, newEvent]);
      setKeyDownTime(null);
    }
  };

  const finishTest = () => {
    setStatus("results");
    calculateResults();
    calculatePDMetrics();
  };

  const saveResultsToDatabase = async (metrics: PDMetrics) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        await supabase.from("typing_test_results").insert({
          user_id: session.user.id,
          wpm: wpm,
          accuracy: accuracy,
          pd_progression_index: metrics.pdProgressionIndex,
          motor_control_score: metrics.motorControlScore,
          avg_dwell_time: metrics.avgDwellTime,
          avg_flight_time: metrics.avgFlightTime,
          rhythm_variability: metrics.rhythmVariability,
          detected_symptoms: metrics.detectedSymptoms,
        });
        toast.success("Test results saved!");
      }
    } catch (error: any) {
      console.error("Error saving results:", error);
    }
  };

  const calculatePDMetrics = () => {
    if (keystrokeEvents.length < 10) {
      setPdMetrics(null);
      return null;
    }

    // Calculate average dwell time (time key is held down)
    const dwellTimes = keystrokeEvents
      .filter((e) => e.dwellTime)
      .map((e) => e.dwellTime!);
    const avgDwellTime = dwellTimes.reduce((a, b) => a + b, 0) / dwellTimes.length;

    // Calculate flight time (time between key releases)
    const flightTimes: number[] = [];
    for (let i = 1; i < keystrokeEvents.length; i++) {
      const flightTime = keystrokeEvents[i].timestamp - keystrokeEvents[i - 1].timestamp;
      flightTimes.push(flightTime);
    }
    const avgFlightTime = flightTimes.reduce((a, b) => a + b, 0) / flightTimes.length;

    // Calculate rhythm variability (standard deviation of flight times)
    const mean = avgFlightTime;
    const variance =
      flightTimes.reduce((sum, time) => sum + Math.pow(time - mean, 2), 0) /
      flightTimes.length;
    const rhythmVariability = Math.sqrt(variance);

    // Motor control score (0-100, higher is better)
    // Based on consistency and speed
    const consistencyScore = Math.max(0, 100 - (rhythmVariability / 10));
    const speedScore = Math.max(0, 100 - (avgFlightTime / 5));
    const motorControlScore = Math.round((consistencyScore + speedScore) / 2);

    // PD Progression Index (0-100, lower indicates more symptoms)
    // Normal: 70-100, Mild: 50-69, Moderate: 30-49, Severe: 0-29
    let pdProgressionIndex = motorControlScore;
    
    // Track detected symptoms
    const detectedSymptoms: string[] = [];
    
    // Adjust based on known PD indicators and track symptoms
    if (avgDwellTime > 150) {
      pdProgressionIndex -= 10;
      detectedSymptoms.push(`Bradykinesia: Increased key press duration (${avgDwellTime}ms, normal <150ms) indicates slowness of movement`);
    }
    
    if (rhythmVariability > 200) {
      pdProgressionIndex -= 15;
      detectedSymptoms.push(`Motor Inconsistency: High rhythm variability (${Math.round(rhythmVariability)}ms) suggests irregular motor control patterns`);
    }
    
    if (avgFlightTime > 400) {
      pdProgressionIndex -= 10;
      detectedSymptoms.push(`Delayed Transitions: Slow movement between keys (${avgFlightTime}ms, normal <400ms) indicates motor planning difficulties`);
    }
    
    if (motorControlScore < 30) {
      detectedSymptoms.push(`Severe Motor Impairment: Overall motor control score is critically low (${motorControlScore}/100)`);
    } else if (motorControlScore < 50) {
      detectedSymptoms.push(`Moderate Motor Impairment: Motor control score shows significant decline (${motorControlScore}/100)`);
    }
    
    if (avgDwellTime < 80) {
      detectedSymptoms.push(`Possible Tremor Compensation: Unusually short key presses may indicate tremor-related typing pattern`);
    }
    
    if (detectedSymptoms.length === 0) {
      detectedSymptoms.push(`No significant motor symptoms detected. Keystroke patterns within normal range.`);
    }
    
    pdProgressionIndex = Math.max(0, Math.min(100, pdProgressionIndex));

    const metrics = {
      avgDwellTime: Math.round(avgDwellTime),
      avgFlightTime: Math.round(avgFlightTime),
      rhythmVariability: Math.round(rhythmVariability),
      motorControlScore,
      pdProgressionIndex: Math.round(pdProgressionIndex),
      detectedSymptoms,
    };

    setPdMetrics(metrics);

    // Save to database
    setTimeout(() => {
      saveResultsToDatabase(metrics);
    }, 100);

    // Save to localStorage for progression tracking
    const history = JSON.parse(localStorage.getItem("pdHistory") || "[]");
    history.push({
      date: new Date().toISOString(),
      pdProgressionIndex: Math.round(pdProgressionIndex),
      motorControlScore,
      wpm: wpm,
    });
    // Keep last 30 tests
    if (history.length > 30) history.shift();
    localStorage.setItem("pdHistory", JSON.stringify(history));
    
    return metrics;
  };

  const calculateResults = () => {
    const typedWords = userInput.trim().split(/\s+/).length;
    const timeInMinutes = duration / 60;
    const grossWpm = Math.round(typedWords / timeInMinutes);
    
    let correctChars = 0;
    let totalTypos = 0;
    const minLength = Math.min(userInput.length, textToType.length);
    
    for (let i = 0; i < minLength; i++) {
      if (userInput[i] === textToType[i]) {
        correctChars++;
      } else {
        totalTypos++;
      }
    }
    
    const accuracyPercent = minLength > 0 ? Math.round((correctChars / minLength) * 100) : 0;
    const netSpeed = Math.max(0, Math.round(grossWpm - (totalTypos / timeInMinutes)));
    
    setWpm(grossWpm);
    setAccuracy(accuracyPercent);
    setNetWpm(netSpeed);
    setTypos(totalTypos);

    return { wpm: grossWpm, accuracy: accuracyPercent };
  };

  const resetTest = () => {
    setStatus("idle");
    setUserInput("");
    setTextToType("");
    setTimeLeft(duration);
    setKeystrokeEvents([]);
    setPdMetrics(null);
  };

  const getPDIndexColor = (index: number) => {
    if (index >= 70) return "text-secondary";
    if (index >= 50) return "text-primary";
    if (index >= 30) return "text-yellow-500";
    return "text-destructive";
  };

  const getPDIndexLabel = (index: number) => {
    if (index >= 70) return "Normal Range";
    if (index >= 50) return "Mild Symptoms";
    if (index >= 30) return "Moderate Symptoms";
    return "Significant Symptoms";
  };

  const getCharacterClass = (index: number) => {
    if (index >= userInput.length) return "text-muted-foreground";
    return userInput[index] === textToType[index] ? "text-primary" : "text-destructive bg-destructive/10";
  };

  return (
    <div className="min-h-screen bg-gradient-subtle relative">
      <ThemeToggle />
      
      <div className="container mx-auto px-6 py-12">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="mb-8"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Button>

        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full border border-primary/20 mb-4">
              <Brain className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">Clinical-Grade Motor Analysis</span>
            </div>
            <h1 className="text-4xl font-bold mb-2 text-foreground">
              Parkinson's Keystroke Analysis
            </h1>
            <p className="text-muted-foreground">
              Track motor control & progression through digital biomarkers
            </p>
          </div>

          {status === "idle" && (
            <Card className="p-8 shadow-card-hover border">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2 text-foreground">
                    Select Test Duration
                  </label>
                  <Select value={duration.toString()} onValueChange={(v) => setDuration(Number(v))}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="30">30 Seconds Test</SelectItem>
                      <SelectItem value="60">1 Minute Test</SelectItem>
                      <SelectItem value="120">2 Minutes Test</SelectItem>
                      <SelectItem value="180">3 Minutes Test</SelectItem>
                      <SelectItem value="300">5 Minutes Test</SelectItem>
                      <SelectItem value="600">10 Minutes Test</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button onClick={startTest} size="lg" className="w-full">
                  Start Test
                </Button>
              </div>
            </Card>
          )}

          {status === "testing" && (
            <div className="space-y-6">
              <Card className="p-6 bg-card border shadow-card-hover">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-lg font-medium text-foreground">Time Remaining</span>
                  <span className="text-3xl font-bold text-primary">{timeLeft}s</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all duration-1000"
                    style={{ width: `${(timeLeft / duration) * 100}%` }}
                  />
                </div>
              </Card>

              <Card className="p-6 bg-card border shadow-card-hover">
                <div className="mb-4 p-4 bg-muted/50 rounded-lg font-mono text-lg leading-relaxed">
                  {textToType.split("").map((char, index) => (
                    <span key={index} className={getCharacterClass(index)}>
                      {char}
                    </span>
                  ))}
                </div>

                <textarea
                  ref={inputRef}
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  onKeyUp={handleKeyUp}
                  className="w-full min-h-[150px] p-4 rounded-md border border-input bg-background text-foreground font-mono text-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  placeholder="Start typing here..."
                  autoFocus
                />
                
                <div className="mt-4 p-3 bg-primary/5 rounded-lg border border-primary/10">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Activity className="w-4 h-4 text-primary" />
                    <span>Recording {keystrokeEvents.length} keystroke events for motor analysis...</span>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {status === "results" && (
            <div className="space-y-6">
              {/* PD Progression Index - Primary Focus */}
              {pdMetrics && (
                <Card className="p-8 bg-gradient-medical border-2 border-primary/20 shadow-medical">
                  <div className="flex items-center justify-center gap-3 mb-6">
                    <Brain className="w-10 h-10 text-white" />
                    <h2 className="text-3xl font-bold text-white">PD Progression Index</h2>
                  </div>
                  
                  <div className="text-center mb-6">
                    <div className={`text-7xl font-bold mb-2 ${getPDIndexColor(pdMetrics.pdProgressionIndex)}`}>
                      {pdMetrics.pdProgressionIndex}
                    </div>
                    <div className="text-xl font-semibold text-white mb-4">
                      {getPDIndexLabel(pdMetrics.pdProgressionIndex)}
                    </div>
                    <Progress value={pdMetrics.pdProgressionIndex} className="h-3 mb-2" />
                    <p className="text-sm text-white/80">
                      Score Range: 0-29 Severe | 30-49 Moderate | 50-69 Mild | 70-100 Normal
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-white/10 backdrop-blur rounded-lg p-4 text-center">
                      <Clock className="w-6 h-6 text-white mx-auto mb-2" />
                      <div className="text-2xl font-bold text-white">{pdMetrics.avgDwellTime}ms</div>
                      <div className="text-sm text-white/80">Avg Dwell Time</div>
                      <div className="text-xs text-white/60 mt-1">
                        {pdMetrics.avgDwellTime > 150 ? "Elevated" : "Normal"}
                      </div>
                    </div>
                    
                    <div className="bg-white/10 backdrop-blur rounded-lg p-4 text-center">
                      <Activity className="w-6 h-6 text-white mx-auto mb-2" />
                      <div className="text-2xl font-bold text-white">{pdMetrics.avgFlightTime}ms</div>
                      <div className="text-sm text-white/80">Avg Flight Time</div>
                      <div className="text-xs text-white/60 mt-1">
                        {pdMetrics.avgFlightTime > 400 ? "Slow" : "Normal"}
                      </div>
                    </div>
                    
                    <div className="bg-white/10 backdrop-blur rounded-lg p-4 text-center">
                      <TrendingUp className="w-6 h-6 text-white mx-auto mb-2" />
                      <div className="text-2xl font-bold text-white">{pdMetrics.rhythmVariability}ms</div>
                      <div className="text-sm text-white/80">Rhythm Variability</div>
                      <div className="text-xs text-white/60 mt-1">
                        {pdMetrics.rhythmVariability > 200 ? "High" : "Consistent"}
                      </div>
                    </div>
                  </div>

                  <div className="bg-white/10 backdrop-blur rounded-lg p-4 mb-4">
                    <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                      <Brain className="w-5 h-5" />
                      Detected Symptoms
                    </h4>
                    <ul className="text-sm text-white/90 space-y-2">
                      {pdMetrics.detectedSymptoms.map((symptom, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-white/60 mt-0.5">•</span>
                          <span>{symptom}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-white/10 backdrop-blur rounded-lg p-4">
                    <h4 className="font-semibold text-white mb-2 flex items-center gap-2">
                      <Activity className="w-5 h-5" />
                      Metric Definitions
                    </h4>
                    <ul className="text-sm text-white/80 space-y-1.5">
                      <li>• <strong>Dwell Time:</strong> Duration key is held down (measures bradykinesia)</li>
                      <li>• <strong>Flight Time:</strong> Time between key releases (detects transition delays)</li>
                      <li>• <strong>Rhythm Variability:</strong> Consistency of typing pattern (motor control)</li>
                      <li>• <strong>Motor Score:</strong> Overall fine motor assessment ({pdMetrics.motorControlScore}/100)</li>
                    </ul>
                  </div>
                </Card>
              )}

              {/* Traditional Typing Metrics */}
              <Card className="p-8 bg-card border shadow-card-hover">
                <div className="flex items-center justify-center gap-3 mb-8">
                  <Gauge className="w-8 h-8 text-primary" />
                  <h2 className="text-3xl font-bold text-foreground">Typing Performance</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="text-center">
                    <div className="w-32 h-32 mx-auto rounded-full border-4 border-primary flex items-center justify-center mb-3">
                      <div>
                        <div className="text-4xl font-bold text-foreground">{wpm}</div>
                        <div className="text-sm text-muted-foreground">WPM</div>
                      </div>
                    </div>
                    <div className="font-medium text-foreground">Typing Speed</div>
                  </div>

                  <div className="text-center">
                    <div className="w-32 h-32 mx-auto rounded-full border-4 border-accent flex items-center justify-center mb-3">
                      <div>
                        <div className="text-4xl font-bold text-foreground">{accuracy}%</div>
                        <div className="text-sm text-muted-foreground">{typos} typos</div>
                      </div>
                    </div>
                    <div className="font-medium text-foreground">Accuracy</div>
                  </div>

                  <div className="text-center">
                    <div className="w-32 h-32 mx-auto rounded-full border-4 border-secondary flex items-center justify-center mb-3">
                      <div>
                        <div className="text-4xl font-bold text-foreground">{netWpm}</div>
                        <div className="text-sm text-muted-foreground">WPM</div>
                      </div>
                    </div>
                    <div className="font-medium text-foreground">Net Speed</div>
                  </div>
                </div>

                <div className="bg-muted/50 rounded-lg p-6 mb-6">
                  <h3 className="font-semibold mb-4 text-foreground flex items-center gap-2">
                    <Target className="w-5 h-5 text-primary" />
                    Clinical Recommendations
                  </h3>
                  <p className="text-muted-foreground mb-3">
                    {pdMetrics && pdMetrics.pdProgressionIndex >= 70 && 
                      "✅ Your motor control metrics are within normal range. Continue regular monitoring to establish your baseline."}
                    {pdMetrics && pdMetrics.pdProgressionIndex >= 50 && pdMetrics.pdProgressionIndex < 70 && 
                      "⚠️ Mild motor control variations detected. Consider sharing these results with your neurologist for baseline comparison."}
                    {pdMetrics && pdMetrics.pdProgressionIndex >= 30 && pdMetrics.pdProgressionIndex < 50 && 
                      "⚠️ Moderate motor control symptoms detected. We recommend scheduling a consultation with your healthcare provider."}
                    {pdMetrics && pdMetrics.pdProgressionIndex < 30 && 
                      "🔴 Significant motor control variations detected. Please consult with your neurologist and share these detailed metrics."}
                    {!pdMetrics && "Complete the test with more keystrokes for detailed PD analysis."}
                  </p>
                  {pdMetrics && (
                    <p className="text-sm text-muted-foreground">
                      💡 Take this test regularly (weekly recommended) to track progression trends over time. 
                      Your history is saved locally for comparison.
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button onClick={resetTest} variant="outline" size="lg">
                    Try Again
                  </Button>
                  <Button onClick={async () => {
                    const { data: { session } } = await supabase.auth.getSession();
                    navigate(session ? "/dashboard" : "/");
                  }} size="lg">
                    {user ? "Back to Dashboard" : "Back to Home"}
                  </Button>
                </div>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TypingTest;
