<template>
    <div :class="'row'">
        <h4>Hashtag autocomplete</h4>
        <text-area :tags="tags_"></text-area>
    </div>
</template>

<script>
import TextArea    from './input/TextArea'
import { sortAsc } from '@/utils/functions'

export default {
    name: 'TestCmr',
    components: {
        TextArea
    },
    data () {
        return {
            tags: [
                'liver',
                'pain',
                'right',
                'left',
                'pancreas',
                'kidney',
                'brain',
                'severe_pain',
                'tumour',
                'cancer',
                'MRI',
                'CT',
                'male',
                'female',
                'bone',
                'shoulder',
                'hip',
                'XRAY',
                'knee',
                'spine',
                'head',
                'abdomen',
                'contrast',
                'fragment',
                'detached',
                'injury',
                'torn',
                'rotator',
                'cuff',
                'abdominal',
                'dilatation'
            ]
        }
    },
    computed: {
        tags_ () {
            return [...this.tags].sort(sortAsc).map(item => `#${item}`)
        }
    }
}
</script>

<style scoped>
    h4 {
        text-align: center;
    }
    .row {
        display: flex;
        flex-direction: column;
        justify-content: center;
    }
</style>
