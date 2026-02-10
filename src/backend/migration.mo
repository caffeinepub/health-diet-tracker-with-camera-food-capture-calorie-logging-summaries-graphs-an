import Map "mo:core/Map";
import Float "mo:core/Float";
import Nat "mo:core/Nat";
import Principal "mo:core/Principal";

module {
  public type OldActor = {
    userProfiles : Map.Map<Principal, OldUserProfile>;
  };

  type OldUserProfile = {
    name : Text;
    bodyGoal : ?OldBodyGoalDetails;
  };

  type OldBodyGoalDetails = {
    goalType : OldGoalType;
    currentWeight : Float;
    targetWeight : Float;
    weeklyGoalSpeed : Float;
  };

  type OldGoalType = {
    #loseWeight;
    #gainWeight;
    #gainMuscle;
    #maintain;
  };

  public type NewActor = {
    userProfiles : Map.Map<Principal, NewUserProfile>;
  };

  type NewUserProfile = {
    name : Text;
    heightCm : ?Float;
    age : ?Nat;
    sex : ?NewSex;
    activityLevel : ?NewActivityLevel;
    bodyGoal : ?NewBodyGoalDetails;
  };

  type NewSex = { #male; #female };
  type NewActivityLevel = {
    #sedentary;
    #lightlyActive;
    #moderatelyActive;
    #veryActive;
    #extraActive;
  };

  type NewBodyGoalDetails = {
    goalType : NewGoalType;
    currentWeight : Float;
    targetWeight : Float;
    weeklyGoalSpeed : Float;
  };

  type NewGoalType = {
    #loseWeight;
    #gainWeight;
    #gainMuscle;
    #maintain;
  };

  public func run(old : OldActor) : NewActor {
    let newUserProfiles = old.userProfiles.map<Principal, OldUserProfile, NewUserProfile>(
      func(_principal, oldProfile) { convertUserProfile(oldProfile) }
    );
    { userProfiles = newUserProfiles };
  };

  func convertUserProfile(old : OldUserProfile) : NewUserProfile {
    {
      name = old.name;
      heightCm = null;
      age = null;
      sex = null;
      activityLevel = null;
      bodyGoal = convertBodyGoalDetails(old.bodyGoal);
    };
  };

  func convertBodyGoalDetails(old : ?OldBodyGoalDetails) : ?NewBodyGoalDetails {
    switch (old) {
      case (null) { null };
      case (?oldDetails) {
        ?{
          goalType = convertGoalType(oldDetails.goalType);
          currentWeight = oldDetails.currentWeight;
          targetWeight = oldDetails.targetWeight;
          weeklyGoalSpeed = oldDetails.weeklyGoalSpeed;
        };
      };
    };
  };

  func convertGoalType(old : OldGoalType) : NewGoalType {
    switch (old) {
      case (#loseWeight) { #loseWeight };
      case (#gainWeight) { #gainWeight };
      case (#gainMuscle) { #gainMuscle };
      case (#maintain) { #maintain };
    };
  };
};
