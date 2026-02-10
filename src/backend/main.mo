import Array "mo:core/Array";
import Map "mo:core/Map";
import Iter "mo:core/Iter";
import Time "mo:core/Time";
import Text "mo:core/Text";
import Int "mo:core/Int";
import Nat "mo:core/Nat";
import Order "mo:core/Order";
import Float "mo:core/Float";
import Runtime "mo:core/Runtime";

import Principal "mo:core/Principal";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  public type UserProfile = {
    name : Text;
  };

  type FoodEntry = {
    id : Nat;
    owner : Principal;
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

  type QuestionSuggestion = {
    question : Text;
    answer : Text;
    citations : [Text];
    relatedQuestions : [Text];
  };

  module FoodEntry {
    public func compare(entry1 : FoodEntry, entry2 : FoodEntry) : Order.Order {
      Nat.compare(entry1.id, entry2.id);
    };
  };

  let userProfiles = Map.empty<Principal, UserProfile>();
  var nextEntryId = 0;
  let foodEntries = Map.empty<Nat, FoodEntry>();

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  public shared ({ caller }) func addFoodEntry(
    day : Int,
    foodLabel : Text,
    calories : Float,
    macros : { protein : Float; carbs : Float; fat : Float },
    micronutrients : { fiber : Float; sodium : Float; sugar : Float },
    portionSize : Float,
    confidenceLevel : Float
  ) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add food entries");
    };

    let entryId = nextEntryId;
    let entry : FoodEntry = {
      id = entryId;
      owner = caller;
      day;
      foodLabel;
      calories;
      macros;
      micronutrients;
      portionSize;
      confidenceLevel;
    };

    foodEntries.add(entryId, entry);
    nextEntryId += 1;
    entryId;
  };

  public query ({ caller }) func getFoodEntriesForCaller(startDay : Int, endDay : Int) : async [FoodEntry] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view food entries");
    };

    let entries = foodEntries.values().toArray();
    entries.filter(
      func(entry) {
        entry.owner == caller and entry.day >= startDay and entry.day <= endDay
      }
    );
  };

  let suggestedQuestions = [
    {
      question = "How do I estimate calories for homemade meals?";
      answer = "Estimate by breaking down the ingredients individually and using portion sizes. Apps and kitchen scales can help.";
      citations = ["USDA Food Database", "Harvard T.H. Chan School of Public Health"];
      relatedQuestions = ["What kitchen tools help with calorie counting?"];
    },
    {
      question = "What's a typical protein portion size?";
      answer = "A portion is about the size and thickness of your palm, roughly 3-5 ounces or 20-30g protein.";
      citations = ["USDA Guidelines", "Mayo Clinic"];
      relatedQuestions = [
        "How much protein should I eat per meal?",
        "What are healthy protein sources?"
      ];
    },
    {
      question = "How do I adjust portions?";
      answer = "Consider these when adjusting portions: typical serving size, cook method, packaging info, and visual comparisons. Use your best judgment - mark lower confidence if unsure.";
      citations = ["Dietitian's Association of Australia", "Precision Nutrition"];
      relatedQuestions = [
        "Should I always weigh my food?",
        "How precise do macro estimates need to be?"
      ];
    },
  ];

  public query ({ caller }) func getSuggestedQuestions() : async [QuestionSuggestion] {
    suggestedQuestions;
  };

  public query ({ caller }) func getPortionAdjusterGuidance() : async Text {
    "Consider these when adjusting portions: typical serving size, cook method, packaging info, and visual comparisons. Use your best judgment - mark lower confidence if unsure.";
  };
};
