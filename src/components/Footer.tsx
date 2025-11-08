import { Brain } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-card border-t py-12">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-medical flex items-center justify-center">
              <Brain className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <div className="font-bold text-lg text-foreground">NeuroType+</div>
              <div className="text-xs text-muted-foreground">Digital Biomarker Platform</div>
            </div>
          </div>
          
          <div className="text-center md:text-right">
            <p className="text-sm text-muted-foreground">
              © 2025 NeuroType+. Medical-grade AI platform.
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Privacy-first design with clinical validation
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
