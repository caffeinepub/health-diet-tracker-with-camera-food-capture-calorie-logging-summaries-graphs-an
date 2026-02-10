import { useState } from 'react';
import { useGetHealthRecords, useAddHealthRecord } from '../hooks/useHealthRecords';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Activity, Droplet, Heart } from 'lucide-react';
import { toast } from 'sonner';

type MetricType = 'hemoglobin' | 'platelets' | 'systolicBP' | 'diastolicBP';

interface MetricConfig {
  label: string;
  unit: string;
  placeholder: string;
  icon: React.ComponentType<{ className?: string }>;
  min: number;
  max: number;
}

const METRIC_CONFIGS: Record<MetricType, MetricConfig> = {
  hemoglobin: {
    label: 'Hemoglobin',
    unit: 'g/dL',
    placeholder: 'e.g., 14.5',
    icon: Droplet,
    min: 0,
    max: 30,
  },
  platelets: {
    label: 'Platelets',
    unit: '×10³/µL',
    placeholder: 'e.g., 250',
    icon: Activity,
    min: 0,
    max: 1000,
  },
  systolicBP: {
    label: 'Blood Pressure (High/Systolic)',
    unit: 'mmHg',
    placeholder: 'e.g., 120',
    icon: Heart,
    min: 0,
    max: 300,
  },
  diastolicBP: {
    label: 'Blood Pressure (Low/Diastolic)',
    unit: 'mmHg',
    placeholder: 'e.g., 80',
    icon: Heart,
    min: 0,
    max: 200,
  },
};

export default function HealthRecordsPage() {
  const { data: records = [], isLoading } = useGetHealthRecords();
  const addRecord = useAddHealthRecord();

  const [showForm, setShowForm] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState<MetricType>('hemoglobin');
  const [value, setValue] = useState('');
  const [date, setDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const numValue = parseFloat(value);
    const config = METRIC_CONFIGS[selectedMetric];

    if (!value || isNaN(numValue)) {
      toast.error('Please enter a valid numeric value');
      return;
    }

    if (numValue < config.min || numValue > config.max) {
      toast.error(`Value must be between ${config.min} and ${config.max}`);
      return;
    }

    if (!date) {
      toast.error('Please select a date');
      return;
    }

    try {
      const snapshot: any = {
        hemoglobin: undefined,
        platelets: undefined,
        systolicBP: undefined,
        diastolicBP: undefined,
      };

      if (selectedMetric === 'systolicBP' || selectedMetric === 'diastolicBP') {
        snapshot[selectedMetric] = BigInt(Math.round(numValue));
      } else {
        snapshot[selectedMetric] = numValue;
      }

      await addRecord.mutateAsync(snapshot);
      toast.success('Health record added successfully');
      setValue('');
      setShowForm(false);
    } catch (error: any) {
      console.error('Error adding health record:', error);
      toast.error(error.message || 'Failed to add health record');
    }
  };

  const formatRecordDate = (timestamp: bigint) => {
    // Backend currently returns 0 for timestamp, so we'll show "Recent" for now
    if (timestamp === 0n) {
      return 'Recent';
    }
    const date = new Date(Number(timestamp) * 1000);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getRecordDisplay = (record: any) => {
    const entries: Array<{ type: string; value: string; unit: string; icon: React.ComponentType<{ className?: string }> }> = [];

    if (record.hemoglobin !== undefined) {
      entries.push({
        type: 'Hemoglobin',
        value: record.hemoglobin.toFixed(1),
        unit: 'g/dL',
        icon: Droplet,
      });
    }
    if (record.platelets !== undefined) {
      entries.push({
        type: 'Platelets',
        value: record.platelets.toFixed(0),
        unit: '×10³/µL',
        icon: Activity,
      });
    }
    if (record.systolicBP !== undefined) {
      entries.push({
        type: 'BP Systolic',
        value: record.systolicBP.toString(),
        unit: 'mmHg',
        icon: Heart,
      });
    }
    if (record.diastolicBP !== undefined) {
      entries.push({
        type: 'BP Diastolic',
        value: record.diastolicBP.toString(),
        unit: 'mmHg',
        icon: Heart,
      });
    }

    return entries;
  };

  const config = METRIC_CONFIGS[selectedMetric];
  const MetricIcon = config.icon;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Health Records</h1>
          <p className="text-muted-foreground">Track your lab results and vital signs</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} size="lg">
          <Plus className="w-4 h-4 mr-2" />
          Add Record
        </Button>
      </div>

      {showForm && (
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MetricIcon className="w-5 h-5 text-primary" />
              Add Health Record
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="metric-type">Metric Type</Label>
                <Select value={selectedMetric} onValueChange={(val) => setSelectedMetric(val as MetricType)}>
                  <SelectTrigger id="metric-type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(METRIC_CONFIGS).map(([key, cfg]) => (
                      <SelectItem key={key} value={key}>
                        {cfg.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="value">
                  Value ({config.unit})
                </Label>
                <Input
                  id="value"
                  type="number"
                  step="0.1"
                  placeholder={config.placeholder}
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  max={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>

              <div className="flex gap-3">
                <Button type="submit" disabled={addRecord.isPending}>
                  {addRecord.isPending ? 'Adding...' : 'Add Record'}
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Your Health Records</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">Loading records...</div>
          ) : records.length === 0 ? (
            <div className="text-center py-12">
              <Activity className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-2">No health records yet</p>
              <p className="text-sm text-muted-foreground">
                Add your first record to start tracking your health metrics
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {records.map((record, index) => {
                const entries = getRecordDisplay(record);
                return (
                  <div
                    key={index}
                    className="border rounded-lg p-4 hover:bg-accent/5 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm text-muted-foreground">
                        {formatRecordDate(record.timestamp)}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {entries.map((entry, idx) => {
                        const Icon = entry.icon;
                        return (
                          <div key={idx} className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                              <Icon className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                              <div className="text-sm text-muted-foreground">{entry.type}</div>
                              <div className="font-semibold">
                                {entry.value} <span className="text-sm text-muted-foreground">{entry.unit}</span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
