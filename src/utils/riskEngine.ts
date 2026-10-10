/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  SimulationParameters,
  RiskAssessment,
  RiskCategory,
  RiskBreakdown,
  DynamicAlert,
  MitigationRecommendation,
  PresetScenario,
} from '../types/simulation';

/**
 * ============================================================================
 * RULE-BASED RISK SCORING ALGORITHM SPECIFICATION
 * ============================================================================
 *
 * EDUCATIONAL PURPOSE:
 * This algorithm calculates an illustrative geotechnical groundwater risk score
 * between 0 and 100 based on hydrostatic head, inflow rates, drainage capacity,
 * and surrounding soil stability.
 *
 * FORMULA:
 * Risk Score = Clamp(
 *   Groundwater_Points
 *   + Leakage_Points
 *   + Drainage_Penalty
 *   + Soil_Penalty
 *   - Pump_Mitigation_Offset,
 *   0,
 *   100
 * )
 *
 * SCORING COMPONENT WEIGHTS:
 * 1. Groundwater Hydrostatic Level (Max 48 pts):
 *    - 'low'     (-18m below ground, below invert)        =  8 pts
 *    - 'normal'  (-12m below ground, mid-tunnel springline) = 18 pts
 *    - 'high'    (-6m below ground, above tunnel crown)   = 38 pts
 *    - 'critical'(-2m below ground, sub-surface surcharge) = 48 pts
 *
 * 2. Water Ingress Leakage Intensity (Max 48 pts):
 *    - 'none'     (0 L/min, dry segmental rings)          =  0 pts
 *    - 'low'      (8 L/min, damp spots / minor weep)       = 10 pts
 *    - 'moderate' (35 L/min, steady trickle from gaskets)  = 22 pts
 *    - 'high'     (90 L/min, active jet / flowing seam)   = 36 pts
 *    - 'severe'   (220 L/min, gushing inflow / sand boil)  = 48 pts
 *
 * 3. Drainage System Functional Penalty (Max 35 pts):
 *    - 'normal'          (clean trenches & working sump)  =  0 pts
 *    - 'partial_blocked' (sediment buildup, 50% flow cap) = 16 pts
 *    - 'pump_failure'    (pump tripped / electrical fault)= 28 pts
 *    - 'blocked'         (full conduit siltation / backup)= 35 pts
 *
 * 4. Soil Condition Risk Weight (Max 25 pts):
 *    - 'stable'              (intact clay/sand matrix)    =  0 pts
 *    - 'moisture_increasing' (pore pressure buildup)       = 12 pts
 *    - 'possible_erosion'    (piping / loss of fines)     = 25 pts
 *
 * 5. Active Dewatering Mitigation Offset:
 *    - When pump is RUNNING:
 *      * If drainage is normal: Offset = -22 pts (effective dewatering drawdown)
 *      * If drainage is partially blocked: Offset = -10 pts (throttled dewatering)
 *      * If pump failure or drainage blocked: Offset = 0 pts (pumping ineffective, warning issued)
 *
 * RISK CATEGORIES:
 * - 0 to 29:   LOW RISK (Standard excavation protocols)
 * - 30 to 59:  MODERATE RISK (Heightened monitoring, routine maintenance)
 * - 60 to 79:  HIGH RISK (Specialist intervention, flow diversion, grout seals)
 * - 80 to 100: CRITICAL RISK (Immediate emergency protocol, evacuation standby)
 *
 * DISCLAIMER:
 * These thresholds and weights are designed exclusively for hackathon demonstration
 * and educational purposes. They are NOT certified geotechnical limits, Eurocode 7 /
 * CIRIA standards, or official urban metro safety engineering specifications.
 */

