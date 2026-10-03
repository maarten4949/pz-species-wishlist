<script setup>
const animalCount = defineModel('animalCount')
const totalVotes = defineModel('totalVotes')
</script>

<template>
    <div class="metadata-container">
        <span class="animal-count">{{animalCount}} animals</span>
        <span class="total-votes">{{totalVotes}} votes</span>
    </div>
</template>
<style>
.animal-count, .total-votes {
    font-size: var(--type-01);
    color: var(--text-soft);
    line-height: var(--spacing-05);
}
.metadata-container{
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    margin-bottom: var(--spacing-03);
}
</style>
