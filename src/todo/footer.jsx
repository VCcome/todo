import '../assert/scss/footer.scss'

export default {
  data() {
    return {
      author: 'VC'
    }
  },
  render() {
    return (
      <div id="footer">
        <span>Written by {this.author}</span>
      </div>
    )
  }
}