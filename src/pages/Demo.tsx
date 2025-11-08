import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Play, Brain, Activity, Smartphone } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ThemeToggle from "@/components/ThemeToggle";

const Demo = () => {
  const navigate = useNavigate();

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
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
              See NeuroType+ in Action
            </h1>
            <p className="text-xl text-muted-foreground">
              Watch how our platform transforms digital interactions into clinical insights
            </p>
          </div>

          <Card className="p-8 mb-8 shadow-card-hover border">
            <div className="aspect-video bg-muted rounded-lg overflow-hidden">
              <iframe
                width="100%"
                height="100%"
                src="https://www.youtube.com/embed/ev_xKQibUSU"
                title="NeuroType+ Demo"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              />
            </div>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <Card className="p-6 shadow-card-hover border hover:shadow-medical transition-all">
              <Brain className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-foreground">AI Analysis</h3>
              <p className="text-muted-foreground">
                Real-time keystroke pattern analysis using advanced machine learning
              </p>
            </Card>

            <Card className="p-6 shadow-card-hover border hover:shadow-medical transition-all">
              <Activity className="w-12 h-12 text-accent mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-foreground">Live Monitoring</h3>
              <p className="text-muted-foreground">
                Continuous tracking of motor control metrics throughout the day
              </p>
            </Card>

            <Card className="p-6 shadow-card-hover border hover:shadow-medical transition-all">
              <Smartphone className="w-12 h-12 text-secondary mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-foreground">Easy Integration</h3>
              <p className="text-muted-foreground">
                Works seamlessly with your existing devices and daily routine
              </p>
            </Card>
          </div>

          <div className="text-center">
            <Button size="lg" onClick={() => navigate("/typing-test")} className="mr-4">
              Try Typing Test
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate("/")}>
              Explore Features
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Demo;
