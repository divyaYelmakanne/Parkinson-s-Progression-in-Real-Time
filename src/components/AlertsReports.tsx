import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bell, FileText, Download, TrendingDown, AlertCircle, Calendar } from "lucide-react";
import { useState, useEffect } from "react";

interface Alert {
  id: number;
  type: "warning" | "critical" | "info";
  title: string;
  message: string;
  time: string;
  isNew: boolean;
}

const AlertsReports = () => {
  const [alerts, setAlerts] = useState<Alert[]>([
    {
      id: 1,
      type: "critical",
      title: "Motor Performance Declined",
      message: "Your motor performance decreased by 12.5% this week. Consider consulting your neurologist.",
      time: "2 hours ago",
      isNew: true
    },
    {
      id: 2,
      type: "warning",
      title: "Typing Speed Change",
      message: "Typing speed has decreased by 8.3% from your baseline. Monitor closely.",
      time: "5 hours ago",
      isNew: true
    },
    {
      id: 3,
      type: "info",
      title: "Weekly Report Ready",
      message: "Your weekly health summary report is ready for download.",
      time: "1 day ago",
      isNew: false
    }
  ]);

  const [currentAlertIndex, setCurrentAlertIndex] = useState(0);

  // Rotate through alerts
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentAlertIndex(prev => (prev + 1) % alerts.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [alerts.length]);

  const getAlertColor = (type: Alert["type"]) => {
    switch (type) {
      case "critical":
        return "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/30";
      case "warning":
        return "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/30";
      case "info":
        return "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/30";
    }
  };

  const getAlertIcon = (type: Alert["type"]) => {
    switch (type) {
      case "critical":
        return <AlertCircle className="w-5 h-5" />;
      case "warning":
        return <Bell className="w-5 h-5" />;
      case "info":
        return <FileText className="w-5 h-5" />;
    }
  };

  return (
    <section className="py-24 bg-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-1/2 right-1/3 w-96 h-96 bg-red-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/2 left-1/3 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground">
            Alerts & Reports
          </h2>
          <p className="text-xl text-muted-foreground">
            Automated notifications and comprehensive health summaries
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Live Alerts Section */}
          <Card className="border-2 shadow-medical">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-primary" />
                Live Alerts
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Featured Alert */}
              <Card className={`border-2 transition-all duration-500 ${getAlertColor(alerts[currentAlertIndex].type)}`}>
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      {getAlertIcon(alerts[currentAlertIndex].type)}
                      <span className="font-semibold">{alerts[currentAlertIndex].title}</span>
                    </div>
                    {alerts[currentAlertIndex].isNew && (
                      <Badge className="bg-primary text-primary-foreground text-xs">NEW</Badge>
                    )}
                  </div>
                  <p className="text-sm">{alerts[currentAlertIndex].message}</p>
                  <div className="flex items-center justify-between text-xs opacity-70">
                    <span>{alerts[currentAlertIndex].time}</span>
                    <Button size="sm" variant="ghost" className="h-7 text-xs">View Details</Button>
                  </div>
                </CardContent>
              </Card>

              {/* All Alerts List */}
              <div className="space-y-2">
                {alerts.map((alert) => (
                  <Card 
                    key={alert.id}
                    className={`border cursor-pointer hover:border-primary/50 transition-all ${
                      currentAlertIndex === alerts.indexOf(alert) ? 'opacity-100' : 'opacity-60'
                    }`}
                  >
                    <CardContent className="p-3 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getAlertIcon(alert.type)}
                        <span className="text-sm font-medium">{alert.title}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">{alert.time}</span>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Alert Statistics */}
              <Card className="bg-gradient-medical border-0">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between text-primary-foreground">
                    <div>
                      <div className="text-2xl font-bold">3</div>
                      <div className="text-xs opacity-90">Active Alerts</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold">2</div>
                      <div className="text-xs opacity-90">Require Action</div>
                    </div>
                    <Bell className="w-8 h-8 opacity-50" />
                  </div>
                </CardContent>
              </Card>
            </CardContent>
          </Card>

          {/* Reports Section */}
          <Card className="border-2 shadow-medical">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-accent" />
                Health Reports
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Weekly Report */}
              <Card className="border-2 border-primary/30 hover:border-primary/50 transition-all cursor-pointer">
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <h4 className="font-semibold flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        Weekly Summary Report
                      </h4>
                      <p className="text-sm text-muted-foreground">Jan 15 - Jan 21, 2025</p>
                    </div>
                    <Badge className="bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/30">
                      Ready
                    </Badge>
                  </div>
                  <div className="bg-background/50 backdrop-blur rounded p-3 space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Overall Status:</span>
                      <span className="font-medium flex items-center gap-1">
                        <TrendingDown className="w-3 h-3 text-destructive" />
                        Mild Decline
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tests Completed:</span>
                      <span className="font-medium">12</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Avg PD Index:</span>
                      <span className="font-medium">49.2</span>
                    </div>
                  </div>
                  <Button className="w-full" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Download PDF Report
                  </Button>
                </CardContent>
              </Card>

              {/* Monthly Report */}
              <Card className="border-2 hover:border-accent/50 transition-all cursor-pointer">
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <h4 className="font-semibold flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        Monthly Progress Report
                      </h4>
                      <p className="text-sm text-muted-foreground">January 2025</p>
                    </div>
                    <Badge className="bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/30">
                      Available
                    </Badge>
                  </div>
                  <div className="bg-background/50 backdrop-blur rounded p-3 space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Trend:</span>
                      <span className="font-medium">8.3% Decline</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tests Completed:</span>
                      <span className="font-medium">48</span>
                    </div>
                  </div>
                  <Button className="w-full" variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Download Report
                  </Button>
                </CardContent>
              </Card>

              {/* Report Features */}
              <Card className="bg-muted/30 border-0">
                <CardContent className="p-4 space-y-2">
                  <h4 className="font-semibold text-sm mb-3">Report Includes:</h4>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <span className="text-primary">•</span>
                      <span>Improvement/decline graphs</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-primary">•</span>
                      <span>Doctor/caregiver notifications</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-primary">•</span>
                      <span>Actionable health summaries</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-primary">•</span>
                      <span>Medication correlation analysis</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default AlertsReports;
