<script setup>
</script>


<template>
<div class="group">
<slot></slot>
</div>
</template>


<style>
.group {
    margin-top: var(--spacing-04);
    margin-bottom: var(--spacing-02);
    display: flex;
    align-items: flex-end;
    flex-wrap: wrap;
    gap: var(--spacing-05);
    & .page-controls {
        width: fit-content;
    }
    & .big {
        font-size: var(--type-04);
        padding: var(--spacing-04) var(--spacing-05);
    }
}
</style>
