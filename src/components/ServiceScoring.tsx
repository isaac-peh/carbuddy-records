import { Shield, CheckCircle, Clock, Wrench, Star } from "lucide-react";

const ServiceScoring = () => {
  const overallScore = 92;
  
  const scoreCategories = [
    { name: "Regularity", score: 95, icon: Clock },
    { name: "Quality", score: 88, icon: Wrench },
    { name: "Records", score: 94, icon: CheckCircle },
    { name: "No Issues", score: 90, icon: Shield },
  ];

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-trust-excellent";
    if (score >= 75) return "text-trust-good";
    if (score >= 50) return "text-trust-average";
    return "text-trust-poor";
  };

  const getProgressColor = (score: number) => {
    if (score >= 90) return "bg-trust-excellent";
    if (score >= 75) return "bg-trust-good";
    if (score >= 50) return "bg-trust-average";
    return "bg-trust-poor";
  };

  const getTrustBadge = (score: number) => {
    if (score >= 90) return { label: "Excellent", color: "bg-trust-excellent" };
    if (score >= 75) return { label: "Good", color: "bg-trust-good" };
    if (score >= 50) return { label: "Average", color: "bg-trust-average" };
    return { label: "Poor", color: "bg-trust-poor" };
  };

  const badge = getTrustBadge(overallScore);

  return (
    <div className="space-y-5">
      <h2 className="text-lg font-semibold text-foreground">Service Score</h2>

      <div className="p-5 rounded-2xl bg-section-warm shadow-soft">
        <div className="flex items-center gap-5">
          <div className="relative w-24 h-24 flex-shrink-0">
            <svg className="w-24 h-24 -rotate-90" viewBox="0 0 36 36">
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="hsl(var(--muted))"
                strokeWidth="2.5"
              />
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="hsl(var(--success))"
                strokeWidth="2.5"
                strokeDasharray={`${overallScore}, 100`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={`text-2xl font-bold leading-none ${getScoreColor(overallScore)}`}>{overallScore}</span>
              <span className="text-[10px] text-muted-foreground">/100</span>
            </div>
          </div>
          <div className="space-y-3 flex-1">
            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium text-white ${badge.color}`}>
              <Star className="w-3 h-3" />
              {badge.label}
            </span>
            <div className="space-y-2">
              {scoreCategories.map((cat, i) => (
                <div key={i} className="flex items-center gap-2">
                  <cat.icon className="w-3.5 h-3.5 text-muted-foreground" strokeWidth={1.5} />
                  <span className="text-xs text-muted-foreground w-16">{cat.name}</span>
                  <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${getProgressColor(cat.score)}`}
                      style={{ width: `${cat.score}%` }}
                    />
                  </div>
                  <span className={`text-[11px] font-semibold w-7 text-right ${getScoreColor(cat.score)}`}>{cat.score}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 text-xs text-muted-foreground px-1">
        <CheckCircle className="w-3.5 h-3.5 text-success flex-shrink-0" strokeWidth={1.5} />
        <span>Verified service history from authorized centers</span>
      </div>
    </div>
  );
};

export default ServiceScoring;
