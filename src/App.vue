<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png" />
    <validation-observer ref="form" v-slot="{ invalid }">
      <validation-provider
        :rules="{
          required: true,
          nonZero: true,
          maxValue: { value: 9999 },
          minValue: { value: 0.01 },
        }"
        v-slot="{ errors }"
      >
        <b-field
          :message="errors[0]"
          :type="{ 'is-danger': errors[0] }"
          label="Amount"
          custom-class="has-text-grey has-text-weight-semibold"
        >
          <div style="padding-right: 10px; align-self: center; display: inline">
            {{ currency }}
          </div>
          <b-input expanded v-model="fValue"></b-input>
        </b-field>
      </validation-provider>
      <b-button
        class="ml-2"
        type="is-link"
        icon-left="plus"
        pack="mdi"
        :disabled="invalid"
        >Add Payment</b-button
      >
    </validation-observer>
  </div>
</template>

<script>
import { ValidationProvider, ValidationObserver } from "vee-validate";
import axios from "axios";
import dayjs from "dayjs";
import * as utc from "dayjs/plugin/utc";
dayjs.extend(utc);

import "./vee-validate.js";

export default {
  name: "App",
  mounted() {
    axios({
      method: "GET",
      url: "https://assets-preprod.nadia.com.my/companies.json",
    });

    const date = dayjs().format("DD MMMM YYYY");

    const time = dayjs().utcOffset(8).format("hh:mm A")

    console.log(date);
    console.log(time);
  },
  components: {
    ValidationProvider,
    ValidationObserver,
  },
  data() {
    return {
      amount: 0,
      formattedAmount: "0",
      currency: "MYR",
    };
  },
  computed: {
    fValue: {
      get: function () {
        return this.formattedAmount;
      },

      set: function (newValue) {
        this.amount = newValue;
        if (newValue.length <= 2) {
          return (this.formattedAmount = newValue);
        }

        var valToFind = ".";
        if (newValue.indexOf(valToFind) > -1) {
          newValue = newValue.replace(".", "").replace(",", "");
        }
        console.log("newValue", newValue);

        this.formattedAmount =
          newValue.substr(0, newValue.length - 2) +
          "." +
          newValue.substr(newValue.length - 2);
        console.log("formatted: ", this.formattedAmount);
        let num_parts = this.formattedAmount.toString().split(".");
        console.log("num_parts: ", num_parts);
        const result = num_parts[0]
          .replace(/\D/g, "")
          .replace(/\B(?=(\d{3})+(?!\d))/g, ",");

        console.log("result: ", result);
        this.formattedAmount = result + "." + num_parts[1];
      },
    },
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
