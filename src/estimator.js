const covid19ImpactEstimator = (data) => {
  const input = data;
  const { reportedCases } = input;
  const { timeToElapse } = input;
  // const { population } = input;
  const { totalHospitalBeds } = input;
  const freeBeds = (totalHospitalBeds * 0.35);
  const { periodType } = input;
  const { region } = input;
  const { avgDailyIncomeInUSD } = region;
  const { avgDailyIncomePopulation } = region;
  let factor = 1;
  const normalCurrentlyInfected = Math.trunc(reportedCases * 10);
  const severeCurrentlyInfected = Math.trunc(reportedCases * 50);
  let periodInDays = 0;
  // set factor based on period
  switch (periodType) {
    case 'days':
      factor = Math.trunc((timeToElapse) / 3);
      periodInDays = timeToElapse;
      break;
    case 'weeks':
      factor = Math.trunc((timeToElapse * 7) / 3);
      periodInDays = timeToElapse * 7;
      break;
    case 'months':
      factor = Math.trunc((timeToElapse * 30) / 3);
      periodInDays = timeToElapse * 30;
      break;
    default:
      break;
  }
  const normalInfectionsByRequestedTime = normalCurrentlyInfected * (2 ** factor);
  const severeInfectionsByRequestedTime = severeCurrentlyInfected * (2 ** factor);
  const normalSevereCasesByRequestedTime = Math.trunc(0.15 * normalInfectionsByRequestedTime);
  const severeCasesByRequestedTime = Math.trunc(0.15 * severeInfectionsByRequestedTime);
  const normalHospitalBedsByRequestedTime = Math.trunc(freeBeds - normalSevereCasesByRequestedTime);
  const severeHospitalBedsByRequestedTime = Math.trunc(freeBeds - severeCasesByRequestedTime);
  const normalCasesForICUByRequestedTime = Math.trunc(0.05 * normalInfectionsByRequestedTime);
  const severeCasesForICUByRequestedTime = Math.trunc(0.05 * severeInfectionsByRequestedTime);
  const nCasesForVentilatorsByRequestedTime = Math.trunc(0.02 * normalInfectionsByRequestedTime);
  const sCasesForVentilatorsByRequestedTime = Math.trunc(0.02 * severeInfectionsByRequestedTime);
  const normalDollarsInFlight = Math.trunc((normalInfectionsByRequestedTime * avgDailyIncomeInUSD
    * avgDailyIncomePopulation) / periodInDays);
  const severeDollarsInFlight = Math.trunc((severeInfectionsByRequestedTime * avgDailyIncomeInUSD
    * avgDailyIncomePopulation) / periodInDays);
  return {
    data: input,
    impact: {
      currentlyInfected: normalCurrentlyInfected,
      infectionsByRequestedTime: normalInfectionsByRequestedTime,
      severeCasesByRequestedTime: normalSevereCasesByRequestedTime,
      hospitalBedsByRequestedTime: normalHospitalBedsByRequestedTime,
      casesForICUByRequestedTime: normalCasesForICUByRequestedTime,
      casesForVentilatorsByRequestedTime: nCasesForVentilatorsByRequestedTime,
      dollarsInFlight: normalDollarsInFlight
    },
    severeImpact: {
      currentlyInfected: severeCurrentlyInfected,
      infectionsByRequestedTime: severeInfectionsByRequestedTime,
      severeCasesByRequestedTime,
      hospitalBedsByRequestedTime: severeHospitalBedsByRequestedTime,
      casesForICUByRequestedTime: severeCasesForICUByRequestedTime,
      casesForVentilatorsByRequestedTime: sCasesForVentilatorsByRequestedTime,
      dollarsInFlight: severeDollarsInFlight
    }
  };
};
export default covid19ImpactEstimator;