export function calculateRiskAssessment(
  params: SimulationParameters
): RiskAssessment {
  // 1. Groundwater points
  let gwPts = 18;
  let gwDesc = 'Normal water table at tunnel springline (-12m)';
  switch (params.groundwaterLevel) {
    case 'low':
      gwPts = 8;
      gwDesc = 'Depressed water table beneath tunnel invert (-18m)';
      break;
    case 'normal':
      gwPts = 18;
      gwDesc = 'Normal hydrostatic head at mid-tunnel springline (-12m)';
      break;
    case 'high':
      gwPts = 38;
      gwDesc = 'Elevated water table exceeding tunnel crown (-6m)';
      break;
    case 'critical':
      gwPts = 48;
      gwDesc = 'Critical hydrostatic surcharge near ground surface (-2m)';
      break;
  }

  // 2. Leakage intensity points
  let leakPts = 0;
  switch (params.leakageIntensity) {
    case 'none':
      leakPts = 0;
      break;
    case 'low':
      leakPts = 10;
      break;
    case 'moderate':
      leakPts = 22;
      break;
    case 'high':
      leakPts = 36;
      break;
    case 'severe':
      leakPts = 48;
      break;
  }

  // 3. Drainage penalty
  let drainPts = 0;
  let drainDesc = 'Drainage channels clear; sump operating nominally';
  switch (params.drainageStatus) {
    case 'normal':
      drainPts = 0;
      drainDesc = 'Drainage trenches and sump pumps fully operational';
      break;
    case 'partial_blocked':
      drainPts = 16;
      drainDesc = 'Invert ditch partially silted; hydraulic capacity ~50%';
      break;
    case 'pump_failure':
      drainPts = 28;
      drainDesc = 'Primary dewatering pump offline due to trip/overload';
      break;
    case 'blocked':
      drainPts = 35;
      drainDesc = 'Severe drainage line blockage; zero gravity discharge';
      break;
  }

  // 4. Soil penalty
  let soilPts = 0;
  switch (params.soilCondition) {
    case 'stable':
      soilPts = 0;
      break;
    case 'moisture_increasing':
      soilPts = 12;
      break;
    case 'possible_erosion':
      soilPts = 25;
      break;
  }

  // 5. Mitigation offset
  let pumpOffset = 0;
  if (params.isPumpRunning) {
    if (params.drainageStatus === 'normal') {
      pumpOffset = 22;
    } else if (params.drainageStatus === 'partial_blocked') {
      pumpOffset = 10;
    } else {
      // Pump failed or drainage blocked: pump cannot convey water effectively
      pumpOffset = 0;
    }
  }

  const rawSum = gwPts + leakPts + drainPts + soilPts;
  const finalScore = Math.max(0, Math.min(100, Math.round(rawSum - pumpOffset)));

  // Determine category & visual styling
  let category: RiskCategory = 'LOW RISK';
  let colorScheme = {
    bg: 'bg-emerald-950/40',
    border: 'border-emerald-500/40',
    text: 'text-emerald-400',
    badgeBg: 'bg-emerald-500/20',
    badgeText: 'text-emerald-300',
    accentHex: '#10B981',
  };
  let recommendedAction =
    'Maintain baseline vibrating wire piezometer readings and shift logs.';

  if (finalScore >= 80) {
    category = 'CRITICAL RISK';
    colorScheme = {
      bg: 'bg-rose-950/40',
      border: 'border-rose-500/60',
      text: 'text-rose-400',
      badgeBg: 'bg-rose-500/20',
      badgeText: 'text-rose-300',
      accentHex: '#F43F5E',
    };
    recommendedAction =
      'Trigger emergency response protocol, notify geotechnical director, activate standby diesel pumps, and evaluate tunnel clearance.';
  } else if (finalScore >= 60) {
    category = 'HIGH RISK';
    colorScheme = {
      bg: 'bg-amber-950/40',
      border: 'border-amber-500/50',
      text: 'text-amber-400',
      badgeBg: 'bg-amber-500/20',
      badgeText: 'text-amber-300',
      accentHex: '#F59E0B',
    };
    recommendedAction =
      'Mobilize high-pressure chemical grouting team to seal segment joints and clear invert drainage channels.';
  } else if (finalScore >= 30) {
    category = 'MODERATE RISK';
    colorScheme = {
      bg: 'bg-yellow-950/40',
      border: 'border-yellow-500/40',
      text: 'text-yellow-400',
      badgeBg: 'bg-yellow-500/20',
      badgeText: 'text-yellow-300',
      accentHex: '#EAB308',
    };
    recommendedAction =
      'Conduct visual lining inspection, check sump sediment levels, and increase piezometer log frequency to 2-hour cycles.';
  }

  // Contributing factors identification
  const factors: string[] = [];
  if (params.groundwaterLevel === 'critical') {
    factors.push('Severe hydrostatic head surcharge (-2.0m above tunnel crown)');
  } else if (params.groundwaterLevel === 'high') {
    factors.push('Elevated groundwater table (-6.0m) creating joint pressure');
  }

  if (params.leakageIntensity === 'severe') {
    factors.push('Massive water ingress (220+ L/min) threatening invert flooding');
  } else if (params.leakageIntensity === 'high') {
    factors.push('High seepage flow (90 L/min) exceeding passive ditch rate');
  } else if (params.leakageIntensity === 'moderate') {
    factors.push('Moderate continuous seepage from segmental gasket joints');
  }

  if (params.drainageStatus === 'blocked') {
    factors.push('Invert drainage channel completely blocked by silt & debris');
  } else if (params.drainageStatus === 'pump_failure') {
    factors.push('Primary dewatering pump tripped/offline');
  } else if (params.drainageStatus === 'partial_blocked') {
    factors.push('Partial drainage restriction causing water ponding');
  }

  if (params.soilCondition === 'possible_erosion') {
    factors.push('Active soil erosion & loss of fines (internal piping risk)');
  } else if (params.soilCondition === 'moisture_increasing') {
    factors.push('Surrounding soil moisture & pore water pressure rising');
  }

  if (params.isPumpRunning && (params.drainageStatus === 'blocked' || params.drainageStatus === 'pump_failure')) {
    factors.push('Simulated pump active but constrained by drainage failure');
  } else if (params.isPumpRunning) {
    factors.push('Dewatering pump actively offsetting hydrostatic ponding (-22 pts)');
  }

  if (factors.length === 0) {
    factors.push('Nominal groundwater equilibrium, stable lining joints, clear drainage');
  }

  const breakdown: RiskBreakdown = {
    groundwaterPoints: gwPts,
    leakagePoints: leakPts,
    drainagePoints: drainPts,
    soilPoints: soilPts,
    pumpMitigationOffset: pumpOffset,
    rawSum,
    finalScore,
  };

  return {
    score: finalScore,
    category,
    colorScheme,
    factors,
    groundwaterCondition: gwDesc,
    drainageCondition: drainDesc,
    recommendedAction,
    breakdown,
  };
}

