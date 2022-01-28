<template>
    <div id="app">
        <hashtag-input></hashtag-input>
    </div>
</template>

<script>
// code exercise:
// Write a #tag function and implement it in an input text area or other object managing text. The resulting field should:
// 1. lookup and suggest #tags from a predefined list while typing
// 2. format the tags in a different style/color
// 3. format also new tags not existing in the list

// Solution:
// Rich Text Editing with React => https://www.youtube.com/watch?v=feUYwoLhE_4
// Seems like there is nothing quite like Draft.js for vue users...

// At first, I tried the vue-highlights library... but I discarded it since it didnt solve the whole problem
// and because we will eventually want a fully controlled component with perfect functionality...

// So... 2 mains approaches:
    // textarea + backdrop div => implemented 
    // contenteditable div

import HashtagInput from './components/HashtagInput'

export default {
    name: 'App',
    components: {
        HashtagInput
    }
}
</script>

<style>
    html, body {
        font-family: roboto, sans-serif;
        color: #444;
        margin: 0;
        padding: 0;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
    }

    #app {
        padding: 70px 2rem;
    }
</style>
