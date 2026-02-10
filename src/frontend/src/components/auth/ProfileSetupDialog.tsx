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
import { GoalType, Sex, ActivityLevel } from '@/backend';

export default function ProfileSetupDialog() {
  const [name, setName] = useState('');
  const [heightCm, setHeightCm] = useState('');
  const [age, setAge] = useState('');
  const [sex, setSex] = useState<Sex | ''>('');
  const [activityLevel, setActivityLevel] = useState<ActivityLevel | ''>('');
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

    if (!heightCm || !age || !sex || !activityLevel) {
      toast.error('Please fill in all health profile fields');
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

    const heightCmNum = parseFloat(heightCm);
    const ageNum = parseInt(age, 10);
    const currentWeightNum = parseFloat(currentWeight);
    const targetWeightNum = parseFloat(targetWeight);
    const weeklyGoalSpeedNum = parseFloat(weeklyGoalSpeed);

    if (isNaN(heightCmNum) || isNaN(ageNum) || isNaN(currentWeightNum) || isNaN(targetWeightNum) || isNaN(weeklyGoalSpeedNum)) {
      toast.error('Please enter valid numbers for all fields');
      return;
    }

    if (heightCmNum <= 0 || ageNum <= 0 || currentWeightNum <= 0 || targetWeightNum <= 0 || weeklyGoalSpeedNum <= 0) {
      toast.error('All values must be positive');
      return;
    }

    try {
      await saveProfile.mutateAsync({
        name: name.trim(),
        heightCm: heightCmNum,
        age: BigInt(ageNum),
        sex: sex as Sex,
        activityLevel: activityLevel as ActivityLevel,
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
          <DialogTitle>Complete Your Profile</DialogTitle>
          <DialogDescription>
            Let's set up your profile to calculate your personalized maintenance calories
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
            <Label htmlFor="heightCm">Height (cm)</Label>
            <Input
              id="heightCm"
              type="number"
              step="0.1"
              min="1"
              value={heightCm}
              onChange={(e) => setHeightCm(e.target.value)}
              placeholder="e.g., 170"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="age">Age (years)</Label>
            <Input
              id="age"
              type="number"
              min="1"
              max="120"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="e.g., 30"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="sex">Sex</Label>
            <Select value={sex} onValueChange={(value) => setSex(value as Sex)}>
              <SelectTrigger id="sex">
                <SelectValue placeholder="Select your sex" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={Sex.male}>Male</SelectItem>
                <SelectItem value={Sex.female}>Female</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="activityLevel">Activity Level</Label>
            <Select value={activityLevel} onValueChange={(value) => setActivityLevel(value as ActivityLevel)}>
              <SelectTrigger id="activityLevel">
                <SelectValue placeholder="Select your activity level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ActivityLevel.sedentary}>Sedentary (little or no exercise)</SelectItem>
                <SelectItem value={ActivityLevel.lightlyActive}>Lightly Active (1-3 days/week)</SelectItem>
                <SelectItem value={ActivityLevel.moderatelyActive}>Moderately Active (3-5 days/week)</SelectItem>
                <SelectItem value={ActivityLevel.veryActive}>Very Active (6-7 days/week)</SelectItem>
                <SelectItem value={ActivityLevel.extraActive}>Extra Active (intense daily exercise)</SelectItem>
              </SelectContent>
            </Select>
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