/**
 * Generate contextual alert banner based on specific combination of parameters
 */
export function generateDynamicAlerts(
  params: SimulationParameters,
  risk: RiskAssessment
): DynamicAlert[] {
  const alerts: DynamicAlert[] = [];

  // Critical composite condition 1: High GW + Severe Leakage
  if (
    (params.groundwaterLevel === 'high' || params.groundwaterLevel === 'critical') &&
    (params.leakageIntensity === 'high' || params.leakageIntensity === 'severe')
  ) {
    alerts.push({
      id: 'high-gw-severe-leak',
      severity: 'critical',
      title: 'High Water Ingress Concern: Hydrostatic Head Overload',
      explanation:
        'Elevated groundwater table is exerting excessive pore pressure against tunnel segmental gaskets, driving high-velocity water ingress into the excavated chamber.',
      suggestedAction:
        'Mobilize rapid-reaction chemical polyurethane (PU) resin injection crew to seal defective ring joints immediately.',
      iconType: 'droplet',
    });
  }

  // Critical composite condition 2: High GW + Blocked Drainage / Pump Failure
  if (
    (params.groundwaterLevel === 'high' || params.groundwaterLevel === 'critical') &&
    (params.drainageStatus === 'blocked' || params.drainageStatus === 'pump_failure')
  ) {
    alerts.push({
      id: 'gw-blocked-drain',
      severity: 'critical',
      title: 'Possible Tunnel Flooding Hazard: Drainage Capacity Deficit',
      explanation:
        'Underground water table is high while the invert drainage channel or pump is incapacitated, causing rapid invert water accumulation and submergence of track equipment.',
      suggestedAction:
        'Deploy auxiliary diesel-driven suction pumps and initiate mechanical jetting to clear silt accumulation from invert sumps.',
      iconType: 'alert-circle',
    });
  }

  // Critical composite condition 3: Increasing Moisture + Soil Erosion
  if (
    params.soilCondition === 'possible_erosion'
  ) {
    alerts.push({
      id: 'soil-erosion-hazard',
      severity: params.leakageIntensity !== 'none' ? 'critical' : 'high',
      title: 'Ground Deterioration & Loss of Fines Concern (Internal Piping)',
      explanation:
        'Turbid water seepage indicates that fine sands and silts behind the segmental lining are being washed into the tunnel, which can create subterranean voids and surface settlement.',
      suggestedAction:
        'Collect water sample for turbidity and sediment testing; inspect surface settlement prisms (MP-01/02) for ground subsidence.',
      iconType: 'alert-triangle',
    });
  }

  // Condition 4: Pump Failure + Leakage
  if (
    params.drainageStatus === 'pump_failure' &&
    params.leakageIntensity !== 'none'
  ) {
    alerts.push({
      id: 'pump-failure-alert',
      severity: 'high',
      title: 'Urgent Drainage Inspection Required: Pump Tripped',
      explanation:
        'Primary dewatering pump P-101 has tripped or suffered motor fault while active seepage is entering the tunnel.',
      suggestedAction:
        'Inspect electrical control panel, reset thermal overload relay, and switch over to backup dewatering pump P-102.',
      iconType: 'flame',
    });
  }

  // Condition 5: Ineffective pump running while blocked
  if (
    params.isPumpRunning &&
    (params.drainageStatus === 'blocked' || params.drainageStatus === 'pump_failure')
  ) {
    alerts.push({
      id: 'ineffective-pump',
      severity: 'moderate',
      title: 'Dewatering Constrained: Blocked Discharge Conduit',
      explanation:
        'Pump motor is running but discharge flow is throttled by pipe siltation or mechanical failure. Sump drawdown rate is near zero.',
      suggestedAction:
        'Clear discharge pipe obstruction or reroute temporary flexible hose to external portal silt trap.',
      iconType: 'alert-triangle',
    });
  }

  // If no high-severity alert triggered, provide baseline status
  if (alerts.length === 0) {
    if (risk.score < 30) {
      alerts.push({
        id: 'nominal-status',
        severity: 'low',
        title: 'Tunnel Section T-01 Operating within Nominal Tolerances',
        explanation:
          'Hydrostatic pressure, segmental lining integrity, and gravity drainage sump flow are stable. No abnormal seepage detected.',
        suggestedAction:
          'Continue routine automated data logging from vibrating wire piezometers and optical tunnel convergence prisms.',
        iconType: 'shield-check',
      });
    } else {
      alerts.push({
        id: 'elevated-vigil',
        severity: 'moderate',
        title: 'Elevated Geotechnical Alert: Subterranean Parameters Drift',
        explanation:
          'Combined groundwater and joint conditions are drifting beyond standard baseline. Infiltration rate requires close observation.',
        suggestedAction:
          'Verify piezometer calibration and perform physical walk-through inspection along segmental rings R-120 to R-165.',
        iconType: 'alert-triangle',
      });
    }
  }

  return alerts;
}

