import Principal "mo:core/Principal";
import Int "mo:core/Int";
import Array "mo:core/Array";
import Map "mo:core/Map";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";



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

  let events = Map.empty<GolferId, RawEvent>();
  var latestResult : ?EventResult = null;

  module CallawayResultTuple {
    public func compare(result1 : (GolferId, CallawayResult), result2 : (GolferId, CallawayResult)) : Order.Order {
      let net1 = result1.1.net;
      let net2 = result2.1.net;
      Int.compare(net1, net2);
    };
  };

  type ChartEntry = {
    lowerBound : Int;
    deductionHoles : Nat;
    deductionFraction : Nat;
    adjustment : Int;
  };

  public shared ({ caller }) func submitEvent(golferId : GolferId, coursePar : Nat, holeScores : [Nat]) : async () {
    if (holeScores.size() != 18) { Runtime.trap("Invalid number of holes") };
    let event : RawEvent = {
      par = coursePar;
      scores = [(golferId, holeScores)];
    };
    events.add(caller, event);
    latestResult := ?processEvent(event);
  };

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

  public query ({ caller }) func getLatestResult() : async ?EventResult {
    latestResult;
  };

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

  func calculateCallaway(gross : Nat, par : Nat, scores : [Nat]) : CallawayResult {
    let chart = getCallawayChart();
    let entry = findChartEntry(gross.toInt(), chart);

    let deduction = calculateDeduction(scores, entry.deductionHoles, entry.deductionFraction.toInt());
    let net = gross.toInt() - deduction.toInt() + entry.adjustment;

    {
      gross;
      deduction;
      adjustment = entry.adjustment;
      net;
    };
  };

  func getCallawayChart() : [ChartEntry] {
    [
      { lowerBound = 0; deductionHoles = 0; deductionFraction = 1; adjustment = 0 },
      { lowerBound = 71; deductionHoles = 0; deductionFraction = 1; adjustment = 0 },
      { lowerBound = 76; deductionHoles = 1; deductionFraction = 1; adjustment = 0 },
      { lowerBound = 81; deductionHoles = 2; deductionFraction = 1; adjustment = 0 },
      { lowerBound = 86; deductionHoles = 2; deductionFraction = 1; adjustment = 0 },
      { lowerBound = 91; deductionHoles = 3; deductionFraction = 1; adjustment = 0 },
      { lowerBound = 96; deductionHoles = 3; deductionFraction = 1; adjustment = 0 },
      { lowerBound = 101; deductionHoles = 4; deductionFraction = 1; adjustment = 0 },
      { lowerBound = 106; deductionHoles = 4; deductionFraction = 1; adjustment = -2 },
      { lowerBound = 111; deductionHoles = 5; deductionFraction = 1; adjustment = -2 },
      { lowerBound = 116; deductionHoles = 5; deductionFraction = 1; adjustment = -2 },
      { lowerBound = 121; deductionHoles = 6; deductionFraction = 1; adjustment = -2 },
      { lowerBound = 126; deductionHoles = 6; deductionFraction = 1; adjustment = -2 },
      { lowerBound = 131; deductionHoles = 7; deductionFraction = 1; adjustment = -2 },
      { lowerBound = 136; deductionHoles = 8; deductionFraction = 1; adjustment = -2 },
    ];
  };

  func findChartEntry(gross : Int, chart : [ChartEntry]) : ChartEntry {
    var entry = chart[0];
    for (c in chart.values()) {
      if (gross >= c.lowerBound) {
        entry := c;
      };
    };
    entry;
  };

  func calculateDeduction(scores : [Nat], holes : Nat, fraction : Int) : Nat {
    if (holes == 0) { return 0 };

    let sortedScores = scores.sort();
    let worstScores = sortedScores.sliceToArray(0, holes);

    var total : Nat = 0;
    var count = 0;
    for (score in worstScores.values()) {
      if (count < holes) {
        total += score;
        count += 1;
      };
    };

    let finalFraction : Int = if (fraction > 0) { fraction } else { 1 };
    ((total * 100) / finalFraction.toNat()) / 100;
  };
};
