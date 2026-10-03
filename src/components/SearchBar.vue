<script setup>
import InputGroup from './InputGroup.vue';
const searchInput = defineModel({ default: "" });
</script>
<template>
    <InputGroup>
        <label for="search">Search:</label>
        <input aria-label="Search" id="search" name="search" type="text" v-model="searchInput" placeholder="Search an animal" class="input-field big">
    </InputGroup>
</template>

<style>
.input-field {
    color: var(--text-dark);
    flex-grow: 1;
    outline: solid transparent 2px;
    border: none;
    border-radius: var(--radii-m);
    padding: var(--spacing-03) var(--spacing-04);
    background-color: var(--bg-2);
    font-size: var(--type-03);
    transition: 0.2s outline ease-in-out;
}
.input-field::placeholder {
    color: var(--text-soft-inverted);
}</style>
