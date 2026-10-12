<script setup>

const props = defineProps({
    text: {
        type: String,
        default: "Voting is not yet open, check back on October 13, when Planet Zoo 2 launches",
  },
  title: {
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
        <h2>{{ title }}</h2>
        <p class="description">{{ text }}<a class="big-link" v-if="link" :href="link">{{ linkText }}</a></p>

    </div>
</template>

<style>
.no-votes-message {
    text-align: center;
    height: 100%;
    vertical-align: middle;
    margin-block: var(--spacing-10);

    & h2 {
        font-size: var(--type-14);
        line-height: var(--spacing-12);
        font-family: var(--font-eagle-bold);
        text-align: center;
        color: var(--BearsPaw)
    }
}
.description {
    text-align: center;
    width: 100%;
    font-size: var(--type-05);
    line-height: var(--spacing-07);
    max-width: unset;
}
.big-link {
}

</style>
