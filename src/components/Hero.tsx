import { Button } from "@/components/ui/button";
import { Activity, Brain, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ThemeToggle from "@/components/ThemeToggle";

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-subtle">
      <ThemeToggle />
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse-slow delay-1000" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-card px-4 py-2 rounded-full border shadow-card-hover animate-float">
            <Brain className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-foreground">AI-Powered Digital Biomarker Platform</span>
          </div>

          {/* Main heading */}
          <h1 className="text-5xl md:text-7xl font-bold text-foreground leading-tight">
            Track Parkinson's
            <span className="block bg-gradient-medical bg-clip-text text-transparent">
              Progression in Real-Time
            </span>
          </h1>

          {/* Description */}
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            NeuroType+ transforms everyday digital interactions into objective health insights.
            Monitor keystroke patterns, voice changes, and hand tremors with clinical-grade precision.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button 
              size="lg" 
              className="text-lg px-8 shadow-medical hover:shadow-xl transition-all"
              onClick={() => navigate("/typing-test")}
            >
              Get Started
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="text-lg px-8"
              onClick={() => navigate("/demo")}
            >
              Watch Demo
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-16 max-w-3xl mx-auto">
            <div className="bg-card rounded-2xl p-6 shadow-card-hover border hover:shadow-medical transition-all">
              <Activity className="w-8 h-8 text-primary mx-auto mb-3" />
              <div className="text-3xl font-bold text-foreground mb-1">24/7</div>
              <div className="text-sm text-muted-foreground">Continuous Monitoring</div>
            </div>
            <div className="bg-card rounded-2xl p-6 shadow-card-hover border hover:shadow-medical transition-all">
              <Brain className="w-8 h-8 text-accent mx-auto mb-3" />
              <div className="text-3xl font-bold text-foreground mb-1">50+</div>
              <div className="text-sm text-muted-foreground">Digital Biomarkers</div>
            </div>
            <div className="bg-card rounded-2xl p-6 shadow-card-hover border hover:shadow-medical transition-all">
              <TrendingUp className="w-8 h-8 text-primary mx-auto mb-3" />
              <div className="text-3xl font-bold text-foreground mb-1">95%</div>
              <div className="text-sm text-muted-foreground">Detection Accuracy</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
