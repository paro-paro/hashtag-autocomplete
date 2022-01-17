<template>
    <div id="autocomplete" :class="isOptions ? 'autocomplete autocomplete-border' : 'autocomplete'">
        <div
            v-for="opt, idx in options"
            :key="idx"
            :class="'option'"
            @click="$emit('select', opt)">{{ opt }}
        </div>
    </div>
</template>

<script>
export default {
    name: 'AutoComplete',
    props: {
        options: Array
    },
    computed: {
        isOptions () {
            return this.options.length > 0
        }
    }
}
</script>

<style scoped>
    .autocomplete {
        margin-top: .5rem;
        position: relative;
        padding: 0;
        width: 200px;
        height: auto;
        max-height: 105px; /* set to 105px to check the scrolling logic (#c). Proper value 205px */
        overflow-y: auto;
        display: flex;
        flex-direction: column;
    }

    .autocomplete-border {
        border: 1px solid #74637f;
    }

    .option {
        padding: 8px 8px;
        cursor: pointer;
    }

    .option-active {
        color: #1DA1F2;
        background-color: #F7F4F4;
    }

    .option:hover {
        color: #1DA1F2;
        background-color: #F7F4F4;
    }
</style>
