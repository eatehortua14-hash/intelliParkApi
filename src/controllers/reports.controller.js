const { getIncomeReport } = require('../services/reports.service');

const incomeReport = async (req, res) => {
  try {
    const report = await getIncomeReport(req.query);

    res.status(200).json({
      message: 'Informe de ingresos generado con éxito',
      data: report
    });
  } catch (error) {
    res.status(400).json({
      message: error.message
    });
  }
};

module.exports = {
  incomeReport
};