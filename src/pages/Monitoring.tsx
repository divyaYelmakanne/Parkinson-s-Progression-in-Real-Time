import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { Brain, ArrowLeft, Activity, Waves, Hand } from "lucide-react";

const Monitoring = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [sensorData, setSensorData] = useState({
    tremor: 0,
    movement: 0,
    stability: 100,
  });

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
  };

  const startMonitoring = () => {
    setIsMonitoring(true);
    toast.success("Monitoring started");
    
    // Simulate sensor data updates
    const interval = setInterval(() => {
      setSensorData({
        tremor: Math.random() * 5,
        movement: 50 + Math.random() * 50,
        stability: 70 + Math.random() * 30,
      });
    }, 1000);

    return () => clearInterval(interval);
  };

  const stopMonitoring = async () => {
    setIsMonitoring(false);
    toast.success("Monitoring stopped");

    // Save sensor data
    try {
      await supabase.from("sensor_data").insert({
        user_id: user.id,
        sensor_type: "accelerometer",
        tremor_frequency: sensorData.tremor,
        movement_speed: sensorData.movement,
        raw_data: sensorData,
      });
    } catch (error: any) {
      toast.error("Error saving data");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <header className="bg-background/80 backdrop-blur border-b">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <Brain className="w-8 h-8 text-primary" />
            <h1 className="text-2xl font-bold">Live Monitoring</h1>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8 max-w-4xl">
        <Card className="p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Real-Time Sensor Monitoring</h2>
            <p className="text-muted-foreground">
              Track hand tremors, movement patterns, and motor stability
            </p>
          </div>

          {!isMonitoring ? (
            <div className="text-center py-12">
              <Activity className="w-24 h-24 text-muted-foreground mx-auto mb-6" />
              <Button onClick={startMonitoring} size="lg" className="px-12">
                Start Monitoring
              </Button>
              <p className="text-sm text-muted-foreground mt-4">
                Keep your device steady and relaxed
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="p-6 bg-gradient-medical">
                  <div className="flex items-center gap-3 mb-4">
                    <Waves className="w-6 h-6 text-primary-foreground" />
                    <h3 className="font-semibold text-primary-foreground">Tremor</h3>
                  </div>
                  <p className="text-4xl font-bold text-primary-foreground">
                    {sensorData.tremor.toFixed(1)} Hz
                  </p>
                  <p className="text-sm text-primary-foreground/80 mt-2">
                    {sensorData.tremor < 2 ? "Low" : sensorData.tremor < 4 ? "Moderate" : "High"}
                  </p>
                </Card>

                <Card className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Hand className="w-6 h-6 text-primary" />
                    <h3 className="font-semibold">Movement</h3>
                  </div>
                  <p className="text-4xl font-bold text-foreground">
                    {sensorData.movement.toFixed(0)}%
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    {sensorData.movement > 80 ? "Good" : sensorData.movement > 60 ? "Fair" : "Poor"}
                  </p>
                </Card>

                <Card className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Activity className="w-6 h-6 text-primary" />
                    <h3 className="font-semibold">Stability</h3>
                  </div>
                  <p className="text-4xl font-bold text-foreground">
                    {sensorData.stability.toFixed(0)}%
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    {sensorData.stability > 85 ? "Excellent" : sensorData.stability > 70 ? "Good" : "Needs Attention"}
                  </p>
                </Card>
              </div>

              <div className="text-center pt-6">
                <Button onClick={stopMonitoring} size="lg" variant="destructive" className="px-12">
                  Stop Monitoring
                </Button>
              </div>

              <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
                <h4 className="font-semibold mb-2 text-blue-900 dark:text-blue-100">
                  💡 Monitoring Tips
                </h4>
                <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                  <li>• Keep your device stable during monitoring</li>
                  <li>• Try to relax your hands and body</li>
                  <li>• Monitor in a quiet, comfortable environment</li>
                  <li>• Regular monitoring helps track progression better</li>
                </ul>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Monitoring;
