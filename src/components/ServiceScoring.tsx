import { 
  Shield, 
  CheckCircle, 
  TrendingUp, 
  Clock, 
  Wrench,
  Star
} from "lucide-react";

const ServiceScoring = () => {
  const overallScore = 92;
  
  const scoreCategories = [
    {
      name: "Service Regularity",
      score: 95,
      description: "Maintenance performed on schedule",
      icon: Clock,
    },
    {
      name: "Quality of Service",
      score: 88,
      description: "Authorized service centers used",
      icon: Wrench,
    },
    {
      name: "Complete Records",
      score: 94,
      description: "Full documentation available",
      icon: CheckCircle,
    },
    {
      name: "No Major Issues",
      score: 90,
      description: "No accident or damage history",
      icon: Shield,
    },
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
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center">
          <Shield className="w-5 h-5 text-success" />
        </div>
        <h2 className="text-xl font-semibold text-foreground">Vehicle Service Score</h2>
      </div>

      {/* Overall Score */}
      <div className="flex items-center justify-between p-5 rounded-2xl bg-gradient-to-r from-success/10 to-success/5">
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">Trust Score</p>
          <div className="flex items-center gap-2">
            <span className={`text-4xl font-bold ${getScoreColor(overallScore)}`}>
              {overallScore}
            </span>
            <span className="text-lg text-muted-foreground">/100</span>
          </div>
          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium text-white ${badge.color}`}>
            <Star className="w-3 h-3" />
            {badge.label}
          </span>
        </div>
        <div className="relative w-24 h-24">
          <svg className="w-24 h-24 -rotate-90" viewBox="0 0 36 36">
            <path
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="hsl(var(--muted))"
              strokeWidth="3"
            />
            <path
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="hsl(var(--success))"
              strokeWidth="3"
              strokeDasharray={`${overallScore}, 100`}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <TrendingUp className="w-7 h-7 text-success" />
          </div>
        </div>
      </div>

      {/* Score Breakdown */}
      <div className="space-y-4">
        <p className="text-sm font-medium text-foreground">Score Breakdown</p>
        {scoreCategories.map((category, index) => (
          <div key={index} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <category.icon className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-foreground">{category.name}</span>
              </div>
              <span className={`text-sm font-semibold ${getScoreColor(category.score)}`}>
                {category.score}%
              </span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-500 ${getProgressColor(category.score)}`}
                style={{ width: `${category.score}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground">{category.description}</p>
          </div>
        ))}
      </div>

      {/* Trust Indicators */}
      <div className="flex items-center gap-3 p-4 rounded-xl bg-secondary/50">
        <CheckCircle className="w-5 h-5 text-success flex-shrink-0" />
        <p className="text-xs text-muted-foreground">
          This vehicle has a <strong className="text-foreground">verified service history</strong> with consistent maintenance records from authorized service centers.
        </p>
      </div>
    </div>
  );
};

export default ServiceScoring;
