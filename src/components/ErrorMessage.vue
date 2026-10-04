<script setup>
const props = defineProps({
    message: String,
});
</script>

<template>
    <div class="error-message">{{ props.message }}</div>
</template>


<style>
.error-message {
    color: red;
    font-weight: bold;

}
</style>
