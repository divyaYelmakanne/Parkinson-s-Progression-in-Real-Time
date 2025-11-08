import { Card, CardContent } from "@/components/ui/card";
import { Smartphone, Brain, Activity, Bell, LineChart, Users } from "lucide-react";

const steps = [
  {
    icon: Smartphone,
    title: "1. Data Collection",
    description: "Collect movement data in real-time from smartphone sensors (accelerometer, gyroscope), typing data (keystroke speed, rhythm, pressure), voice analysis (tone, speaking speed), and smartwatch data (tremor, walking speed).",
    details: [
      "Accelerometer & gyroscope detect hand tremors",
      "Keystroke speed, timing, and pressure patterns",
      "Voice tone and speaking speed changes",
      "Smartwatch tracks hand tremor and gait"
    ],
    step: "01"
  },
  {
    icon: Activity,
    title: "2. Data Processing",
    description: "Clean data and extract important movement indicators like average typing speed, tremor frequency, time delay between actions, and voice tone changes.",
    details: [
      "Average typing speed and rhythm",
      "Tremor frequency (hand shaking speed)",
      "Action delay timings",
      "Voice tone variations"
    ],
    step: "02"
  },
  {
    icon: Brain,
    title: "3. AI Analysis",
    description: "Machine learning models (Random Forest, CNN, LSTM) compare today's data with previous days to detect small changes indicating disease progression.",
    details: [
      "Compare daily patterns over time",
      "Detect 10%+ changes in tremor or typing",
      "Identify progression indicators",
      "Generate motor control scores"
    ],
    step: "03"
  },
  {
    icon: LineChart,
    title: "4. Real-Time Monitoring",
    description: "Dashboard shows live status with color-coded indicators: Green (stable), Yellow (mild change), Red (possible progression - consult doctor).",
    details: [
      "✅ Stable: No significant changes",
      "⚠️ Mild change detected",
      "🔴 Progression - consult doctor",
      "Real-time updates as you interact"
    ],
    step: "04"
  },
  {
    icon: Bell,
    title: "5. Alerts & Reports",
    description: "Send alerts to doctors/caregivers and generate weekly/monthly reports showing improvement or decline graphs with auto-generated summaries.",
    details: [
      "Doctor/caregiver notifications",
      "Weekly and monthly trend reports",
      "Improvement/decline graphs",
      "Actionable health summaries"
    ],
    step: "05"
  }
];

const HowItWorks = () => {
  return (
    <section className="py-24 bg-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40">
        <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground">
            How It Works (Step-by-Step)
          </h2>
          <p className="text-lg text-muted-foreground">
            From passive data collection to actionable clinical insights in five seamless steps
          </p>
        </div>

        <div className="space-y-6 max-w-6xl mx-auto">
          {steps.map((step, index) => (
            <Card 
              key={index} 
              className="border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-medical group overflow-hidden"
            >
              <CardContent className="p-8">
                <div className="flex flex-col md:flex-row gap-6 items-start">
                  {/* Icon and step number */}
                  <div className="flex-shrink-0">
                    <div className="relative">
                      <div className="absolute -top-3 -left-3 text-7xl font-bold text-primary/5 group-hover:text-primary/10 transition-colors">
                        {step.step}
                      </div>
                      <div className="w-20 h-20 rounded-2xl bg-gradient-medical flex items-center justify-center group-hover:scale-110 transition-transform relative z-10">
                        <step.icon className="w-10 h-10 text-primary-foreground" />
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 space-y-4">
                    <h3 className="text-2xl font-bold text-foreground">{step.title}</h3>
                    <p className="text-base text-muted-foreground leading-relaxed">
                      {step.description}
                    </p>
                    
                    {/* Details list */}
                    <div className="bg-background/50 backdrop-blur rounded-lg p-4 border">
                      <ul className="space-y-2">
                        {step.details.map((detail, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                            <span className="text-primary mt-0.5 flex-shrink-0">•</span>
                            <span>{detail}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Output Example Section */}
        <div className="mt-16 max-w-4xl mx-auto">
          <Card className="border-2 shadow-medical bg-gradient-medical">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-primary-foreground mb-4 flex items-center gap-2">
                <LineChart className="w-6 h-6" />
                📊 Output Example
              </h3>
              <ul className="space-y-3 text-primary-foreground/90">
                <li className="flex items-start gap-2">
                  <span className="flex-shrink-0">•</span>
                  <span>Dashboard graph showing daily tremor level or typing stability</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="flex-shrink-0">•</span>
                  <span>Color-coded progress bar (Green = stable, Yellow = mild, Red = severe)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="flex-shrink-0">•</span>
                  <span>Auto-generated summary: <em>"Your motor performance decreased by 8% this week. Consider consulting your neurologist."</em></span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Future Enhancements */}
        <div className="mt-8 max-w-4xl mx-auto">
          <Card className="border-2 shadow-card-hover">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
                <Users className="w-6 h-6 text-accent" />
                🧠 Future Enhancements
              </h3>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-accent flex-shrink-0">•</span>
                  <span>Integrate smartwatch or IoT sensors for continuous tracking</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent flex-shrink-0">•</span>
                  <span>Add speech analysis for early voice-based detection</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent flex-shrink-0">•</span>
                  <span>Send weekly summary reports to doctors</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent flex-shrink-0">•</span>
                  <span>Add medication reminders and personalized health tips</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Simple Summary */}
        <div className="mt-12 text-center max-w-3xl mx-auto">
          <Card className="border-2 shadow-medical p-8 bg-background/50 backdrop-blur">
            <p className="text-lg text-foreground leading-relaxed">
              <strong>💬 Simple Summary:</strong> NeuroType+ is like a smart assistant that quietly watches 
              how a Parkinson's patient types, moves, or talks every day — and warns them early if their 
              condition is getting worse.
            </p>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
