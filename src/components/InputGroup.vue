<template>
<div class="input-group">
    <slot></slot>
</div>
</template>

<style>
.input-group {
    flex-grow: 1;
    display: flex;
    flex-direction: column;

    & label {
        font-size: var(--type-02);
        line-height: var(--spacing-06);
    }
}
</style>
