<script setup lang="ts">
import { computed } from 'vue';
import FormGroup from './FormGroup.vue'; // Assuming this component exists and works as expected

const emit = defineEmits(["change"]);
const model = defineModel<number | string | undefined | null>(); // Allow undefined/null for empty state

const props = withDefaults(defineProps<{
  label?: string;
  placeholder?: string;
  // New props
  min?: number;
  max?: number;
  step?: number;
  showSlider?: boolean;
  shiftMultiplier?: number;
  ctrlMultiplier?: number;
}>(), {
  step: 1,
  showSlider: false,
  shiftMultiplier: 10,
  ctrlMultiplier: 100,
});

// Helper to calculate precision from step (e.g., step 0.01 -> precision 2)
const getStepPrecision = (stepValue: number): number => {
  const stepStr = String(stepValue);
  if (stepStr.includes('.')) {
    return stepStr.split('.')[1].length;
  }
  return 0;
};

const precision = computed(() => getStepPrecision(props.step));

// Clamping function
const clamp = (value: number, min?: number, max?: number): number => {
  let clamped = value;
  if (min !== undefined && clamped < min) clamped = min;
  if (max !== undefined && clamped > max) clamped = max;
  return clamped;
};

// To apply precision
const toFixedPrecision = (value: number, prec: number): number => {
  if (prec > 0) {
    return parseFloat(value.toFixed(prec));
  }
  return Math.round(value); // Or parseFloat(value.toFixed(0)) if you prefer
};

// Computed property to manage the numeric value internally
// This handles parsing, clamping, and precision for programmatic changes
const numericValue = computed({
  get: () => {
    const val = parseFloat(String(model.value));
    // If model.value is empty string or unparseable, default to min or 0
    // This ensures slider and programmatic changes always operate on a valid number
    if (isNaN(val)) {
      return props.min ?? 0;
    }
    return val; // Don't clamp here yet, let input field show intermediate values
  },
  set: (newValue: number) => {
    let valToSet = clamp(newValue, props.min, props.max);
    valToSet = toFixedPrecision(valToSet, precision.value);

    if (model.value !== valToSet) {
      model.value = valToSet;
      emit('change', valToSet); // Emit change when programmatically set
    }
  }
});

// Handle actual input field changes (typing, pasting)
const handleInputChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const rawValue = target.value;

  if (rawValue === '') {
    model.value = undefined; // Or null, or props.min. Depends on desired behavior for empty.
    emit('change', model.value);
    return;
  }

  const parsed = parseFloat(rawValue);

  if (!isNaN(parsed)) {
    // Allow user to type numbers that might be temporarily outside min/max or not matching step
    // Clamping will happen on blur or via numericValue setter for programmatic changes
    model.value = parsed; // Let v-model update
    // Do NOT emit 'change' here, rely on @change or @blur for committed changes
  } else {
    // If type="number" and browser allows invalid input (some do, then value is empty string)
    // Or if type="text" was used.
    // Revert to last valid numericValue or min.
    // For type="number", target.value might become "" if invalid, which is handled above.
  }
};

// Handle blur or explicit change event from the input field for final validation
const handleInputCommit = () => {
  const currentVal = parseFloat(String(model.value));
  if (model.value === '' || model.value === undefined || model.value === null) {
    // If you want empty input to mean min value:
    // numericValue.value = props.min ?? 0;
    // If you want empty input to be permissible (model.value is already undefined/null):
    // emit('change', model.value);
    // For this "number exclusive" we probably want to default it
    if (props.min !== undefined) {
      numericValue.value = props.min;
    } else {
      model.value = undefined; // Or 0, depends on requirements for "empty"
    }
  } else if (isNaN(currentVal)) {
    numericValue.value = props.min ?? 0; // Or some other default
  } else {
    // This will clamp and apply precision
    numericValue.value = currentVal;
  }
  // 'change' event is emitted by numericValue setter if value changed
};


const getEffectiveStep = (event: KeyboardEvent | WheelEvent): number => {
  let effectiveStep = props.step;
  if (event.ctrlKey && !event.shiftKey) { // Ctrl only
    effectiveStep *= props.ctrlMultiplier;
  } else if (event.shiftKey && !event.ctrlKey) { // Shift only
    effectiveStep *= props.shiftMultiplier;
  } else if (event.shiftKey && event.ctrlKey) { // Both Shift and Ctrl
    // Example: Make it even finer or a different multiplier
    // For now, let's say Ctrl overrides Shift if both are pressed, or sum them, or use a distinct one.
    // Let's make Ctrl take precedence. Or use the largest.
    effectiveStep *= Math.max(props.shiftMultiplier, props.ctrlMultiplier);
    // Or a different strategy: effectiveStep = props.step / 10; // for fine control
  }
  return effectiveStep;
};

const handleKeyDown = (event: KeyboardEvent) => {
  if (event.key === 'ArrowUp') {
    event.preventDefault();
    numericValue.value += getEffectiveStep(event);
  } else if (event.key === 'ArrowDown') {
    event.preventDefault();
    numericValue.value -= getEffectiveStep(event);
  }
};

const handleWheel = (event: WheelEvent) => {
  if (document.activeElement !== event.currentTarget) return; // Only if input is focused

  event.preventDefault();
  const step = getEffectiveStep(event);
  if (event.deltaY < 0) { // Wheel up
    numericValue.value += step;
  } else if (event.deltaY > 0) { // Wheel down
    numericValue.value -= step;
  }
};

// For the input type="number", v-model handles parsing to number or empty string.
// We use :value and @input for finer control if needed, or stick to v-model.
// Let's use :value and @input/@change for clarity on events.

// Value for the <input type="number">
// It can be string (empty) or number.
const inputValue = computed(() => {
  if (model.value === undefined || model.value === null) return '';
  // Check if it's a number already, otherwise it might be a string from user input
  // that needs to be displayed as is until commit.
  return String(model.value);
});

</script>

<template>
  <FormGroup :label="label" class="vue-number-input">
    <template #input="{ id }">
      <div class="number-input-wrapper">
        <input :id="id" type="number" :value="inputValue" @input="handleInputChange" @change="handleInputCommit"
          @blur="handleInputCommit" :placeholder="placeholder" :min="props.min" :max="props.max" :step="props.step"
          @keydown="handleKeyDown" @wheel="handleWheel" class="number-input-field" />
        <input v-if="props.showSlider && props.min !== undefined && props.max !== undefined" type="range"
          v-model.number="numericValue" :min="props.min" :max="props.max" :step="props.step" class="number-input-slider"
          aria-label="Value slider" />
      </div>
    </template>

    <!-- Pass through other slots -->
    <template v-for="(_, name) in $slots" #[name]="slotProps">
      <slot :name="name" v-bind="slotProps" />
    </template>
  </FormGroup>
</template>

<style module>
.vue-number-input .number-input-wrapper {
  display: flex;
  align-items: center;
  gap: 8px;
}

.vue-number-input .number-input-field {
  /* Basic styling, adjust as needed */
  padding: 8px 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  /* Allow input to grow if wrapper allows */
  flex-grow: 1;
  min-width: 60px;
  /* Ensure it doesn't get too small */
}

/* Hide browser default spinners for type=number if you want full custom control */
.vue-number-input .number-input-field::-webkit-outer-spin-button,
.vue-number-input .number-input-field::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.vue-number-input .number-input-field {
  -moz-appearance: textfield;
  /* Firefox */
}

.vue-number-input .number-input-slider {
  flex-grow: 2;
  /* Slider can take more space if available */
  height: auto;
  /* Or fixed height */
}
</style>