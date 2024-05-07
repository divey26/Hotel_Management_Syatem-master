const mongoose = require('mongoose');

const PayrollSchema = new mongoose.Schema({
  payrollId: {
    type: String,
    unique: true,
    required: true,
  },
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: true
  },
  basicSalary: {
    type: Number,
    required: true
  },
  performanceAllowance: {
    type: Number,
    required: true
  },
  monthYear: {
    type: Date,
    required: true
  },
  netSalary: {
    type: Number
  }
});

const Payroll = mongoose.model('Payroll', PayrollSchema);

module.exports = Payroll;
