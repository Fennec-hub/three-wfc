<script setup lang="ts">
import { computed, useSlots } from 'vue';

interface Props {
  label?: string; // Optional label text
  inputId?: string; // ID to link label and input for accessibility
  hint?: string; // Optional hint text below the input
  error?: string; // Optional error message (takes precedence over hint)
  required?: boolean; // Adds a visual indicator for required fields
  tag?: string; // Root element tag (defaults to div)
}

const props = withDefaults(defineProps<Props>(), {
  tag: 'div',
  label: '',
  inputId: undefined,
  hint: '',
  error: '',
  required: false,
});

const slots = useSlots();

const hasLabel = computed(() => !!props.label || !!slots.label);
const hasPrefix = computed(() => !!slots.prefix);
const hasPostfix = computed(() => !!slots.postfix);
const hasActions = computed(() => !!slots.actions);
const hasMessage = computed(() => !!props.error || !!props.hint);
const messageText = computed(() => props.error || props.hint);

// Generate a unique ID if none is provided, useful for linking label and input
const safeInputId = computed(() => props.inputId || `form-group-input-${Math.random().toString(36).substring(7)}`);

</script>

<template>
  <component :is="props.tag" :class="$style.formGroup">
    <!-- Label Area -->
    <label v-if="hasLabel" :for="safeInputId" :class="$style.label">
      <slot name="label">
        {{ props.label }}
      </slot>
      <span v-if="props.required" :class="$style.requiredMarker">*</span>
    </label>

    <!-- Input Wrapper (for prefix/postfix) -->
    <div :class="$style.inputWrapper">
      <div v-if="hasPrefix" :class="$style.prefix">
        <slot name="prefix"></slot>
      </div>
      <!-- Default slot for the actual input element -->
      <div :class="$style.inputArea">
        <slot :input-id="safeInputId"></slot>
      </div>
      <div v-if="hasPostfix" :class="$style.postfix">
        <slot name="postfix"></slot>
      </div>
    </div>

    <!-- Hint/Error Message Area -->
    <div v-if="hasMessage"
      :class="[$style.messageArea, { [$style.error]: props.error }, { [$style.hint]: !props.error }]">
      {{ messageText }}
    </div>

    <!-- Action Buttons Area -->
    <div v-if="hasActions" :class="$style.actionsArea">
      <slot name="actions"></slot>
    </div>
  </component>
</template>

<style module>
/* Import a base variables file if you have one */
/* @import '@/styles/variables.css'; */

:root {
  /* Define colors based on the image */
  --color-background-dark: #1e1e1e;
  --color-input-background: #2a2a2a;
  --color-text-primary: #e0e0e0;
  --color-text-secondary: #a0a0a0;
  --color-text-label: #a0a0a0;
  /* Similar to secondary or slightly lighter */
  --color-accent: #ffc107;
  /* Yellow/Orange */
  --color-accent-hover: #ffca2c;
  --color-error: #f44336;
  --color-border: #444;
  /* Subtle border if needed */
  --border-radius: 6px;
  --input-padding-vertical: 0.65rem;
  --input-padding-horizontal: 0.85rem;
}

.formGroup {
  display: flex;
  flex-direction: column;
  margin-bottom: 1.25rem;
  /* Space between form groups */
  width: 100%;
}

.label {
  font-size: 0.8rem;
  font-weight: 500;
  color: var(--color-text-label);
  margin-bottom: 0.4rem;
  text-transform: uppercase;
  /* Matches "MENU", "MESSAGES" style */
  display: block;
  /* Ensure it takes full width */
}

.requiredMarker {
  color: var(--color-error);
  margin-left: 0.25rem;
}

.inputWrapper {
  display: flex;
  align-items: center;
  /* Vertically align prefix/input/postfix */
  background-color: var(--color-input-background);
  border-radius: var(--border-radius);
  border: 1px solid transparent;
  /* Placeholder for focus */
  transition: border-color 0.2s ease-in-out;
  position: relative;
  /* Needed for potential absolute positioning inside */
}

