<script setup lang="ts">
import { ref } from 'vue';
import FormGroup from './Sketch.vue';
// Assuming you have an icon component or library (e.g., Font Awesome)
// import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
// import { faSearch, faTimes } from '@fortawesome/free-solid-svg-icons';

const name = ref('');
const email = ref('');
const category = ref('tech');
const priority = ref('medium');
const rangeValue = ref(50);
const description = ref('');
const nameError = ref(''); // Example error state
const agree = ref(false);
const selectedColors = ref(['red']); // For checkbox-style color tags

const priorities = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
];

const colors = ['red', 'blue', 'green', 'yellow'];

function validateName() {
  if (name.value.length < 3) {
    nameError.value = 'Name must be at least 3 characters long.';
  } else {
    nameError.value = '';
  }
}

function clearEmail() {
  email.value = '';
}

function submitForm() {
  console.log('Form Submitted:', {
    name: name.value,
    email: email.value,
    category: category.value,
    priority: priority.value,
    range: rangeValue.value,
    description: description.value,
    agree: agree.value,
    colors: selectedColors.value,
  });
  alert('Check console for form data!');
}
</script>

<template>
  <div class="form-container">
    <h1>Settings Form</h1>

    <form @submit.prevent="submitForm">
      <!-- 1. Simple Text Input -->
      <FormGroup label="Full Name" :error="nameError" required>
        <!-- Pass input-id from slot scope to the input -->
        <template #default="{ inputId }">
          <input :id="inputId" type="text" v-model="name" placeholder="Enter your full name" @blur="validateName"
            required />
        </template>
      </FormGroup>

      <!-- 2. Input with Prefix Icon and Postfix Clear Button -->
      <FormGroup label="Email Address" hint="We'll never share your email.">
        <template #prefix>
          <!-- Replace with your actual icon component -->
          <span style="font-size: 1.1em;">📧</span>
          <!-- <font-awesome-icon :icon="faEnvelope" /> -->
        </template>
        <template #default="{ inputId }">
          <input :id="inputId" type="email" v-model="email" placeholder="you@example.com" />
        </template>
        <template #postfix>
          <button type="button" @click="clearEmail" title="Clear email" v-show="email">
            <!-- Replace with your actual icon component -->
            <span style="font-size: 1.1em;">❌</span>
            <!-- <font-awesome-icon :icon="faTimes" /> -->
          </button>
        </template>
      </FormGroup>

      <!-- 3. Select Input -->
      <FormGroup label="Category">
        <template #default="{ inputId }">
          <select :id="inputId" v-model="category">
            <option value="tech">Technology</option>
            <option value="design">Design</option>
            <option value="marketing">Marketing</option>
            <option value="support">Support</option>
          </select>
        </template>
      </FormGroup>

      <!-- 4. Group Button Input (Radio) -->
      <FormGroup label="Priority">
        <template #default="{ inputId }">
          <!-- Use inputId prefix for unique radio IDs -->
          <div class="button-group">
            <span v-for="p in priorities" :key="p.value">
              <label :for="`${inputId}-${p.value}`">
                <input type="radio" :id="`${inputId}-${p.value}`" :value="p.value" v-model="priority"
                  name="priority-group" /><!-- Same name links radios -->
                <span class="button-group-item">{{ p.label }}</span>
              </label>
            </span>
          </div>
        </template>
      </FormGroup>

      <!-- 5. Color Tags (as Checkboxes) -->
      <FormGroup label="Select Tags">
        <template #default="{ inputId }">
          <div class="color-tag-group">
            <span v-for="color in colors" :key="color">
              <label :for="`${inputId}-color-${color}`">
                <input type="checkbox" :id="`${inputId}-color-${color}`" :value="color" v-model="selectedColors" />
                <!-- Apply dynamic class for background -->
                <span :class="['color-tag', `color-tag-${color}`]">
                  {{ color }}
                </span>
              </label>
            </span>
          </div>
        </template>
      </FormGroup>


      <!-- 6. Range Input -->
      <FormGroup>
        <!-- Use label slot for custom content including value display -->
        <template #label>
          <span>Importance Level: <strong>{{ rangeValue }}%</strong></span>
        </template>
        <template #default="{ inputId }">
          <input :id="inputId" type="range" v-model="rangeValue" min="0" max="100" step="1" />
        </template>
      </FormGroup>

      <!-- 7. Textarea -->
      <FormGroup label="Description">
        <template #default="{ inputId }">
          <textarea :id="inputId" v-model="description" rows="4" placeholder="Add more details..."></textarea>
        </template>
      </FormGroup>

      <!-- Simple Checkbox (might not strictly need FormGroup, but can be wrapped) -->
      <FormGroup>
        <template #default="{ inputId }">
          <div style="display: flex; align-items: center; padding: 0.5rem 0;">
            <input type="checkbox" :id="inputId" v-model="agree"
              style="margin-right: 0.5rem; width: auto; height: auto;">
            <label :for="inputId"
              style="margin-bottom: 0; text-transform: none; color: var(--color-text-primary); font-size: 0.9rem;">
              I agree to the terms and conditions
            </label>
          </div>
        </template>
      </FormGroup>


      <!-- 8. Main Action Buttons -->
      <FormGroup>
        <template #actions>
          <button type="submit" class="form-button form-button-primary">Save Settings</button>
          <button type="reset" class="form-button form-button-secondary">Reset</button>
        </template>
      </FormGroup>
    </form>
  </div>
</template>

<style scoped>
/* Basic layout for the example page */
body {
  background-color: #333;
  /* Darker background for context */
  color: #e0e0e0;
  font-family: sans-serif;
  padding: 2rem;
}

.form-container {
  max-width: 600px;
  margin: 0 auto;
  background-color: var(--color-background-dark);
  /* Use variable from module */
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.4);
}

h1 {
  color: var(--color-accent);
  /* Use variable */
  margin-bottom: 1.5rem;
  text-align: center;
}

/* Ensure icons passed to slots are styled appropriately if using a library */
/* Example for FontAwesome */
/* .prefix svg, .postfix svg {
    width: 1em;
    height: 1em;
    display: block;
} */

/* Ensure CSS variables defined in the module are available globally
   if needed outside the component scope (like in this App.vue style),
   or redefine them here. Using :root in the module makes them global. */
</style>