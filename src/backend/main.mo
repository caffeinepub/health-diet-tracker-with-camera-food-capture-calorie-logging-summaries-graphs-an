import Array "mo:core/Array";
import Map "mo:core/Map";
import Iter "mo:core/Iter";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import Float "mo:core/Float";
import Nat "mo:core/Nat";
import Int "mo:core/Int";
import Order "mo:core/Order";

import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";



actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  public type UserProfile = {
    name : Text;
    heightCm : ?Float;
    age : ?Nat;
    sex : ?Sex;
    activityLevel : ?ActivityLevel;
    bodyGoal : ?BodyGoalDetails;
  };

  public type Sex = { #male; #female };

  public type ActivityLevel = {
    #sedentary;
    #lightlyActive;
    #moderatelyActive;
    #veryActive;
    #extraActive;
  };

  public type BodyGoalDetails = {
    goalType : GoalType;
    currentWeight : Float;
    targetWeight : Float;
    weeklyGoalSpeed : Float;
  };

  public type GoalType = {
    #loseWeight;
    #gainWeight;
    #gainMuscle;
    #maintain;
  };

  public type HealthMetrics = {
    bmi : Float;
    bmiCategory : Text;
    bmr : Float;
    tdee : Float;
  };

  type FoodEntry = {
    id : Nat;
    owner : Principal;
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
  };

  type QuestionSuggestion = {
    question : Text;
    answer : Text;
    citations : [Text];
    relatedQuestions : [Text];
  };

  type WeeklyFeedback = {
    feedbackType : FeedbackType;
    entriesChecked : Nat;
    avgCalories : Float;
    totalProtein : Float;
    totalCarbs : Float;
    totalFat : Float;
    entriesPerDay : Float;
  };

  type FeedbackType = {
    #overrange;
    #underrange;
    #offBalance;
    #goodJob;
    #partialFocus;
    #notEnoughData;
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

  public query ({ caller }) func getCallerHealthMetrics() : async HealthMetrics {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view health metrics");
    };
    getHealthMetricsFromCallerProfile(caller);
  };

  func getHealthMetricsFromCallerProfile(caller : Principal) : HealthMetrics {
    switch (userProfiles.get(caller)) {
      case (null) { Runtime.trap("User profile not found") };
      case (?profile) {
        let heightCm = switch (profile.heightCm) {
          case (null) { Runtime.trap("Missing height") };
          case (?h) { h };
        };
        let weightKg = switch (profile.bodyGoal) {
          case (null) { Runtime.trap("Missing weight") };
          case (?goal) { goal.currentWeight };
        };
        let heightSquared = heightCm * heightCm;
        let heightSquaredMeters = if (heightSquared > 10000.0) {
          heightSquared * 0.0001;
        } else { 1.0 };

        // Use named helper for BMR
        let bmr = calculateBMR(profile, weightKg, heightCm);

        {
          bmi = weightKg / heightSquaredMeters;
          bmiCategory = classifyBMI(weightKg / heightSquaredMeters);
          bmr;
          tdee = calculateTDEE(// Calculate BMR via helper
            calculateBMR(profile, weightKg, heightCm),
            switch (profile.activityLevel) {
              case (null) { #moderatelyActive };
              case (?level) { level };
            },
          );
        };
      };
    };
  };

  func classifyBMI(bmi : Float) : Text {
    if (bmi < 18.5) {
      "Underweight";
    } else if (bmi < 25.0) {
      "Normal";
    } else if (bmi < 30.0) {
      "Overweight";
    } else { "Obese" };
  };

  func calculateBMR(profile : UserProfile, weightKg : Float, heightCm : Float) : Float {
    switch (profile.sex, profile.age) {
      case (?sex, ?age) { bmrBySex(weightKg, heightCm, age.toInt().toFloat(), sex) };
      case (null, ?age) { bmrBySex(weightKg, heightCm, age.toInt().toFloat(), #male) };
      case (?sex, null) { bmrBySex(weightKg, heightCm, 35, sex) };
      case (null, null) { bmrBySex(weightKg, heightCm, 35, #male) };
    };
  };

  func bmrBySex(weightKg : Float, heightCm : Float, age : Float, sex : Sex) : Float {
    let standardBMR = 10.0 * weightKg + 6.25 * heightCm - 5.0 * age;
    switch (sex) {
      case (#male) { standardBMR + 5.0 };
      case (#female) { standardBMR - 161.0 };
    };
  };

  func calculateTDEE(bmr : Float, activity : ActivityLevel) : Float {
    switch (activity) {
      case (#sedentary) { bmr * 1.2 };
      case (#lightlyActive) { bmr * 1.375 };
      case (#moderatelyActive) { bmr * 1.55 };
      case (#veryActive) { bmr * 1.725 };
      case (#extraActive) { bmr * 1.9 };
    };
  };

  public shared ({ caller }) func updateBodyGoal(details : BodyGoalDetails) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update body goals");
    };

    switch (userProfiles.get(caller)) {
      case (null) { Runtime.trap("User profile not found") };
      case (?profile) {
        let updatedProfile : UserProfile = {
          profile with bodyGoal = ?details;
        };
        userProfiles.add(caller, updatedProfile);
      };
    };
  };

  public shared ({ caller }) func addFoodEntry(
    day : Int,
    foodLabel : Text,
    description : Text,
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
      description;
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

  public query ({ caller }) func getWeeklyFeedback() : async WeeklyFeedback {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can get feedback");
    };

    switch (userProfiles.get(caller)) {
      case (null) {
        buildDefaultFeedback(
          0,
          0.0,
          0.0,
          0.0,
          0.0,
        );
      };
      case (?profile) {
        switch (profile.bodyGoal) {
          case (null) {
            buildDefaultFeedback(
              0,
              0.0,
              0.0,
              0.0,
              0.0,
            );
          };
          case (?goal) {
            let entries = foodEntries.values().toArray();
            let daysRange = [(0 : Int), 1, 2, 3, 4, 5, 6];
            var totalCalories : Float = 0.0;
            var totalProtein : Float = 0.0;
            var totalCarbs : Float = 0.0;
            var totalFat : Float = 0.0;
            var entriesChecked : Nat = 0;
            var nonEmptyDays : Nat = 0;

            for (day in daysRange.values()) {
              let dailyEntries = entries.filter(
                func(e) {
                  e.owner == caller and e.day == day
                }
              );
              let dailyCount = dailyEntries.size();

              if (dailyCount > 0) {
                nonEmptyDays += 1;
              };

              totalCalories += dailyEntries.foldLeft(
                0.0,
                func(acc, e) { acc + e.calories },
              );

              totalProtein += dailyEntries.foldLeft(
                0.0,
                func(acc, e) { acc + e.macros.protein },
              );

              totalCarbs += dailyEntries.foldLeft(
                0.0,
                func(acc, e) { acc + e.macros.carbs },
              );

              totalFat += dailyEntries.foldLeft(
                0.0,
                func(acc, e) { acc + e.macros.fat },
              );

              entriesChecked += dailyCount;
            };

            let avgCalories = if (nonEmptyDays > 0) {
              totalCalories / nonEmptyDays.toFloat();
            } else { 0.0 };

            let avgEntriesPerDay = if (nonEmptyDays > 0) {
              entriesChecked.toFloat() / nonEmptyDays.toFloat();
            } else { 0.0 };

            determineFeedbackType(
              entriesChecked,
              avgCalories,
              totalProtein,
              totalCarbs,
              totalFat,
              avgEntriesPerDay,
            );
          };
        };
      };
    };
  };

  func buildDefaultFeedback(
    entriesChecked : Nat,
    avgCalories : Float,
    totalProtein : Float,
    totalCarbs : Float,
    totalFat : Float,
  ) : WeeklyFeedback {
    {
      feedbackType = #notEnoughData;
      entriesChecked;
      avgCalories;
      totalProtein;
      totalCarbs;
      totalFat;
      entriesPerDay = 0.0;
    };
  };

  func determineFeedbackType(
    entriesChecked : Nat,
    avgCalories : Float,
    totalProtein : Float,
    totalCarbs : Float,
    totalFat : Float,
    entriesPerDay : Float,
  ) : WeeklyFeedback {
    let feedbackType : FeedbackType =
      if (entriesChecked < 6) { #notEnoughData } else if (avgCalories > 1600.0 and avgCalories < 2400.0) {
        #goodJob;
      } else if (avgCalories > 1300.0 and avgCalories <= 1600.0) { #partialFocus } else if (
        avgCalories > 2500.0
      ) { #overrange } else if (avgCalories < 1300.0) { #underrange } else if (
        totalCarbs > totalFat and totalCarbs > 220.0
      ) { #offBalance } else { #notEnoughData };

    {
      feedbackType;
      entriesChecked;
      avgCalories;
      totalProtein;
      totalCarbs;
      totalFat;
      entriesPerDay;
    };
  };
};