.inputWrapper:focus-within {
  border-color: var(--color-accent);
  box-shadow: 0 0 0 2px rgba(255, 193, 7, 0.3);
  /* Subtle glow */
}

.inputArea {
  flex-grow: 1;
  /* Input takes remaining space */
  /* Reset styles that might interfere from wrapper */
  background-color: transparent;
  border: none;
  min-width: 0;
  /* Prevent flexbox overflow issues */
}

/* Styling for standard inputs placed in the default slot */
/* Apply these classes manually or using :deep() selector */
.inputArea> :deep(input):not([type="radio"]):not([type="checkbox"]):not([type="range"]):not([type="button"]):not([type="submit"]):not([type="reset"]),
.inputArea> :deep(textarea),
.inputArea> :deep(select) {
  width: 100%;
  padding: var(--input-padding-vertical) var(--input-padding-horizontal);
  background-color: transparent;
  /* Inherits from wrapper */
  border: none;
  color: var(--color-text-primary);
  font-size: 0.95rem;
  outline: none;
  border-radius: var(--border-radius);
  /* Needed if prefix/postfix don't exist */
  box-sizing: border-box;
  appearance: none;
  /* Remove default styling */
}

.inputArea> :deep(input::placeholder),
.inputArea> :deep(textarea::placeholder) {
  color: var(--color-text-secondary);
  opacity: 0.8;
}

/* Specific styling for select */
.inputArea> :deep(select) {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='%23a0a0a0'%3E%3Cpath fill-rule='evenodd' d='M4.22 6.22a.75.75 0 0 1 1.06 0L8 8.94l2.72-2.72a.75.75 0 1 1 1.06 1.06l-3.25 3.25a.75.75 0 0 1-1.06 0L4.22 7.28a.75.75 0 0 1 0-1.06Z' clip-rule='evenodd'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right var(--input-padding-horizontal) center;
  background-size: 1em 1em;
  padding-right: calc(var(--input-padding-horizontal) * 2 + 1em);
  /* Make space for arrow */
}

.inputArea> :deep(select option) {
  background-color: var(--color-input-background);
  color: var(--color-text-primary);
}


/* Styling for range input */
.inputArea> :deep(input[type="range"]) {
  padding: var(--input-padding-vertical) 0;
  /* Range needs different padding */
  margin: 0 var(--input-padding-horizontal);
  /* Use margin for spacing */
  width: calc(100% - var(--input-padding-horizontal) * 2);
  /* Adjust width for margin */
  cursor: pointer;
  height: 4px;
  /* Track height */
  background: var(--color-text-secondary);
  border-radius: 2px;
}

.inputArea> :deep(input[type="range"]::-webkit-slider-thumb) {
  appearance: none;
  width: 16px;
  height: 16px;
  background: var(--color-accent);
  border-radius: 50%;
  cursor: pointer;
  margin-top: -6px;
  /* Center thumb vertically on track */
}

.inputArea> :deep(input[type="range"]::-moz-range-thumb) {
  width: 16px;
  height: 16px;
  background: var(--color-accent);
  border-radius: 50%;
  cursor: pointer;
  border: none;
}

.inputArea> :deep(input[type="range"]::-ms-thumb) {
  width: 16px;
  height: 16px;
  background: var(--color-accent);
  border-radius: 50%;
  cursor: pointer;
  border: none;
}

/* Add focus styles for range thumb if desired */

.prefix,
.postfix {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  /* Prevent shrinking */
  color: var(--color-text-secondary);
}

.prefix {
  padding-left: var(--input-padding-horizontal);
  padding-right: 0.5rem;
  /* Space between prefix and input */
}

.postfix {
  padding-right: var(--input-padding-horizontal);
  padding-left: 0.5rem;
  /* Space between input and postfix */
}

/* Styling for buttons within prefix/postfix */
.prefix> :deep(button),
.postfix> :deep(button) {
  background: none;
  border: none;
  padding: 0.25rem;
  margin: 0;
  cursor: pointer;
  color: var(--color-text-secondary);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
  border-radius: var(--border-radius);
  transition: color 0.2s ease, background-color 0.2s ease;
}

