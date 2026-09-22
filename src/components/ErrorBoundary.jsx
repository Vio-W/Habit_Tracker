import { Component } from 'react'

// Class component because React only supports error boundaries via
// getDerivedStateFromError / componentDidCatch — there's no hook
// equivalent (yet). This one is generic: pass a `label` for the
// fallback message and it can wrap any section of the app.
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, info) {
    console.error(`[ErrorBoundary${this.props.label ? `: ${this.props.label}` : ''}]`, error, info)
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            border: '1px solid #f3c2c2',
            background: '#fff5f5',
            borderRadius: 8,
            padding: '1rem',
            color: '#a33',
          }}
        >
          <p style={{ margin: 0, fontWeight: 'bold' }}>
            {this.props.label ? `${this.props.label} crashed.` : 'Something went wrong.'}
          </p>
          <p style={{ margin: '0.25rem 0 0.75rem', fontSize: 13 }}>
            {this.state.error?.message ?? 'An unexpected error occurred.'}
          </p>
          <button onClick={this.handleRetry}>Try again</button>
        </div>
      )
    }

    return this.props.children
  }
}