/**
 * Generate actionable civil engineering mitigation recommendations
 */
export function getMitigationRecommendations(
  params: SimulationParameters,
  risk: RiskAssessment
): MitigationRecommendation[] {
  const recommendations: MitigationRecommendation[] = [];

  // Recommendation 1: Joint & Lining inspection
  if (params.leakageIntensity !== 'none') {
    recommendations.push({
      id: 'rec-lining-inspection',
      title: 'Inspect Tunnel Lining Joints and Seepage Locations',
      priority:
        params.leakageIntensity === 'severe' || params.leakageIntensity === 'high'
          ? 'URGENT'
          : 'ROUTINE',
      geotechnicalContext:
        'Precast concrete segmental rings rely on continuous elastomeric EPDM gaskets and hydrophilic sealant strips. Hydrostatic surcharge can induce micro-gaps.',
      actionSteps: [
        'Map active seepage points using chainage markers (Ch. 14+320 to 14+480).',
        'Measure radial joint offsets with vernier calipers to ensure segment alignment is within ±5mm tolerance.',
        'Prepare dual-component polyurethane (PU) or acrylic resin pressure-injection packers for localized caulking.',
      ],
      equipmentOrTool: 'High-pressure injection pump & polyurethane resin packers',
    });
  }

  // Recommendation 2: Piezometer instrumentation verification
  if (params.groundwaterLevel === 'high' || params.groundwaterLevel === 'critical') {
    recommendations.push({
      id: 'rec-piezometer-verification',
      title: 'Verify Groundwater Readings Using Site Instruments',
      priority:
        params.groundwaterLevel === 'critical' ? 'URGENT' : 'ELEVATED',
      geotechnicalContext:
        'Subsurface pore water pressures can fluctuate rapidly during monsoon rain, utility water main breaks, or adjacent river recharge.',
      actionSteps: [
        'Cross-check borehole vibrating wire piezometers (PZ-01 and PZ-02) against standpipe dipmeter manual soundings.',
        'Calculate effective pore pressure ratio (ru) and total overburden hydrostatic load acting on the tunnel crown.',
        'Notify project hydrogeologist to verify regional aquifer recharge models.',
      ],
      equipmentOrTool: 'Vibrating wire piezometers & electric contact water level dipmeter',
    });
  }

  // Recommendation 3: Drainage channel inspection
  if (params.drainageStatus !== 'normal') {
    recommendations.push({
      id: 'rec-drainage-clearing',
      title: 'Inspect Drainage Channels and Collection Sumps',
      priority:
        params.drainageStatus === 'blocked' ? 'EMERGENCY' : 'ELEVATED',
      geotechnicalContext:
        'Construction slurry, shotcrete rebound, and excavated fines naturally wash into invert ditches, causing hydraulic siltation if uncleaned.',
      actionSteps: [
        'Deploy high-pressure water jetting unit to flush sediment from invert longitudinal drains.',
        'Dredge gravel and silt trap basins upstream of the primary collection sump pit SP-01.',
        'Verify weir discharge flowmeters to confirm uninterrupted gravity outflow to the portal lagoon.',
      ],
      equipmentOrTool: 'High-pressure sewer jetter & portable vacuum sludge extractor',
    });
  }

  // Recommendation 4: Pump operation & backup
  if (
    !params.isPumpRunning ||
    params.drainageStatus === 'pump_failure' ||
    params.leakageIntensity === 'high' ||
    params.leakageIntensity === 'severe'
  ) {
    recommendations.push({
      id: 'rec-pump-contingency',
      title: 'Check Pump Operation and Approved Backup Pumping Arrangement',
      priority:
        params.drainageStatus === 'pump_failure' ? 'URGENT' : 'ELEVATED',
      geotechnicalContext:
        'Tunnel dewatering systems must maintain N+1 redundancy. Failure of the duty pump must automatically initiate the secondary standby pump.',
      actionSteps: [
        'Inspect electrical control panel: check starter contacts, thermal trip relays, and float switch sensor.',
        'Run test cycle on standby diesel dewatering pump P-102 (rated at 150 m³/h capacity).',
        'Verify emergency electrical generator fuel reserve meets the 24-hour continuous run requirement.',
      ],
      equipmentOrTool: 'Submersible slurry pump P-101 & Diesel standby pump P-102',
    });
  }

  // Recommendation 5: Soil erosion & fines loss
  if (params.soilCondition === 'possible_erosion') {
    recommendations.push({
      id: 'rec-erosion-piping',
      title: 'Evaluate Possible Soil Erosion or Loss of Fines (Piping Hazard)',
      priority: 'EMERGENCY',
      geotechnicalContext:
        'Continuous egress of sand particles with seepage water signifies backward erosion piping, which can create catastrophic sinkholes beneath urban structures.',
      actionSteps: [
        'Collect 1-liter grab samples of inflow water every 30 minutes to conduct Imhoff cone sediment settleability and turbidity tests.',
        'Immediately execute secondary cementitious grouting behind segmental rings via grout ports to fill soil voids.',
        'Instruct survey crew to take urgent automated total station readings on surface settlement prisms MP-01/02.',
      ],
      equipmentOrTool: 'Nephelometric turbidity meter & secondary cement grout injection rig',
    });
  }

  // Recommendation 6: Geotechnical engineer notification & escalation
  if (risk.score >= 60) {
    recommendations.push({
      id: 'rec-escalation-engineer',
      title: 'Notify the Responsible Geotechnical Engineer & Shift Lead',
      priority: risk.score >= 80 ? 'EMERGENCY' : 'URGENT',
      geotechnicalContext:
        'Critical and high risk states require formal technical review under the Excavation Permit-to-Work protocol.',
      actionSteps: [
        'Log incident in the Shift Geotechnical Daily Diary with photographic documentation of water ingress points.',
        'Transmit real-time telemetry log to the Project Management Consultant (PMC) Resident Geotechnical Engineer.',
        'Conduct immediate on-site risk appraisal meeting with tunnel heading superintendent.',
      ],
      equipmentOrTool: 'Shift Geotechnical Incident Log & Automated SMS/Radio Escalation',
    });
  }

  // Recommendation 7: Site Emergency Procedure
  if (risk.score >= 80) {
    recommendations.push({
      id: 'rec-site-emergency',
      title: 'Follow the Approved Site Emergency Procedure',
      priority: 'EMERGENCY',
      geotechnicalContext:
        'Risk score exceeds critical threshold (80/100). Safety of tunnel crews and prevention of catastrophic collapse take precedence.',
      actionSteps: [
        'Sound the audible evacuation alarm for all non-essential personnel between Ch. 14+300 and 14+500.',
        'De-energize non-submersible 415V traction and lighting power distribution boards in flooded invert zones.',
        'Establish exclusion cordon at the surface above the tunnel alignment to monitor street vehicular loading.',
      ],
      equipmentOrTool: 'Site Emergency Action Plan (EAP-04) & Evacuation Siren',
    });
  }

  // If stable/low risk, include nominal baseline maintenance
  if (recommendations.length === 0) {
    recommendations.push({
      id: 'rec-baseline-maintenance',
      title: 'Perform Routine Shift Monitoring & Preventative Maintenance',
      priority: 'ROUTINE',
      geotechnicalContext:
        'Current groundwater conditions are within normal structural tolerances. Regular surveillance maintains long-term lining durability.',
      actionSteps: [
        'Record 4-hour manual water level readings from portal observation wells.',
        'Clear floating debris from invert ditch collection baskets at shift handover.',
        'Confirm automatic data transmission from vibrating wire piezometers to central monitoring server.',
      ],
      equipmentOrTool: 'Standard geotechnical inspection clipboard & optical level',
    });
  }

  return recommendations;
}