.prefix> :deep(button:hover),
.postfix> :deep(button:hover) {
  color: var(--color-accent);
}

.prefix> :deep(button:focus-visible),
.postfix> :deep(button:focus-visible) {
  outline: 2px solid var(--color-accent);
  outline-offset: 1px;
}

.messageArea {
  font-size: 0.8rem;
  margin-top: 0.4rem;
  min-height: 1.2em;
  /* Reserve space to prevent layout shifts */
}

.hint {
  color: var(--color-text-secondary);
}

.error {
  color: var(--color-error);
  font-weight: 500;
}

.actionsArea {
  margin-top: 1rem;
  display: flex;
  gap: 0.75rem;
  /* Space between action buttons */
  justify-content: flex-start;
  /* Or flex-end, center */
}

/* Basic Button Styling (apply class to buttons in actions slot) */
:global(.form-button) {
  padding: 0.6rem 1.2rem;
  border: none;
  border-radius: var(--border-radius);
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease, transform 0.1s ease;
  text-decoration: none;
  /* For link-styled buttons */
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

:global(.form-button-primary) {
  background-color: var(--color-accent);
  color: var(--color-background-dark);
  /* Dark text on yellow */
}

:global(.form-button-primary:hover) {
  background-color: var(--color-accent-hover);
}

:global(.form-button-primary:active) {
  transform: scale(0.98);
}

:global(.form-button-secondary) {
  background-color: var(--color-input-background);
  color: var(--color-text-primary);
  border: 1px solid var(--color-border);
}

:global(.form-button-secondary:hover) {
  background-color: #3a3a3a;
  /* Slightly lighter dark */
}

:global(.form-button-secondary:active) {
  transform: scale(0.98);
}


/* Style for Group Buttons (e.g., radio buttons styled as buttons) */
/* Use a container with this class in the default slot */
:global(.button-group) {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  padding: var(--input-padding-vertical) var(--input-padding-horizontal);
  /* Match input padding */
}

:global(.button-group label) {
  /* Hide actual radio input */
  position: absolute;
  opacity: 0;
  pointer-events: none;
}

:global(.button-group .button-group-item) {
  display: inline-block;
  padding: 0.4rem 0.8rem;
  background-color: var(--color-input-background);
  /* Match input background */
  color: var(--color-text-secondary);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius);
  cursor: pointer;
  transition: background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease;
  font-size: 0.85rem;
  text-align: center;
}

:global(.button-group input[type="radio"]:checked + .button-group-item),
:global(.button-group input[type="checkbox"]:checked + .button-group-item) {
  background-color: var(--color-accent);
  color: var(--color-background-dark);
  border-color: var(--color-accent);
  font-weight: 500;
}

:global(.button-group input[type="radio"]:focus-visible + .button-group-item),
:global(.button-group input[type="checkbox"]:focus-visible + .button-group-item) {
  outline: 2px solid var(--color-accent);
  outline-offset: 2px;
}

:global(.button-group .button-group-item:hover) {
  border-color: var(--color-text-secondary);
  /* Subtle hover */
}

/* Style for Color Tags */
/* Use a container with this class in the default slot or postfix */
:global(.color-tag-group) {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  padding: var(--input-padding-vertical) var(--input-padding-horizontal);
}

:global(.color-tag) {
  display: inline-block;
  padding: 0.2rem 0.6rem;
  border-radius: 1rem;
  /* Pill shape */
  font-size: 0.75rem;
  font-weight: 500;
  /* Define specific color classes */
}

:global(.color-tag-red) {
  background-color: #e57373;
  color: #fff;
}

:global(.color-tag-blue) {
  background-color: #64b5f6;
  color: #fff;
}

:global(.color-tag-green) {
  background-color: #81c784;
  color: #000;
}

:global(.color-tag-yellow) {
  background-color: #fff176;
  color: #000;
}

/* Add more colors as needed */
</style>