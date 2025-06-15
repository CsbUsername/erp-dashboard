export default {
  mounted(el) {
    const blocks = el.querySelectorAll('pre code')
    blocks.forEach(block => {
      window.hljs.highlightElement(block)
    })
  }
}
