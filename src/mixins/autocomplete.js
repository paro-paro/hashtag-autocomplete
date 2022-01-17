export default {
    methods: {
        setActive(elements, idx) {
            this.removeActive(elements)
            const el = elements[idx]
            el.classList.add('option-active')
            this.handleScroll(el)
        },
        removeActive(elements) {
            for (let i = 0; i < elements.length; i++) {
                elements[i].classList.remove('option-active')
            }
        },
        handleScroll(el) {
            const div = this.dom.autocomplete
            if (div.scrollHeight > div.clientHeight) {
                const scrollBottom = div.clientHeight + div.scrollTop
                const elBottom = el.offsetTop + el.offsetHeight

                if (elBottom > scrollBottom) {
                    div.scrollTop = elBottom - div.clientHeight
                } else if (el.offsetTop < div.scrollTop) {
                    div.scrollTop = el.offsetTop
                }
            }
        }
    }
}
