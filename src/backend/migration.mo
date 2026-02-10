import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Principal "mo:core/Principal";

module {
  // Old FoodEntry without description field
  type OldFoodEntry = {
    id : Nat;
    owner : Principal.Principal;
    day : Int;
    foodLabel : Text;
    calories : Float;
    macros : {
      protein : Float;
      carbs : Float;
      fat : Float;
    };
    micronutrients : {
      fiber : Float;
      sodium : Float;
      sugar : Float;
    };
    portionSize : Float;
    confidenceLevel : Float;
  };

  // Old Actor State
  type OldActor = {
    userProfiles : Map.Map<Principal.Principal, {
      name : Text;
      bodyGoal : ?{
        goalType : {
          #loseWeight;
          #gainWeight;
          #gainMuscle;
          #maintain;
        };
        currentWeight : Float;
        targetWeight : Float;
        weeklyGoalSpeed : Float;
      };
    }>;
    nextEntryId : Nat;
    foodEntries : Map.Map<Nat, OldFoodEntry>;
  };

  // New Actor State (from main.mo)
  type NewActor = {
    userProfiles : Map.Map<Principal.Principal, {
      name : Text;
      bodyGoal : ?{
        goalType : {
          #loseWeight;
          #gainWeight;
          #gainMuscle;
          #maintain;
        };
        currentWeight : Float;
        targetWeight : Float;
        weeklyGoalSpeed : Float;
      };
    }>;
    nextEntryId : Nat;
    foodEntries : Map.Map<Nat, {
      id : Nat;
      owner : Principal.Principal;
      day : Int;
      foodLabel : Text;
      description : Text;
      calories : Float;
      macros : {
        protein : Float;
        carbs : Float;
        fat : Float;
      };
      micronutrients : {
        fiber : Float;
        sodium : Float;
        sugar : Float;
      };
      portionSize : Float;
      confidenceLevel : Float;
    }>;
  };

  public func run(old : OldActor) : NewActor {
    let newFoodEntries = old.foodEntries.map<Nat, OldFoodEntry, { id : Nat; owner : Principal.Principal; day : Int; foodLabel : Text; description : Text; calories : Float; macros : { protein : Float; carbs : Float; fat : Float }; micronutrients : { fiber : Float; sodium : Float; sugar : Float }; portionSize : Float; confidenceLevel : Float }>(
      func(_id, oldEntry) {
        { oldEntry with description = "" };
      }
    );
    {
      old with
      foodEntries = newFoodEntries;
    };
  };
};
