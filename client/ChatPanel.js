import React from 'react';

class ChatPanel extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      draftMessage: ''
    }
  }

  // TODO: scrolling messages, displaying username
  render() {
    const { messages, sendMessage } = this.props
    return(
      <div>
        <div className='messages'>
          { messages.map((m, i) => (<div key={i}>{m}</div>)) }
        </div>
        <form action='' onSubmit={(e) => {
          e.preventDefault()
          if (this.state.draftMessage !== '') {
            sendMessage(this.state.draftMessage)
          }
          this.setState({draftMessage: ''})
          return false
        }}>
        <input onChange={(e) => { this.setState({draftMessage: e.target.value }) }} value={this.state.draftMessage} />
        <button>Send</button>
      </form>
    </div>
    )
  }
}

export default ChatPanel
