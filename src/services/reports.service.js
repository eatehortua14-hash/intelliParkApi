const {
  getIncomeSummary,
  getIncomeByPaymentMethod,
  getIncomeByVehicleType,
  getPaymentDetails
} = require('../database/reports.db');

const isValidDate = (dateValue) => {
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  return dateRegex.test(dateValue);
};

const getTodayDate = () => {
  return new Date().toISOString().split('T')[0];
};

const getIncomeReport = async (filters) => {
  const today = getTodayDate();

  const fromDate = filters.from || today;
  const toDate = filters.to || today;

  if (!isValidDate(fromDate)) {
    throw new Error('La fecha de inicio debe tener el formato AAAA-MM-DD');
  }

  if (!isValidDate(toDate)) {
    throw new Error('La fecha debe tener el formato AAAA-MM-DD');
  }

  if (fromDate > toDate) {
    throw new Error('La fecha de inicio no puede ser posterior a la fecha de finalización.');
  }

  const summary = await getIncomeSummary(fromDate, toDate);
  const byPaymentMethod = await getIncomeByPaymentMethod(fromDate, toDate);
  const byVehicleType = await getIncomeByVehicleType(fromDate, toDate);
  const paymentDetails = await getPaymentDetails(fromDate, toDate);

  return {
    filters: {
      from: fromDate,
      to: toDate
    },
    summary: {
      totalIncome: Number(summary.total_income),
      totalPayments: Number(summary.total_payments)
    },
    byPaymentMethod,
    byVehicleType,
    paymentDetails
  };
};

module.exports = {
  getIncomeReport
};