/**
 * 5 Test Scenarios required by Section 9
 */
export const PRESET_SCENARIOS: PresetScenario[] = [
  {
    id: 'normal',
    name: '1. Normal Conditions',
    badge: 'Baseline Stable',
    description: 'Stable groundwater at -12m springline, zero leakage, clean gravity drainage operating normally.',
    parameters: {
      groundwaterLevel: 'normal',
      leakageIntensity: 'none',
      drainageStatus: 'normal',
      soilCondition: 'stable',
    },
    keyTakeaway: 'Illustrates safe baseline equilibrium where structural gaskets and drainage handle ambient pressures effortlessly.',
  },
  {
    id: 'rising-gw',
    name: '2. Rising Groundwater',
    badge: 'Elevated Pressure',
    description: 'Groundwater elevated to -6m above crown, moderate seepage from segment joints, drainage partially silted.',
    parameters: {
      groundwaterLevel: 'high',
      leakageIntensity: 'moderate',
      drainageStatus: 'partial_blocked',
      soilCondition: 'moisture_increasing',
    },
    keyTakeaway: 'Simulates heavy rainfall or aquifer recharge causing joint weeping and sediment accumulation in invert ditch.',
  },
  {
    id: 'heavy-ingress',
    name: '3. Heavy Water Ingress',
    badge: 'Severe Inflow',
    description: 'Critical groundwater surcharge at -2m, severe gushing joint leakage (220+ L/min), pumps working hard.',
    parameters: {
      groundwaterLevel: 'critical',
      leakageIntensity: 'severe',
      drainageStatus: 'normal',
      soilCondition: 'moisture_increasing',
    },
    keyTakeaway: 'Demonstrates maximum hydraulic inflow test where pumps operate at peak capacity to prevent invert submergence.',
  },
  {
    id: 'drainage-failure',
    name: '4. Drainage Failure',
    badge: 'System Trip',
    description: 'High groundwater at -6m, high water ingress (90 L/min), primary dewatering pump tripped offline.',
    parameters: {
      groundwaterLevel: 'high',
      leakageIntensity: 'high',
      drainageStatus: 'pump_failure',
      soilCondition: 'moisture_increasing',
    },
    keyTakeaway: 'Shows the critical danger of single-point mechanical failure: unpumped water quickly ponds along the rail invert.',
  },
  {
    id: 'soil-erosion',
    name: '5. Possible Soil Erosion',
    badge: 'Piping Risk',
    description: 'Pore pressure increasing, moderate seepage washing fine sands into the tunnel, risk of sub-surface void creation.',
    parameters: {
      groundwaterLevel: 'normal',
      leakageIntensity: 'moderate',
      drainageStatus: 'normal',
      soilCondition: 'possible_erosion',
    },
    keyTakeaway: 'Highlights geotechnical piping hazard: water carries fines, compromising surrounding ground support and risking sinkholes.',
  },
];
