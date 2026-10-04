<script setup>

const props = defineProps({
    text: {
        type: String,
        default: "Voting is not yet open, check back on October 13, when Planet Zoo 2 launches",
  },
  link: {
      type: String,
      default: "",
  },
  linkText: {
      type: String,
      default: "Vote Here",
  },
});
</script>
<template>
    <div class="no-votes-message">
    <h2>{{ text }}</h2>
        <a v-if="link" :href="link">{{ linkText }}</a>
    </div>
</template>

<style>
.no-votes-message {
    text-align: center;
    height: 100%;
    vertical-align: middle;
    margin-block: var(--spacing-10);
}</style>
