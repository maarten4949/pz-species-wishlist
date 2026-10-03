<script setup>
import { computed, onMounted } from 'vue'
const animalCount = defineModel('animalCount', { default: 0 })
const currentPage = defineModel('currentPage', { default: 1 })
const pageSize = defineModel('pageSize', { default: 10 })
const isHydrated = defineModel('isHydrated', { default: false })

onMounted(async () => {
isHydrated.value = true
})
const totalPages = computed(() => {
  if (!pageSize.value || pageSize <= 0) return 1
  return Math.max(1, Math.ceil(animalCount.value / pageSize.value))
})
const scrollToTop = () => {
  if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
}
function GoPageBack() {
  if (currentPage.value > 1) {
    currentPage.value -= 1;
    scrollToTop()
  }
}
function GoPageForward() {
  if (currentPage.value < totalPages.value) {
    currentPage.value +=1;
    scrollToTop()
  }
}
const isBackButtonDisabled = computed(() => {
  if (!isHydrated.value) return false
  return currentPage.value === 1
})
const isForwardButtonDisabled = computed(() => {
  if (!isHydrated.value) return false
  if (animalCount.value === 0) return true
  return currentPage.value >= totalPages.value
})
</script>

<template>
<div class="page-controls">
    <button
        :disabled="isBackButtonDisabled"
        class ="page-control"
        @click="GoPageBack">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-left preview-icon"><path d="m15 18-6-6 6-6"/></svg>
    </button>
    <span class="page-number">{{currentPage}}</span>
    <button
        :disabled="isForwardButtonDisabled"
        class="page-control"
        @click="GoPageForward">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-right preview-icon"><path d="m9 18 6-6-6-6"/></svg>
    </button>
</div>
</template>

<style>
.page-controls {
    display:flex;
    align-items: center;
    margin-left: auto;
    width: 100%;
    justify-content: flex-end;
    gap: var(--spacing-04);
    & .page-control {
        background-color: var(--bg-2);
        border: none;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: var(--spacing-04);
        border-radius: var(--radii-m);
        &:disabled {
            opacity: 50%;
        }
        & svg {
            stroke-width: 3px;
            color: var(--text-normal);
        }
    }
    & .page-number {
        min-width: var(--spacing-06);
        text-align:center;
        font-family: var(--font-eagle-bold);
        font-size: var(--type-08);
        color: var(--text-soft)
    }
}
</style>
