import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Keyboard, Mic, Smartphone, PieChart, Shield, Sparkles } from "lucide-react";

const features = [
  {
    icon: Keyboard,
    title: "Keystroke Dynamics",
    description: "Analyzes typing speed, rhythm, and pressure patterns to detect fine motor degradation over time.",
    color: "text-primary"
  },
  {
    icon: Mic,
    title: "Voice Pattern Analysis",
    description: "Monitors speech tremor, tone variations, and vocal slowness using advanced MFCC and CNN embeddings.",
    color: "text-accent"
  },
  {
    icon: Smartphone,
    title: "Hand Tremor Detection",
    description: "Captures micro hand movements through smartphone accelerometer sensors for precise tremor analysis.",
    color: "text-primary"
  },
  {
    icon: PieChart,
    title: "PD Progression Index",
    description: "Unified 0-100 score aligned with MDS-UPDRS scale, visualized through intuitive trend graphs.",
    color: "text-accent"
  },
  {
    icon: Shield,
    title: "Privacy-First Design",
    description: "End-to-end encryption with anonymized patient IDs. Only timing metadata stored—no content captured.",
    color: "text-primary"
  },
  {
    icon: Sparkles,
    title: "AI Explainability",
    description: "SHAP and LIME integration reveals which parameters contribute most to progression changes.",
    color: "text-accent"
  }
];

const Features = () => {
  return (
    <section className="py-24 bg-background relative">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground">
            Advanced Digital Biomarkers
          </h2>
          <p className="text-lg text-muted-foreground">
            Our multi-modal AI platform continuously monitors subtle changes in motor control,
            providing clinicians with actionable insights.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card 
              key={index}
              className="border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-medical group"
            >
              <CardHeader>
                <div className={`w-12 h-12 rounded-xl bg-gradient-medical flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <feature.icon className="w-6 h-6 text-primary-foreground" />
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
