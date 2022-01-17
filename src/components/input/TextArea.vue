<template>
    <div>
        <div :class="'container'">
            <div id="backdrop" :class="'backdrop'">
                <div id="highlights" :class="'highlights'"></div>
            </div>
            <textarea
                    v-model="input"
                    id="textarea"
                    :spellcheck="false"
                    :maxlength="140"
                    :placeholder="'Diagnosis...'"
                    @input="onInput($event.target.value)"
                    @keydown="onKeydown"
                    @scroll="onScroll()">
            </textarea>
        </div>
        <div :class="'autocomplete-wrapper'">
            <auto-complete
                        :options="options"
                        @select="select">
            </auto-complete>
        </div>
    </div>
</template>

<script>
// 1) Handle highlining
// 2) Handle autocomplete options and keyboard accesibility (with scroll)
// 3) Get all hashtags coordinates
// 4) Get active hashtag tracking cursor position (keydown return key temporary disabled) (bug on cursor tracking when jumping from lines using arrows up/down)
// 5) Handle selected hashtag replacement

import AutoComplete from './AutoComplete'
import autocomplete from '@/mixins/autocomplete'
import browser      from '@/mixins/browser'
import keycodes     from '@/utils/keycodes'
import {
    normalize,
    replaceAtTo
} from '@/utils/functions'

export default {
    name: 'TextArea',
    components: {
        AutoComplete
    },
    mixins: [
        autocomplete,
        browser
    ],
    props: {
        tags: Array
    },
    data () {
        return {
            input: '',
            dom: {
                backdrop: null,
                highlights: null,
                textarea: null,
                autocomplete: null
            },
            focus: -1,
            cursor: 0
        }
    },
    mounted () {
        Object.keys(this.dom).forEach(value => this.dom[value] = document.getElementById(value))
        this.dom.textarea.addEventListener('click', () => {
            this.onInput(this.input, false)
        })
    },
    watch: {
        focus(value) {
            if (value > -1 && this.totalOptions > 0) {
                this.setActive(this.dom.autocomplete.getElementsByTagName('div'), this.focus)
            }
        },
        isActiveHashtag(value) {
            if (value) {
                this.$nextTick(() => this.focus = 0) // wait for DOM to be rendered...
            } else {
                this.focus = -1
            }
        },
        totalOptions(value) {
            if (value > 0 && this.focus === -1) this.$nextTick(() => this.focus = 0)
        }
    },
    computed: {
        getHashtags () {
            const hashtags = this.input.match(/\B(#[a-zA-Z0-9_]+\b)/g)
            if (hashtags) {
                return hashtags.map((hash, index, arr) => {
                    const offset = index === 0 ? 0 : this.input.indexOf(arr[index - 1]) + arr[index - 1].length
                    return {
                        position: index,
                        value: hash,
                        offset: offset,
                        cursor_start: this.input.indexOf(hash, offset),
                        cursor_end: this.input.indexOf(hash, offset) + hash.length
                    }
                })
            } else {
                return []
            }
        },
        getActiveHashtag() {
            return this.getHashtags.find(item => this.cursor > item.cursor_start && this.cursor <= item.cursor_end)
        },
        isActiveHashtag() {
            return this.getActiveHashtag !== undefined
        },
        options() {
            return this.isActiveHashtag
                ?
                    this.tags.filter(item => normalize(item).includes(normalize(this.getActiveHashtag.value)))
                :
                    []
        },
        totalOptions() {
            return this.options.length
        }
    },
    methods: {
        onInput(text, isCursor = true) {
            this.handleHighlights(text)
            this.handleFocus()
            this.handleCursor(isCursor)
        },
        onKeydown(e) {
            const key = e.which || e.keyCode
            this.handleKeyDown(key, e)
        },
        onScroll() {
            this.dom.backdrop.scrollTop = this.dom.textarea.scrollTop
            this.dom.backdrop.scrollLeft = this.dom.textarea.scrollLeft
        },
        handleFocus() {
            if (this.isActiveHashtag) {
                if (this.focus >= this.totalOptions) this.focus = this.totalOptions - 1
            } else {
                this.focus = -1
            }
        },
        handleCursor(isCursor) {
            if (isCursor) this.cursor = this.dom.textarea.selectionStart
        },
        handleHighlights(text) {
            this.dom.highlights.innerHTML = this.applyHighlights(text)
        },
        handleKeyDown(key, e) {
            switch (key) {    
                
                case keycodes['DOWN']:
                    if (this.totalOptions > 0) {
                        this.focus++
                        if (this.focus >= this.totalOptions) this.focus = 0
                    }
                    break

                case keycodes['UP']:
                    this.focus--
                    if (this.focus < 0) this.focus = this.totalOptions - 1
                    break

                case keycodes['RETURN']:
                    e.preventDefault()
                    if (this.focus > -1) {
                        this.dom.autocomplete.getElementsByTagName('div')[this.focus].click()
                    }
                    break

                case keycodes['LEFT']:
                    this.cursor--
                    if (this.cursor <= 0) this.cursor = 0
                    break

                case keycodes['RIGHT']:
                    this.cursor++
                    if (this.cursor >= this.input.length) this.cursor = this.input.length
                    break

            }
        },
        applyHighlights(text) {
            text = text
                .replace(/\n$/g, '\n\n')
                .replace(/\B(#[a-zA-Z0-9_]+\b)/g, '<span>$&</span>')
            
            if (this.browser.isIE) {
                text = text.replace(/ /g, ' <wbr>') // IE wraps whitespace differently in a div vs textarea, this fixes it
            }
            
            return text
        },
        select(value) {
            let aux = replaceAtTo(this.input, this.getActiveHashtag.cursor_start, this.getActiveHashtag.cursor_end, value)
            aux = `${aux} `
            this.input = aux
            this.cursor = aux.length
            this.dom.textarea.focus()
            this.dom.textarea.click()
        }
    }
}
</script>

<style scoped>
    *, *::before, *::after {
        box-sizing: border-box;
    }

    .container {
        position: relative;
        margin: 0 auto;
        -webkit-text-size-adjust: none;
    }

    .container, .backdrop, textarea {
        width: 460px;
        height: 140px;
    }

    .backdrop, textarea {
        border: 2px solid  #74637f;
        background-color: transparent;
    }

    .backdrop {
        z-index: 1;
        position: absolute;
        overflow: auto;
        pointer-events: none;
    }

    textarea {
        z-index: 2;
        display: block;
        position: absolute;
        overflow: auto;
        resize: none;
        margin: 0;
        border-radius: 0;
        color: inherit;
        caret-color: black;
        color: transparent;
    }

    textarea, .highlights {
        font-family: inherit;
        font-size: 18px;
        letter-spacing: 1px;
        line-height: 140%;
        padding: 10px;
    }

    .highlights {
        white-space: pre-wrap;
        word-wrap: break-word;
        color: inherit;
    }

    /deep/ .highlights span {
        border-radius: 3px;
        color: #1DA1F2;
        background-color: transparent;
    }

    textarea:focus {
        outline: none;
        box-shadow: 0 0 0 2px #c6aada;
    }

    .autocomplete-wrapper {
        width: 460px;
        margin: 0 auto;
    }
</style>
