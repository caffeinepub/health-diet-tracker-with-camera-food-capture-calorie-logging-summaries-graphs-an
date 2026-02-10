import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, Droplet, Heart } from 'lucide-react';
import { useGetBaselineHealthSnapshot } from '../../hooks/useBaselineHealthSnapshot';
import { Variant_blood_vitals } from '@/backend';

interface MetricDisplay {
  label: string;
  value: string;
  unit: string;
  icon: React.ComponentType<{ className?: string }>;
}

export default function BaselineHealthCard() {
  const { data: baseline = [], isLoading, isError } = useGetBaselineHealthSnapshot();

  if (isLoading) {
    return (
      <Card className="bg-gradient-to-br from-accent/10 to-accent/5 border-accent/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-accent" />
            Baseline Health
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4 text-sm text-muted-foreground">
            Loading baseline health data...
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card className="bg-gradient-to-br from-accent/10 to-accent/5 border-accent/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-accent" />
            Baseline Health
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4 text-sm text-muted-foreground">
            Could not load baseline health data
          </div>
        </CardContent>
      </Card>
    );
  }

  if (baseline.length === 0) {
    return null;
  }

  const getMetricIcon = (metric: string) => {
    if (metric.toLowerCase().includes('bp') || metric.toLowerCase().includes('pulse')) {
      return Heart;
    }
    if (metric.toLowerCase().includes('hemoglobin') || metric.toLowerCase().includes('hematocrit')) {
      return Droplet;
    }
    return Activity;
  };

  const getMetricUnit = (metric: string) => {
    const m = metric.toLowerCase();
    if (m.includes('hemoglobin')) return 'g/dL';
    if (m.includes('platelets')) return '×10³/µL';
    if (m.includes('bp')) return 'mmHg';
    if (m.includes('pulse')) return 'bpm';
    if (m.includes('glucose')) return 'mg/dL';
    if (m.includes('hba1c')) return '%';
    if (m.includes('cholesterol')) return 'mg/dL';
    if (m.includes('wbc')) return '×10³/µL';
    if (m.includes('hematocrit')) return '%';
    return '';
  };

  const getMetricLabel = (metric: string) => {
    const labels: Record<string, string> = {
      'Hemoglobin': 'Hemoglobin',
      'Platelets': 'Platelets',
      'SystolicBP': 'BP Systolic',
      'DiastolicBP': 'BP Diastolic',
      'Pulse': 'Pulse',
      'Glucose': 'Glucose',
      'hba1c': 'HbA1c',
      'cholesterolTot': 'Cholesterol',
      'WBC': 'White Blood Cells',
      'Hematocrit': 'Hematocrit',
    };
    return labels[metric] || metric;
  };

  const displayMetrics: MetricDisplay[] = baseline
    .filter(b => b.value && b.value !== '')
    .map(b => ({
      label: getMetricLabel(b.metric),
      value: b.value,
      unit: getMetricUnit(b.metric),
      icon: getMetricIcon(b.metric),
    }));

  if (displayMetrics.length === 0) {
    return null;
  }

  return (
    <Card className="bg-gradient-to-br from-accent/10 to-accent/5 border-accent/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-accent" />
          Baseline Health
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {displayMetrics.map((metric, index) => {
            const Icon = metric.icon;
            return (
              <div key={index}>
                <div className="flex items-center gap-2 mb-1">
                  <Icon className="w-4 h-4 text-accent" />
                  <div className="text-sm text-muted-foreground">{metric.label}</div>
                </div>
                <div className="text-lg font-semibold">
                  {metric.value} <span className="text-sm text-muted-foreground">{metric.unit}</span>
                </div>
              </div>
            );
          })}
        </div>
        {displayMetrics.length === 0 && (
          <div className="text-center py-4 text-sm text-muted-foreground">
            No baseline health data available yet
          </div>
        )}
      </CardContent>
    </Card>
  );
}
