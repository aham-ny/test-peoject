import { required } from "vee-validate/dist/rules";
import { extend } from "vee-validate";

const thousandSeparator = (value) => {
  let newVal = (value / 1).toFixed(2).replace(/,/g, "")
  return newVal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",").replace(/-/g, "");
}

extend("required", {
  ...required,
  message: "This field is required"
});

extend('maxValue', {
  validate(value, args) {
    if (typeof value === 'number') {
      value = value.toString()
    }

    let floatString = value.replace(/,/g, "").trim()
    return parseFloat(floatString) <= args.value;
  },
  params: ['value'],
  message: (fieldName, args) => {
    let rounded = parseFloat(args.value).toFixed(2)
    return `Must be below ${thousandSeparator(rounded)}`;
  }
});

extend('minValue', {
  validate(value, args) {
    if (typeof value === 'number') {
      value = value.toString()
    }

    let floatString = value.replace(/,/g, "").trim()
    return parseFloat(floatString) >= args.value;
  },
  params: ['value'],
  message: (fieldName, args) => {
    let rounded = parseFloat(args.value).toFixed(2)
    return `Must be above ${thousandSeparator(rounded)}`;
  }
});

extend("nonZero", {
  validate(value) {
    return {
      valid: parseFloat(value) != 0
    };
  },
  message: 'Must be at least 0.01'
});
