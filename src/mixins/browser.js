export default {
    data () {
        return {
            browser: {
                isIE: null,
                isIOS: null
            }
        }
    },
    mounted () {
        this.handleCrossBrowser()
    },
    methods: {
        handleCrossBrowser() {
            const ua = window.navigator.userAgent.toLowerCase()
            this.browser.isIE = !!ua.match(/msie|trident\/7|edge/)
            this.browser.isIOS = !(ua.indexOf('windows phone') !== -1) && !!ua.match(/ipad|iphone|ipod/)

            if (this.browser.isIOS) {
                this.fixIOS()
            }
        },
        fixIOS() {
            this.dom.highlights.style.paddingLeft = '13px' // iOS adds 3px of unremovable padding to the left and right of a textarea, so adjust highlights div to match
            this.dom.highlights.style.paddingRight = '13px'
        }
    }
}
