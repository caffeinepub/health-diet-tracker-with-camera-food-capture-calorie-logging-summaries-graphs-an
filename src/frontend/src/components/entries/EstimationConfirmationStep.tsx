import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useAddFoodEntry } from '../../hooks/useFoodEntries';
import { useSpeechToText } from '../../hooks/useSpeechToText';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Save, Mic, MicOff } from 'lucide-react';
import { toast } from 'sonner';
import PortionConfidenceAdjuster from './PortionConfidenceAdjuster';
import SimilarFoodFallback from './SimilarFoodFallback';
import { estimateFoodFromImage, calculateNutritionForWeight } from '../../utils/localNutritionEstimator';
import type { FoodNutrition } from '../../utils/localFoodDataset';

interface EstimationConfirmationStepProps {
  capturedPhoto: File;
  onComplete: () => void;
  onCancel: () => void;
}

function getTodayDayNumber(): number {
  const now = new Date();
  return Math.floor(now.getTime() / (1000 * 60 * 60 * 24));
}

export default function EstimationConfirmationStep({
  capturedPhoto,
  onComplete,
  onCancel,
}: EstimationConfirmationStepProps) {
  const navigate = useNavigate();
  const addEntry = useAddFoodEntry();
  const { transcript, isListening, isSupported, error: speechError, startListening, stopListening, resetTranscript } = useSpeechToText();

  // Estimate food from image on mount
  const [estimation] = useState(() => estimateFoodFromImage(capturedPhoto));
  const [selectedFood, setSelectedFood] = useState<FoodNutrition>(estimation.food);
  const [weightInGrams, setWeightInGrams] = useState<string>('100');
  const [portionSize, setPortionSize] = useState(1.0);
  const [confidenceLevel, setConfidenceLevel] = useState(0.7);
  const [description, setDescription] = useState('');

  const showSimilarFoods = estimation.confidence < 0.6;

  // Update description field with transcript
  useEffect(() => {
    if (transcript) {
      setDescription(transcript);
    }
  }, [transcript]);

  // Calculate base nutrition from selected food and weight
  const baseNutrition = useMemo(() => {
    const weight = parseFloat(weightInGrams) || 100;
    return calculateNutritionForWeight(selectedFood, weight);
  }, [selectedFood, weightInGrams]);

  // Calculate adjusted nutrition with portion multiplier
  const adjustedNutrition = useMemo(() => {
    return {
      calories: baseNutrition.calories * portionSize,
      protein: baseNutrition.protein * portionSize,
      carbs: baseNutrition.carbs * portionSize,
      fat: baseNutrition.fat * portionSize,
      fiber: baseNutrition.fiber * portionSize,
      sodium: baseNutrition.sodium * portionSize,
      sugar: baseNutrition.sugar * portionSize,
    };
  }, [baseNutrition, portionSize]);

  const handleToggleDictation = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const weight = parseFloat(weightInGrams) || 100;

    try {
      await addEntry.mutateAsync({
        day: BigInt(getTodayDayNumber()),
        foodLabel: `${selectedFood.name} (${Math.round(weight)}g)`,
        description: description.trim(),
        calories: adjustedNutrition.calories,
        macros: {
          protein: adjustedNutrition.protein,
          carbs: adjustedNutrition.carbs,
          fat: adjustedNutrition.fat,
        },
        micronutrients: {
          fiber: adjustedNutrition.fiber,
          sodium: adjustedNutrition.sodium,
          sugar: adjustedNutrition.sugar,
        },
        portionSize,
        confidenceLevel,
      });

      toast.success('Food entry added successfully!');
      onComplete();
    } catch (error) {
      toast.error('Failed to add entry. Please try again.');
      console.error('Add entry error:', error);
    }
  };

  const photoUrl = useMemo(() => URL.createObjectURL(capturedPhoto), [capturedPhoto]);

  useEffect(() => {
    return () => {
      URL.revokeObjectURL(photoUrl);
      if (isListening) {
        stopListening();
      }
    };
  }, [photoUrl, isListening, stopListening]);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onCancel}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Confirm Food Details</h1>
          <p className="text-muted-foreground">Review and adjust the estimated nutrition</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Captured Photo</CardTitle>
          </CardHeader>
          <CardContent>
            <img
              src={photoUrl}
              alt="Captured food"
              className="w-full h-auto rounded-lg"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Food Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="foodLabel">Detected Food</Label>
                <Input
                  id="foodLabel"
                  value={selectedFood.name}
                  readOnly
                  className="bg-muted"
                />
                <p className="text-xs text-muted-foreground">
                  Confidence: {Math.round(estimation.confidence * 100)}%
                  {showSimilarFoods && ' (Low - please select a similar food below)'}
                </p>
              </div>

              {showSimilarFoods && (
                <SimilarFoodFallback
                  similarFoods={estimation.similarFoods}
                  selectedFood={selectedFood}
                  onSelectFood={setSelectedFood}
                />
              )}

              <div className="space-y-2">
                <Label htmlFor="weight">Weight (grams) - Optional</Label>
                <Input
                  id="weight"
                  type="number"
                  min="1"
                  step="1"
                  value={weightInGrams}
                  onChange={(e) => setWeightInGrams(e.target.value)}
                  placeholder="100"
                />
                <p className="text-xs text-muted-foreground">
                  {weightInGrams ? `Nutrition calculated for ${weightInGrams}g` : 'Defaults to 100g if not specified'}
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="description">Meal Description (Optional)</Label>
                  {isSupported && (
                    <Button
                      type="button"
                      variant={isListening ? 'destructive' : 'default'}
                      size="default"
                      onClick={handleToggleDictation}
                      className={isListening ? '' : 'bg-blue-600 hover:bg-blue-700 text-white'}
                    >
                      {isListening ? (
                        <>
                          <MicOff className="w-4 h-4 mr-2" />
                          Stop
                        </>
                      ) : (
                        <>
                          <Mic className="w-4 h-4 mr-2" />
                          Speak
                        </>
                      )}
                    </Button>
                  )}
                </div>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g., 100g oats cooked in milk for 5 minutes with dry fruits"
                  rows={3}
                  className={isListening ? 'border-destructive' : ''}
                />
                {isListening && (
                  <p className="text-xs text-destructive font-medium">
                    🎤 Listening... Speak now
                  </p>
                )}
                {speechError && (
                  <p className="text-xs text-destructive">
                    {speechError.message}
                  </p>
                )}
                {!isSupported && (
                  <p className="text-xs text-muted-foreground">
                    Voice input is not supported in your browser. You can type your description instead.
                  </p>
                )}
                <p className="text-xs text-muted-foreground">
                  Describe your meal preparation, ingredients, or cooking method
                </p>
              </div>

              <div className="pt-4 border-t">
                <h3 className="font-semibold mb-3">Estimated Nutrition (Base)</h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-muted-foreground">Calories:</span>
                    <span className="ml-2 font-medium">{Math.round(baseNutrition.calories)} kcal</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Protein:</span>
                    <span className="ml-2 font-medium">{Math.round(baseNutrition.protein)}g</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Carbs:</span>
                    <span className="ml-2 font-medium">{Math.round(baseNutrition.carbs)}g</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Fat:</span>
                    <span className="ml-2 font-medium">{Math.round(baseNutrition.fat)}g</span>
                  </div>
                </div>
              </div>

              <PortionConfidenceAdjuster
                portionSize={portionSize}
                confidenceLevel={confidenceLevel}
                onPortionChange={setPortionSize}
                onConfidenceChange={setConfidenceLevel}
              />

              <div className="pt-4 border-t">
                <h3 className="font-semibold mb-3">Final Adjusted Nutrition</h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-muted-foreground">Calories:</span>
                    <span className="ml-2 font-medium">{Math.round(adjustedNutrition.calories)} kcal</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Protein:</span>
                    <span className="ml-2 font-medium">{Math.round(adjustedNutrition.protein)}g</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Carbs:</span>
                    <span className="ml-2 font-medium">{Math.round(adjustedNutrition.carbs)}g</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Fat:</span>
                    <span className="ml-2 font-medium">{Math.round(adjustedNutrition.fat)}g</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Fiber:</span>
                    <span className="ml-2 font-medium">{Math.round(adjustedNutrition.fiber)}g</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Sodium:</span>
                    <span className="ml-2 font-medium">{Math.round(adjustedNutrition.sodium)}mg</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
                  Cancel
                </Button>
                <Button type="submit" disabled={addEntry.isPending} className="flex-1">
                  <Save className="w-4 h-4 mr-2" />
                  {addEntry.isPending ? 'Saving...' : 'Save Entry'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
