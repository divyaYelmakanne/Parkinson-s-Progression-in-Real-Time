import { Card } from "@/components/ui/card";
import { AlertCircle, TrendingDown, Calendar, Bell, Sparkles } from "lucide-react";

const WhyItMatters = () => {
  return (
    <section className="py-24 bg-gradient-subtle relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12 space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground">
              Why Continuous Monitoring Matters
            </h2>
            <p className="text-xl text-muted-foreground">
              Traditional monitoring misses the full picture of Parkinson's progression
            </p>
          </div>

          <Card className="p-8 mb-8 border-2 shadow-medical">
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <AlertCircle className="w-8 h-8 text-accent flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-2xl font-bold text-foreground mb-3">The Challenge</h3>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    Parkinson's disease causes slow changes in movement, like hand tremors, stiffness, 
                    and slower typing or walking. Doctors can only check these changes during hospital 
                    visits, which happen maybe once every few months.
                  </p>
                  <p className="text-lg text-muted-foreground leading-relaxed mt-3">
                    <strong className="text-foreground">The Problem:</strong> Small daily changes often go unnoticed, 
                    missing critical early warnings when symptoms worsen.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                <div className="bg-background/50 backdrop-blur rounded-lg p-4 border">
                  <TrendingDown className="w-8 h-8 text-primary mb-2" />
                  <h4 className="font-semibold text-foreground mb-2">Gradual Decline</h4>
                  <p className="text-sm text-muted-foreground">
                    Symptoms worsen slowly between visits, making it hard to track progression accurately
                  </p>
                </div>

                <div className="bg-background/50 backdrop-blur rounded-lg p-4 border">
                  <Calendar className="w-8 h-8 text-primary mb-2" />
                  <h4 className="font-semibold text-foreground mb-2">Infrequent Checkups</h4>
                  <p className="text-sm text-muted-foreground">
                    Clinical visits every 3-6 months can't capture day-to-day symptom variations
                  </p>
                </div>

                <div className="bg-background/50 backdrop-blur rounded-lg p-4 border">
                  <Bell className="w-8 h-8 text-primary mb-2" />
                  <h4 className="font-semibold text-foreground mb-2">Delayed Response</h4>
                  <p className="text-sm text-muted-foreground">
                    By the time symptoms are severe enough to notice, treatment adjustments are overdue
                  </p>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-8 border-2 shadow-medical bg-gradient-medical">
            <div className="flex items-start gap-4">
              <Sparkles className="w-8 h-8 text-primary-foreground flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-2xl font-bold text-primary-foreground mb-3">Our Solution</h3>
                <p className="text-lg text-primary-foreground/90 leading-relaxed">
                  NeuroType+ helps by tracking these changes continuously — giving early warnings 
                  when symptoms worsen. Using AI + smartphone sensors to detect motor changes 
                  (movement, tremor, reaction time, typing pattern) automatically.
                </p>
                <p className="text-lg text-primary-foreground/90 leading-relaxed mt-3">
                  The app analyzes and shows real-time progress to doctors and patients, enabling 
                  proactive treatment adjustments before symptoms become severe.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default WhyItMatters;
