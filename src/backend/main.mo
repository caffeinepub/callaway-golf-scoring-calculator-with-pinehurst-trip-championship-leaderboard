import Principal "mo:core/Principal";
import Int "mo:core/Int";
import Float "mo:core/Float";
import Array "mo:core/Array";
import Map "mo:core/Map";
import List "mo:core/List";
import Runtime "mo:core/Runtime";
import Iter "mo:core/Iter";
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
    lowerBound : Int;
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
    let chart = getBackendChart();
    chart.map(
      func(entry) {
        {
          grossScoreFrom = entry.lowerBound;
          grossScoreTo = Int.max(entry.lowerBound, entry.lowerBound + 4);
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
    let chart = getBackendChart();
    let entry = findChartEntry(gross.toInt(), chart);

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

  func getBackendChart() : [BackendChartEntry] {
    [
      { lowerBound = 69; deductionHoles = 0.0; adjustment = 0 },
      { lowerBound = 70; deductionHoles = 0.5; adjustment = 0 },
      { lowerBound = 71; deductionHoles = 0.5; adjustment = 0 },
      { lowerBound = 72; deductionHoles = 1.0; adjustment = 0 },
      { lowerBound = 73; deductionHoles = 1.0; adjustment = 0 },
      { lowerBound = 74; deductionHoles = 1.0; adjustment = 0 },
      { lowerBound = 75; deductionHoles = 1.0; adjustment = 0 },
      { lowerBound = 76; deductionHoles = 1.5; adjustment = 0 },
      { lowerBound = 77; deductionHoles = 1.5; adjustment = 0 },
      { lowerBound = 78; deductionHoles = 2.0; adjustment = 0 },
      { lowerBound = 79; deductionHoles = 2.0; adjustment = 0 },
      { lowerBound = 80; deductionHoles = 2.0; adjustment = 0 },
      { lowerBound = 81; deductionHoles = 2.0; adjustment = 0 },
      { lowerBound = 82; deductionHoles = 2.5; adjustment = 0 },
      { lowerBound = 83; deductionHoles = 2.5; adjustment = 0 },
      { lowerBound = 84; deductionHoles = 3.0; adjustment = 0 },
      { lowerBound = 85; deductionHoles = 3.0; adjustment = 0 },
      { lowerBound = 86; deductionHoles = 3.0; adjustment = 0 },
      { lowerBound = 87; deductionHoles = 3.0; adjustment = 0 },
      { lowerBound = 88; deductionHoles = 3.5; adjustment = 0 },
      { lowerBound = 89; deductionHoles = 3.5; adjustment = 0 },
      { lowerBound = 90; deductionHoles = 4.0; adjustment = 0 },
      { lowerBound = 91; deductionHoles = 4.0; adjustment = 0 },
      { lowerBound = 92; deductionHoles = 4.0; adjustment = 0 },
      { lowerBound = 93; deductionHoles = 4.0; adjustment = 0 },
      { lowerBound = 94; deductionHoles = 4.5; adjustment = 0 },
      { lowerBound = 95; deductionHoles = 4.5; adjustment = 0 },
      { lowerBound = 96; deductionHoles = 5.0; adjustment = 0 },
      { lowerBound = 97; deductionHoles = 5.0; adjustment = -2 },
      { lowerBound = 98; deductionHoles = 5.0; adjustment = -2 },
      { lowerBound = 99; deductionHoles = 5.0; adjustment = -2 },
      { lowerBound = 100; deductionHoles = 5.0; adjustment = -2 },
      { lowerBound = 101; deductionHoles = 5.5; adjustment = -2 },
      { lowerBound = 102; deductionHoles = 5.5; adjustment = -2 },
      { lowerBound = 103; deductionHoles = 6.0; adjustment = -2 },
      { lowerBound = 104; deductionHoles = 6.0; adjustment = -2 },
      { lowerBound = 105; deductionHoles = 6.0; adjustment = -2 },
      { lowerBound = 106; deductionHoles = 6.0; adjustment = -2 },
      { lowerBound = 107; deductionHoles = 6.5; adjustment = -2 },
      { lowerBound = 108; deductionHoles = 6.5; adjustment = -2 },
      { lowerBound = 109; deductionHoles = 7.0; adjustment = -2 },
      { lowerBound = 110; deductionHoles = 7.0; adjustment = -2 },
      { lowerBound = 111; deductionHoles = 7.0; adjustment = -2 },
      { lowerBound = 112; deductionHoles = 7.0; adjustment = -2 },
      { lowerBound = 113; deductionHoles = 7.5; adjustment = -2 },
      { lowerBound = 114; deductionHoles = 7.5; adjustment = -2 },
      { lowerBound = 115; deductionHoles = 8.0; adjustment = -2 },
      { lowerBound = 116; deductionHoles = 8.0; adjustment = -2 },
      { lowerBound = 117; deductionHoles = 8.0; adjustment = -2 },
      { lowerBound = 118; deductionHoles = 8.0; adjustment = -2 },
      { lowerBound = 119; deductionHoles = 9.0; adjustment = -2 },
      { lowerBound = 120; deductionHoles = 9.0; adjustment = -2 },
      { lowerBound = 121; deductionHoles = 9.0; adjustment = -2 },
      { lowerBound = 122; deductionHoles = 9.0; adjustment = -2 },
      { lowerBound = 123; deductionHoles = 9.0; adjustment = -2 },
      { lowerBound = 124; deductionHoles = 9.0; adjustment = -2 },
      { lowerBound = 125; deductionHoles = 9.0; adjustment = -2 },
    ];
  };

  /// Find matching chart entry for gross score
  func findChartEntry(gross : Int, chart : [BackendChartEntry]) : BackendChartEntry {
    var entry = chart[0];
    for (c in chart.values()) {
      if (gross >= c.lowerBound) {
        entry := c;
      };
    };
    entry;
  };

  /// Calculate holes to deduct based on chart entry and gross scores (sorted)
  func calculateDeduction(scores : [Nat], holes : Float) : Nat {
    // If less than 1 hole, no deduction
    if (holes < 1.0) { return 0 };

    // If 1 or more holes, sort scores and take that many from the top(scores are ascending byte index 0 is lowest)
    let sortedScores = scores.sort();
    let worstScores = sortedScores.sliceToArray(0, holes.toInt().toNat());

    var total : Nat = 0;
    for (score in worstScores.values()) {
      total += score;
    };

    // If there is a half hole, add 50% of the next score rounded up to nearest whole number
    if (holes % 1.0 == 0.5) {
      let nextScore = scores.sliceToArray(holes.toInt().toNat(), scores.size());
      if (nextScore.size() > 0) {
        total += ((nextScore[0] + 1) / 2).toNat();
      };
    };

    total;
  };

  /// Returns the entire gross to deduction conversion data.
  public query ({ caller }) func getGrossToDeductionTable() : async [GrossToDeduction] {
    [
      (69, 70, 0.0, 0),
      (71, 75, 1.0, 0),
      (76, 80, 2.0, 0),
      (81, 85, 3.0, 0),
      (86, 90, 4.0, 0),
      (91, 95, 5.0, 0),
      (96, 100, 6.0, -2),
      (101, 105, 7.0, -2),
      (106, 115, 8.0, -2),
      (116, 125, 9.0, -2),
    ];
  };

  public query ({ caller }) func getEventsForPrincipal(_principal : Principal) : async [(GolferId, RawEvent)] {
    events.toArray();
  };
};
