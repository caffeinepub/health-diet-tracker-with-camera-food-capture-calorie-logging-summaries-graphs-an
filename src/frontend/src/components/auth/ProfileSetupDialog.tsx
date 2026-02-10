import { useState } from 'react';
import { useSaveCallerUserProfile } from '../../hooks/useCurrentUserProfile';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { GoalType } from '@/backend';

export default function ProfileSetupDialog() {
  const [name, setName] = useState('');
  const [goalType, setGoalType] = useState<GoalType | ''>('');
  const [currentWeight, setCurrentWeight] = useState('');
  const [targetWeight, setTargetWeight] = useState('');
  const [weeklyGoalSpeed, setWeeklyGoalSpeed] = useState('');
  
  const saveProfile = useSaveCallerUserProfile();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error('Please enter your name');
      return;
    }

    if (!goalType) {
      toast.error('Please select a body goal');
      return;
    }

    if (!currentWeight || !targetWeight || !weeklyGoalSpeed) {
      toast.error('Please fill in all weight and goal fields');
      return;
    }

    const currentWeightNum = parseFloat(currentWeight);
    const targetWeightNum = parseFloat(targetWeight);
    const weeklyGoalSpeedNum = parseFloat(weeklyGoalSpeed);

    if (isNaN(currentWeightNum) || isNaN(targetWeightNum) || isNaN(weeklyGoalSpeedNum)) {
      toast.error('Please enter valid numbers for weight fields');
      return;
    }

    if (currentWeightNum <= 0 || targetWeightNum <= 0 || weeklyGoalSpeedNum <= 0) {
      toast.error('Weight values must be positive');
      return;
    }

    try {
      await saveProfile.mutateAsync({
        name: name.trim(),
        bodyGoal: {
          goalType: goalType as GoalType,
          currentWeight: currentWeightNum,
          targetWeight: targetWeightNum,
          weeklyGoalSpeed: weeklyGoalSpeedNum,
        },
      });
      toast.success('Profile created successfully!');
    } catch (error) {
      toast.error('Failed to create profile. Please try again.');
      console.error('Profile setup error:', error);
    }
  };

  return (
    <Dialog open={true}>
      <DialogContent 
        className="sm:max-w-md max-h-[90vh] overflow-y-auto" 
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>Welcome to NutriScan!</DialogTitle>
          <DialogDescription>
            Let's set up your profile and body goals to get started
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Your Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              autoFocus
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="goalType">Body Goal</Label>
            <Select value={goalType} onValueChange={(value) => setGoalType(value as GoalType)}>
              <SelectTrigger id="goalType">
                <SelectValue placeholder="Select your goal" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={GoalType.loseWeight}>Lose Weight</SelectItem>
                <SelectItem value={GoalType.gainWeight}>Gain Weight</SelectItem>
                <SelectItem value={GoalType.gainMuscle}>Gain Muscle</SelectItem>
                <SelectItem value={GoalType.maintain}>Maintain Weight</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="currentWeight">Current Weight (kg)</Label>
            <Input
              id="currentWeight"
              type="number"
              step="0.1"
              min="1"
              value={currentWeight}
              onChange={(e) => setCurrentWeight(e.target.value)}
              placeholder="e.g., 70"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="targetWeight">Target Weight (kg)</Label>
            <Input
              id="targetWeight"
              type="number"
              step="0.1"
              min="1"
              value={targetWeight}
              onChange={(e) => setTargetWeight(e.target.value)}
              placeholder="e.g., 65"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="weeklyGoalSpeed">Weekly Goal Speed (kg/week)</Label>
            <Input
              id="weeklyGoalSpeed"
              type="number"
              step="0.1"
              min="0.1"
              max="2"
              value={weeklyGoalSpeed}
              onChange={(e) => setWeeklyGoalSpeed(e.target.value)}
              placeholder="e.g., 0.5"
              required
            />
            <p className="text-xs text-muted-foreground">
              Recommended: 0.25-1 kg per week for healthy progress
            </p>
          </div>

          <Button type="submit" disabled={saveProfile.isPending} className="w-full">
            {saveProfile.isPending ? 'Creating Profile...' : 'Get Started'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
