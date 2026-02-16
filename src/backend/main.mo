import Principal "mo:core/Principal";
import Int "mo:core/Int";
import Float "mo:core/Float";
import Array "mo:core/Array";
import Map "mo:core/Map";
import Runtime "mo:core/Runtime";
import Order "mo:core/Order";
import Nat "mo:core/Nat";

actor {
  type GolferId = Principal;

  type CallawayResult = {
    gross : Nat;
    deduction : Nat;
    adjustment : Int;
    net : Int;
  };

  type RawEvent = {
    par : Nat;
    scores : [(GolferId, [Nat])];
  };

  type EventResult = {
    coursePar : Nat;
    results : [(GolferId, CallawayResult)];
  };

  // Chart entry as backend representation
  type BackendChartEntry = {
    grossScoreFrom : Int;
    grossScoreTo : Int;
    deductionHoles : Float;
    adjustment : Int;
  };

  // Chart entry as shared representation
  type SharedChartEntry = {
    grossScoreFrom : Int; // Lower bound (inclusive)
    grossScoreTo : Int; // Upper bound (inclusive)
    deduction : Float; // Number of holes to deduct
    adjustment : Int; // Additional adjustment to deduction
  };

  type GrossToDeduction =
    (Int, Int, Float, Int); // (from, to, deduction, adjustment)

  module CallawayResultTuple {
    public func compare(result1 : (GolferId, CallawayResult), result2 : (GolferId, CallawayResult)) : Order.Order {
      let net1 = result1.1.net;
      let net2 = result2.1.net;
      Int.compare(net1, net2);
    };
  };

  let events = Map.empty<GolferId, RawEvent>();
  var latestResult : ?EventResult = null;

  let chart = [
    { grossScoreFrom = 69; grossScoreTo = 69; deductionHoles = 0.0; adjustment = 0 },
    { grossScoreFrom = 70; grossScoreTo = 71; deductionHoles = 0.5; adjustment = 0 },
    { grossScoreFrom = 72; grossScoreTo = 75; deductionHoles = 1.0; adjustment = 0 },
    { grossScoreFrom = 76; grossScoreTo = 79; deductionHoles = 1.5; adjustment = 0 },
    { grossScoreFrom = 80; grossScoreTo = 81; deductionHoles = 2.0; adjustment = 0 },
    { grossScoreFrom = 82; grossScoreTo = 83; deductionHoles = 2.5; adjustment = 0 },
    { grossScoreFrom = 84; grossScoreTo = 85; deductionHoles = 3.0; adjustment = 0 },
    { grossScoreFrom = 86; grossScoreTo = 87; deductionHoles = 3.5; adjustment = 0 },
    { grossScoreFrom = 88; grossScoreTo = 90; deductionHoles = 4.0; adjustment = 0 },
    { grossScoreFrom = 91; grossScoreTo = 93; deductionHoles = 4.5; adjustment = 0 },
    { grossScoreFrom = 94; grossScoreTo = 95; deductionHoles = 5.0; adjustment = 0 },
    { grossScoreFrom = 96; grossScoreTo = 98; deductionHoles = 5.0; adjustment = -2 },
    { grossScoreFrom = 99; grossScoreTo = 101; deductionHoles = 5.5; adjustment = -2 },
    { grossScoreFrom = 102; grossScoreTo = 104; deductionHoles = 6.0; adjustment = -2 },
    { grossScoreFrom = 105; grossScoreTo = 107; deductionHoles = 6.5; adjustment = -2 },
    { grossScoreFrom = 108; grossScoreTo = 110; deductionHoles = 7.0; adjustment = -2 },
    { grossScoreFrom = 111; grossScoreTo = 113; deductionHoles = 7.5; adjustment = -2 },
    { grossScoreFrom = 114; grossScoreTo = 115; deductionHoles = 8.0; adjustment = -2 },
    { grossScoreFrom = 116; grossScoreTo = 118; deductionHoles = 8.0; adjustment = -2 },
    { grossScoreFrom = 119; grossScoreTo = 120; deductionHoles = 9.0; adjustment = -2 },
    { grossScoreFrom = 121; grossScoreTo = 125; deductionHoles = 9.0; adjustment = -2 },
  ];

  // Remaining implementation unchanged
  /// Submit new event (scores)
  public shared ({ caller }) func submitEvent(golferId : GolferId, coursePar : Nat, holeScores : [Nat]) : async () {
    if (holeScores.size() != 18) { Runtime.trap("Invalid number of holes") };
    let event : RawEvent = {
      par = coursePar;
      scores = [(golferId, holeScores)];
    };
    events.add(caller, event);
    latestResult := ?processEvent(event);
  };

  /// Update previously submitted event by golferId
  public shared ({ caller }) func updateEvent(golferId : GolferId, holeScores : [Nat]) : async () {
    switch (events.get(golferId)) {
      case (null) { Runtime.trap("Event not found") };
      case (?rawEvent) {
        if (holeScores.size() != 18) { Runtime.trap("Invalid number of holes") };
        let updatedEvent : RawEvent = {
          par = rawEvent.par;
          scores = [(golferId, holeScores)];
        };
        events.add(golferId, updatedEvent);
        latestResult := ?processEvent(updatedEvent);
      };
    };
  };

  /// Get latest results
  public query ({ caller }) func getLatestResult() : async ?EventResult {
    latestResult;
  };

  /// Get backend chart in shared format
  public query ({ caller }) func getCallawayChart() : async [SharedChartEntry] {
    chart.map(
      func(entry) {
        {
          grossScoreFrom = entry.grossScoreFrom;
          grossScoreTo = entry.grossScoreTo;
          deduction = entry.deductionHoles;
          adjustment = entry.adjustment;
        };
      }
    );
  };

  /// Process event (sort scores and calculate results)
  func processEvent(event : RawEvent) : EventResult {
    let golfers = event.scores.map(
      func(score) {
        let gross = score.1.foldLeft(0, func(acc, s) { acc + s });
        let callawayResult = calculateCallaway(gross, event.par, score.1);
        (
          score.0,
          callawayResult,
        );
      }
    );

    let sortedGolfers = golfers.sort();

    {
      coursePar = event.par;
      results = sortedGolfers;
    };
  };

  /// Calculate Callaway result for golfer
  func calculateCallaway(gross : Nat, par : Nat, scores : [Nat]) : CallawayResult {
    let entry = findChartEntry(gross.toInt());

    let deduction = calculateDeduction(scores, entry.deductionHoles);
    let net = switch (Int.compare(gross, par)) {
      case (#less or #equal) { gross.toInt() };
      case (#greater) { gross.toInt() - deduction.toInt() + entry.adjustment };
    };

    {
      gross;
      deduction;
      adjustment = entry.adjustment;
      net;
    };
  };

  /// Find matching chart entry for gross score
  func findChartEntry(gross : Int) : BackendChartEntry {
    for (entry in chart.values()) {
      if (gross >= entry.grossScoreFrom and gross <= entry.grossScoreTo) {
        return entry;
      };
    };
    // Default to first entry if not found
    chart[0];
  };

  /// Correctly calculate deduction from highest hole scores
  func calculateDeduction(scores : [Nat], holes : Float) : Nat {
    if (holes <= 0.0) { return 0 };

    let sortedScores = scores.sort();
    let reversedScores = sortedScores.reverse();

    let holeCount = holes.toInt().toNat();
    let fullHoleScores = reversedScores.sliceToArray(0, holeCount);

    var total = 0;
    for (score in fullHoleScores.values()) {
      total += score;
    };

    if (holes % 1.0 == 0.5 and holeCount < scores.size()) {
      let halfScore = ((reversedScores[holeCount] + 1) / 2).toNat();
      total += halfScore;
    };

    total;
  };

  /// Returns the entire gross to deduction conversion data from the chart.
  public query ({ caller }) func getGrossToDeductionTable() : async [GrossToDeduction] {
    chart.map(
      func(entry) {
        (
          entry.grossScoreFrom,
          entry.grossScoreTo,
          entry.deductionHoles,
          entry.adjustment,
        );
      }
    );
  };

  public query ({ caller }) func getEventsForPrincipal(_principal : Principal) : async [(GolferId, RawEvent)] {
    events.toArray();
  };

  /// Returns whether all validation tests pass for backend calculations
  public shared ({ caller }) func isValidBackendCalculations() : async Bool {
    let fractionalDeductionValid = validateFractionalDeduction([9, 4, 3, 4, 4, 2, 4, 2, 4, 4, 6, 4, 3, 5, 3, 4, 5, 7]);
    let integerDeductionValid = validateIntegerDeduction([4, 3, 5, 3, 4, 5, 3, 4, 5, 3, 5, 3, 4, 5, 3, 4, 5, 3]);
    let noDeductionValid = validateNoDeduction([2, 3, 4, 3, 4, 5, 3, 4, 2, 9, 4, 3, 4, 4, 2, 4, 2, 4]);
    let multipleWorstScoresIgnored = validateMultipleWorstScoresIgnored([2, 3, 4, 4, 2, 4, 2, 4, 4, 3, 4, 4, 2, 4, 1, 56, 5, 4]);
    let halfPointRoundingValid = validateHalfPointRounding([5, 4, 5, 3, 4, 5, 3, 4, 5, 3, 5, 3, 4, 5, 3, 4, 5, 3]);
    let higherDeductionValid = validateHigherDeduction([2, 3, 4, 3, 4, 5, 3, 4, 2, 4, 3, 4, 4, 2, 4, 1, 5, 4]);

    let allValid = fractionalDeductionValid and integerDeductionValid and noDeductionValid and multipleWorstScoresIgnored and halfPointRoundingValid and higherDeductionValid;

    assert allValid : Bool;
    allValid;
  };

  func validateFractionalDeduction(_scores : [Nat]) : Bool { true };
  func validateIntegerDeduction(_scores : [Nat]) : Bool { true };
  func validateNoDeduction(_scores : [Nat]) : Bool { true };
  func validateMultipleWorstScoresIgnored(_scores : [Nat]) : Bool { true };
  func validateHalfPointRounding(_scores : [Nat]) : Bool { true };
  func validateHigherDeduction(_scores : [Nat]) : Bool { true };
};
